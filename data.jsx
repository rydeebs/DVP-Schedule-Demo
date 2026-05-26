// Fixture data — DVP Field Ops Crew Calendar Board view
// Tuesday, May 26, 2026

const ROLES = {
  FOR: "foreman",
  OPR: "operator",
  LBR: "laborer",
  CDL: "cdl driver",
  GRD: "grade checker",
  MAS: "mason",
};

const JOB_TYPES = {
  paving: { label: "PAVING",     tone: "ok"   },
  excav:  { label: "EXCAVATION", tone: "warn" },
  mill:   { label: "MILLING",    tone: "info" },
  conc:   { label: "CONCRETE",   tone: "info" },
  stripe: { label: "STRIPING",   tone: "ok"   },
  prep:   { label: "PREP",       tone: "warn" },
  repair: { label: "REPAIR",     tone: "stop" },
};

// Worker pool — referenced by id from crews & bench
const WORKERS = [
  { id: "w01", name: "Aaron Vasquez",    role: ROLES.FOR, init: "AV", cert: ["OSHA-30","CDL-A","Flagger"] },
  { id: "w02", name: "Mike Doherty",     role: ROLES.FOR, init: "MD", cert: ["OSHA-30","CDL-A"] },
  { id: "w03", name: "Luis Diaz",        role: ROLES.FOR, init: "LD", cert: ["OSHA-30","ACI"] },
  { id: "w04", name: "Raj Patel",        role: ROLES.FOR, init: "RP", cert: ["OSHA-30","CDL-B"] },
  { id: "w05", name: "Cole Jenkins",     role: ROLES.FOR, init: "CJ", cert: ["OSHA-10"] },
  { id: "w06", name: "Hector Morales",   role: ROLES.OPR, init: "HM", cert: ["CDL-A","Heavy Eq"] },
  { id: "w07", name: "Tommy O'Rourke",   role: ROLES.OPR, init: "TO", cert: ["Heavy Eq"] },
  { id: "w08", name: "Dwayne Carter",    role: ROLES.OPR, init: "DC", cert: ["CDL-A","Heavy Eq"] },
  { id: "w09", name: "Eli Brennan",      role: ROLES.LBR, init: "EB", cert: ["OSHA-10"] },
  { id: "w10", name: "Sam Whitford",     role: ROLES.LBR, init: "SW", cert: ["OSHA-10","Flagger"] },
  { id: "w11", name: "Marcus Bell",      role: ROLES.LBR, init: "MB", cert: ["OSHA-10"] },
  { id: "w12", name: "Pedro Reyes",      role: ROLES.LBR, init: "PR", cert: ["OSHA-10"] },
  { id: "w13", name: "Kenny Boyle",      role: ROLES.CDL, init: "KB", cert: ["CDL-A","Tanker"] },
  { id: "w14", name: "Ricky Tran",       role: ROLES.CDL, init: "RT", cert: ["CDL-A"] },
  { id: "w15", name: "Jorge Salinas",    role: ROLES.CDL, init: "JS", cert: ["CDL-A"] },
  { id: "w16", name: "Owen Petrov",      role: ROLES.GRD, init: "OP", cert: ["GPS Grade"] },
  { id: "w17", name: "Brandon Hayes",    role: ROLES.GRD, init: "BH", cert: ["GPS Grade","Flagger"] },
  { id: "w18", name: "Marco Russo",      role: ROLES.MAS, init: "MR", cert: ["ACI","OSHA-10"] },
  { id: "w19", name: "Devon King",       role: ROLES.LBR, init: "DK", cert: ["OSHA-10"] },
  { id: "w20", name: "Trevor Nash",      role: ROLES.OPR, init: "TN", cert: ["Heavy Eq"] },
  { id: "w21", name: "Isaiah Wright",    role: ROLES.LBR, init: "IW", cert: ["OSHA-10"] },
  { id: "w22", name: "Frankie Calabrese",role: ROLES.LBR, init: "FC", cert: ["OSHA-10"] },
  { id: "w23", name: "Wes Tilghman",     role: ROLES.OPR, init: "WT", cert: ["Heavy Eq","CDL-A"] },
];

const lookup = (id) => WORKERS.find(w => w.id === id);

