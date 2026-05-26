// Files surface — recent-activity-first IA, drag-and-drop upload
// Continues the Industrial Utilitarian system established in design-system.md

const { useState: fUseState, useEffect: fUseEffect, useMemo: fUseMemo, useRef: fUseRef, useCallback: fUseCallback } = React;

/* ──────────────────── Icons (added for files) ──────────────────── */
const FIcons = {
  FilePdf:    (p) => <Ico {...p} d={["M14 3H6v18h12V7l-4-4Z","M14 3v4h4","M9 13h6","M9 17h4"]} />,
  FilePhoto:  (p) => <Ico {...p} d={["M3 5h18v14H3z","M3 17l5-5 4 4 3-3 6 6","M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]} />,
  FileDwg:    (p) => <Ico {...p} d={["M4 6h16v12H4z","M4 6l16 12","M20 6L4 18"]} />,
  FileSheet:  (p) => <Ico {...p} d={["M4 4h16v16H4z","M4 9h16","M4 14h16","M9 4v16","M15 4v16"]} />,
  FileMail:   (p) => <Ico {...p} d={["M3 5h18v14H3z","M3 5l9 7 9-7"]} />,
  FileBadge:  (p) => <Ico {...p} d={["M12 2 4 6v6c0 5 8 10 8 10s8-5 8-10V6l-8-4Z","M9 12l2 2 4-4"]} />,
  FileWarn:   (p) => <Ico {...p} d={["M14 3H6v18h12V7l-4-4Z","M14 3v4h4","M12 11v4","M12 18v.01"]} />,
  FileText:   (p) => <Ico {...p} d={["M14 3H6v18h12V7l-4-4Z","M14 3v4h4","M9 13h6","M9 17h6"]} />,
  Upload:     (p) => <Ico {...p} d={["M4 17v3h16v-3","M12 14V4","M7 9l5-5 5 5"]} />,
  Folder:     (p) => <Ico {...p} d={["M3 6h6l2 2h10v11H3z"]} />,
  Grid:       (p) => <Ico {...p} d={["M3 3h8v8H3z","M13 3h8v8h-8z","M3 13h8v8H3z","M13 13h8v8h-8z"]} />,
  List:       (p) => <Ico {...p} d={["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"]} />,
  Download:   (p) => <Ico {...p} d={["M4 17v3h16v-3","M12 4v10","M7 9l5 5 5-5"]} />,
  Trash:      (p) => <Ico {...p} d={["M3 6h18","M8 6V4h8v2","M6 6l1 14h10l1-14","M10 11v5","M14 11v5"]} />,
  Share:      (p) => <Ico {...p} d={["M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M8.6 13.5l6.8 4","M15.4 6.5l-6.8 4"]} />,
  X:          (p) => <Ico {...p} d={["M6 6l12 12","M18 6L6 18"]} />,
  Eye:        (p) => <Ico {...p} d={["M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} />,
};

function kindIcon(kind, size = 16) {
  const map = {
    pdf:      FIcons.FilePdf,
    report:   FIcons.FileText,
    contract: FIcons.FileText,
    permit:   FIcons.FileBadge,
    invoice:  FIcons.FilePdf,
    sheet:    FIcons.FileSheet,
    safety:   FIcons.FileWarn,
    email:    FIcons.FileMail,
    dwg:      FIcons.FileDwg,
    photo:    FIcons.FilePhoto,
  };
  const I = map[kind] || FIcons.FileText;
  return <I size={size} />;
}

/* ──────────────────── Tile primitives ──────────────────── */
function FileTile({ file, onSelect, selected, onDelete }) {
  const D = window.FILES_DATA;
  const kind = D.FILE_KIND[file.kind];
  const user = D.FILE_USERS[file.uploadedBy] || { init: "??", name: "—" };
  const ext = (file.ext || "").toUpperCase();
  const showThumbExt = file.kind !== "photo";

  return (
    <article
      className={`f-tile k-${file.kind} ${selected ? "selected" : ""} ${file.uploading ? "uploading" : ""} ${file.error ? "error" : ""}`}
      onClick={() => onSelect?.(file.id)}
    >
      <div className="f-tile-thumb">
        <div className="f-tile-kindpill"><StatusPill variant={kind?.tone || "info"}>{kind?.label || "FILE"}</StatusPill></div>
        {showThumbExt && <span className="ext">{ext}</span>}
        {file.kind === "photo" && (
          <>
            <span className="iso">{file.size}</span>
            {file.caption && <span className="caption">{file.caption}</span>}
          </>
        )}
      </div>
      <div className="f-tile-body">
        <div className="f-tile-name" title={file.name}>{file.name}</div>
        <div className="f-tile-meta">
          <span>{file.size}</span>
          <span className="sep">·</span>
          <span>{file.relAge || "just now"}</span>
        </div>
        <div className="f-tile-meta">
          <span className="by">
            <span className="av">{user.init}</span>
            {user.name.split(" ")[0]} {user.name.split(" ")[1]?.[0]}.
          </span>
        </div>
      </div>
      {file.flag && (
        <div className={`f-tile-flag flag-${file.flag}`}>
          <Icons.AlertTri size={10} />
          {file.flagNote || "FLAGGED"}
        </div>
      )}
      {file.uploading && (
        <div className="f-tile-progress">
          <div className="bar" style={{ width: `${file.progress || 0}%` }}></div>
        </div>
      )}
    </article>
  );
}

function FileListRow({ file, onSelect, selected, head }) {
  const D = window.FILES_DATA;
  if (head) {
    return (
      <div className="f-list-row head">
        <span></span>
        <span>NAME</span>
        <span>TYPE</span>
        <span>UPLOADED BY</span>
        <span>SIZE</span>
        <span>AGE</span>
        <span></span>
      </div>
    );
  }
  const kind = D.FILE_KIND[file.kind];
  const user = D.FILE_USERS[file.uploadedBy] || { init: "??", name: "—" };
  return (
    <div className={`f-list-row ${selected ? "selected" : ""}`} onClick={() => onSelect?.(file.id)}>
      <span className="ki">{kindIcon(file.kind, 14)}</span>
      <span className="nm-cell">{file.name}</span>
      <span><StatusPill variant={kind?.tone || "info"}>{kind?.label}</StatusPill></span>
      <span className="by-cell">{user.name}</span>
      <span style={{ textAlign: "right", color: "var(--ink-0)" }}>{file.size}</span>
      <span>{file.relAge}</span>
      <span><Icons.ChevR size={12} /></span>
    </div>
  );
}

/* ──────────────────── Left rail ──────────────────── */
function FilesRail({ selectedJobId, onSelect, filter, onFilter }) {
  const D = window.FILES_DATA;
  const [query, setQuery] = fUseState("");
  const [tab, setTab] = fUseState("with"); // with | recent | flagged | mine

  let list = D.FILE_JOBS;
  if (tab === "recent") list = [...D.FILE_JOBS].sort((a, b) => b.lastUploadIso.localeCompare(a.lastUploadIso));
  if (tab === "flagged") list = D.FILE_JOBS.filter(j => j.flagged > 0);
  if (tab === "mine") list = D.FILE_JOBS.filter(j => ["j01","j02","j03"].includes(j.id));
  if (query) list = list.filter(j =>
    j.name.toLowerCase().includes(query.toLowerCase()) ||
    j.code.toLowerCase().includes(query.toLowerCase()) ||
    j.customer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="f-rail">
      <div className="f-rail-hdr">
        <div className="h">
          <span>Jobs with files</span>
          <span className="c">{list.length} of {D.FILE_JOBS.length}</span>
        </div>
        <div className="f-rail-search">
          <Icons.Search size={12} />
          <input
            placeholder="Find by code, customer, location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>⌘F</span>
        </div>
      </div>
      <div className="f-rail-tabs">
        {[
          { key: "with",    label: "WITH FILES", cnt: D.FILE_JOBS.length },
          { key: "recent",  label: "RECENT",     cnt: D.FILE_JOBS.filter(j => j.lastUpload.includes("ago") || j.lastUpload === "yesterday").length },
          { key: "flagged", label: "FLAGGED",    cnt: D.FILE_JOBS.filter(j => j.flagged > 0).length },
          { key: "mine",    label: "MINE",       cnt: 3 },
        ].map(t => (
          <button key={t.key} className={`f-rail-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}<span className="cnt">{t.cnt}</span>
          </button>
        ))}
      </div>
      <div className="f-rail-scroll">
        {list.map(j => (
          <FilesRailJob
            key={j.id} job={j}
            selected={j.id === selectedJobId}
            onSelect={() => onSelect(j.id)}
          />
        ))}
        <button className="f-collapsed" onClick={() => alert("Would expand: 5,302 jobs with no files")}>
          + SHOW <span className="num">5,302</span> JOBS WITH NO FILES
        </button>
      </div>
    </aside>
  );
}

function FilesRailJob({ job, selected, onSelect }) {
  // Tiny segmented "typebar" — relative file-type composition as colored ticks
  const D = window.FILES_DATA;
  const ticks = [
    { kind: "photo",    n: job.photos },
    { kind: "report",   n: Math.max(0, Math.floor(job.files * 0.08)) },
    { kind: "contract", n: Math.max(0, Math.floor(job.files * 0.04)) },
    { kind: "permit",   n: Math.max(0, Math.floor(job.files * 0.03)) },
    { kind: "dwg",      n: Math.max(0, Math.floor(job.files * 0.06)) },
    { kind: "other",    n: Math.max(0, job.files - job.photos - Math.floor(job.files * 0.21)) },
  ].filter(t => t.n > 0);
  const total = ticks.reduce((a, t) => a + t.n, 0) || 1;
  const tickColor = {
    photo: "var(--status-ok)", report: "var(--status-warn)",
    contract: "var(--status-warn)", permit: "var(--status-info)",
    dwg: "var(--status-info)", other: "var(--ink-3)",
  };

  return (
    <div className={`f-job ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className="row1">
        <span className="code">{job.code}</span>
        {job.status === "closed" && <StatusPill variant="ok">CLOSED</StatusPill>}
        {job.status === "pending" && <StatusPill variant="warn">PENDING</StatusPill>}
        {job.flagged > 0 && <StatusPill variant="stop">{job.flagged} FLAG</StatusPill>}
      </div>
      <div className="nm">{job.name}</div>
      <div className="sub">{job.customer} · {job.location}</div>
      <div className="row3">
        <span><span style={{ color: "var(--ink-0)" }}>{job.files}</span> files</span>
        <span className="pip">·</span>
        <span><span style={{ color: "var(--ink-0)" }}>{job.photos}</span> photos</span>
        <span className="pip">·</span>
        <span>{job.lastUpload}</span>
      </div>
      <div className="typebar">
        {ticks.map((t, i) => (
          <span key={i} className="typetick" style={{
            background: tickColor[t.kind],
            width: `${(t.n / total) * 100}%`,
            minWidth: 4,
          }}></span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────── Main pane — hero (no job selected) ──────────────────── */
function FilesHero({ onPickJob }) {
  const D = window.FILES_DATA;

  // Group today's activity by job
  const byJob = D.TODAY_ACTIVITY.reduce((m, ev) => {
    (m[ev.jobId] ||= []).push(ev);
    return m;
  }, {});

  return (
    <div className="f-hero">
      {/* Hero stats card */}
      <div className="f-hero-card">
        <div className="f-hero-stat">
          <span className="l">Files today</span>
          <span className="v">{D.FILE_STATS.totalToday}<span className="sub">across {D.FILE_STATS.totalActiveJobs} jobs</span></span>
          <span className="f">Last upload 12 min ago · Aaron V.</span>
        </div>
        <div className="f-hero-stat">
          <span className="l">This week</span>
          <span className="v">{D.FILE_STATS.totalThisWeek}<span className="sub">files</span></span>
          <span className="f">Photos lead · 58 of 87</span>
        </div>
        <div className="f-hero-stat">
          <span className="l">Pending review</span>
          <span className="v" style={{ color: "var(--status-warn)" }}>{D.FILE_STATS.pendingReview}</span>
          <span className="f">2 change orders · 1 incident report</span>
        </div>
        <div className="f-hero-stat">
          <span className="l">Storage</span>
          <span className="v">12.4<span className="sub">/ 100 GB</span></span>
          <div style={{
            marginTop: 6, height: 4, background: "var(--surface-2)", borderRadius: 2, overflow: "hidden"
          }}>
            <div style={{ width: "12.4%", height: "100%", background: "var(--signal)" }}></div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="f-activity-head">
        <span className="h">Today's activity · Tue May 26</span>
        <span className="c">{D.TODAY_ACTIVITY.length} EVENTS</span>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-ghost" style={{ fontSize: 12 }}>
          <Icons.Filter size={12} /> Filter by type
        </button>
      </div>

      {Object.keys(byJob).map(jobId => {
        const job = D.FILE_JOBS.find(j => j.id === jobId);
        if (!job) return null;
        const events = byJob[jobId];

        return (
          <div key={jobId} className="f-activity-group">
            <div className="f-activity-group-h">
              <span className="code">{job.code}</span>
              <span className="nm">{job.name.replace(/ — .*$/, "")}</span>
              <span style={{ fontFamily: "var(--font-sans)", color: "var(--ink-2)", letterSpacing: 0, textTransform: "none" }}>
                · {job.customer}
              </span>
              <button className="openbtn" onClick={() => onPickJob(jobId)}>
                OPEN JOB FILES <Icons.ChevR size={10} style={{ verticalAlign: -1 }} />
              </button>
            </div>
            <div className="f-grid">
              {events.map((ev, i) => {
                const file = ev.inline ||
                  (D.FILES_BY_JOB[jobId] || []).find(f => f.id === ev.fileId);
                if (!file) return null;
                return (
                  <FileTile
                    key={ev.fileId + i}
                    file={{
                      ...file,
                      uploadedBy: ev.who,
                      relAge: `${ev.at}`,
                    }}
                    onSelect={() => onPickJob(jobId)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────── Main pane — job selected ──────────────────── */
function FilesJob({
  job, files, viewMode, setViewMode,
  filter, setFilter, sort, setSort,
  isDropping, onSelectFile, selectedFileId,
  onDelete, uploadingFiles,
}) {
  const D = window.FILES_DATA;
  const folders = D.FILE_FOLDERS[job.id] || [{ name: "All files", count: files.length, key: "all" }];

  let visible = files;
  if (filter !== "all") visible = files.filter(f => f.kind === filter);
  if (sort === "newest") visible = [...visible].sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || ""));
  if (sort === "name")   visible = [...visible].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "size")   visible = [...visible].sort((a, b) => parseFloat(b.size) - parseFloat(a.size));

  // Group visible files by folder when sort=newest
  const grouped = visible.reduce((m, f) => {
    (m[f.folder || "Other"] ||= []).push(f);
    return m;
  }, {});

  return (
    <>
      <div className="f-main-hdr">
        <div className="row1">
          <span className="code">{job.code}</span>
          <h2 className="nm">{job.name}</h2>
        </div>
        <div className="meta">
          <Icons.Building size={12} />
          <span>{job.customer}</span>
          <span className="sep">·</span>
          <Icons.MapPin size={12} />
          <span>{job.location}</span>
          <span className="sep">·</span>
          <span>{job.crew || "No crew assigned"}</span>
          <span className="sep">·</span>
          <span className="ok">SYNCED WITH NETSUITE · 12s AGO</span>
        </div>
        <div className="f-summary">
          <div className="stat"><span className="v">{job.files + uploadingFiles.length}</span> <span className="l">files</span></div>
          <div className="stat"><span className="v">{job.photos}</span> <span className="l">photos</span></div>
          <div className="stat"><span className="v">12</span> <span className="l">contributors</span></div>
          <div className="stat"><span className="v" style={{ color: job.flagged ? "var(--status-stop)" : undefined }}>{job.flagged}</span> <span className="l">flagged</span></div>
        </div>
      </div>

      {/* Toolbar — folder chips + view mode + sort */}
      <div className="f-toolbar">
        <div className="group">
          {folders.map(f => (
            <button key={f.key}
              className={`chip ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              <span className="swatch" style={{
                background:
                  f.key === "all"      ? "var(--ink-3)" :
                  f.key === "photo"    ? "var(--status-ok)" :
                  f.key === "report"   ? "var(--status-warn)" :
                  f.key === "contract" ? "var(--status-warn)" :
                  f.key === "permit"   ? "var(--status-info)" :
                  f.key === "dwg"      ? "var(--status-info)" :
                  f.key === "safety"   ? "var(--status-stop)" :
                  f.key === "invoice"  ? "var(--status-stop)" :
                  f.key === "sheet"    ? "var(--status-ok)" :
                                          "var(--ink-3)"
              }}></span>
              {f.name} <span style={{ color: "var(--ink-3)" }}>{f.count}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}></div>
        <div className="group">
          <button className={`chip ${sort === "newest" ? "active" : ""}`} onClick={() => setSort("newest")}>NEWEST</button>
          <button className={`chip ${sort === "name" ? "active" : ""}`} onClick={() => setSort("name")}>A–Z</button>
          <button className={`chip ${sort === "size" ? "active" : ""}`} onClick={() => setSort("size")}>SIZE</button>
        </div>
        <div className="group">
          <button className={`chip ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} aria-label="Grid view">
            <FIcons.Grid size={12} />
          </button>
          <button className={`chip ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} aria-label="List view">
            <FIcons.List size={12} />
          </button>
        </div>
        <button className="btn btn-secondary" style={{ height: 28 }}>
          <FIcons.Download size={12} /> Export
        </button>
        <button className="btn btn-primary" style={{ height: 28 }}>
          <FIcons.Upload size={12} /> Upload
        </button>
      </div>

      {visible.length === 0 && uploadingFiles.length === 0 ? (
        <div className="f-grid-wrap">
          <div className="f-empty">
            <div className="ico"><FIcons.Folder size={28} /></div>
            <div className="h">No {filter === "all" ? "files" : D.FILE_KIND[filter]?.label.toLowerCase() + "s"} yet for this job</div>
            <div className="s">
              Drag files anywhere on this pane to upload — or have foremen submit from the mobile app.
              Files sync with NetSuite project records automatically.
            </div>
            <div className="row">
              <button className="btn btn-secondary"><FIcons.Folder size={12} /> Pick from another job</button>
              <button className="btn btn-primary"><FIcons.Upload size={12} /> Upload from this device</button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`f-grid-wrap ${isDropping ? "dropping" : ""}`}>
          {/* Uploading section if any */}
          {uploadingFiles.length > 0 && (
            <>
              <div className="f-folder-head">
                <span className="l">Uploading</span>
                <span className="c">{uploadingFiles.length} files · in progress</span>
              </div>
              <div className="f-grid">
                {uploadingFiles.map(uf => (
                  <FileTile key={uf.id} file={uf} />
                ))}
              </div>
            </>
          )}

          {viewMode === "grid" ? (
            Object.keys(grouped).map(folder => (
              <React.Fragment key={folder}>
                <div className="f-folder-head">
                  <span className="l">{folder}</span>
                  <span className="c">{grouped[folder].length} files</span>
                </div>
                <div className="f-grid">
                  {grouped[folder].map(f => (
                    <FileTile key={f.id} file={f}
                      selected={selectedFileId === f.id}
                      onSelect={onSelectFile}
                    />
                  ))}
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="f-list">
              <FileListRow head />
              {visible.map(f => (
                <FileListRow key={f.id} file={f}
                  selected={selectedFileId === f.id}
                  onSelect={onSelectFile}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ──────────────────── Root ──────────────────── */
function FilesApp() {
  const D = window.FILES_DATA;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "comfortable",
    "sidebarCollapsed": false,
    "defaultView": "grid",
    "accent": "#F08A2C",
    "simulateErrors": true
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  fUseEffect(() => {
    document.documentElement.style.setProperty("--signal", t.accent);
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density, t.accent]);

  // State
  const [selectedJobId, setSelectedJobId] = fUseState("j01"); // default to busy demo job
  const [selectedFileId, setSelectedFileId] = fUseState(null);
  const [viewMode, setViewMode] = fUseState(t.defaultView);
  const [filter, setFilter] = fUseState("all");
  const [sort, setSort] = fUseState("newest");
  const [isDropping, setIsDropping] = fUseState(false);
  const [uploadingFiles, setUploadingFiles] = fUseState([]);
  const [toast, setToast] = fUseState(null);
  const [deletedFiles, setDeletedFiles] = fUseState({});
  const toastTimerRef = fUseRef(null);
  const dropCounterRef = fUseRef(0);

  const job = D.FILE_JOBS.find(j => j.id === selectedJobId);
  const baseFiles = (D.FILES_BY_JOB[selectedJobId] || [])
    .filter(f => !deletedFiles[f.id]);

  // Toast / undo
  const showToast = fUseCallback((msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setToast({ id, msg, undoFn, time });
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);
  const handleUndo = fUseCallback(() => {
    if (toast?.undoFn) toast.undoFn();
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, [toast]);

  fUseEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && toast) {
        e.preventDefault(); handleUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, handleUndo]);

  // Simulated drag-and-drop upload
  const simulateUpload = fUseCallback((seedFiles) => {
    // seedFiles is either FileList or our synthetic samples
    const items = Array.from(seedFiles).slice(0, 6).map((f, i) => ({
      id: `up-${Date.now()}-${i}`,
      name: f.name || `IMG_${Math.floor(4500 + Math.random()*200)}.jpg`,
      kind: f.kind || (f.name && f.name.match(/\.(pdf|dwg|xlsx|eml)$/i)
        ? ({ pdf: "pdf", dwg: "dwg", xlsx: "sheet", eml: "email" })[f.name.split(".").pop().toLowerCase()]
        : "photo"),
      ext: f.ext || (f.name?.split(".").pop() || "jpg").toLowerCase(),
      size: f.size ? `${(f.size/1024/1024).toFixed(1)} MB` : `${(Math.random()*4 + 0.5).toFixed(1)} MB`,
      uploadedBy: "u1",
      uploading: true,
      progress: 0,
      relAge: "uploading…",
      caption: f.kind === "photo" || (!f.kind && f.name?.match(/\.(jpe?g|png|heic)$/i)) ? "JUST UPLOADED" : null,
      uploadedAt: new Date().toISOString(),
      folder: "Just uploaded",
    }));
    setUploadingFiles(prev => [...prev, ...items]);

    // Animate progress
    items.forEach((it, idx) => {
      const speed = 35 + Math.random() * 25;
      const willFail = t.simulateErrors && idx === items.length - 1 && Math.random() < 0.5;
      const tick = setInterval(() => {
        setUploadingFiles(prev => prev.map(u => {
          if (u.id !== it.id) return u;
          const next = Math.min(100, (u.progress || 0) + speed);
          return { ...u, progress: next };
        }));
      }, 220);
      setTimeout(() => {
        clearInterval(tick);
        if (willFail) {
          setUploadingFiles(prev => prev.map(u =>
            u.id === it.id ? { ...u, uploading: false, error: true, progress: 100, flag: "stop", flagNote: "upload failed · network" } : u
          ));
        } else {
          // Resolve — pop out of uploading, push toast
          setUploadingFiles(prev => prev.filter(u => u.id !== it.id));
          showToast(
            `<span class="num">${it.name}</span> uploaded to <strong>${job?.code || "job"}</strong>`,
            () => { /* would remove the now-persisted file */ }
          );
        }
      }, 1200 + idx * 400);
    });
  }, [t.simulateErrors, job, showToast]);

  // Native drop handlers
  const onDragEnter = (e) => {
    e.preventDefault();
    dropCounterRef.current += 1;
    setIsDropping(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    dropCounterRef.current -= 1;
    if (dropCounterRef.current <= 0) {
      setIsDropping(false);
      dropCounterRef.current = 0;
    }
  };
  const onDragOver = (e) => {
    e.preventDefault();
    try { e.dataTransfer.dropEffect = "copy"; } catch (_) {}
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDropping(false);
    dropCounterRef.current = 0;
    const files = e.dataTransfer.files;
    if (files && files.length) {
      simulateUpload(files);
    } else {
      // No real files — simulate with synthetic samples
      simulateUpload([
        { name: "IMG_4498.jpg", kind: "photo" },
        { name: "IMG_4499.jpg", kind: "photo" },
        { name: "Daily Report PM.pdf", kind: "report" },
      ]);
    }
  };

  // Delete with undo
  const handleDelete = fUseCallback((fileId) => {
    const f = baseFiles.find(x => x.id === fileId);
    if (!f) return;
    setDeletedFiles(prev => ({ ...prev, [fileId]: true }));
    showToast(
      `Deleted <span class="num">${f.name.length > 36 ? f.name.slice(0, 36) + "…" : f.name}</span>`,
      () => setDeletedFiles(prev => { const c = { ...prev }; delete c[fileId]; return c; })
    );
  }, [baseFiles, showToast]);

  // Sidebar navigation
  return (
    <div className="app" data-collapsed={String(!!t.sidebarCollapsed)}>
      <FilesHeader
        collapsed={t.sidebarCollapsed}
        onToggleSidebar={() => setTweak("sidebarCollapsed", !t.sidebarCollapsed)}
        dark={t.dark}
        onToggleDark={() => setTweak("dark", !t.dark)}
      />
      <FilesSidebar collapsed={t.sidebarCollapsed} />

      <main className="main app-main">
        <div className="subhdr">
          <div className="subhdr-title">
            <span className="date-num" style={{ fontSize: 26 }}>Files</span>
            <span className="date-day">{D.FILE_STATS.totalActiveJobs} ACTIVE TODAY · {D.FILE_STATS.totalThisWeek} THIS WEEK · 220 ACTIVE JOBS</span>
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="filter-chip">
            <span className="dot" style={{ background: "var(--status-ok)" }}></span> ALL DIVISIONS
          </button>
          <button className="filter-chip"><Icons.Filter size={12} /> FILTERS</button>
          <button className="btn btn-secondary" style={{ height: 32 }}>
            <FIcons.Download size={12} /> Export selection
          </button>
          <button className="btn btn-primary" style={{ height: 32 }}
            onClick={() => simulateUpload([
              { name: "IMG_4500.jpg", kind: "photo" },
              { name: "IMG_4501.jpg", kind: "photo" },
              { name: "Permit Update.pdf", kind: "permit" },
            ])}>
            <FIcons.Upload size={14} /> Upload to {job?.code || "—"}
          </button>
        </div>

        <div className="files">
          <FilesRail
            selectedJobId={selectedJobId}
            onSelect={(id) => { setSelectedJobId(id); setSelectedFileId(null); setFilter("all"); }}
          />

          <section
            className="f-main"
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {selectedJobId && job ? (
              <FilesJob
                job={job}
                files={baseFiles}
                viewMode={viewMode} setViewMode={setViewMode}
                filter={filter} setFilter={setFilter}
                sort={sort} setSort={setSort}
                isDropping={isDropping}
                selectedFileId={selectedFileId}
                onSelectFile={setSelectedFileId}
                onDelete={handleDelete}
                uploadingFiles={uploadingFiles}
              />
            ) : (
              <FilesHero onPickJob={(id) => setSelectedJobId(id)} />
            )}
          </section>
        </div>
      </main>

      <UndoToast toast={toast} onUndo={handleUndo} />

      {/* File detail drawer — appears when a file is clicked */}
      {selectedFileId && (
        <FileDetailDrawer
          fileId={selectedFileId}
          job={job}
          onClose={() => setSelectedFileId(null)}
          onDelete={() => { handleDelete(selectedFileId); setSelectedFileId(null); }}
        />
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Appearance" />
        <window.TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <window.TweakRadio label="Density"
          options={[{value:"comfortable",label:"Comfortable"},{value:"compact",label:"Compact"}]}
          value={t.density} onChange={(v) => setTweak("density", v)} />
        <window.TweakColor label="Signal accent"
          value={t.accent}
          options={["#F08A2C","#D4B83A","#C84536","#221F1B"]}
          onChange={(v) => setTweak("accent", v)} />

        <window.TweakSection label="Files" />
        <window.TweakRadio label="Default view"
          options={[{value:"grid",label:"Grid"},{value:"list",label:"List"}]}
          value={viewMode} onChange={(v) => { setViewMode(v); setTweak("defaultView", v); }} />
        <window.TweakToggle label="Simulate upload errors"
          value={t.simulateErrors}
          onChange={(v) => setTweak("simulateErrors", v)} />
        <window.TweakButton label="Simulate dropped upload"
          onClick={() => simulateUpload([
            { name: "IMG_4502.jpg", kind: "photo" },
            { name: "IMG_4503.jpg", kind: "photo" },
            { name: "Density Test — load 3.pdf", kind: "report" },
          ])} />
        <window.TweakButton label="Reset deleted files" secondary
          onClick={() => setDeletedFiles({})} />
      </window.TweaksPanel>
    </div>
  );
}

/* ──────────────────── Header / Sidebar (files-active) ──────────────────── */
function FilesHeader({ collapsed, onToggleSidebar, dark, onToggleDark }) {
  return (
    <header className="app-header hdr">
      <div className="hdr-left">
        <button className="icon-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Icons.Menu size={18} />
        </button>
        <div className="brand">
          <div className="brand-mark">DV</div>
          <span className="brand-text">DVP / FIELD OPS</span>
        </div>
      </div>
      <div className="hdr-center">
        <div className="crumb">
          <span>FIELD</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-cur">FILES</span>
        </div>
      </div>
      <div className="hdr-right">
        <button className="cmdk" aria-label="Open command palette">
          <Icons.Search size={12} />
          <span>Find files, jobs, contracts…</span>
          <span className="cmdk-kbd">⌘K</span>
        </button>
        <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="badge">3</span>
        </button>
        <button className="avatar" title="Karen Faggioli · Project Admin">KF</button>
      </div>
    </header>
  );
}

function FilesSidebar({ collapsed }) {
  const items = [
    { group: "Schedule", entries: [
      { ico: Icons.Calendar, label: "Crew Calendar", badge: "", href: "Crew Calendar Board.html" },
      { ico: Icons.Truck,    label: "Dispatch",      badge: "47", href: "Crew Calendar Board.html" },
      { ico: Icons.Map,      label: "Fleet Tracking", badge: "LIVE", href: "Fleet.html" },
    ]},
    { group: "Field", entries: [
      { ico: Icons.Doc,    label: "Forms",      badge: "9 DUE", href: "Forms.html" },
      { ico: Icons.Hard,   label: "Safety",     badge: "8 EXP", href: "Safety.html" },
      { ico: FIcons.Folder,label: "Files",      badge: "ACTIVE", active: true, href: "Files.html" },
    ]},
    { group: "CRM", entries: [
      { ico: Icons.Schedule, label: "Projects",  badge: "141", href: "Projects.html" },
      { ico: Icons.Building, label: "Customers", badge: "" },
      { ico: Icons.Wrench,   label: "Equipment", badge: "" },
      { ico: Icons.Users,    label: "Workers",   badge: "203" },
    ]},
  ];
  return (
    <aside className="app-sidebar sb">
      {items.map((g) => (
        <React.Fragment key={g.group}>
          <div className="sb-group">{g.group}</div>
          {g.entries.map((e) => (
            <a key={e.label}
              className={`sb-item ${e.active ? "active" : ""}`}
              href={e.href || "#"}
              style={{ textDecoration: "none" }}
            >
              <e.ico size={16} />
              <span className="lbl">{e.label}</span>
              {e.badge && <span className="badge">{e.badge}</span>}
            </a>
          ))}
        </React.Fragment>
      ))}
      <div className="sb-spacer"></div>
      <div className="sb-item">
        <Icons.Settings size={16} />
        <span className="lbl">Settings</span>
      </div>
      <div className="sb-foot">
        <span className="gps-dot live"></span>
        <span className="sb-foot-text">NETSUITE · SYNCED 12s</span>
      </div>
    </aside>
  );
}

/* ──────────────────── File detail drawer ──────────────────── */
function FileDetailDrawer({ fileId, job, onClose, onDelete }) {
  const D = window.FILES_DATA;
  const file = (D.FILES_BY_JOB[job?.id] || []).find(f => f.id === fileId);
  if (!file) return null;
  const kind = D.FILE_KIND[file.kind];
  const user = D.FILE_USERS[file.uploadedBy] || { init: "??", name: "—" };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0,
      width: "min(420px, 90vw)",
      background: "var(--surface-0)",
      borderLeft: "1px solid var(--ink-border)",
      boxShadow: "var(--shadow-2)",
      zIndex: 150,
      display: "flex", flexDirection: "column",
      animation: "drawer-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <div style={{
        padding: "var(--s4)",
        borderBottom: "1px solid var(--ink-border)",
        display: "flex", alignItems: "center", gap: "var(--s3)",
      }}>
        <StatusPill variant={kind?.tone || "info"}>{kind?.label}</StatusPill>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--ink-2)", letterSpacing: "0.04em",
          flex: 1
        }}>{(file.ext || "").toUpperCase()} · {file.size}</span>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><FIcons.X size={14} /></button>
      </div>
      <div style={{
        padding: "var(--s4)",
        borderBottom: "1px solid var(--ink-border)",
      }}>
        <h3 style={{ margin: 0, fontSize: 17, lineHeight: "22px", color: "var(--ink-0)" }}>{file.name}</h3>
        <div style={{
          marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--ink-2)", letterSpacing: "0.04em",
        }}>
          {job.code} · {file.folder} · {file.relAge}
        </div>
      </div>
      <div style={{ padding: "var(--s4)", flex: 1, overflowY: "auto" }}>
        <DrawerRow label="Uploaded by" value={`${user.name} · ${user.role}`} />
        <DrawerRow label="When" value={file.uploadedAt?.replace("T"," ").slice(0,16)} mono />
        <DrawerRow label="Folder" value={file.folder} />
        <DrawerRow label="Size" value={file.size} mono />
        <DrawerRow label="Status" value={file.flag ? "FLAGGED" : "OK"} pillTone={file.flag === "stop" ? "stop" : file.flag === "warn" ? "warn" : "ok"} />
        {file.flagNote && (
          <div style={{
            marginTop: 12,
            padding: 10,
            background: file.flag === "stop" ? "var(--status-stop-soft)" : "var(--status-warn-soft)",
            color: file.flag === "stop" ? "var(--status-stop)" : "var(--status-warn)",
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "0.04em",
            borderRadius: "var(--r)",
          }}>
            <Icons.AlertTri size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
            {file.flagNote}
          </div>
        )}
      </div>
      <div style={{
        padding: "var(--s3) var(--s4)",
        borderTop: "1px solid var(--ink-border)",
        display: "flex", gap: "var(--s2)",
      }}>
        <button className="btn btn-secondary" style={{ flex: 1 }}><FIcons.Download size={12} /> Download</button>
        <button className="btn btn-secondary" style={{ flex: 1 }}><FIcons.Share size={12} /> Share</button>
        <button className="btn btn-ghost" style={{ color: "var(--status-stop)" }} onClick={onDelete} aria-label="Delete">
          <FIcons.Trash size={12} />
        </button>
      </div>
    </div>
  );
}

function DrawerRow({ label, value, mono, pillTone }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "100px 1fr",
      gap: 12, padding: "8px 0",
      borderBottom: "1px solid var(--ink-border)",
      alignItems: "center",
    }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 10,
        color: "var(--ink-2)", letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>{label}</span>
      <span style={{
        fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
        fontSize: mono ? 12 : 13,
        color: "var(--ink-0)",
      }}>
        {pillTone ? <StatusPill variant={pillTone}>{value}</StatusPill> : value}
      </span>
    </div>
  );
}

window.FilesApp = FilesApp;
