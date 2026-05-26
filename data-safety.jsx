// Safety fixture data — DVP Field Ops
// Compliance is the actual product purpose: who's certified, who's training,
// who got hurt, which policies are signed. Build for those questions, not "Add Document."

const CERT_TYPES = {
  osha30:   { id: "osha30",   name: "OSHA-30 Construction",     issuer: "OSHA",       validMonths: 60,  required: ["foreman","operator","cdl driver","laborer"], tone: "stop"  },
  osha10:   { id: "osha10",   name: "OSHA-10",                  issuer: "OSHA",       validMonths: 60,  required: ["laborer"],                                   tone: "warn"  },
  cdlA:     { id: "cdlA",     name: "CDL-A",                    issuer: "NJ MVC",     validMonths: 48,  required: ["cdl driver","operator"],                     tone: "stop"  },
  cdlB:     { id: "cdlB",     name: "CDL-B",                    issuer: "NJ MVC",     validMonths: 48,  required: [],                                            tone: "warn"  },
  flagger:  { id: "flagger",  name: "ATSSA Flagger",            issuer: "ATSSA",      validMonths: 48,  required: ["laborer"],                                   tone: "info"  },
  aci:      { id: "aci",      name: "ACI Concrete Field Tech",  issuer: "ACI",        validMonths: 60,  required: ["mason"],                                     tone: "info"  },
  heavyEq:  { id: "heavyEq",  name: "Heavy Equipment Operator", issuer: "DVP Internal", validMonths: 36, required: ["operator"],                                 tone: "warn"  },
  firstAid: { id: "firstAid", name: "First Aid / CPR",          issuer: "Red Cross",  validMonths: 24,  required: ["foreman"],                                   tone: "ok"    },
  tanker:   { id: "tanker",   name: "Tanker Endorsement",       issuer: "NJ MVC",     validMonths: 48,  required: [],                                            tone: "info"  },
  gpsGrade: { id: "gpsGrade", name: "GPS Grade Operator",       issuer: "Topcon",     validMonths: 36,  required: [],                                            tone: "info"  },
  silica:   { id: "silica",   name: "Silica Awareness",         issuer: "DVP Internal", validMonths: 12, required: ["operator","laborer","foreman"],             tone: "warn"  },
};

const WORKERS = [
  { id: "w01", init: "AV", name: "Aaron Vasquez",   role: "foreman",     crew: "Crew 14" },
  { id: "w02", init: "MD", name: "Mike Doherty",    role: "foreman",     crew: "Crew 22" },
  { id: "w03", init: "LD", name: "Luis Diaz",       role: "foreman",     crew: "Crew 07" },
  { id: "w04", init: "RP", name: "Raj Patel",       role: "foreman",     crew: "Crew 31" },
  { id: "w05", init: "CJ", name: "Cole Jenkins",    role: "foreman",     crew: "Crew 09" },
  { id: "w06", init: "HM", name: "Hector Morales",  role: "operator",    crew: "Crew 14" },
  { id: "w07", init: "TO", name: "Tommy O'Rourke",  role: "operator",    crew: "Crew 22" },
  { id: "w08", init: "DC", name: "Dwayne Carter",   role: "operator",    crew: "Crew 31" },
  { id: "w09", init: "EB", name: "Eli Brennan",     role: "laborer",     crew: "Crew 14" },
  { id: "w10", init: "SW", name: "Sam Whitford",    role: "laborer",     crew: "Crew 14" },
  { id: "w11", init: "MB", name: "Marcus Bell",     role: "laborer",     crew: "Crew 22" },
  { id: "w12", init: "PR", name: "Pedro Reyes",     role: "laborer",     crew: "Crew 22" },
  { id: "w13", init: "KB", name: "Kenny Boyle",     role: "cdl driver",  crew: "Crew 14" },
  { id: "w14", init: "RT", name: "Ricky Tran",      role: "cdl driver",  crew: "Crew 22" },
  { id: "w15", init: "JS", name: "Jorge Salinas",   role: "cdl driver",  crew: "Crew 31" },
  { id: "w16", init: "OP", name: "Owen Petrov",     role: "operator",    crew: "Crew 14" },
  { id: "w17", init: "BH", name: "Brandon Hayes",   role: "operator",    crew: "Crew 22" },
  { id: "w18", init: "MR", name: "Marco Russo",     role: "mason",       crew: "Crew 07" },
  { id: "w19", init: "DK", name: "Devon King",      role: "laborer",     crew: "Crew 07" },
  { id: "w20", init: "TN", name: "Trevor Nash",     role: "operator",    crew: "Crew 31" },
];

