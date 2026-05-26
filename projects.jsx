// Projects — Kanban + Table + Timeline + Map + Detail drawer
// Continues the Industrial Utilitarian system. Demonstrated interaction: kanban DnD.

const { useState: prUseState, useEffect: prUseEffect, useMemo: prUseMemo, useRef: prUseRef, useCallback: prUseCallback } = React;

/* ───────────────────── Icons ───────────────────── */
const PrIcons = {
  Board:    (p) => <Ico {...p} d={["M3 4h18v4H3z","M3 10h7v10H3z","M12 10h9v6h-9z","M12 18h9v2h-9z"]} />,
  Table:    (p) => <Ico {...p} d={["M3 4h18v16H3z","M3 9h18","M3 14h18","M9 4v16","M15 4v16"]} />,
  Timeline: (p) => <Ico {...p} d={["M3 6h18","M3 12h18","M3 18h18","M7 6v0M7 12v6M14 12v0M14 18v0M11 6v6M18 6v12"]} />,
  Map:      (p) => <Ico {...p} d={["M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3Z","M9 4v13","M15 7v13"]} />,
  Search:   (p) => <Ico {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z","M21 21l-4.3-4.3"]} />,
  Plus:     (p) => <Ico {...p} d={["M12 5v14","M5 12h14"]} />,
  X:        (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Download: (p) => <Ico {...p} d={["M4 17v3h16v-3","M12 4v10","M7 9l5 5 5-5"]} />,
  Send:     (p) => <Ico {...p} d={["M22 2 11 13","M22 2l-7 20-4-9-9-4 20-7Z"]} />,
  History:  (p) => <Ico {...p} d={["M3 7v6h6","M3 13a9 9 0 1 1 3 7","M12 7v5l3 2"]} />,
  Filter:   (p) => <Ico {...p} d="M3 5h18l-7 9v6l-4-2v-4L3 5Z" />,
  ChevR:    (p) => <Ico {...p} d="M9 6l6 6-6 6" />,
};

/* ───────────────────── Header + Sidebar ───────────────────── */
function ProjHeader({ collapsed, onToggleSidebar, dark, onToggleDark, onCommand }) {
  return (
    <header className="app-header hdr">
      <div className="hdr-left">
        <button className="icon-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Icons.Menu size={18} />
        </button>
        <div className="brand">
          <div className="brand-mark">DV</div>
          <span className="brand-text">DVP / FIELD OPS</span>
        </div>
      </div>
      <div className="hdr-center">
        <div className="crumb">
          <span>CRM</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-cur">PROJECTS</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" onClick={onCommand} aria-label="Focus project search">
          <PrIcons.Search size={12} />
          <span>Find a project, customer, code…</span>
          <span className="cmdk-kbd">⌘K</span>
        </button>
        <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="badge">3</span>
        </button>
        <button className="avatar" title="Karen Faggioli">KF</button>
      </div>
    </header>
  );
}

function ProjSidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar",   href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",        badge: "47", href: "Dispatch.html" },
      { ico: Icons.Map,      label: "Fleet Tracking",  badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",      href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",   badge: "141", active: true, href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment", href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers",   badge: "203", href: "Workers.html" },
    ]},
  ];
  return (
    <aside className="app-sidebar sb">
      {items.map((g) => (
        <React.Fragment key={g.group}>
          <div className="sb-group">{g.group}</div>
          {g.entries.map((e) => (
            <a key={e.label} className={`sb-item ${e.active ? "active" : ""}`}
               href={e.href || "#"} style={{ textDecoration: "none" }}>
              <e.ico size={16} />
              <span className="lbl">{e.label}</span>
              {e.badge && <span className="badge">{e.badge}</span>}
            </a>
          ))}
        </React.Fragment>
      ))}
      <div className="sb-spacer"></div>
      <div className="sb-item">
        <Icons.Settings size={16} />
        <span className="lbl">Settings</span>
      </div>
      <div className="sb-foot">
        <span className="gps-dot live"></span>
        <span className="sb-foot-text">NETSUITE · SYNCED 12s</span>
      </div>
    </aside>
  );
}

