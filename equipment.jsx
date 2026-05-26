// Equipment — Inventory / By Type / Map views + bulk-assign + detail drawer
// Continues the Industrial Utilitarian system.
// Demonstrated interaction: bulk-select table rows → assign to job

const { useState: eUseState, useEffect: eUseEffect, useMemo: eUseMemo, useRef: eUseRef, useCallback: eUseCallback } = React;

const EqIcons = {
  Wrench:   (p) => <Ico {...p} d="M14.7 6.3a4 4 0 0 0 5 5L18 13l-7 7-3-3 7-7 1.7-3.7Z" />,
  Paver:    (p) => <Ico {...p} d={["M3 12h18v6H3z","M5 12V8h8v4","M8 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Roller:   (p) => <Ico {...p} d={["M4 14a4 4 0 0 1 0-8h12a4 4 0 0 1 0 8h-2v3H6v-3H4Z","M20 18h-3"]} />,
  Mill:     (p) => <Ico {...p} d={["M3 13h18v5H3z","M6 13V7h12v6","M8 7V4h8v3"]} />,
  Excavator:(p) => <Ico {...p} d={["M3 19h18","M5 19v-4h6v4","M11 15l3-3 5 1-3 5","M14 12l1-4 4 1","M7 12h2v3H7z"]} />,
  Loader:   (p) => <Ico {...p} d={["M2 18h20","M4 18v-3h8v3","M12 15l5-3h4v6","M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Truck:    (p) => <Ico {...p} d={["M3 7h11v9H3z","M14 10h4l3 3v3h-7","M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Sweeper:  (p) => <Ico {...p} d={["M14 7l4 12","M10 7l-4 12","M3 19h18","M9 7h6","M11 4h2v3h-2z"]} />,
  Plus:     (p) => <Ico {...p} d={["M12 5v14","M5 12h14"]} />,
  X:        (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Search:   (p) => <Ico {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z","M21 21l-4.3-4.3"]} />,
  Check:    (p) => <Ico {...p} d="M4 12l5 5 11-11" />,
  Table:    (p) => <Ico {...p} d={["M3 4h18v16H3z","M3 9h18","M3 14h18","M9 4v16","M15 4v16"]} />,
  Stack:    (p) => <Ico {...p} d={["M3 8l9 5 9-5-9-5-9 5Z","M3 12l9 5 9-5","M3 16l9 5 9-5"]} />,
  Map:      (p) => <Ico {...p} d={["M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3Z","M9 4v13","M15 7v13"]} />,
  Send:     (p) => <Ico {...p} d={["M22 2 11 13","M22 2l-7 20-4-9-9-4 20-7Z"]} />,
  ChevR:    (p) => <Ico {...p} d="M9 6l6 6-6 6" />,
  ChevD:    (p) => <Ico {...p} d="M6 9l6 6 6-6" />,
  Download: (p) => <Ico {...p} d={["M4 17v3h16v-3","M12 4v10","M7 9l5 5 5-5"]} />,
  Pin:      (p) => <Ico {...p} d={["M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z","M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Filter:   (p) => <Ico {...p} d="M3 5h18l-7 9v6l-4-2v-4L3 5Z" />,
};

function typeIcon(type, size = 14) {
  const map = {
    paver: EqIcons.Paver, roller: EqIcons.Roller, dirtRoll: EqIcons.Roller,
    mill: EqIcons.Mill, excavator: EqIcons.Excavator, backhoe: EqIcons.Excavator,
    dozer: EqIcons.Loader, loader: EqIcons.Loader, haul: EqIcons.Truck,
    sweeper: EqIcons.Sweeper, striper: EqIcons.Truck, trowel: EqIcons.Wrench,
  };
  const I = map[type] || EqIcons.Wrench;
  return <I size={size} />;
}

/* ───────────────────── Header / Sidebar ───────────────────── */
function EqHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span className="crumb-cur">EQUIPMENT</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <EqIcons.Search size={12} />
          <span>Find by ID, type, job…</span>
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

function EqSidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar",   href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",        badge: "47", href: "Crew Calendar Board.html" },
      { ico: Icons.Map,      label: "Fleet Tracking",  badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",      href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",   badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers" },
      { ico: Icons.Wrench,   label: "Equipment",  badge: "ACTIVE", active: true, href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers",   badge: "203" },
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
        <span className="sb-foot-text">36 ASSETS · {window.EQ_DATA.STATS.utilization}% UTIL</span>
      </div>
    </aside>
  );
}

/* ───────────────────── Hero strip ───────────────────── */
function EqHero({ stats, fleetValue, statusFilter, onStatus }) {
  const D = window.EQ_DATA;
  return (
    <div className="eq-hero">
      <div className="cell bold">
        <span className="l">Fleet value · owned</span>
        <span className="v">{D.fmtMoney(stats.fleetValue)}<span className="sub">/ {stats.owned} assets</span></span>
        <span className="f">+ {stats.rented} rental{stats.rented > 1 ? "s" : ""} · ~$5.4k/wk</span>
      </div>
      <div className="cell">
        <span className="l">Utilization · today</span>
        <span className="v ok">{stats.utilization}<span className="sub">%</span></span>
        <span className="f">{stats.onSite} on site of {stats.total - stats.inService} deployable</span>
      </div>
      <div className="cell">
        <span className="l">At yard</span>
        <span className="v warn">{stats.atYard}</span>
        <span className="f">{stats.idleAssets} idle &gt; 14 days · review utilization</span>
      </div>
      <div className="cell">
        <span className="l">In service</span>
        <span className="v stop">{stats.inService}</span>
        <span className="f">{stats.serviceOpen} open tickets · 2 high priority</span>
      </div>
      <div className="cell">
        <span className="l">In transit</span>
        <span className="v">{stats.inTransit}</span>
        <span className="f">en route to active sites</span>
      </div>
    </div>
  );
}

/* ───────────────────── Inventory table ───────────────────── */
function InventoryTable({ equipment, selected, toggle, selectAll, clearAll, onOpen, allSelected }) {
  const D = window.EQ_DATA;

  return (
    <div className="eq-table-wrap">
      <table className="eq-table">
        <thead>
          <tr>
            <th style={{ width: 28 }}>
              <div className={`eq-cb ${allSelected ? "on" : ""}`}
                onClick={(e) => { e.stopPropagation(); allSelected ? clearAll() : selectAll(); }}>
                {allSelected && <EqIcons.Check size={11} />}
              </div>
            </th>
            <th>ASSET</th>
            <th>STATUS</th>
            <th>CURRENT JOB</th>
            <th>SINCE</th>
            <th>UTIL · 30D</th>
            <th style={{ textAlign: "right" }}>HOURLY RATE</th>
            <th>NEXT SERVICE</th>
            <th>GPS</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(e => <EqRow key={e.id} eq={e}
            selected={!!selected[e.id]}
            onToggle={() => toggle(e.id)}
            onOpen={() => onOpen(e.id)} />)}
        </tbody>
      </table>
      {equipment.length === 0 && (
        <div style={{
          padding: 48, textAlign: "center",
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--ink-3)", letterSpacing: "0.06em",
          textTransform: "uppercase"
        }}>
          No equipment matches this filter
        </div>
      )}
    </div>
  );
}

function EqRow({ eq, selected, onToggle, onOpen }) {
  const D = window.EQ_DATA;
  const job = eq.jobId ? D.JOBS.find(j => j.id === eq.jobId) : null;
  const days = D.daysSince(eq.since);
  const status = D.STATUS[eq.status];
  const sinceCls = (eq.status === "yard" && days > 14) ? "stop" :
                   (eq.status === "yard" && days > 7) ? "warn" : "";

  // Utilization synthetic: active = high, transit = med, yard = low, service = 0
  const util = eq.status === "active" ? 78 + (eq.id.charCodeAt(3) % 18) :
               eq.status === "transit" ? 55 :
               eq.status === "rental" ? 88 :
               eq.status === "yard" ? Math.max(0, 30 - days) :
               0;
  const utilCls = util >= 70 ? "" : util >= 40 ? "warn" : "stop";

  const svcDays = eq.svcDue ? D.daysSince(eq.svcDue) : null;
  const svcCls = svcDays == null ? "" : svcDays > 0 ? "over" : svcDays > -14 ? "due" : "";

  return (
    <tr className={selected ? "selected" : ""} onClick={(e) => {
      if (e.target.closest(".eq-cb")) return;
      onOpen();
    }}>
      <td>
        <div className={`eq-cb ${selected ? "on" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          {selected && <EqIcons.Check size={11} />}
        </div>
      </td>
      <td>
        <div className="eq-asset-cell">
          <div className="ki">{typeIcon(eq.type, 14)}</div>
          <div style={{ minWidth: 0 }}>
            <div className="nm">
              <span className="id-num">{eq.num}</span>
              {eq.make} {eq.model}
            </div>
            <span className="desc">{D.TYPES[eq.type]?.lbl} · {eq.year} · {eq.ownership === "rented" ? "RENTED" : "OWNED"}</span>
          </div>
        </div>
      </td>
      <td><StatusPill variant={status.tone}>{status.lbl}</StatusPill></td>
      <td>
        <div className={`eq-job-cell ${eq.status === "yard" || eq.status === "service" ? "idle" : ""}`}>
          <span className="code">{job?.code || ""}</span>
          <div className="nm">{job?.name || (eq.status === "service" ? "Out of service" : "—")}</div>
        </div>
      </td>
      <td>
        <div className={`eq-since-cell ${sinceCls}`}>
          <span className="v">{days}</span>
          <span className="lbl">DAYS</span>
        </div>
      </td>
      <td>
        <div className="eq-util-cell">
          <div className="bar"><div className={`fill ${utilCls}`} style={{ width: `${util}%` }}></div></div>
          <div className="meta">
            <span className="pct">{util}%</span>
            <span>{Math.round(util * 0.3)}d on</span>
          </div>
        </div>
      </td>
      <td className="eq-rate-cell">{D.fmtRate(eq.rate)}</td>
      <td className={`eq-svc-cell ${svcCls}`}>
        {eq.svcDue ? (svcDays > 0 ? `${svcDays}d OVERDUE` :
                    svcDays > -14 ? `${-svcDays}d` :
                    eq.svcDue.slice(5).replace("-", "/")) : (eq.status === "service" ? "IN SHOP" : "—")}
      </td>
      <td>
        <span className={`eq-gps-cell ${eq.gps ? "live" : "off"}`}>
          {eq.gps ? <><span className="gps-dot live"></span>TENNA</> : "—"}
        </span>
      </td>
    </tr>
  );
}

/* ───────────────────── By Type view ───────────────────── */
function ByTypeView({ equipment, onOpen }) {
  const D = window.EQ_DATA;
  const byType = eUseMemo(() => {
    const m = {};
    equipment.forEach(e => { (m[e.type] ||= []).push(e); });
    return m;
  }, [equipment]);

  const orderedTypes = Object.keys(byType).sort((a, b) => byType[b].length - byType[a].length);

  return (
    <div>
      {orderedTypes.map(type => {
        const list = byType[type];
        const onSite = list.filter(e => e.status === "active").length;
        const idle = list.filter(e => e.status === "yard").length;
        const value = list.filter(e => e.purchase).reduce((a, e) => a + e.purchase, 0);
        return (
          <section key={type} className="eq-type-section">
            <div className="eq-type-h">
              <span className="num">{list.length}</span>
              <span className="pill-lg">{D.TYPES[type]?.lbl}</span>
              <span className="hint">{onSite} on site · {idle} at yard</span>
              <div className="right">
                <span><span className="stat-num">{Math.round((onSite / list.length) * 100)}%</span> deployed</span>
                <span>·</span>
                <span><span className="stat-num">{D.fmtMoney(value)}</span> book value</span>
              </div>
            </div>
            <div className="eq-type-grid">
              {list.map(e => {
                const job = e.jobId ? D.JOBS.find(j => j.id === e.jobId) : null;
                const status = D.STATUS[e.status];
                return (
                  <article key={e.id} className={`eq-card s-${e.status}`} onClick={() => onOpen(e.id)}>
                    <div className="top">
                      <div>
                        <div className="nm">{e.make} {e.model}</div>
                        <div className="id">{e.num} · {e.year}</div>
                      </div>
                      <StatusPill variant={status.tone}>{status.lbl}</StatusPill>
                    </div>
                    <div className="meta">
                      {job ? <>{job.code} · {job.city}</> : (e.status === "service" ? e.note : "DVP Yard")}
                    </div>
                    <div className="stats-row">
                      <span><span className="v">{D.fmtRate(e.rate).replace("/hr", "")}</span><span className="sub" style={{ marginLeft: 4 }}>/hr</span></span>
                      <span><span className="v">{e.hours.toLocaleString()}</span><span className="sub" style={{ marginLeft: 4 }}>hr</span></span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ───────────────────── Map view ───────────────────── */
function EqMap({ equipment, onOpen, selectedId }) {
  const D = window.EQ_DATA;
  const visible = equipment.filter(e => e.x != null && e.y != null);

  return (
    <div className="fl-map" style={{ background: "var(--surface-1)", margin: "var(--s4) var(--s5)", borderRadius: "var(--r)", border: "1px solid var(--ink-border)", overflow: "hidden" }}>
      <div className="fl-map-hdr">
        <span className="h">Equipment · NJ region</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)", letterSpacing: "0.04em" }}>
          {visible.length} of {equipment.length} located
        </span>
        <div style={{ flex: 1 }}></div>
        <span className="last">Click a pin to open</span>
      </div>
      <div className="fl-map-canvas" style={{ minHeight: 520 }}>
        <div className="fl-map-grid"></div>
        <svg className="fl-map-roads" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M30,5 Q40,30 50,55 T75,95" stroke="oklch(0.84 0.006 80)" strokeWidth="1.4" fill="none" />
          <path d="M5,35 Q40,40 80,30 T98,28" stroke="oklch(0.84 0.006 80)" strokeWidth="1.2" fill="none" />
          <path d="M50,5 Q60,30 70,55 T90,95"  stroke="oklch(0.84 0.006 80)" strokeWidth="1.2" fill="none" />
        </svg>
        {/* Job sites in background */}
        {D.JOBS.filter(j => j.id !== "jY").map(j => (
          <div key={j.id} className="fl-map-job" style={{ left: `${j.x}%`, top: `${j.y}%`, opacity: 0.6 }}>
            <div className="dot" style={{ background: "var(--ink-3)" }}></div>
            <div className="lbl">{j.code}</div>
          </div>
        ))}
        {/* Yard marker */}
        <div className="fl-map-job" style={{ left: "60%", top: "50%", zIndex: 4 }}>
          <div className="dot" style={{ background: "var(--asphalt)" }}></div>
          <div className="lbl">YARD</div>
        </div>
        {/* Equipment pins */}
        {visible.map((e) => {
          // Cluster jitter to prevent overlaps
          const jitter = (e.id.charCodeAt(3) % 8 - 4) * 0.6;
          return (
            <div key={e.id}
              className={`fl-map-asset s-${e.status} ${selectedId === e.id ? "selected" : ""}`}
              style={{ left: `${e.x + jitter}%`, top: `${e.y + (e.id.charCodeAt(4) % 6 - 3) * 0.4}%`, zIndex: 10 }}
              onClick={() => onOpen(e.id)}
              title={`${e.id} · ${e.make} ${e.model}`}>
              {e.status === "active" && <div className="pulse"></div>}
              <div className="pin">{typeIcon(e.type, 12)}</div>
              <div className="lbl">{e.id}</div>
            </div>
          );
        })}
        <div className="fl-map-legend">
          <div className="row"><span className="swatch"></span>ON SITE</div>
          <div className="row"><span className="swatch idle"></span>AT YARD</div>
          <div className="row"><span className="swatch shop"></span>IN TRANSIT</div>
          <div className="row"><span className="swatch offline"></span>SERVICE</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Detail drawer ───────────────────── */
function EqDrawer({ eq, onClose, onAssign }) {
  const D = window.EQ_DATA;
  const job = eq.jobId ? D.JOBS.find(j => j.id === eq.jobId) : null;
  const status = D.STATUS[eq.status];
  const days = D.daysSince(eq.since);
  const ticket = D.SERVICE_TICKETS.find(t => t.eqId === eq.id);

  return (
    <div className="eq-drawer" role="dialog" aria-label="Equipment detail">
      <header className="eq-drawer-hdr">
        <div className="row1">
          <div className="ki">{typeIcon(eq.type, 22)}</div>
          <div className="col">
            <span className="id">{eq.id} · {D.TYPES[eq.type]?.lbl} · {eq.year}</span>
            <div className="nm">{eq.make} {eq.model}</div>
          </div>
          <StatusPill variant={status.tone}>{status.lbl}</StatusPill>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><EqIcons.X size={14} /></button>
        </div>
      </header>
      <div className="eq-drawer-body">
        <div className="cust-stats-grid">
          <div className="s">
            <span className="l">Hourly rate</span>
            <span className="v">{D.fmtRate(eq.rate)}</span>
          </div>
          <div className="s">
            <span className="l">Total hours</span>
            <span className="v">{eq.hours.toLocaleString()}</span>
          </div>
          <div className="s">
            <span className="l">Book value</span>
            <span className="v" style={{ fontSize: 18 }}>{D.fmtMoney(eq.purchase)}</span>
          </div>
        </div>

        <div className="cust-sub-h">Current assignment</div>
        <div className="proj-info-row">
          <span className="lbl">Job</span>
          <span className="val">{job ? `${job.code} · ${job.name}` : "Not assigned"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Location</span>
          <span className="val">{job?.city || (eq.status === "service" ? "DVP Yard — Shop" : "DVP Yard")}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Since</span>
          <span className="val">{eq.since} · {days} days</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Operator</span>
          <span className="val">{eq.driverInit ? `${eq.driverInit} — assigned today` : "Unassigned"}</span>
        </div>
        {eq.note && (
          <div className="proj-info-row">
            <span className="lbl">Note</span>
            <span className="val" style={{ fontFamily: "var(--font-sans)", fontSize: 13 }}>{eq.note}</span>
          </div>
        )}

        <div className="cust-sub-h">Asset details</div>
        <div className="proj-info-row">
          <span className="lbl">Make / Model</span>
          <span className="val">{eq.make} {eq.model}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Asset #</span>
          <span className="val">{eq.id} · INTERNAL {eq.num}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Year</span>
          <span className="val">{eq.year}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Ownership</span>
          <span className="val">{eq.ownership === "rented" ? "Rented · Hertz Equipment" : "Owned"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">GPS</span>
          <span className="val">{eq.gps ? "Tenna · live" : "Not tracked"}</span>
        </div>

        <div className="cust-sub-h">Service</div>
        <div className="proj-info-row">
          <span className="lbl">Last service</span>
          <span className="val">{eq.lastSvc || "—"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Next due</span>
          <span className="val" style={{ color: eq.svcDue && D.daysSince(eq.svcDue) > 0 ? "var(--status-stop)" : undefined }}>
            {eq.svcDue || "—"}
          </span>
        </div>
        {ticket && (
          <div style={{
            marginTop: 12,
            padding: 12,
            background: "var(--status-stop-soft)",
            border: "1px solid oklch(0.58 0.20 25 / 0.40)",
            borderRadius: "var(--r)",
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <Icons.AlertTri size={16} style={{ color: "var(--status-stop)", marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "var(--ink-0)", fontWeight: 500 }}>
                {ticket.title}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.04em", marginTop: 4 }}>
                {ticket.id} · OPENED {ticket.opened} · {ticket.hoursDown}H DOWN · EST {D.fmtMoney(ticket.est)}
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="eq-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }}>
          <EqIcons.Wrench size={12} /> Service log
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onAssign([eq.id])}>
          <EqIcons.Send size={12} /> Assign to job
        </button>
        <button className="btn btn-primary" style={{ flex: 1.4 }}>
          Open in CRM <EqIcons.ChevR size={12} />
        </button>
      </footer>
    </div>
  );
}

/* ───────────────────── App root ───────────────────── */
function EquipmentApp() {
  const D = window.EQ_DATA;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "accent": "#F08A2C",
    "defaultView": "INVENTORY"
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  eUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  const [view, setView] = eUseState(t.defaultView);
  const [statusFilter, setStatusFilter] = eUseState("all");
  const [query, setQuery] = eUseState("");
  const [selected, setSelected] = eUseState({});
  const [openId, setOpenId] = eUseState(null);
  const [equipment, setEquipment] = eUseState(D.EQUIPMENT);
  const [assignOpen, setAssignOpen] = eUseState(false);
  const [toast, setToast] = eUseState(null);
  const toastTimerRef = eUseRef(null);

  const showToast = eUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);
  const handleUndo = eUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);

  eUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault(); handleUndo();
      }
      if (e.key === "Escape") { setOpenId(null); setAssignOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo]);

  // Filtered
  const filtered = eUseMemo(() => {
    return equipment.filter(e => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (query) {
        const hay = `${e.id} ${e.num} ${e.make} ${e.model} ${D.TYPES[e.type]?.lbl}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [equipment, statusFilter, query]);

  const selectedIds = Object.keys(selected);
  const toggle = (id) => setSelected(s => {
    const next = { ...s };
    if (next[id]) delete next[id]; else next[id] = true;
    return next;
  });
  const selectAll = () => setSelected(Object.fromEntries(filtered.map(e => [e.id, true])));
  const clearAll = () => setSelected({});

  // Bulk assign to job (the demonstrated interaction)
  const assignToJob = eUseCallback((ids, jobId) => {
    const prevState = ids.map(id => {
      const e = equipment.find(x => x.id === id);
      return { id, prevJobId: e?.jobId, prevStatus: e?.status, prevSince: e?.since };
    });
    const today = "2026-05-26";
    setEquipment(prev => prev.map(e => ids.includes(e.id) ? {
      ...e, jobId, status: "transit", since: today
    } : e));
    setSelected({});
    setAssignOpen(false);
    const job = D.JOBS.find(j => j.id === jobId);
    showToast(
      `<strong>${ids.length} asset${ids.length > 1 ? "s" : ""}</strong> dispatched to <span class="num">${job?.code}</span> — ${job?.name}`,
      () => setEquipment(prev => prev.map(e => {
        const ps = prevState.find(p => p.id === e.id);
        return ps ? { ...e, jobId: ps.prevJobId, status: ps.prevStatus, since: ps.prevSince } : e;
      }))
    );
  }, [equipment, showToast]);

  const openEq = openId ? equipment.find(e => e.id === openId) : null;
  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  const views = [
    { key: "INVENTORY", lbl: "INVENTORY", ico: EqIcons.Table },
    { key: "BY_TYPE",   lbl: "BY TYPE",   ico: EqIcons.Stack },
    { key: "MAP",       lbl: "MAP",       ico: EqIcons.Map   },
  ];

  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <EqHeader collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark} onToggleDark={() => setTweak("dark", !t.dark)} />
      <EqSidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Equipment</span>
            <span className="date-day">
              {D.STATS.total} ASSETS · {D.STATS.utilization}% UTIL · {D.STATS.serviceOpen} IN SERVICE · {D.STATS.idleAssets} IDLE
            </span>
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="filter-chip">
            <EqIcons.Filter size={12} /> ALL TYPES
          </button>
          <button className="btn btn-secondary" style={{ height: 32 }}>
            <EqIcons.Download size={12} /> Export
          </button>
          <button className="btn btn-primary" style={{ height: 32 }}>
            <EqIcons.Plus size={14} /> Add equipment
          </button>
        </div>

        <div className="eq-page">
          <EqHero stats={D.STATS} statusFilter={statusFilter} onStatus={setStatusFilter} />

          <div className="eq-tools">
            <div className="chip-row">
              {views.map(v => (
                <button key={v.key} className={view === v.key ? "active" : ""} onClick={() => setView(v.key)}>
                  <v.ico size={12} />{v.lbl}
                </button>
              ))}
            </div>
            <div className="chip-row">
              {["all", "active", "transit", "yard", "service"].map(s => {
                const label = s === "all" ? "ALL" :
                  s === "active" ? "ON SITE" :
                  s === "transit" ? "TRANSIT" :
                  s === "yard" ? "AT YARD" : "SERVICE";
                return (
                  <button key={s} className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
                    <span className="dot" style={{
                      background: s === "active" ? "var(--status-ok)" :
                        s === "transit" ? "var(--status-info)" :
                        s === "yard" ? "var(--status-warn)" :
                        s === "service" ? "var(--status-stop)" : undefined
                    }}></span>
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="eq-tools search">
              <EqIcons.Search size={12} />
              <input placeholder="Search by ID, make, model…"
                value={query} onChange={(e) => setQuery(e.target.value)} />
              <span className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>⌘F</span>
            </div>
            <div style={{ flex: 1 }}></div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.04em" }}>
              SHOWING {filtered.length} OF {equipment.length}
            </span>
          </div>

          {selectedIds.length > 0 && view === "INVENTORY" && (
            <div className="eq-bulk" style={{ position: "relative" }}>
              <span className="num-sel">{selectedIds.length}</span>
              <span className="lbl">SELECTED · {(() => {
                const total = selectedIds.reduce((a, id) => {
                  const e = equipment.find(x => x.id === id);
                  return a + (e?.rate || 0);
                }, 0);
                return `$${total}/hr COMBINED`;
              })()}</span>
              <button className="bulk-btn" onClick={clearAll}><EqIcons.X size={11} /> Clear</button>
              <span className="spc"></span>
              <button className="bulk-btn"><EqIcons.Wrench size={11} /> Schedule service</button>
              <button className="bulk-btn"><EqIcons.Download size={11} /> Export</button>
              <button className="bulk-btn primary" onClick={() => setAssignOpen(true)} style={{ position: "relative" }}>
                <EqIcons.Send size={11} /> Assign to job <EqIcons.ChevD size={11} />
              </button>
              {assignOpen && (
                <div className="eq-assign-menu" style={{ right: 16, top: "calc(100% + 4px)" }}>
                  <div className="h">SELECT JOB · {selectedIds.length} ASSET{selectedIds.length > 1 ? "S" : ""}</div>
                  {D.JOBS.filter(j => j.id !== "jY").map(j => (
                    <button key={j.id} onClick={() => assignToJob(selectedIds, j.id)}>
                      <span style={{ flex: 1 }}>
                        <div>{j.name}</div>
                        <span className="code">{j.code} · {j.city}</span>
                      </span>
                      <EqIcons.ChevR size={12} />
                    </button>
                  ))}
                  <button onClick={() => assignToJob(selectedIds, "jY")} style={{ borderTop: "1px solid var(--ink-border)", marginTop: 4, paddingTop: 8 }}>
                    <span style={{ flex: 1, color: "var(--ink-1)" }}>
                      <div>Return to yard</div>
                      <span className="code">DVP YARD · BRANCHBURG</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {view === "INVENTORY" && (
            <InventoryTable equipment={filtered}
              selected={selected} toggle={toggle}
              selectAll={selectAll} clearAll={clearAll}
              allSelected={allSelected}
              onOpen={setOpenId} />
          )}
          {view === "BY_TYPE" && <ByTypeView equipment={filtered} onOpen={setOpenId} />}
          {view === "MAP"     && <EqMap equipment={filtered} onOpen={setOpenId} selectedId={openId} />}
        </div>
      </main>

      {openEq && <EqDrawer eq={openEq} onClose={() => setOpenId(null)} onAssign={(ids) => { setSelected(Object.fromEntries(ids.map(id => [id, true]))); setOpenId(null); setAssignOpen(true); }} />}

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
            { value: "INVENTORY", label: "Inventory (table)" },
            { value: "BY_TYPE",   label: "By type (grouped)" },
            { value: "MAP",       label: "Map (geographic)" },
          ]}
          onChange={(v) => { setView(v); setTweak("defaultView", v); }} />

        <window.TweakSection label="Demo" />
        <window.TweakButton label="Bulk assign 3 idle assets"
          onClick={() => {
            const idle = equipment.filter(e => e.status === "yard").slice(0, 3);
            setSelected(Object.fromEntries(idle.map(e => [e.id, true])));
          }} />
        <window.TweakButton label="Reset assignments" secondary
          onClick={() => setEquipment(D.EQUIPMENT)} />
      </window.TweaksPanel>
    </div>
  );
}

window.EquipmentApp = EquipmentApp;