// Today = May 26, 2026
const TODAY = new Date(2026, 4, 26);
const daysFromToday = (iso) => Math.round((new Date(iso) - TODAY) / 86400000);

// Cert holdings — keyed by worker. Each entry has issued + expires + status derived from expires
// Some are expired, some expiring soon (the actually interesting cases for leadership).
const CERT_HOLDINGS = [
  // EXPIRED — block dispatch
  { id: "ch01", workerId: "w06", typeId: "cdlA",     issued: "2022-05-10", expires: "2026-05-09", note: "EXPIRED — Hector cannot operate haul truck"  },
  { id: "ch02", workerId: "w15", typeId: "osha30",   issued: "2021-04-15", expires: "2026-04-15", note: "EXPIRED — 41 days"                              },
  { id: "ch03", workerId: "w11", typeId: "silica",   issued: "2025-04-01", expires: "2026-04-01", note: "Annual refresher — EXPIRED"                     },

  // EXPIRING < 30 days — urgent
  { id: "ch10", workerId: "w01", typeId: "osha30",   issued: "2021-06-01", expires: "2026-06-01" },
  { id: "ch11", workerId: "w08", typeId: "cdlA",     issued: "2022-06-08", expires: "2026-06-08" },
  { id: "ch12", workerId: "w13", typeId: "tanker",   issued: "2022-06-12", expires: "2026-06-12" },
  { id: "ch13", workerId: "w03", typeId: "firstAid", issued: "2024-06-15", expires: "2026-06-15" },
  { id: "ch14", workerId: "w20", typeId: "heavyEq",  issued: "2023-06-22", expires: "2026-06-22" },
  { id: "ch15", workerId: "w16", typeId: "gpsGrade", issued: "2023-06-24", expires: "2026-06-24" },
  { id: "ch16", workerId: "w09", typeId: "silica",   issued: "2025-06-25", expires: "2026-06-25" },
  { id: "ch17", workerId: "w07", typeId: "cdlA",     issued: "2022-07-02", expires: "2026-07-02" },

  // EXPIRING 30–90 days
  { id: "ch20", workerId: "w02", typeId: "osha30",   issued: "2021-07-12", expires: "2026-07-12" },
  { id: "ch21", workerId: "w10", typeId: "flagger",  issued: "2022-07-20", expires: "2026-07-20" },
  { id: "ch22", workerId: "w17", typeId: "heavyEq",  issued: "2023-08-05", expires: "2026-08-05" },
  { id: "ch23", workerId: "w04", typeId: "firstAid", issued: "2024-08-12", expires: "2026-08-12" },

  // VALID (much further out)
  { id: "ch30", workerId: "w01", typeId: "cdlA",     issued: "2024-03-15", expires: "2028-03-15" },
  { id: "ch31", workerId: "w01", typeId: "firstAid", issued: "2025-09-01", expires: "2027-09-01" },
  { id: "ch32", workerId: "w02", typeId: "cdlA",     issued: "2023-10-04", expires: "2027-10-04" },
  { id: "ch33", workerId: "w02", typeId: "firstAid", issued: "2025-04-20", expires: "2027-04-20" },
  { id: "ch34", workerId: "w03", typeId: "osha30",   issued: "2023-02-15", expires: "2028-02-15" },
  { id: "ch35", workerId: "w03", typeId: "aci",      issued: "2024-01-10", expires: "2029-01-10" },
  { id: "ch36", workerId: "w04", typeId: "osha30",   issued: "2024-09-01", expires: "2029-09-01" },
  { id: "ch37", workerId: "w04", typeId: "cdlB",     issued: "2024-11-30", expires: "2028-11-30" },
  { id: "ch38", workerId: "w05", typeId: "osha10",   issued: "2025-02-04", expires: "2030-02-04" },
  { id: "ch39", workerId: "w06", typeId: "osha30",   issued: "2024-04-01", expires: "2029-04-01" },
  { id: "ch40", workerId: "w06", typeId: "heavyEq",  issued: "2024-09-12", expires: "2027-09-12" },
  { id: "ch41", workerId: "w08", typeId: "heavyEq",  issued: "2025-01-08", expires: "2028-01-08" },
  { id: "ch42", workerId: "w09", typeId: "osha10",   issued: "2024-09-10", expires: "2029-09-10" },
  { id: "ch43", workerId: "w10", typeId: "osha10",   issued: "2024-07-22", expires: "2029-07-22" },
  { id: "ch44", workerId: "w13", typeId: "cdlA",     issued: "2024-02-20", expires: "2028-02-20" },
  { id: "ch45", workerId: "w14", typeId: "cdlA",     issued: "2024-08-30", expires: "2028-08-30" },
  { id: "ch46", workerId: "w16", typeId: "osha30",   issued: "2023-10-15", expires: "2028-10-15" },
  { id: "ch47", workerId: "w18", typeId: "aci",      issued: "2024-12-01", expires: "2029-12-01" },
];

