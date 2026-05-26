// Settings — Configuration & Security + Data Setup nav
// Calendars subtab (default) shows configurable calendar cards.
// Matches structure of attached reference screenshot.

const { useState: sUseState, useEffect: sUseEffect, useMemo: sUseMemo, useRef: sUseRef, useCallback: sUseCallback } = React;

const SetIcons = {
  Cog:        (p) => <Ico {...p} d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"]} />,
  Users:      (p) => <Ico {...p} d={["M16 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1","M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M22 21v-1a4 4 0 0 0-3-3.87","M16 4a4 4 0 0 1 0 7.74"]} />,
  Shield:     (p) => <Ico {...p} d={["M12 2 4 6v6c0 5 8 10 8 10s8-5 8-10V6l-8-4Z","M9 12l2 2 4-4"]} />,
  Plug:       (p) => <Ico {...p} d={["M6 7v10","M18 7v10","M6 12h12","M3 4v6","M21 4v6","M9 21v-3","M15 21v-3"]} />,
  Doc:        (p) => <Ico {...p} d={["M14 3H6v18h12V7l-4-4Z","M14 3v4h4","M9 13h6","M9 17h6"]} />,
  Calendar:   (p) => <Ico {...p} d={["M3 9h18","M3 5h18v16H3z","M8 3v4","M16 3v4"]} />,
  Umbrella:   (p) => <Ico {...p} d={["M12 2v3","M2 12h20","M12 12c0-5 4-9 8-7","M12 12c0-5-4-9-8-7","M12 12v8a3 3 0 0 0 6 0"]} />,
  Flag:       (p) => <Ico {...p} d={["M4 21V3","M4 4h12l-2 4 2 4H4"]} />,
  Briefcase:  (p) => <Ico {...p} d={["M3 7h18v13H3z","M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2","M3 13h18"]} />,
  Layers:     (p) => <Ico {...p} d={["M3 8l9 5 9-5-9-5-9 5Z","M3 12l9 5 9-5","M3 16l9 5 9-5"]} />,
  Badge:      (p) => <Ico {...p} d={["M6 4h12v16H6z","M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M9 18a3 3 0 0 1 6 0"]} />,
  Code:       (p) => <Ico {...p} d={["M8 6 2 12l6 6","M16 6l6 6-6 6","M14 4l-4 16"]} />,
  Hat:        (p) => <Ico {...p} d={["M4 17h16v3H4z","M6 17V11a6 6 0 0 1 12 0v6","M12 5V3"]} />,
  Wrench:     (p) => <Ico {...p} d="M14.7 6.3a4 4 0 0 0 5 5L18 13l-7 7-3-3 7-7 1.7-3.7Z" />,
  Truck:      (p) => <Ico {...p} d={["M3 7h11v9H3z","M14 10h4l3 3v3h-7","M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Store:      (p) => <Ico {...p} d={["M3 7l2-4h14l2 4","M3 7v13h18V7","M3 7h18","M9 21V13h6v8"]} />,
  Vendor:     (p) => <Ico {...p} d={["M3 21V11l9-6 9 6v10","M9 21v-6h6v6"]} />,
  Tag:        (p) => <Ico {...p} d={["M20 11l-9 9-8-8 9-9h8z","M9 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"]} />,
  Building:   (p) => <Ico {...p} d={["M4 21h16","M5 21V5l7-2v18","M19 21V9l-7-2","M9 9v.01","M9 13v.01","M9 17v.01","M14 13v.01","M14 17v.01"]} />,
  Hist:       (p) => <Ico {...p} d={["M3 7v6h6","M3 13a9 9 0 1 1 3 7","M12 7v5l3 2"]} />,
  Eye:        (p) => <Ico {...p} d={["M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} />,
  X:          (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Pencil:     (p) => <Ico {...p} d={["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"]} />,
  Trash:      (p) => <Ico {...p} d={["M3 6h18","M8 6V4h8v2","M6 6l1 14h10l1-14","M10 11v5","M14 11v5"]} />,
  Plus:       (p) => <Ico {...p} d={["M12 5v14","M5 12h14"]} />,
  Chev:       (p) => <Ico {...p} d="M9 6l6 6-6 6" />,
  ChevL:      (p) => <Ico {...p} d="M15 6l-6 6 6 6" />,
  Search:     (p) => <Ico {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z","M21 21l-4.3-4.3"]} />,
};

/* ───────── Header / Outer sidebar (matches other surfaces) ───────── */
function SetHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span className="crumb-cur">SETTINGS</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <SetIcons.Search size={12} />
          <span>Find a setting…</span>
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

function SetSidebar({ collapsed }) {
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
      { ico: Icons.Schedule, label: "Projects",   badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment", href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers",    badge: "203" },
    ]},
  ];
  return (
    <aside className="app-sidebar sb">
      {items.map((g) => (
        <React.Fragment key={g.group}>
          <div className="sb-group">{g.group}</div>
          {g.entries.map((e) => (
            <a key={e.label} className="sb-item"
               href={e.href || "#"} style={{ textDecoration: "none" }}>
              <e.ico size={16} />
              <span className="lbl">{e.label}</span>
              {e.badge && <span className="badge">{e.badge}</span>}
            </a>
          ))}
        </React.Fragment>
      ))}
      <div className="sb-spacer"></div>
      <a href="Settings.html" className="sb-item active" style={{ textDecoration: "none" }}>
        <SetIcons.Cog size={16} />
        <span className="lbl">Settings</span>
      </a>
      <div className="sb-foot">
        <span className="gps-dot live"></span>
        <span className="sb-foot-text">CONFIG · v991 · 12 USERS</span>
      </div>
    </aside>
  );
}

/* ───────── Inner left rail (Settings nav) ───────── */
function SettingsRail({ activeKey, onPick }) {
  const groups = [
    { label: "Configuration & Security", items: [
      { key: "settings",      label: "Settings",          ico: SetIcons.Cog },
      { key: "users",         label: "Users",             ico: SetIcons.Users },
      { key: "user-roles",    label: "User Roles",        ico: SetIcons.Shield },
      { key: "integrations",  label: "Integrations",      ico: SetIcons.Plug },
      { key: "forms",         label: "Forms",             ico: SetIcons.Doc },
      { key: "time-off",      label: "Time Off Settings", ico: SetIcons.Umbrella },
    ]},
    { label: "Data Setup", items: [
      { key: "work-statuses",     label: "Work Statuses",        ico: SetIcons.Flag },
      { key: "admin-jobs",        label: "Administrative Jobs",  ico: SetIcons.Briefcase },
      { key: "job-types",         label: "Job Types",            ico: SetIcons.Layers },
      { key: "worker-titles",     label: "Worker Titles",        ico: SetIcons.Badge },
      { key: "work-codes",        label: "Work Codes",           ico: SetIcons.Code },
      { key: "comp-codes",        label: "Worker's Comp Codes",  ico: SetIcons.Hat },
      { key: "equipment",         label: "Equipment",            ico: SetIcons.Wrench },
      { key: "vehicles",          label: "Vehicles",             ico: SetIcons.Truck },
      { key: "materials",         label: "Materials",            ico: SetIcons.Store },
      { key: "vendors",           label: "Vendors",              ico: SetIcons.Vendor },
      { key: "subcontractors",    label: "Subcontractors",       ico: SetIcons.Users },
      { key: "misc-items",        label: "Misc Items",           ico: SetIcons.Tag },
      { key: "divisions",         label: "Divisions",            ico: SetIcons.Building },
    ]},
  ];
  return (
    <aside className="set-rail">
      {groups.map(g => (
        <React.Fragment key={g.label}>
          <div className="group">
            <span>{g.label}</span>
            <button className="collapse" aria-label="Collapse"><SetIcons.ChevL size={11} /></button>
          </div>
          {g.items.map(it => (
            <a key={it.key}
               className={`set-rail-item ${activeKey === it.key ? "active" : ""}`}
               onClick={(e) => { e.preventDefault(); onPick(it.key); }}
               href="#">
              <it.ico size={14} />
              <span className="lbl">{it.label}</span>
            </a>
          ))}
        </React.Fragment>
      ))}
    </aside>
  );
}

/* ───────── Calendar config card ───────── */
function CalCard({ cal, onUpdate, onDelete }) {
  const allStatuses = [
    "Closed", "Job", "Confirmed", "Not Confirmed, Customer Informed",
    "Scheduled, Customer Not Informed", "Moved, Customer Not Informed",
    "On Hold", "Cancelled",
  ];
  const [showOpts, setShowOpts] = sUseState(false);
  const available = allStatuses.filter(s => !cal.jobTypes.includes(s));

  return (
    <article className="cal-card">
      <header className={`cal-card-hdr k-${cal.kind}`}>
        <span className="swatch"></span>
        <span className="nm">{cal.name}</span>
        <span className="kind-pill">{cal.kindLabel}</span>
        <div style={{ flex: 1 }}></div>
        <button className="icon-btn" aria-label="Rename"><SetIcons.Pencil size={14} /></button>
        <button className="icon-btn" aria-label="Delete"><SetIcons.Trash size={14} /></button>
      </header>
      <div className="cal-card-body">
        <label className="lbl">Color Rule</label>
        <div className="set-select-wrap">
          <select className="set-select"
            value={cal.colorRule}
            onChange={(e) => onUpdate({ ...cal, colorRule: e.target.value })}>
            <option>Work Status</option>
            <option>Job Type</option>
            <option>Crew</option>
            <option>Division</option>
            <option>Customer</option>
          </select>
        </div>

        <label className="lbl">Show Time View</label>
        <div className="set-select-wrap">
          <select className="set-select"
            value={cal.showTimeView}
            onChange={(e) => onUpdate({ ...cal, showTimeView: e.target.value })}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <label className="lbl">Time View Increment</label>
        <div className="set-select-wrap">
          <select className="set-select"
            value={cal.timeIncrement}
            onChange={(e) => onUpdate({ ...cal, timeIncrement: e.target.value })}>
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>2 hours</option>
            <option>4 hours</option>
          </select>
        </div>

        <label className="lbl">Job Types</label>
        <div>
          <div className="set-chips" onClick={() => setShowOpts(true)}>
            {cal.jobTypes.length === 0 && <span className="ph">Select statuses…</span>}
            {cal.jobTypes.map(s => (
              <span key={s} className="set-chip">
                {s}
                <button className="x" aria-label={`Remove ${s}`}
                  onClick={(e) => { e.stopPropagation(); onUpdate({ ...cal, jobTypes: cal.jobTypes.filter(x => x !== s) }); }}>
                  <SetIcons.X size={9} />
                </button>
              </span>
            ))}
            {showOpts && available.length > 0 && (
              <div style={{ position: "relative", width: "100%", marginTop: 6 }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  background: "var(--surface-0)",
                  border: "1px solid var(--ink-border)",
                  borderRadius: "var(--r)",
                  padding: 6,
                  display: "flex", flexWrap: "wrap", gap: 4,
                  boxShadow: "var(--shadow-2)",
                  zIndex: 10,
                }}>
                  {available.map(s => (
                    <button key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate({ ...cal, jobTypes: [...cal.jobTypes, s] });
                      }}
                      style={{
                        height: 26, padding: "0 10px",
                        border: "1px dashed var(--ink-border)",
                        background: "transparent",
                        borderRadius: "var(--r)",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)", fontSize: 12,
                        color: "var(--ink-1)",
                      }}>+ {s}</button>
                  ))}
                  <button onClick={(e) => { e.stopPropagation(); setShowOpts(false); }}
                    style={{
                      height: 26, marginLeft: "auto", padding: "0 8px",
                      border: "none", background: "transparent",
                      cursor: "pointer", color: "var(--ink-2)",
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>Done</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <label className="lbl">Default Work Status</label>
        <div className="set-select-wrap">
          <select className="set-select"
            value={cal.defaultStatus}
            onChange={(e) => onUpdate({ ...cal, defaultStatus: e.target.value })}>
            <option>None</option>
            <option>Confirmed</option>
            <option>Scheduled</option>
            <option>On Hold</option>
          </select>
        </div>

        <label className="lbl">Worker Division</label>
        <div className="set-select-wrap">
          <select className="set-select"
            value={cal.division}
            onChange={(e) => onUpdate({ ...cal, division: e.target.value })}>
            <option>All Divisions</option>
            <option>Paving</option>
            <option>Excavation</option>
            <option>Concrete</option>
            <option>Milling</option>
            <option>Striping</option>
          </select>
        </div>
      </div>
    </article>
  );
}

/* ───────── App root ───────── */
function SettingsApp() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "accent": "#F08A2C"
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  sUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  const [railKey, setRailKey] = sUseState("settings");
  const [tab, setTab] = sUseState("COMPANY"); // COMPANY | USER | DATA
  const [subtab, setSubtab] = sUseState("CALENDARS");

  const [calendars, setCalendars] = sUseState([
    {
      id: "c1", name: "Bids (Sales)", kind: "sales", kindLabel: "SALES",
      colorRule: "Work Status", showTimeView: "Yes", timeIncrement: "1 hour",
      jobTypes: ["Closed", "Job", "Confirmed", "Not Confirmed, Customer Informed", "Scheduled, Customer Not Informed", "Moved, Customer Not Informed"],
      defaultStatus: "None", division: "All Divisions",
    },
    {
      id: "c2", name: "Paving (Crew)", kind: "crew", kindLabel: "CREW",
      colorRule: "Work Status", showTimeView: "Yes", timeIncrement: "1 hour",
      jobTypes: ["Closed", "Job", "Confirmed", "Not Confirmed, Customer Informed", "Scheduled, Customer Not Informed", "Moved, Customer Not Informed"],
      defaultStatus: "None", division: "All Divisions",
    },
    {
      id: "c3", name: "Dispatch (Trucks)", kind: "disp", kindLabel: "DISPATCH",
      colorRule: "Crew", showTimeView: "Yes", timeIncrement: "30 minutes",
      jobTypes: ["Confirmed", "Scheduled, Customer Not Informed"],
      defaultStatus: "Confirmed", division: "Paving",
    },
  ]);
  const [newName, setNewName] = sUseState("");
  const [newType, setNewType] = sUseState("sales");
  const [toast, setToast] = sUseState(null);
  const toastTimerRef = sUseRef(null);
  const lastDeletedRef = sUseRef(null);

  const showToast = sUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);
  const handleUndo = sUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);

  sUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault(); handleUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo]);

  const updateCal = (next) => setCalendars(prev => prev.map(c => c.id === next.id ? next : c));
  const deleteCal = (id) => {
    const cal = calendars.find(c => c.id === id);
    if (!cal) return;
    const idx = calendars.findIndex(c => c.id === id);
    setCalendars(prev => prev.filter(c => c.id !== id));
    showToast(
      `Calendar <strong>${cal.name}</strong> deleted`,
      () => setCalendars(prev => {
        const next = [...prev];
        next.splice(idx, 0, cal);
        return next;
      })
    );
  };
  const addCalendar = () => {
    if (!newName.trim()) return;
    const id = `c${Date.now()}`;
    const kindLabel = newType === "sales" ? "SALES" : newType === "crew" ? "CREW" : "DISPATCH";
    setCalendars(prev => [...prev, {
      id, name: `${newName} (${kindLabel.charAt(0)}${kindLabel.slice(1).toLowerCase()})`,
      kind: newType, kindLabel,
      colorRule: "Work Status", showTimeView: "Yes", timeIncrement: "1 hour",
      jobTypes: [], defaultStatus: "None", division: "All Divisions",
    }]);
    showToast(
      `Calendar <strong>${newName}</strong> added`,
      () => setCalendars(prev => prev.filter(c => c.id !== id))
    );
    setNewName("");
  };

  const subtabs = ["CALENDARS", "JOB BOARD", "PAYROLL", "CLOCK IN", "MISC", "BILLING", "DISPATCH"];

  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <SetHeader collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark} onToggleDark={() => setTweak("dark", !t.dark)} />
      <SetSidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Settings</span>
            <span className="date-day">COMPANY CONFIG · 3 CALENDARS · 12 USERS · v991</span>
          </div>
          <div style={{ flex: 1 }}></div>
          <div className="set-utility">
            <button className="icon-btn" aria-label="Preview">
              <SetIcons.Eye size={16} />
            </button>
            <button className="icon-btn" aria-label="History">
              <SetIcons.Hist size={16} />
            </button>
          </div>
          <button className="btn btn-secondary" style={{ height: 32 }}>
            Export config
          </button>
          <button className="btn btn-primary" style={{ height: 32 }}>
            Save all changes
          </button>
        </div>

        <div className="settings">
          <SettingsRail activeKey={railKey} onPick={setRailKey} />

          <section className="set-main">
            <div className="set-tabs">
              {[
                { key: "COMPANY", lbl: "Company Settings" },
                { key: "USER",    lbl: "User Settings" },
                { key: "DATA",    lbl: "Data Objects" },
              ].map(x => (
                <button key={x.key} className={`set-tab ${tab === x.key ? "active" : ""}`}
                  onClick={() => setTab(x.key)}>
                  {x.lbl}
                </button>
              ))}
            </div>

            <div className="set-subtabs">
              {subtabs.map(st => (
                <button key={st} className={`set-subtab ${subtab === st ? "active" : ""}`}
                  onClick={() => setSubtab(st)}>
                  {st}
                </button>
              ))}
            </div>

            <div className="set-body">
              {tab === "COMPANY" && subtab === "CALENDARS" && (
                <>
                  <div className="set-section-h">
                    <span className="num">{calendars.length}</span>
                    <span className="h">Calendars</span>
                    <span className="hint">Configure schedule views · drag to reorder</span>
                    <div className="right">
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 11,
                        color: "var(--ink-2)", letterSpacing: "0.04em"
                      }}>AUTOSAVED 12s AGO</span>
                    </div>
                  </div>

                  {calendars.map(c => (
                    <CalCard key={c.id} cal={c}
                      onUpdate={updateCal}
                      onDelete={() => deleteCal(c.id)} />
                  ))}

                  <div className="set-add-row" style={{ marginTop: "var(--s4)" }}>
                    <input className="set-input" placeholder="Calendar name…"
                      value={newName} onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") addCalendar(); }} />
                    <div className="set-select-wrap">
                      <select className="set-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                        <option value="sales">Sales</option>
                        <option value="crew">Crew</option>
                        <option value="disp">Dispatch</option>
                      </select>
                    </div>
                    <button className="btn btn-primary"
                      disabled={!newName.trim()}
                      style={{ height: 36, opacity: newName.trim() ? 1 : 0.5 }}
                      onClick={addCalendar}>
                      <SetIcons.Plus size={12} /> ADD
                    </button>
                  </div>
                </>
              )}

              {tab === "COMPANY" && subtab !== "CALENDARS" && (
                <EmptySection label={subtab} />
              )}

              {tab !== "COMPANY" && (
                <EmptySection label={tab === "USER" ? "User Settings" : "Data Objects"} />
              )}
            </div>
          </section>
        </div>
      </main>

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
      </window.TweaksPanel>
    </div>
  );
}

function EmptySection({ label }) {
  return (
    <div style={{
      border: "1px dashed var(--ink-border)", borderRadius: "var(--r)",
      padding: 48, textAlign: "center",
      display: "flex", flexDirection: "column", gap: 12, alignItems: "center",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "var(--r)",
        background: "var(--surface-1)", display: "grid", placeItems: "center",
        color: "var(--ink-2)",
      }}>
        <SetIcons.Cog size={22} />
      </div>
      <div style={{ fontSize: 16, color: "var(--ink-0)" }}>{label} configuration</div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--ink-2)", letterSpacing: "0.04em", maxWidth: 380
      }}>
        This section uses the same field grammar as Calendars — label / control / chip multi-select.
        Switch to the CALENDARS subtab to see a populated example.
      </div>
    </div>
  );
}

window.SettingsApp = SettingsApp;
