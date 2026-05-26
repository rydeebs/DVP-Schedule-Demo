// Customers fixture data — DVP Field Ops
// 25 realistic customers spanning Strategic / Active / Dormant / Lead tiers.

const TIERS = {
  strategic: { lbl: "STRATEGIC", tone: "signal", desc: "Top 10% by revenue · multi-year"      },
  active:    { lbl: "ACTIVE",    tone: "ok",     desc: "≥ 1 project in last 90 days"           },
  dormant:   { lbl: "DORMANT",   tone: "warn",   desc: "No project > 12 months"                },
  lead:      { lbl: "LEAD",      tone: "info",   desc: "Onboarded · no project yet"            },
};

const CUST_INDUSTRY = {
  gov:    "Government / DOT",
  retail: "Retail / Big Box",
  ind:    "Industrial / Logistics",
  re:     "Real Estate / Commercial",
  hosp:   "Hospitality",
  health: "Healthcare",
  edu:    "Education",
  trans:  "Transportation",
};

const SALES_REPS = {
  sr1: { init: "DM", name: "David Moore"      },
  sr2: { init: "PG", name: "Pat Gillespie"    },
  sr3: { init: "MN", name: "Maria Nguyen"     },
  sr4: { init: "TS", name: "Trent Schoenfeld" },
};