// Required training courses — % of workers complete
const TRAINING_COURSES = [
  { id: "tb1", name: "Weekly Toolbox — Heat illness",   issuer: "DVP Safety",   frequency: "weekly",  complete: 178, required: 184, lastWeek: 174 },
  { id: "tb2", name: "Weekly Toolbox — Trenching",      issuer: "DVP Safety",   frequency: "weekly",  complete: 181, required: 184, lastWeek: 179 },
  { id: "haz1",name: "HAZWOPER 8-hour refresher",       issuer: "OSHA",         frequency: "annual",  complete: 38,  required: 41,  lastWeek: 36  },
  { id: "frp", name: "Fall Protection",                 issuer: "DVP Safety",   frequency: "annual",  complete: 167, required: 184, lastWeek: 162 },
  { id: "lock",name: "Lockout / Tagout",                issuer: "DVP Safety",   frequency: "annual",  complete: 158, required: 184, lastWeek: 156 },
  { id: "wztc",name: "Work Zone Traffic Control",       issuer: "ATSSA",        frequency: "biennial",complete: 124, required: 184, lastWeek: 120 },
  { id: "hht", name: "Hand & Power Tools",              issuer: "DVP Safety",   frequency: "annual",  complete: 172, required: 184, lastWeek: 170 },
  { id: "respi",name:"Respiratory Protection Fit Test", issuer: "MedExpress",   frequency: "annual",  complete: 89,  required: 134, lastWeek: 84  },
];

// Recent incidents — pulled from the Forms incident report submissions.
const INCIDENTS = [
  { id: "in1", at: "2026-05-25T14:48", title: "Paver step injury",                     job: "P-2419", jobName: "Route 9 Resurfacing — Phase 2", crew: "Crew 14 — Vasquez", workerId: "w09", severity: "minor",  status: "investigating", investigatorId: "w19", note: "Slipped on paver step. Sprained wrist. No lost time. Investigation pending.", daysOpen: 1 },
  { id: "in2", at: "2026-05-24T11:30", title: "Truck reverse near-miss",               job: "M-1102", jobName: "GSP Exit 109 Mill",             crew: "Crew 31 — Patel",   workerId: "w08", severity: "near",   status: "investigating", investigatorId: "w19", note: "T-407 backed within 3' of laborer. Spotter not in position. Coaching delivered same day.", daysOpen: 2 },
  { id: "in3", at: "2026-05-21T09:15", title: "Laceration — sheet metal",              job: "X-1180", jobName: "Riverside Industrial Park",     crew: "Crew 22 — Doherty", workerId: "w11", severity: "minor",  status: "closed",        investigatorId: "w19", note: "8 stitches. Cause: improper PPE — gloves not Cut-A4. Glove spec updated company-wide.", daysOpen: 0, closedAt: "2026-05-22" },
  { id: "in4", at: "2026-05-15T13:00", title: "Heat exhaustion",                       job: "P-2401", jobName: "Wegmans Lot Re-pave — Phase 1", crew: "Crew 14 — Vasquez", workerId: "w10", severity: "minor",  status: "closed",        investigatorId: "w19", note: "Foreman pulled worker to shade. Hydrated. Cleared by EMT. Heat-illness toolbox rescheduled weekly through Sept.", daysOpen: 0, closedAt: "2026-05-17" },
  { id: "in5", at: "2026-05-08T07:45", title: "Equipment property damage",             job: "C-0742", jobName: "Madison Plaza — Curb & Gutter", crew: "Crew 07 — Diaz",    workerId: "w18", severity: "watch",  status: "closed",        investigatorId: "w19", note: "Form deck struck handrail backing out. $1,200 damage. No injury.", daysOpen: 0, closedAt: "2026-05-12" },
  { id: "in6", at: "2026-04-09T15:20", title: "Hot mix burn",                          job: "P-2412", jobName: "Costco Lot — North Section",    crew: "Crew 14 — Vasquez", workerId: "w12", severity: "stop",   status: "closed",        investigatorId: "w19", note: "RECORDABLE. Burn from spilled mix on boot. 3 days light duty. Hot-mix handling toolbox added.", daysOpen: 0, closedAt: "2026-04-15", recordable: true },
];

