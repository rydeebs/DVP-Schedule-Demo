// Safety surface — Overview / Certifications / Training / Incidents / Policies
// Continues the design system. Demonstrates a bulk-select TABLE interaction.

const { useState: sUseState, useEffect: sUseEffect, useMemo: sUseMemo, useRef: sUseRef, useCallback: sUseCallback } = React;

/* ─────────────────────────── Icons ─────────────────────────── */
const SafIcons = {
  Hard:       (p) => <Ico {...p} d={["M4 17h16v3H4z","M6 17V11a6 6 0 0 1 12 0v6","M12 5V3"]} />,
  Cert:       (p) => <Ico {...p} d={["M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z","M9 14l-2 7 5-3 5 3-2-7"]} />,
  Bandage:    (p) => <Ico {...p} d={["M10 13 4 19a3 3 0 0 0 4 4l6-6","M14 11l6-6a3 3 0 0 0-4-4l-6 6","M9 14l1 1","M11 12l1 1","M13 10l1 1","M15 8l1 1"]} />,
  Calendar:   (p) => <Ico {...p} d={["M3 9h18","M3 5h18v16H3z","M8 3v4","M16 3v4"]} />,
  Refresh:    (p) => <Ico {...p} d={["M3 12a9 9 0 0 1 15-6.7l3-3v8h-8l3-3A6 6 0 0 0 6 12","M21 12a9 9 0 0 1-15 6.7l-3 3v-8h8l-3 3A6 6 0 0 0 18 12"]} />,
  Send:       (p) => <Ico {...p} d={["M22 2 11 13","M22 2l-7 20-4-9-9-4 20-7Z"]} />,
  Check:      (p) => <Ico {...p} d="M4 12l5 5 11-11" />,
  ChevR:      (p) => <Ico {...p} d="M9 6l6 6-6 6" />,
  X:          (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Plus:       (p) => <Ico {...p} d={["M12 5v14","M5 12h14"]} />,
  Doc:        (p) => <Ico {...p} d={["M14 3H6v18h12V7l-4-4Z","M14 3v4h4","M9 13h6","M9 17h6"]} />,
  Triangle:   (p) => <Ico {...p} d={["M12 3 2 20h20L12 3Z","M12 10v5","M12 18v.01"]} />,
  Eye:        (p) => <Ico {...p} d={["M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} />,
};

/* ─────────────────────────── Header / Sidebar ─────────────────────────── */
function SafetyHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
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
          <span className="crumb-cur">SAFETY</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <Icons.Search size={12} />
          <span>Find certs, workers, incidents…</span>
          <span className="cmdk-kbd">⌘K</span>
        </button>
        <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="badge">3</span>
        </button>
        <button className="avatar" title="Devon King · Safety Officer">DK</button>
      </div>
    </header>
  );
}

function SafetySidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",      badge: "47", href: "Dispatch.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", active: true, href: "Safety.html" },
      { ico: Icons.Folder, label: "Files",      href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",  badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", href: "Customers.html" },
      { ico: Icons.Wrench,   label: "Equipment", href: "Equipment.html" },
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
        <span className="sb-foot-text">{window.SAFETY_DATA.SAFETY_STATS.daysSinceLast} DAYS · INC FREE</span>
      </div>
    </aside>
  );
}

