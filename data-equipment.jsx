// Equipment fixture data — DVP Field Ops
// Asset registry view: what we own, what it cost, what it's earning.
// Distinct from Fleet Tracking (live where) — this is utilization economics.

// Today: May 26, 2026
const TODAY = new Date(2026, 4, 26);
const daysSince = (iso) => Math.round((TODAY - new Date(iso)) / 86400000);

const TYPES = {
  paver:     { lbl: "PAVER",       tone: "ok"   },
  roller:    { lbl: "ROLLER",      tone: "ok"   },
  mill:      { lbl: "MILL",        tone: "info" },
  excavator: { lbl: "EXCAVATOR",   tone: "warn" },
  backhoe:   { lbl: "BACKHOE",     tone: "warn" },
  dozer:     { lbl: "DOZER",       tone: "warn" },
  loader:    { lbl: "WHEEL LOADER",tone: "warn" },
  haul:      { lbl: "HAUL TRUCK",  tone: "ok"   },
  dirtRoll:  { lbl: "DIRT ROLLER", tone: "ok"   },
  sweeper:   { lbl: "SWEEPER",     tone: "info" },
  striper:   { lbl: "STRIPER",     tone: "ok"   },
  trowel:    { lbl: "TROWEL",      tone: "info" },
};

const STATUS = {
  active:   { lbl: "ON SITE",     tone: "ok"   },
  transit:  { lbl: "IN TRANSIT",  tone: "info" },
  yard:     { lbl: "AT YARD",     tone: "warn" },
  service:  { lbl: "DOWN · SVC",  tone: "stop" },
  rental:   { lbl: "RENTAL",      tone: "info" },
};

// Job sites (referenced from previous fixtures — kept here standalone)
const JOBS = [
  { id: "j01", code: "P-2419", name: "Route 9 Resurfacing — Phase 2",     city: "Old Bridge",    x: 76, y: 50, type: "paving" },
  { id: "j02", code: "X-1180", name: "Riverside Industrial Park",         city: "Edison",        x: 72, y: 44, type: "excav"  },
  { id: "j03", code: "C-0742", name: "Madison Plaza — Curb & Gutter",     city: "Madison",       x: 73, y: 30, type: "conc"   },
  { id: "j04", code: "P-2418", name: "Costco Lot — South Section",        city: "Brunswick",     x: 70, y: 46, type: "paving" },
  { id: "j05", code: "M-1102", name: "GSP Exit 109 Mill",                 city: "Holmdel",       x: 80, y: 56, type: "mill"   },
  { id: "j06", code: "P-2421", name: "Amazon BWI4 — Dock Apron",          city: "Robbinsville",  x: 60, y: 60, type: "repair" },
  { id: "jY",  code: "YARD",   name: "DVP Yard — Branchburg",             city: "Branchburg",    x: 60, y: 50, type: "yard"   },
];

