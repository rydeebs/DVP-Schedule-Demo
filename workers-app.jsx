// Workers — dedicated roster, schedule, office, and time-off view.

const { useState: wUseState, useEffect: wUseEffect, useMemo: wUseMemo, useCallback: wUseCallback, useRef: wUseRef } = React;

function WorkersHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span className="crumb-cur">WORKERS</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <Icons.Search size={12} />
          <span>Find workers, crews, offices...</span>
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

function WorkersSidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",      badge: "47", href: "Dispatch.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",  badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",  badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",   href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",  badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment",  href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers",    badge: String(window.WORKERS_DATA?.workers?.length || 0), active: true, href: "Workers.html" },
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
      <a href="Settings.html" className="sb-item" style={{ textDecoration: "none" }}>
        <Icons.Settings size={16} />
        <span className="lbl">Settings</span>
      </a>
      <div className="sb-foot">
        <span className="gps-dot live"></span>
        <span className="sb-foot-text">ROSTER · LIVE · {window.WORKERS_DATA?.workers?.length || 0} WORKERS</span>
      </div>
    </aside>
  );
}

function WorkersWeekCell({ entry }) {
  return (
    <div className={`worker-week-cell status-${entry.status}`}>
      <span className="dow">{entry.key}</span>
      <span className="lbl">{entry.label}</span>
      <span className="meta">{entry.detail}</span>
    </div>
  );
}