// Note on data: revenue numbers are realistic for a mid-size paving contractor;
// project counts come from the Projects fixture conceptually but are inlined here.
const CUSTOMERS = [
  // ─── STRATEGIC ───
  { id: "c01", name: "NJDOT",                       short: "NJDOT",      industry: "gov",   tier: "strategic", srId: "sr1", city: "Trenton",        state: "NJ", siteCount: 14, activeProjects: 3, pipelineProjects: 2, ytdRevenue: 4_280_000, ltv: 14_820_000, lastActivity: "12m ago",   netsuite: "CUST-001", note: "NJDOT 003-26 prime, 24-118 stripe sub" },
  { id: "c02", name: "NJ Turnpike Authority",       short: "NJTPK",      industry: "gov",   tier: "strategic", srId: "sr2", city: "Holmdel",        state: "NJ", siteCount:  8, activeProjects: 2, pipelineProjects: 1, ytdRevenue: 3_120_000, ltv: 11_400_000, lastActivity: "2h ago",    netsuite: "CUST-002", note: "GSP Exit 109 mill in progress" },
  { id: "c03", name: "Walmart Inc.",                short: "Walmart",    industry: "retail",tier: "strategic", srId: "sr1", city: "Cranbury",       state: "NJ", siteCount: 22, activeProjects: 1, pipelineProjects: 4, ytdRevenue: 2_140_000, ltv:  9_800_000, lastActivity: "1d ago",    netsuite: "CUST-003" },
  { id: "c04", name: "Costco Wholesale",            short: "Costco",     industry: "retail",tier: "strategic", srId: "sr4", city: "Brunswick",      state: "NJ", siteCount: 11, activeProjects: 2, pipelineProjects: 2, ytdRevenue: 1_840_000, ltv:  7_240_000, lastActivity: "5h ago",    netsuite: "CUST-004" },
  { id: "c05", name: "Amazon Logistics",            short: "Amazon",     industry: "ind",   tier: "strategic", srId: "sr4", city: "Robbinsville",   state: "NJ", siteCount: 17, activeProjects: 1, pipelineProjects: 2, ytdRevenue: 1_280_000, ltv:  5_120_000, lastActivity: "yesterday", netsuite: "CUST-005" },
  { id: "c06", name: "Wegmans Food Markets",        short: "Wegmans",    industry: "retail",tier: "strategic", srId: "sr1", city: "Bridgewater",    state: "NJ", siteCount:  9, activeProjects: 1, pipelineProjects: 1, ytdRevenue: 1_120_000, ltv:  4_980_000, lastActivity: "2d ago",    netsuite: "CUST-006" },

  // ─── ACTIVE ───
  { id: "c10", name: "Verizon Real Estate",         short: "Verizon",    industry: "re",    tier: "active",    srId: "sr3", city: "Basking Ridge",  state: "NJ", siteCount:  6, activeProjects: 1, pipelineProjects: 1, ytdRevenue:   612_000, ltv:  2_140_000, lastActivity: "3d ago",    netsuite: "CUST-014" },
  { id: "c11", name: "Hilton Worldwide",            short: "Hilton",     industry: "hosp",  tier: "active",    srId: "sr4", city: "Parsippany",     state: "NJ", siteCount: 12, activeProjects: 0, pipelineProjects: 2, ytdRevenue:   480_000, ltv:  1_820_000, lastActivity: "5d ago",    netsuite: "CUST-015" },
  { id: "c12", name: "Home Depot",                  short: "Home Depot", industry: "retail",tier: "active",    srId: "sr1", city: "Multi-site",     state: "—",  siteCount: 38, activeProjects: 0, pipelineProjects: 3, ytdRevenue:   384_000, ltv:  2_240_000, lastActivity: "yesterday", netsuite: "CUST-016" },
  { id: "c13", name: "FedEx Ground Corp",           short: "FedEx",      industry: "ind",   tier: "active",    srId: "sr2", city: "Multi-site",     state: "—",  siteCount: 14, activeProjects: 0, pipelineProjects: 1, ytdRevenue:   320_000, ltv:  1_640_000, lastActivity: "1w ago",    netsuite: "CUST-017" },
  { id: "c14", name: "Greenleaf Capital",           short: "Greenleaf",  industry: "re",    tier: "active",    srId: "sr1", city: "Edison",         state: "NJ", siteCount:  4, activeProjects: 1, pipelineProjects: 0, ytdRevenue:   612_000, ltv:    984_000, lastActivity: "today",     netsuite: "CUST-018" },
  { id: "c15", name: "Prologis",                    short: "Prologis",   industry: "ind",   tier: "active",    srId: "sr1", city: "Princeton",      state: "NJ", siteCount:  7, activeProjects: 0, pipelineProjects: 1, ytdRevenue:   384_000, ltv:  1_220_000, lastActivity: "4d ago",    netsuite: "CUST-019" },
  { id: "c16", name: "Madison Realty",              short: "Madison",    industry: "re",    tier: "active",    srId: "sr3", city: "Madison",        state: "NJ", siteCount:  3, activeProjects: 1, pipelineProjects: 0, ytdRevenue:   178_000, ltv:    422_000, lastActivity: "today",     netsuite: "CUST-020" },
  { id: "c17", name: "Related Companies",           short: "Related",    industry: "re",    tier: "active",    srId: "sr1", city: "Jersey City",    state: "NJ", siteCount:  2, activeProjects: 0, pipelineProjects: 1, ytdRevenue:   240_000, ltv:    240_000, lastActivity: "1w ago",    netsuite: "CUST-021" },
  { id: "c18", name: "Allied Properties",           short: "Allied",     industry: "re",    tier: "active",    srId: "sr4", city: "Christiana",     state: "DE", siteCount:  6, activeProjects: 0, pipelineProjects: 0, ytdRevenue:   142_000, ltv:    488_000, lastActivity: "2w ago",    netsuite: "CUST-022" },
  { id: "c19", name: "BET Investments Commercial",  short: "BET Inv.",   industry: "re",    tier: "active",    srId: "sr2", city: "Wynnewood",      state: "PA", siteCount:  4, activeProjects: 0, pipelineProjects: 0, ytdRevenue:    98_000, ltv:    312_000, lastActivity: "3w ago",    netsuite: "CUST-023" },

  // ─── DORMANT ───
  { id: "c30", name: "AION Management",             short: "AION",       industry: "re",    tier: "dormant",   srId: "sr3", city: "Wilmington",     state: "DE", siteCount:  3, activeProjects: 0, pipelineProjects: 0, ytdRevenue:         0, ltv:    240_000, lastActivity: "14m ago",   netsuite: "CUST-040", lastProject: "2024 Stonegate paving" },
  { id: "c31", name: "Acadia Reality Trust",        short: "Acadia",     industry: "re",    tier: "dormant",   srId: "sr1", city: "Plymouth",       state: "PA", siteCount:  2, activeProjects: 0, pipelineProjects: 0, ytdRevenue:         0, ltv:    180_000, lastActivity: "16m ago",   netsuite: "CUST-041", lastProject: "Market Square 2024" },
  { id: "c32", name: "BJ's Wholesale Club",         short: "BJ's",       industry: "retail",tier: "dormant",   srId: "sr4", city: "Lancaster",      state: "PA", siteCount:  4, activeProjects: 0, pipelineProjects: 0, ytdRevenue:         0, ltv:    312_000, lastActivity: "13m ago",   netsuite: "CUST-042", lastProject: "Lancaster curbside 2024" },
  { id: "c33", name: "Alterra Property Group",      short: "Alterra",    industry: "re",    tier: "dormant",   srId: "sr2", city: "Wilmington",     state: "DE", siteCount:  1, activeProjects: 0, pipelineProjects: 0, ytdRevenue:         0, ltv:     86_000, lastActivity: "18m ago",   netsuite: "CUST-043", lastProject: "Matus International 2024" },
  { id: "c34", name: "Hobby Lobby",                 short: "Hobby Lobby",industry: "retail",tier: "dormant",   srId: "sr1", city: "Dickson City",   state: "PA", siteCount:  1, activeProjects: 0, pipelineProjects: 0, ytdRevenue:         0, ltv:    142_000, lastActivity: "11m ago",   netsuite: "CUST-044", lastProject: "FY25 lot repair" },

  // ─── LEAD ───
  { id: "c50", name: "Carmel Plaza LLC",            short: "Carmel",     industry: "re",    tier: "lead",      srId: "sr2", city: "Somerset",       state: "NJ", siteCount:  1, activeProjects: 0, pipelineProjects: 1, ytdRevenue:         0, ltv:         0, lastActivity: "3d ago",    netsuite: "CUST-058", note: "RFP for site improvements — bid prep" },
  { id: "c51", name: "B&D Holdings",                short: "B&D",        industry: "retail",tier: "lead",      srId: "sr2", city: "Charlotte",      state: "NC", siteCount:  1, activeProjects: 0, pipelineProjects: 1, ytdRevenue:         0, ltv:         0, lastActivity: "today",     netsuite: "CUST-059", note: "Advance Auto Parts referral" },
  { id: "c52", name: "Bancroft Construction Co.",   short: "Bancroft",   industry: "re",    tier: "lead",      srId: "sr1", city: "Wilmington",     state: "DE", siteCount:  1, activeProjects: 0, pipelineProjects: 0, ytdRevenue:         0, ltv:         0, lastActivity: "1w ago",    netsuite: "CUST-060", note: "Gilpin Ave Multi-family — bid declined" },
];

