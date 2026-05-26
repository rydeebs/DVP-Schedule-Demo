// Forms — Daily Report fill flow + FormsApp root

const { useState: ffUseState, useEffect: ffUseEffect, useMemo: ffUseMemo, useRef: ffUseRef, useCallback: ffUseCallback } = React;

/* ─────────────────────── Form Fill ─────────────────────── */
function FormFill({ instance, template, onClose, onSubmit }) {
  const D = window.FORMS_DATA;
  const sections = template?.id === "daily" ? D.DAILY_REPORT_SECTIONS : D.DAILY_REPORT_SECTIONS;

  // Initialize values from prefills
  const initialValues = ffUseMemo(() => {
    const v = {};
    sections.forEach(s => {
      s.fields.forEach(f => {
        v[`${s.key}.${f.key}`] = f.prefill !== undefined ? f.prefill : "";
      });
    });
    // Honor any draft progress on the instance
    if (instance.progress > 0) {
      // pretend first N fields are already filled with prefills
    }
    return v;
  }, [sections, instance]);

  const [values, setValues] = ffUseState(initialValues);
  const [activeSection, setActiveSection] = ffUseState(sections[0].key);
  const [saveState, setSaveState] = ffUseState("saved"); // saved | saving | error
  const [submitting, setSubmitting] = ffUseState(false);
  const scrollRef = ffUseRef(null);
  const sectionRefs = ffUseRef({});
  const saveTimer = ffUseRef(null);

  // Field completeness — counts non-empty values, excluding boolean-no
  const fieldsCompletion = ffUseMemo(() => {
    let total = 0, done = 0;
    const perSection = {};
    sections.forEach(s => {
      let st = 0, sd = 0;
      s.fields.forEach(f => {
        st += 1;
        const v = values[`${s.key}.${f.key}`];
        const isFilled =
          v === false || v === "no" ? true :
          v == null ? false :
          Array.isArray(v) ? v.length > 0 :
          typeof v === "object" ? true :
          String(v).trim().length > 0;
        if (isFilled) { sd += 1; done += 1; }
        total += 1;
      });
      perSection[s.key] = { total: st, done: sd, complete: sd === st };
    });
    return { total, done, perSection };
  }, [values, sections]);

  // Autosave on change
  const setField = ffUseCallback((sectionKey, fieldKey, newValue) => {
    setValues(prev => ({ ...prev, [`${sectionKey}.${fieldKey}`]: newValue }));
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveState(Math.random() < 0.02 ? "error" : "saved");
    }, 600 + Math.random() * 600);
  }, []);

  // Jump to section via nav
  const jumpTo = (key) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: el.offsetTop - 16,
        behavior: "smooth"
      });
    }
  };

  // Track which section is in view
  ffUseEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const tops = sections.map(s => ({
        key: s.key,
        top: sectionRefs.current[s.key]?.offsetTop || 0
      }));
      const y = el.scrollTop + 40;
      let cur = sections[0].key;
      for (const t of tops) {
        if (t.top <= y) cur = t.key;
      }
      setActiveSection(cur);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [sections]);

  // Esc to close
  ffUseEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSaveState("saving");
    await new Promise(r => setTimeout(r, 900));
    setSaveState("saved");
    setSubmitting(false);
    onSubmit?.(instance, values);
  };

  const pct = Math.round((fieldsCompletion.done / fieldsCompletion.total) * 100);
  const ready = fieldsCompletion.done === fieldsCompletion.total;

  return (
    <div className="ff-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ff" role="dialog" aria-label="Fill daily report">
        <header className="ff-hdr">
          <div className="row1">
            <span className="code">{instance.jobCode}</span>
            <h1 className="nm">{template?.name || "Daily Report"}</h1>
            <div style={{ flex: 1 }}></div>
            <span className={`save ${saveState}`}>
              <span className="dot"></span>
              {saveState === "saved"  && "AUTOSAVED · 12s AGO"}
              {saveState === "saving" && "AUTOSAVING…"}
              {saveState === "error"  && "AUTOSAVE FAILED · WILL RETRY"}
            </span>
            <button className="icon-btn" onClick={onClose} aria-label="Close" title="Esc">
              <FormIcons.X size={14} />
            </button>
          </div>
          <div className="meta">
            <span>{instance.jobName}</span>
            <span className="sep">·</span>
            <span>{instance.crew}</span>
            <span className="sep">·</span>
            <span>{instance.dueBy ? `DUE ${instance.dueBy.toUpperCase()}` : "AD-HOC"}</span>
            <span className="sep">·</span>
            <span>{template?.fields || 17} FIELDS · ~{template?.est || 6} MIN</span>
          </div>
        </header>

        <div className="ff-body">
          <nav className="ff-nav">
            {sections.map((s, i) => {
              const sc = fieldsCompletion.perSection[s.key];
              return (
                <div key={s.key}
                  className={`ff-nav-item ${activeSection === s.key ? "active" : ""} ${sc.complete ? "complete" : ""}`}
                  onClick={() => jumpTo(s.key)}
                >
                  <span className="ix">{sc.complete ? <FormIcons.Check size={11} /> : String(i + 1).padStart(2, "0")}</span>
                  <span>{s.label}</span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-3)",
                    letterSpacing: "0.04em"
                  }}>{sc.done}/{sc.total}</span>
                </div>
              );
            })}
          </nav>

          <div className="ff-scroll" ref={scrollRef}>
            {sections.map((s, i) => (
              <section key={s.key} className="ff-sect"
                ref={el => { sectionRefs.current[s.key] = el; }}
              >
                <div className="ff-sect-h">
                  <span className="ix">SECTION {String(i + 1).padStart(2, "0")}</span>
                  <span className="nm">{s.label}</span>
                </div>
                {s.intro && <div className="intro">{s.intro}</div>}
                <SectionFields
                  section={s}
                  values={values}
                  setField={setField}
                />
              </section>
            ))}
            <div style={{ height: 80 }}></div>
          </div>
        </div>

        <footer className="ff-foot">
          <span className="progress-num">{fieldsCompletion.done}<span className="total">/{fieldsCompletion.total}</span></span>
          <div className="progress-bar">
            <div className={`fill ${ready ? "complete" : ""}`} style={{ width: `${pct}%` }}></div>
          </div>
          <span className="progress-lbl">{pct}% complete</span>
          <button className="btn btn-ghost" onClick={onClose}>Save & close</button>
          <button className="btn btn-primary"
            disabled={submitting || !ready}
            style={{ opacity: ready ? 1 : 0.5, cursor: ready ? "pointer" : "not-allowed" }}
            onClick={handleSubmit}
          >
            <FormIcons.Send size={12} />
            {submitting ? "Submitting…" : ready ? "Submit form" : `Fill ${fieldsCompletion.total - fieldsCompletion.done} more to submit`}
          </button>
        </footer>
      </div>
    </div>
  );
}