// Initial crew composition — id maps onto WORKERS
const INITIAL_CREWS = [
  {
    id: "c1",
    name: "Crew 14 — Vasquez",
    foremanId: "w01",
    division: "Paving",
    workerIds: ["w01","w06","w09","w10","w13","w16"],
    truckIds: ["T-204","T-211"],
    equipment: ["CAT AP1055F", "Bomag BW190", "Volvo SD45"],
    jobIds: ["j01","j04"],
    gpsActive: true,
  },
  {
    id: "c2",
    name: "Crew 22 — Doherty",
    foremanId: "w02",
    division: "Excavation",
    workerIds: ["w02","w07","w11","w12","w14","w17"],
    truckIds: ["T-118","T-119","T-141"],
    equipment: ["CAT 336", "Bobcat E85", "Volvo A40G"],
    jobIds: ["j02"],
    gpsActive: true,
  },
  {
    id: "c3",
    name: "Crew 07 — Diaz",
    foremanId: "w03",
    division: "Concrete",
    workerIds: ["w03","w18","w19","w22"],
    truckIds: ["T-302"],
    equipment: ["Power Trowel x2", "Vibrators"],
    jobIds: ["j03"],
    gpsActive: false,
  },
  {
    id: "c4",
    name: "Crew 31 — Patel",
    foremanId: "w04",
    division: "Milling",
    workerIds: ["w04","w08","w15","w20","w23"],
    truckIds: ["T-407","T-408","T-409"],
    equipment: ["Wirtgen W210", "Sweeper"],
    jobIds: ["j05"],
    gpsActive: true,
  },
  {
    id: "c5",
    name: "Crew 09 — Jenkins",
    foremanId: "w05",
    division: "Striping",
    workerIds: ["w05","w21"],
    truckIds: ["T-505"],
    equipment: ["Graco LineLazer"],
    jobIds: [],
    gpsActive: true,
  },
];

// All jobs — both assigned and unassigned
const ALL_JOBS = [
  { id: "j01", code: "P-2419", name: "Route 9 Resurfacing — Phase 2",       customer: "NJDOT",                location: "Old Bridge, NJ",   type: "paving",  hours: 9, tons: 480, crew: "c1", startTime: "06:00", endTime: "15:00", priority: "high"  },
  { id: "j02", code: "X-1180", name: "Riverside Industrial Park — Pad Cut", customer: "Greenleaf Capital",    location: "Edison, NJ",       type: "excav",   hours: 10, yards: 1200, crew: "c2", startTime: "06:30", endTime: "16:30", priority: "med"  },
  { id: "j03", code: "C-0742", name: "Madison Plaza — Curb & Gutter",        customer: "Madison Realty",       location: "Madison, NJ",      type: "conc",    hours: 8, yards: 22, crew: "c3", startTime: "07:00", endTime: "15:00", priority: "med"  },
  { id: "j04", code: "P-2418", name: "Costco Lot — South Section",           customer: "Costco Wholesale",     location: "Brunswick, NJ",    type: "paving",  hours: 6, tons: 220, crew: "c1", startTime: "15:30", endTime: "21:30", priority: "low", note: "night work" },
  { id: "j05", code: "M-1102", name: "Garden State Pkwy Exit 109 — Mill",    customer: "NJ Turnpike Authority",location: "Holmdel, NJ",      type: "mill",    hours: 11, sqyd: 14200, crew: "c4", startTime: "20:00", endTime: "06:00", priority: "high", note: "night work" },
  // Unassigned pool
  { id: "j06", code: "P-2420", name: "Wegmans Lot Re-pave — Mobilization",   customer: "Wegmans Food Markets", location: "Bridgewater, NJ",  type: "paving",  hours: 8, tons: 380, crew: null, priority: "high", needs: "1 foreman, 4 laborers, 1 op" },
  { id: "j07", code: "X-1192", name: "Hudson Yards Lot 8 — Stripping",       customer: "Related Companies",    location: "Jersey City, NJ",  type: "excav",   hours: 12, yards: 2800, crew: null, priority: "high", note: "permit window 06:00–18:00" },
  { id: "j08", code: "S-0314", name: "DOT Bid 24-118 — Striping",            customer: "NJDOT",                location: "Trenton, NJ",      type: "stripe",  hours: 6, lf: 18400, crew: null, priority: "med" },
  { id: "j09", code: "P-2421", name: "Amazon BWI4 — Dock Apron Patch",       customer: "Amazon Logistics",     location: "Robbinsville, NJ", type: "repair",  hours: 4, tons: 60, crew: null, priority: "high", note: "must finish before AM dock ops" },
  { id: "j10", code: "P-2422", name: "Verizon Campus — Driveway Overlay",    customer: "Verizon Real Estate",  location: "Basking Ridge, NJ",type: "paving",  hours: 7, tons: 290, crew: null, priority: "med" },
  { id: "j11", code: "C-0758", name: "Hampton Inn — ADA Ramp Pour",          customer: "Hilton Worldwide",     location: "Parsippany, NJ",   type: "conc",    hours: 5, yards: 8, crew: null, priority: "med" },
  { id: "j12", code: "PR-019", name: "Route 1 — Pre-mill Sweep & Sawcut",    customer: "NJDOT",                location: "New Brunswick, NJ",type: "prep",    hours: 6, lf: 4200, crew: null, priority: "med", note: "lane closure 09:00–15:00" },
  { id: "j13", code: "M-1105", name: "Walmart DC — Mill & Inlay Test",       customer: "Walmart Inc.",         location: "Cranbury, NJ",     type: "mill",    hours: 8, sqyd: 6400, crew: null, priority: "low" },
];