// Per-customer contacts — surfaced inside the detail drawer (no separate Contacts tab)
const CONTACTS = {
  c01: [
    { id: "k01", name: "Robert Mendoza",     title: "Project Engineer — Region 1", phone: "609-530-2280", email: "r.mendoza@dot.nj.gov", primary: true },
    { id: "k02", name: "Patricia Hwang",     title: "Resident Engineer",            phone: "609-530-4118", email: "p.hwang@dot.nj.gov" },
    { id: "k03", name: "Mike Calabrese",     title: "Construction Supervisor",      phone: "609-530-3992", email: "m.calabrese@dot.nj.gov" },
  ],
  c02: [
    { id: "k10", name: "Diane Reilly",       title: "Maintenance Engineer",         phone: "732-247-0900", email: "dreilly@njta.com",      primary: true },
    { id: "k11", name: "Tom Sokol",          title: "Asst. Engineer",               phone: "732-247-0944", email: "tsokol@njta.com" },
  ],
  c03: [
    { id: "k20", name: "Sandra Whitfield",   title: "Real Estate Manager — NE",     phone: "479-273-1180", email: "sandra.whitfield@walmart.com", primary: true },
    { id: "k21", name: "Greg Antoniou",      title: "Facilities — Region 3",        phone: "479-273-1244", email: "g.antoniou@walmart.com" },
  ],
  c04: [
    { id: "k30", name: "Hector Wright",      title: "Regional Construction",        phone: "732-560-7220", email: "h.wright@costco.com",   primary: true },
  ],
  c05: [
    { id: "k40", name: "Linda Park",         title: "Site Operations · BWI4",       phone: "609-225-1814", email: "lindapark@amazon.com",  primary: true },
    { id: "k41", name: "Marco Pellegrini",   title: "Property Manager — NE",        phone: "609-225-1820", email: "marcop@amazon.com" },
  ],
  c10: [
    { id: "k50", name: "Anita Krishnamurthy",title: "Real Estate Manager",          phone: "908-559-2810", email: "a.krishnamurthy@verizon.com", primary: true },
  ],
  c16: [
    { id: "k60", name: "Adam Goldstein",     title: "Director of Development",      phone: "973-549-1100", email: "agoldstein@madisonrealty.com", primary: true },
  ],
};

