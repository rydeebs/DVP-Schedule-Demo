// Forms fixture data — DVP Field Ops
// IA principle from design-system.md and the brief: group by URGENCY,
// not by status text. "Not Started" is not a useful grouping when
// 931 things are not started.

const FORM_TEMPLATES = {
  daily:    { id: "daily",    name: "Daily Report",                       category: "Field",     freq: "DAILY",  fields: 17, est: 6,  tone: "warn", desc: "End-of-shift production, materials, and incidents log.", required: true  },
  toolbox:  { id: "toolbox",  name: "Safety Toolbox Talk",                category: "Safety",    freq: "DAILY",  fields: 8,  est: 4,  tone: "stop", desc: "Pre-shift safety briefing — sign-in required.",         required: true  },
  incident: { id: "incident", name: "Employee Incident Report",           category: "Safety",    freq: "AD-HOC", fields: 22, est: 12, tone: "stop", desc: "Report any injury or near-miss within 24h.",            required: false },
  investig: { id: "investig", name: "Incident Investigation Report",      category: "Safety",    freq: "AD-HOC", fields: 19, est: 18, tone: "stop", desc: "Follow-up root-cause and corrective actions.",          required: false },
  discip:   { id: "discip",   name: "Employee Disciplinary Action (Write-Up)", category: "HR",   freq: "AD-HOC", fields: 11, est: 8,  tone: "stop", desc: "Documented corrective action — requires approval.",    required: false },
  equipins: { id: "equipins", name: "Equipment Pre-Trip Inspection",      category: "Equipment", freq: "DAILY",  fields: 14, est: 5,  tone: "warn", desc: "Pre-shift inspection per FMCSA §396.13.",               required: true  },
  feedback: { id: "feedback", name: "DVP Suggestion & Feedback",          category: "HR",        freq: "AD-HOC", fields: 6,  est: 3,  tone: "ok",   desc: "Suggestion box, open to all employees.",                required: false },
  cert:     { id: "cert",     name: "Certification Renewal",              category: "Training",  freq: "ANNUAL", fields: 9,  est: 5,  tone: "info", desc: "OSHA-30, CDL, ACI, flagger, etc.",                       required: false },
};

const FORM_USERS = {
  u1: { id: "u1", init: "AV", name: "Aaron Vasquez",   role: "Foreman", crew: "Crew 14"  },
  u2: { id: "u2", init: "MD", name: "Mike Doherty",    role: "Foreman", crew: "Crew 22"  },
  u3: { id: "u3", init: "LD", name: "Luis Diaz",       role: "Foreman", crew: "Crew 07"  },
  u4: { id: "u4", init: "RP", name: "Raj Patel",       role: "Foreman", crew: "Crew 31"  },
  u5: { id: "u5", init: "CJ", name: "Cole Jenkins",    role: "Foreman", crew: "Crew 09"  },
  u6: { id: "u6", init: "SP", name: "Sara Pham",       role: "Ops Manager"               },
  u7: { id: "u7", init: "DK", name: "Devon King",      role: "Safety Officer"            },
  u8: { id: "u8", init: "KF", name: "Karen Faggioli",  role: "Project Admin"             },
  u9: { id: "u9", init: "JM", name: "Jason Maxwell",   role: "VP Operations"             },
};

