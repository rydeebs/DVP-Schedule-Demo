// Forms surface — urgency-first inbox + Daily Report fill flow
// Continues design-system.md Industrial Utilitarian language.

const { useState: frmUseState, useEffect: frmUseEffect, useMemo: frmUseMemo, useRef: frmUseRef, useCallback: frmUseCallback } = React;

/* ─────────────────────── Icons ─────────────────────── */
const FormIcons = {
  Clipboard:  (p) => <Ico {...p} d={["M9 4h6a2 2 0 0 1 2 2v0H7v0a2 2 0 0 1 2-2Z","M5 6h14v15H5z","M9 11h6","M9 15h6","M9 19h4"]} />,
  ShieldHard: (p) => <Ico {...p} d={["M12 2 4 6v6c0 5 8 10 8 10s8-5 8-10V6l-8-4Z","M8 12h8","M12 8v8"]} />,
  Triangle:   (p) => <Ico {...p} d={["M12 3 2 20h20L12 3Z","M12 10v5","M12 18v.01"]} />,
  Search:     (p) => <Ico {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z","M21 21l-4.3-4.3"]} />,
  User:       (p) => <Ico {...p} d={["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M4 21a8 8 0 0 1 16 0"]} />,
  Wrench:     (p) => <Ico {...p} d="M14.7 6.3a4 4 0 0 0 5 5L18 13l-7 7-3-3 7-7 1.7-3.7Z" />,
  Cert:       (p) => <Ico {...p} d={["M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z","M9 14l-2 7 5-3 5 3-2-7"]} />,
  Bulb:       (p) => <Ico {...p} d={["M9 18h6","M10 22h4","M12 2a6 6 0 0 0-4 10.5c1 1 2 2 2 4h4c0-2 1-3 2-4A6 6 0 0 0 12 2Z"]} />,
  Send:       (p) => <Ico {...p} d={["M22 2 11 13","M22 2l-7 20-4-9-9-4 20-7Z"]} />,
  Check:      (p) => <Ico {...p} d="M4 12l5 5 11-11" />,
  Stack:      (p) => <Ico {...p} d={["M3 8l9 5 9-5-9-5-9 5Z","M3 12l9 5 9-5","M3 16l9 5 9-5"]} />,
  X:          (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  ArrowRight: (p) => <Ico {...p} d={["M5 12h14","M13 5l7 7-7 7"]} />,
  Eye:        (p) => <Ico {...p} d={["M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} />,
};

function templateIcon(tpl, size = 16) {
  const map = {
    daily: FormIcons.Clipboard, toolbox: FormIcons.ShieldHard,
    incident: FormIcons.Triangle, investig: FormIcons.Search,
    discip: FormIcons.User, equipins: FormIcons.Wrench,
    feedback: FormIcons.Bulb, cert: FormIcons.Cert,
  };
  const I = map[tpl?.id] || FormIcons.Clipboard;
  return <I size={size} />;
}

/* ─────────────────────── Header + Sidebar (forms-active) ─────────────────────── */
function FormsHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span>FIELD</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-cur">FORMS</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <Icons.Search size={12} />
          <span>Find forms, jobs, foremen…</span>
          <span className="cmdk-kbd">⌘K</span>
        </button>
        <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="badge">3</span>
        </button>
        <button className="avatar" title="Karen Faggioli · Project Admin">KF</button>
      </div>
    </header>
  );
}

function FormsSidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", badge: "", href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",      badge: "47", href: "Crew Calendar Board.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", active: true, href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",      badge: "", href: "Files.html" },
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
              style={{ textDecoration: "none" }}>
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
        <span className="sb-foot-text">96% COMPLIANCE · 7D</span>
      </div>
    </aside>
  );
}

