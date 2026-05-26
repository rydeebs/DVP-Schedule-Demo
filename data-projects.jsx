// Projects fixture data — DVP Field Ops
// 6 pipeline stages, ~36 projects with realistic values + dates + geographic spread

const STAGES = [
  { key: "lead",      label: "Lead",          tone: "info",   desc: "Just inquired"            },
  { key: "bidding",   label: "Bidding",       tone: "warn",   desc: "Estimating + bid prep"    },
  { key: "awarded",   label: "Awarded",       tone: "ok",     desc: "Contract signed"          },
  { key: "scheduled", label: "Scheduled",     tone: "ok",     desc: "Permits + crew lined up"  },
  { key: "active",    label: "In progress",   tone: "signal", desc: "Crew on site"             },
  { key: "closed",    label: "Closed",        tone: "done",   desc: "Last 30 days · invoiced" },
];

const PEOPLE = {
  // Sales reps
  sr1: { init: "DM", name: "David Moore",      role: "Sales" },
  sr2: { init: "PG", name: "Pat Gillespie",    role: "Sales" },
  sr3: { init: "MN", name: "Maria Nguyen",     role: "Sales" },
  sr4: { init: "TS", name: "Trent Schoenfeld", role: "Sales" },
  // Project managers
  pm1: { init: "CH", name: "Charles Hurst",    role: "PM" },
  pm2: { init: "KF", name: "Kyle Faggioli",    role: "PM" },
  pm3: { init: "SP", name: "Sara Pham",        role: "PM" },
  pm4: { init: "RB", name: "Riley Brennan",    role: "PM" },
  pm5: { init: "AE", name: "Alex Ehrmann",     role: "PM" },
};

