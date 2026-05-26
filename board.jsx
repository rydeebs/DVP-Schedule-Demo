// Board view — Crew Calendar (Board)
// Composes Header + Sidebar + Subheader + Hero rail + Pool + Lanes + Bench
// All exported to window.

const { useState: bUseState, useRef: bUseRef, useEffect: bUseEffect, useMemo: bUseMemo, useCallback: bUseCallback } = React;

/* ─────────────────────────── Header ─────────────────────────── */
function Header({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
        <button className="cmdk" aria-label="Open command palette">
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
        <button className="avatar" title="Aaron Vasquez · Dispatch Lead">AV</button>
      </div>
    </header>
  );
}

/* ─────────────────────────── Sidebar ─────────────────────────── */
function Sidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", badge: "BOARD", active: true, href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",      badge: "47",    href: "Crew Calendar Board.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",      badge: "",      href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",  badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", badge: "" },
      { ico: Icons.Wrench,   label: "Equipment", badge: "" },
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
function Subheader({ view, onView, date, onDate, totals }) {
  const dayLabels = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const d = date;
  const monthName = d.toLocaleString("en-US",{ month: "short" }).toUpperCase();
  return (
    <div className="subhdr">
      <div className="subhdr-title">
        <span className="date-num">{monthName} {String(d.getDate()).padStart(2,"0")}</span>
        <span className="date-day">{dayLabels[d.getDay()]} · WK 22 · {d.getFullYear()}</span>
      </div>
      <div className="date-nav">
        <button className="icon-btn" onClick={() => onDate(-1)} aria-label="Previous day"><Icons.ChevL size={14} /></button>
        <button className="filter-chip" onClick={() => onDate(0)}>TODAY</button>
        <button className="icon-btn" onClick={() => onDate(1)} aria-label="Next day"><Icons.ChevR size={14} /></button>
      </div>
      <div className="tabs">
        {["BOARD","CREW","DISPATCH","WEEK"].map((t) => (
          <button key={t} className={`tab ${view === t ? "active" : ""}`} onClick={() => onView(t)}>{t}</button>
        ))}
      </div>
      <div className="spacer"></div>
      <button className="filter-chip"><span className="dot" style={{ background: "var(--status-ok)" }}></span> ALL DIVISIONS</button>
      <button className="filter-chip"><Icons.Filter size={12} /> FILTERS · 2</button>
      <button className="btn btn-ghost"><Icons.Undo size={14} /> History</button>
      <button className="btn btn-secondary"><Icons.Plus size={14} /> Add Job</button>
      <button className="btn btn-primary">Notify Crews · {totals.notifyCount}</button>
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
        footer={<><span className="delta-up">▲ {totals.deltaSched}</span> vs. last Tue · {totals.unassigned} unassigned</>}
      />
      <HeroMetric
        label="Workers on the clock"
        value={totals.workersOn}
        sub={`/ ${totals.workersRoster}`}
        footer={<>{totals.bench} on bench · {totals.pto} PTO · <span className="delta-down">{totals.sick} sick</span></>}
      />
      <HeroMetric
        label="Fleet dispatched"
        value={totals.trucks}
        sub={`/ ${totals.fleet}`}
        footer={<>Tenna live · {totals.gpsActive} crews tracked · 0 offline</>}
      />
      <HeroMetric
        label="Forms outstanding"
        value={totals.formsOpen}
        sub="open"
        footer={<>{totals.formsOverdue} overdue · last submit 14 min ago</>}
      />
      <div className="metric-cta">
        <span className="label" style={{
          fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
          letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)"
        }}>Dispatch readiness</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 6, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: "78%", height: "100%", background: "var(--signal)" }}></div>
          </div>
          <span className="num" style={{ fontSize: 13, color: "var(--ink-0)" }}>78%</span>
        </div>
        <span className="num" style={{ fontSize: 11, color: "var(--ink-2)" }}>
          {totals.unassigned} jobs need a crew · ETA close 09:14
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────── Unassigned pool ─────────────────────────── */
function UnassignedPool({ jobs, dragHandlers, draggingId, query, setQuery }) {
  const filtered = jobs.filter(j =>
    !query ||
    j.name.toLowerCase().includes(query.toLowerCase()) ||
    j.code.toLowerCase().includes(query.toLowerCase()) ||
    j.customer.toLowerCase().includes(query.toLowerCase())
  );
  const high = filtered.filter(j => j.priority === "high");
  const med  = filtered.filter(j => j.priority === "med");
  const low  = filtered.filter(j => j.priority === "low");

  return (
    <aside className="pool">
      <div className="pool-hdr">
        <span className="h">Unassigned · Tue 05/26</span>
        <span className="c">{filtered.length} of {jobs.length}</span>
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

      <div className="lane-roster">
        {members.map(w => (
          <WorkerChip key={w.id} worker={w} state="assigned" dense />
        ))}
      </div>

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
            />
          ))
        )}
      </div>

      <footer className="lane-foot">
        <span className="total">
          {jobs.length} JOB{jobs.length === 1 ? "" : "S"} · {members.length} CREW · {crew.truckIds.length} TRUCKS
        </span>
        <button className="lane-action">+ ADD</button>
      </footer>
    </section>
  );
}

/* ─────────────────────────── Add-a-crew lane ─────────────────────────── */
function AddCrewLane() {
  return (
    <section className="lane" style={{
      border: "1px dashed var(--ink-border)",
      background: "transparent",
      width: 220,
      alignItems: "center", justifyContent: "center",
      display: "flex"
    }}>
      <button style={{
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

/* ─────────────────────────── Bench bar ─────────────────────────── */
function BenchBar({ bench }) {
  const groups = {
    available: { lbl: "AVAILABLE",  state: "available", dashed: true },
    pto:       { lbl: "PTO",        state: "unavailable" },
    sick:      { lbl: "CALLED OUT", state: "unavailable" },
    shop:      { lbl: "SHOP / YARD",state: "available" },
    training:  { lbl: "TRAINING",   state: "unavailable" },
  };
  const groupedKeys = Object.keys(groups);
  const grouped = groupedKeys.map(k => ({
    key: k,
    ...groups[k],
    workers: bench.filter(b => b.state === k),
  })).filter(g => g.workers.length > 0);

  return (
    <div className="bench">
      <div className="bench-title">
        <Icons.Users size={14} />
        BENCH
        <span className="count">{bench.length}</span>
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
      <button className="btn btn-ghost" style={{ flexShrink: 0 }}>
        <Icons.Plus size={12} /> Add to bench
      </button>
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
});
