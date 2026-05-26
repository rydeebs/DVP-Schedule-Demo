// Workers page fixture data — derived from the shared crew roster.

const WORKER_OFFICES = {
  paving: "Branchburg HQ",
  excavation: "East Yard",
  concrete: "Madison Office",
  milling: "South Shop",
  "field ops": "Dispatch Desk",
  striping: "West Yard",
  bench: "Branchburg HQ",
};

const WORKER_TONES = {
  work: "ok",
  office: "info",
  off: "info",
  pto: "warn",
  vacation: "warn",
  training: "info",
  shop: "info",
  sick: "stop",
};

const WORKER_STATUS_LABELS = {
  work: "WORK",
  office: "OFFICE",
  off: "OFF",
  pto: "PTO",
  vacation: "VAC",
  training: "TRN",
  shop: "SHOP",
  sick: "SICK",
};

const hashText = (text) => Array.from(String(text)).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

const D = window.DATA;
const JOBS_BY_ID = (D.ALL_JOBS || []).reduce((map, job) => {
  map[job.id] = job;
  return map;
}, {});
const CREWS_BY_ID = (D.INITIAL_CREWS || []).reduce((map, crew) => {
  map[crew.id] = crew;
  return map;
}, {});
const CREW_BY_WORKER_ID = (D.INITIAL_CREWS || []).reduce((map, crew) => {
  crew.workerIds.forEach((workerId) => {
    map[workerId] = crew.id;
  });
  return map;
}, {});

const OFFICE_SEQUENCE = [
  "Branchburg HQ",
  "Edison Office",
  "Madison Office",
  "South Shop",
  "East Yard",
  "West Yard",
  "Dispatch Desk",
];

const crewOfficeFor = (crew) => {
  if (!crew) return WORKER_OFFICES.bench;
  const div = String(crew.division || "").toLowerCase();
  if (div.includes("paving")) return WORKER_OFFICES.paving;
  if (div.includes("excav")) return WORKER_OFFICES.excavation;
  if (div.includes("concrete")) return WORKER_OFFICES.concrete;
  if (div.includes("milling")) return WORKER_OFFICES.milling;
  if (div.includes("striping")) return WORKER_OFFICES.striping;
  if (div.includes("field")) return WORKER_OFFICES["field ops"];
  return WORKER_OFFICES.bench;
};

const buildOverrides = (worker, crew) => {
  const seed = hashText(`${worker.name}:${worker.id}`);
  const vacation = new Set();
  const pto = new Set();
  const training = new Set();
  const shop = new Set();
  const sick = new Set();

  // Deterministic, but varied, fixture coverage across the week.
  if (seed % 5 === 0) vacation.add(4);
  if (seed % 7 === 0) vacation.add(5);
  if (seed % 6 === 0) pto.add(2);
  if (seed % 11 === 0) pto.add(3);
  if (seed % 8 === 0) training.add(1);
  if (!crew && seed % 4 === 0) shop.add(1);
  if (!crew && seed % 9 === 0) shop.add(3);
  if (worker.role === "foreman" && seed % 3 === 0) training.add(0);
  if (worker.role === "cdl driver" && seed % 10 === 0) sick.add(6);

  return { vacation, pto, training, shop, sick };
};

const dayKeyFor = (dayIndex) => D.WEEK_DAYS[dayIndex]?.key || "";