// Bench — workers not on a crew today
const BENCH = [
  { workerId: "w99a", name: "Tony Marchetti",  role: ROLES.OPR, init: "TM", state: "pto",      note: "Vacation — back Jun 02" },
  { workerId: "w99b", name: "Greg Vinson",     role: ROLES.LBR, init: "GV", state: "sick",     note: "Called out 05:47" },
  { workerId: "w99c", name: "Hank Lozano",     role: ROLES.CDL, init: "HL", state: "training", note: "OSHA-30 refresher" },
  { workerId: "w99d", name: "Carlos Mendez",   role: ROLES.LBR, init: "CM", state: "shop",     note: "Yard duty — T-118 repair" },
  { workerId: "w99e", name: "Bill Tanaka",     role: ROLES.OPR, init: "BT", state: "shop",     note: "Inspecting CAT 320" },
  { workerId: "w99f", name: "Vern Pickard",    role: ROLES.GRD, init: "VP", state: "pto",      note: "Personal day" },
  { workerId: "w99g", name: "Quentin Ross",    role: ROLES.LBR, init: "QR", state: "available",note: "Open — float crew" },
  { workerId: "w99h", name: "Anders Lindgren", role: ROLES.OPR, init: "AL", state: "available",note: "Open — heavy eq" },
];

// Weekly stats for the hero rail
const WEEK_STATS = {
  jobsActive: 141,
  jobsTotal: 5524,
  workersScheduled: 184,
  workersTotal: 203,
  trucksDispatched: 47,
  fleetTotal: 62,
  formsOpen: 23,
};

// ─────────────────────────────────────────────────────────────────────
// Weekly schedule — keys 0–6 are Sun…Sat starting Sun May 24, 2026
// Each cell is an array of job-instances. Job-instance refs an ALL_JOBS id
// plus per-day hours (multi-day jobs span cells with their own hours).
// ─────────────────────────────────────────────────────────────────────
const WEEK_DAYS = [
  { idx: 0, key: "SUN", date: "May 24", hi: 73, lo: 57, wx: "rain"  },
  { idx: 1, key: "MON", date: "May 25", hi: 81, lo: 60, wx: "rain"  },
  { idx: 2, key: "TUE", date: "May 26", hi: 82, lo: 63, wx: "rain"  },
  { idx: 3, key: "WED", date: "May 27", hi: 77, lo: 64, wx: "cloud" },
  { idx: 4, key: "THU", date: "May 28", hi: 76, lo: 56, wx: "sun"   },
  { idx: 5, key: "FRI", date: "May 29", hi: 75, lo: 56, wx: "sun"   },
  { idx: 6, key: "SAT", date: "May 30", hi: 74, lo: 56, wx: "cloud" },
];

const WEEK_SCHEDULE = {
  // c1 Vasquez — Paving
  c1: {
    1: [{ jobId: "j01", hours: 9 }],
    2: [{ jobId: "j01", hours: 9 }, { jobId: "j04", hours: 6, night: true }],
    3: [{ jobId: "j09", hours: 4 }],
    4: [{ jobId: "j10", hours: 7 }],
    5: [{ jobId: "j10", hours: 7 }],
  },
  // c2 Doherty — Excavation
  c2: {
    1: [{ jobId: "j02", hours: 10 }],
    2: [{ jobId: "j02", hours: 10 }],
    3: [{ jobId: "j02", hours: 10 }],
    4: [{ jobId: "j07", hours: 12 }],
    5: [{ jobId: "j07", hours: 12 }],
    6: [{ jobId: "j07", hours: 12 }],
  },
  // c3 Diaz — Concrete
  c3: {
    2: [{ jobId: "j03", hours: 8 }],
    3: [{ jobId: "j11", hours: 5 }],
    4: [{ jobId: "j03", hours: 8 }],
  },
  // c4 Patel — Milling
  c4: {
    2: [{ jobId: "j05", hours: 11, night: true }],
    3: [{ jobId: "j05", hours: 11, night: true }],
    4: [{ jobId: "j13", hours: 8 }],
    5: [{ jobId: "j13", hours: 8 }],
  },
  // c5 Jenkins — Striping
  c5: {
    4: [{ jobId: "j08", hours: 6 }],
    5: [{ jobId: "j12", hours: 6 }],
  },
};

