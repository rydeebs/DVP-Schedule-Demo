// App root — wires state, drag-and-drop, undo, tweaks integration

const { useState: aUseState, useEffect: aUseEffect, useMemo: aUseMemo, useCallback: aUseCallback, useRef: aUseRef } = React;

const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
};
const addDays = (d, days) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};
const addMonths = (d, months) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(1);
  x.setMonth(x.getMonth() + months);
  return x;
};
const startOfMonth = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(1);
  return x;
};
const endOfMonth = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setMonth(x.getMonth() + 1);
  x.setDate(0);
  return x;
};
const dateRangeLabel = (start, end) => `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
const monthLabel = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

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
  const [weekSchedule, setWeekSchedule] = aUseState(D.WEEK_SCHEDULE);
  const [bench, setBench] = aUseState(D.BENCH);
  const [date, setDate] = aUseState(new Date(2026, 4, 26)); // May 26 2026
  const [calendarMode, setCalendarMode] = aUseState("today");
  const [view, setView] = aUseState("BOARD");
  const [query, setQuery] = aUseState("");
  const [jobStatusFilter, setJobStatusFilter] = aUseState("current");
  const [priorityFilter, setPriorityFilter] = aUseState("all");
  const [crewFilterIds, setCrewFilterIds] = aUseState([]);
  const [filtersOpen, setFiltersOpen] = aUseState(false);
  const [crewDepartmentView, setCrewDepartmentView] = aUseState("regional");
  const [draggingId, setDraggingId] = aUseState(null);
  const [dropTargetId, setDropTargetId] = aUseState(null);
  const [assigningLaneId, setAssigningLaneId] = aUseState(null);
  const [snapJobId, setSnapJobId] = aUseState(null);
  const [toast, setToast] = aUseState(null);
  const [selectedJobId, setSelectedJobId] = aUseState(null);
  const [selectedWorkerId, setSelectedWorkerId] = aUseState(null);
  const [selectedCrewId, setSelectedCrewId] = aUseState(null);
  const [addJobCrewId, setAddJobCrewId] = aUseState(null);
  const [addBenchOpen, setAddBenchOpen] = aUseState(false);
  const [notifyOpen, setNotifyOpen] = aUseState(false);
  const [commandOpen, setCommandOpen] = aUseState(false);
  const [commandQuery, setCommandQuery] = aUseState("");
  const toastTimerRef = aUseRef(null);
  const undoStackRef = aUseRef([]);
  const jobsRef = aUseRef(jobs);
  const weekScheduleRef = aUseRef(weekSchedule);

  aUseEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);
  aUseEffect(() => {
    weekScheduleRef.current = weekSchedule;
  }, [weekSchedule]);

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
  const selectedWorker = aUseMemo(() => {
    if (!selectedWorkerId) return null;
    const benchWorker = bench.find((w) => w.workerId === selectedWorkerId);
    if (benchWorker) {
      return {
        id: benchWorker.workerId,
        name: benchWorker.name,
        role: benchWorker.role,
        init: benchWorker.init,
        cert: [],
        source: "bench",
        state: benchWorker.state,
        note: benchWorker.note,
      };
    }
    const crew = crews.find((c) => c.workerIds.includes(selectedWorkerId)) || null;
    const base = D.lookup(selectedWorkerId);
    if (!base && !crew) return null;
    return {
      ...(base || { id: selectedWorkerId, name: "Unknown worker", role: "laborer", init: "?", cert: [] }),
      source: "crew",
      state: "assigned",
      crewId: crew?.id || null,
      crewName: crew?.name || null,
    };
  }, [selectedWorkerId, crews, bench, D]);
  const filterState = aUseMemo(() => ({
    status: jobStatusFilter,
    priority: priorityFilter,
    crewIds: crewFilterIds,
  }), [jobStatusFilter, priorityFilter, crewFilterIds]);
  const filterCounts = aUseMemo(() => ({
    current: jobs.length,
    filled: jobs.filter(j => !!j.crew).length,
    unassigned: jobs.filter(j => !j.crew).length,
    active: [jobStatusFilter !== "current", priorityFilter !== "all", crewFilterIds.length > 0].filter(Boolean).length,
  }), [jobs, jobStatusFilter, priorityFilter, crewFilterIds]);
  const selectedCrewLabel = aUseMemo(() => {
    if (crewFilterIds.length === 0) return "All crews";
    if (crewFilterIds.length === 1) return crews.find((crew) => crew.id === crewFilterIds[0])?.name || "1 crew";
    return `${crewFilterIds.length} crews selected`;
  }, [crews, crewFilterIds]);
  const deptLabels = {
    regional: "All crews",
    excavation: "Excavation crews",
    paving: "Paving crews",
    concrete: "Concrete crews",
    milling: "Milling crews",
    field: "Field Ops crews",
    striping: "Striping crews",
    subcontractor: "Subcontractor view",
  };
  const visiblePoolJobs = aUseMemo(() => {
    return jobs.filter(j => {
      if (jobStatusFilter === "filled" && !j.crew) return false;
      if (jobStatusFilter === "unassigned" && j.crew) return false;
      if (priorityFilter !== "all" && j.priority !== priorityFilter) return false;
      if (crewFilterIds.length > 0) {
        const crew = j.crew ? crews.find(c => c.id === j.crew) : null;
        if (!crew || !crewFilterIds.includes(crew.id)) return false;
      }
      return true;
    });
  }, [jobs, crews, jobStatusFilter, priorityFilter, crewFilterIds]);
  const visibleBoardCrews = aUseMemo(() => {
    if (crewFilterIds.length === 0) return crews;
    return crews.filter((crew) => crewFilterIds.includes(crew.id));
  }, [crews, crewFilterIds]);
  const weekStart = aUseMemo(() => startOfWeek(date), [date]);
  const weekEnd = aUseMemo(() => addDays(weekStart, 6), [weekStart]);
  const monthStart = aUseMemo(() => startOfMonth(date), [date]);
  const monthEnd = aUseMemo(() => endOfMonth(date), [date]);
  const exactDateLabel = aUseMemo(() => date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }), [date]);
  const monthGridDays = aUseMemo(() => {
    const first = startOfWeek(monthStart);
    const last = addDays(startOfWeek(monthEnd), 6);
    const cells = [];
    for (let cursor = new Date(first); cursor <= last; cursor = addDays(cursor, 1)) {
      cells.push(new Date(cursor));
    }
    return cells;
  }, [monthStart, monthEnd]);
  const weekDays = aUseMemo(() => {
    const base = window.DATA?.WEEK_DAYS || [];
    return base.map((day, idx) => {
      const current = addDays(weekStart, idx);
      return {
        ...day,
        idx,
        key: current.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        date: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: current,
      };
    });
  }, [weekStart]);
  const calendarDisplayLabel = aUseMemo(() => {
    if (calendarMode === "month") return monthLabel(date);
    if (calendarMode === "week") return dateRangeLabel(weekStart, weekEnd);
    return exactDateLabel;
  }, [calendarMode, date, exactDateLabel, weekStart, weekEnd]);
  const crewCalendarHeaderLabel = aUseMemo(() => {
    if (calendarMode === "month") return `MONTH VIEW · ${monthLabel(date)}`;
    if (calendarMode === "week") return `WEEK VIEW · ${dateRangeLabel(weekStart, weekEnd)}`;
    return `DAY VIEW · ${exactDateLabel}`;
  }, [calendarMode, date, exactDateLabel, weekStart, weekEnd]);

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
  const escapeHtml = aUseCallback((value) => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[ch])), []);

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
        setNotifyOpen(false);
        setSelectedCrewId(null);
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

  const moveJobInSchedule = aUseCallback((schedule, job, crewId, dayIdx = 2) => {
    const next = {};
    const occurrences = [];
    Object.entries(schedule || {}).forEach(([schedCrewId, days]) => {
      next[schedCrewId] = {};
      Object.entries(days || {}).forEach(([dayKey, items]) => {
        const filtered = [];
        (items || []).forEach(item => {
          if (item.jobId === job.id) {
            occurrences.push({ dayKey, item });
          } else {
            filtered.push(item);
          }
        });
        if (filtered.length) next[schedCrewId][dayKey] = filtered;
      });
    });
    if (crewId) {
      next[crewId] = next[crewId] || {};
      const itemsToMove = occurrences.length
        ? occurrences
        : [{
            dayKey: String(dayIdx),
            item: {
              jobId: job.id,
              hours: job.hours || 8,
              night: !!job.note?.toLowerCase().includes("night"),
            },
          }];
      itemsToMove.forEach(({ dayKey, item }) => {
        const existing = next[crewId][dayKey] || [];
        next[crewId][dayKey] = [...existing, { ...item, jobId: job.id }];
      });
    }
    return next;
  }, []);

  const assignJob = aUseCallback((jobId, crewId, dayIdx = 2) => {
    const normalizedCrewId = crewId || null;
    const movedJob = jobsRef.current.find(j => j.id === jobId);
    if (!movedJob || movedJob.crew === normalizedCrewId) return;
    const prevCrew = movedJob.crew || null;
    const prevSchedule = weekScheduleRef.current;
    const nextSchedule = moveJobInSchedule(prevSchedule, movedJob, normalizedCrewId, dayIdx);

    jobsRef.current = jobsRef.current.map(j => j.id === jobId ? { ...j, crew: normalizedCrewId } : j);
    weekScheduleRef.current = nextSchedule;
    setJobs((prev) => {
      const job = prev.find(j => j.id === jobId);
      if (!job || job.crew === normalizedCrewId) return prev;
      return prev.map(j => j.id === jobId ? { ...j, crew: normalizedCrewId } : j);
    });
    setWeekSchedule(nextSchedule);

    setAssigningLaneId(normalizedCrewId || "unassigned");
    setSnapJobId(jobId);
    setDropTargetId(null);
    window.setTimeout(() => setAssigningLaneId(null), 360);
    window.setTimeout(() => setSnapJobId(null), 240);

    const crewName = normalizedCrewId ? (crews.find(c => c.id === normalizedCrewId)?.name || "crew") : "Unassigned";
    const msg = `<span class="num">${movedJob.code}</span> · ${movedJob.name.length > 36 ? movedJob.name.slice(0,36)+"..." : movedJob.name} -> <strong>${crewName}</strong>`;
    showToast(msg, () => {
      jobsRef.current = jobsRef.current.map(j => j.id === jobId ? { ...j, crew: prevCrew } : j);
      weekScheduleRef.current = prevSchedule;
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, crew: prevCrew } : j));
      setWeekSchedule(prevSchedule);
      setAssigningLaneId(prevCrew || "unassigned");
      setSnapJobId(jobId);
      window.setTimeout(() => setAssigningLaneId(null), 360);
      window.setTimeout(() => setSnapJobId(null), 240);
    });
  }, [crews, moveJobInSchedule, showToast]);

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

  const sendCrewNotification = aUseCallback((form) => {
    const visibleCrews = crewDepartmentView === "regional"
      ? crews
      : crews.filter((c) => {
        const div = (c.division || "").toLowerCase();
        if (crewDepartmentView === "excavation") return div.includes("excav");
        if (crewDepartmentView === "paving") return div.includes("paving");
        if (crewDepartmentView === "concrete") return div.includes("concrete");
        if (crewDepartmentView === "milling") return div.includes("milling");
        if (crewDepartmentView === "field") return div.includes("field ops");
        if (crewDepartmentView === "striping") return div.includes("striping");
        if (crewDepartmentView === "subcontractor") return false;
        return true;
      });
    const activeCrews = crews.filter((c) => (jobsByCrew[c.id] || []).length > 0);
    const selectedCrew = crews.find((c) => c.id === form.crewId) || null;
    const recipients = form.audience === "all"
      ? crews
      : form.audience === "active"
      ? activeCrews
      : form.audience === "crew"
      ? (selectedCrew ? [selectedCrew] : [])
      : visibleCrews;
    const targetLabel = form.audience === "all"
      ? "all crews"
      : form.audience === "active"
      ? "active crews"
      : form.audience === "crew"
      ? (selectedCrew?.name || "selected crew")
      : (crewDepartmentView === "regional" ? "visible crews" : (deptLabels[crewDepartmentView] || "visible crews"));

    if (!recipients.length) {
      showToast(`No crews matched this notification target`);
      return;
    }

    const typeLabel = {
      "schedule-update": "Schedule update",
      "start-time-change": "Start time change",
      "dispatch-request": "Dispatch request",
      "safety-alert": "Safety alert",
      "weather-delay": "Weather delay",
      custom: "Custom message",
    }[form.type] || "Notification";
    const message = form.message.trim();
    const preview = message ? escapeHtml(message.length > 92 ? `${message.slice(0, 92)}…` : message) : "No message text";

    showToast(
      `<strong>${recipients.length}</strong> crew${recipients.length === 1 ? "" : "s"} queued · ${typeLabel} · <strong>${escapeHtml(targetLabel)}</strong><br><span class="num">${preview}</span>`
    );
    setNotifyOpen(false);
  }, [crewDepartmentView, crews, deptLabels, escapeHtml, jobsByCrew, showToast]);

  const onDateNudge = (dir) => {
    if (typeof dir === "string") {
      const [year, month, day] = dir.split("-").map(Number);
      if (year && month && day) setDate(new Date(year, month - 1, day));
      return;
    }
    if (dir === 0) {
      setDate(new Date(2026, 4, 26));
      setCalendarMode("today");
      return;
    }
    setDate((current) => {
      const next = new Date(current);
      if (calendarMode === "month") {
        next.setDate(1);
        next.setMonth(next.getMonth() + dir);
      } else if (calendarMode === "week") {
        next.setDate(next.getDate() + (dir * 7));
      } else {
        next.setDate(next.getDate() + dir);
      }
      return next;
    });
  };
  const onPickWeekDate = aUseCallback((value) => {
    if (!value) return;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return;
    setDate(new Date(year, month - 1, day));
    setCalendarMode("week");
  }, []);
  const onPickMonth = aUseCallback((value) => {
    if (!value) return;
    const [year, month] = value.split("-").map(Number);
    if (!year || !month) return;
    setDate(new Date(year, month - 1, 1));
    setCalendarMode("month");
  }, []);
  const onSelectCalendarDate = aUseCallback((value, mode = "day") => {
    if (!value) return;
    if (value instanceof Date) {
      const next = new Date(value);
      next.setHours(0, 0, 0, 0);
      setDate(next);
      setCalendarMode(mode);
      return;
    }
    const [year, month, day] = String(value).split("-").map(Number);
    if (!year || !month || !day) return;
    setDate(new Date(year, month - 1, day));
    setCalendarMode(mode);
  }, []);

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
          calendarMode={calendarMode}
          calendarLabel={calendarDisplayLabel}
          onCalendarMode={setCalendarMode}
          onPickWeekDate={onPickWeekDate}
          onPickMonth={onPickMonth}
          totals={totals}
          canUndo={!!toast?.undoFn}
          onUndo={handleUndo}
          onAddJob={openAddJob}
          onNotify={() => setNotifyOpen(v => !v)}
          crewLabel={selectedCrewLabel}
          filters={filterState}
          filterCounts={filterCounts}
          onOpenFilters={() => setFiltersOpen(v => !v)}
        />
        <FilterPopover
          open={filtersOpen}
          filters={filterState}
          counts={filterCounts}
          crews={crews}
          onClose={() => setFiltersOpen(false)}
          onChange={(patch) => {
            if (patch.status !== undefined) setJobStatusFilter(patch.status);
            if (patch.priority !== undefined) setPriorityFilter(patch.priority);
            if (patch.crewIds !== undefined) setCrewFilterIds(patch.crewIds);
          }}
          onReset={() => {
            setJobStatusFilter("current");
            setPriorityFilter("all");
            setCrewFilterIds([]);
          }}
        />
        {t.showHeroRail && view === "BOARD" && <MetricsRail totals={totals} />}

        {view === "BOARD" && (
          <div className="board" style={t.showBench ? null : { gridTemplateRows: "1fr" }}>
            <UnassignedPool
              jobs={visiblePoolJobs}
              allCount={jobs.length}
              filters={filterState}
              dragHandlers={dragHandlers}
              dropHandlers={dropHandlers}
              draggingId={draggingId}
              query={query}
              setQuery={setQuery}
              onOpenJob={(job) => setSelectedJobId(job.id)}
              isDropTarget={dropTargetId === "unassigned"}
              crews={crews}
              isAssigning={assigningLaneId === "unassigned"}
              snapJobId={snapJobId}
              onStatusFilter={setJobStatusFilter}
            />
            <div className="lanes">
              {visibleBoardCrews.map(c => (
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
              onOpenCrew={() => setSelectedCrewId(c.id)}
            />
          ))}
              <AddCrewLane onAddCrew={addCrew} />
            </div>
            {t.showBench && <BenchBar bench={bench} onAddBench={() => setAddBenchOpen(true)} onOpenWorker={(worker) => setSelectedWorkerId(worker.id)} />}
          </div>
        )}

        {view === "CREW" && (
          <window.CrewView
            crews={crews}
            jobs={jobs}
              bench={bench}
          scheduleByCrew={weekSchedule}
          weekDays={weekDays}
          monthGridDays={monthGridDays}
          date={date}
          activeDayIndex={date.getDay()}
          calendarMode={calendarMode}
          calendarHeaderLabel={crewCalendarHeaderLabel}
          crewFilterIds={crewFilterIds}
          onSelectDate={onSelectCalendarDate}
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
                  assignJob(jobId, crewId, dayIdx);
                }
                setDropTargetId(null);
                setDraggingId(null);
              },
            }}
            isDropTarget={dropTargetId}
            snapJobId={snapJobId}
            onOpenJob={(job) => setSelectedJobId(job.id)}
            onAddJob={openAddJob}
            departmentView={crewDepartmentView}
            onDepartmentViewChange={setCrewDepartmentView}
            onOpenWorker={(worker) => setSelectedWorkerId(worker.id)}
            onOpenCrew={(crewId) => setSelectedCrewId(crewId)}
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
            onOpenWorker={(worker) => setSelectedWorkerId(worker.id)}
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
          setSelectedCrewId(crewId);
          setView("BOARD");
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
      <WorkerDrawer
        worker={selectedWorker}
        crews={crews}
        bench={bench}
        jobs={jobs}
        onClose={() => setSelectedWorkerId(null)}
      />
      <CrewDetailDrawer
        crew={crews.find(c => c.id === selectedCrewId) || null}
        jobs={jobsByCrew[selectedCrewId] || []}
        workers={(crews.find(c => c.id === selectedCrewId)?.workerIds || []).map((id) => D.lookup(id)).filter(Boolean)}
        onClose={() => setSelectedCrewId(null)}
        onOpenJob={(job) => setSelectedJobId(job.id)}
      />
      <NotifyCrewsDrawer
        open={notifyOpen}
        crews={crews}
        jobs={jobs}
        departmentView={crewDepartmentView}
        onClose={() => setNotifyOpen(false)}
        onSend={sendCrewNotification}
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
            setWeekSchedule(D.WEEK_SCHEDULE);
            setBench(D.BENCH);
          }}
        />
      </window.TweaksPanel>
    </div>
  );
}

window.App = App;
