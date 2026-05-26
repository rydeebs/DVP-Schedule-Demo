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
  const [certTypes, setCertTypes] = aSUseState(D.CERT_TYPES);
  const [certTypeOpen, setCertTypeOpen] = aSUseState(false);
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

  const addCertType = aSUseCallback((form) => {
    const id = `custom_${String(Date.now()).slice(-8)}`;
    setCertTypes(prev => ({
      ...prev,
      [id]: {
        id,
        name: form.name.trim(),
        issuer: form.issuer.trim(),
        validMonths: Number(form.validMonths) || 12,
        required: form.required.split(",").map(s => s.trim()).filter(Boolean),
        tone: form.tone,
      },
    }));
    setCertTypeOpen(false);
    showToast(`<strong>${form.name}</strong> added to certification types`);
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
          <button className="filter-chip" onClick={() => window.DVPAction("Crew filter opened")}>
            <span className="dot" style={{ background: "var(--status-ok)" }}></span> ALL CREWS
          </button>
          <button className="btn btn-secondary" style={{ height: 32 }} onClick={() => window.DVPAction("OSHA 300 export queued")}>
            <SafIcons.Doc size={12} /> Export OSHA 300
          </button>
          <button className="btn btn-primary" style={{ height: 32 }} onClick={() => setView("INCIDENTS")}>
            <SafIcons.Plus size={14} /> File incident
          </button>
        </div>

        <div className="safety" style={!t.showSidePanel ? { gridTemplateColumns: "1fr" } : null}>
          <div className="safety-main">
            {view === "OVERVIEW"       && <SafetyOverview onJumpCerts={() => setView("CERTIFICATIONS")} />}
            {view === "CERTIFICATIONS" && <CertificationsView onRenew={renew} certTypes={certTypes} />}
            {view === "TRAINING"       && <TrainingView />}
            {view === "INCIDENTS"      && <IncidentsView />}
            {view === "POLICIES"       && <PoliciesView />}
          </div>
          {t.showSidePanel && (view === "OVERVIEW" || view === "CERTIFICATIONS") && (
            <SafetySide onAddCertType={() => setCertTypeOpen(true)} />
          )}
        </div>
      </main>

      <UndoToast toast={toast} onUndo={handleUndo} />
      <SafetyCertTypeDrawer open={certTypeOpen} onClose={() => setCertTypeOpen(false)} onSave={addCertType} />

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

function SafetyCertTypeDrawer({ open, onClose, onSave }) {
  const [form, setForm] = aSUseState({
    name: "",
    issuer: "DVP Internal",
    validMonths: 12,
    required: "foreman,operator",
    tone: "info",
  });

  aSUseEffect(() => {
    if (open) {
      setForm({
        name: "",
        issuer: "DVP Internal",
        validMonths: 12,
        required: "foreman,operator",
        tone: "info",
      });
    }
  }, [open]);

  if (!open) return null;
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const canSave = form.name.trim();

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.22)",
      zIndex: 40, display: "flex", justifyContent: "flex-end"
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside style={{
        width: 380, maxWidth: "100%", height: "100%",
        background: "var(--surface-1)", borderLeft: "1px solid var(--ink-border)",
        padding: 16, display: "flex", flexDirection: "column", gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="brand-mark" style={{ width: 34, height: 34 }}>+</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>NEW CERT TYPE</div>
            <div style={{ fontSize: 16, color: "var(--ink-0)" }}>Add certification type</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><SafIcons.X size={14} /></button>
        </div>
        <label className="add-form-field">
          <span className="lbl">Name</span>
          <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Confined Space Entry" />
        </label>
        <label className="add-form-field">
          <span className="lbl">Issuer</span>
          <input value={form.issuer} onChange={(e) => setField("issuer", e.target.value)} placeholder="DVP Internal" />
        </label>
        <div className="add-form-grid-2">
          <label className="add-form-field">
            <span className="lbl">Valid months</span>
            <input type="number" value={form.validMonths} onChange={(e) => setField("validMonths", Number(e.target.value) || 12)} />
          </label>
          <label className="add-form-field">
            <span className="lbl">Tone</span>
            <select value={form.tone} onChange={(e) => setField("tone", e.target.value)}>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="stop">Stop</option>
              <option value="ok">OK</option>
            </select>
          </label>
        </div>
        <label className="add-form-field">
          <span className="lbl">Required roles</span>
          <input value={form.required} onChange={(e) => setField("required", e.target.value)} placeholder="foreman,operator" />
        </label>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!canSave} onClick={() => onSave(form)}>Add type</button>
        </div>
      </aside>
    </div>
  );
}

window.SafetyApp = SafetyApp;
