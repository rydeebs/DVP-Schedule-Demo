// Customers — customer portfolio, search/filter, and detail drawer.

const { useState: cUseState, useEffect: cUseEffect, useMemo: cUseMemo } = React;

const CustIcons = {
  Search:   (p) => <Ico {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z","M21 21l-4.3-4.3"]} />,
  Plus:     (p) => <Ico {...p} d={["M12 5v14","M5 12h14"]} />,
  X:        (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Download: (p) => <Ico {...p} d={["M4 17v3h16v-3","M12 4v10","M7 9l5 5 5-5"]} />,
  Mail:     (p) => <Ico {...p} d={["M4 5h16v14H4z","M4 7l8 6 8-6"]} />,
};

function CustHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span className="crumb-cur">CUSTOMERS</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <CustIcons.Search size={12} />
          <span>Find customers, contacts, accounts...</span>
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

function CustSidebar() {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch", badge: "47", href: "Dispatch.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms", badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety", badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files", href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects", badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", badge: "ACTIVE", active: true, href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment", href: "Equipment.html" },
      { ico: Icons.Users,    label: "Workers", badge: "203" },
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
        <span className="sb-foot-text">NETSUITE · SYNCED 12s</span>
      </div>
    </aside>
  );
}

function CustomerHero({ activeTier, setActiveTier }) {
  const D = window.CUST_DATA;
  const tiers = ["strategic", "active", "dormant", "lead"];
  return (
    <div className="cust-hero">
      <div className="cell bold">
        <span className="l">Customer revenue · YTD</span>
        <span className="v">{D.fmtMoney(D.CUST_STATS.totalYtdRevenue)}<span className="sub">/ {D.fmtMoney(D.CUST_STATS.totalLtv)} LTV</span></span>
        <span className="f">{D.CUST_STATS.totalActiveProjects} active projects · {D.CUST_STATS.totalPipelineProjects} pipeline</span>
      </div>
      {tiers.map((tier) => {
        const t = D.TIERS[tier];
        const count = D.CUST_STATS[tier];
        return (
          <button key={tier}
            className={`cell t-${tier} ${activeTier === tier ? "active" : ""}`}
            onClick={() => setActiveTier(activeTier === tier ? "all" : tier)}
          >
            <span className="l"><span className="swatch"></span>{t.lbl}</span>
            <span className="v">{count}</span>
            <span className="f">{t.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

function CustomerCard({ customer, selected, onOpen }) {
  const D = window.CUST_DATA;
  const rep = D.SALES_REPS[customer.srId];
  const tier = D.TIERS[customer.tier];
  return (
    <article className={`cust-card ${selected ? "selected" : ""}`} onClick={() => onOpen(customer.id)}>
      <div className="head">
        <div className="logo">{customer.short.slice(0, 2).toUpperCase()}</div>
        <div style={{ minWidth: 0 }}>
          <div className="nm">{customer.name}</div>
          <div className="industry">{D.CUST_INDUSTRY[customer.industry]} · {tier.lbl}</div>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="l">YTD revenue</span>
          <span className="v signal">{D.fmtMoney(customer.ytdRevenue)}</span>
        </div>
        <div className="stat">
          <span className="l">Lifetime</span>
          <span className="v">{D.fmtMoney(customer.ltv)}</span>
        </div>
        <div className="stat compact">
          <span className="l">Active</span>
          <span className="v">{customer.activeProjects}</span>
        </div>
        <div className="stat compact">
          <span className="l">Pipeline</span>
          <span className="v">{customer.pipelineProjects}</span>
        </div>
      </div>
      <div className="meta">
        <span>{customer.city}, {customer.state}</span>
        <span className="sep">·</span>
        <span>{customer.siteCount} sites</span>
        <span className="rep"><span className="av">{rep?.init}</span>{rep?.name}</span>
      </div>
    </article>
  );
}

function CustomerSections({ customers, selectedId, onOpen }) {
  const D = window.CUST_DATA;
  const tiers = ["strategic", "active", "dormant", "lead"];
  return (
    <>
      {tiers.map((tier) => {
        const list = customers.filter(c => c.tier === tier);
        if (!list.length) return null;
        return (
          <section key={tier} className={`cust-section t-${tier}`}>
            <div className="cust-section-hdr">
              <span className="pill-lg">{D.TIERS[tier].lbl}</span>
              <span className="num">{list.length}</span>
              <span className="hint">{D.TIERS[tier].desc}</span>
              <span className="right">{D.fmtMoney(list.reduce((a, c) => a + c.ytdRevenue, 0))} YTD</span>
            </div>
            <div className="cust-grid">
              {list.map(c => <CustomerCard key={c.id} customer={c} selected={selectedId === c.id} onOpen={onOpen} />)}
            </div>
          </section>
        );
      })}
    </>
  );
}

function CustomerTable({ customers, onOpen }) {
  const D = window.CUST_DATA;
  return (
    <div className="proj-table-wrap">
      <table className="cust-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Tier</th>
            <th>Industry</th>
            <th>Rep</th>
            <th>Projects</th>
            <th>Last activity</th>
            <th style={{ textAlign: "right" }}>YTD</th>
            <th style={{ textAlign: "right" }}>LTV</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => {
            const rep = D.SALES_REPS[c.srId];
            return (
              <tr key={c.id} onClick={() => onOpen(c.id)}>
                <td className="col-name">{c.name}</td>
                <td className="col-mono">{D.TIERS[c.tier].lbl}</td>
                <td>{D.CUST_INDUSTRY[c.industry]}</td>
                <td className="col-mono">{rep?.init} · {rep?.name}</td>
                <td className="col-mono">{c.activeProjects} active · {c.pipelineProjects} pipe</td>
                <td className="col-mono">{c.lastActivity}</td>
                <td className="col-money">{D.fmtMoney(c.ytdRevenue)}</td>
                <td className="col-money">{D.fmtMoney(c.ltv)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CustomerDrawer({ customer, onClose }) {
  if (!customer) return null;
  const D = window.CUST_DATA;
  const rep = D.SALES_REPS[customer.srId];
  const contacts = D.CONTACTS[customer.id] || [];
  const activity = D.ACTIVITY[customer.id] || [];
  return (
    <aside className="cust-drawer" role="dialog" aria-label="Customer detail">
      <header className="cust-drawer-hdr">
        <div className="row1">
          <div className="logo">{customer.short.slice(0, 2).toUpperCase()}</div>
          <div className="col">
            <span className="code">{customer.netsuite} · {D.TIERS[customer.tier].lbl}</span>
            <span className="nm">{customer.name}</span>
            <span className="meta">
              {D.CUST_INDUSTRY[customer.industry]}
              <span className="sep">·</span>
              {customer.city}, {customer.state}
              <span className="sep">·</span>
              Rep {rep?.init}
            </span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close customer detail">
            <CustIcons.X size={16} />
          </button>
        </div>
      </header>
      <div className="cust-drawer-body">
        <div className="cust-stats-grid">
          <div className="s"><span className="l">YTD revenue</span><span className="v">{D.fmtMoney(customer.ytdRevenue)}</span></div>
          <div className="s"><span className="l">Lifetime</span><span className="v">{D.fmtMoney(customer.ltv)}</span></div>
          <div className="s"><span className="l">Sites</span><span className="v">{customer.siteCount}</span></div>
          <div className="s"><span className="l">Active</span><span className="v">{customer.activeProjects}</span></div>
          <div className="s"><span className="l">Pipeline</span><span className="v">{customer.pipelineProjects}</span></div>
          <div className="s"><span className="l">Last touch</span><span className="v">{customer.lastActivity}</span></div>
        </div>
        {customer.note && <div className="job-note" style={{ marginBottom: 12 }}>{customer.note}</div>}
        <div className="cust-sub-h">Contacts <span className="c">{contacts.length}</span></div>
        {contacts.length ? contacts.map(k => (
          <div key={k.id} className="contact-row">
            <div className="av">{k.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</div>
            <div>
              <div className="nm">{k.name}{k.primary && <span className="badge">PRIMARY</span>}</div>
              <div className="title">{k.title}</div>
            </div>
            <div className="contact-meta">
              <span>{k.phone}</span>
              <span>{k.email}</span>
            </div>
          </div>
        )) : <div className="lane-empty">NO CONTACTS ON FILE</div>}
        <div className="cust-sub-h">Recent activity <span className="c">{activity.length}</span></div>
        {activity.length ? activity.map((a, i) => (
          <div key={`${a.at}-${i}`} className={`activity-row k-${a.kind}`}>
            <span className="dot"></span>
            <span className="at">{a.at}</span>
            <span className="msg"><span className="kind">{a.kind}</span>{a.msg}</span>
          </div>
        )) : <div className="lane-empty">NO RECENT ACTIVITY</div>}
      </div>
      <footer className="cust-drawer-foot">
        <button className="btn btn-secondary"><CustIcons.Mail size={12} /> Email</button>
        <button className="btn btn-primary">New project</button>
      </footer>
    </aside>
  );
}

function CustomerFormDrawer({ open, onClose, onSave }) {
  const D = window.CUST_DATA;
  const [form, setForm] = cUseState({
    name: "",
    short: "",
    industry: "re",
    tier: "lead",
    srId: "sr1",
    city: "",
    state: "NJ",
    note: "",
  });

  cUseEffect(() => {
    if (open) {
      setForm({
        name: "",
        short: "",
        industry: "re",
        tier: "lead",
        srId: "sr1",
        city: "",
        state: "NJ",
        note: "",
      });
    }
  }, [open]);

  if (!open) return null;
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const canSave = form.name.trim() && form.city.trim();

  return (
    <aside className="cust-drawer" role="dialog" aria-label="Add customer">
      <header className="cust-drawer-hdr">
        <div className="row1">
          <div className="logo">+</div>
          <div className="col">
            <span className="code">NEW CUSTOMER</span>
            <span className="nm">Create account</span>
            <span className="meta">Adds a customer to the CRM list</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close customer drawer"><CustIcons.X size={16} /></button>
        </div>
      </header>
      <div className="cust-drawer-body">
        <div className="add-form-grid-2">
          <label className="add-form-field">
            <span className="lbl">Customer name</span>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Customer name" />
          </label>
          <label className="add-form-field">
            <span className="lbl">Short name</span>
            <input value={form.short} onChange={(e) => setField("short", e.target.value)} placeholder="Short name" />
          </label>
        </div>
        <div className="add-form-grid-2">
          <label className="add-form-field">
            <span className="lbl">Industry</span>
            <select value={form.industry} onChange={(e) => setField("industry", e.target.value)}>
              {Object.entries(D.CUST_INDUSTRY).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label className="add-form-field">
            <span className="lbl">Tier</span>
            <select value={form.tier} onChange={(e) => setField("tier", e.target.value)}>
              {Object.entries(D.TIERS).map(([key, val]) => <option key={key} value={key}>{val.lbl}</option>)}
            </select>
          </label>
        </div>
        <div className="add-form-grid-2">
          <label className="add-form-field">
            <span className="lbl">City</span>
            <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="City" />
          </label>
          <label className="add-form-field">
            <span className="lbl">State</span>
            <input value={form.state} onChange={(e) => setField("state", e.target.value)} placeholder="ST" />
          </label>
        </div>
        <label className="add-form-field">
          <span className="lbl">Sales rep</span>
          <select value={form.srId} onChange={(e) => setField("srId", e.target.value)}>
            {Object.entries(D.SALES_REPS).map(([id, rep]) => <option key={id} value={id}>{rep.name}</option>)}
          </select>
        </label>
        <label className="add-form-field">
          <span className="lbl">Notes</span>
          <textarea value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="Account notes" />
        </label>
      </div>
      <footer className="cust-drawer-foot">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!canSave} onClick={() => onSave(form)}>Add Customer</button>
      </footer>
    </aside>
  );
}

function CustomersApp() {
  const D = window.CUST_DATA;
  const [dark, setDark] = cUseState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = cUseState(false);
  const [view, setView] = cUseState("CARDS");
  const [activeTier, setActiveTier] = cUseState("all");
  const [query, setQuery] = cUseState("");
  const [openId, setOpenId] = cUseState(null);
  const [customers, setCustomers] = cUseState(D.CUSTOMERS);
  const [addCustomerOpen, setAddCustomerOpen] = cUseState(false);
  const [newProjectOpen, setNewProjectOpen] = cUseState(false);

  cUseEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const filtered = cUseMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter(c => {
      if (activeTier !== "all" && c.tier !== activeTier) return false;
      if (!q) return true;
      return `${c.name} ${c.short} ${c.city} ${c.state} ${c.netsuite} ${D.CUST_INDUSTRY[c.industry]}`.toLowerCase().includes(q);
    });
  }, [D, query, activeTier, customers]);

  const openCustomer = openId ? customers.find(c => c.id === openId) : null;
  const addCustomer = (form) => {
    const id = `c-new-${Date.now()}`;
    const customer = {
      id,
      name: form.name.trim(),
      short: form.short.trim() || form.name.trim().slice(0, 12),
      industry: form.industry,
      tier: form.tier,
      srId: form.srId,
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      siteCount: 1,
      activeProjects: 0,
      pipelineProjects: 1,
      ytdRevenue: 0,
      ltv: 0,
      lastActivity: "just now",
      netsuite: `CUST-${String(customers.length + 100).padStart(3, "0")}`,
      note: form.note.trim(),
    };
    setCustomers(prev => [customer, ...prev]);
    setAddCustomerOpen(false);
    setOpenId(id);
  };

  return (
    <div className="app" data-collapsed={String(sidebarCollapsed)}>
      <CustHeader
        collapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(v => !v)}
        dark={dark}
        onToggleDark={() => setDark(v => !v)}
      />
      <CustSidebar />
      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Customers</span>
            <span className="date-day">{D.CUST_STATS.totalCustomers} accounts · {D.CUST_STATS.totalActiveProjects} active projects</span>
          </div>
          <div className="spacer"></div>
          <button className="btn btn-ghost" onClick={() => window.DVPAction("Customer export queued")}><CustIcons.Download size={14} /> Export</button>
          <button className="btn btn-secondary" onClick={() => setNewProjectOpen(true)}><CustIcons.Plus size={14} /> New project</button>
          <button className="btn btn-primary" onClick={() => setAddCustomerOpen(true)}><CustIcons.Plus size={14} /> Add Customer</button>
        </div>
        <CustomerHero activeTier={activeTier} setActiveTier={setActiveTier} />
        <div className="cust-tools">
          <div className="cust-search">
            <CustIcons.Search size={13} />
            <input placeholder="Search customers..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="tabs">
            {["CARDS", "TABLE"].map(t => (
              <button key={t} className={`tab ${view === t ? "active" : ""}`} onClick={() => setView(t)}>{t}</button>
            ))}
          </div>
          <span className="num" style={{ fontSize: 11, color: "var(--ink-2)", marginLeft: "auto" }}>
            SHOWING {filtered.length} OF {D.CUSTOMERS.length}
          </span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {view === "CARDS" ? (
            <CustomerSections customers={filtered} selectedId={openId} onOpen={setOpenId} />
          ) : (
            <CustomerTable customers={filtered} onOpen={setOpenId} />
          )}
        </div>
      </main>
      <CustomerDrawer customer={openCustomer} onClose={() => setOpenId(null)} />
      <CustomerFormDrawer open={addCustomerOpen} onClose={() => setAddCustomerOpen(false)} onSave={addCustomer} />
      <aside className="cust-drawer" role="dialog" aria-label="New project" style={{ display: newProjectOpen ? "flex" : "none" }}>
        <header className="cust-drawer-hdr">
          <div className="row1">
            <div className="logo">+</div>
            <div className="col">
              <span className="code">NEW PROJECT</span>
              <span className="nm">Project request</span>
              <span className="meta">This button now does something concrete</span>
            </div>
            <button className="icon-btn" onClick={() => setNewProjectOpen(false)} aria-label="Close project drawer"><CustIcons.X size={16} /></button>
          </div>
        </header>
        <div className="cust-drawer-body">
          <div className="cust-stats-grid">
            <div className="s"><span className="l">Action</span><span className="v" style={{ fontSize: 17 }}>Routing</span></div>
            <div className="s"><span className="l">Target</span><span className="v" style={{ fontSize: 17 }}>Projects</span></div>
          </div>
          <div className="proj-info-row"><span className="lbl">Result</span><span className="val">This will open the Projects workspace with a starter card ready to create.</span></div>
        </div>
        <footer className="cust-drawer-foot">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setNewProjectOpen(false)}>Close</button>
          <button className="btn btn-primary" style={{ flex: 1.4 }} onClick={() => { window.location.href = "Projects.html"; }}>Open Projects</button>
        </footer>
      </aside>
    </div>
  );
}

window.CustomersApp = CustomersApp;