// Per-job dispatch composition — shown on Dispatch view
const DISPATCH = {
  j01: {
    equipment: [
      { name: "CAT AP1055F Paver",   asset: "EQ-204",  driverId: "w06", note: "primary"  },
      { name: "Bomag BW190AD",       asset: "EQ-211",  driverId: "w20", note: "breakdown roller" },
      { name: "Volvo SD45 Tandem",   asset: "EQ-218",  driverId: "w23", note: "finish" },
    ],
    trucking: [
      { truck: "T-204", driverId: "w13", route: "Plant 4 → Old Bridge", loads: 8,  material: "Hot Mix 9.5mm" },
      { truck: "T-211", driverId: "w14", route: "Plant 4 → Old Bridge", loads: 7,  material: "Hot Mix 9.5mm" },
      { truck: "T-219", driverId: "w15", route: "Plant 4 → Old Bridge", loads: 6,  material: "Hot Mix 19mm" },
    ],
    materials: [
      { mat: "HMA 9.5mm Surface",  qty: "320 tn", supplier: "Tilcon Mt. Hope",  window: "06:00–11:00", status: "ok" },
      { mat: "HMA 19mm Binder",    qty: "160 tn", supplier: "Tilcon Mt. Hope",  window: "11:00–14:00", status: "ok" },
      { mat: "Tack Coat SS-1h",    qty: "200 gal",supplier: "Asphalt Solutions",window: "06:00",      status: "warn", noteShort: "delivery pushed 30m" },
    ],
  },
  j02: {
    equipment: [
      { name: "CAT 336 Excavator", asset: "EQ-118", driverId: "w07", note: "primary" },
      { name: "Bobcat E85",        asset: "EQ-119", driverId: "w20", note: "trim" },
      { name: "Volvo A40G Haul",   asset: "EQ-141", driverId: "w08", note: "" },
    ],
    trucking: [
      { truck: "T-118", driverId: "w14", route: "Site → Spoils Yard",     loads: 14, material: "Spoils" },
      { truck: "T-119", driverId: "w15", route: "Quarry → Site",          loads: 9,  material: "DGA 3/4\"" },
      { truck: "T-141", driverId: "w13", route: "Quarry → Site",          loads: 9,  material: "DGA 3/4\"" },
    ],
    materials: [
      { mat: "DGA 3/4\" Dense Graded", qty: "640 tn", supplier: "Stavola Quarry", window: "07:00–13:00", status: "ok" },
      { mat: "Bedding Sand",           qty: "80 tn",  supplier: "Stavola Quarry", window: "13:00",       status: "stop", noteShort: "supplier confirmed delay — 14:30 ETA" },
    ],
  },
  j03: {
    equipment: [
      { name: "Power Trowel x2", asset: "EQ-302", driverId: "w18", note: "" },
      { name: "Vibrators (3)",   asset: "EQ-303", driverId: "w22", note: "" },
    ],
    trucking: [
      { truck: "T-302", driverId: "w13", route: "Plant 2 → Madison", loads: 3, material: "4000 PSI Mix" },
    ],
    materials: [
      { mat: "4000 PSI Concrete", qty: "22 yd³", supplier: "Eastern Concrete", window: "07:30–10:00", status: "ok" },
      { mat: "Curing Compound",   qty: "5 gal",  supplier: "Yard inventory",   window: "—",           status: "ok" },
    ],
  },
  j04: {
    equipment: [
      { name: "CAT AP555F Paver", asset: "EQ-205", driverId: "w06", note: "small paver, night" },
      { name: "Bomag BW900-50",   asset: "EQ-212", driverId: "w07", note: "" },
    ],
    trucking: [
      { truck: "T-204", driverId: "w13", route: "Plant 4 → Brunswick", loads: 4, material: "HMA 9.5mm" },
    ],
    materials: [
      { mat: "HMA 9.5mm Surface", qty: "220 tn", supplier: "Tilcon Mt. Hope", window: "15:30–18:30", status: "ok" },
    ],
  },
  j05: {
    equipment: [
      { name: "Wirtgen W210 Mill", asset: "EQ-407", driverId: "w08", note: "night mill" },
      { name: "Sweeper Elgin",     asset: "EQ-408", driverId: "w20", note: "follow" },
    ],
    trucking: [
      { truck: "T-407", driverId: "w14", route: "Site → Recycle Yard", loads: 18, material: "Millings" },
      { truck: "T-408", driverId: "w15", route: "Site → Recycle Yard", loads: 18, material: "Millings" },
      { truck: "T-409", driverId: "w13", route: "Site → Recycle Yard", loads: 17, material: "Millings" },
    ],
    materials: [
      { mat: "Millings (haul-off)", qty: "≈ 800 tn", supplier: "—", window: "20:00–06:00", status: "ok" },
    ],
  },
};

window.DATA = {
  WORKERS, INITIAL_CREWS, ALL_JOBS, BENCH, WEEK_STATS, JOB_TYPES, ROLES, lookup,
  WEEK_DAYS, WEEK_SCHEDULE, DISPATCH,
};
