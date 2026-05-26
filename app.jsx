// App root — wires state, drag-and-drop, undo, tweaks integration

const { useState: aUseState, useEffect: aUseEffect, useMemo: aUseMemo, useCallback: aUseCallback, useRef: aUseRef } = React;

function App() {
  const D = window.DATA;

  // Tweaks
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "showHeroRail": true,
    "showBench": true,
    "highlightDropTargets": true,
    "accent": "#F08A2C"
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply accent dynamically (curated palette)
  aUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
  }, [t.accent]);

  // State
  const [crews, setCrews] = aUseState(D.INITIAL_CREWS);
  const [jobs, setJobs] = aUseState(D.ALL_JOBS);
  const [bench, setBench] = aUseState(D.BENCH);
  const [date, setDate] = aUseState(new Date(2026, 4, 26)); // May 26 2026
  const [view, setView] = aUseState("BOARD");
  const [query, setQuery] = aUseState("");
  const [draggingId, setDraggingId] = aUseState(null);
  const [dropTargetId, setDropTargetId] = aUseState(null);
  const [assigningLaneId, setAssigningLaneId] = aUseState(null);
  const [snapJobId, setSnapJobId] = aUseState(null);
  const [toast, setToast] = aUseState(null);
  const [selectedJobId, setSelectedJobId] = aUseState(null);
  const [addJobCrewId, setAddJobCrewId] = aUseState(null);
  const [addBenchOpen, setAddBenchOpen] = aUseState(false);
  const [commandOpen, setCommandOpen] = aUseState(false);
  const [commandQuery, setCommandQuery] = aUseState("");
  const toastTimerRef = aUseRef(null);
  const undoStackRef = aUseRef([]);

  // Map / Dispatch local UI
  const [mapOnly, setMapOnly] = aUseState(false);

  // Derived
  const jobsByCrew = aUseMemo(() => {
    const map = {};
    crews.forEach(c => { map[c.id] = []; });
    jobs.forEach(j => { if (j.crew && map[j.crew]) map[j.crew].push(j); });
    return map;
  }, [jobs, crews]);

  const unassigned = aUseMemo(() => jobs.filter(j => !j.crew), [jobs]);
  const selectedJob = aUseMemo(() => jobs.find(j => j.id === selectedJobId) || null, [jobs, selectedJobId]);

  const totals = aUseMemo(() => ({
    scheduled: jobs.filter(j => j.crew).length,
    unassigned: unassigned.length,
    total: D.WEEK_STATS.jobsActive,
    deltaSched: 12,
    workersOn: crews.reduce((a,c) => a + c.workerIds.length, 0),
    workersRoster: D.WEEK_STATS.workersTotal,
    bench: bench.filter(b => b.state === "available" || b.state === "shop").length,
    pto: bench.filter(b => b.state === "pto").length,
    sick: bench.filter(b => b.state === "sick").length,
    trucks: crews.reduce((a,c) => a + c.truckIds.length, 0),
    fleet: D.WEEK_STATS.fleetTotal,
    gpsActive: crews.filter(c => c.gpsActive).length,
    formsOpen: D.WEEK_STATS.formsOpen,
    formsOverdue: 4,
    notifyCount: crews.filter(c => (jobsByCrew[c.id] || []).length > 0).length,
  }), [jobs, crews, jobsByCrew, unassigned, bench, D]);

  // Toast helpers
  const showToast = aUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);

  const handleUndo = aUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);

  // Keyboard cmd+Z global undo
  aUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setSelectedJobId(null);
        setAddJobCrewId(null);
        setAddBenchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo]);

  // Drag handlers
  const dragHandlers = {
    onDragStart: (e, job) => {
      setDraggingId(job.id);
      try {
        e.dataTransfer.setData("text/plain", job.id);
        e.dataTransfer.setData("application/x-dvp-job-id", job.id);
        e.dataTransfer.effectAllowed = "move";
      } catch (_) {}
    },
    onDragEnd: () => {
      setDraggingId(null);
      setDropTargetId(null);
    },
  };

  const dropHandlers = {
    onDragOver: (e, crewId) => {
      e.preventDefault();
      const targetId = crewId || "unassigned";
      if (t.highlightDropTargets) setDropTargetId(targetId);
      try { e.dataTransfer.dropEffect = "move"; } catch (_) {}
    },
    onDragLeave: (e, crewId) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      const targetId = crewId || "unassigned";
      setDropTargetId((cur) => cur === targetId ? null : cur);
    },
    onDrop: (e, crewId) => {
      e.preventDefault();
      const jobId = e.dataTransfer.getData("application/x-dvp-job-id") || e.dataTransfer.getData("text/plain") || draggingId;
      if (!jobId) return;
      assignJob(jobId, crewId);
      setDropTargetId(null);
      setDraggingId(null);
    },
  };

  const assignJob = aUseCallback((jobId, crewId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const normalizedCrewId = crewId || null;
    const prevCrew = job.crew;
    if (prevCrew === normalizedCrewId) return;

    setJobs((prev) => prev.map(j => j.id === jobId ? { ...j, crew: normalizedCrewId } : j));
    // Trigger lock-in animation
    setAssigningLaneId(normalizedCrewId);
    setSnapJobId(jobId);
    setTimeout(() => setAssigningLaneId(null), 360);
    setTimeout(() => setSnapJobId(null), 240);

    const crewName = normalizedCrewId ? (crews.find(c => c.id === normalizedCrewId)?.name || "crew") : "Unassigned";
    const prevName = prevCrew ? (crews.find(c => c.id === prevCrew)?.name || "crew") : "Unassigned";
    const msg = `<span class="num">${job.code}</span> · ${job.name.length > 36 ? job.name.slice(0,36)+"…" : job.name} → <strong>${crewName}</strong>`;
    showToast(msg, () => {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, crew: prevCrew } : j));
    });
  }, [jobs, crews, showToast]);

  const openAddJob = aUseCallback((crewId = null) => {
    setAddJobCrewId(crewId || "");
  }, []);

  const addJob = aUseCallback((form) => {
    const typePrefix = { paving: "P", excav: "X", mill: "M", conc: "C", stripe: "S", prep: "PR", repair: "R" }[form.type] || "J";
    const id = `j-${Date.now()}`;
    const newJob = {
      id,
      code: `${typePrefix}-${String(jobs.length + 2401).padStart(4, "0")}`,
      name: form.name.trim(),
      customer: form.customer.trim(),
      location: form.location.trim(),
      type: form.type,
      hours: Number(form.hours) || 8,
      crew: form.crew || null,
      priority: form.priority || "med",
      needs: form.crew ? undefined : "Crew assignment needed",
    };
    setJobs(prev => [newJob, ...prev]);
    setAddJobCrewId(null);
    setSelectedJobId(id);
    const crewName = newJob.crew ? crews.find(c => c.id === newJob.crew)?.name : "Unassigned";
    showToast(
      `<span class="num">${newJob.code}</span> · ${newJob.name} added to <strong>${crewName || "Unassigned"}</strong>`,
      () => {
        setJobs(prev => prev.filter(j => j.id !== id));
        setSelectedJobId(null);
      }
    );
  }, [jobs.length, crews, showToast]);

  const addCrew = aUseCallback(() => {
    const id = `c-new-${Date.now()}`;
    const newCrew = {
      id,
      name: `New Crew ${crews.length + 1}`,
      division: "Field Ops",
      foremanId: crews[0]?.foremanId,
      workerIds: [],
      truckIds: [],
      equipment: [],
      gpsActive: false,
    };
    setCrews(prev => [...prev, newCrew]);
    showToast(`<strong>${newCrew.name}</strong> added to board`, () => {
      setCrews(prev => prev.filter(c => c.id !== id));
      setJobs(prev => prev.map(j => j.crew === id ? { ...j, crew: null } : j));
    });
  }, [crews, showToast]);

  const addBenchWorker = aUseCallback((form) => {
    const name = form.name.trim();
    if (!name) return;
    const id = `bench-${Date.now()}`;
    const init = name
      .replace(/[^A-Za-z\s-]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join("")
      .toUpperCase();
    const worker = {
      workerId: id,
      name,
      role: form.role,
      init,
      state: form.state,
      note: "Added from crew board",
    };
    setBench(prev => [worker, ...prev]);
    setAddBenchOpen(false);
    showToast(`<strong>${worker.name}</strong> added to bench`, () => {
      setBench(prev => prev.filter(w => w.workerId !== id));
    });
  }, [showToast]);

  const onDateNudge = (dir) => {
    if (dir === 0) {
      setDate(new Date(2026, 4, 26));
    } else {
      setDate(d => {
        const n = new Date(d);
        n.setDate(d.getDate() + dir);
        return n;
      });
    }
  };

  // Set theme on root
  aUseEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density]);

  // Accent palette swatches
  const accentSwatches = [
    "#F08A2C", // Safety Orange (default)
    "#D4B83A", // Hi-vis Yellow
    "#C84536", // Stop Red
    "#221F1B", // Asphalt
  ];

  return (
    <div className={`app`} data-collapsed={String(!!t.sidebarCollapsed)}>
      <Header
        collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark}
        onToggleDark={() => setTweak("dark", !t.dark)}
        onCommand={() => setCommandOpen(true)}
      />
      <Sidebar collapsed={t.sidebarCollapsed} />
      <main className="main app-main">
        <Subheader
          view={view} onView={setView}
          date={date} onDate={onDateNudge}
          totals={totals}
          canUndo={!!toast?.undoFn}
          onUndo={handleUndo}
          onAddJob={openAddJob}
        />
        {t.showHeroRail && view === "BOARD" && <MetricsRail totals={totals} />}

        {view === "BOARD" && (
          <div className="board" style={t.showBench ? null : { gridTemplateRows: "1fr" }}>
            <UnassignedPool
              jobs={unassigned}
              dragHandlers={dragHandlers}
              dropHandlers={dropHandlers}
              draggingId={draggingId}
              query={query}
              setQuery={setQuery}
              onOpenJob={(job) => setSelectedJobId(job.id)}
              isDropTarget={dropTargetId === "unassigned"}
            />
            <div className="lanes">
              {crews.map(c => (
                <CrewLane
                  key={c.id}
                  crew={c}
                  jobs={jobsByCrew[c.id] || []}
                  dragHandlers={dragHandlers}
                  dropHandlers={dropHandlers}
                  isDropTarget={dropTargetId === c.id}
                  isAssigning={assigningLaneId === c.id}
                  snapJobId={snapJobId}
                  onOpenJob={(job) => setSelectedJobId(job.id)}
                  onAddJob={openAddJob}
                />
              ))}
              <AddCrewLane onAddCrew={addCrew} />
            </div>
            {t.showBench && <BenchBar bench={bench} onAddBench={() => setAddBenchOpen(true)} />}
          </div>
        )}

        {view === "CREW" && (
          <window.CrewView
            crews={crews}
            scheduleByCrew={D.WEEK_SCHEDULE}
            dragHandlers={dragHandlers}
            dropHandlers={{
              onDragOver: (e, key) => { e.preventDefault(); setDropTargetId(key); },
              onDragLeave: (e, key) => {
                if (e.currentTarget.contains(e.relatedTarget)) return;
                setDropTargetId((c) => c === key ? null : c);
              },
              onDrop: (e, crewId, dayIdx) => {
                e.preventDefault();
                const jobId = e.dataTransfer.getData("application/x-dvp-job-id") || e.dataTransfer.getData("text/plain") || draggingId;
                if (jobId) {
                  assignJob(jobId, crewId);
                }
                setDropTargetId(null);
                setDraggingId(null);
              },
            }}
            isDropTarget={dropTargetId}
            snapJobId={snapJobId}
            onOpenJob={(job) => setSelectedJobId(job.id)}
            onAddJob={openAddJob}
          />
        )}

        {view === "DISPATCH" && (
          <window.DispatchView
            jobs={jobs}
            crews={crews}
            mapOnly={mapOnly}
            onToggleMap={() => setMapOnly(v => !v)}
            onAddJob={openAddJob}
            onOpenJob={(job) => setSelectedJobId(job.id)}
            onNotify={() => showToast(`<strong>${totals.notifyCount}</strong> crew dispatch notifications queued`)}
          />
        )}
      </main>

      <UndoToast toast={toast} onUndo={handleUndo} />
      <CommandPalette
        open={commandOpen}
        query={commandQuery}
        setQuery={setCommandQuery}
        jobs={jobs}
        crews={crews}
        onClose={() => setCommandOpen(false)}
        onOpenJob={(job) => setSelectedJobId(job.id)}
        onOpenCrew={(crewId) => {
          setView("BOARD");
          setDropTargetId(crewId);
          window.setTimeout(() => setDropTargetId(null), 900);
        }}
      />
      <JobFormDrawer
        open={addJobCrewId !== null}
        crews={crews}
        initialCrewId={addJobCrewId || ""}
        onClose={() => setAddJobCrewId(null)}
        onSave={addJob}
      />
      <BenchWorkerDrawer
        open={addBenchOpen}
        onClose={() => setAddBenchOpen(false)}
        onSave={addBenchWorker}
      />
      <BoardJobDrawer
        job={selectedJob}
        crews={crews}
        onClose={() => setSelectedJobId(null)}
        onAssign={assignJob}
      />

      {/* Tweaks panel */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Appearance" />
        <window.TweakToggle
          label="Dark mode"
          value={t.dark}
          onChange={(v) => setTweak("dark", v)}
        />
        <window.TweakRadio
          label="Density"
          options={[
            { value: "comfortable", label: "Comfortable" },
            { value: "compact", label: "Compact" },
          ]}
          value={t.density}
          onChange={(v) => setTweak("density", v)}
        />
        <window.TweakColor
          label="Signal accent"
          value={t.accent}
          options={accentSwatches}
          onChange={(v) => setTweak("accent", v)}
        />

        <window.TweakSection label="Layout" />
        <window.TweakToggle
          label="Collapse sidebar"
          value={t.sidebarCollapsed}
          onChange={(v) => setTweak("sidebarCollapsed", v)}
        />
        <window.TweakToggle
          label="Hero metrics rail"
          value={t.showHeroRail}
          onChange={(v) => setTweak("showHeroRail", v)}
        />
        <window.TweakToggle
          label="Bench bar"
          value={t.showBench}
          onChange={(v) => setTweak("showBench", v)}
        />

        <window.TweakSection label="Interaction" />
        <window.TweakToggle
          label="Highlight drop targets"
          value={t.highlightDropTargets}
          onChange={(v) => setTweak("highlightDropTargets", v)}
        />
        <window.TweakButton
          label="Simulate assignment"
          onClick={() => {
            const free = jobs.find(j => !j.crew);
            if (free) assignJob(free.id, "c-adam");
          }}
        />
        <window.TweakButton
          label="Reset board"
          secondary
          onClick={() => {
            setJobs(D.ALL_JOBS);
            setCrews(D.INITIAL_CREWS);
            setBench(D.BENCH);
          }}
        />
      </window.TweaksPanel>
    </div>
  );
}

window.App = App;