function WorkersDetailDrawer({ worker, onClose }) {
  if (!worker) return null;
  const timeOff = worker.timeOffDays || [];
  const current = worker.scheduleStatus || worker.schedule?.[2];
  const crewJobs = worker.crewJobs || [];
  const workCount = worker.statusCounts?.work || 0;

  return (
    <aside className="proj-drawer worker-detail-drawer" role="dialog" aria-label="Worker detail">
      <header className="proj-drawer-hdr">
        <div className="row1">
          <span className="code">{worker.id}</span>
          <StatusPill variant={current?.tone || "info"}>{current?.label || "OFF"}</StatusPill>
          <h2 className="nm">{worker.name}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icons.X size={14} /></button>
        </div>
        <div className="meta">
          <Icons.Users size={11} /><span>{worker.role}</span>
          <span className="sep">·</span>
          <Icons.Building size={11} /><span>{worker.office}</span>
          <span className="sep">·</span>
          <Icons.Calendar size={11} /><span>{worker.crewName || "Bench / unassigned"}</span>
        </div>
      </header>

      <div className="proj-drawer-body">
        <div className="proj-stats">
          <div className="s">
            <span className="l">Crew</span>
            <span className="v" style={{ fontSize: 17 }}>{worker.crewName || "Unassigned"}</span>
          </div>
          <div className="s">
            <span className="l">Office</span>
            <span className="v" style={{ fontSize: 17 }}>{worker.office}</span>
          </div>
          <div className="s">
            <span className="l">Today</span>
            <span className="v" style={{ fontSize: 17 }}>{current?.label || "OFF"}</span>
          </div>
          <div className="s">
            <span className="l">Week load</span>
            <span className="v" style={{ fontSize: 17 }}>{workCount} shifts</span>
          </div>
        </div>

        <div className="proj-info-row">
          <span className="lbl">Name</span>
          <span className="val">{worker.name}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Role</span>
          <span className="val">{worker.role}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Division</span>
          <span className="val">{worker.division}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Foreman</span>
          <span className="val">{worker.foreman || "—"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Crew size</span>
          <span className="val">{worker.crewSize || "—"}</span>
        </div>
        <div className="proj-info-row">
          <span className="lbl">Time off</span>
          <span className="val">{timeOff.length ? timeOff.map((entry) => `${entry.key} ${entry.label}`).join(" · ") : "None scheduled"}</span>
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)" }}>Week schedule</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em", color: "var(--ink-2)" }}>{window.DATA.WEEK_DAYS[2].date} selected</span>
        </div>
        <div className="worker-week-grid" style={{ marginTop: 8 }}>
          {worker.schedule.map((entry) => <WorkersWeekCell key={`${worker.id}-${entry.dayIndex}`} entry={entry} />)}
        </div>

        <div className="cust-sub-h" style={{ marginTop: 18 }}>
          <span>Assigned jobs</span>
          <span className="c">{crewJobs.length}</span>
        </div>
        <div className="worker-job-list crew-job-list">
          {crewJobs.slice(0, 8).map((item, index) => (
            <div className="worker-job-row" key={`${worker.id}-${item.jobId}-${index}`}>
              <span className="code">{window.DATA.WEEK_DAYS[item.dayIndex]?.key || "DAY"}</span>
              <span className="nm">{item.job?.code || item.jobId}</span>
              <span className="meta">{item.job?.name || "Scheduled job"}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="proj-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Close</button>
        <button className="btn btn-primary" style={{ flex: 1.4 }} onClick={() => window.DVPAction(`${worker.name} notification queued`)}>
          <Icons.Bell size={12} /> Notify worker
        </button>
      </footer>
    </aside>
  );
}

function WorkersApp() {
  const D = window.DATA;
  const data = window.WORKERS_DATA || { workers: [], OFFICES: [] };

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    dark: false,
    density: "comfortable",
    sidebarCollapsed: false,
    accent: "#F08A2C",
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  wUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  const [query, setQuery] = wUseState("");
  const [statusFilter, setStatusFilter] = wUseState("all");
  const [officeFilter, setOfficeFilter] = wUseState("all");
  const [crewFilter, setCrewFilter] = wUseState("all");
  const [selectedWorkerId, setSelectedWorkerId] = wUseState(null);
  const [toast, setToast] = wUseState(null);
  const toastTimerRef = wUseRef(null);

  const showToast = wUseCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setToast({ id, msg, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const visibleWorkers = wUseMemo(() => {
    const q = query.trim().toLowerCase();
    return data.workers
      .filter((worker) => {
        if (statusFilter !== "all") {
          if (statusFilter === "crew" && !worker.isAssigned) return false;
          if (statusFilter === "bench" && worker.isAssigned) return false;
          if (["pto", "vacation", "off", "training", "shop"].includes(statusFilter)) {
            if (worker.scheduleStatus?.status !== statusFilter) return false;
          }
        }
        if (officeFilter !== "all" && worker.office !== officeFilter) return false;
        if (crewFilter !== "all") {
          if (crewFilter === "bench" && worker.isAssigned) return false;
          if (crewFilter !== "bench" && worker.crewName !== crewFilter) return false;
        }
        if (!q) return true;
        const hay = `${worker.name} ${worker.role} ${worker.office} ${worker.crewName || ""} ${worker.division} ${worker.scheduleStatus?.detail || ""}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => {
        const crewA = a.crewName || "ZZZ Bench";
        const crewB = b.crewName || "ZZZ Bench";
        if (crewA !== crewB) return crewA.localeCompare(crewB);
        return a.name.localeCompare(b.name);
      });
  }, [data.workers, query, statusFilter, officeFilter, crewFilter]);

  const totals = wUseMemo(() => {
    const officeSet = new Set(data.workers.map((w) => w.office));
    const today = data.workers.map((w) => w.scheduleStatus?.status);
    const away = data.workers.filter((w) => ["pto", "vacation"].includes(w.scheduleStatus?.status)).length;
    const off = data.workers.filter((w) => w.scheduleStatus?.status === "off").length;
    return {
      total: data.workers.length,
      crew: data.workers.filter((w) => w.isAssigned).length,
      bench: data.workers.filter((w) => !w.isAssigned).length,
      away,
      off,
      offices: officeSet.size,
      workingToday: today.filter((x) => x === "work").length,
    };
  }, [data.workers]);

  const selectedWorker = wUseMemo(
    () => data.workers.find((worker) => worker.id === selectedWorkerId) || null,
    [data.workers, selectedWorkerId],
  );

  wUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.querySelector(".workers-search input")?.focus();
      }
      if (e.key === "Escape") setSelectedWorkerId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <WorkersHeader
        collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark}
        onToggleDark={() => setTweak("dark", !t.dark)}
      />
      <WorkersSidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main workers-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Workers</span>
            <span className="date-day">
              {totals.total} WORKERS · {totals.crew} ON CREW · {totals.bench} BENCH · {totals.away} PTO / VACATION
            </span>
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary" style={{ height: 32 }} onClick={() => window.DVPAction("Roster export queued")}>
            <Icons.Doc size={12} /> Export roster
          </button>
          <button className="btn btn-primary" style={{ height: 32 }} onClick={() => showToast("Worker roster notification queued")}>
            <Icons.Bell size={12} /> Notify workers
          </button>
        </div>

        <div className="workers-page">
          <div className="metrics workers-metrics">
            <HeroMetric
              label="Workers"
              value={totals.total}
              sub=""
              footer={`${totals.workingToday} working today`}
            />
            <HeroMetric
              label="On crew"
              value={totals.crew}
              sub=""
              footer={`${D.INITIAL_CREWS.length} crews represented`}
            />
            <HeroMetric
              label="Bench"
              value={totals.bench}
              sub=""
              footer="Available or not assigned"
            />
            <HeroMetric
              label="Away"
              value={totals.away}
              sub=""
              footer="PTO and vacation today"
            />
            <HeroMetric
              label="Offices"
              value={totals.offices}
              sub=""
              footer="Home offices represented"
            />
          </div>

          <div className="cust-tools workers-tools">
            <div className="cust-search workers-search">
              <Icons.Search size={13} />
              <input placeholder="Search workers, crews, offices..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="tabs workers-tabs" style={{ gap: 6 }}>
              {[
                { key: "all", label: "ALL" },
                { key: "crew", label: "CREW" },
                { key: "bench", label: "BENCH" },
                { key: "pto", label: "PTO" },
                { key: "vacation", label: "VACATION" },
                { key: "off", label: "OFF" },
              ].map((opt) => (
                <button key={opt.key} className={`tab ${statusFilter === opt.key ? "active" : ""}`} onClick={() => setStatusFilter(opt.key)}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="set-select-wrap workers-filter">
              <select className="set-select" value={officeFilter} onChange={(e) => setOfficeFilter(e.target.value)}>
                <option value="all">All offices</option>
                {data.OFFICES.map((office) => <option key={office} value={office}>{office}</option>)}
              </select>
            </div>

            <div className="set-select-wrap workers-filter">
              <select className="set-select" value={crewFilter} onChange={(e) => setCrewFilter(e.target.value)}>
                <option value="all">All crews</option>
                {(D.INITIAL_CREWS || []).map((crew) => <option key={crew.id} value={crew.name}>{crew.name}</option>)}
                <option value="bench">Bench only</option>
              </select>
            </div>
          </div>

          <div className="workers-table">
            <div className="workers-head">
              <span>Worker</span>
              <span>Crew / Office</span>
              <span>Today</span>
              <span>Week schedule</span>
            </div>
            {visibleWorkers.map((worker) => {
              const today = worker.scheduleStatus;
              const chipState = worker.isAssigned
                ? "assigned"
                : (worker.state && ["pto", "vacation", "training", "shop", "sick"].includes(worker.state))
                  ? "unavailable"
                  : "available-dash";
              return (
                <button
                  key={worker.id}
                  className={`workers-row ${selectedWorkerId === worker.id ? "selected" : ""}`}
                  onClick={() => setSelectedWorkerId(worker.id)}
                >
                  <div className="workers-cell worker-main">
                    <WorkerChip worker={worker} state={chipState} dense />
                    <div className="worker-copy">
                      <span className="name">{worker.name}</span>
                      <span className="meta">{worker.role} · {worker.crewName || "Bench / unassigned"}</span>
                    </div>
                  </div>
                  <div className="workers-cell worker-crew">
                    <span className="val">{worker.crewName || "Bench"}</span>
                    <span className="meta">{worker.office}</span>
                  </div>
                  <div className="workers-cell worker-today">
                    <StatusPill variant={today?.tone || "info"}>{today?.label || "OFF"}</StatusPill>
                    <span className="meta">{today?.detail || "No schedule"}</span>
                  </div>
                  <div className="workers-cell worker-week">
                    {worker.schedule.map((entry) => (
                      <div key={`${worker.id}-${entry.dayIndex}`} className={`worker-week-cell status-${entry.status}`}>
                        <span className="dow">{entry.key}</span>
                        <span className="lbl">{entry.label}</span>
                        <span className="meta">{entry.detail}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}

            {visibleWorkers.length === 0 && (
              <div className="workers-empty">
                No workers match this filter
              </div>
            )}
          </div>
        </div>
      </main>

      <WorkersDetailDrawer worker={selectedWorker} onClose={() => setSelectedWorkerId(null)} />

      {toast && (
        <div className="toast-wrap">
          <div className="toast">
            <span className="t-time">{toast.time}</span>
            <span className="t-msg">{toast.msg}</span>
            <button className="t-undo" onClick={() => setToast(null)}>OK</button>
            <div className="toast-prog" key={toast.id}></div>
          </div>
        </div>
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Appearance" />
        <window.TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <window.TweakRadio
          label="Density"
          options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]}
          value={t.density}
          onChange={(v) => setTweak("density", v)}
        />
        <window.TweakColor
          label="Signal accent"
          value={t.accent}
          options={["#F08A2C", "#D4B83A", "#C84536", "#221F1B"]}
          onChange={(v) => setTweak("accent", v)}
        />
      </window.TweaksPanel>
    </div>
  );
}

window.WorkersApp = WorkersApp;
