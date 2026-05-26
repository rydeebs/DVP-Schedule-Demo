// Projects — root app

const { useState: prAUseState, useEffect: prAUseEffect, useMemo: prAUseMemo, useCallback: prAUseCallback, useRef: prAUseRef } = React;

function ProjectsApp() {
  const D = window.PROJ_DATA;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "accent": "#F08A2C",
    "defaultView": "KANBAN"
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  prAUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  const [projects, setProjects] = prAUseState(D.PROJECTS);
  const [view, setView] = prAUseState(t.defaultView);
  const [activeStage, setActiveStage] = prAUseState(null);
  const [query, setQuery] = prAUseState("");
  const [openId, setOpenId] = prAUseState(null);
  const [assigningStage, setAssigningStage] = prAUseState(null);
  const [snapCardId, setSnapCardId] = prAUseState(null);
  const [toast, setToast] = prAUseState(null);
  const toastTimerRef = prAUseRef(null);

  const showToast = prAUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);
  const handleUndo = prAUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);
  prAUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault(); handleUndo();
      }
      if (e.key === "Escape" && openId) { setOpenId(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo, openId]);

  // Filtered projects
  const filtered = prAUseMemo(() => {
    return projects.filter(p => {
      if (activeStage && p.stage !== activeStage) return false;
      if (query) {
        const hay = `${p.code} ${p.name} ${p.customer} ${p.city} ${p.state}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [projects, activeStage, query]);

  // Move project between stages (the demoed Kanban interaction)
  const moveProject = prAUseCallback((id, toStage) => {
    const proj = projects.find(p => p.id === id);
    if (!proj || proj.stage === toStage) return;
    const fromStage = proj.stage;
    setProjects(prev => prev.map(p => p.id === id ? { ...p, stage: toStage } : p));
    setAssigningStage(toStage);
    setSnapCardId(id);
    setTimeout(() => setAssigningStage(null), 360);
    setTimeout(() => setSnapCardId(null), 240);
    const fromLabel = D.STAGES.find(s => s.key === fromStage)?.label;
    const toLabel   = D.STAGES.find(s => s.key === toStage)?.label;
    showToast(
      `<span class="num">${proj.code}</span> · <strong>${proj.customer}</strong> moved to <strong>${toLabel}</strong>`,
      () => setProjects(prev => prev.map(p => p.id === id ? { ...p, stage: fromStage } : p))
    );
  }, [projects, showToast]);

  const openProject = openId ? projects.find(p => p.id === openId) : null;

  const views = [
    { key: "KANBAN",   lbl: "KANBAN",   ico: PrIcons.Board    },
    { key: "TABLE",    lbl: "TABLE",    ico: PrIcons.Table    },
    { key: "TIMELINE", lbl: "TIMELINE", ico: PrIcons.Timeline },
    { key: "MAP",      lbl: "MAP",      ico: PrIcons.Map      },
  ];

  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <ProjHeader
        collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark}
        onToggleDark={() => setTweak("dark", !t.dark)}
      />
      <ProjSidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Projects</span>
            <span className="date-day">
              {projects.filter(p => p.stage === "active").length} ACTIVE ·
              {" "}{projects.filter(p => p.stage === "bidding").length} BIDDING ·
              {" "}{projects.filter(p => p.stage === "lead").length} LEADS
            </span>
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="filter-chip">
            <span className="dot" style={{ background: "var(--status-ok)" }}></span> ALL SALES REPS
          </button>
          <button className="filter-chip"><Icons.Filter size={12} /> FY 2026</button>
          <button className="btn btn-secondary" style={{ height: 32 }}>
            <PrIcons.Download size={12} /> Export
          </button>
          <button className="btn btn-primary" style={{ height: 32 }}>
            <PrIcons.Plus size={14} /> New project
          </button>
        </div>

        <div className="proj">
          <PipelineHero
            projects={projects}
            activeStage={activeStage}
            setActiveStage={setActiveStage}
          />

          <div className="proj-tools">
            <div className="proj-view-toggle">
              {views.map(v => (
                <button key={v.key}
                  className={view === v.key ? "active" : ""}
                  onClick={() => setView(v.key)}>
                  <v.ico size={12} />{v.lbl}
                </button>
              ))}
            </div>
            <div className="proj-search">
              <PrIcons.Search size={12} />
              <input placeholder="Search code, customer, city…"
                value={query} onChange={(e) => setQuery(e.target.value)} />
              <span className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>⌘F</span>
            </div>
            {activeStage && (
              <button className="filter-chip" style={{ background: "var(--signal-soft)", color: "var(--signal-hover)", borderColor: "var(--signal-line)" }}
                onClick={() => setActiveStage(null)}>
                <PrIcons.X size={11} /> {D.STAGES.find(s => s.key === activeStage)?.label.toUpperCase()} ONLY
              </button>
            )}
            <div style={{ flex: 1 }}></div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--ink-2)", letterSpacing: "0.04em"
            }}>
              SHOWING {filtered.length} OF {projects.length}
            </span>
          </div>

          {view === "KANBAN" && (
            <ProjectsKanban
              projects={filtered}
              onMove={moveProject}
              onOpen={setOpenId}
              assigning={assigningStage}
              snapCardId={snapCardId}
            />
          )}
          {view === "TABLE"    && <ProjectsTable    projects={filtered} onOpen={setOpenId} />}
          {view === "TIMELINE" && <ProjectsTimeline projects={filtered} onOpen={setOpenId} />}
          {view === "MAP"      && <ProjectsMap      projects={filtered} onOpen={setOpenId} />}
        </div>
      </main>

      {openProject && <ProjectDrawer project={openProject} onClose={() => setOpenId(null)} />}

      <UndoToast toast={toast} onUndo={handleUndo} />

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Appearance" />
        <window.TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <window.TweakRadio label="Density"
          options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]}
          value={t.density} onChange={(v) => setTweak("density", v)} />
        <window.TweakColor label="Signal accent"
          value={t.accent}
          options={["#F08A2C", "#D4B83A", "#C84536", "#221F1B"]}
          onChange={(v) => setTweak("accent", v)} />

        <window.TweakSection label="Default view" />
        <window.TweakSelect label="On open"
          value={view}
          options={[
            { value: "KANBAN",   label: "Kanban (pipeline)" },
            { value: "TABLE",    label: "Table (audit)" },
            { value: "TIMELINE", label: "Timeline (Gantt)" },
            { value: "MAP",      label: "Map (geography)" },
          ]}
          onChange={(v) => { setView(v); setTweak("defaultView", v); }} />

        <window.TweakSection label="Demo" />
        <window.TweakButton label="Simulate stage move"
          onClick={() => {
            const lead = projects.find(p => p.stage === "lead");
            if (lead) moveProject(lead.id, "bidding");
          }} />
        <window.TweakButton label="Reset board" secondary
          onClick={() => setProjects(D.PROJECTS)} />
      </window.TweaksPanel>
    </div>
  );
}

window.ProjectsApp = ProjectsApp;
