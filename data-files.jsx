// Files fixture data — DVP Field Ops
// IA reality: of 5,524 jobs in NetSuite, ~220 are active and ~140 of those
// have files. We surface those, and hide the long tail behind an expander.

const FILE_KIND = {
  pdf:     { label: "PDF",       tone: "stop"   },
  dwg:     { label: "DWG",       tone: "info"   },
  photo:   { label: "PHOTO",     tone: "ok"     },
  report:  { label: "REPORT",    tone: "warn"   },
  permit:  { label: "PERMIT",    tone: "info"   },
  contract:{ label: "CONTRACT",  tone: "warn"   },
  invoice: { label: "INVOICE",   tone: "stop"   },
  sheet:   { label: "SHEET",     tone: "ok"     },
  safety:  { label: "SAFETY",    tone: "stop"   },
  email:   { label: "EMAIL",     tone: "info"   },
};

const FILE_USERS = {
  u1: { id: "u1", name: "Aaron Vasquez",  init: "AV", role: "Dispatch Lead" },
  u2: { id: "u2", name: "Karen Faggioli", init: "KF", role: "Project Admin" },
  u3: { id: "u3", name: "Mike Doherty",   init: "MD", role: "Foreman" },
  u4: { id: "u4", name: "Luis Diaz",      init: "LD", role: "Foreman" },
  u5: { id: "u5", name: "Sara Pham",      init: "SP", role: "Ops Manager" },
  u6: { id: "u6", name: "Devon King",     init: "DK", role: "Safety Officer" },
  u7: { id: "u7", name: "Field Upload",   init: "FA", role: "Foreman App" },
};

// Jobs with files — these are subset of the 5,524 in NetSuite. The rest live
// behind a "Show 5,302 jobs with no files" expander.
const FILE_JOBS = [
  { id: "j01", code: "P-2419", name: "Route 9 Resurfacing — Phase 2",        customer: "NJDOT",                 location: "Old Bridge, NJ",    status: "active",   crew: "Crew 14 — Vasquez",  files: 47, photos: 31, lastUpload: "12m ago", lastUploadIso: "2026-05-26T14:48:00", flagged: 2 },
  { id: "j02", code: "X-1180", name: "Riverside Industrial Park — Pad Cut",  customer: "Greenleaf Capital",     location: "Edison, NJ",        status: "active",   crew: "Crew 22 — Doherty",  files: 28, photos: 18, lastUpload: "1h ago",  lastUploadIso: "2026-05-26T13:55:00", flagged: 0 },
  { id: "j05", code: "M-1102", name: "Garden State Pkwy Exit 109 — Mill",    customer: "NJ Turnpike Authority", location: "Holmdel, NJ",       status: "active",   crew: "Crew 31 — Patel",    files: 64, photos: 49, lastUpload: "3h ago",  lastUploadIso: "2026-05-26T11:30:00", flagged: 1 },
  { id: "j03", code: "C-0742", name: "Madison Plaza — Curb & Gutter",        customer: "Madison Realty",        location: "Madison, NJ",       status: "active",   crew: "Crew 07 — Diaz",     files: 19, photos: 12, lastUpload: "5h ago",  lastUploadIso: "2026-05-26T09:10:00", flagged: 0 },
  { id: "j10", code: "P-2422", name: "Verizon Campus — Driveway Overlay",    customer: "Verizon Real Estate",   location: "Basking Ridge, NJ", status: "pending",  crew: null,                 files: 9,  photos: 0,  lastUpload: "yesterday", lastUploadIso: "2026-05-25T16:20:00", flagged: 0 },
  { id: "j16", code: "P-2401", name: "Wegmans Lot Re-pave — Phase 1",        customer: "Wegmans Food Markets",  location: "Bridgewater, NJ",   status: "closed",   crew: "Crew 14 — Vasquez",  files: 132,photos: 88, lastUpload: "2d ago",  lastUploadIso: "2026-05-24T10:15:00", flagged: 0, closedAt: "May 21, 2026" },
  { id: "j17", code: "X-1024", name: "Princeton Logistics — Site Prep",      customer: "Prologis",              location: "Princeton, NJ",     status: "active",   crew: "Crew 22 — Doherty",  files: 22, photos: 14, lastUpload: "3d ago",  lastUploadIso: "2026-05-23T08:45:00", flagged: 0 },
  { id: "j09", code: "P-2421", name: "Amazon BWI4 — Dock Apron Patch",       customer: "Amazon Logistics",      location: "Robbinsville, NJ",  status: "pending",  crew: null,                 files: 5,  photos: 1,  lastUpload: "4d ago",  lastUploadIso: "2026-05-22T15:30:00", flagged: 1 },
];

