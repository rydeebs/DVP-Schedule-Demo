// Fleet Tracking — schematic NJ-region map, status-grouped list, live activity
// Continues the Industrial Utilitarian system. Demonstrated interaction: the map.

const { useState: flUseState, useEffect: flUseEffect, useMemo: flUseMemo, useRef: flUseRef, useCallback: flUseCallback } = React;

/* ───────────────────── Icons ───────────────────── */
const FlIcons = {
  Truck:     (p) => <Ico {...p} d={["M3 7h11v9H3z","M14 10h4l3 3v3h-7","M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Paver:     (p) => <Ico {...p} d={["M3 12h18v6H3z","M5 12V8h8v4","M8 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Roller:    (p) => <Ico {...p} d={["M4 14a4 4 0 0 1 0-8h12a4 4 0 0 1 0 8h-2v3H6v-3H4Z","M20 18h-3"]} />,
  Mill:      (p) => <Ico {...p} d={["M3 13h18v5H3z","M6 13V7h12v6","M8 7V4h8v3"]} />,
  Excavator: (p) => <Ico {...p} d={["M3 19h18","M5 19v-4h6v4","M11 15l3-3 5 1-3 5","M14 12l1-4 4 1","M7 12h2v3H7z"]} />,
  Loader:    (p) => <Ico {...p} d={["M2 18h20","M4 18v-3h8v3","M12 15l5-3h4v6","M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Sweeper:   (p) => <Ico {...p} d={["M14 7l4 12","M10 7l-4 12","M3 19h18","M9 7h6","M11 4h2v3h-2z"]} />,
  Pin:       (p) => <Ico {...p} d={["M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z","M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Search:    (p) => <Ico {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z","M21 21l-4.3-4.3"]} />,
  Gauge:     (p) => <Ico {...p} d={["M12 22a10 10 0 1 0-7-17","M12 22a10 10 0 0 1-7-17","M12 12l5-3"]} />,
  Fuel:      (p) => <Ico {...p} d={["M4 21h10V3H4z","M14 8h3l2 2v9","M17 14h2"]} />,
  Phone:     (p) => <Ico {...p} d="M22 16v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 3.2 2 2 0 0 1 4 1h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 8.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16Z" />,
  Map:       (p) => <Ico {...p} d={["M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3Z","M9 4v13","M15 7v13"]} />,
  Send:      (p) => <Ico {...p} d={["M22 2 11 13","M22 2l-7 20-4-9-9-4 20-7Z"]} />,
  X:         (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Refresh:   (p) => <Ico {...p} d={["M3 12a9 9 0 0 1 15-6.7l3-3v8h-8l3-3A6 6 0 0 0 6 12","M21 12a9 9 0 0 1-15 6.7l-3 3v-8h8l-3 3A6 6 0 0 0 18 12"]} />,
};

function kindIcon(kind, size = 14) {
  const map = {
    truck: FlIcons.Truck, paver: FlIcons.Paver, roller: FlIcons.Roller,
    mill: FlIcons.Mill, excavator: FlIcons.Excavator, loader: FlIcons.Loader,
    dozer: FlIcons.Loader, sweeper: FlIcons.Sweeper, striper: FlIcons.Truck,
    trowel: FlIcons.Loader,
  };
  const I = map[kind] || FlIcons.Truck;
  return <I size={size} />;
}

/* ───────────────────── Header + sidebar ───────────────────── */
function FleetHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span className="crumb-cur">FLEET TRACKING</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <FlIcons.Search size={12} />
          <span>Find truck, driver, job…</span>
          <span className="cmdk-kbd">⌘K</span>
        </button>
        <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="badge">3</span>
        </button>
        <button className="avatar" title="Karen Faggioli · Dispatch">KF</button>
      </div>
    </header>
  );
}

function FleetSidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",      badge: "47", href: "Crew Calendar Board.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", active: true, href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",      href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",  badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment", href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers",   badge: "203" },
    ]},
  ];
  const D = window.FLEET_DATA;
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
        <span className="sb-foot-text">{D.FLEET_STATS.moving} MOVING · TENNA LIVE</span>
      </div>
    </aside>
  );
}

