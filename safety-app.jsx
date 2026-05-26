// Safety — root app

const { useState: aSUseState, useEffect: aSUseEffect, useRef: aSUseRef, useCallback: aSUseCallback } = React;

function SafetyApp() {
  const D = window.SAFETY_DATA;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "accent": "#F08A2C",
    "showSidePanel": true
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  aSUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  const [view, setView] = aSUseState("OVERVIEW");
  const [renewedIds, setRenewedIds] = aSUseState({});
  const [toast, setToast] = aSUseState(null);
  const toastTimerRef = aSUseRef(null);

  const showToast = aSUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);
  const handleUndo = aSUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);

  aSUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault(); handleUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo]);

  // Renew (the demonstrated bulk action)
  const renew = aSUseCallback((ids, clearSelection) => {
    const prevState = ids.reduce((m, id) => { m[id] = true; return m; }, {});
    setRenewedIds(prev => ({ ...prev, ...prevState }));
    clearSelection?.();
    const list = ids.length === 1 ? "1 certification" : `${ids.length} certifications`;
    showToast(
      `<strong>${list}</strong> scheduled for renewal · workers notified via SMS · routed to Devon King`,
      () => setRenewedIds(prev => {
        const c = { ...prev };
        ids.forEach(i => delete c[i]);
        return c;
      })
    );
  }, [showToast]);

  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <SafetyHeader
        collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark}
        onToggleDark={() => setTweak("dark", !t.dark)}
      />
      <SafetySidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Safety</span>
            <span className="date-day">
              {D.SAFETY_STATS.daysSinceLast} DAYS INC FREE ·
              {" "}TRIR {D.SAFETY_STATS.trirYtd.toFixed(1)} ·
              {" "}{D.SAFETY_STATS.expired + D.SAFETY_STATS.expiringSoon} CERTS NEED ATTENTION
            </span>
          </div>
          <div className="tabs">
            {[
              { key: "OVERVIEW",       lbl: "OVERVIEW" },
              { key: "CERTIFICATIONS", lbl: `CERTIFICATIONS · ${D.SAFETY_STATS.expired + D.SAFETY_STATS.expiringSoon}` },
              { key: "TRAINING",       lbl: "TRAINING" },
              { key: "INCIDENTS",      lbl: `INCIDENTS · ${D.INCIDENTS.filter(i => i.status === "investigating").length}` },
              { key: "POLICIES",       lbl: "POLICIES" },
            ].map(tab => (
              <button key={tab.key} className={`tab ${view === tab.key ? "active" : ""}`} onClick={() => setView(tab.key)}>
                {tab.lbl}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="filter-chip">
            <span className="dot" style={{ background: "var(--status-ok)" }}></span> ALL CREWS
          </button>
          <button className="btn btn-secondary" style={{ height: 32 }}>
            <SafIcons.Doc size={12} /> Export OSHA 300
          </button>
          <button className="btn btn-primary" style={{ height: 32 }}>
            <SafIcons.Plus size={14} /> File incident
          </button>
        </div>

        <div className="safety" style={!t.showSidePanel ? { gridTemplateColumns: "1fr" } : null}>
          <div className="safety-main">
            {view === "OVERVIEW"       && <SafetyOverview onJumpCerts={() => setView("CERTIFICATIONS")} />}
            {view === "CERTIFICATIONS" && <CertificationsView onRenew={renew} />}
            {view === "TRAINING"       && <TrainingView />}
            {view === "INCIDENTS"      && <IncidentsView />}
            {view === "POLICIES"       && <PoliciesView />}
          </div>
          {t.showSidePanel && (view === "OVERVIEW" || view === "CERTIFICATIONS") && <SafetySide />}
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
        <window.TweakToggle label="Side panel" value={t.showSidePanel} onChange={(v) => setTweak("showSidePanel", v)} />
        <window.TweakToggle label="Collapse sidebar" value={t.sidebarCollapsed} onChange={(v) => setTweak("sidebarCollapsed", v)} />

        <window.TweakSection label="Demo" />
        <window.TweakButton label="Jump to Certifications" onClick={() => setView("CERTIFICATIONS")} />
        <window.TweakButton label="Reset renewals" secondary onClick={() => setRenewedIds({})} />
      </window.TweaksPanel>
    </div>
  );
}

window.SafetyApp = SafetyApp;