// Files for selected jobs. j01 is the demo job — densely populated.
const FILES_BY_JOB = {
  j01: [
    { id: "f001", name: "Daily Report — May 26 AM",       kind: "report",   ext: "pdf", size: "1.2 MB",  uploadedBy: "u3", uploadedAt: "2026-05-26T14:48:00", folder: "Daily Reports", relAge: "12m" },
    { id: "f002", name: "IMG_4488 — paving south lane",   kind: "photo",   ext: "jpg", size: "3.8 MB",  uploadedBy: "u3", uploadedAt: "2026-05-26T13:30:00", folder: "Photos / May 26", relAge: "1h",  caption: "PAVING · SOUTH LANE" },
    { id: "f003", name: "IMG_4489 — joint detail",        kind: "photo",   ext: "jpg", size: "4.1 MB",  uploadedBy: "u3", uploadedAt: "2026-05-26T13:32:00", folder: "Photos / May 26", relAge: "1h",  caption: "JOINT · 06:30" },
    { id: "f004", name: "IMG_4490 — roller pattern",      kind: "photo",   ext: "jpg", size: "3.4 MB",  uploadedBy: "u7", uploadedAt: "2026-05-26T13:45:00", folder: "Photos / May 26", relAge: "1h",  caption: "ROLLER PATTERN" },
    { id: "f005", name: "Change Order #003 — signed",     kind: "contract", ext: "pdf", size: "248 KB",  uploadedBy: "u2", uploadedAt: "2026-05-26T11:10:00", folder: "Contracts",       relAge: "3h",  flag: "stop", flagNote: "$ 14,200 over base" },
    { id: "f006", name: "NJDOT Lane Closure Permit",      kind: "permit",   ext: "pdf", size: "512 KB",  uploadedBy: "u2", uploadedAt: "2026-05-25T16:40:00", folder: "Permits",         relAge: "1d" },
    { id: "f007", name: "Striping Layout — Rev D",        kind: "dwg",      ext: "dwg", size: "8.7 MB",  uploadedBy: "u5", uploadedAt: "2026-05-25T14:00:00", folder: "Drawings",        relAge: "1d" },
    { id: "f008", name: "IMG_4477 — pre-mill condition",  kind: "photo",   ext: "jpg", size: "2.9 MB",  uploadedBy: "u3", uploadedAt: "2026-05-25T07:15:00", folder: "Photos / May 25", relAge: "1d",  caption: "PRE-MILL" },
    { id: "f009", name: "Safety Toolbox — 05/25 signed",  kind: "safety",   ext: "pdf", size: "390 KB",  uploadedBy: "u6", uploadedAt: "2026-05-25T06:30:00", folder: "Safety",          relAge: "1d" },
    { id: "f010", name: "Tilcon delivery ticket — load 4",kind: "invoice",  ext: "pdf", size: "120 KB",  uploadedBy: "u7", uploadedAt: "2026-05-25T09:22:00", folder: "Tickets",         relAge: "1d", flag: "warn", flagNote: "wrong material grade — pending credit" },
    { id: "f011", name: "RE: Permit window question",     kind: "email",    ext: "eml", size: "32 KB",   uploadedBy: "u2", uploadedAt: "2026-05-24T11:00:00", folder: "Correspondence",  relAge: "2d" },
    { id: "f012", name: "Specs §401 Plant Mix Bit",       kind: "sheet",    ext: "pdf", size: "1.8 MB",  uploadedBy: "u5", uploadedAt: "2026-05-23T15:20:00", folder: "Specs",           relAge: "3d" },
    { id: "f013", name: "Pre-bid Walk Notes",             kind: "report",   ext: "pdf", size: "640 KB",  uploadedBy: "u5", uploadedAt: "2026-05-20T10:00:00", folder: "Bid",             relAge: "6d" },
    { id: "f014", name: "Original Contract — executed",   kind: "contract", ext: "pdf", size: "2.4 MB",  uploadedBy: "u2", uploadedAt: "2026-05-12T09:00:00", folder: "Contracts",       relAge: "14d" },
    { id: "f015", name: "IMG_4423 — staging area",        kind: "photo",   ext: "jpg", size: "3.1 MB",  uploadedBy: "u3", uploadedAt: "2026-05-24T07:00:00", folder: "Photos / May 24", relAge: "2d",  caption: "STAGING" },
    { id: "f016", name: "IMG_4424 — material delivery",   kind: "photo",   ext: "jpg", size: "2.7 MB",  uploadedBy: "u7", uploadedAt: "2026-05-24T08:30:00", folder: "Photos / May 24", relAge: "2d",  caption: "DELIVERY" },
  ],
};