// Realistic NJ/PA/NY paving + excavation projects with proper amounts
const PROJECTS = [
  // ─── LEAD ───
  { id: "p001", code: "PROJ14017", customer: "Home Depot",            name: "HD Maintenance — Hackensack",         city: "Hackensack",     state: "NJ", type: "paving",  stage: "lead",      value:  84_000, srId: "sr1", pmId: null,  status: "Not Confirmed, Customer Informed", createdAt: "2026-05-22", startAt: null,         endAt: null,         x: 80, y: 30, contract: false },
  { id: "p002", code: "PROJ12631", customer: "Home Depot",            name: "HD Capital — Birmingham",             city: "Birmingham",     state: "AL", type: "paving",  stage: "lead",      value: 210_000, srId: "sr3", pmId: null,  status: "Not Confirmed, Customer Informed", createdAt: "2026-05-20", startAt: null,         endAt: null,         x: 35, y: 78, contract: false },
  { id: "p003", code: "PROJ12241", customer: "B&D Holdings",          name: "Advance Auto Parts — Charlotte",      city: "Charlotte",      state: "NC", type: "paving",  stage: "lead",      value: 142_000, srId: "sr2", pmId: null,  status: "Not Confirmed, Customer Informed", createdAt: "2026-05-19", startAt: null,         endAt: null,         x: 56, y: 70, contract: false },
  { id: "p004", code: "PROJ14116", customer: "Wegmans Food Markets",  name: "Wegmans Lot Re-pave — Phase 2",       city: "Bridgewater",    state: "NJ", type: "paving",  stage: "lead",      value: 380_000, srId: "sr1", pmId: null,  status: "Not Confirmed, Customer Informed", createdAt: "2026-05-18", startAt: null,         endAt: null,         x: 60, y: 42, contract: false },
  { id: "p005", code: "PROJ14118", customer: "Costco Wholesale",      name: "Costco Lot — North Section",          city: "Brunswick",      state: "NJ", type: "paving",  stage: "lead",      value: 290_000, srId: "sr4", pmId: null,  status: "Not Confirmed, Customer Informed", createdAt: "2026-05-15", startAt: null,         endAt: null,         x: 70, y: 46, contract: false },

  // ─── BIDDING ───
  { id: "p010", code: "PROJ13986", customer: "Carmel Plaza LLC",      name: "Site Improvements — 645 Howard Ave",  city: "Somerset",       state: "NJ", type: "paving",  stage: "bidding",   value: 480_000, srId: "sr2", pmId: "pm2", status: "Bid Due 06/02", createdAt: "2026-05-10", startAt: null,         endAt: null,         x: 64, y: 46, contract: false, bidDue: "2026-06-02" },
  { id: "p011", code: "PROJ13912", customer: "NJDOT",                 name: "Route 9 Resurfacing — Phase 3",       city: "Old Bridge",     state: "NJ", type: "paving",  stage: "bidding",   value: 2_140_000,srId:"sr1", pmId: "pm1", status: "Bid Due 06/12", createdAt: "2026-05-08", startAt: null,         endAt: null,         x: 76, y: 50, contract: false, bidDue: "2026-06-12" },
  { id: "p012", code: "PROJ13880", customer: "Verizon Real Estate",   name: "Driveway Overlay — 2026",             city: "Basking Ridge",  state: "NJ", type: "paving",  stage: "bidding",   value: 145_000, srId: "sr3", pmId: "pm3", status: "Awaiting bid review", createdAt: "2026-05-05", startAt: null,         endAt: null,         x: 65, y: 36, contract: false },
  { id: "p013", code: "PROJ13854", customer: "Amazon Logistics",      name: "BWI4 — Dock Apron Patch",             city: "Robbinsville",   state: "NJ", type: "repair",  stage: "bidding",   value:  62_000, srId: "sr4", pmId: "pm5", status: "Bid Due 05/30", createdAt: "2026-05-02", startAt: null,         endAt: null,         x: 60, y: 60, contract: false, bidDue: "2026-05-30" },
  { id: "p014", code: "PROJ13821", customer: "Prologis",              name: "Princeton Logistics — Site Prep",     city: "Princeton",      state: "NJ", type: "excav",   stage: "bidding",   value: 920_000, srId: "sr1", pmId: "pm4", status: "Awaiting bid review", createdAt: "2026-04-28", startAt: null,         endAt: null,         x: 56, y: 56, contract: false },
  { id: "p015", code: "PROJ13770", customer: "NJ Turnpike Authority", name: "Exit 11 Reconstruction",              city: "Edison",         state: "NJ", type: "paving",  stage: "bidding",   value: 4_280_000,srId:"sr2", pmId: "pm1", status: "Bid Due 06/20", createdAt: "2026-04-22", startAt: null,         endAt: null,         x: 72, y: 44, contract: false, bidDue: "2026-06-20" },

  // ─── AWARDED ───
  { id: "p020", code: "PROJ13710", customer: "Madison Realty",        name: "Madison Plaza — Curb & Gutter",       city: "Madison",        state: "NJ", type: "conc",    stage: "awarded",   value: 178_000, srId: "sr3", pmId: "pm3", status: "Contract signed", createdAt: "2026-04-12", startAt: "2026-06-02", endAt: "2026-07-08", x: 73, y: 30, contract: true },
  { id: "p021", code: "PROJ13694", customer: "Greenleaf Capital",     name: "Riverside Park — Pad Cut",            city: "Edison",         state: "NJ", type: "excav",   stage: "awarded",   value: 612_000, srId: "sr1", pmId: "pm4", status: "Contract signed", createdAt: "2026-04-05", startAt: "2026-05-25", endAt: "2026-08-12", x: 72, y: 44, contract: true },
  { id: "p022", code: "PROJ13680", customer: "Hilton Worldwide",      name: "Hampton Inn — ADA Ramp Pour",         city: "Parsippany",     state: "NJ", type: "conc",    stage: "awarded",   value:  44_000, srId: "sr4", pmId: "pm5", status: "Contract signed", createdAt: "2026-04-02", startAt: "2026-06-09", endAt: "2026-06-15", x: 72, y: 28, contract: true },
  { id: "p023", code: "PROJ13651", customer: "FedEx Ground Corp",     name: "FY25 Lot Repairs — Dallas",           city: "Dallas",         state: "TX", type: "paving",  stage: "awarded",   value: 380_000, srId: "sr2", pmId: "pm2", status: "Contract signed", createdAt: "2026-03-28", startAt: "2026-07-01", endAt: "2026-08-30", x: 22, y: 80, contract: true },

  // ─── SCHEDULED ───
  { id: "p030", code: "PROJ13510", customer: "Walmart Inc.",          name: "Walmart DC — Mill & Inlay Test",      city: "Cranbury",       state: "NJ", type: "mill",    stage: "scheduled", value: 940_000, srId: "sr1", pmId: "pm1", status: "Permits in place", createdAt: "2026-03-15", startAt: "2026-06-04", endAt: "2026-06-18", x: 62, y: 52, contract: true },
  { id: "p031", code: "PROJ13495", customer: "NJDOT",                 name: "Pre-mill Sweep & Sawcut · Rte 1",     city: "New Brunswick",  state: "NJ", type: "prep",    stage: "scheduled", value:  85_000, srId: "sr2", pmId: "pm3", status: "Lane closure approved", createdAt: "2026-03-10", startAt: "2026-05-29", endAt: "2026-05-30", x: 70, y: 46, contract: true },
  { id: "p032", code: "PROJ13482", customer: "NJDOT",                 name: "Striping — DOT Bid 24-118",           city: "Trenton",        state: "NJ", type: "stripe",  stage: "scheduled", value: 124_000, srId: "sr3", pmId: "pm5", status: "Materials ordered", createdAt: "2026-03-05", startAt: "2026-06-05", endAt: "2026-06-06", x: 50, y: 62, contract: true },
  { id: "p033", code: "PROJ13441", customer: "Costco Wholesale",      name: "Costco Lot — South Section · Night",  city: "Brunswick",      state: "NJ", type: "paving",  stage: "scheduled", value: 224_000, srId: "sr4", pmId: "pm2", status: "Permits in place", createdAt: "2026-02-28", startAt: "2026-05-27", endAt: "2026-05-28", x: 70, y: 47, contract: true, night: true },
  { id: "p034", code: "PROJ13390", customer: "Related Companies",     name: "Hudson Yards Lot 8 — Stripping",      city: "Jersey City",    state: "NJ", type: "excav",   stage: "scheduled", value:1_220_000, srId: "sr1", pmId: "pm4", status: "Permits in place", createdAt: "2026-02-20", startAt: "2026-06-10", endAt: "2026-07-25", x: 85, y: 28, contract: true },

  // ─── ACTIVE / IN PROGRESS ───
  { id: "p040", code: "PROJ13288", customer: "NJDOT",                 name: "Route 9 Resurfacing — Phase 2",       city: "Old Bridge",     state: "NJ", type: "paving",  stage: "active",    value: 1_820_000, srId: "sr1", pmId: "pm1", status: "63% complete · on schedule", createdAt: "2026-02-01", startAt: "2026-04-14", endAt: "2026-06-08", x: 76, y: 50, contract: true, pctComplete: 63 },
  { id: "p041", code: "PROJ13270", customer: "Greenleaf Capital",     name: "Riverside Industrial — Pad Cut",      city: "Edison",         state: "NJ", type: "excav",   stage: "active",    value:   612_000, srId: "sr1", pmId: "pm4", status: "41% complete · 2d behind", createdAt: "2026-01-28", startAt: "2026-05-25", endAt: "2026-08-12", x: 72, y: 44, contract: true, pctComplete: 41, late: true },
  { id: "p042", code: "PROJ13255", customer: "NJ Turnpike Authority", name: "GSP Exit 109 — Mill",                 city: "Holmdel",        state: "NJ", type: "mill",    stage: "active",    value: 1_240_000, srId: "sr2", pmId: "pm1", status: "Night mill · 78% complete", createdAt: "2026-01-22", startAt: "2026-05-12", endAt: "2026-06-04", x: 80, y: 56, contract: true, pctComplete: 78, night: true },
  { id: "p043", code: "PROJ13241", customer: "Madison Realty",        name: "Madison Plaza — Curb & Gutter",       city: "Madison",        state: "NJ", type: "conc",    stage: "active",    value:   178_000, srId: "sr3", pmId: "pm3", status: "Bay 3 cured · bay 4 prep", createdAt: "2026-01-18", startAt: "2026-05-22", endAt: "2026-06-15", x: 73, y: 30, contract: true, pctComplete: 22 },
  { id: "p044", code: "PROJ13220", customer: "Amazon Logistics",      name: "BWI4 — Dock Apron Patch",             city: "Robbinsville",   state: "NJ", type: "repair",  stage: "active",    value:    62_000, srId: "sr4", pmId: "pm5", status: "94% complete · punch list", createdAt: "2026-01-12", startAt: "2026-05-20", endAt: "2026-05-29", x: 60, y: 60, contract: true, pctComplete: 94 },
  { id: "p045", code: "PROJ13208", customer: "Wegmans Food Markets",  name: "Wegmans Lot Re-pave — Phase 1",       city: "Bridgewater",    state: "NJ", type: "paving",  stage: "active",    value:   720_000, srId: "sr1", pmId: "pm2", status: "Final punch list", createdAt: "2026-01-08", startAt: "2026-05-04", endAt: "2026-05-28", x: 60, y: 42, contract: true, pctComplete: 96 },

  // ─── CLOSED ───
  { id: "p050", code: "PROJ13110", customer: "Costco Wholesale",      name: "Costco Lot — North Section",          city: "Brunswick",      state: "NJ", type: "paving",  stage: "closed",    value:   245_000, srId: "sr4", pmId: "pm2", status: "Invoiced · awaiting payment", createdAt: "2025-11-10", startAt: "2026-04-08", endAt: "2026-04-30", x: 70, y: 46, contract: true, pctComplete: 100, closedAt: "2026-05-10" },
  { id: "p051", code: "PROJ13088", customer: "NJDOT",                 name: "Route 1 Pre-mill — Phase 2",          city: "New Brunswick",  state: "NJ", type: "prep",    stage: "closed",    value:    78_000, srId: "sr2", pmId: "pm3", status: "Paid", createdAt: "2025-10-22", startAt: "2026-03-15", endAt: "2026-04-18", x: 70, y: 46, contract: true, pctComplete: 100, closedAt: "2026-05-04" },
  { id: "p052", code: "PROJ13062", customer: "Hilton Worldwide",      name: "Hampton Inn — Lot Re-stripe",         city: "Parsippany",     state: "NJ", type: "stripe",  stage: "closed",    value:    34_000, srId: "sr4", pmId: "pm5", status: "Paid", createdAt: "2025-10-15", startAt: "2026-04-22", endAt: "2026-04-23", x: 72, y: 28, contract: true, pctComplete: 100, closedAt: "2026-05-02" },
  { id: "p053", code: "PROJ13040", customer: "Prologis",              name: "Princeton Logistics — Bid Phase",     city: "Princeton",      state: "NJ", type: "paving",  stage: "closed",    value:   384_000, srId: "sr1", pmId: "pm4", status: "Invoiced · awaiting payment", createdAt: "2025-09-30", startAt: "2026-03-08", endAt: "2026-04-15", x: 56, y: 56, contract: true, pctComplete: 100, closedAt: "2026-04-28" },
  { id: "p054", code: "PROJ13002", customer: "Verizon Real Estate",   name: "Verizon Campus — North Driveway",     city: "Basking Ridge",  state: "NJ", type: "paving",  stage: "closed",    value:   188_000, srId: "sr3", pmId: "pm3", status: "Paid", createdAt: "2025-09-08", startAt: "2026-03-02", endAt: "2026-03-22", x: 65, y: 36, contract: true, pctComplete: 100, closedAt: "2026-04-20" },
];

const TYPE_INFO = {
  paving: { lbl: "PAVING",     tone: "ok"   },
  excav:  { lbl: "EXCAVATION", tone: "warn" },
  mill:   { lbl: "MILLING",    tone: "info" },
  conc:   { lbl: "CONCRETE",   tone: "info" },
  stripe: { lbl: "STRIPING",   tone: "ok"   },
  prep:   { lbl: "PREP",       tone: "warn" },
  repair: { lbl: "REPAIR",     tone: "stop" },
};

// Win-probability weights for forecasting
const STAGE_WEIGHT = {
  lead: 0.10, bidding: 0.30, awarded: 0.85,
  scheduled: 0.95, active: 1.0, closed: 1.0,
};

const fmtMoney = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1000)}k`;
  return `$${n.toLocaleString()}`;
};

window.PROJ_DATA = {
  STAGES, PEOPLE, PROJECTS, TYPE_INFO, STAGE_WEIGHT, fmtMoney,
};