/* Section field renderer — switches by field type */
function SectionFields({ section, values, setField }) {
  const FIELD_GRID = {
    context: "grid-2", weather: "grid-3",
  }[section.key] || "stack";

  if (FIELD_GRID === "grid-2") {
    return (
      <div className="ff-grid-2">
        {section.fields.map(f => <FieldOne key={f.key} section={section} field={f} values={values} setField={setField} />)}
      </div>
    );
  }
  if (FIELD_GRID === "grid-3") {
    return (
      <>
        <div className="ff-grid-3">
          {section.fields.slice(0, 2).map(f => <FieldOne key={f.key} section={section} field={f} values={values} setField={setField} />)}
          <div></div>
        </div>
        {section.fields.slice(2).map(f => <FieldOne key={f.key} section={section} field={f} values={values} setField={setField} />)}
      </>
    );
  }
  return <>{section.fields.map(f => <FieldOne key={f.key} section={section} field={f} values={values} setField={setField} />)}</>;
}

function FieldOne({ section, field, values, setField }) {
  const path = `${section.key}.${field.key}`;
  const v = values[path];
  const set = (nv) => setField(section.key, field.key, nv);

  const Label = (
    <label className="ff-field-label">
      {field.label}
      {field.required && <span className="req">*</span>}
      {field.auto && <span className="auto">PREFILLED</span>}
    </label>
  );

  if (field.type === "textarea") {
    return (
      <div className="ff-field">
        {Label}
        <textarea className="ff-textarea" value={v || ""}
          placeholder={field.key === "work" ? "e.g. Paved southbound lane STA 24+50 → 31+20. 12' wide × 2\". 2 lifts." : "e.g. 22-min delivery delay on load 4 — Tilcon dispatch reroute."}
          onChange={(e) => set(e.target.value)} />
      </div>
    );
  }
  if (field.type === "chips") {
    return (
      <div className="ff-field">
        {Label}
        <div className="ff-chips">
          {field.options.map(opt => {
            const arr = Array.isArray(v) ? v : [];
            const on = arr.includes(opt);
            return (
              <button key={opt} className={`ff-chip ${on ? "on" : ""}`}
                onClick={() => set(on ? arr.filter(x => x !== opt) : [...arr, opt])}
              >{opt}</button>
            );
          })}
        </div>
      </div>
    );
  }
  if (field.type === "yesno") {
    return (
      <div className="ff-field">
        {Label}
        <div className="ff-yesno">
          <button className={v === "no" ? "on-no" : ""} onClick={() => set("no")}>NO INCIDENTS</button>
          <button className={v === "yes" ? "on-yes" : ""} onClick={() => set("yes")}>YES — REPORT</button>
        </div>
        {v === "yes" && (
          <div style={{
            marginTop: 8,
            padding: "8px 10px",
            background: "var(--status-stop-soft)",
            color: "var(--status-stop)",
            borderRadius: "var(--r)",
            fontFamily: "var(--font-mono)",
            fontSize: 11, letterSpacing: "0.04em"
          }}>
            <Icons.AlertTri size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
            An Employee Incident Report will be created and routed to Devon King when you submit.
          </div>
        )}
      </div>
    );
  }
  if (field.type === "roster") {
    const list = Array.isArray(v) ? v : field.prefill;
    return (
      <div className="ff-field">
        {Label}
        <div className="ff-roster">
          {list.map((m, idx) => (
            <div key={m.id} className={`ff-roster-row ${!m.present ? "absent" : ""}`}>
              <span className="av">{m.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
              <span className="nm">{m.name}</span>
              <span className="role">{m.role}</span>
              <span className={`ff-tg ${m.present ? "on" : ""}`} onClick={() => {
                set(list.map((x, i) => i === idx ? { ...x, present: !x.present } : x));
              }}></span>
            </div>
          ))}
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "var(--ink-2)", letterSpacing: "0.04em", marginTop: 4
        }}>
          {list.filter(x => x.present).length} OF {list.length} ON SITE · TAP TO TOGGLE
        </div>
      </div>
    );
  }
  if (field.type === "deliveries") {
    const list = Array.isArray(v) ? v : field.prefill;
    return (
      <div className="ff-field">
        {Label}
        <div style={{
          border: "1px solid var(--ink-border)",
          borderRadius: "var(--r)",
          background: "var(--surface-0)",
          overflow: "hidden",
        }}>
          <div className="ff-delivery head">
            <span>TICKET</span><span>SUPPLIER</span><span>MATERIAL</span>
            <span style={{ textAlign: "right" }}>QTY</span><span>ARR.</span><span>STATUS</span>
          </div>
          {list.map((d, i) => (
            <div key={i} className="ff-delivery">
              <span className="ticket">{d.ticket}</span>
              <span>{d.supplier}</span>
              <span>{d.material}</span>
              <span style={{ textAlign: "right", color: "var(--ink-0)" }}>{d.qty}</span>
              <span>{d.arrived}</span>
              <span className={d.ok ? "ok" : "stop"}>
                {d.ok ? "✓ ACCEPTED" : `✕ ${d.note?.toUpperCase()}`}
              </span>
            </div>
          ))}
          <button className="dj-foot add" style={{
            margin: 8, padding: "4px 10px",
            border: "1px dashed var(--ink-border)",
            background: "transparent", color: "var(--ink-2)",
            fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", borderRadius: 2,
          }}>+ ADD DELIVERY</button>
        </div>
      </div>
    );
  }
  if (field.type === "photos") {
    const n = typeof v === "number" ? v : (field.prefill || 0);
    const captions = ["06:30 · SOUTH LANE", "11:05 · MIX RECEIVED", "14:45 · COMPACTED"];
    return (
      <div className="ff-field">
        {Label}
        <div className="ff-photos">
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} className="ff-photo">
              <span className="iso">{captions[i] || `${String(i + 1).padStart(2, "0")}`}</span>
            </div>
          ))}
          <button className="ff-photo-add" onClick={() => set(n + 1)}>
            + ADD
          </button>
        </div>
      </div>
    );
  }
  if (field.type === "signature") {
    return (
      <div className="ff-field">
        {Label}
        <div className={`ff-sig ${v ? "signed" : ""}`}
          onClick={() => set(v ? null : "signed-stub")}
        >
          {v ? "✓ SIGNED · AARON VASQUEZ · 17:08:42" : "TAP TO SIGN"}
        </div>
      </div>
    );
  }
  // num, text, time, date, user — all standard inputs
  return (
    <div className="ff-field">
      {Label}
      <input
        className={`ff-input ${field.auto ? "auto" : ""}`}
        type={field.type === "num" ? "text" : field.type}
        value={v || ""}
        placeholder={field.type === "num" ? `0 ${field.unit || ""}` : ""}
        onChange={(e) => set(e.target.value)}
      />
    </div>
  );
}