// Today's activity feed — files added today, ordered desc.
// (Drives the default "no job selected" hero view.)
const TODAY_ACTIVITY = [
  { fileId: "f001", jobId: "j01", at: "14:48", who: "u3" },
  { fileId: "f002", jobId: "j01", at: "13:30", who: "u3" },
  { fileId: "f003", jobId: "j01", at: "13:32", who: "u3" },
  { fileId: "f004", jobId: "j01", at: "13:45", who: "u7" },
  { fileId: "f005", jobId: "j01", at: "11:10", who: "u2" },
  { fileId: "x01",  jobId: "j02", at: "13:55", who: "u3", inline: { name: "Daily Report — May 26 AM",  kind: "report", ext: "pdf", size: "1.0 MB" } },
  { fileId: "x02",  jobId: "j02", at: "10:20", who: "u3", inline: { name: "IMG_8821 — pad final grade", kind: "photo", ext: "jpg", size: "3.6 MB", caption: "FINAL GRADE" } },
  { fileId: "x03",  jobId: "j05", at: "11:30", who: "u4", inline: { name: "Mill profile — westbound",   kind: "dwg",   ext: "dwg", size: "5.9 MB" } },
  { fileId: "x04",  jobId: "j05", at: "10:15", who: "u3", inline: { name: "Daily Report — May 26 NIGHT",kind: "report",ext: "pdf", size: "1.4 MB" } },
  { fileId: "x05",  jobId: "j05", at: "09:42", who: "u7", inline: { name: "IMG_7140 — mill teeth check",kind: "photo", ext: "jpg", size: "4.2 MB", caption: "MILL TEETH" } },
  { fileId: "x06",  jobId: "j03", at: "09:10", who: "u4", inline: { name: "Pour Card — bay 3",          kind: "report",ext: "pdf", size: "780 KB" } },
  { fileId: "x07",  jobId: "j03", at: "08:25", who: "u4", inline: { name: "IMG_6611 — formwork",        kind: "photo", ext: "jpg", size: "2.9 MB", caption: "FORMWORK · BAY 3" } },
  { fileId: "x08",  jobId: "j09", at: "07:50", who: "u6", inline: { name: "Incident Report — minor",    kind: "safety",ext: "pdf", size: "440 KB", flag: "stop", flagNote: "follow-up required" } },
  { fileId: "x09",  jobId: "j17", at: "07:15", who: "u2", inline: { name: "COI — Prologis updated",     kind: "permit",ext: "pdf", size: "260 KB" } },
];

const FILE_FOLDERS = {
  j01: [
    { name: "All files",       count: 47, key: "all" },
    { name: "Photos",          count: 31, key: "photo" },
    { name: "Daily Reports",   count: 5,  key: "report" },
    { name: "Contracts",       count: 2,  key: "contract" },
    { name: "Permits",         count: 1,  key: "permit" },
    { name: "Drawings",        count: 3,  key: "dwg" },
    { name: "Safety",          count: 2,  key: "safety" },
    { name: "Tickets",         count: 1,  key: "invoice" },
    { name: "Specs",           count: 1,  key: "sheet" },
    { name: "Correspondence",  count: 1,  key: "email" },
  ],
};

const FILE_STATS = {
  totalToday: 14,
  totalActiveJobs: 6,
  totalThisWeek: 87,
  storageUsed: "12.4 GB",
  storageTotal: "100 GB",
  pendingReview: 3,
  flagged: 4,
};

window.FILES_DATA = {
  FILE_KIND, FILE_USERS, FILE_JOBS, FILES_BY_JOB,
  TODAY_ACTIVITY, FILE_FOLDERS, FILE_STATS,
};