/* ─────────────────────── Inbox row ─────────────────────── */
function InboxRow({ inst, onOpen }) {
  const D = window.FORMS_DATA;
  const tpl = D.FORM_TEMPLATES[inst.tplId];
  const owner = D.FORM_USERS[inst.ownerId];
  const total = tpl?.fields || 1;
  const pct = Math.round(((inst.progress || 0) / total) * 100);
  const isAppr = inst.urgency === "review";
  const reviewer = inst.reviewerId ? D.FORM_USERS[inst.reviewerId] : null;
  const isDone = inst.urgency === "done";

  return (
    <article className={`fmf-row k-${tpl?.tone || "info"}`} onClick={() => onOpen(inst)}>
      <span className="urgency-bar"></span>
      <span className="ki">{templateIcon(tpl, 12)}</span>
      <div className="col-form">
        <span className="nm">{tpl?.name}</span>
        <span className="sub">
          {tpl?.freq} · {tpl?.fields} FIELDS · ~{tpl?.est}min
          {tpl?.required && <> · <span style={{ color: "var(--signal)" }}>REQUIRED</span></>}
          {inst.note && <> · <span>{inst.note}</span></>}
        </span>
      </div>
      <div className="col-job">
        <span className="code">{inst.jobCode}</span>
        <span className="nm">{inst.jobName}</span>
      </div>
      <div className="col-owner">
        <span className="av">{owner?.init}</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {owner?.name}
          <span style={{ color: "var(--ink-3)" }}> · {inst.crew || owner?.role}</span>
        </span>
      </div>
      <div className="col-due">
        {isDone ? (
          <>
            <span className="lbl">APPROVED</span>
            <span className="v" style={{ color: "var(--status-ok)" }}>
              {inst.approvedAt} · {reviewer?.init}
            </span>
          </>
        ) : isAppr ? (
          <>
            <span className="lbl">SUBMITTED</span>
            <span className="v">{inst.submittedAt}</span>
          </>
        ) : (
          <>
            <span className="lbl">{inst.urgency === "overdue" ? `${inst.hoursLate}H LATE` : "DUE"}</span>
            <span className="v">{inst.dueBy}</span>
          </>
        )}
      </div>
      <div className="col-action">
        {isDone ? (
          <button className="btn btn-ghost" style={{ height: 28 }} onClick={(e) => { e.stopPropagation(); }}>
            <FormIcons.Eye size={12} /> View
          </button>
        ) : isAppr ? (
          <>
            <button className="btn btn-secondary" style={{ height: 28 }} onClick={(e) => e.stopPropagation()}>
              <FormIcons.X size={12} /> Send back
            </button>
            <button className="btn btn-primary" style={{ height: 28 }} onClick={(e) => e.stopPropagation()}>
              <FormIcons.Check size={12} /> Approve
            </button>
          </>
        ) : inst.progress > 0 ? (
          <div className="fmf-progress">
            <div className="track"><div className="fill" style={{ width: `${pct}%` }}></div></div>
            <span><span style={{ color: "var(--ink-0)" }}>{inst.progress}</span>/{total}</span>
          </div>
        ) : (
          <button className="btn btn-primary" style={{ height: 28 }} onClick={(e) => { e.stopPropagation(); onOpen(inst); }}>
            <FormIcons.ArrowRight size={12} /> Fill now
          </button>
        )}
      </div>
    </article>
  );
}

/* ─────────────────────── Inbox view ─────────────────────── */
function FormsInbox({ instances, urgencyFilter, setUrgencyFilter, onOpen }) {
  const D = window.FORMS_DATA;

  const groups = [
    { key: "overdue", lbl: "Overdue",         hint: "Past due — get these in first.",                  className: "g-overdue" },
    { key: "today",   lbl: "Due today",       hint: "Must close by end of shift.",                     className: "g-today" },
    { key: "week",    lbl: "Due this week",   hint: "Scheduled — start anytime.",                      className: "g-week" },
    { key: "review",  lbl: "Awaiting review", hint: "Submitted forms pending your approval.",          className: "g-review" },
    { key: "done",    lbl: "Recently approved", hint: "Last 7 days — historical, archived nightly.",   className: "g-done" },
  ];

  const byKey = instances.reduce((m, i) => {
    (m[i.urgency] ||= []).push(i);
    return m;
  }, {});

  // If a urgency filter is active, show only that one
  const groupsToShow = urgencyFilter
    ? groups.filter(g => g.key === urgencyFilter)
    : groups;

  return (
    <>
      <FormsHero
        stats={D.FORMS_STATS}
        active={urgencyFilter}
        setActive={setUrgencyFilter}
      />
      {groupsToShow.map((g) => {
        const items = byKey[g.key] || [];
        if (items.length === 0) return null;
        return (
          <section key={g.key} className={`fmf-group ${g.className}`}>
            <div className="fmf-group-h">
              <span className="count">{items.length}</span>
              <span className="pill-lg">{g.lbl}</span>
              <span className="hint">{g.hint}</span>
              <span className="right">SORTED BY DUE TIME ↑</span>
            </div>
            <div className="fmf-rows">
              {items.map(i => <InboxRow key={i.id} inst={i} onOpen={onOpen} />)}
            </div>
          </section>
        );
      })}

      {/* Empty state if filter yields nothing */}
      {urgencyFilter && (byKey[urgencyFilter] || []).length === 0 && (
        <div className="f-empty">
          <div className="ico"><FormIcons.Check size={28} /></div>
          <div className="h">Nothing in this bucket. Nice.</div>
          <div className="s">Pull from another urgency above, or clear the filter.</div>
          <div className="row">
            <button className="btn btn-secondary" onClick={() => setUrgencyFilter(null)}>Clear filter</button>
          </div>
        </div>
      )}
    </>
  );
}

