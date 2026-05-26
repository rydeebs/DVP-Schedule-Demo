// Fleet — root app

const { useState: flAUseState, useEffect: flAUseEffect, useRef: flAUseRef, useCallback: flAUseCallback } = React;

function FleetApp() {
  const D = window.FLEET_DATA;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "accent": "#F08A2C",
    "autoSelectMoving": false
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  flAUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  const [statusFilter, setStatusFilter] = flAUseState(null);
  const [kindFilter,   setKindFilter]   = flAUseState("all");
  const [selectedId,   setSelectedId]   = flAUseState("EQ-204"); // default to paver on Route 9
  const [query,        setQuery]        = flAUseState("");
  const [toast, setToast] = flAUseState(null);
  const toastTimerRef = flAUseRef(null);

  const showToast = flAUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);
  const handleUndo = flAUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);

  flAUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault(); handleUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo]);

  const onMessage = (asset) => {
    const driver = D.FLEET_WORKERS[asset.driverId];
    showToast(
      `Calling <strong>${driver?.name}</strong> · <span class="num">${asset.id}</span>`,
      () => {}
    );
  };
  const onUnassign = (asset) => {
    const job = D.JOB_SITES.find(j => j.id === asset.jobId);
    showToast(
      `<span class="num">${asset.id}</span> unassigned from <strong>${job?.code}</strong>`,
      () => {}
    );
  };

  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <FleetHeader
        collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark}
        onToggleDark={() => setTweak("dark", !t.dark)}
      />
      <FleetSidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Fleet Tracking</span>
            <span className="date-day">
              {D.FLEET_STATS.moving} MOVING ·
              {" "}{D.FLEET_STATS.idle} IDLE ·
              {" "}{D.FLEET_STATS.shop} IN SHOP ·
              {" "}{D.FLEET_STATS.offline} OFFLINE · TENNA LIVE
            </span>
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="filter-chip">
            <span className="dot" style={{ background: "var(--status-ok)" }}></span> ALL CREWS
          </button>
          <button className="filter-chip"><Icons.Filter size={12} /> JOB · ANY</button>
          <button className="btn btn-secondary" style={{ height: 32 }}>
            <Icons.Doc size={12} /> Export trip log
          </button>
          <button className="btn btn-primary" style={{ height: 32 }}
            onClick={() => showToast(`Sent push to <strong>${D.FLEET_STATS.moving} drivers</strong> on the clock`, () => {})}>
            <FlIcons.Send size={14} /> Notify drivers
          </button>
        </div>

        <div className="fleet">
          <FleetRail
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            kindFilter={kindFilter}     setKindFilter={setKindFilter}
            selectedId={selectedId}     setSelectedId={setSelectedId}
            query={query}               setQuery={setQuery}
          />
          <FleetMap
            statusFilter={statusFilter}
            kindFilter={kindFilter}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
          <FleetSide
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onMessage={onMessage}
            onUnassign={onUnassign}
          />
        </div>
      </main>

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

        <window.TweakSection label="Layout" />
        <window.TweakToggle label="Collapse sidebar" value={t.sidebarCollapsed} onChange={(v) => setTweak("sidebarCollapsed", v)} />

        <window.TweakSection label="Demo" />
        <window.TweakButton label="Clear selection" onClick={() => setSelectedId(null)} />
        <window.TweakButton label="Show only offline" secondary onClick={() => setStatusFilter(statusFilter === "offline" ? null : "offline")} />
      </window.TweaksPanel>
    </div>
  );
}

window.FleetApp = FleetApp;