/* ───────────────────── Left rail ───────────────────── */
function FleetRail({ statusFilter, setStatusFilter, kindFilter, setKindFilter, selectedId, setSelectedId, query, setQuery }) {
  const D = window.FLEET_DATA;
  const tabKindFilter = kindFilter === "truck" ? "truck" : kindFilter === "equipment" ? "non-truck" : null;
  const list = flUseMemo(() => {
    return D.ASSETS.filter(a => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (tabKindFilter === "truck" && a.kind !== "truck") return false;
      if (tabKindFilter === "non-truck" && a.kind === "truck") return false;
      if (query) {
        const w = a.driverId ? D.FLEET_WORKERS[a.driverId] : null;
        const hay = `${a.id} ${a.model} ${w?.name || ""}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [statusFilter, tabKindFilter, query]);

  // Group by status when not filtering
  const groups = statusFilter
    ? [{ key: statusFilter, label: statusFilter.toUpperCase(), items: list }]
    : [
        { key: "moving",  label: "Moving",  items: list.filter(a => a.status === "moving"),  dotCls: "ok"   },
        { key: "idle",    label: "Idle",    items: list.filter(a => a.status === "idle"),    dotCls: "warn" },
        { key: "shop",    label: "In shop", items: list.filter(a => a.status === "shop"),    dotCls: "info" },
        { key: "offline", label: "Offline", items: list.filter(a => a.status === "offline"), dotCls: "stop" },
      ];

  return (
    <aside className="fl-rail">
      <div className="fl-rail-hdr">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
            letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-1)"
          }}>Fleet</span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)", letterSpacing: "0.04em"
          }}>{list.length} OF {D.ASSETS.length}</span>
        </div>
        <div className="fl-rail-search">
          <FlIcons.Search size={12} />
          <input placeholder="Find by ID, model, driver…"
            value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>⌘F</span>
        </div>
      </div>

      <div className="fl-stat-strip">
        <button className={`fl-stat moving ${statusFilter === "moving" ? "active" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "moving" ? null : "moving")}>
          <span className="v">{D.FLEET_STATS.moving}</span>
          <span className="l"><span className="dot"></span>MOVING</span>
        </button>
        <button className={`fl-stat idle ${statusFilter === "idle" ? "active" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "idle" ? null : "idle")}>
          <span className="v">{D.FLEET_STATS.idle}</span>
          <span className="l"><span className="dot"></span>IDLE</span>
        </button>
        <button className={`fl-stat shop ${statusFilter === "shop" ? "active" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "shop" ? null : "shop")}>
          <span className="v">{D.FLEET_STATS.shop}</span>
          <span className="l"><span className="dot"></span>SHOP</span>
        </button>
        <button className={`fl-stat offline ${statusFilter === "offline" ? "active" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "offline" ? null : "offline")}>
          <span className="v">{D.FLEET_STATS.offline}</span>
          <span className="l"><span className="dot"></span>OFFLINE</span>
        </button>
      </div>

      <div className="fl-tabs">
        <button className={`fl-tab ${kindFilter === "all" ? "active" : ""}`} onClick={() => setKindFilter("all")}>
          ALL <span className="cnt">{D.ASSETS.length}</span>
        </button>
        <button className={`fl-tab ${kindFilter === "truck" ? "active" : ""}`} onClick={() => setKindFilter("truck")}>
          TRUCKS <span className="cnt">{D.FLEET_STATS.trucks}</span>
        </button>
        <button className={`fl-tab ${kindFilter === "equipment" ? "active" : ""}`} onClick={() => setKindFilter("equipment")}>
          EQUIPMENT <span className="cnt">{D.FLEET_STATS.equipment}</span>
        </button>
      </div>

      <div className="fl-list">
        {groups.map(g => g.items.length > 0 && (
          <React.Fragment key={g.key}>
            {!statusFilter && (
              <div className="fl-group-head">
                <span className="dot" style={{
                  background:
                    g.dotCls === "ok"   ? "var(--status-ok)" :
                    g.dotCls === "warn" ? "var(--status-warn)" :
                    g.dotCls === "info" ? "var(--status-info)" :
                                          "var(--ink-3)"
                }}></span>
                {g.label}
                <span className="c">· {g.items.length}</span>
              </div>
            )}
            {g.items.map(a => (
              <AssetRow key={a.id} asset={a}
                selected={selectedId === a.id}
                onClick={() => setSelectedId(a.id)} />
            ))}
          </React.Fragment>
        ))}

        {list.length === 0 && (
          <div style={{
            padding: 32, textAlign: "center",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--ink-3)", letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}>
            No assets match this filter
          </div>
        )}

        <div className="fl-sub-banner">
          <div className="h">
            <span>SUBCONTRACTORS</span>
            <span>·</span>
          </div>
          <span className="v">{D.FLEET_STATS.subsCount}</span>
          <span>{D.FLEET_STATS.subs} vehicles · no GPS · listed in CRM &gt; Subs</span>
        </div>
      </div>
    </aside>
  );
}

function AssetRow({ asset, selected, onClick }) {
  const D = window.FLEET_DATA;
  const driver = asset.driverId ? D.FLEET_WORKERS[asset.driverId] : null;
  const job = asset.jobId ? D.JOB_SITES.find(j => j.id === asset.jobId) : null;
  const isMoving = asset.status === "moving";
  return (
    <article className={`fl-asset s-${asset.status} ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="ki">{kindIcon(asset.kind, 14)}</div>
      <div style={{ minWidth: 0 }}>
        <div className="nm">
          {asset.id} <span className="code">· {asset.model}</span>
        </div>
        <div className="sub">
          {asset.status === "offline" ? `OFFLINE · ${asset.lastPing}` :
            asset.status === "shop" ? `IN SHOP · ${asset.note || "maintenance"}` :
            asset.status === "idle" ? `IDLE${job ? " · " + job.code : ""}` :
            `${job ? job.code + " · " : ""}${driver?.name || ""}`}
        </div>
      </div>
      <div className="meta-right">
        {isMoving && (
          <>
            <span className="v">{asset.speed}</span>
            <span className="lbl">MPH</span>
          </>
        )}
        {!isMoving && asset.status === "offline" && (
          <>
            <span className="lbl" style={{ color: "var(--status-stop)" }}>NO PING</span>
          </>
        )}
        {!isMoving && asset.status !== "offline" && (
          <>
            <span className="v" style={{ color: "var(--ink-2)" }}>{asset.fuel || "—"}</span>
            <span className="lbl">FUEL %</span>
          </>
        )}
      </div>
    </article>
  );
}

/* ───────────────────── Map ───────────────────── */
function FleetMap({ statusFilter, kindFilter, selectedId, setSelectedId }) {
  const D = window.FLEET_DATA;
  const [mode, setMode] = flUseState("MAP"); // MAP | SATELLITE — we keep it MAP-only
  const [tick, setTick] = flUseState(0);
  const [lastUpdated, setLastUpdated] = flUseState("just now");

  // Drift the moving pins slightly to simulate live tracking
  flUseEffect(() => {
    const t = setInterval(() => setTick(t => t + 1), 3000);
    const t2 = setInterval(() => {
      const seconds = [5, 12, 19, 26, 33];
      setLastUpdated(`${seconds[Math.floor(Math.random() * seconds.length)]}s ago`);
    }, 4000);
    return () => { clearInterval(t); clearInterval(t2); };
  }, []);

  const drift = (a, axis) => {
    if (a.status !== "moving") return 0;
    const seed = (a.id.charCodeAt(0) + a.id.charCodeAt(2) + axis * 17 + tick * 13) % 100;
    return (seed / 100 - 0.5) * 1.6;
  };

  const visibleAssets = D.ASSETS.filter(a => {
    if (statusFilter && a.status !== statusFilter) return false;
    if (kindFilter === "truck" && a.kind !== "truck") return false;
    if (kindFilter === "equipment" && a.kind === "truck") return false;
    return true;
  });

  return (
    <section className="fl-map">
      <div className="fl-map-hdr">
        <span className="h">FLEET · NORTHERN NJ</span>
        <span className="live">
          <span className="gps-dot live"></span>
          TENNA LIVE
        </span>
        <span className="last">Updated {lastUpdated}</span>
        <div style={{ flex: 1 }}></div>
        <div className="fl-map-controls">
          <button className={mode === "MAP" ? "active" : ""} onClick={() => setMode("MAP")}>MAP</button>
          <button className={mode === "SATELLITE" ? "active" : ""} onClick={() => setMode("SATELLITE")}>SATELLITE</button>
        </div>
        <button className="filter-chip">
          <FlIcons.Refresh size={12} /> FIT TO FLEET
        </button>
      </div>

      <div className="fl-map-canvas">
        <div className="fl-map-grid"></div>

        {/* Stylized roads — diagonal SVG strokes for I-95, I-78, GSP, NJTP */}
        <svg className="fl-map-roads" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M30,5 Q40,30 50,55 T75,95" stroke="oklch(0.84 0.006 80)" strokeWidth="1.4" fill="none" />
          <path d="M5,35 Q40,40 80,30 T98,28" stroke="oklch(0.84 0.006 80)" strokeWidth="1.2" fill="none" />
          <path d="M50,5 Q60,30 70,55 T90,95"  stroke="oklch(0.84 0.006 80)" strokeWidth="1.2" fill="none" />
          <path d="M40,15 Q60,40 80,55 T95,80" stroke="oklch(0.86 0.006 80)" strokeWidth="0.8" fill="none" strokeDasharray="2 1.5" />
        </svg>

        {/* City labels */}
        {D.CITIES.map(c => (
          <span key={c.name} className={`fl-map-city ${c.name === "DVP YARD" ? "yard" : ""}`}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            {c.name}
          </span>
        ))}

        {/* Job sites */}
        {D.JOB_SITES.map(j => (
          <div key={j.id} className={`fl-map-job t-${j.type}`} style={{ left: `${j.x}%`, top: `${j.y}%` }}
            title={`${j.code} — ${j.name}`}>
            <div className="dot"></div>
            <div className="lbl">{j.code}</div>
          </div>
        ))}

        {/* Fleet pins */}
        {visibleAssets.map(a => (
          <div key={a.id}
            className={`fl-map-asset s-${a.status} ${selectedId === a.id ? "selected" : ""}`}
            style={{
              left: `${a.x + drift(a, 0)}%`,
              top: `${a.y + drift(a, 1)}%`,
              transition: a.status === "moving" ? "left 3s linear, top 3s linear, transform 120ms" : "transform 120ms"
            }}
            title={`${a.id} — ${a.model}`}
            onClick={() => setSelectedId(a.id)}
          >
            {a.status === "moving" && <div className="pulse"></div>}
            <div className="pin">{kindIcon(a.kind, 12)}</div>
            <div className="lbl">{a.id}{a.status === "moving" ? ` · ${a.speed} mph` : ""}</div>
          </div>
        ))}

        <div className="fl-map-tenna">
          <span className="gps-dot live"></span>
          TENNA · GOOGLE MAPS
        </div>

        <div className="fl-map-legend">
          <div className="row"><span className="swatch"></span>MOVING</div>
          <div className="row"><span className="swatch idle"></span>IDLE</div>
          <div className="row"><span className="swatch shop"></span>IN SHOP</div>
          <div className="row"><span className="swatch offline"></span>OFFLINE</div>
        </div>
        <div className="fl-map-zoom">
          <button title="Zoom in">+</button>
          <button title="Zoom out">−</button>
          <button title="Pin location"><FlIcons.Pin size={14} /></button>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Right rail ───────────────────── */
function FleetSide({ selectedId, setSelectedId, onMessage, onUnassign }) {
  const D = window.FLEET_DATA;
  const asset = selectedId ? D.ASSETS.find(a => a.id === selectedId) : null;
  const driver = asset?.driverId ? D.FLEET_WORKERS[asset.driverId] : null;
  const job = asset?.jobId ? D.JOB_SITES.find(j => j.id === asset.jobId) : null;

  return (
    <aside className="fl-side">
      {asset ? (
        <>
          <div className="fl-side-section">
            <div className="fl-side-h">
              <span>Selected asset</span>
              <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => setSelectedId(null)} aria-label="Clear selection">
                <FlIcons.X size={11} />
              </button>
            </div>
            <div className="fl-detail">
              <div className="header">
                <div className="ki">{kindIcon(asset.kind, 18)}</div>
                <div className="col">
                  <span className="code">{D.ASSET_KIND[asset.kind]?.label} · {asset.year}</span>
                  <span className="nm">{asset.id}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.04em" }}>
                    {asset.model}
                  </span>
                </div>
                <StatusPill variant={
                  asset.status === "moving" ? "ok" :
                  asset.status === "idle"   ? "warn" :
                  asset.status === "shop"   ? "info" : "stop"
                }>{asset.status.toUpperCase()}</StatusPill>
              </div>

              <div className="stats">
                <div className="stat">
                  <span className="l">Speed</span>
                  <span className={`v ${asset.status === "offline" ? "stop" : ""}`}>
                    {asset.status === "offline" ? "—" : (asset.speed || 0)}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)", marginLeft: 4 }}>mph</span>
                  </span>
                  <span className="sub">
                    {asset.status === "moving" ? `heading ${asset.heading}` : asset.status === "idle" ? "stopped" : "—"}
                  </span>
                </div>
                <div className="stat">
                  <span className="l">Fuel</span>
                  <span className={`v ${asset.fuel != null && asset.fuel < 35 ? "warn" : ""}`}>
                    {asset.fuel ?? "—"}<span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)", marginLeft: 2 }}>%</span>
                  </span>
                  <span className="sub">{asset.fuel != null && asset.fuel < 35 ? "refuel ETA tonight" : "OK"}</span>
                </div>
                <div className="stat">
                  <span className="l">{asset.odo ? "Odometer" : "Run hours"}</span>
                  <span className="v">
                    {(asset.odo || asset.hours || 0).toLocaleString()}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", marginLeft: 4 }}>{asset.odo ? "mi" : "hr"}</span>
                  </span>
                  <span className="sub">last service 2,840mi ago</span>
                </div>
                <div className="stat">
                  <span className="l">Days deployed</span>
                  <span className="v">14</span>
                  <span className="sub">since DVP yard</span>
                </div>
              </div>

              <div style={{ marginTop: 4 }}>
                <div className="info-row">
                  <span className="lbl">Driver</span>
                  <span className="val">{driver ? driver.name : "—"}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Assigned</span>
                  <span className="val">{job ? `${job.code} · ${job.name}` : "Unassigned"}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Location</span>
                  <span className="val">
                    {job ? job.city : asset.status === "shop" ? "DVP Yard — Branchburg" : "—"}
                  </span>
                </div>
                {asset.note && (
                  <div className="info-row">
                    <span className="lbl">Note</span>
                    <span className="val" style={{
                      color: asset.status === "offline" ? "var(--status-stop)" : "var(--ink-1)",
                      fontFamily: "var(--font-sans)", fontSize: 12,
                    }}>{asset.note}</span>
                  </div>
                )}
              </div>

              <div className="actions">
                {driver && (
                  <button className="btn btn-secondary" style={{ height: 30, flex: 1, fontSize: 12 }}
                    onClick={() => onMessage(asset)}>
                    <FlIcons.Phone size={12} /> Call driver
                  </button>
                )}
                <button className="btn btn-secondary" style={{ height: 30, flex: 1, fontSize: 12 }}>
                  <FlIcons.Send size={12} /> Send to job
                </button>
                {job && (
                  <button className="btn btn-ghost" style={{ height: 30, color: "var(--status-stop)", fontSize: 12 }}
                    onClick={() => onUnassign(asset)}>
                    Unassign
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="fl-side-section" style={{ flex: 1, minHeight: 0, padding: 0, display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "var(--s3) var(--s4)",
              borderBottom: "1px solid var(--ink-border)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--ink-1)"
              }}>Asset history · last 24h</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>
                {D.FLEET_EVENTS.filter(e => e.assetId === asset.id).length} EVENTS
              </span>
            </div>
            <div className="fl-feed">
              {D.FLEET_EVENTS.filter(e => e.assetId === asset.id).map(e => (
                <FeedRow key={e.id} event={e} />
              ))}
              {D.FLEET_EVENTS.filter(e => e.assetId === asset.id).length === 0 && (
                <div style={{
                  padding: 24, textAlign: "center",
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  color: "var(--ink-3)", letterSpacing: "0.06em",
                  textTransform: "uppercase"
                }}>
                  No events in the last 24 hours
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="fl-side-section" style={{ borderBottom: "1px solid var(--ink-border)" }}>
            <div className="fl-side-h">
              <span>Live activity</span>
              <span className="c">{D.FLEET_EVENTS.length} EVENTS · 24H</span>
            </div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--ink-2)", letterSpacing: "0.04em", marginBottom: 8
            }}>
              Tenna events stream in real time. Click a pin or asset to scope to one.
            </div>
          </div>
          <div className="fl-feed">
            {D.FLEET_EVENTS.map(e => (
              <FeedRow key={e.id} event={e} onClick={() => setSelectedId(e.assetId)} />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}

function FeedRow({ event, onClick }) {
  return (
    <article className={`fl-feed-row k-${event.kind}`} onClick={onClick}>
      <span className="at">{event.at}</span>
      <span className="dot"></span>
      <div className="body">
        <span className="code">{event.assetId}</span>
        <span className="msg">{event.msg}</span>
      </div>
    </article>
  );
}

window.FleetHeader = FleetHeader;
window.FleetSidebar = FleetSidebar;
window.FleetRail = FleetRail;
window.FleetMap = FleetMap;
window.FleetSide = FleetSide;
window.FlIcons = FlIcons;
