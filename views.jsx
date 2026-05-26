// Crew (weekly grid) + Dispatch views. Continue the Industrial Utilitarian system.

const { useState: vUseState, useMemo: vUseMemo, useRef: vUseRef } = React;

/* ──────────────────────────────────────────────────────────────────
   Weather glyph — tiny inline SVG, no emoji per design system §10
   ────────────────────────────────────────────────────────────────── */
function WxGlyph({ kind = "sun", size = 12 }) {
  if (kind === "sun") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (kind === "cloud") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11.7 2A4 4 0 0 0 6 18Z" />
      </svg>
    );
  }
  // rain
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 14a4 4 0 0 0 0-8 6 6 0 0 0-11.7 2A4 4 0 0 0 6 14Z" />
      <path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────
   CrewView — Crew rows × 7 day columns weekly grid
   ────────────────────────────────────────────────────────────────── */
function CrewView({
  crews, scheduleByCrew, dropHandlers, dragHandlers,
  isDropTarget, snapJobId,
  onOpenJob, onAddJob,
}) {
  const D = window.DATA;
  const WEEK = D.WEEK_DAYS;
  const TODAY_IDX = 2; // Tue May 26 2026

  const allJobsById = vUseMemo(() => {
    const m = {};
    D.ALL_JOBS.forEach(j => { m[j.id] = j; });
    return m;
  }, []);

  return (
    <div className="weekgrid">
      <div className="weekgrid-scroll">
        <div className="weekgrid-table">
          <div className="wg-corner">
            <span className="h">DVP / EXCAVATION</span>
            <span className="sub">WK 22 · MAY 24 – 30, 2026</span>
            <span className="sub" style={{ color: "var(--ink-2)" }}>{crews.length} CREWS · 7 DAYS</span>
          </div>
          {WEEK.map((d, i) => (
            <div key={d.key} className={`wg-head ${i === TODAY_IDX ? "today" : ""}`}>
              <span className="dow">
                {d.key}
                {i === TODAY_IDX && <span style={{ color: "var(--signal)", fontSize: 9 }}>TODAY</span>}
              </span>
              <span className="dnum">{d.date}</span>
              <span className="wx">
                <WxGlyph kind={d.wx} size={11} />
                <span className="hi">{d.hi}°</span>
                <span style={{ color: "var(--ink-3)" }}>/</span>
                <span className="lo">{d.lo}°</span>
              </span>
            </div>
          ))}

          {crews.map((c) => {
            const sched = scheduleByCrew[c.id] || {};
            const totalHrs = Object.values(sched).flat()
              .reduce((a, b) => a + (b.hours || 0), 0);
            return (
              <React.Fragment key={c.id}>
                <div className="wg-crew">
                  <div className="row1">
                    <span className={`gps-dot ${c.gpsActive ? "live" : "off"}`}></span>
                    <span className="nm">{c.name.replace(/^Crew \d+ — /, "")}</span>
                  </div>
                  <span className="sub2">{c.division.toUpperCase()} · {c.workerIds.length} CREW</span>
                  <div className="stat-row">
                    <span>{totalHrs}H WK</span>
                    <span className="pip">·</span>
                    <span>{c.truckIds.length} TRUCKS</span>
                    <span className="pip">·</span>
                    <span>{c.equipment.length} EQ</span>
                  </div>
                </div>
                {WEEK.map((d, i) => {
                  const items = sched[d.idx] || [];
                  const isWk = d.idx === 0 || d.idx === 6;
                  const isToday = i === TODAY_IDX;
                  const isDrop = isDropTarget === `${c.id}:${d.idx}`;
                  const totalDay = items.reduce((a, b) => a + b.hours, 0);
                  const over = totalDay > 12;
                  return (
                    <div
                      key={d.key}
                      className={`wg-day ${isWk ? "weekend" : ""} ${isToday ? "today" : ""} ${isDrop ? "drop-target" : ""}`}
                      onDragOver={(e) => dropHandlers.onDragOver(e, `${c.id}:${d.idx}`)}
                      onDragLeave={(e) => dropHandlers.onDragLeave(e, `${c.id}:${d.idx}`)}
                      onDrop={(e) => dropHandlers.onDrop(e, c.id, d.idx)}
                    >
                      {items.length === 0 && !isWk && (
                        <div style={{
                          fontFamily: "var(--font-mono)", fontSize: 10,
                          color: "var(--ink-3)", letterSpacing: "0.06em",
                          padding: "4px 6px"
                        }}>
                          —
                        </div>
                      )}
                      {items.map((item, idx) => {
                        const job = allJobsById[item.jobId];
                        if (!job) return null;
                        return (
                          <div
                            key={`${item.jobId}-${idx}`}
                            className={`wg-block t-${job.type} ${snapJobId === item.jobId ? "snap-in" : ""}`}
                            draggable
                            onDragStart={(e) => dragHandlers?.onDragStart?.(e, job)}
                            onDragEnd={(e) => dragHandlers?.onDragEnd?.(e, job)}
                            onClick={() => onOpenJob?.(job)}
                          >
                            <span className="code">{job.code}</span>
                            <span className="nm">{job.name.replace(/ — .*$/, "")}</span>
                            <span className="ft">
                              <span>{item.hours}h</span>
                              {item.night && <span className="night">· NIGHT</span>}
                              {over && idx === 0 && <span className="ovr">· OVER</span>}
                            </span>
                          </div>
                        );
                      })}
                      <button className="wg-add" onClick={() => onAddJob?.(c.id)}>+ ADD</button>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   DispatchView — Equipment / Trucking / Materials tabs + Map sidebar
   ────────────────────────────────────────────────────────────────── */
function DispatchView({ jobs, crews, mapOnly, onToggleMap, onAddJob, onOpenJob, onNotify }) {
  const D = window.DATA;
  const [tab, setTab] = vUseState("equipment");

  // Today's scheduled jobs (those with a crew)
  const todays = jobs.filter(j => j.crew);

  const tabs = [
    { key: "equipment", label: "Equipment", count: todays.reduce((a,j)=> a + (D.DISPATCH[j.id]?.equipment?.length || 0), 0) },
    { key: "trucking",  label: "Trucking",  count: todays.reduce((a,j)=> a + (D.DISPATCH[j.id]?.trucking?.length  || 0), 0) },
    { key: "materials", label: "Materials", count: todays.reduce((a,j)=> a + (D.DISPATCH[j.id]?.materials?.length || 0), 0) },
  ];

  // Detect conflicts (same truck used twice across all jobs)
  const conflicts = vUseMemo(() => {
    const usage = {};
    todays.forEach(j => {
      const d = D.DISPATCH[j.id];
      if (!d) return;
      (d.equipment || []).forEach(e => {
        usage[e.asset] = (usage[e.asset] || []);
        usage[e.asset].push(j.code);
      });
      (d.trucking || []).forEach(t => {
        usage[t.truck] = (usage[t.truck] || []);
        usage[t.truck].push(j.code);
      });
    });
    return usage;
  }, [todays]);

  return (
    <section className="dispatch">
      <div className="dispatch-list">
        <div className="dispatch-sub" style={{ marginBottom: 4, borderRadius: "var(--r)", border: "1px solid var(--ink-border)" }}>
          {tabs.map(t => (
            <button key={t.key}
              className={`disp-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}>
              {t.label.toUpperCase()}
              <span className="cnt">{t.count}</span>
            </button>
          ))}
          <div style={{ flex: 1 }}></div>
          <button className="filter-chip" onClick={onToggleMap}>
            <Icons.Map size={12} />
            {mapOnly ? "LIST VIEW" : "MAP VIEW"}
          </button>
          <button className="btn btn-secondary" onClick={onNotify}>
            <Icons.Bell size={12} /> Notify Drivers · {tabs[1].count}
          </button>
          <button className="btn btn-primary" onClick={() => onAddJob?.()}>
            <Icons.Plus size={12} /> Add Job
          </button>
        </div>

        {todays.length === 0 ? (
          <DispatchEmpty />
        ) : (
          todays.map(j => (
            <DispatchJob
              key={j.id}
              job={j}
              crews={crews}
              tab={tab}
              conflicts={conflicts}
              onOpenJob={onOpenJob}
              onAddJob={onAddJob}
            />
          ))
        )}
      </div>

      <aside className="dispatch-side">
        <div className="map-hdr">
          <span className="h">Live fleet · 47 of 62 dispatched</span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--status-ok)", letterSpacing: "0.06em",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <span className="gps-dot live"></span>
            TENNA LIVE
          </span>
        </div>
        <div className="map">
          {/* Stylized "map" with NJ-shaped distribution of pins */}
          {[
            { id: "j01", x: 38, y: 55, t: "paving", lbl: "P-2419" },
            { id: "j02", x: 22, y: 40, t: "excav",  lbl: "X-1180" },
            { id: "j03", x: 60, y: 32, t: "conc",   lbl: "C-0742" },
            { id: "j04", x: 30, y: 65, t: "paving", lbl: "P-2418" },
            { id: "j05", x: 48, y: 78, t: "mill",   lbl: "M-1102" },
          ].map(p => (
            <div key={p.id} className={`map-pin t-${p.t}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <div className="dot"></div>
              <div className="label">{p.lbl}</div>
            </div>
          ))}
          {/* GPS truck dots */}
          {[
            { x: 28, y: 48 }, { x: 33, y: 52 }, { x: 44, y: 60 },
            { x: 53, y: 70 }, { x: 26, y: 42 }, { x: 62, y: 35 },
          ].map((p, i) => (
            <div key={i} className="map-truck" style={{ left: `${p.x}%`, top: `${p.y}%` }}></div>
          ))}
          <div style={{
            position: "absolute", bottom: 12, left: 12,
            background: "var(--surface-0)", border: "1px solid var(--ink-border)",
            padding: "6px 8px", borderRadius: "var(--r)",
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--ink-1)", letterSpacing: "0.06em",
            display: "flex", flexDirection: "column", gap: 3
          }}>
            <span style={{ color: "var(--ink-2)" }}>FLEET</span>
            <span><span className="gps-dot live" style={{ marginRight: 4 }}></span>47 ONLINE</span>
            <span style={{ color: "var(--ink-2)" }}><span style={{
              display: "inline-block", width: 6, height: 6, background: "var(--ink-3)",
              borderRadius: "50%", marginRight: 4, verticalAlign: "middle"
            }}></span>15 OFFLINE</span>
          </div>
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "var(--surface-0)", border: "1px solid var(--ink-border)",
            padding: "6px 8px", borderRadius: "var(--r)",
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--ink-1)", letterSpacing: "0.06em",
          }}>
            INTEGRATIONS: TENNA · GOOGLE MAPS
          </div>
        </div>
      </aside>
    </section>
  );
}

function DispatchEmpty() {
  return (
    <div style={{
      padding: 48, textAlign: "center",
      border: "1px dashed var(--ink-border)",
      borderRadius: "var(--r)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      background: "var(--surface-1)",
    }}>
      <Icons.Truck size={28} />
      <div style={{ fontSize: 17, color: "var(--ink-0)" }}>No jobs dispatched for this date</div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 12,
        color: "var(--ink-2)", letterSpacing: "0.04em",
        maxWidth: 380
      }}>
        Assign a crew on the Board view, or import yesterday's dispatch and adjust.
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button className="btn btn-secondary">
          <Icons.Undo size={12} /> Copy yesterday
        </button>
        <button className="btn btn-primary">
          <Icons.Plus size={12} /> New job dispatch
        </button>
      </div>
    </div>
  );
}

function DispatchJob({ job, crews, tab, conflicts, onOpenJob, onAddJob }) {
  const D = window.DATA;
  const crew = crews.find(c => c.id === job.crew);
  const d = D.DISPATCH[job.id];
  const t = D.JOB_TYPES[job.type];

  const rows = !d ? [] :
    tab === "equipment" ? d.equipment :
    tab === "trucking"  ? d.trucking  :
    d.materials;

  return (
    <article className="dj">
      <header className="dj-hdr">
        <span className="code">{job.code}</span>
        <StatusPill variant={t.tone}>{t.label}</StatusPill>
        <span className="nm">{job.name}</span>
        <div style={{ flex: 1 }}></div>
        <span className="meta">
          <Icons.Clock size={11} style={{ verticalAlign: -2, marginRight: 3 }} />
          {job.startTime}–{job.endTime}
        </span>
        <span className="meta" style={{ color: "var(--ink-1)" }}>
          {crew?.name.replace(/^Crew \d+ — /, "") || "—"}
        </span>
        <button className="icon-btn" onClick={() => onOpenJob?.(job)} aria-label="Open job">
          <Icons.ChevR size={14} />
        </button>
      </header>

      <div className="dj-rows">
        {!d || rows.length === 0 ? (
          <div style={{
            padding: 20, textAlign: "center",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--ink-3)", letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}>
            No {tab} dispatched yet
          </div>
        ) : (
          rows.map((r, i) => (
            <DispatchRow key={i} kind={tab} row={r} jobCode={job.code} conflicts={conflicts} idx={i} />
          ))
        )}
      </div>

      <footer className="dj-foot">
        <span>{tab.toUpperCase()} · {rows.length} ASSIGNED</span>
        <span className="spc"></span>
        <button className="add" onClick={() => onOpenJob?.(job)}><Icons.Plus size={10} style={{ verticalAlign: -1, marginRight: 2 }} /> ADD {tab.toUpperCase().replace(/S$/,"")}</button>
        <button className="add" onClick={() => onAddJob?.(job.crew)}>DUPLICATE FROM {job.code}</button>
      </footer>
    </article>
  );
}

function DispatchRow({ kind, row, jobCode, conflicts, idx }) {
  const D = window.DATA;
  if (kind === "equipment") {
    const driver = D.lookup(row.driverId);
    const conflict = conflicts[row.asset]?.length > 1;
    return (
      <div className={`dj-row ${conflict ? "has-conflict" : ""}`}>
        <span className="ix">{String(idx+1).padStart(2,"0")}</span>
        <span className="cell-prim">{row.name}</span>
        <span className="cell-secondary cell-asset">{row.asset}</span>
        <span className="cell-secondary">
          {driver ? `${driver.name} · ${driver.cert?.join(", ") || ""}` : "—"}
        </span>
        <span className="cell-num">{row.note || ""}</span>
        <span className="cell-status">
          {conflict
            ? <StatusPill variant="stop">CONFLICT</StatusPill>
            : <StatusPill variant="ok">READY</StatusPill>}
        </span>
      </div>
    );
  }
  if (kind === "trucking") {
    const driver = D.lookup(row.driverId);
    const conflict = conflicts[row.truck]?.length > 1;
    return (
      <div className={`dj-row ${conflict ? "has-conflict" : ""}`}>
        <span className="ix">{String(idx+1).padStart(2,"0")}</span>
        <span className="cell-prim">{row.truck} · {row.material}</span>
        <span className="cell-secondary">{driver?.name || "—"}</span>
        <span className="cell-secondary">{row.route}</span>
        <span className="cell-num">{row.loads} LOADS</span>
        <span className="cell-status">
          {conflict
            ? <StatusPill variant="stop">CONFLICT</StatusPill>
            : <StatusPill variant="ok">DISPATCHED</StatusPill>}
        </span>
      </div>
    );
  }
  // materials
  return (
    <div className="dj-row">
      <span className="ix">{String(idx+1).padStart(2,"0")}</span>
      <span className="cell-prim">{row.mat}</span>
      <span className="cell-secondary">{row.supplier}</span>
      <span className="cell-secondary">{row.window}</span>
      <span className="cell-num">{row.qty}</span>
      <span className="cell-status">
        {row.status === "stop"
          ? <StatusPill variant="stop">{row.noteShort || "DELAY"}</StatusPill>
          : row.status === "warn"
          ? <StatusPill variant="warn">{row.noteShort || "WATCH"}</StatusPill>
          : <StatusPill variant="ok">CONFIRMED</StatusPill>}
      </span>
    </div>
  );
}

Object.assign(window, {
  CrewView, DispatchView, WxGlyph,
});