/* ─────────────────────── App root ─────────────────────── */
function FormsApp() {
  const D = window.FORMS_DATA;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "accent": "#F08A2C",
    "showSidePanel": true
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  ffUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  const [view, setView] = ffUseState("INBOX"); // INBOX | APPROVALS | ALL | TEMPLATES
  const [urgencyFilter, setUrgencyFilter] = ffUseState(null);
  const [openInst, setOpenInst] = ffUseState(null);
  const [submittedIds, setSubmittedIds] = ffUseState({});
  const [toast, setToast] = ffUseState(null);
  const toastTimerRef = ffUseRef(null);

  const showToast = ffUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);
  const handleUndo = ffUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);
  ffUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault(); handleUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo]);

  // Open instance and template
  const openTemplate = openInst ? D.FORM_TEMPLATES[openInst.tplId] : null;

  // Visible instances per view
  const visibleInstances = ffUseMemo(() => {
    const filtered = D.FORM_INSTANCES.filter(i => {
      if (submittedIds[i.id] && view === "INBOX") return false;
      return true;
    });

    if (view === "APPROVALS") return filtered.filter(i => i.urgency === "review");
    if (view === "ALL")       return filtered;
    if (view === "TEMPLATES") return [];
    // INBOX
    return filtered.filter(i => i.urgency !== "done" || true /* show done at bottom too */);
  }, [view, submittedIds]);

  const handleSubmit = (inst, vals) => {
    setSubmittedIds(prev => ({ ...prev, [inst.id]: true }));
    setOpenInst(null);
    const tpl = D.FORM_TEMPLATES[inst.tplId];
    showToast(
      `<strong>${tpl?.name}</strong> submitted for <span class="num">${inst.jobCode}</span> · routed to Sara Pham for review`,
      () => setSubmittedIds(prev => { const c = { ...prev }; delete c[inst.id]; return c; })
    );
  };

  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <FormsHeader
        collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark}
        onToggleDark={() => setTweak("dark", !t.dark)}
      />
      <FormsSidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Forms</span>
            <span className="date-day">
              {D.FORMS_STATS.overdue + D.FORMS_STATS.dueToday + D.FORMS_STATS.dueThisWeek} OPEN ·
              {" "}{D.FORMS_STATS.awaitingReview} TO REVIEW ·
              {" "}{D.FORMS_STATS.complianceRate}% COMPLIANCE
            </span>
          </div>
          <div className="tabs">
            {[
              { key: "INBOX",     lbl: "INBOX" },
              { key: "APPROVALS", lbl: `APPROVALS · ${D.FORMS_STATS.awaitingReview}` },
              { key: "ALL",       lbl: "AUDIT" },
              { key: "TEMPLATES", lbl: "TEMPLATES" },
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
          <button className="filter-chip" onClick={() => window.DVPAction("Form filter menu opened")}><Icons.Filter size={12} /> FILTERS</button>
          <button className="btn btn-secondary" style={{ height: 32 }} onClick={() => window.DVPAction("Form export queued")}>
            <Icons.Doc size={12} /> Export
          </button>
          <button className="btn btn-primary" style={{ height: 32 }}
            onClick={() => {
              const first = D.FORM_INSTANCES.find(i => i.urgency === "today" && i.status !== "submitted")
                         || D.FORM_INSTANCES.find(i => i.urgency === "overdue");
              if (first) setOpenInst(first);
            }}>
            <FormIcons.Send size={14} /> Fill next form
          </button>
        </div>

        <div className="forms" style={!t.showSidePanel ? { gridTemplateColumns: "1fr" } : null}>
          <div className="forms-main">
            {view === "INBOX" && (
              <FormsInbox
                instances={visibleInstances}
                urgencyFilter={urgencyFilter}
                setUrgencyFilter={setUrgencyFilter}
                onOpen={setOpenInst}
              />
            )}
            {view === "APPROVALS" && (
              <ApprovalsView instances={visibleInstances} onOpen={setOpenInst} />
            )}
            {view === "ALL" && (
              <FormsAudit instances={visibleInstances} />
            )}
            {view === "TEMPLATES" && (
              <FormsTemplates onStart={(tpl) => {
                const inst = {
                  id: `new-${Date.now()}`,
                  tplId: tpl.id,
                  jobCode: "P-2419",
                  jobName: "Route 9 Resurfacing — Phase 2",
                  crew: "Crew 14 — Vasquez",
                  ownerId: "u1",
                  dueBy: "today 17:00",
                  urgency: "today",
                  status: "draft",
                  progress: 0,
                };
                setOpenInst(inst);
              }} />
            )}
          </div>
          {t.showSidePanel && view !== "TEMPLATES" && <FormsSide />}
        </div>
      </main>

      {openInst && (
        <FormFill
          instance={openInst}
          template={openTemplate}
          onClose={() => setOpenInst(null)}
          onSubmit={handleSubmit}
        />
      )}

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
        <window.TweakButton label="Open Daily Report"
          onClick={() => setOpenInst(D.FORM_INSTANCES.find(i => i.tplId === "daily" && i.urgency === "today"))} />
        <window.TweakButton label="Reset submitted" secondary
          onClick={() => setSubmittedIds({})} />
      </window.TweaksPanel>
    </div>
  );
}