// 36 pieces of equipment with realistic data
const EQUIPMENT = [
  // ─── PAVERS ───
  { id: "EQ-204", num: "204",  type: "paver",   make: "CAT",     model: "AP1055F",     year: 2023, ownership: "owned", purchase: 685_000, rate:  340, hours: 1_842, status: "active",  jobId: "j01", since: "2026-04-14", lastSvc: "2026-04-02", svcDue: "2026-07-02", driverInit: "HM", x: 76.4, y: 50.1, gps: true,  note: "South lane STA 24+50 → 31+20" },
  { id: "EQ-205", num: "555 A",type: "paver",   make: "CAT",     model: "AP555F",      year: 2021, ownership: "owned", purchase: 412_000, rate:  220, hours: 3_104, status: "yard",    jobId: "jY",  since: "2026-05-12", lastSvc: "2026-05-08", svcDue: "2026-08-08", driverInit: null, x: 60, y: 50, gps: false, note: "Available — small lots only" },
  { id: "EQ-655", num: "655",  type: "paver",   make: "CAT",     model: "AP655",       year: 2019, ownership: "owned", purchase: 295_000, rate:  185, hours: 6_842, status: "service", jobId: "jY",  since: "2026-05-20", lastSvc: "2026-05-21", svcDue: null,         driverInit: null, x: 60.2, y: 50, gps: true,  note: "Conveyor chain replacement — ETA Wed" },
  { id: "EQ-105", num: "1055B",type: "paver",   make: "CAT",     model: "AP1055B",     year: 2017, ownership: "owned", purchase: 540_000, rate:  280, hours: 8_204, status: "yard",    jobId: "jY",  since: "2026-04-15", lastSvc: "2026-03-12", svcDue: "2026-06-12", driverInit: null, x: 60, y: 50, gps: true,  note: "Available — paving operator needed" },

  // ─── ROLLERS ───
  { id: "EQ-211", num: "BW190",type: "roller",  make: "Bomag",   model: "BW190AD",     year: 2022, ownership: "owned", purchase: 168_000, rate:   95, hours: 2_104, status: "active",  jobId: "j01", since: "2026-04-14", lastSvc: "2026-04-20", svcDue: "2026-07-20", driverInit: "TN", x: 76.3, y: 50.2, gps: true,  note: "Breakdown roller" },
  { id: "EQ-218", num: "SD45", type: "roller",  make: "Volvo",   model: "SD45 Tandem", year: 2024, ownership: "owned", purchase: 142_000, rate:   88, hours:   411, status: "active",  jobId: "j01", since: "2026-04-14", lastSvc: "2026-04-01", svcDue: "2026-07-01", driverInit: "WT", x: 76.2, y: 50.3, gps: true,  note: "Finish roller" },
  { id: "EQ-212", num: "BW900",type: "roller",  make: "Bomag",   model: "BW900-50",    year: 2020, ownership: "owned", purchase:  62_000, rate:   55, hours: 4_822, status: "active",  jobId: "j04", since: "2026-04-22", lastSvc: "2026-03-30", svcDue: "2026-06-30", driverInit: "TO", x: 70, y: 46, gps: false, note: "Small lot finish work" },
  { id: "EQ-CB10",num: "CB10A",type: "roller",  make: "CAT",     model: "CB10",        year: 2019, ownership: "owned", purchase: 132_000, rate:   78, hours: 5_220, status: "yard",    jobId: "jY",  since: "2026-05-08", lastSvc: "2026-04-18", svcDue: "2026-07-18", driverInit: null, x: 60, y: 50, gps: true },
  { id: "EQ-CB64",num: "CB64A",type: "roller",  make: "CAT",     model: "CB64",        year: 2020, ownership: "owned", purchase: 145_000, rate:   82, hours: 3_891, status: "transit", jobId: "j06", since: "2026-05-26", lastSvc: "2026-04-25", svcDue: "2026-07-25", driverInit: "KB", x: 65, y: 55, gps: true,  note: "En route to Amazon BWI4" },

  // ─── MILLS ───
  { id: "EQ-407", num: "W210", type: "mill",    make: "Wirtgen", model: "W210",        year: 2023, ownership: "owned", purchase: 1_240_000,rate: 525, hours: 3_104, status: "active",  jobId: "j05", since: "2026-05-12", lastSvc: "2026-05-01", svcDue: "2026-08-01", driverInit: "DC", x: 80, y: 56, gps: true,  note: "Night mill · lane 2" },
  { id: "EQ-408", num: "W120", type: "mill",    make: "Wirtgen", model: "W120CFi",     year: 2018, ownership: "owned", purchase:   480_000,rate: 280, hours: 7_412, status: "service", jobId: "jY",  since: "2026-05-22", lastSvc: "2026-05-22", svcDue: null,         driverInit: null, x: 60.2, y: 50, gps: false, note: "Drum bearing — 4-6 week ETA" },

  // ─── EXCAVATORS ───
  { id: "EQ-118", num: "336",  type: "excavator",make:"CAT",     model: "336",          year: 2022, ownership: "owned", purchase:   485_000,rate: 245, hours: 4_211, status: "active",  jobId: "j02", since: "2026-04-22", lastSvc: "2026-04-12", svcDue: "2026-07-12", driverInit: "TO", x: 72.1, y: 44.2, gps: true,  note: "Trenching west side" },
  { id: "EQ-320", num: "320",  type: "excavator",make:"CAT",     model: "320",          year: 2020, ownership: "owned", purchase:   320_000,rate: 195, hours: 8_104, status: "service", jobId: "jY",  since: "2026-05-11", lastSvc: "2026-05-12", svcDue: null,         driverInit: null, x: 60, y: 50, gps: true,  note: "Hydraulic line repair · ticket SR-1182" },
  { id: "EQ-345", num: "345",  type: "excavator",make:"CAT",     model: "345",          year: 2023, ownership: "owned", purchase:   620_000,rate: 295, hours: 1_240, status: "rental",  jobId: "j02", since: "2026-05-15", lastSvc: "2026-04-30", svcDue: "2026-07-30", driverInit: "DC", x: 72, y: 44, gps: true,  note: "Rented to Greenleaf · $1,800/wk" },

  // ─── BACKHOES ───
  { id: "EQ-BHA", num: "BH-A", type: "backhoe", make: "CAT",     model: "420F",         year: 2021, ownership: "owned", purchase: 105_000, rate:  72, hours: 4_220, status: "yard",    jobId: "jY",  since: "2026-04-02", lastSvc: "2026-03-15", svcDue: "2026-06-15", driverInit: null, x: 60, y: 50, gps: false },
  { id: "EQ-BHB", num: "BH-B", type: "backhoe", make: "CAT",     model: "420F2",        year: 2022, ownership: "owned", purchase: 118_000, rate:  78, hours: 2_840, status: "active",  jobId: "j06", since: "2026-05-20", lastSvc: "2026-04-08", svcDue: "2026-07-08", driverInit: "EB", x: 60, y: 60, gps: true },
  { id: "EQ-BHC", num: "BH-C", type: "backhoe", make: "CAT",     model: "430F2",        year: 2024, ownership: "owned", purchase: 138_000, rate:  85, hours:   620, status: "transit", jobId: "j03", since: "2026-05-26", lastSvc: "2026-05-01", svcDue: "2026-08-01", driverInit: "PR", x: 67, y: 39, gps: true,  note: "En route to Madison" },
  { id: "EQ-BHD", num: "BH-D", type: "backhoe", make: "CAT",     model: "430F",         year: 2019, ownership: "owned", purchase:  88_000, rate:  68, hours: 5_840, status: "active",  jobId: "j04", since: "2026-04-22", lastSvc: "2026-04-15", svcDue: "2026-07-15", driverInit: "MB", x: 70, y: 46, gps: false },

  // ─── DOZER + LOADER + DIRT ROLLER ───
  { id: "EQ-D5",  num: "D5",   type: "dozer",   make: "CAT",     model: "D5K",          year: 2020, ownership: "owned", purchase: 290_000, rate: 162, hours: 4_120, status: "yard",    jobId: "jY",  since: "2026-04-28", lastSvc: "2026-04-02", svcDue: "2026-07-02", driverInit: null, x: 60, y: 50, gps: true },
  { id: "EQ-D6",  num: "D6",   type: "dozer",   make: "CAT",     model: "D6T",          year: 2022, ownership: "owned", purchase: 545_000, rate: 245, hours: 2_140, status: "active",  jobId: "j02", since: "2026-04-22", lastSvc: "2026-04-25", svcDue: "2026-07-25", driverInit: "DC", x: 72, y: 44.1, gps: true },
  { id: "EQ-WL",  num: "WL-1", type: "loader",  make: "CAT",     model: "950M",         year: 2021, ownership: "owned", purchase: 320_000, rate: 175, hours: 3_440, status: "active",  jobId: "j01", since: "2026-05-12", lastSvc: "2026-04-30", svcDue: "2026-07-30", driverInit: "HM", x: 76, y: 50, gps: true,  note: "Skip-loader · plant feed" },
  { id: "EQ-WL2", num: "WL-2", type: "loader",  make: "Volvo",   model: "L70H",         year: 2020, ownership: "owned", purchase: 240_000, rate: 145, hours: 4_220, status: "yard",    jobId: "jY",  since: "2026-04-01", lastSvc: "2026-03-20", svcDue: "2026-06-20", driverInit: null, x: 60, y: 50, gps: false },
  { id: "EQ-DR1", num: "DR-1", type: "dirtRoll",make: "Bomag",   model: "BW145D-5",     year: 2022, ownership: "owned", purchase:  98_000, rate:  62, hours: 1_840, status: "active",  jobId: "j02", since: "2026-04-22", lastSvc: "2026-04-18", svcDue: "2026-07-18", driverInit: "EB", x: 72.1, y: 44, gps: true },
  { id: "EQ-DR2", num: "DR-2", type: "dirtRoll",make: "CAT",     model: "CB22B",        year: 2018, ownership: "owned", purchase:  64_000, rate:  48, hours: 6_212, status: "yard",    jobId: "jY",  since: "2026-04-18", lastSvc: "2026-03-22", svcDue: "2026-06-22", driverInit: null, x: 60, y: 50, gps: false },

  // ─── HAUL TRUCKS ───
  { id: "EQ-A40", num: "A40G", type: "haul",    make: "Volvo",   model: "A40G",         year: 2021, ownership: "owned", purchase: 720_000, rate: 285, hours: 6_842, status: "active",  jobId: "j02", since: "2026-04-22", lastSvc: "2026-04-22", svcDue: "2026-07-22", driverInit: "DC", x: 71.8, y: 44.3, gps: true },
  { id: "EQ-A30", num: "A30G", type: "haul",    make: "Volvo",   model: "A30G",         year: 2023, ownership: "owned", purchase: 580_000, rate: 240, hours: 1_120, status: "yard",    jobId: "jY",  since: "2026-05-04", lastSvc: "2026-04-12", svcDue: "2026-07-12", driverInit: null, x: 60, y: 50, gps: true },

  // ─── SWEEPER + STRIPER + TROWEL ───
  { id: "EQ-SW",  num: "EP-1", type: "sweeper", make: "Elgin",   model: "Pelican",      year: 2022, ownership: "owned", purchase: 215_000, rate: 110, hours: 1_980, status: "active",  jobId: "j05", since: "2026-05-12", lastSvc: "2026-04-22", svcDue: "2026-07-22", driverInit: "TN", x: 80.1, y: 56.1, gps: true,  note: "Mill follow-up sweep" },
  { id: "EQ-SP1", num: "LL-1", type: "striper", make: "Graco",   model: "LineLazer V",  year: 2021, ownership: "owned", purchase:  42_000, rate:  58, hours: 2_410, status: "yard",    jobId: "jY",  since: "2026-04-15", lastSvc: "2026-04-10", svcDue: "2026-07-10", driverInit: null, x: 60, y: 50, gps: false },
  { id: "EQ-TR1", num: "TR-1", type: "trowel",  make: "Allen",   model: "Riding Trowel",year: 2020, ownership: "owned", purchase:  48_000, rate:  64, hours: 1_802, status: "active",  jobId: "j03", since: "2026-04-22", lastSvc: "2026-04-08", svcDue: "2026-07-08", driverInit: "MR", x: 73, y: 30, gps: false },

  // ─── RENTALS ───
  { id: "EQ-R1",  num: "R-CAT", type: "excavator",make:"CAT (rented)",model: "395 (Hertz)",year: 2024, ownership: "rented", purchase: null, rate: 380, hours: 280, status: "active",  jobId: "j02", since: "2026-05-08", lastSvc: null,         svcDue: null,         driverInit: "DC", x: 72, y: 44.2, gps: true,  note: "Hertz rental · $4,200/wk · Jun 15 return" },
];