/* ─────────────────────────── Overview ─────────────────────────── */
function SafetyOverview({ onJumpCerts }) {
  const D = window.SAFETY_DATA;
  const s = D.SAFETY_STATS;

  // Group cert holdings by urgency
  const certsByUrgency = sUseMemo(() => {
    const buckets = { expired: [], urgent: [], upcoming: [], ok: [] };
    D.CERT_HOLDINGS.forEach(c => {
      const days = D.daysFromToday(c.expires);
      if (days < 0) buckets.expired.push({ ...c, daysLeft: days });
      else if (days <= 30) buckets.urgent.push({ ...c, daysLeft: days });
      else if (days <= 90) buckets.upcoming.push({ ...c, daysLeft: days });
      else buckets.ok.push({ ...c, daysLeft: days });
    });
    Object.values(buckets).forEach(arr => arr.sort((a, b) => a.daysLeft - b.daysLeft));
    return buckets;
  }, []);

  const maxBar = sUseMemo(() => Math.max(...s.monthly.map(m => m.incidents)), [s.monthly]);

  return (
    <>
      <div className="saf-hero">
        <div className="cell bold">
          <span className="l">Days since last recordable</span>
          <span className="v">{s.daysSinceLast}</span>
          <span className="f">YTD recordables: {s.recordablesYtd} · prior YTD: {s.recordablesPrior}</span>
        </div>
        <div className="cell">
          <span className="l">TRIR · YTD</span>
          <span className="v sm">{s.trirYtd.toFixed(1)}</span>
          <span className="f">
            <span className="delta-down">▼ {(s.trirPrior - s.trirYtd).toFixed(1)}</span> vs. last year ({s.trirPrior})
          </span>
        </div>
        <div className="cell urgent">
          <span className="l">Certs expiring &lt; 30d</span>
          <span className="v sm">{s.expiringSoon}<span className="sub" style={{ color: "var(--status-stop)", marginLeft: 6 }}>+{s.expired} expired</span></span>
          <span className="f"><button onClick={onJumpCerts} style={{
            background: "transparent", border: "none", padding: 0,
            font: "inherit", color: "var(--signal)", cursor: "pointer",
            textDecoration: "underline", textUnderlineOffset: 2
          }}>RENEW NOW →</button></span>
        </div>
        <div className="cell">
          <span className="l">Training compliance</span>
          <span className="v sm">{s.trainingCompliance}<span className="sub">%</span></span>
          <span className="f">{D.WORKERS.length} workers · weekly toolbox 96%</span>
        </div>
        <div className="cell">
          <span className="l">Open investigations</span>
          <span className="v sm">{s.openInvestigations}</span>
          <span className="f">oldest 2d · routed to Devon King</span>
        </div>
      </div>

      {/* 6-month incidents trend */}
      <section className="saf-sect">
        <div className="saf-sect-h">
          <span className="num">{s.monthly.reduce((a, m) => a + m.incidents, 0)}</span>
          <span className="h">Incidents · 6 months</span>
          <span className="hint">{s.monthly.reduce((a, m) => a + m.recordable, 0)} recordable · {s.recordablesPrior - s.recordablesYtd > 0 ? "trending down" : "trending up"}</span>
          <div className="right">
            <button className="filter-chip"><Icons.Filter size={12} /> ALL CREWS</button>
          </div>
        </div>
        <div className="saf-bars" style={{ height: 60 }}>
          {s.monthly.map((m) => {
            const incH = (m.incidents / Math.max(1, maxBar)) * 28;
            const recH = (m.recordable / Math.max(1, maxBar)) * 28;
            return (
              <div key={m.m} className="bar-col">
                <div className="stack">
                  {m.recordable > 0 && <div className="bar-rec" style={{ height: `${recH + 8}px` }}></div>}
                  <div className="bar-inc" style={{ height: `${incH + 4}px` }}></div>
                </div>
                <span>{m.m}</span>
                <span style={{ color: "var(--ink-0)", fontSize: 11 }}>{m.incidents}</span>
              </div>
            );
          })}
        </div>
        <div style={{
          display: "flex", gap: 14, marginTop: 12,
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "var(--ink-2)", letterSpacing: "0.04em",
        }}>
          <span><span style={{
            display: "inline-block", width: 8, height: 8,
            background: "var(--ink-3)", borderRadius: 1,
            marginRight: 6, verticalAlign: "middle"
          }}></span>INCIDENT</span>
          <span><span style={{
            display: "inline-block", width: 8, height: 8,
            background: "var(--status-stop)", borderRadius: 1,
            marginRight: 6, verticalAlign: "middle"
          }}></span>RECORDABLE</span>
        </div>
      </section>

      {/* Expiring certs preview */}
      <section className="saf-sect">
        <div className="saf-sect-h">
          <span className="num">{certsByUrgency.expired.length + certsByUrgency.urgent.length}</span>
          <span className="h">Certifications · expired + expiring &lt; 30 days</span>
          <span className="hint">Renew before the next shift starts</span>
          <div className="right">
            <button className="btn btn-secondary" style={{ height: 28 }} onClick={onJumpCerts}>
              View all certifications <SafIcons.ChevR size={12} />
            </button>
          </div>
        </div>
        <div className="cert-table" style={{ borderRadius: "var(--r)" }}>
          {[...certsByUrgency.expired, ...certsByUrgency.urgent].slice(0, 6).map(c => (
            <CertRow key={c.id} cert={c} selected={false} onToggle={() => {}} compact />
          ))}
        </div>
      </section>

      {/* Open investigations */}
      <section className="saf-sect">
        <div className="saf-sect-h">
          <span className="num">{D.INCIDENTS.filter(i => i.status === "investigating").length}</span>
          <span className="h">Open investigations</span>
          <span className="hint">Awaiting root-cause + corrective actions</span>
        </div>
        <div className="cert-table">
          <div className="inc-row head">
            <span></span>
            <span>WHEN</span>
            <span>INCIDENT</span>
            <span>SEVERITY</span>
            <span>JOB & CREW</span>
            <span>STATUS</span>
          </div>
          {D.INCIDENTS.filter(i => i.status === "investigating").map(i => (
            <IncidentRow key={i.id} inc={i} />
          ))}
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────── Cert row (shared) ─────────────────────────── */
function CertRow({ cert, selected, onToggle, head, compact, onAction }) {
  const D = window.SAFETY_DATA;
  if (head) {
    return (
      <div className="cert-row head">
        <span></span>
        <span></span>
        <span>WORKER</span>
        <span>CERTIFICATION</span>
        <span>ISSUED</span>
        <span>EXPIRES</span>
        <span>COUNTDOWN</span>
        <span></span>
      </div>
    );
  }
  const w = D.WORKERS.find(x => x.id === cert.workerId);
  const t = D.CERT_TYPES[cert.typeId];
  const days = cert.daysLeft;
  const urgClass =
    days < 0 ? "u-expired" :
    days <= 30 ? "u-urgent" :
    days <= 90 ? "u-upcoming" : "u-ok";
  const countdownText =
    days < 0 ? `${-days}d EXPIRED` :
    days === 0 ? "EXPIRES TODAY" :
    days <= 30 ? `${days}d LEFT` :
    days <= 90 ? `${days}d` :
    `${Math.floor(days / 30)}mo`;

  return (
    <div className={`cert-row ${urgClass} ${selected ? "selected" : ""}`}
      onClick={(e) => { if (!e.target.closest(".cert-cb") && !e.target.closest("button")) onToggle?.(cert.id); }}>
      <div className={`cert-cb ${selected ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); onToggle?.(cert.id); }}>
        {selected && <SafIcons.Check size={11} />}
      </div>
      <span className="urgency-bar"></span>
      <div className="col-worker">
        <span className="av">{w?.init}</span>
        <div style={{ minWidth: 0 }}>
          <div className="nm">{w?.name}</div>
          <div className="role">{w?.role} · {w?.crew}</div>
        </div>
      </div>
      <div className="col-cert">
        <div className="nm">{t?.name}</div>
        <div className="iss">{t?.issuer.toUpperCase()} · VALID {t?.validMonths}mo</div>
      </div>
      <div className="col-date">
        <span className="lbl">ISSUED</span>
        {cert.issued.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$2/$3/$1")}
      </div>
      <div className="col-date">
        <span className="lbl">EXPIRES</span>
        {cert.expires.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$2/$3/$1")}
      </div>
      <div className="col-countdown">{countdownText}</div>
      <div className="col-action">
        {(days < 30) && (
          <button className="btn btn-secondary" style={{ height: 26, fontSize: 11 }}
            onClick={(e) => { e.stopPropagation(); onAction?.([cert.id]); }}>
            <SafIcons.Refresh size={11} /> Renew
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Certifications view ─────────────────────────── */
function CertificationsView({ onRenew, certTypes }) {
  const D = window.SAFETY_DATA;
  const TYPES = certTypes || D.CERT_TYPES;
  const [filter, setFilter] = sUseState("all"); // all | expired | urgent | upcoming | ok
  const [query, setQuery] = sUseState("");
  const [selected, setSelected] = sUseState({});

  const all = sUseMemo(() => D.CERT_HOLDINGS.map(c => ({
    ...c,
    daysLeft: D.daysFromToday(c.expires),
  })).sort((a, b) => a.daysLeft - b.daysLeft), []);

  const counts = sUseMemo(() => ({
    expired: all.filter(c => c.daysLeft < 0).length,
    urgent: all.filter(c => c.daysLeft >= 0 && c.daysLeft <= 30).length,
    upcoming: all.filter(c => c.daysLeft > 30 && c.daysLeft <= 90).length,
    ok: all.filter(c => c.daysLeft > 90).length,
  }), [all]);

  const visible = sUseMemo(() => {
    return all.filter(c => {
      if (filter === "expired"  && c.daysLeft >= 0) return false;
      if (filter === "urgent"   && (c.daysLeft < 0 || c.daysLeft > 30)) return false;
      if (filter === "upcoming" && (c.daysLeft <= 30 || c.daysLeft > 90)) return false;
      if (filter === "ok"       && c.daysLeft <= 90) return false;
      if (query) {
        const w = D.WORKERS.find(x => x.id === c.workerId);
        const t = TYPES[c.typeId];
        const hay = `${w?.name} ${w?.role} ${w?.crew} ${t?.name} ${t?.issuer}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [all, filter, query]);

  const toggle = (id) => setSelected(s => {
    const next = { ...s };
    if (next[id]) delete next[id]; else next[id] = true;
    return next;
  });
  const selectedIds = Object.keys(selected);
  const selectAll = () => setSelected(Object.fromEntries(visible.map(c => [c.id, true])));
  const clearAll = () => setSelected({});

  return (
    <>
      <div className="cert-tools">
        <button className={`filter-chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          ALL <span className="cnt">{all.length}</span>
        </button>
        <button className={`filter-chip expired ${filter === "expired" ? "active" : ""}`} onClick={() => setFilter("expired")}>
          EXPIRED <span className="cnt">{counts.expired}</span>
        </button>
        <button className={`filter-chip urgent ${filter === "urgent" ? "active" : ""}`} onClick={() => setFilter("urgent")}>
          &lt; 30 DAYS <span className="cnt">{counts.urgent}</span>
        </button>
        <button className={`filter-chip upcoming ${filter === "upcoming" ? "active" : ""}`} onClick={() => setFilter("upcoming")}>
          30–90 DAYS <span className="cnt">{counts.upcoming}</span>
        </button>
        <button className={`filter-chip ok ${filter === "ok" ? "active" : ""}`} onClick={() => setFilter("ok")}>
          VALID <span className="cnt">{counts.ok}</span>
        </button>
        <div className="search">
          <Icons.Search size={12} />
          <input placeholder="Filter by worker, crew, or certification…"
            value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>⌘F</span>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="cert-bulk">
          <span className="num-sel">{selectedIds.length}</span>
          <span className="lbl">SELECTED</span>
          <button className="bulk-btn" onClick={clearAll}>
            <SafIcons.X size={11} /> Clear
          </button>
          <span className="spc"></span>
          <button className="bulk-btn">
            <SafIcons.Send size={11} /> Notify worker
          </button>
          <button className="bulk-btn">
            <SafIcons.Doc size={11} /> Export CSV
          </button>
          <button className="bulk-btn primary" onClick={() => onRenew(selectedIds, clearAll)}>
            <SafIcons.Refresh size={11} /> Schedule renewal · {selectedIds.length}
          </button>
        </div>
      )}

      <div className="cert-table">
        <div className="cert-row head">
          <div className={`cert-cb ${visible.length > 0 && selectedIds.length === visible.length ? "on" : ""}`}
               onClick={() => selectedIds.length === visible.length ? clearAll() : selectAll()}>
            {selectedIds.length === visible.length && visible.length > 0 && <SafIcons.Check size={11} />}
          </div>
          <span></span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Worker</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Certification</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Issued</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Expires</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "right" }}>Countdown</span>
          <span></span>
        </div>
        {visible.length === 0 ? (
          <div style={{
            padding: 48, textAlign: "center",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--ink-3)", letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            No certifications match this filter
          </div>
        ) : (
          visible.map(c => (
            <CertRow key={c.id} cert={c} selected={!!selected[c.id]}
              onToggle={toggle}
              onAction={(ids) => onRenew(ids, () => {})} />
          ))
        )}
      </div>
    </>
  );
}

/* ─────────────────────────── Incidents view ─────────────────────────── */
function IncidentsView() {
  const D = window.SAFETY_DATA;
  return (
    <>
      <div className="saf-sect-h">
        <span className="num">{D.INCIDENTS.length}</span>
        <span className="h">Incidents · last 90 days</span>
        <span className="hint">{D.INCIDENTS.filter(i => i.status === "investigating").length} open · {D.INCIDENTS.filter(i => i.recordable).length} recordable</span>
        <div className="right">
          <button className="filter-chip" onClick={() => window.DVPAction("Incident severity filter opened")}><Icons.Filter size={12} /> SEVERITY</button>
          <button className="btn btn-primary" style={{ height: 28 }} onClick={() => window.DVPAction("Incident intake opened")}>
            <SafIcons.Plus size={12} /> File incident
          </button>
        </div>
      </div>
      <div className="cert-table">
        <div className="inc-row head">
          <span></span>
          <span>WHEN</span>
          <span>INCIDENT</span>
          <span>SEVERITY</span>
          <span>JOB & CREW</span>
          <span>STATUS</span>
        </div>
        {D.INCIDENTS.map(i => <IncidentRow key={i.id} inc={i} />)}
      </div>
    </>
  );
}

function IncidentRow({ inc }) {
  const D = window.SAFETY_DATA;
  const worker = D.WORKERS.find(w => w.id === inc.workerId);
  const sevMap = {
    minor: { tone: "warn", label: "MINOR" },
    near:  { tone: "warn", label: "NEAR MISS" },
    watch: { tone: "info", label: "WATCH" },
    stop:  { tone: "stop", label: "RECORDABLE" },
  };
  const sev = sevMap[inc.severity] || { tone: "info", label: inc.severity.toUpperCase() };
  return (
    <article className={`inc-row sev-${inc.severity}`}>
      <span className="urgency-bar"></span>
      <div className="date-cell">
        {inc.at.slice(5, 10).replace("-", "/")}
        <span className="when">{inc.at.slice(11, 16)}</span>
      </div>
      <div className="title-cell">
        <div className="t">{inc.title}</div>
        <div className="n">{inc.note}</div>
      </div>
      <div>
        <StatusPill variant={sev.tone}>{sev.label}</StatusPill>
        {inc.recordable && (
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "var(--status-stop)", letterSpacing: "0.06em",
            marginTop: 2
          }}>OSHA 300</div>
        )}
      </div>
      <div className="job-cell">
        {inc.job}
        <span className="nm">{inc.jobName}</span>
        <span style={{ color: "var(--ink-2)" }}>{inc.crew} · {worker?.name}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
        {inc.status === "investigating" ? (
          <>
            <StatusPill variant="warn">{inc.daysOpen}d OPEN</StatusPill>
            <button className="icon-btn" style={{ width: 26, height: 26 }}><SafIcons.ChevR size={12} /></button>
          </>
        ) : (
          <>
            <StatusPill variant="ok">CLOSED</StatusPill>
            <button className="icon-btn" style={{ width: 26, height: 26 }}><SafIcons.Eye size={12} /></button>
          </>
        )}
      </div>
    </article>
  );
}

/* ─────────────────────────── Training view ─────────────────────────── */
function TrainingView() {
  const D = window.SAFETY_DATA;
  return (
    <>
      <div className="saf-sect-h">
        <span className="num">{D.SAFETY_STATS.trainingCompliance}%</span>
        <span className="h">Training compliance</span>
        <span className="hint">{D.TRAINING_COURSES.length} required courses · {D.WORKERS.length} workers</span>
        <div className="right">
          <button className="btn btn-secondary" style={{ height: 28 }} onClick={() => window.DVPAction("Nudged non-compliant workers")}>
            <SafIcons.Send size={12} /> Nudge non-compliant
          </button>
          <button className="btn btn-primary" style={{ height: 28 }} onClick={() => window.DVPAction("Training scheduler opened")}>
            <SafIcons.Plus size={12} /> Schedule course
          </button>
        </div>
      </div>
      <div className="cert-table">
        <div className="train-row head">
          <span></span>
          <span>COURSE / ISSUER</span>
          <span>FREQUENCY</span>
          <span style={{ textAlign: "right" }}>COMPLETE</span>
          <span>COMPLIANCE</span>
          <span></span>
        </div>
        {D.TRAINING_COURSES.map(c => {
          const pct = Math.round((c.complete / c.required) * 100);
          const cls = pct >= 95 ? "pct-ok" : pct >= 80 ? "pct-warn" : "pct-stop";
          const delta = c.complete - c.lastWeek;
          return (
            <div key={c.id} className={`train-row ${cls}`}>
              <span className="urgency-bar"></span>
              <div>
                <div className="train-name">{c.name}</div>
                <span className="train-issuer">{c.issuer.toUpperCase()}</span>
              </div>
              <span className="freq-cell">{c.frequency.toUpperCase()}</span>
              <div className="ratio-cell" style={{ textAlign: "right" }}>
                <span className="v">{c.complete}</span>
                <span className="of">/{c.required}</span>
              </div>
              <div>
                <div className="bar">
                  <div className="fill" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="bar-meta">
                  <span>{pct}% COMPLIANT</span>
                  <span style={{ color: delta > 0 ? "var(--status-ok)" : "var(--ink-3)" }}>
                    {delta > 0 ? "▲" : "·"} {delta > 0 ? `+${delta} 7D` : "FLAT 7D"}
                  </span>
                </div>
              </div>
              <button className="btn btn-ghost" style={{ height: 26, fontSize: 11 }}>
                View roster <SafIcons.ChevR size={11} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─────────────────────────── Policies view ─────────────────────────── */
function PoliciesView() {
  const D = window.SAFETY_DATA;
  return (
    <>
      <div className="saf-sect-h">
        <span className="num">{D.POLICIES.length}</span>
        <span className="h">Written safety programs</span>
        <span className="hint">Acknowledgment tracked per worker</span>
        <div className="right">
          <button className="btn btn-secondary" style={{ height: 28 }} onClick={() => window.DVPAction("Policy export pack queued")}>
            <SafIcons.Doc size={12} /> Export pack (PDF)
          </button>
          <button className="btn btn-primary" style={{ height: 28 }} onClick={() => window.DVPAction("Policy editor opened")}>
            <SafIcons.Plus size={12} /> New policy
          </button>
        </div>
      </div>
      <div className="pol-grid">
        {D.POLICIES.map(p => {
          const pct = Math.round((p.ackedCount / p.requiredCount) * 100);
          const fillCls = pct >= 95 ? "" : pct >= 80 ? "warn" : "stop";
          return (
            <article key={p.id} className={`pol-card ${p.new ? "new" : ""}`}>
              <span className="cat">{p.category.toUpperCase()}</span>
              <span className="nm">{p.name}</span>
              <span className="ver">{p.version} · UPDATED {p.updated.toUpperCase()}</span>
              <div style={{ flex: 1, minHeight: 12 }}></div>
              <div className="ack-meta">
                <span><span className="num">{p.ackedCount}</span><span style={{ color: "var(--ink-3)" }}>/{p.requiredCount}</span> acknowledged</span>
                <span style={{ color: "var(--ink-0)" }}>{pct}%</span>
              </div>
              <div className="ack-bar"><div className={`ack-fill ${fillCls}`} style={{ width: `${pct}%` }}></div></div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <button className="btn btn-secondary" style={{ height: 26, fontSize: 11, flex: 1 }}>
                  <SafIcons.Eye size={11} /> View
                </button>
                <button className="btn btn-ghost" style={{ height: 26, fontSize: 11, flex: 1 }}>
                  <SafIcons.Send size={11} /> Push reminder
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

/* ─────────────────────────── Side rail ─────────────────────────── */
function SafetySide({ onAddCertType }) {
  const D = window.SAFETY_DATA;
  return (
    <aside className="safety-side">
      <div className="fmf-side-section">
        <div className="fmf-side-h">
          <span>Crew safety standings</span>
          <span className="c">YTD</span>
        </div>
        <div className="crew-stand">
          {D.CREW_STANDINGS.map(c => {
            const pctCls = c.trainingPct >= 95 ? "pct-ok" : c.trainingPct >= 80 ? "pct-warn" : "pct-stop";
            const bad = c.daysSinceLast < 7;
            return (
              <div key={c.crew} className={`crew-stand-row ${pctCls} ${bad ? "bad" : ""}`}>
                <div>
                  <span className="nm">{c.crew.replace(/^Crew \d+ — /, "")}</span>
                  <div className="train-bar"><div className="train-fill" style={{ width: `${c.trainingPct}%` }}></div></div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2, fontSize: 10 }}>
                    <span style={{ color: "var(--ink-2)" }}>{c.trainingPct}% TRAINING</span>
                    {c.openInv > 0 && <span style={{ color: "var(--status-stop)" }}>· {c.openInv} OPEN</span>}
                    <span style={{ color: "var(--ink-3)" }}>· {c.ytdInc} YTD INC</span>
                  </div>
                </div>
                <div>
                  <div className="days">{c.daysSinceLast}</div>
                  <div className="lbl">D · INC FREE</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fmf-side-section">
        <div className="fmf-side-h">
          <span>Quick actions</span>
        </div>
        <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => window.DVPAction("Expired workers notification queued")}>
          <SafIcons.Send size={12} /> Notify expired workers
        </button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => window.DVPAction("OSHA 300 export queued")}>
          <SafIcons.Doc size={12} /> Export OSHA 300 log
        </button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => window.DVPAction("Toolbox talk scheduler opened")}>
          <SafIcons.Calendar size={12} /> Schedule toolbox talk
        </button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={onAddCertType}>
          <SafIcons.Plus size={12} /> Add certification type
        </button>
      </div>

      <div className="fmf-side-section" style={{ borderBottom: "none" }}>
        <div className="fmf-side-h">
          <span>Compliance snapshot</span>
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--ink-1)", letterSpacing: "0.04em",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>OSHA-30</span>
            <span style={{ color: "var(--ink-0)" }}>54/56 <span style={{ color: "var(--status-ok)" }}>✓</span></span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>CDL-A</span>
            <span style={{ color: "var(--ink-0)" }}>9/11 <span style={{ color: "var(--status-warn)" }}>!</span></span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>FALL PROTECTION</span>
            <span style={{ color: "var(--ink-0)" }}>167/184</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SILICA AWARENESS</span>
            <span style={{ color: "var(--ink-0)" }}>178/184</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.SafetyHeader = SafetyHeader;
window.SafetySidebar = SafetySidebar;
window.SafetyOverview = SafetyOverview;
window.CertificationsView = CertificationsView;
window.IncidentsView = IncidentsView;
window.TrainingView = TrainingView;
window.PoliciesView = PoliciesView;
window.SafetySide = SafetySide;
window.SafIcons = SafIcons;
