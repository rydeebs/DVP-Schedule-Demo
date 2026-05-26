// Dispatch page — standalone wrapper around the dispatch readiness view.

const { useState: dUseState, useEffect: dUseEffect, useMemo: dUseMemo } = React;

function DispatchHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span className="crumb-cur">DISPATCH</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <Icons.Search size={12} />
          <span>Find jobs, trucks, materials...</span>
          <span className="cmdk-kbd">⌘K</span>
        </button>
        <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="badge">3</span>
        </button>
        <button className="avatar" title="Aaron Jahn">AJ</button>
      </div>
    </header>
  );
}

function DispatchSidebar() {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", badge: "BOARD", href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch", badge: "47", active: true, href: "Dispatch.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms", badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety", badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files", href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects", badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment", href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers", badge: "203", href: "Workers.html" },
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
      <a href="Settings.html" className="sb-item" style={{ textDecoration: "none" }}>
        <Icons.Settings size={16} />
        <span className="lbl">Settings</span>
      </a>
      <div className="sb-foot">
        <span className="gps-dot live"></span>
        <span className="sb-foot-text">DISPATCH · LIVE</span>
      </div>
    </aside>
  );
}

function DispatchPageSubheader({ jobs, crews, mapOnly, onToggleMap }) {
  const totals = dUseMemo(() => {
    const assigned = jobs.filter(j => j.crew);
    return {
      jobs: assigned.length,
      crews: crews.filter(c => assigned.some(j => j.crew === c.id)).length,
      unassigned: jobs.filter(j => !j.crew).length,
    };
  }, [jobs, crews]);

  return (
    <div className="subhdr">
      <div className="subhdr-title">
        <span className="date-num" style={{ fontSize: 26 }}>Dispatch</span>
        <span className="date-day">{totals.jobs} jobs · {totals.crews} crews · {totals.unassigned} unassigned</span>
      </div>
      <div className="spacer"></div>
      <button className="filter-chip"><span className="dot" style={{ background: "var(--status-ok)" }}></span> ALL DIVISIONS</button>
      <button className="btn btn-ghost" onClick={onToggleMap}>{mapOnly ? "Show list" : "Map focus"}</button>
      <button className="btn btn-primary">Notify Crews</button>
    </div>
  );
}

function DispatchApp() {
  const D = window.DATA;
  const [dark, setDark] = dUseState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = dUseState(false);
  const [mapOnly, setMapOnly] = dUseState(false);
  const jobs = D.ALL_JOBS;
  const crews = D.INITIAL_CREWS;

  dUseEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <div className="app" data-collapsed={String(sidebarCollapsed)}>
      <DispatchHeader
        collapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(v => !v)}
        dark={dark}
        onToggleDark={() => setDark(v => !v)}
      />
      <DispatchSidebar />
      <main className="main app-main">
        <DispatchPageSubheader
          jobs={jobs}
          crews={crews}
          mapOnly={mapOnly}
          onToggleMap={() => setMapOnly(v => !v)}
        />
        <window.DispatchView
          jobs={jobs}
          crews={crews}
          mapOnly={mapOnly}
          onToggleMap={() => setMapOnly(v => !v)}
        />
      </main>
    </div>
  );
}

window.DispatchApp = DispatchApp;
