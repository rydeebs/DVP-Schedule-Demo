// Atoms — StatusPill, WorkerChip, EquipChip, JobCard, icons
// All exported to window for cross-script access.

const { useState, useRef, useEffect, useMemo, useCallback } = React;

/* ───────────────────── Icons (Lucide-style, 1.5px stroke) ───────────────────── */
const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  Menu:        (p) => <Ico {...p} d={["M3 6h18","M3 12h18","M3 18h18"]} />,
  ChevL:       (p) => <Ico {...p} d="M15 6l-6 6 6 6" />,
  ChevR:       (p) => <Ico {...p} d="M9 6l6 6-6 6" />,
  ChevD:       (p) => <Ico {...p} d="M6 9l6 6 6-6" />,
  Search:      (p) => <Ico {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z","M21 21l-4.3-4.3"]} />,
  Bell:        (p) => <Ico {...p} d={["M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8","M10 21a2 2 0 0 0 4 0"]} />,
  Plus:        (p) => <Ico {...p} d={["M12 5v14","M5 12h14"]} />,
  X:           (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Calendar:    (p) => <Ico {...p} d={["M3 9h18","M3 5h18v16H3z","M8 3v4","M16 3v4"]} />,
  Truck:       (p) => <Ico {...p} d={["M3 7h11v9H3z","M14 10h4l3 3v3h-7","M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Wrench:      (p) => <Ico {...p} d="M14.7 6.3a4 4 0 0 0 5 5L18 13l-7 7-3-3 7-7 1.7-3.7Z" />,
  MapPin:      (p) => <Ico {...p} d={["M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z","M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  Clock:       (p) => <Ico {...p} d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z","M12 7v5l3 2"]} />,
  AlertTri:    (p) => <Ico {...p} d={["M12 3 2 20h20L12 3Z","M12 10v5","M12 18v.01"]} />,
  Filter:      (p) => <Ico {...p} d="M3 5h18l-7 9v6l-4-2v-4L3 5Z" />,
  Undo:        (p) => <Ico {...p} d={["M3 7v6h6","M3 13a9 9 0 1 1 3 7"]} />,
  Hard:        (p) => <Ico {...p} d={["M4 17h16v3H4z","M6 17V11a6 6 0 0 1 12 0v6","M12 5V3"]} />,
  Schedule:    (p) => <Ico {...p} d={["M4 5h16v15H4z","M4 9h16","M8 13h3","M8 16h6"]} />,
  Folder:      (p) => <Ico {...p} d="M3 6h6l2 2h10v11H3z" />,
  Users:       (p) => <Ico {...p} d={["M16 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1","M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M22 21v-1a4 4 0 0 0-3-3.87","M16 4a4 4 0 0 1 0 7.74"]} />,
  Building:    (p) => <Ico {...p} d={["M4 21h16","M5 21V5l7-2v18","M19 21V9l-7-2","M9 9v.01","M9 13v.01","M9 17v.01","M14 13v.01","M14 17v.01"]} />,
  Doc:         (p) => <Ico {...p} d={["M14 3H6v18h12V7l-4-4Z","M14 3v4h4","M9 13h6","M9 17h6"]} />,
  Map:         (p) => <Ico {...p} d={["M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3Z","M9 4v13","M15 7v13"]} />,
  Settings:    (p) => <Ico {...p} d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"]} />,
  Grip:        (p) => <Ico {...p} d={["M9 5h.01","M9 12h.01","M9 19h.01","M15 5h.01","M15 12h.01","M15 19h.01"]} />,
  Sun:         (p) => <Ico {...p} d={["M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z","M12 2v2","M12 20v2","M4.9 4.9l1.4 1.4","M17.7 17.7l1.4 1.4","M2 12h2","M20 12h2","M4.9 19.1l1.4-1.4","M17.7 6.3l1.4-1.4"]} />,
  Moon:        (p) => <Ico {...p} d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" />,
  Eye:         (p) => <Ico {...p} d={["M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} />,
  Cmd:         (p) => <Ico {...p} d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z" />,
};

function dvpActionLabel(button) {
  const text = (button.textContent || "").replace(/\s+/g, " ").trim();
  const aria = button.getAttribute("aria-label") || button.getAttribute("title") || "";
  return text || aria || "Action";
}

function dvpShowAction(label) {
  const msg = `${label} action queued`;
  const existing = document.querySelector(".dvp-action-toast");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.className = "dvp-action-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 2200);
}

window.DVPAction = (label) => dvpShowAction(label);

if (!window.__dvpButtonFallbackInstalled) {
  window.__dvpButtonFallbackInstalled = true;
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("button");
    if (!button || button.disabled || button.closest(".twk-panel")) return;

    const label = dvpActionLabel(button);
    const actionable = [
      "Notify", "Export", "Import", "Filter", "History", "Preview", "Email",
      "Download", "Share", "Upload", "Pick", "Request", "Generate", "Print",
      "Send", "Schedule", "Activity", "Open in", "New project", "Add Customer",
      "Open command palette", "Notifications", "Rename", "Directions", "Work order",
      "Sync", "Copy", "Map focus", "ALL DIVISIONS", "ALL CREWS", "SEVERITY",
      "JOB · ANY", "FY 2026", "Crew menu",
    ];
    if (!actionable.some(token => label.toLowerCase().includes(token.toLowerCase()))) return;

    window.setTimeout(() => {
      if (!document.body.contains(button)) return;
      if (button.classList.contains("cmdk")) {
        const input = document.querySelector(".proj-search input, .file-search input, .fl-search input, .cust-search input, .set-search input, input[type='search'], input");
        if (input) {
          input.focus();
          dvpShowAction("Search focused");
          return;
        }
      }
      dvpShowAction(label);
    }, 0);
  });
}

/* ───────────────────── Status pill ───────────────────── */
function StatusPill({ variant = "info", children, signal }) {
  if (signal) return <span className="pill pill-signal">{children}</span>;
  return <span className={`pill pill-${variant}`}>{children}</span>;
}

/* ───────────────────── Worker chip ───────────────────── */
function WorkerChip({ worker, state = "available", dashed, dense }) {
  const roleAbbr = {
    foreman: "FOR", operator: "OPR", laborer: "LBR",
    "cdl driver": "CDL", "grade checker": "GRD", mason: "MAS",
  }[worker.role] || "—";
  const isForeman = worker.role === "foreman";
  return (
    <span
      className={`wc ${state} ${isForeman ? "foreman" : ""} ${dashed ? "available-dash" : ""}`}
      title={`${worker.name} — ${worker.role}${worker.cert ? " · " + worker.cert.join(", ") : ""}`}
    >
      <span className="wc-av">{worker.init}</span>
      {!dense && <span className="wc-name">{worker.name.split(" ")[0]} {worker.name.split(" ")[1]?.[0]}.</span>}
      {!dense && <span className="wc-role">{roleAbbr}</span>}
    </span>
  );
}

/* ───────────────────── Equip chip ───────────────────── */
function EquipChip({ kind = "equip", children }) {
  const isTruck = kind === "truck";
  return (
    <span className={`eq ${isTruck ? "truck" : ""}`}>
      {isTruck ? <Icons.Truck size={12} /> : <Icons.Wrench size={12} />}
      {children}
    </span>
  );
}

/* ───────────────────── Job card ───────────────────── */
function JobCard({
  job, dragHandlers, isDragging, snapIn,
  onOpen,
  variant = "lane", // 'pool' | 'lane'
}) {
  const D = window.DATA;
  const suppressClickRef = useRef(false);
  const t = D.JOB_TYPES[job.type];
  const qtyStr =
    job.tons ? `${job.tons} tn` :
    job.yards ? `${job.yards} yd³` :
    job.sqyd ? `${job.sqyd.toLocaleString()} sy` :
    job.lf ? `${job.lf.toLocaleString()} lf` : "";

  return (
    <article
      className={`job job-type-${job.type} ${isDragging ? "dragging" : ""} ${snapIn ? "snap-in" : ""}`}
      draggable
      onDragStart={(e) => {
        suppressClickRef.current = true;
        dragHandlers?.onDragStart?.(e, job);
      }}
      onDragEnd={(e) => {
        dragHandlers?.onDragEnd?.(e, job);
        window.setTimeout(() => { suppressClickRef.current = false; }, 160);
      }}
      onClick={() => {
        if (!suppressClickRef.current) onOpen?.(job);
      }}
      data-job-id={job.id}
    >
      <div className="job-top">
        <span className="job-code">{job.code}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StatusPill variant={t.tone}>{t.label}</StatusPill>
          <span className={`job-prio-${job.priority}`} title={`${job.priority} priority`}></span>
        </div>
      </div>
      <div className="job-name">{job.name}</div>
      <div className="job-meta">
        <span><Icons.Building size={10} /> {job.customer}</span>
      </div>
      <div className="job-meta">
        <span><Icons.MapPin size={10} /> {job.location}</span>
      </div>
      <div className="job-foot">
        <span className="job-time">
          <Icons.Clock size={10} style={{ verticalAlign: -1, marginRight: 3 }} />
          {job.startTime ? `${job.startTime}–${job.endTime}` : `${job.hours}h`}
        </span>
        {qtyStr && <span className="job-qty">{qtyStr}</span>}
      </div>
      {job.note && (
        <div className="job-note">
          <Icons.AlertTri size={10} /> {job.note}
        </div>
      )}
      {variant === "pool" && job.needs && (
        <div className="job-meta" style={{ marginTop: 2 }}>
          <Icons.Users size={10} /> <span>{job.needs}</span>
        </div>
      )}
    </article>
  );
}

/* ───────────────────── Hero metric ───────────────────── */
function HeroMetric({ value, sub, label, footer }) {
  return (
    <div className="metric">
      <span className="label">{label}</span>
      <span className="value">
        {value}
        {sub && <span className="sub">{sub}</span>}
      </span>
      {footer && <span className="footer">{footer}</span>}
    </div>
  );
}

Object.assign(window, {
  Ico, Icons, StatusPill, WorkerChip, EquipChip, JobCard, HeroMetric,
});