/* ───────────────────── Pipeline hero ───────────────────── */
function PipelineHero({ projects, activeStage, setActiveStage }) {
  const D = window.PROJ_DATA;
  const totals = prUseMemo(() => {
    const byStage = {};
    D.STAGES.forEach(s => { byStage[s.key] = { count: 0, value: 0, weighted: 0 }; });
    projects.forEach(p => {
      const b = byStage[p.stage];
      if (!b) return;
      b.count += 1; b.value += p.value;
      b.weighted += p.value * (D.STAGE_WEIGHT[p.stage] || 0);
    });
    const totalValue = Object.values(byStage).reduce((a, b) => a + b.value, 0);
    const weighted = Object.values(byStage).reduce((a, b) => a + b.weighted, 0);
    const active = byStage.active?.value || 0;
    return { byStage, totalValue, weighted, active };
  }, [projects]);

  return (
    <div className="pipe-hero">
      <div className="cell bold">
        <span className="l">Total pipeline · weighted</span>
        <span className="v">{D.fmtMoney(totals.weighted)}<span className="sub">/ {D.fmtMoney(totals.totalValue)}</span></span>
        <span className="f">
          {projects.length} projects · {D.fmtMoney(totals.active)} in execution now
        </span>
      </div>
      {D.STAGES.map(s => {
        const b = totals.byStage[s.key];
        const isActive = activeStage === s.key;
        return (
          <div key={s.key}
            className={`cell stg-${s.key} ${isActive ? "active" : ""}`}
            onClick={() => setActiveStage(isActive ? null : s.key)}>
            <span className="l"><span className="dot"></span>{s.label}</span>
            <span className="v">{b.count}</span>
            <span className="f">{D.fmtMoney(b.value)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────── Kanban view ───────────────────── */
function ProjectsKanban({ projects, onMove, onDuplicate, onAdd, onOpen, dropTarget, assigning, snapCardId }) {
  const D = window.PROJ_DATA;
  const grouped = prUseMemo(() => {
    const m = {};
    D.STAGES.forEach(s => { m[s.key] = []; });
    projects.forEach(p => { (m[p.stage] ||= []).push(p); });
    Object.values(m).forEach(arr => arr.sort((a, b) => b.value - a.value));
    return m;
  }, [projects]);

  const [draggingId, setDraggingId] = prUseState(null);
  const [overStage, setOverStage] = prUseState(null);

  const isCopyDrag = (e) => !!(e.altKey || e.ctrlKey || e.metaKey);

  const dragHandlers = {
    onDragStart: (e, p) => {
      setDraggingId(p.id);
      try {
        e.dataTransfer.setData("text/plain", p.id);
        e.dataTransfer.setData("application/x-dvp-project-id", p.id);
        if (isCopyDrag(e)) e.dataTransfer.setData("application/x-dvp-project-copy", "1");
        e.dataTransfer.effectAllowed = "copyMove";
      } catch (_) {}
    },
    onDragEnd: () => { setDraggingId(null); setOverStage(null); },
  };

  const onColDragOver = (e, stage) => {
    e.preventDefault();
    const copying = isCopyDrag(e);
    setOverStage(stage);
    try { e.dataTransfer.dropEffect = copying ? "copy" : "move"; } catch (_) {}
  };
  const onColDragLeave = (e, stage) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setOverStage(cur => cur === stage ? null : cur);
  };
  const onColDrop = (e, stage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("application/x-dvp-project-id") || e.dataTransfer.getData("text/plain") || draggingId;
    const copying = isCopyDrag(e) || e.dataTransfer.getData("application/x-dvp-project-copy") === "1";
    if (id) {
      if (copying) onDuplicate?.(id, stage);
      else onMove(id, stage);
    }
    setOverStage(null);
    setDraggingId(null);
  };

  return (
    <div className="kanban">
      {D.STAGES.map(s => {
        const items = grouped[s.key] || [];
        const value = items.reduce((a, p) => a + p.value, 0);
        const isDrop = (overStage === s.key) || (dropTarget === s.key);
        const isAssigning = assigning === s.key;
        return (
          <section key={s.key}
            className={`kan-col ${isDrop ? "drop-target" : ""} ${isAssigning ? "assigning" : ""}`}
            onDragOver={(e) => onColDragOver(e, s.key)}
            onDragLeave={(e) => onColDragLeave(e, s.key)}
            onDrop={(e) => onColDrop(e, s.key)}>
            <header className="kan-col-hdr">
              <div className="top">
                <span className={`lbl stg-${s.key}`}><span className="dot"></span>{s.label.toUpperCase()}</span>
                <span className="cnt">{items.length}</span>
                <button className="add" onClick={() => onAdd?.(s.key)} aria-label={`Add ${s.label}`}>+ ADD</button>
              </div>
              <div className="value-row">
                <span className="v">{D.fmtMoney(value)}</span>
                <span className="sub">{s.desc}</span>
              </div>
            </header>
            <div className="kan-col-body">
              {items.length === 0 ? (
                <div className="kan-empty">DROP A PROJECT HERE</div>
              ) : (
                items.map(p => (
                  <KanbanCard key={p.id} project={p}
                    onOpen={onOpen}
                    onDuplicate={(id) => onDuplicate?.(id, p.stage)}
                    dragHandlers={dragHandlers}
                    isDragging={draggingId === p.id}
                    snapIn={snapCardId === p.id} />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function KanbanCard({ project, onOpen, onDuplicate, dragHandlers, isDragging, snapIn }) {
  const D = window.PROJ_DATA;
  const suppressClickRef = prUseRef(false);
  const pm = project.pmId ? D.PEOPLE[project.pmId] : null;
  const t = D.TYPE_INFO[project.type];
  const showProgress = project.stage === "active" || project.pctComplete != null;
  return (
    <article
      className={`kan-card t-${project.type} ${isDragging ? "dragging" : ""} ${snapIn ? "snap-in" : ""}`}
      draggable
      onDragStart={(e) => {
        suppressClickRef.current = true;
        dragHandlers.onDragStart(e, project);
      }}
      onDragEnd={(e) => {
        dragHandlers.onDragEnd(e, project);
        window.setTimeout(() => { suppressClickRef.current = false; }, 0);
      }}
      onClick={() => {
        if (!suppressClickRef.current) onOpen(project.id);
      }}
      data-comment-anchor={`proj-card-${project.id}`}
    >
      <div className="top">
        <span className="code">{project.code}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StatusPill variant={t.tone}>{t.lbl}</StatusPill>
          <button
            className="kan-dup"
            onClick={(e) => { e.stopPropagation(); onDuplicate?.(project.id); }}
            title="Duplicate project"
            aria-label={`Duplicate ${project.name}`}
          >
            <PrIcons.Plus size={10} />
          </button>
        </div>
      </div>
      <div className="nm">{project.name}</div>
      <div className="customer">{project.customer}</div>
      <div className="meta">
        <span><Icons.MapPin size={10} style={{ verticalAlign: -1, marginRight: 2 }} />{project.city}, {project.state}</span>
        {project.night && <><span className="sep">·</span><span style={{ color: "var(--signal)" }}>NIGHT</span></>}
      </div>
      {project.bidDue && (
        <span className="bid-due"><Icons.Clock size={10} /> BID DUE {project.bidDue.slice(5).replace("-", "/")}</span>
      )}
      {project.late && (
        <span className="late-flag"><Icons.AlertTri size={10} /> 2D BEHIND</span>
      )}
      {showProgress && (
        <div className="progress-bar">
          <div className={`progress-fill ${project.late ? "late" : project.pctComplete === 100 ? "done" : ""}`}
               style={{ width: `${project.pctComplete || 0}%` }}></div>
        </div>
      )}
      <div className="value-row">
        <span className="v">{D.fmtMoney(project.value)}</span>
        <div className="owner">
          {pm && <><span className="av">{pm.init}</span></>}
        </div>
      </div>
    </article>
  );
}

function ProjectFormDrawer({ open, stage, onClose, onSave }) {
  const D = window.PROJ_DATA;
  const [form, setForm] = prUseState({
    name: "", customer: "", city: "", state: "NJ", type: "paving", value: 100000, stage: stage || "lead",
  });

  prUseEffect(() => {
    if (open) {
      setForm({
        name: "", customer: "", city: "", state: "NJ", type: "paving", value: 100000, stage: stage || "lead",
      });
    }
  }, [open, stage]);

  if (!open) return null;
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const canSave = form.name.trim() && form.customer.trim() && form.city.trim();

  return (
    <div className="proj-drawer add-form" role="dialog" aria-label="New project">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">NEW PROJECT</span>
          <h2 className="nm">Create project</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><PrIcons.X size={14} /></button>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="add-form-section">
          <div className="h">Project information</div>
          <label className="add-form-field">
            <span className="lbl">Project name<span className="req">*</span></span>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Project name" />
          </label>
          <label className="add-form-field">
            <span className="lbl">Customer<span className="req">*</span></span>
            <input value={form.customer} onChange={(e) => setField("customer", e.target.value)} placeholder="Customer" />
          </label>
          <div className="add-form-grid-2">
            <label className="add-form-field">
              <span className="lbl">City<span className="req">*</span></span>
              <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="City" />
            </label>
            <label className="add-form-field">
              <span className="lbl">State</span>
              <input value={form.state} onChange={(e) => setField("state", e.target.value.toUpperCase().slice(0, 2))} />
            </label>
          </div>
          <div className="add-form-grid-2">
            <label className="add-form-field">
              <span className="lbl">Type</span>
              <select value={form.type} onChange={(e) => setField("type", e.target.value)}>
                {Object.entries(D.TYPE_INFO).map(([key, info]) => <option key={key} value={key}>{info.lbl}</option>)}
              </select>
            </label>
            <label className="add-form-field">
              <span className="lbl">Stage</span>
              <select value={form.stage} onChange={(e) => setField("stage", e.target.value)}>
                {D.STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </label>
          </div>
          <label className="add-form-field">
            <span className="lbl">Value</span>
            <input type="number" min="0" step="1000" value={form.value} onChange={(e) => setField("value", Number(e.target.value) || 0)} />
          </label>
        </div>
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!canSave} onClick={() => onSave(form)}>Create Project</button>
      </footer>
    </div>
  );
}

/* ───────────────────── Table view ───────────────────── */
function ProjectsTable({ projects, onOpen }) {
  const D = window.PROJ_DATA;
  return (
    <div className="proj-table-wrap">
      <table className="proj-table">
        <thead>
          <tr>
            <th className="col-code">PROJECT</th>
            <th>NAME</th>
            <th>CUSTOMER</th>
            <th className="col-loc">LOCATION</th>
            <th>STAGE</th>
            <th style={{ textAlign: "right" }}>VALUE</th>
            <th>PM</th>
            <th>SCHEDULE</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => {
            const pm = p.pmId ? D.PEOPLE[p.pmId] : null;
            const stage = D.STAGES.find(s => s.key === p.stage);
            return (
              <tr key={p.id} onClick={() => onOpen(p.id)}>
                <td className="col-code">{p.code}</td>
                <td className="col-name">{p.name}</td>
                <td className="col-customer">{p.customer}</td>
                <td className="col-loc">{p.city}, {p.state}</td>
                <td>
                  <StatusPill variant={
                    p.stage === "active" ? "signal" :
                    p.stage === "closed" ? "ok" :
                    p.stage === "lead"   ? "info" :
                    p.stage === "bidding" ? "warn" : "ok"
                  }>{stage?.label.toUpperCase()}</StatusPill>
                </td>
                <td className="col-value">{D.fmtMoney(p.value)}</td>
                <td>
                  <div className="col-owner">
                    {pm ? <><span className="av">{pm.init}</span><span>{pm.name}</span></> : <span style={{ color: "var(--ink-3)" }}>—</span>}
                  </div>
                </td>
                <td className="col-date">
                  {p.startAt ? (
                    <>
                      {p.startAt.slice(5).replace("-", "/")} → {p.endAt?.slice(5).replace("-", "/") || "?"}
                    </>
                  ) : p.bidDue ? `BID ${p.bidDue.slice(5).replace("-", "/")}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────────────── Timeline view (16-week Gantt) ───────────────────── */
function ProjectsTimeline({ projects, onOpen }) {
  const D = window.PROJ_DATA;

  // 16-week window: Apr 06 → Jul 26, 2026 (today = May 26, week 8)
  const START = new Date(2026, 3, 6); // Apr 6
  const WEEK_MS = 7 * 86400000;
  const TODAY = new Date(2026, 4, 26);

  const weeks = Array.from({ length: 16 }, (_, i) => {
    const d = new Date(START.getTime() + i * WEEK_MS);
    return { idx: i, date: d, label: `${d.getMonth()+1}/${d.getDate()}`, monthStart: d.getDate() <= 7 };
  });

  const todayPct = ((TODAY - START) / (16 * WEEK_MS)) * 100;

  // Only show projects with start+end in or overlapping the window
  const visible = projects
    .filter(p => p.startAt && p.endAt)
    .map(p => {
      const s = new Date(p.startAt);
      const e = new Date(p.endAt);
      const leftPct = Math.max(0, ((s - START) / (16 * WEEK_MS)) * 100);
      const rightPct = Math.min(100, ((e - START) / (16 * WEEK_MS)) * 100);
      const width = Math.max(2, rightPct - leftPct);
      return { ...p, leftPct, width };
    })
    .filter(p => p.leftPct < 100 && p.leftPct + p.width > 0)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

  return (
    <div className="timeline">
      <div className="tl-grid" style={{ gridTemplateColumns: "280px 1fr" }}>
        <div className="tl-head">PROJECT · {visible.length} SCHEDULED</div>
        <div className="tl-head weeks">
          {weeks.map(w => (
            <div key={w.idx}
              className={`week ${w.monthStart ? "month-start" : ""} ${w.date.toDateString() === new Date(2026, 4, 25).toDateString() ? "today" : ""}`}>
              {w.monthStart ? w.date.toLocaleString("en-US", { month: "short" }).toUpperCase() : w.label}
            </div>
          ))}
        </div>
        {visible.map(p => {
          const pm = p.pmId ? D.PEOPLE[p.pmId] : null;
          const t = D.TYPE_INFO[p.type];
          return (
            <React.Fragment key={p.id}>
              <div className="project-cell">
                <span className="nm">{p.name}</span>
                <span className="sub">{p.code} · {p.customer} · {pm?.name || "no PM"}</span>
              </div>
              <div className="bar-cell">
                <div className="today-line" style={{ left: `${todayPct}%` }}></div>
                <div className={`gantt-bar t-${p.type} stg-${p.stage}`}
                  style={{ left: `${p.leftPct}%`, width: `${p.width}%` }}
                  onClick={() => onOpen(p.id)}
                  title={`${p.name} · ${D.fmtMoney(p.value)}`}>
                  {p.pctComplete != null && <div className="progress" style={{ width: `${p.pctComplete}%` }}></div>}
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {t.lbl} · {D.fmtMoney(p.value)}{p.pctComplete != null ? ` · ${p.pctComplete}%` : ""}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────── Map view (NJ-region pins) ───────────────────── */
function ProjectsMap({ projects, onOpen }) {
  const D = window.PROJ_DATA;
  const visible = projects.filter(p => p.x != null && p.y != null);
  return (
    <div className="fl-map" style={{ background: "var(--surface-1)" }}>
      <div className="fl-map-hdr">
        <span className="h">Geographic distribution · {visible.length} projects</span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "var(--ink-2)", letterSpacing: "0.04em"
        }}>NJ / PA / TX / AL — schematic</span>
        <div style={{ flex: 1 }}></div>
        <span className="last">
          Click a pin for details
        </span>
      </div>
      <div className="fl-map-canvas">
        <div className="fl-map-grid"></div>
        <svg className="fl-map-roads" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M30,5 Q40,30 50,55 T75,95" stroke="oklch(0.84 0.006 80)" strokeWidth="1.4" fill="none" />
          <path d="M5,35 Q40,40 80,30 T98,28" stroke="oklch(0.84 0.006 80)" strokeWidth="1.2" fill="none" />
          <path d="M50,5 Q60,30 70,55 T90,95"  stroke="oklch(0.84 0.006 80)" strokeWidth="1.2" fill="none" />
        </svg>
        {visible.map(p => (
          <div key={p.id} className={`fl-map-job t-${p.type}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, cursor: "pointer" }}
            onClick={() => onOpen(p.id)}
            title={`${p.code} — ${p.name} · ${D.fmtMoney(p.value)}`}>
            <div className="dot"></div>
            <div className="lbl">{p.code.replace("PROJ", "")} · {D.fmtMoney(p.value)}</div>
          </div>
        ))}
        <div className="fl-map-legend">
          <div className="row"><span style={{
            width: 12, height: 12, background: "var(--signal)",
            borderRadius: "999px 999px 999px 0", transform: "rotate(-45deg)",
            display: "inline-block"
          }}></span>PAVING</div>
          <div className="row"><span style={{
            width: 12, height: 12, background: "var(--status-warn)",
            borderRadius: "999px 999px 999px 0", transform: "rotate(-45deg)",
            display: "inline-block"
          }}></span>EXCAVATION / PREP</div>
          <div className="row"><span style={{
            width: 12, height: 12, background: "var(--status-info)",
            borderRadius: "999px 999px 999px 0", transform: "rotate(-45deg)",
            display: "inline-block"
          }}></span>MILL / CONCRETE</div>
          <div className="row"><span style={{
            width: 12, height: 12, background: "var(--status-stop)",
            borderRadius: "999px 999px 999px 0", transform: "rotate(-45deg)",
            display: "inline-block"
          }}></span>REPAIR</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Detail drawer ───────────────────── */
function ProjectDrawer({ project, onClose }) {
  const D = window.PROJ_DATA;
  if (!project) return null;
  const sr = project.srId ? D.PEOPLE[project.srId] : null;
  const pm = project.pmId ? D.PEOPLE[project.pmId] : null;
  const t = D.TYPE_INFO[project.type];
  const stage = D.STAGES.find(s => s.key === project.stage);
  const weight = D.STAGE_WEIGHT[project.stage];

  return (
    <div className="proj-drawer" role="dialog" aria-label="Project detail">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">{project.code}</span>
          <StatusPill variant={t.tone}>{t.lbl}</StatusPill>
          <h2 className="nm">{project.name}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><PrIcons.X size={14} /></button>
        </div>
        <div className="meta">
          <Icons.Building size={11} /><span>{project.customer}</span>
          <span className="sep">·</span>
          <Icons.MapPin size={11} /><span>{project.city}, {project.state}</span>
          <span className="sep">·</span>
          <span>{stage?.label.toUpperCase()}</span>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="proj-stats">
          <div className="s">
            <span className="l">Contract value</span>
            <span className="v">{D.fmtMoney(project.value)}</span>
          </div>
          <div className="s">
            <span className="l">Weighted forecast</span>
            <span className="v">{D.fmtMoney(project.value * weight)}</span>
          </div>
          {project.pctComplete != null && (
            <div className="s">
              <span className="l">% Complete</span>
              <span className="v" style={{ color: project.late ? "var(--status-stop)" : project.pctComplete === 100 ? "var(--status-ok)" : undefined }}>
                {project.pctComplete}%
              </span>
            </div>
          )}
          {project.bidDue && (
            <div className="s">
              <span className="l">Bid due</span>
              <span className="v" style={{ color: "var(--status-warn)" }}>{project.bidDue.slice(5).replace("-", "/")}</span>
            </div>
          )}
          <div className="s">
            <span className="l">Stage</span>
            <span className="v" style={{ fontSize: 16 }}>{stage?.label}</span>
          </div>
          <div className="s">
            <span className="l">Created</span>
            <span className="v" style={{ fontSize: 14, fontFamily: "var(--font-mono)" }}>{project.createdAt}</span>
          </div>
        </div>

        <div className="proj-info-row">
          <span className="lbl">Status</span>
          <span className="val">{project.status}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Sales rep</span>
          <span className="val">{sr ? `${sr.name} (${sr.init})` : "—"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Project mgr</span>
          <span className="val">{pm ? `${pm.name} (${pm.init})` : "Not assigned"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Contract</span>
          <span className="val">{project.contract ? "✓ Executed" : "Not signed"}</span>
        </div>
        {project.startAt && (
          <div className="proj-info-row">
            <span className="lbl">Window</span>
            <span className="val">{project.startAt} → {project.endAt}</span>
          </div>
        )}
        {project.night && (
          <div className="proj-info-row">
            <span className="lbl">Notes</span>
            <span className="val" style={{ color: "var(--signal)" }}>Night work · permit window required</span>
          </div>
        )}
        <div className="proj-info-row">
          <span className="lbl">NetSuite</span>
          <span className="val" style={{ color: "var(--status-ok)" }}>✓ Synced 12s ago</span>
        </div>
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }}>
          <PrIcons.History size={12} /> Activity
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }}>
          <PrIcons.Send size={12} /> Notify customer
        </button>
        <button className="btn btn-primary" style={{ flex: 1.4 }}>
          Open in NetSuite <PrIcons.ChevR size={12} />
        </button>
      </footer>
    </div>
  );
}

window.ProjHeader = ProjHeader;
window.ProjSidebar = ProjSidebar;
window.PipelineHero = PipelineHero;
window.ProjectsKanban = ProjectsKanban;
window.ProjectsTable = ProjectsTable;
window.ProjectsTimeline = ProjectsTimeline;
window.ProjectsMap = ProjectsMap;
window.ProjectDrawer = ProjectDrawer;
window.ProjectFormDrawer = ProjectFormDrawer;
window.PrIcons = PrIcons;