// Policies — written safety programs
const POLICIES = [
  { id: "p01", name: "Workplace Safety & Health Program", version: "2026.01", updated: "Jan 02, 2026", ackedCount: 184, requiredCount: 184, category: "Foundational" },
  { id: "p02", name: "Fall Protection Plan",              version: "2025.04", updated: "Apr 12, 2025", ackedCount: 172, requiredCount: 184, category: "Operational"  },
  { id: "p03", name: "Trenching & Excavation",            version: "2025.02", updated: "Feb 20, 2025", ackedCount: 165, requiredCount: 174, category: "Operational"  },
  { id: "p04", name: "Hot Asphalt Handling",              version: "2026.05", updated: "May 02, 2026", ackedCount: 142, requiredCount: 184, category: "Operational", new: true },
  { id: "p05", name: "Heat Illness Prevention",           version: "2025.06", updated: "Jun 01, 2025", ackedCount: 181, requiredCount: 184, category: "Seasonal"     },
  { id: "p06", name: "Hazard Communication",              version: "2024.11", updated: "Nov 15, 2024", ackedCount: 178, requiredCount: 184, category: "Foundational" },
  { id: "p07", name: "Drug & Alcohol Policy",             version: "2025.01", updated: "Jan 02, 2025", ackedCount: 184, requiredCount: 184, category: "HR"           },
  { id: "p08", name: "PPE Standard",                      version: "2026.02", updated: "Feb 10, 2026", ackedCount: 169, requiredCount: 184, category: "Foundational" },
];

const SAFETY_STATS = {
  daysSinceLast: 41,
  trirYtd: 1.2,
  trirPrior: 2.1,
  expiringSoon: 8,      // < 30 days
  expired: 3,
  trainingCompliance: 90,
  openInvestigations: 2,
  recordablesYtd: 1,
  recordablesPrior: 3,
  workersTotal: 184,
  // 6-month rolling
  monthly: [
    { m: "DEC", incidents: 0, recordable: 0 },
    { m: "JAN", incidents: 1, recordable: 0 },
    { m: "FEB", incidents: 2, recordable: 0 },
    { m: "MAR", incidents: 1, recordable: 0 },
    { m: "APR", incidents: 1, recordable: 1 },
    { m: "MAY", incidents: 5, recordable: 0 },
  ],
};

// Per-crew safety standings
const CREW_STANDINGS = [
  { crew: "Crew 14 — Vasquez",  daysSinceLast: 1,   trainingPct: 96, openInv: 1, ytdInc: 3, ytdRec: 1 },
  { crew: "Crew 22 — Doherty",  daysSinceLast: 5,   trainingPct: 92, openInv: 0, ytdInc: 2, ytdRec: 0 },
  { crew: "Crew 31 — Patel",    daysSinceLast: 2,   trainingPct: 88, openInv: 1, ytdInc: 2, ytdRec: 0 },
  { crew: "Crew 07 — Diaz",     daysSinceLast: 18,  trainingPct: 94, openInv: 0, ytdInc: 1, ytdRec: 0 },
  { crew: "Crew 09 — Jenkins",  daysSinceLast: 211, trainingPct: 98, openInv: 0, ytdInc: 0, ytdRec: 0 },
];

window.SAFETY_DATA = {
  CERT_TYPES, WORKERS, CERT_HOLDINGS, TRAINING_COURSES, INCIDENTS, POLICIES,
  SAFETY_STATS, CREW_STANDINGS, TODAY, daysFromToday,
};