// Form instances — one row per *expected* submission.
const FORM_INSTANCES = [
  // OVERDUE — high urgency
  { id: "i001", tplId: "toolbox", jobCode: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", ownerId: "u1", crew: "Crew 14 — Vasquez", dueAt: "2026-05-26T06:00", dueBy: "06:00 today",       urgency: "overdue", status: "not-started", progress: 0,  hoursLate: 5,    note: "REQUIRED before shift start" },
  { id: "i002", tplId: "daily",    jobCode: "X-1180", jobName: "Riverside Industrial Park — Pad Cut", ownerId: "u2", crew: "Crew 22 — Doherty", dueAt: "2026-05-25T18:00", dueBy: "yesterday 18:00",  urgency: "overdue", status: "draft",       progress: 9,  hoursLate: 21, lastSavedAt: "21h ago" },
  { id: "i003", tplId: "equipins", jobCode: "M-1102", jobName: "GSP Exit 109 Mill",              ownerId: "u4", crew: "Crew 31 — Patel",    dueAt: "2026-05-26T05:30", dueBy: "05:30 today",     urgency: "overdue", status: "not-started", progress: 0,  hoursLate: 6,   note: "Wirtgen W210 — pre-mill" },

  // DUE TODAY — signal urgency
  { id: "i010", tplId: "daily",    jobCode: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", ownerId: "u1", crew: "Crew 14 — Vasquez", dueAt: "2026-05-26T17:00", dueBy: "today 17:00",     urgency: "today",   status: "draft",       progress: 11, lastSavedAt: "12m ago" },
  { id: "i011", tplId: "daily",    jobCode: "X-1180", jobName: "Riverside Industrial Park",     ownerId: "u2", crew: "Crew 22 — Doherty", dueAt: "2026-05-26T17:00", dueBy: "today 17:00",     urgency: "today",   status: "not-started", progress: 0  },
  { id: "i012", tplId: "daily",    jobCode: "C-0742", jobName: "Madison Plaza — Curb & Gutter", ownerId: "u3", crew: "Crew 07 — Diaz",    dueAt: "2026-05-26T16:00", dueBy: "today 16:00",     urgency: "today",   status: "not-started", progress: 0  },
  { id: "i013", tplId: "daily",    jobCode: "M-1102", jobName: "GSP Exit 109 Mill",             ownerId: "u4", crew: "Crew 31 — Patel",   dueAt: "2026-05-27T06:00", dueBy: "tomorrow 06:00 (night shift)", urgency: "today", status: "not-started", progress: 0, note: "Night work — overlap shift" },
  { id: "i014", tplId: "toolbox",  jobCode: "X-1180", jobName: "Riverside Industrial Park",     ownerId: "u2", crew: "Crew 22 — Doherty", dueAt: "2026-05-26T06:30", dueBy: "06:30 today",     urgency: "today",   status: "submitted",   progress: 8,  submittedAt: "06:28" },
  { id: "i015", tplId: "equipins", jobCode: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", ownerId: "u1", crew: "Crew 14 — Vasquez", dueAt: "2026-05-26T05:45", dueBy: "05:45 today",     urgency: "today",   status: "submitted",   progress: 14, submittedAt: "05:42" },

  // DUE THIS WEEK
  { id: "i020", tplId: "daily",    jobCode: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", ownerId: "u1", crew: "Crew 14 — Vasquez", dueAt: "2026-05-27T17:00", dueBy: "Wed 17:00", urgency: "week", status: "not-started", progress: 0 },
  { id: "i021", tplId: "daily",    jobCode: "P-2422", jobName: "Verizon Campus — Driveway Overlay", ownerId: "u1", crew: "Crew 14 — Vasquez", dueAt: "2026-05-28T17:00", dueBy: "Thu 17:00", urgency: "week", status: "not-started", progress: 0 },
  { id: "i022", tplId: "toolbox",  jobCode: "X-1180", jobName: "Riverside Industrial Park",     ownerId: "u2", crew: "Crew 22 — Doherty", dueAt: "2026-05-27T06:30", dueBy: "Wed 06:30", urgency: "week", status: "not-started", progress: 0 },
  { id: "i023", tplId: "cert",     jobCode: "—",       jobName: "OSHA-30 Renewal — Hector M.",   ownerId: "u8", crew: null,                 dueAt: "2026-05-31T17:00", dueBy: "Sun 17:00", urgency: "week", status: "draft",       progress: 5, lastSavedAt: "2d ago" },
  { id: "i024", tplId: "equipins", jobCode: "X-1180", jobName: "Riverside Industrial Park",     ownerId: "u2", crew: "Crew 22 — Doherty", dueAt: "2026-05-27T05:45", dueBy: "Wed 05:45", urgency: "week", status: "not-started", progress: 0 },

  // AWAITING REVIEW — submitted, pending approval
  { id: "i030", tplId: "incident", jobCode: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", ownerId: "u1", crew: "Crew 14 — Vasquez", dueAt: "2026-05-25T20:00", urgency: "review",  status: "submitted",   submittedAt: "yesterday 19:48", reviewerId: "u7", note: "Minor — paver step injury, no lost time", severity: "minor" },
  { id: "i031", tplId: "investig", jobCode: "M-1102", jobName: "GSP Exit 109 Mill",             ownerId: "u4", crew: "Crew 31 — Patel",   dueAt: "2026-05-24T20:00", urgency: "review",  status: "submitted",   submittedAt: "2d ago", reviewerId: "u7", note: "Follow-up to truck reverse near-miss", severity: "watch" },
  { id: "i032", tplId: "discip",   jobCode: "X-1180", jobName: "Riverside Industrial Park",     ownerId: "u2", crew: "Crew 22 — Doherty", dueAt: "2026-05-23T20:00", urgency: "review",  status: "submitted",   submittedAt: "3d ago", reviewerId: "u9", note: "3rd late arrival — verbal warning issued", severity: "stop" },
  { id: "i033", tplId: "daily",    jobCode: "P-2418", jobName: "Costco Lot — South Section",    ownerId: "u1", crew: "Crew 14 — Vasquez", dueAt: "2026-05-25T22:00", urgency: "review",  status: "submitted",   submittedAt: "yesterday 21:55", reviewerId: "u6", note: "Night-work tonnage variance > 8%" },

  // RECENTLY SUBMITTED — last 7 days, "done"
  { id: "i040", tplId: "daily",    jobCode: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", ownerId: "u1", crew: "Crew 14 — Vasquez", urgency: "done", status: "approved",  submittedAt: "yesterday 17:02", approvedAt: "yesterday 17:35", reviewerId: "u6" },
  { id: "i041", tplId: "toolbox",  jobCode: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", ownerId: "u1", crew: "Crew 14 — Vasquez", urgency: "done", status: "approved",  submittedAt: "yesterday 06:14", approvedAt: "yesterday 09:00", reviewerId: "u7" },
  { id: "i042", tplId: "daily",    jobCode: "X-1180", jobName: "Riverside Industrial Park",     ownerId: "u2", crew: "Crew 22 — Doherty", urgency: "done", status: "approved",  submittedAt: "2d ago", approvedAt: "2d ago", reviewerId: "u6" },
  { id: "i043", tplId: "daily",    jobCode: "C-0742", jobName: "Madison Plaza — Curb & Gutter", ownerId: "u3", crew: "Crew 07 — Diaz",    urgency: "done", status: "approved",  submittedAt: "2d ago", approvedAt: "2d ago", reviewerId: "u6" },
  { id: "i044", tplId: "daily",    jobCode: "M-1102", jobName: "GSP Exit 109 Mill",             ownerId: "u4", crew: "Crew 31 — Patel",   urgency: "done", status: "approved",  submittedAt: "3d ago", approvedAt: "3d ago", reviewerId: "u6" },
  { id: "i045", tplId: "feedback", jobCode: "—",       jobName: "Suggestion: yard scheduling",   ownerId: "u3", crew: null,                 urgency: "done", status: "approved",  submittedAt: "4d ago", approvedAt: "3d ago", reviewerId: "u9" },
];

// Daily Report field schema — the form we demo end-to-end.
// Sectioned, with smart prefills.
const DAILY_REPORT_SECTIONS = [
  {
    key: "context",
    label: "Job context",
    intro: "Auto-filled from your assignment. Tap any value to override.",
    fields: [
      { key: "date",     label: "Date",          type: "date",  prefill: "Tue May 26, 2026", required: true, auto: true },
      { key: "foreman",  label: "Foreman",       type: "user",  prefill: "Aaron Vasquez",    required: true, auto: true },
      { key: "crew",     label: "Crew",          type: "text",  prefill: "Crew 14 — Vasquez",required: true, auto: true },
      { key: "job",      label: "Job",           type: "text",  prefill: "P-2419 · Route 9 Resurfacing — Phase 2", required: true, auto: true },
      { key: "shiftIn",  label: "Shift in",      type: "time",  prefill: "06:00",            required: true, auto: true },
      { key: "shiftOut", label: "Shift out",     type: "time",  prefill: "",                 required: true },
    ],
  },
  {
    key: "weather",
    label: "Weather",
    intro: "Pulled from local forecast at 04:30 — confirm or correct.",
    fields: [
      { key: "wxHigh", label: "High",  type: "num",  prefill: "82°F", unit: "°F",  auto: true },
      { key: "wxLow",  label: "Low",   type: "num",  prefill: "63°F", unit: "°F",  auto: true },
      { key: "wxCond", label: "Conditions", type: "chips", options: ["Sunny","Partly cloudy","Overcast","Rain","Wind","Heat advisory"], prefill: ["Partly cloudy"] },
    ],
  },
  {
    key: "people",
    label: "Crew on site",
    intro: "Pulled from today's roster. Untick anyone absent.",
    fields: [
      { key: "roster", label: "Crew members", type: "roster", prefill: [
        { id: "w01", name: "Aaron Vasquez",  role: "FOR", present: true  },
        { id: "w06", name: "Hector Morales", role: "OPR", present: true  },
        { id: "w09", name: "Eli Brennan",    role: "LBR", present: true  },
        { id: "w10", name: "Sam Whitford",   role: "LBR", present: true  },
        { id: "w13", name: "Kenny Boyle",    role: "CDL", present: true  },
        { id: "w16", name: "Owen Petrov",    role: "GRD", present: false },
      ]},
      { key: "visitors", label: "Visitors", type: "text", prefill: "" },
    ],
  },
  {
    key: "production",
    label: "Production",
    intro: "What the crew accomplished today.",
    fields: [
      { key: "work",    label: "Work performed",   type: "textarea", prefill: "", required: true },
      { key: "stationFrom", label: "Station from", type: "text",     prefill: "STA 24+50" },
      { key: "stationTo",   label: "Station to",   type: "text",     prefill: "STA 31+20" },
      { key: "tonsPaved",   label: "Tons placed",  type: "num",      prefill: "", unit: "tn", required: true },
    ],
  },
  {
    key: "materials",
    label: "Materials & deliveries",
    intro: "Confirm tickets — supplier rates are auto-pulled.",
    fields: [
      { key: "deliveries", label: "Deliveries", type: "deliveries", prefill: [
        { ticket: "T-204·17421", supplier: "Tilcon Mt. Hope", material: "HMA 9.5mm",  qty: "39.8 tn", arrived: "06:14", ok: true  },
        { ticket: "T-211·17422", supplier: "Tilcon Mt. Hope", material: "HMA 9.5mm",  qty: "40.2 tn", arrived: "06:47", ok: true  },
        { ticket: "T-219·17423", supplier: "Tilcon Mt. Hope", material: "HMA 19mm",   qty: "38.4 tn", arrived: "11:05", ok: false, note: "Wrong grade" },
      ]},
    ],
  },
  {
    key: "issues",
    label: "Issues & incidents",
    intro: "If there were any, flag here — investigation forms auto-spawn.",
    fields: [
      { key: "delays",  label: "Delays / issues", type: "textarea", prefill: "" },
      { key: "incident",label: "Any incidents?",  type: "yesno",    prefill: "no", required: true },
    ],
  },
  {
    key: "signoff",
    label: "Sign off",
    intro: "Photo, signature, and submit.",
    fields: [
      { key: "photos",   label: "End-of-day photos",  type: "photos",    prefill: 3 },
      { key: "signature",label: "Foreman signature",  type: "signature", prefill: null, required: true },
    ],
  },
];

const APPROVALS_INBOX = [
  // Anything submitted that needs review
];

const TEMPLATE_CATALOG = [
  { tplId: "daily",    used: 184, lastUsed: "12m ago" },
  { tplId: "toolbox",  used: 178, lastUsed: "5h ago"  },
  { tplId: "equipins", used: 142, lastUsed: "6h ago"  },
  { tplId: "incident", used: 12,  lastUsed: "yesterday" },
  { tplId: "investig", used: 8,   lastUsed: "2d ago"  },
  { tplId: "discip",   used: 5,   lastUsed: "3d ago"  },
  { tplId: "feedback", used: 23,  lastUsed: "4d ago"  },
  { tplId: "cert",     used: 47,  lastUsed: "1w ago"  },
];

const FORMS_STATS = {
  overdue: 3,
  dueToday: 6,
  dueThisWeek: 12,
  awaitingReview: 4,
  submittedThisWeek: 87,
  complianceRate: 96,
  // historical
  totalThisYear: 5824,
  totalCompliant: 5601,
};

window.FORMS_DATA = {
  FORM_TEMPLATES, FORM_USERS, FORM_INSTANCES,
  DAILY_REPORT_SECTIONS, APPROVALS_INBOX, TEMPLATE_CATALOG,
  FORMS_STATS,
};