// Service tickets — what's due, what's overdue
const SERVICE_TICKETS = [
  { id: "SR-1182", eqId: "EQ-320", title: "Hydraulic line replacement",     opened: "2026-05-11", status: "open",     priority: "high",  est: 4200, hoursDown: 92 },
  { id: "SR-1185", eqId: "EQ-655", title: "Conveyor chain replacement",     opened: "2026-05-20", status: "open",     priority: "high",  est: 2800, hoursDown: 64 },
  { id: "SR-1187", eqId: "EQ-408", title: "Drum bearing rebuild",           opened: "2026-05-22", status: "open",     priority: "med",   est: 12000,hoursDown: 38 },
  { id: "SR-1192", eqId: "EQ-105", title: "1,000-hr service due",           opened: "2026-05-18", status: "scheduled",priority: "med",   est: 1800, hoursDown: 0  },
];

const fmtMoney = (n) => {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1000)}k`;
  return `$${n.toLocaleString()}`;
};
const fmtRate = (n) => n == null ? "—" : `$${n}/hr`;

// Stats
const STATS = {
  total: EQUIPMENT.length,
  owned: EQUIPMENT.filter(e => e.ownership === "owned").length,
  rented: EQUIPMENT.filter(e => e.ownership === "rented").length,
  onSite: EQUIPMENT.filter(e => e.status === "active").length,
  inTransit: EQUIPMENT.filter(e => e.status === "transit").length,
  atYard: EQUIPMENT.filter(e => e.status === "yard").length,
  inService: EQUIPMENT.filter(e => e.status === "service").length,
  fleetValue: EQUIPMENT.filter(e => e.purchase).reduce((a, e) => a + e.purchase, 0),
  idleAssets: EQUIPMENT.filter(e => e.status === "yard" && daysSince(e.since) > 14).length,
  serviceOpen: SERVICE_TICKETS.filter(t => t.status === "open").length,
  // Utilization: assets active / assets owned (excluding service)
  utilization: Math.round((EQUIPMENT.filter(e => e.status === "active").length / EQUIPMENT.filter(e => e.status !== "service").length) * 100),
};

window.EQ_DATA = {
  EQUIPMENT, TYPES, STATUS, JOBS, SERVICE_TICKETS,
  STATS, fmtMoney, fmtRate, daysSince, TODAY,
};