/* Approvals view — same row pattern but with a context column and bigger CTAs */
function ApprovalsView({ instances, onOpen }) {
  const D = window.FORMS_DATA;
  return (
    <>
      <div style={{
        padding: "var(--s4)",
        background: "var(--status-warn-soft)",
        border: "1px solid oklch(0.62 0.12 85 / 0.50)",
        borderRadius: "var(--r)",
        marginBottom: "var(--s4)",
        display: "flex", alignItems: "center", gap: "var(--s3)",
      }}>
        <FormIcons.Stack size={18} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, color: "var(--ink-0)", fontWeight: 500 }}>
            {instances.length} forms waiting on you
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--ink-2)", letterSpacing: "0.04em", marginTop: 2,
          }}>
            Oldest is 3d old · routed to you because you're the assigned reviewer or backup.
          </div>
        </div>
        <button className="btn btn-secondary" style={{ height: 30 }} onClick={() => window.DVPAction("Batch reassignment opened")}>
          Reassign batch
        </button>
        <button className="btn btn-primary" style={{ height: 30 }} onClick={() => window.DVPAction("Marked all clear")}>
          <FormIcons.Check size={12} /> Approve all clear
        </button>
      </div>
      <section className="fmf-group g-review">
        <div className="fmf-rows">
          {instances.map(i => {
            const tpl = D.FORM_TEMPLATES[i.tplId];
            const owner = D.FORM_USERS[i.ownerId];
            return (
              <article key={i.id} className={`fmf-row appr k-${tpl?.tone || "warn"}`} onClick={() => onOpen(i)}>
                <span className="urgency-bar"></span>
                <span className="ki">{templateIcon(tpl, 12)}</span>
                <div className="col-form">
                  <span className="nm">{tpl?.name}</span>
                  <span className="sub">
                    {i.severity && (
                      <>
                        <StatusPill variant={i.severity === "stop" ? "stop" : i.severity === "watch" ? "warn" : "info"}>
                          {i.severity.toUpperCase()}
                        </StatusPill>
                        {" · "}
                      </>
                    )}
                    {i.note}
                  </span>
                </div>
                <div className="col-context">
                  <div style={{ color: "var(--ink-0)", fontFamily: "var(--font-sans)", fontSize: 13 }}>
                    {i.jobCode} · {i.jobName?.replace(/ — .*$/, "")}
                  </div>
                  <div style={{ marginTop: 2 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontFamily: "var(--font-mono)", fontSize: 10
                    }}>
                      <span style={{
                        width: 14, height: 14, background: "var(--asphalt)",
                        color: "var(--surface-0)", fontFamily: "var(--font-mono)",
                        fontSize: 8, display: "grid", placeItems: "center",
                        borderRadius: 2
                      }}>{owner?.init}</span>
                      {owner?.name}
                    </span>
                  </div>
                </div>
                <div className="col-due">
                  <span className="lbl">SUBMITTED</span>
                  <span className="v">{i.submittedAt}</span>
                </div>
                <div className="col-action">
                  <button className="btn btn-secondary" style={{ height: 28 }} onClick={(e) => { e.stopPropagation(); window.DVPAction("Form sent back for revision"); }}>
                    <FormIcons.X size={12} /> Send back
                  </button>
                  <button className="btn btn-primary" style={{ height: 28 }} onClick={(e) => { e.stopPropagation(); window.DVPAction("Form approved"); }}>
                    <FormIcons.Check size={12} /> Approve
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

window.FormsApp = FormsApp;