/* Hero — five clickable stats double as urgency filters */
function FormsHero({ stats, active, setActive }) {
  const items = [
    { key: "overdue", l: "Overdue",          v: stats.overdue,        cls: "urgent", f: "Get these in first" },
    { key: "today",   l: "Due today",        v: stats.dueToday,       cls: "today",  f: "By end of shift" },
    { key: "week",    l: "Due this week",    v: stats.dueThisWeek,    cls: "",       f: "Scheduled · 7 days" },
    { key: "review",  l: "Awaiting review",  v: stats.awaitingReview, cls: "",       f: "Pending your approval" },
    { key: "done",    l: "Compliance · 7d",  v: stats.complianceRate, cls: "",       f: `${stats.submittedThisWeek} submitted this week`, suffix: "%" },
  ];
  return (
    <div className="fmf-hero">
      {items.map(s => (
        <div key={s.key}
          className={`stat ${s.cls} ${active === s.key ? "active" : ""}`}
          onClick={() => setActive(active === s.key ? null : s.key)}
        >
          <span className="l">{s.l}</span>
          <span className="v">{s.v}{s.suffix || ""}</span>
          <span className="f">{s.f}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────── All Forms audit table ─────────────────────── */
function FormsAudit({ instances }) {
  const D = window.FORMS_DATA;
  const sorted = [...instances].sort((a, b) =>
    (b.submittedAt || b.dueAt || "").localeCompare(a.submittedAt || a.dueAt || "")
  );

  return (
    <div style={{
      border: "1px solid var(--ink-border)",
      borderRadius: "var(--r)",
      overflow: "hidden",
      background: "var(--surface-1)",
    }}>
      <div className="f-list-row head" style={{
        gridTemplateColumns: "1.4fr 120px 1fr 1.4fr 110px 110px 100px"
      }}>
        <span>FORM NAME</span>
        <span>FREQUENCY</span>
        <span>CREATED BY</span>
        <span>JOB</span>
        <span>PERIOD</span>
        <span>STATUS</span>
        <span>LAST RESPONSE</span>
      </div>
      {sorted.map(inst => {
        const tpl = D.FORM_TEMPLATES[inst.tplId];
        const owner = D.FORM_USERS[inst.ownerId];
        return (
          <div key={inst.id} className="f-list-row" style={{
            gridTemplateColumns: "1.4fr 120px 1fr 1.4fr 110px 110px 100px"
          }}>
            <span className="nm-cell">{tpl?.name}</span>
            <span style={{ color: "var(--ink-1)" }}>{tpl?.freq}</span>
            <span className="by-cell">{owner?.name}</span>
            <span className="by-cell">{inst.jobCode} · {inst.jobName}</span>
            <span style={{ color: "var(--ink-0)" }}>{(inst.dueAt || inst.submittedAt || "").slice(0, 10)}</span>
            <span>
              {inst.status === "approved" && <StatusPill variant="ok">APPROVED</StatusPill>}
              {inst.status === "submitted" && <StatusPill variant="warn">SUBMITTED</StatusPill>}
              {inst.status === "draft" && <StatusPill variant="info">DRAFT</StatusPill>}
              {inst.status === "not-started" && <StatusPill variant="stop">NOT STARTED</StatusPill>}
            </span>
            <span style={{ color: "var(--ink-0)" }}>{inst.submittedAt || inst.lastSavedAt || "—"}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── Templates catalog ─────────────────────── */
function FormsTemplates({ onStart }) {
  const D = window.FORMS_DATA;
  return (
    <div className="fmf-tpl-grid">
      {D.TEMPLATE_CATALOG.map(tc => {
        const tpl = D.FORM_TEMPLATES[tc.tplId];
        return (
          <article key={tc.tplId} className="fmf-tpl" onClick={() => onStart(tpl)}>
            <div className="fmf-tpl-top">
              <span className="ki">{templateIcon(tpl, 16)}</span>
              <div style={{ flex: 1 }}>
                <div className="nm">{tpl.name}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <StatusPill variant={tpl.tone}>{tpl.freq}</StatusPill>
                  <StatusPill variant="info">{tpl.category.toUpperCase()}</StatusPill>
                </div>
              </div>
            </div>
            <div className="desc">{tpl.desc}</div>
            <div className="meta">
              <span><span className="used">{tc.used}</span> filed</span>
              <span className="sep">·</span>
              <span>{tpl.fields} fields · ~{tpl.est}min</span>
              <span className="sep">·</span>
              <span>last {tc.lastUsed}</span>
              <span style={{ flex: 1 }}></span>
              <button className="btn btn-primary" style={{ height: 26, fontSize: 11 }}>
                <FormIcons.Send size={11} /> Start
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ─────────────────────── Side rail (compliance + crew owes) ─────────────────────── */
function FormsSide() {
  const D = window.FORMS_DATA;
  const c = D.FORMS_STATS;

  const owes = [
    { ownerId: "u1", overdue: 1, today: 2, label: "Crew 14 — Vasquez" },
    { ownerId: "u2", overdue: 1, today: 2, label: "Crew 22 — Doherty" },
    { ownerId: "u3", overdue: 0, today: 1, label: "Crew 07 — Diaz" },
    { ownerId: "u4", overdue: 1, today: 1, label: "Crew 31 — Patel" },
    { ownerId: "u5", overdue: 0, today: 0, label: "Crew 09 — Jenkins" },
  ];

  const onTimePct  = Math.round((c.totalCompliant / c.totalThisYear) * 100);
  const latePct    = 100 - onTimePct - 1;
  const missingPct = 100 - onTimePct - latePct;

  return (
    <aside className="forms-side">
      <div className="fmf-side-section">
        <div className="fmf-side-h">
          <span>Compliance · YTD</span>
          <span className="c">{c.totalThisYear.toLocaleString()} FORMS</span>
        </div>
        <div className="fmf-compliance-num">
          {onTimePct}<span className="pct">%</span>
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--ink-2)", letterSpacing: "0.04em",
        }}>
          {c.totalCompliant.toLocaleString()} of {c.totalThisYear.toLocaleString()} on time
        </div>
        <div className="fmf-compliance-bar">
          <div className="seg-ok"    style={{ width: `${onTimePct}%` }}></div>
          <div className="seg-late"  style={{ width: `${latePct}%` }}></div>
          <div className="seg-miss"  style={{ width: `${missingPct}%` }}></div>
        </div>
        <div style={{
          display: "flex", gap: 12, marginTop: 8,
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "var(--ink-2)", letterSpacing: "0.04em",
        }}>
          <span><span style={{
            display: "inline-block", width: 8, height: 8,
            background: "var(--status-ok)", borderRadius: 1,
            marginRight: 4, verticalAlign: "middle"
          }}></span>ON TIME</span>
          <span><span style={{
            display: "inline-block", width: 8, height: 8,
            background: "var(--status-warn)", borderRadius: 1,
            marginRight: 4, verticalAlign: "middle"
          }}></span>LATE</span>
          <span><span style={{
            display: "inline-block", width: 8, height: 8,
            background: "var(--status-stop)", borderRadius: 1,
            marginRight: 4, verticalAlign: "middle"
          }}></span>MISSED</span>
        </div>
      </div>

      <div className="fmf-side-section">
        <div className="fmf-side-h">
          <span>Who owes what · today</span>
          <span className="c">{owes.reduce((a, x) => a + x.overdue + x.today, 0)} OPEN</span>
        </div>
        {owes.map(o => {
          const u = D.FORM_USERS[o.ownerId];
          return (
            <div key={o.ownerId} className={`fmf-side-row ${o.overdue > 0 ? "bad" : ""}`}>
              <span className="av">{u?.init}</span>
              <span className="nm">{o.label}</span>
              <span>
                {o.overdue > 0 && <span className="v" style={{ color: "var(--status-stop)" }}>{o.overdue}!</span>}
                {o.overdue > 0 && o.today > 0 && <span style={{ color: "var(--ink-3)" }}> · </span>}
                {o.today > 0 && <span className="v">{o.today}</span>}
                {o.overdue === 0 && o.today === 0 && <span style={{ color: "var(--status-ok)" }}>✓</span>}
              </span>
            </div>
          );
        })}
      </div>

      <div className="fmf-side-section" style={{ borderBottom: "none" }}>
        <div className="fmf-side-h">
          <span>Quick actions</span>
        </div>
        <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start" }}>
          <FormIcons.Send size={12} /> Nudge all overdue foremen
        </button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
          <Icons.Doc size={12} /> Export compliance CSV
        </button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
          <Icons.Plus size={12} /> Create form template
        </button>
      </div>
    </aside>
  );
}

window.FormsHeader = FormsHeader;
window.FormsSidebar = FormsSidebar;
window.FormsInbox = FormsInbox;
window.FormsAudit = FormsAudit;
window.FormsTemplates = FormsTemplates;
window.FormsSide = FormsSide;
window.templateIcon = templateIcon;
window.FormIcons = FormIcons;