const buildScheduleEntry = ({ worker, crew, dayIndex, overrides }) => {
  const crewPlan = crew ? (D.WEEK_SCHEDULE[crew.id]?.[dayIndex] || []) : [];
  if (overrides.vacation.has(dayIndex)) {
    return {
      dayIndex,
      key: dayKeyFor(dayIndex),
      status: "vacation",
      label: WORKER_STATUS_LABELS.vacation,
      tone: WORKER_TONES.vacation,
      detail: "Vacation",
      hours: 0,
    };
  }
  if (overrides.pto.has(dayIndex)) {
    return {
      dayIndex,
      key: dayKeyFor(dayIndex),
      status: "pto",
      label: WORKER_STATUS_LABELS.pto,
      tone: WORKER_TONES.pto,
      detail: "Paid time off",
      hours: 0,
    };
  }
  if (overrides.training.has(dayIndex)) {
    return {
      dayIndex,
      key: dayKeyFor(dayIndex),
      status: "training",
      label: WORKER_STATUS_LABELS.training,
      tone: WORKER_TONES.training,
      detail: "Safety / skills training",
      hours: 0,
    };
  }
  if (overrides.sick.has(dayIndex)) {
    return {
      dayIndex,
      key: dayKeyFor(dayIndex),
      status: "sick",
      label: WORKER_STATUS_LABELS.sick,
      tone: WORKER_TONES.sick,
      detail: "Called out",
      hours: 0,
    };
  }
  if (crewPlan.length > 0) {
    const firstJob = JOBS_BY_ID[crewPlan[0].jobId];
    const totalHours = crewPlan.reduce((sum, item) => sum + (item.hours || 0), 0);
    const jobCodes = crewPlan.map((item) => JOBS_BY_ID[item.jobId]?.code).filter(Boolean);
    return {
      dayIndex,
      key: dayKeyFor(dayIndex),
      status: "work",
      label: WORKER_STATUS_LABELS.work,
      tone: WORKER_TONES.work,
      detail: `${firstJob?.code || "Scheduled"} · ${totalHours}h`,
      hours: totalHours,
      jobs: jobCodes,
    };
  }
  if (!crew) {
    if (overrides.shop.has(dayIndex)) {
      return {
        dayIndex,
        key: dayKeyFor(dayIndex),
        status: "shop",
        label: WORKER_STATUS_LABELS.shop,
        tone: WORKER_TONES.shop,
        detail: "Shop / yard",
        hours: 0,
      };
    }
    return {
      dayIndex,
      key: dayKeyFor(dayIndex),
      status: "off",
      label: WORKER_STATUS_LABELS.off,
      tone: WORKER_TONES.off,
      detail: "Available / off",
      hours: 0,
    };
  }
  return {
    dayIndex,
    key: dayKeyFor(dayIndex),
    status: "off",
    label: WORKER_STATUS_LABELS.off,
    tone: WORKER_TONES.off,
    detail: "No crew work",
    hours: 0,
  };
};

const buildWorkerRecord = (worker, index) => {
  const crewId = CREW_BY_WORKER_ID[worker.id] || null;
  const crew = crewId ? CREWS_BY_ID[crewId] : null;
  const office = crewOfficeFor(crew) || OFFICE_SEQUENCE[index % OFFICE_SEQUENCE.length];
  const overrides = buildOverrides(worker, crew);
  const schedule = D.WEEK_DAYS.map((_, dayIndex) => buildScheduleEntry({ worker, crew, dayIndex, overrides }));
  const statusCounts = schedule.reduce((counts, entry) => {
    counts[entry.status] = (counts[entry.status] || 0) + 1;
    return counts;
  }, {});
  const weekLoad = schedule.reduce((sum, entry) => sum + (entry.hours || 0), 0);
  const nextWork = schedule.find((entry) => entry.status === "work") || schedule.find((entry) => entry.status === "training") || schedule.find((entry) => entry.status !== "off") || schedule[0];
  const timeOffDays = schedule.filter((entry) => ["pto", "vacation", "sick"].includes(entry.status));
  const benchState = D.BENCH.find((b) => b.workerId === worker.id)?.state || null;

  return {
    id: worker.id,
    name: worker.name,
    init: worker.init,
    role: worker.role,
    crewId,
    crewName: crew?.name || null,
    foreman: crew?.foreman || null,
    division: crew?.division || "Bench / unassigned",
    office,
    officeKey: office.toLowerCase().replace(/\s+/g, "-"),
    state: benchState,
    schedule,
    scheduleStatus: schedule[2],
    weekLoad,
    statusCounts,
    timeOffDays,
    nextWork,
    crewJobs: crew ? Object.entries(D.WEEK_SCHEDULE[crew.id] || {}).flatMap(([dayIndex, items]) =>
      items.map((item) => ({
        dayIndex: Number(dayIndex),
        ...item,
        job: JOBS_BY_ID[item.jobId] || null,
      }))
    ) : [],
    crewSize: crew?.workerIds.length || 0,
    crewTruckCount: crew?.truckIds.length || 0,
    crewEquipment: crew?.equipment || [],
    isBench: !crewId,
    isAssigned: !!crewId,
    officeIndex: index,
  };
};

window.WORKERS_DATA = {
  OFFICES: OFFICE_SEQUENCE,
  WORKER_OFFICES,
  WORKER_STATUS_LABELS,
  WORKER_TONES,
  crewsById: CREWS_BY_ID,
  workers: (D.WORKERS || []).map(buildWorkerRecord),
};
