// Fleet fixture data — DVP Field Ops
// Reality: of 60 "vehicles", only 14 are company trucks with Tenna GPS.
// 46 are subcontractors with no GPS — they belong in a separate Subs list,
// not bloating the realtime fleet view.

// NJ-region geographic bounds for the schematic map
// Roughly: lat 39.5–41.0, lng -75.5 to -73.7
const MAP_BOUNDS = { latMin: 39.5, latMax: 41.0, lngMin: -75.5, lngMax: -73.7 };

const project = (lat, lng) => ({
  x: ((lng - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin)) * 100,
  y: ((MAP_BOUNDS.latMax - lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * 100,
});

// Known city anchors for the schematic
const CITIES = [
  { name: "NEW YORK",      x: 88, y: 22 },
  { name: "JERSEY CITY",   x: 85, y: 28 },
  { name: "NEWARK",        x: 82, y: 32 },
  { name: "PATERSON",      x: 79, y: 22 },
  { name: "MORRISTOWN",    x: 70, y: 30 },
  { name: "BRIDGEWATER",   x: 60, y: 42 },
  { name: "NEW BRUNSWICK", x: 70, y: 46 },
  { name: "EDISON",        x: 72, y: 44 },
  { name: "PRINCETON",     x: 56, y: 56 },
  { name: "TRENTON",       x: 50, y: 62 },
  { name: "OLD BRIDGE",    x: 76, y: 50 },
  { name: "HOLMDEL",       x: 80, y: 56 },
  { name: "ROBBINSVILLE",  x: 60, y: 60 },
  { name: "MADISON",       x: 73, y: 30 },
  { name: "PARSIPPANY",    x: 72, y: 28 },
  { name: "BASKING RIDGE", x: 65, y: 36 },
  { name: "BRANCHBURG",    x: 56, y: 44 },
  { name: "CRANBURY",      x: 62, y: 52 },
  { name: "DVP YARD",      x: 60, y: 50 },
];

// Job sites for context
const JOB_SITES = [
  { id: "j01", code: "P-2419", name: "Route 9 Resurfacing",         city: "Old Bridge",    x: 76, y: 50, type: "paving" },
  { id: "j02", code: "X-1180", name: "Riverside Industrial Park",   city: "Edison",        x: 72, y: 44, type: "excav" },
  { id: "j03", code: "C-0742", name: "Madison Plaza",               city: "Madison",       x: 73, y: 30, type: "conc" },
  { id: "j04", code: "P-2418", name: "Costco Lot",                  city: "Brunswick",     x: 70, y: 46, type: "paving" },
  { id: "j05", code: "M-1102", name: "GSP Exit 109 Mill",           city: "Holmdel",       x: 80, y: 56, type: "mill" },
  { id: "j09", code: "P-2421", name: "Amazon BWI4 — Dock Apron",    city: "Robbinsville",  x: 60, y: 60, type: "repair" },
  { id: "j10", code: "P-2422", name: "Verizon Campus",              city: "Basking Ridge", x: 65, y: 36, type: "paving" },
  { id: "jY",  code: "YARD",   name: "DVP Yard — Branchburg",       city: "Branchburg",    x: 60, y: 50, type: "yard" },
];

// Company fleet — 22 assets total, all with Tenna GPS
// Status: moving | idle | shop | offline
// Type: truck | paver | roller | mill | excavator | dozer | loader | sweeper | striper | trowel
const ASSETS = [
  // ── On Route 9 paving site (Old Bridge) ──
  { id: "T-204", kind: "truck",     model: "Mack Granite",      year: 2023, status: "moving",  speed: 38, heading: "NE", x: 73, y: 49, driverId: "w13", jobId: "j01", odo: 84_421, fuel: 72, hours: null,    note: "load 7 of 8 — Tilcon → Old Bridge" },
  { id: "T-211", kind: "truck",     model: "Peterbilt 567",     year: 2022, status: "moving",  speed: 44, heading: "NE", x: 71, y: 48, driverId: "w14", jobId: "j01", odo: 112_840,fuel: 58, hours: null,    note: "load 6 of 7" },
  { id: "T-219", kind: "truck",     model: "Mack Granite",      year: 2024, status: "moving",  speed: 41, heading: "NE", x: 69, y: 47, driverId: "w15", jobId: "j01", odo: 41_002, fuel: 83, hours: null },
  { id: "EQ-204",kind: "paver",     model: "CAT AP1055F",       year: 2023, status: "moving",  speed: 3,  heading: "S",  x: 76.4,y: 50.1,driverId: "w06", jobId: "j01", odo: null,   fuel: 64, hours: 1_842,   note: "paving south lane STA 24+50 → 31+20" },
  { id: "EQ-211",kind: "roller",    model: "Bomag BW190AD",     year: 2022, status: "moving",  speed: 2,  heading: "S",  x: 76.3,y: 50.2,driverId: "w20", jobId: "j01", odo: null,   fuel: 78, hours: 2_104 },
  { id: "EQ-218",kind: "roller",    model: "Volvo SD45 Tandem", year: 2024, status: "moving",  speed: 2,  heading: "S",  x: 76.2,y: 50.3,driverId: "w23", jobId: "j01", odo: null,   fuel: 91, hours: 411 },

  // ── At Edison excavation pad ──
  { id: "T-118", kind: "truck",     model: "Mack TerraPro",     year: 2021, status: "moving",  speed: 22, heading: "W",  x: 71, y: 45, driverId: "w14", jobId: "j02", odo: 198_300,fuel: 41, hours: null,    note: "spoils haul-off load 11" },
  { id: "T-119", kind: "truck",     model: "Mack TerraPro",     year: 2021, status: "idle",    speed: 0,                  x: 72.2,y: 44.1,driverId: "w15", jobId: "j02", odo: 201_445,fuel: 67, hours: null,    note: "waiting on excavator" },
  { id: "T-141", kind: "truck",     model: "Kenworth T880",     year: 2023, status: "moving",  speed: 18, heading: "W",  x: 70, y: 44.5,driverId: "w13", jobId: "j02", odo: 67_220, fuel: 55, hours: null },
  { id: "EQ-118",kind: "excavator", model: "CAT 336",           year: 2022, status: "moving",  speed: 1,  heading: "N",  x: 72.1,y: 44.2,driverId: "w07", jobId: "j02", odo: null,   fuel: 49, hours: 4_211,   note: "trenching west side" },
  { id: "EQ-119",kind: "loader",    model: "Bobcat E85",        year: 2024, status: "idle",    speed: 0,                  x: 72.1,y: 44.0,driverId: "w20", jobId: "j02", odo: null,   fuel: 88, hours: 612 },
  { id: "EQ-141",kind: "truck",     model: "Volvo A40G Haul",   year: 2021, status: "moving",  speed: 14, heading: "W",  x: 71.8,y: 44.3,driverId: "w08", jobId: "j02", odo: null,   fuel: 38, hours: 6_842 },

  // ── At Holmdel mill ──
  { id: "T-407", kind: "truck",     model: "Mack TerraPro",     year: 2023, status: "moving",  speed: 32, heading: "S",  x: 79, y: 55, driverId: "w14", jobId: "j05", odo: 88_120, fuel: 64, hours: null,    note: "millings haul-off" },
  { id: "T-408", kind: "truck",     model: "Mack TerraPro",     year: 2023, status: "moving",  speed: 28, heading: "S",  x: 79.4,y: 55.4,driverId: "w15", jobId: "j05", odo: 90_410, fuel: 71, hours: null },
  { id: "T-409", kind: "truck",     model: "Mack TerraPro",     year: 2024, status: "moving",  speed: 35, heading: "S",  x: 79.8,y: 55.8,driverId: "w13", jobId: "j05", odo: 22_104, fuel: 92, hours: null },
  { id: "EQ-407",kind: "mill",      model: "Wirtgen W210",      year: 2023, status: "moving",  speed: 1,  heading: "S",  x: 80, y: 56, driverId: "w08", jobId: "j05", odo: null,   fuel: 33, hours: 3_104,   note: "milling lane 2 — night" },
  { id: "EQ-408",kind: "sweeper",   model: "Elgin Pelican",     year: 2022, status: "moving",  speed: 4,  heading: "S",  x: 80.1,y: 56.1,driverId: "w20", jobId: "j05", odo: null,   fuel: 60, hours: 1_980 },

  // ── At Madison concrete site ──
  { id: "T-302", kind: "truck",     model: "Mack Granite",      year: 2022, status: "idle",    speed: 0,                  x: 73, y: 30, driverId: "w13", jobId: "j03", odo: 144_220,fuel: 47, hours: null,    note: "ready for next pour" },

  // ── At striping (Crew 09) ──
  { id: "T-505", kind: "truck",     model: "Ford F-650",        year: 2023, status: "idle",    speed: 0,                  x: 50, y: 62, driverId: "w05", jobId: null, odo: 38_220, fuel: 81, hours: null,    note: "between jobs" },

  // ── In the shop (DVP Yard) ──
  { id: "EQ-320",kind: "excavator", model: "CAT 320",           year: 2020, status: "shop",    speed: 0,                  x: 60, y: 50, driverId: null,  jobId: "jY", odo: null,   fuel: 22, hours: 8_104,   note: "hydraulic line repair — ETA Wed" },
  { id: "T-110", kind: "truck",     model: "Mack TerraPro",     year: 2019, status: "shop",    speed: 0,                  x: 60.2,y: 50, driverId: null,  jobId: "jY", odo: 314_900,fuel: 12, hours: null,    note: "annual DOT inspection" },

  // ── Offline (tracker fault) ──
  { id: "T-503", kind: "truck",     model: "Ford F-550",        year: 2021, status: "offline", speed: null,               x: 65, y: 36, driverId: "w05", jobId: "j10", odo: 88_400, fuel: null, hours: null,  note: "Tenna last ping 14h ago — battery suspected", lastPing: "14h ago" },
];

const ASSET_KIND = {
  truck:     { label: "TRUCK",     tone: "ok"   },
  paver:     { label: "PAVER",     tone: "ok"   },
  roller:    { label: "ROLLER",    tone: "ok"   },
  mill:      { label: "MILL",      tone: "info" },
  excavator: { label: "EXCAVATOR", tone: "warn" },
  loader:    { label: "LOADER",    tone: "warn" },
  dozer:     { label: "DOZER",     tone: "warn" },
  sweeper:   { label: "SWEEPER",   tone: "info" },
  striper:   { label: "STRIPER",   tone: "ok"   },
  trowel:    { label: "TROWEL",    tone: "info" },
};

// Workers reused (same shape as before)
const FLEET_WORKERS = {
  w05: { init: "CJ", name: "Cole Jenkins" },
  w06: { init: "HM", name: "Hector Morales" },
  w07: { init: "TO", name: "Tommy O'Rourke" },
  w08: { init: "DC", name: "Dwayne Carter" },
  w13: { init: "KB", name: "Kenny Boyle" },
  w14: { init: "RT", name: "Ricky Tran" },
  w15: { init: "JS", name: "Jorge Salinas" },
  w20: { init: "TN", name: "Trevor Nash" },
  w23: { init: "WT", name: "Wes Tilghman" },
};

// Subcontractor "trackers" — listed separately, no GPS, only counted
const SUBCONTRACTORS = [
  { name: "Affordable Excavating & Hauling", crew: 4 },
  { name: "Ali Al Trucking, LLC",            crew: 2 },
  { name: "Anthony Yaros Industries, LLC",   crew: 6 },
  { name: "Antonio's Trucking, Inc.",        crew: 3 },
  { name: "Barakat Associates, LTD.",        crew: 5 },
  { name: "Bergen Trucking Group",           crew: 8 },
  { name: "Bridgewater Concrete Co.",        crew: 4 },
  { name: "CenterPoint Hauling",             crew: 12 },
  { name: "Diamond State Excavation",        crew: 7 },
  { name: "Frankel Aggregates",              crew: 5 },
];

// Real-time event feed
const FLEET_EVENTS = [
  { id: "ev1", at: "14:48",         kind: "load",     assetId: "T-204",  msg: "Loaded 39.8 tn HMA 9.5mm at Tilcon Mt. Hope — bound for P-2419" },
  { id: "ev2", at: "14:42",         kind: "geofence", assetId: "EQ-407", msg: "Entered job geofence M-1102 — Holmdel" },
  { id: "ev3", at: "14:31",         kind: "speed",    assetId: "T-141",  msg: "Speed 22 mph in 35 zone — OK" },
  { id: "ev4", at: "14:18",         kind: "idle",     assetId: "T-119",  msg: "Idle > 12 min on site — flagged" },
  { id: "ev5", at: "13:52",         kind: "fuel",     assetId: "EQ-407", msg: "Fuel < 35% — refuel ETA before midnight" },
  { id: "ev6", at: "13:30",         kind: "geofence", assetId: "T-204",  msg: "Exited Tilcon plant geofence" },
  { id: "ev7", at: "12:14",         kind: "offline",  assetId: "T-503",  msg: "Tenna lost connection — last ping 14h ago — battery suspected" },
  { id: "ev8", at: "11:22",         kind: "maint",    assetId: "EQ-320", msg: "Entered shop — hydraulic line repair ticket #SR-1182" },
  { id: "ev9", at: "11:05",         kind: "load",     assetId: "T-219",  msg: "Material rejected — wrong grade — credit pending" },
];

const FLEET_STATS = {
  total: ASSETS.length,
  moving:  ASSETS.filter(a => a.status === "moving").length,
  idle:    ASSETS.filter(a => a.status === "idle").length,
  shop:    ASSETS.filter(a => a.status === "shop").length,
  offline: ASSETS.filter(a => a.status === "offline").length,
  trucks:  ASSETS.filter(a => a.kind === "truck").length,
  equipment: ASSETS.filter(a => a.kind !== "truck").length,
  subs:    SUBCONTRACTORS.reduce((a, s) => a + s.crew, 0),
  subsCount: SUBCONTRACTORS.length,
};

window.FLEET_DATA = {
  MAP_BOUNDS, project, CITIES, JOB_SITES,
  ASSETS, ASSET_KIND, FLEET_WORKERS, SUBCONTRACTORS,
  FLEET_EVENTS, FLEET_STATS,
};