// Recent activity per customer
const ACTIVITY = {
  c01: [
    { at: "12m ago",  kind: "email",    msg: "Reply on Route 9 punch list from Robert Mendoza" },
    { at: "yesterday",kind: "call",     msg: "Pat Gillespie called Patricia Hwang re: 24-118 stripe schedule" },
    { at: "3d ago",   kind: "doc",      msg: "Change Order #003 signed — $14.2k over base" },
    { at: "1w ago",   kind: "meeting",  msg: "Pre-bid walk — Route 1 milling Phase 2" },
  ],
  c02: [
    { at: "2h ago",   kind: "email",    msg: "Diane Reilly confirmed night mill schedule for Exit 109" },
    { at: "2d ago",   kind: "doc",      msg: "COI re-issued for 2026 calendar year" },
  ],
  c05: [
    { at: "yesterday",kind: "form",     msg: "Incident report filed at BWI4 — minor, no lost time" },
    { at: "2d ago",   kind: "meeting",  msg: "Walkthrough for Q3 maintenance pipeline" },
  ],
  c14: [
    { at: "today",    kind: "form",     msg: "Daily report submitted — Riverside Park pad cut day 6" },
    { at: "today",    kind: "doc",      msg: "Spoils ticket #14823 reconciled" },
  ],
  c16: [
    { at: "today",    kind: "form",     msg: "Daily report — Madison Plaza bay 4 pour scheduled tomorrow" },
  ],
};

// Lightweight stats for the hero strip
const CUST_STATS = {
  totalCustomers: CUSTOMERS.length,
  strategic: CUSTOMERS.filter(c => c.tier === "strategic").length,
  active:    CUSTOMERS.filter(c => c.tier === "active").length,
  dormant:   CUSTOMERS.filter(c => c.tier === "dormant").length,
  lead:      CUSTOMERS.filter(c => c.tier === "lead").length,
  totalYtdRevenue: CUSTOMERS.reduce((a, c) => a + c.ytdRevenue, 0),
  totalLtv:        CUSTOMERS.reduce((a, c) => a + c.ltv, 0),
  totalActiveProjects:   CUSTOMERS.reduce((a, c) => a + c.activeProjects, 0),
  totalPipelineProjects: CUSTOMERS.reduce((a, c) => a + c.pipelineProjects, 0),
};

const fmtMoney = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1000)}k`;
  if (n > 0)          return `$${n.toLocaleString()}`;
  return "—";
};

window.CUST_DATA = {
  TIERS, CUST_INDUSTRY, SALES_REPS,
  CUSTOMERS, CONTACTS, ACTIVITY,
  CUST_STATS, fmtMoney,
};
