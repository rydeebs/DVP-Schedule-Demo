// Board view — Crew Calendar (Board)
// Composes Header + Sidebar + Subheader + Hero rail + Pool + Lanes + Bench
// All exported to window.

const { useState: bUseState, useRef: bUseRef, useEffect: bUseEffect, useMemo: bUseMemo, useCallback: bUseCallback } = React;

/* ─────────────────────────── Header ─────────────────────────── */
function Header({ collapsed, onToggleSidebar, dark, onToggleDark, onCommand }) {
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
          <span>SCHEDULE</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-cur">CREW CALENDAR</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" onClick={onCommand} aria-label="Open command palette">
          <Icons.Search size={12} />
          <span>Find jobs, crews, workers…</span>
          <span className="cmdk-kbd">⌘K</span>
        </button>
        <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="badge">3</span>
        </button>
        <button className="avatar" title="Aaron Jahn · Dispatch Lead">AJ</button>
      </div>
    </header>
  );
}

/* ─────────────────────────── Sidebar ─────────────────────────── */
function Sidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", badge: "BOARD", active: true, href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",      badge: "47",    href: "Dispatch.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",      badge: "",      href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",  badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", badge: "", href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment", badge: "", href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers",   badge: "203" },
    ]},
  ];
  return (
    <aside className="app-sidebar sb">
      {items.map((g) => (
        <React.Fragment key={g.group}>
          <div className="sb-group">{g.group}</div>
          {g.entries.map((e) => (
            <a key={e.label}
              className={`sb-item ${e.active ? "active" : ""}`}
              href={e.href || "#"}
              style={{ textDecoration: "none" }}
            >
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
        <span className="sb-foot-text">REALTIME · 184 ONLINE</span>
      </div>
    </aside>
  );
}

/* ─────────────────────────── Subheader ─────────────────────────── */
function Subheader({
  view, onView, date, onDate, totals, canUndo, onUndo, onAddJob, onNotify,
  filters, filterCounts, onOpenFilters,
}) {
  const d = date;
  const dateLabel = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="subhdr">
      <div className="subhdr-title">
        <span className="date-num date-compact">{dateLabel}</span>
      </div>
      <div className="date-nav">
        <button className="icon-btn" onClick={() => onDate(-1)} aria-label="Previous day"><Icons.ChevL size={14} /></button>
        <button className="filter-chip" onClick={() => onDate(0)}>TODAY</button>
        <button className="icon-btn" onClick={() => onDate(1)} aria-label="Next day"><Icons.ChevR size={14} /></button>
      </div>
      <div className="tabs">
        {["BOARD","CREW","DISPATCH"].map((t) => (
          <button key={t} className={`tab ${view === t ? "active" : ""}`} onClick={() => onView(t)}>{t}</button>
        ))}
      </div>
      <div className="spacer"></div>
      <button
        className={`filter-chip ${filters?.division !== "all" ? "active" : ""}`}
        onClick={onOpenFilters}
      >
        <span className="dot" style={{ background: "var(--status-ok)" }}></span>
        {filters?.division === "all" ? "ALL DIVISIONS" : filters.division.toUpperCase()}
      </button>
      <button className={`filter-chip ${filterCounts?.active ? "active" : ""}`} onClick={onOpenFilters}>
        <Icons.Filter size={12} /> FILTERS · {filterCounts?.active || 0}
      </button>
      {view === "CREW" ? (
        <button
          className="btn btn-ghost"
          onClick={onUndo}
          disabled={!canUndo}
          title={canUndo ? "Undo last crew assignment" : "No crew assignment to undo"}
        >
          <Icons.Undo size={14} /> Undo
        </button>
      ) : (
        <button className="btn btn-ghost"><Icons.Undo size={14} /> History</button>
      )}
      <button className="btn btn-secondary" onClick={() => onAddJob?.()}><Icons.Plus size={14} /> Add Job</button>
      <button className="btn btn-primary" onClick={onNotify}>
        <Icons.Bell size={14} /> Notify Crews · {totals.notifyCount}
      </button>
    </div>
  );
}

function FilterPopover({ open, filters, counts, divisions, onClose, onChange, onReset }) {
  if (!open) return null;
  const statusOptions = [
    { key: "current", label: "Current", count: counts.current },
    { key: "filled", label: "Filled", count: counts.filled },
    { key: "unassigned", label: "Not assigned", count: counts.unassigned },
  ];
  const priorityOptions = [
    { key: "all", label: "All priorities" },
    { key: "high", label: "High" },
    { key: "med", label: "Medium" },
    { key: "low", label: "Low" },
  ];

  return (
    <div className="filter-popover" role="dialog" aria-label="Crew board filters">
      <div className="fp-head">
        <span>Board filters</span>
        <button className="icon-btn" onClick={onClose} aria-label="Close filters"><Icons.X size={13} /></button>
      </div>
      <div className="fp-section">
        <span className="fp-label">Job status</span>
        <div className="fp-grid">
          {statusOptions.map(opt => (
            <button
              key={opt.key}
              className={`fp-option ${filters.status === opt.key ? "active" : ""}`}
              onClick={() => onChange({ status: opt.key })}
            >
              <span>{opt.label}</span>
              <strong>{opt.count}</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="fp-section">
        <span className="fp-label">Priority</span>
        <div className="fp-grid">
          {priorityOptions.map(opt => (
            <button
              key={opt.key}
              className={`fp-option ${filters.priority === opt.key ? "active" : ""}`}
              onClick={() => onChange({ priority: opt.key })}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="fp-section">
        <span className="fp-label">Division</span>
        <div className="fp-grid">
          <button
            className={`fp-option ${filters.division === "all" ? "active" : ""}`}
            onClick={() => onChange({ division: "all" })}
          >
            <span>All divisions</span>
          </button>
          {divisions.map(div => (
            <button
              key={div}
              className={`fp-option ${filters.division === div ? "active" : ""}`}
              onClick={() => onChange({ division: div })}
            >
              <span>{div}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="fp-foot">
        <button className="btn btn-secondary" onClick={onReset}>Reset</button>
        <button className="btn btn-primary" onClick={onClose}>Apply</button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Hero metrics rail ─────────────────────────── */
function MetricsRail({ totals }) {
  return (
    <div className="metrics">
      <HeroMetric
        label="Jobs scheduled — Tue"
        value={totals.scheduled}
        sub={`of ${totals.total} active`}
      />
      <HeroMetric
        label="Workers on the clock"
        value={totals.workersOn}
        sub={`/ ${totals.workersRoster}`}
      />
      <HeroMetric
        label="Fleet dispatched"
        value={totals.trucks}
        sub={`/ ${totals.fleet}`}
      />
      <HeroMetric
        label="Forms outstanding"
        value={totals.formsOpen}
        sub="open"
      />
      <div className="metric-cta">
        <span className="label" style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)"
        }}>Dispatch readiness</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 4, background: "var(--surface-2)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "78%", height: "100%", background: "var(--signal)" }}></div>
          </div>
          <span className="num" style={{ fontSize: 12, color: "var(--ink-0)" }}>78%</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Unassigned pool ─────────────────────────── */
function UnassignedPool({
  jobs, allCount, filters, crews, dragHandlers, dropHandlers,
  draggingId, query, setQuery, onOpenJob, isDropTarget, isAssigning, snapJobId,
  onStatusFilter,
}) {
  const filtered = jobs.filter(j =>
    !query ||
    j.name.toLowerCase().includes(query.toLowerCase()) ||
    j.code.toLowerCase().includes(query.toLowerCase()) ||
    j.customer.toLowerCase().includes(query.toLowerCase())
  );
  const high = filtered.filter(j => j.priority === "high");
  const med  = filtered.filter(j => j.priority === "med");
  const low  = filtered.filter(j => j.priority === "low");
  const statusLabel = (job) => {
    const crew = job.crew ? crews.find(c => c.id === job.crew) : null;
    return crew ? `Filled · ${crew.name}` : "Not assigned";
  };

  return (
    <aside
      className={`pool ${isDropTarget ? "drop-target" : ""} ${isAssigning ? "assigning" : ""}`}
      onDragOver={(e) => dropHandlers?.onDragOver?.(e, null)}
      onDragLeave={(e) => dropHandlers?.onDragLeave?.(e, null)}
      onDrop={(e) => dropHandlers?.onDrop?.(e, null)}
    >
      <div className="pool-hdr">
        <span className="h">All jobs · Tue 05/26</span>
        <span className="c">{filtered.length} of {allCount}</span>
      </div>
      <div className="pool-tabs">
        <button className={filters.status === "current" ? "active" : ""} onClick={() => onStatusFilter?.("current")}>CURRENT</button>
        <button className={filters.status === "filled" ? "active" : ""} onClick={() => onStatusFilter?.("filled")}>FILLED</button>
        <button className={filters.status === "unassigned" ? "active" : ""} onClick={() => onStatusFilter?.("unassigned")}>NOT ASSIGNED</button>
      </div>
      <div className="pool-search">
        <Icons.Search size={12} />
        <input
          placeholder="Filter jobs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>⌘F</span>
      </div>
      <div className="pool-scroll">
        {high.length > 0 && (
          <>
            <div className="pool-section">
              <span style={{ width: 6, height: 6, background: "var(--signal)", borderRadius: 1 }}></span>
              HIGH PRIORITY · {high.length}
            </div>
            {high.map(j => (
              <JobCard key={j.id} job={j} variant="pool"
                dragHandlers={dragHandlers}
                isDragging={draggingId === j.id}
                snapIn={snapJobId === j.id}
                statusLabel={statusLabel(j)}
                onOpen={onOpenJob}
              />
            ))}
          </>
        )}
        {med.length > 0 && (
          <>
            <div className="pool-section">
              <span style={{ width: 6, height: 6, background: "var(--status-warn)", borderRadius: 1 }}></span>
              MEDIUM · {med.length}
            </div>
            {med.map(j => (
              <JobCard key={j.id} job={j} variant="pool"
                dragHandlers={dragHandlers}
                isDragging={draggingId === j.id}
                snapIn={snapJobId === j.id}
                statusLabel={statusLabel(j)}
                onOpen={onOpenJob}
              />
            ))}
          </>
        )}
        {low.length > 0 && (
          <>
            <div className="pool-section">
              <span style={{ width: 6, height: 6, background: "var(--ink-3)", borderRadius: 1 }}></span>
              LOW · {low.length}
            </div>
            {low.map(j => (
              <JobCard key={j.id} job={j} variant="pool"
                dragHandlers={dragHandlers}
                isDragging={draggingId === j.id}
                snapIn={snapJobId === j.id}
                statusLabel={statusLabel(j)}
                onOpen={onOpenJob}
              />
            ))}
          </>
        )}
        {filtered.length === 0 && (
          <div style={{
            padding: 24, textAlign: "center",
            color: "var(--ink-2)", fontFamily: "var(--font-mono)",
            fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase"
          }}>
            No matches
          </div>
        )}
      </div>
    </aside>
  );
}

/* ─────────────────────────── Crew lane (column) ─────────────────────────── */
function CrewLane({
  crew, jobs, dragHandlers, dropHandlers,
  isDropTarget, isAssigning, snapJobId,
  onOpenJob, onAddJob, onOpenCrew,
}) {
  const D = window.DATA;
  const foreman = D.lookup(crew.foremanId);
  const members = crew.workerIds.map(D.lookup).filter(Boolean);
  const totalHours = jobs.reduce((a, j) => a + (j.hours || 0), 0);
  const cap = 10; // standard 10h day
  const capPct = Math.min(100, (totalHours / cap) * 100);
  const overBooked = totalHours > cap;

  return (
    <section
      className={`lane ${isDropTarget ? "drop-target" : ""} ${isAssigning ? "assigning" : ""}`}
      onDragOver={(e) => dropHandlers.onDragOver(e, crew.id)}
      onDragLeave={(e) => dropHandlers.onDragLeave(e, crew.id)}
      onDrop={(e) => dropHandlers.onDrop(e, crew.id)}
      data-crew-id={crew.id}
    >
      <header className="lane-hdr">
        <div className="lane-name-row">
          <span className={`gps-dot ${crew.gpsActive ? "live" : "off"}`} title={crew.gpsActive ? "GPS live" : "GPS offline"}></span>
          <div className="lane-name">
            <span className="nm">{crew.name}</span>
          </div>
          <button className="icon-btn" style={{ width: 22, height: 22 }} aria-label="Crew menu">
            <Icons.Grip size={12} />
          </button>
        </div>
        <div className="lane-sub">
          <span>{crew.division.toUpperCase()}</span>
          <span className="sep">·</span>
          <span>FOREMAN {foreman?.name.toUpperCase()}</span>
        </div>
        <div className="cap-bar">
          <div className="cap-track">
            <div className="cap-fill" style={{
              width: `${capPct}%`,
              background: overBooked ? "var(--status-stop)" : capPct > 85 ? "var(--status-warn)" : "var(--signal)"
            }}></div>
          </div>
          <span className="cap-num">
            {totalHours.toFixed(0)}<span style={{ color: "var(--ink-3)" }}>/{cap}h</span>
          </span>
        </div>
      </header>

      <div className="lane-equip">
        {crew.truckIds.map(t => <EquipChip key={t} kind="truck">{t}</EquipChip>)}
        {crew.equipment.map(eq => <EquipChip key={eq} kind="equip">{eq}</EquipChip>)}
      </div>

      <div className="lane-jobs">
        {jobs.length === 0 ? (
          <div className="lane-empty">
            DROP A JOB TO ASSIGN
          </div>
        ) : (
          jobs.map(j => (
            <JobCard key={j.id} job={j}
              dragHandlers={dragHandlers}
              snapIn={snapJobId === j.id}
              onOpen={onOpenJob}
            />
          ))
        )}
      </div>

      <footer className="lane-foot">
        <button
          className="total lane-foot-summary"
          type="button"
          onClick={() => onOpenCrew?.(crew.id)}
          title="Open crew summary"
        >
          {jobs.length} JOB{jobs.length === 1 ? "" : "S"} · {members.length} CREW · {crew.truckIds.length} TRUCKS
        </button>
        <button className="lane-action" onClick={() => onAddJob?.(crew.id)}>+ ADD</button>
      </footer>
    </section>
  );
}

/* ─────────────────────────── Add-a-crew lane ─────────────────────────── */
function AddCrewLane({ onAddCrew }) {
  return (
    <section className="lane" style={{
      border: "1px dashed var(--ink-border)",
      background: "transparent",
      width: 220,
      alignItems: "center", justifyContent: "center",
      display: "flex"
    }}>
      <button onClick={onAddCrew} style={{
        background: "transparent", border: "none", cursor: "pointer",
        color: "var(--ink-2)", fontFamily: "var(--font-mono)",
        fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6
      }}>
        <Icons.Plus size={18} />
        SPAWN CREW
      </button>
    </section>
  );
}

function CommandPalette({ open, query, setQuery, jobs, crews, onClose, onOpenJob, onOpenCrew }) {
  if (!open) return null;
  const normalized = query.trim().toLowerCase();
  const crewRows = crews
    .filter(c => !normalized || `${c.name} ${c.division}`.toLowerCase().includes(normalized))
    .slice(0, 6)
    .map(c => ({ kind: "Crew", id: c.id, title: c.name, meta: c.division, onSelect: () => onOpenCrew?.(c.id) }));
  const workerRows = crews
    .flatMap(c => c.workerIds.map(id => ({ worker: window.DATA.lookup(id), crew: c })).filter(row => row.worker))
    .filter(row => !normalized || `${row.worker.name} ${row.worker.role} ${row.crew.name}`.toLowerCase().includes(normalized))
    .slice(0, 6)
    .map(row => ({
      kind: "Worker",
      id: row.worker.id,
      title: row.worker.name,
      meta: `${row.worker.role} · ${row.crew.name}`,
      onSelect: () => onOpenCrew?.(row.crew.id),
    }));
  const jobRows = jobs
    .filter(j => !normalized || `${j.code} ${j.name} ${j.customer} ${j.location}`.toLowerCase().includes(normalized))
    .slice(0, 8)
    .map(j => ({ kind: "Job", id: j.id, title: `${j.code} · ${j.name}`, meta: `${j.customer} · ${j.location}`, onSelect: () => onOpenJob?.(j) }));
  const rows = [...jobRows, ...crewRows, ...workerRows];

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="command-modal" role="dialog" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="command-search">
          <Icons.Search size={14} />
          <input
            autoFocus
            placeholder="Search jobs, crews, customers, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
        <div className="command-list">
          {rows.length === 0 ? (
            <div className="command-empty">No matches</div>
          ) : rows.map(row => (
            <button key={`${row.kind}-${row.id}`} className="command-row" onClick={() => { row.onSelect(); onClose(); }}>
              <span className="kind">{row.kind}</span>
              <span className="body">
                <strong>{row.title}</strong>
                <span>{row.meta}</span>
              </span>
              <Icons.ChevR size={12} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function JobFormDrawer({ open, crews, initialCrewId, onClose, onSave }) {
  const [form, setForm] = bUseState({
    name: "", customer: "", location: "", type: "paving",
    hours: 8, priority: "med", crew: initialCrewId || "",
  });

  bUseEffect(() => {
    if (open) {
      setForm({
        name: "", customer: "", location: "", type: "paving",
        hours: 8, priority: "med", crew: initialCrewId || "",
      });
    }
  }, [open, initialCrewId]);

  if (!open) return null;
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const canSave = form.name.trim() && form.customer.trim() && form.location.trim();

  return (
    <div className="proj-drawer add-form" role="dialog" aria-label="Add job">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">NEW JOB</span>
          <h2 className="nm">Add job to crew board</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="add-form-section">
          <div className="h">Job information</div>
          <FormField label="Job name" required>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Project or task name" />
          </FormField>
          <div className="add-form-grid-2">
            <FormField label="Customer" required>
              <input value={form.customer} onChange={(e) => setField("customer", e.target.value)} placeholder="Customer" />
            </FormField>
            <FormField label="Location" required>
              <input value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="City, ST" />
            </FormField>
          </div>
          <div className="add-form-grid-2">
            <FormField label="Type">
              <select value={form.type} onChange={(e) => setField("type", e.target.value)}>
                {Object.entries(window.DATA.JOB_TYPES).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Priority">
              <select value={form.priority} onChange={(e) => setField("priority", e.target.value)}>
                <option value="high">High</option>
                <option value="med">Medium</option>
                <option value="low">Low</option>
              </select>
            </FormField>
          </div>
          <div className="add-form-grid-2">
            <FormField label="Hours">
              <input type="number" min="1" max="16" value={form.hours} onChange={(e) => setField("hours", Number(e.target.value) || 1)} />
            </FormField>
            <FormField label="Crew">
              <select value={form.crew} onChange={(e) => setField("crew", e.target.value)}>
                <option value="">Unassigned</option>
                {crews.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>
          </div>
        </div>
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!canSave} onClick={() => onSave(form)}>Add Job</button>
      </footer>
    </div>
  );
}

function NotifyCrewsDrawer({ open, crews, jobs, departmentView, onClose, onSend }) {
  const templates = [
    {
      key: "schedule-update",
      label: "Schedule update",
      message: "Schedule update: please review the latest plan and confirm start times.",
    },
    {
      key: "start-time-change",
      label: "Start time change",
      message: "Start time change: check the updated schedule before reporting.",
    },
    {
      key: "dispatch-request",
      label: "Dispatch request",
      message: "Dispatch request: confirm crew availability and equipment readiness.",
    },
    {
      key: "safety-alert",
      label: "Safety alert",
      message: "Safety alert: review site conditions and confirm PPE before mobilizing.",
    },
    {
      key: "weather-delay",
      label: "Weather delay",
      message: "Weather delay: standby for a schedule update and check in with dispatch.",
    },
    { key: "custom", label: "Custom", message: "" },
  ];
  const deptLabelMap = {
    regional: "All crews",
    excavation: "Excavation crews",
    paving: "Paving crews",
    concrete: "Concrete crews",
    milling: "Milling crews",
    field: "Field Ops crews",
    striping: "Striping crews",
    subcontractor: "Subcontractor crews",
  };
  const [form, setForm] = bUseState({
    type: "schedule-update",
    audience: "visible",
    crewId: "",
    message: templates[0].message,
  });

  bUseEffect(() => {
    if (!open) return;
    setForm({
      type: "schedule-update",
      audience: "visible",
      crewId: "",
      message: templates[0].message,
    });
  }, [open]);

  if (!open) return null;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const visibleCrews = departmentView === "regional"
    ? crews
    : crews.filter((c) => {
      const div = (c.division || "").toLowerCase();
      if (departmentView === "excavation") return div.includes("excav");
      if (departmentView === "paving") return div.includes("paving");
      if (departmentView === "concrete") return div.includes("concrete");
      if (departmentView === "milling") return div.includes("milling");
      if (departmentView === "field") return div.includes("field ops");
      if (departmentView === "striping") return div.includes("striping");
      if (departmentView === "subcontractor") return false;
      return true;
    });
  const activeCrews = crews.filter((c) => (jobs.filter((j) => j.crew === c.id).length > 0));
  const selectedCrew = crews.find((c) => c.id === form.crewId) || null;
  const audienceLabel = {
    all: "All crews",
    visible: departmentView === "regional" ? "Visible crews" : (deptLabelMap[departmentView] || "Visible crews"),
    active: "Active crews",
    crew: selectedCrew?.name || "Selected crew",
  }[form.audience] || "Recipients";
  const audienceCount = {
    all: crews.length,
    visible: visibleCrews.length,
    active: activeCrews.length,
    crew: selectedCrew ? 1 : 0,
  }[form.audience] || 0;
  const templateLabel = {
    "schedule-update": "Schedule update",
    "start-time-change": "Start time change",
    "dispatch-request": "Dispatch request",
    "safety-alert": "Safety alert",
    "weather-delay": "Weather delay",
    custom: "Custom message",
  }[form.type];
  const canSend = form.message.trim() && audienceCount > 0;

  return (
    <div className="proj-drawer add-form notify-drawer" role="dialog" aria-label="Notify crews">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">NOTIFY</span>
          <h2 className="nm">Send crew message</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="add-form-section">
          <div className="h">Message type</div>
          <div className="notify-pills">
            {templates.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`notify-pill ${form.type === opt.key ? "active" : ""}`}
                onClick={() => {
                  setField("type", opt.key);
                  setField("message", opt.message);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="add-form-section">
          <div className="h">Recipients</div>
          <div className="add-form-grid-2">
            <FormField label="Audience">
              <select value={form.audience} onChange={(e) => setField("audience", e.target.value)}>
                <option value="visible">Visible crews</option>
                <option value="active">Active crews</option>
                <option value="all">All crews</option>
                <option value="crew">Specific crew</option>
              </select>
            </FormField>
            <FormField label="Preview">
              <input value={`${audienceLabel} · ${audienceCount} crew${audienceCount === 1 ? "" : "s"}`} readOnly />
            </FormField>
          </div>
          {form.audience === "crew" && (
            <FormField label="Crew">
              <select value={form.crewId} onChange={(e) => setField("crewId", e.target.value)}>
                <option value="">Choose crew</option>
                {crews.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>
          )}
        </div>

        <div className="add-form-section">
          <div className="h">Message</div>
          <FormField label="Text">
            <textarea
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
              placeholder="Type the notification message"
            />
          </FormField>
        </div>

        <div className="notify-summary">
          <span className="lbl">Dispatch summary</span>
          <strong>{templateLabel}</strong>
          <span>{audienceLabel} · {audienceCount} recipient{audienceCount === 1 ? "" : "s"}</span>
        </div>
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!canSend} onClick={() => onSend(form)}>
          Send Notification
        </button>
      </footer>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <label className="add-form-field">
      <span className="lbl">{label}{required && <span className="req">*</span>}</span>
      {children}
    </label>
  );
}

function BoardJobDrawer({ job, crews, onClose, onAssign }) {
  if (!job) return null;
  const t = window.DATA.JOB_TYPES[job.type];
  const crew = job.crew ? crews.find(c => c.id === job.crew) : null;
  const qty =
    job.tons ? `${job.tons} tons` :
    job.yards ? `${job.yards} yards` :
    job.sqyd ? `${job.sqyd.toLocaleString()} sq yd` :
    job.lf ? `${job.lf.toLocaleString()} linear ft` : "Not set";

  return (
    <div className="proj-drawer" role="dialog" aria-label="Job detail">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">{job.code}</span>
          <StatusPill variant={t.tone}>{t.label}</StatusPill>
          <h2 className="nm">{job.name}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
        <div className="meta">
          <Icons.Building size={11} /><span>{job.customer}</span>
          <span className="sep">·</span>
          <Icons.MapPin size={11} /><span>{job.location}</span>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="proj-stats">
          <div className="s"><span className="l">Crew</span><span className="v" style={{ fontSize: 17 }}>{crew?.name || "Unassigned"}</span></div>
          <div className="s"><span className="l">Hours</span><span className="v">{job.hours || "?"}</span></div>
          <div className="s"><span className="l">Priority</span><span className="v" style={{ fontSize: 17 }}>{job.priority}</span></div>
          <div className="s"><span className="l">Quantity</span><span className="v" style={{ fontSize: 17 }}>{qty}</span></div>
        </div>
        <div className="proj-info-row"><span className="lbl">Customer</span><span className="val">{job.customer}</span></div>
        <div className="proj-info-row"><span className="lbl">Location</span><span className="val">{job.location}</span></div>
        <div className="proj-info-row"><span className="lbl">Schedule</span><span className="val">{job.startTime ? `${job.startTime}-${job.endTime}` : `${job.hours}h unscheduled`}</span></div>
        <div className="proj-info-row"><span className="lbl">Needs</span><span className="val">{job.needs || "Crew and equipment requirements not flagged"}</span></div>
        <div className="proj-info-row"><span className="lbl">Notes</span><span className="val">{job.note || "No notes"}</span></div>
        <div className="add-form-field" style={{ marginTop: 16 }}>
          <span className="lbl">Assign crew</span>
          <select value={job.crew || ""} onChange={(e) => onAssign(job.id, e.target.value || null)}>
            <option value="">Unassigned</option>
            {crews.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Close</button>
      </footer>
    </div>
  );
}

function CrewDetailDrawer({ crew, jobs, workers, onClose, onOpenJob }) {
  if (!crew) return null;
  const D = window.DATA;
  const foreman = D.lookup(crew.foremanId);
  const totalHours = jobs.reduce((a, j) => a + (j.hours || 0), 0);
  const nextJobs = [...jobs].slice(0, 5);
  const trucks = crew.truckIds || [];
  const equipment = crew.equipment || [];
  const utilization = Math.min(100, Math.round((totalHours / 10) * 100));

  return (
    <div className="proj-drawer crew-drawer" role="dialog" aria-label="Crew detail">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">{crew.id.toUpperCase()}</span>
          <StatusPill variant={crew.gpsActive ? "ok" : "warn"}>{crew.gpsActive ? "GPS LIVE" : "GPS OFF"}</StatusPill>
          <h2 className="nm">{crew.name}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
        <div className="meta">
          <Icons.Building size={11} /><span>{crew.division}</span>
          <span className="sep">·</span>
          <Icons.Users size={11} /><span>FOREMAN {foreman?.name || "—"}</span>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="proj-stats">
          <div className="s">
            <span className="l">Jobs</span>
            <span className="v">{jobs.length}</span>
          </div>
          <div className="s">
            <span className="l">Crew</span>
            <span className="v">{workers.length}</span>
          </div>
          <div className="s">
            <span className="l">Trucks</span>
            <span className="v">{trucks.length}</span>
          </div>
          <div className="s">
            <span className="l">Load</span>
            <span className="v">{totalHours.toFixed(0)}h</span>
          </div>
        </div>
        <div className="proj-info-row"><span className="lbl">Division</span><span className="val">{crew.division}</span></div>
        <div className="proj-info-row"><span className="lbl">Foreman</span><span className="val">{foreman?.name || "—"}</span></div>
        <div className="proj-info-row"><span className="lbl">Utilization</span><span className="val">{utilization}% of 10h daily cap</span></div>
        <div className="proj-info-row"><span className="lbl">Trucks</span><span className="val">{trucks.length ? trucks.join(", ") : "None assigned"}</span></div>
        <div className="proj-info-row"><span className="lbl">Equipment</span><span className="val">{equipment.length ? equipment.join(", ") : "None assigned"}</span></div>

        <div className="cust-sub-h" style={{ marginTop: 18 }}>
          <span>Workers</span>
          <span className="c">{workers.length}</span>
        </div>
        <div className="worker-job-list crew-worker-list">
          {workers.map((w) => (
            <div key={w.id} className="worker-job-row">
              <span className="code">{w.init}</span>
              <span className="nm">{w.name}</span>
              <span className="meta">{w.role}</span>
            </div>
          ))}
        </div>

        <div className="cust-sub-h" style={{ marginTop: 18 }}>
          <span>Jobs on crew</span>
          <span className="c">{jobs.length}</span>
        </div>
        <div className="worker-job-list crew-job-list">
          {nextJobs.map((job) => (
            <button key={job.id} className="worker-job-row crew-job-row-btn" onClick={() => onOpenJob?.(job)}>
              <span className="code">{job.code}</span>
              <span className="nm">{job.name}</span>
              <span className="meta">{job.startTime || "—"} · {job.priority?.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Close</button>
      </footer>
    </div>
  );
}

function WorkerDrawer({ worker, crews, bench, jobs, onClose }) {
  if (!worker) return null;
  const D = window.DATA;
  const crew = crews.find((c) => c.workerIds.includes(worker.id)) || null;
  const benchEntry = bench.find((b) => b.workerId === worker.id) || null;
  const homeCrew = crew ? D.lookup(crew.foremanId) : null;
  const crewJobs = crew ? jobs.filter((j) => j.crew === crew.id) : [];
  const statusLabel = crew
    ? "Assigned"
    : benchEntry
    ? (benchEntry.state || "available").replace(/_/g, " ")
    : "Unassigned";
  const statusTone = crew ? "ok" : benchEntry?.state === "pto" || benchEntry?.state === "sick" ? "warn" : "info";

  return (
    <div className="proj-drawer worker-drawer" role="dialog" aria-label="Worker detail">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">{worker.id}</span>
          <StatusPill variant={statusTone}>{statusLabel.toUpperCase()}</StatusPill>
          <h2 className="nm">{worker.name}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
        <div className="meta">
          <Icons.Users size={11} /><span>{worker.role}</span>
          <span className="sep">·</span>
          <Icons.Building size={11} /><span>{crew ? crew.division : "Bench / unassigned"}</span>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="proj-stats">
          <div className="s">
            <span className="l">Crew</span>
            <span className="v" style={{ fontSize: 17 }}>{crew?.name || "Unassigned"}</span>
          </div>
          <div className="s">
            <span className="l">Foreman</span>
            <span className="v" style={{ fontSize: 17 }}>{homeCrew?.name || crew?.name || "—"}</span>
          </div>
          <div className="s">
            <span className="l">Certs</span>
            <span className="v" style={{ fontSize: 17 }}>{worker.cert?.join(", ") || "None"}</span>
          </div>
          <div className="s">
            <span className="l">Status</span>
            <span className="v" style={{ fontSize: 17 }}>{statusLabel}</span>
          </div>
        </div>

        <div className="proj-info-row">
          <span className="lbl">Worker</span>
          <span className="val">{worker.name}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Role</span>
          <span className="val">{worker.role}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Crew</span>
          <span className="val">{crew ? crew.name : "Unassigned"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Division</span>
          <span className="val">{crew?.division || "Bench / unassigned"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Crew size</span>
          <span className="val">{crew ? crew.workerIds.length : 0}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Crew jobs</span>
          <span className="val">{crew ? `${crewJobs.length} active job${crewJobs.length === 1 ? "" : "s"}` : "No assigned jobs"}</span>
        </div>
        {benchEntry && (
          <div className="proj-info-row">
            <span className="lbl">Bench note</span>
            <span className="val">{benchEntry.note || "Unassigned worker"}</span>
          </div>
        )}
        {crewJobs.length > 0 && (
          <>
            <div className="cust-sub-h" style={{ marginTop: 18 }}>
              <span>Assigned Jobs</span>
              <span className="c">{crewJobs.length}</span>
            </div>
            <div className="worker-job-list">
              {crewJobs.map((job) => (
                <div key={job.id} className="worker-job-row" title={job.name}>
                  <span className="code">{job.code}</span>
                  <span className="nm">{job.name}</span>
                  <span className="meta">{job.startTime ? `${job.startTime}–${job.endTime}` : `${job.hours}h`}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Close</button>
      </footer>
    </div>
  );
}

/* ─────────────────────────── Bench bar ─────────────────────────── */
function BenchBar({ bench, onAddBench, onOpenWorker }) {
  const [query, setQuery] = bUseState("");
  const groups = {
    available: { lbl: "UNASSIGNED", state: "available", dashed: true },
    pto:       { lbl: "PTO",        state: "unavailable" },
    sick:      { lbl: "CALLED OUT", state: "unavailable" },
    shop:      { lbl: "SHOP / YARD",state: "available" },
    training:  { lbl: "TRAINING",   state: "unavailable" },
  };
  const normalizedQuery = query.trim().toLowerCase();
  const filteredBench = normalizedQuery
    ? bench.filter(w => `${w.name} ${w.role}`.toLowerCase().includes(normalizedQuery))
    : bench;
  const groupedKeys = Object.keys(groups);
  const grouped = groupedKeys.map(k => ({
    key: k,
    ...groups[k],
    workers: filteredBench.filter(b => b.state === k),
  })).filter(g => g.workers.length > 0);

  return (
    <div className="bench">
      <div className="bench-title">
        <Icons.Users size={14} />
        UNASSIGNED
        <span className="count">{filteredBench.length}</span>
      </div>
      <div className="bench-search">
        <Icons.Search size={12} />
        <input
          placeholder="Search workers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {grouped.map((g, i) => (
        <React.Fragment key={g.key}>
          <div className="bench-group">
            <span className="lbl">{g.lbl} · {g.workers.length}</span>
            <div className="chips">
              {g.workers.map(w => (
                <WorkerChip key={w.workerId}
                  worker={{ init: w.init, name: w.name, role: w.role, cert: [] }}
                  state={g.state}
                  dashed={g.dashed}
                  onClick={() => onOpenWorker?.({ id: w.workerId, name: w.name, role: w.role, init: w.init, cert: [], state: w.state, note: w.note })}
                />
              ))}
            </div>
          </div>
          {i < grouped.length - 1 && (
            <div style={{ width: 1, height: 28, background: "var(--ink-border)", alignSelf: "center", flexShrink: 0 }}></div>
          )}
        </React.Fragment>
      ))}
      <div style={{ flex: 1 }}></div>
      <button className="btn btn-ghost" style={{ flexShrink: 0 }} onClick={onAddBench}>
        <Icons.Plus size={12} /> Add to bench
      </button>
    </div>
  );
}

function BenchWorkerDrawer({ open, onClose, onSave }) {
  const [form, setForm] = bUseState({
    name: "",
    role: "laborer",
    state: "available",
  });

  bUseEffect(() => {
    if (open) setForm({ name: "", role: "laborer", state: "available" });
  }, [open]);

  if (!open) return null;
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const canSave = form.name.trim();

  return (
    <div className="proj-drawer add-form" role="dialog" aria-label="Add bench worker">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">BENCH</span>
          <h2 className="nm">Add worker to bench</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
      </header>
      <div className="proj-drawer-body">
        <div className="add-form-section">
          <div className="h">Worker information</div>
          <FormField label="Worker name" required>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Full name" />
          </FormField>
          <div className="add-form-grid-2">
            <FormField label="Role">
              <select value={form.role} onChange={(e) => setField("role", e.target.value)}>
                <option value="laborer">Laborer</option>
                <option value="operator">Operator</option>
                <option value="foreman">Foreman</option>
                <option value="cdl driver">CDL Driver</option>
                <option value="mason">Mason</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select value={form.state} onChange={(e) => setField("state", e.target.value)}>
                <option value="available">Available</option>
                <option value="shop">Shop / yard</option>
                <option value="training">Training</option>
                <option value="pto">PTO</option>
                <option value="sick">Called out</option>
              </select>
            </FormField>
          </div>
        </div>
      </div>
      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!canSave} onClick={() => onSave(form)}>Add Worker</button>
      </footer>
    </div>
  );
}

/* ─────────────────────────── Undo toast ─────────────────────────── */
function UndoToast({ toast, onUndo }) {
  if (!toast) return null;
  return (
    <div className="toast-wrap">
      <div className="toast">
        <span className="t-time">{toast.time}</span>
        <span className="t-msg" dangerouslySetInnerHTML={{ __html: toast.msg }}></span>
        <button className="t-undo" onClick={onUndo}>
          <Icons.Undo size={12} />
          UNDO
          <span className="t-kbd">⌘Z</span>
        </button>
        <div className="toast-prog" key={toast.id}></div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Header, Sidebar, Subheader, MetricsRail,
  UnassignedPool, CrewLane, AddCrewLane, BenchBar, UndoToast,
  FilterPopover, CommandPalette, JobFormDrawer, BenchWorkerDrawer, BoardJobDrawer, CrewDetailDrawer, NotifyCrewsDrawer,
});
