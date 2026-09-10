import React, { useState } from "react";
import "./Section4Vacancy.css";

const Section4Vacancy = ({ job }) => {
  const [vacancyView, setVacancyView] = useState("chart"); // 'chart' | 'table'
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [rrbModalOpen, setRrbModalOpen] = useState(false);
  const [rrbFilterBoard, setRrbFilterBoard] = useState("all");
  const [rrbSearchTerm, setRrbSearchTerm] = useState("");

  const totalNum = job.vacancies ? Number(job.vacancies) : 1056;

  return (
    <section className="jd-vac-section">
      {/* Header Area with Hand-drawn Slogans and Background Monument Art */}
      <div className="jd-vac__header">
        <div className="jd-vac__header-left">
          <span className="jd-vac__badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Vacancy Details</span>
          </span>

          <h2 className="jd-vac__title">
            Vacancy <span className="jd-vac__title-accent">Details</span>
          </h2>
          <p className="jd-vac__subtitle">
            A total of <strong>{job.vacancies ? Number(job.vacancies).toLocaleString("en-IN") : "1,056"}</strong> vacancies have been announced for various posts under {job.title || "UPSC CSE 2025"}.
            <br />
            Check the category-wise, service-wise and post-wise distribution below.
          </p>
        </div>

        {/* Right Header Artwork */}
        <div className="jd-vac__header-art">
          <div className="jd-vac__slogan-callout jd-vac__slogan-callout--left">
            Different<br />
            Services<br />
            One Nation<br />
            <span className="jd-vac__slogan-highlight">A Brighter Tomorrow</span>
          </div>

          <img
            src={job.bannerUrl || "/UPSC.png"}
            alt="Government Monument"
            className="jd-vac__monument-img"
            onError={(e) => {
              e.target.src = "/UPSC.png";
            }}
          />

          <div className="jd-vac__slogan-callout jd-vac__slogan-callout--right">
            "Serve<br />
            Learn<br />
            Grow<br />
            <span className="jd-vac__slogan-highlight">Lead"</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats Metric Cards */}
      <div className="jd-vac__metrics-row">
        <div className="jd-vac-metric-card">
          <div className="jd-vac-metric__icon jd-vac-metric__icon--teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="jd-vac-metric__content">
            <span className="jd-vac-metric__label">Total Vacancies</span>
            <strong className="jd-vac-metric__val">
              {job.vacancies ? Number(job.vacancies).toLocaleString("en-IN") : "1,056"}
            </strong>
            <span className="jd-vac-metric__sub jd-vac-metric__sub--teal">All-India Posts</span>
          </div>
        </div>

        <div className="jd-vac-metric-card">
          <div className="jd-vac-metric__icon jd-vac-metric__icon--emerald">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2l10-8z" />
            </svg>
          </div>
          <div className="jd-vac-metric__content">
            <span className="jd-vac-metric__label">
              {job.vacancyTableType === "rrb" || (Array.isArray(job.rrbVacancies) && job.rrbVacancies.length > 0)
                ? "RRB Boards"
                : "Participating Services"}
            </span>
            {(() => {
              const rawVal = String(
                job.participatingServices ||
                  (job.rrbVacancies && job.rrbVacancies.length > 0
                    ? `${job.rrbVacancies.length} RRB Boards`
                    : job.serviceVacancies && job.serviceVacancies.length > 0
                    ? `${job.serviceVacancies.length} Services`
                    : "21 RRB Boards")
              );
              const match = rawVal.match(/^(\d+\s*(?:RRB Boards|Services|Depts)?)/i);
              const headline = match ? match[1].trim() : rawVal.split("(")[0].trim();
              const details = rawVal.includes("(") ? rawVal.substring(rawVal.indexOf("(") + 1).replace(/\)$/, "").trim() : null;

              return (
                <>
                  <strong className="jd-vac-metric__val" title={rawVal}>
                    {headline || rawVal}
                  </strong>
                  <span className="jd-vac-metric__sub jd-vac-metric__sub--emerald" title={rawVal}>
                    {details ? "Pan-India Branches" : "Official Distribution"}
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        <div className="jd-vac-metric-card">
          <div className="jd-vac-metric__icon jd-vac-metric__icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="jd-vac-metric__content">
            <span className="jd-vac-metric__label">Posts Scope</span>
            <strong className="jd-vac-metric__val jd-vac-metric__val--text" title={job.postsDescription || "Multiple Posts"}>
              {(() => {
                const desc = job.postsDescription || "Multiple";
                if (desc.length > 36) {
                  const firstPart = desc.split(/across|departments|and/i)[0].trim();
                  return firstPart || desc.substring(0, 32) + "...";
                }
                return desc;
              })()}
            </strong>
            <span className="jd-vac-metric__sub jd-vac-metric__sub--blue" title={job.postsDescription}>
              {job.postsDescription && job.postsDescription.toLowerCase().includes("engineer")
                ? "Technical Cadre"
                : "Official Cadres"}
            </span>
          </div>
        </div>

        <div className="jd-vac-metric-card">
          <div className="jd-vac-metric__icon jd-vac-metric__icon--green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="jd-vac-metric__content">
            <span className="jd-vac-metric__label">Reservation Categories</span>
            {(() => {
              const cv = job.categoryVacancies || {};
              const keys = Object.keys(cv).filter((k) => cv[k] !== "" && cv[k] !== undefined);
              const count = keys.length > 0 ? keys.length : 6;
              const tagList = keys.length > 0 ? keys.map((k) => k.toUpperCase()).slice(0, 4).join(", ") : "UR, OBC, SC, ST";
              return (
                <>
                  <strong className="jd-vac-metric__val">
                    {count} Categories
                  </strong>
                  <span className="jd-vac-metric__sub jd-vac-metric__sub--purple" title={keys.map((k) => k.toUpperCase()).join(", ")}>
                    {tagList}
                    {keys.length > 4 ? "..." : ""}
                  </span>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="jd-vac__grid">
        {/* Left Main Column */}
        <div className="jd-vac__main-col">
          {/* Card 1: Category-wise Vacancy Distribution */}
          <div className="jd-vac-card">
            <div className="jd-vac-card__header">
              <div className="jd-vac-card__header-left">
                <div className="jd-vac-card__icon-box jd-vac-card__icon-box--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div>
                  <h3 className="jd-vac-card__title">Category-wise Vacancy Distribution</h3>
                  <p className="jd-vac-card__desc">See the number of vacancies reserved for each category.</p>
                </div>
              </div>

              {/* Toggle Button Group */}
              <div className="jd-vac-toggle-group">
                <button
                  type="button"
                  className={`jd-vac-toggle-btn ${vacancyView === "chart" ? "active" : ""}`}
                  onClick={() => setVacancyView("chart")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Chart View</span>
                </button>
                <button
                  type="button"
                  className={`jd-vac-toggle-btn ${vacancyView === "table" ? "active" : ""}`}
                  onClick={() => setVacancyView("table")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  <span>Table View</span>
                </button>
              </div>
            </div>

            <div className="jd-vac-card__body">
              {(() => {
                const cv = job.categoryVacancies || {};
                const COLOR_MAP = {
                  ur: "#38bdf8",
                  obc: "#34d399",
                  sc: "#fcd34d",
                  st: "#c084fc",
                  ews: "#f43f5e",
                  pwbd: "#fb923c",
                };
                const FALLBACK_PALETTE = ["#38bdf8", "#34d399", "#fcd34d", "#c084fc", "#f43f5e", "#fb923c", "#a78bfa", "#22d3ee"];

                const cvKeys = Object.keys(cv).filter((k) => cv[k] !== "" && cv[k] !== undefined && Number(cv[k]) >= 0);
                
                let categoriesList = [];
                if (cvKeys.length > 0) {
                  categoriesList = cvKeys.map((k, i) => ({
                    key: k,
                    name: k.toUpperCase(),
                    val: Number(cv[k]) || 0,
                    color: COLOR_MAP[k.toLowerCase()] || FALLBACK_PALETTE[i % FALLBACK_PALETTE.length],
                  }));
                } else {
                  const ur = Math.round(totalNum * 0.407);
                  const obc = Math.round(totalNum * 0.266);
                  const sc = Math.round(totalNum * 0.166);
                  const st = totalNum - ur - obc - sc;
                  categoriesList = [
                    { key: "ur", name: "UR", val: ur, color: "#38bdf8" },
                    { key: "obc", name: "OBC", val: obc, color: "#34d399" },
                    { key: "sc", name: "SC", val: sc, color: "#fcd34d" },
                    { key: "st", name: "ST", val: st, color: "#c084fc" },
                  ];
                }

                const sum = categoriesList.reduce((acc, c) => acc + c.val, 0) || 1;
                const maxVal = Math.max(...categoriesList.map((c) => c.val), 1);
                const CIRCUMFERENCE = 339.292;

                let accumulatedDash = 0;
                const enriched = categoriesList.map((cat) => {
                  const pct = Math.round((cat.val / sum) * 1000) / 10;
                  const height = Math.max(16, Math.round((cat.val / maxVal) * 140));
                  const dash = (cat.val / sum) * CIRCUMFERENCE;
                  const offset = -accumulatedDash;
                  accumulatedDash += dash;
                  return {
                    ...cat,
                    pct,
                    height,
                    dash,
                    offset,
                  };
                });

                return vacancyView === "chart" ? (
                  <div className="jd-vac-distribution-visual">
                    {/* Left: Bar Chart */}
                    <div className="jd-vac-bars-container">
                      <div className="jd-vac-bars-track">
                        {enriched.map((cat) => (
                          <div className="jd-vac-bar-item" key={cat.key}>
                            <span className="jd-vac-bar-val">{cat.val}</span>
                            <div
                              className="jd-vac-bar"
                              style={{ height: `${cat.height}px`, background: cat.color }}
                            />
                            <div className="jd-vac-bar-label">
                              <strong>{cat.name}</strong>
                              <small>({cat.pct}%)</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: SVG Donut Chart + Legend */}
                    <div className="jd-vac-donut-wrap">
                      <div className="jd-vac-donut-svg-box">
                        <svg viewBox="0 0 160 160" className="jd-vac-donut-svg">
                          <circle cx="80" cy="80" r="54" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                          {enriched.map((cat) => (
                            <circle
                              key={cat.key}
                              cx="80"
                              cy="80"
                              r="54"
                              fill="none"
                              stroke={cat.color}
                              strokeWidth="20"
                              strokeDasharray={`${cat.dash} ${CIRCUMFERENCE}`}
                              strokeDashoffset={cat.offset}
                              transform="rotate(-90 80 80)"
                            />
                          ))}
                          <text x="80" y="76" textAnchor="middle" fontWeight="800" fontSize="16" fill="#0f172a">
                            {totalNum.toLocaleString("en-IN")}
                          </text>
                          <text x="80" y="93" textAnchor="middle" fontWeight="600" fontSize="8.5" fill="#64748b">
                            Total Vacancies
                          </text>
                        </svg>
                      </div>

                      {/* Donut Legend */}
                      <div className="jd-vac-donut-legend">
                        {enriched.map((cat) => (
                          <div className="jd-vac-legend-item" key={cat.key}>
                            <span className="jd-vac-legend-dot" style={{ background: cat.color }} />
                            <span className="jd-vac-legend-cat">{cat.name}</span>
                            <strong className="jd-vac-legend-val">{cat.val} ({cat.pct}%)</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="jd-vac-table-container">
                    <table className="jd-vac-data-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Share %</th>
                          <th style={{ textAlign: "center" }}>Reserved Vacancies</th>
                          <th>Quota Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enriched.map((cat) => (
                          <tr key={cat.key}>
                            <td>
                              <span
                                className="jd-vac-cat-badge"
                                style={{
                                  background: `${cat.color}20`,
                                  color: cat.color,
                                  border: `1px solid ${cat.color}40`,
                                }}
                              >
                                {cat.name}
                              </span>
                            </td>
                            <td>{cat.pct}%</td>
                            <td style={{ textAlign: "center" }}><strong>{cat.val}</strong></td>
                            <td>
                              <span className="jd-vac-status-pill">
                                {cat.key.toLowerCase() === "ur" ? "Open to All" : "Reserved"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="jd-vac-total-row">
                          <td><strong>Total (All Categories)</strong></td>
                          <td><strong>100%</strong></td>
                          <td style={{ textAlign: "center" }}><strong>{sum.toLocaleString("en-IN")}</strong></td>
                          <td><strong>Confirmed</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Card 2A: RRB-wise Vacancy Details */}
          {(job.vacancyTableType === "rrb" || (Array.isArray(job.rrbVacancies) && job.rrbVacancies.length > 0)) && (
            <div className="jd-vac-card">
              <div className="jd-vac-card__header" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div className="jd-vac-card__header-left">
                  <div className="jd-vac-card__icon-box jd-vac-card__icon-box--blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="3" width="16" height="16" rx="2" />
                      <path d="M4 11h16" />
                      <path d="M12 3v8" />
                      <path d="m8 19-2 3" />
                      <path d="m18 22-2-3" />
                      <circle cx="8" cy="15" r="1" />
                      <circle cx="16" cy="15" r="1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="jd-vac-card__title">RRB-wise, Railway/PU-wise &amp; Post-wise Vacancies</h3>
                    <p className="jd-vac-card__desc">
                      Official vacancy distribution across regional Railway Recruitment Boards &amp; Railway Zones.
                    </p>
                  </div>
                </div>

                {/* Filter by Board & Search Post & Full View Action */}
                <div className="jd-rrb-controls-bar">
                  <div className="jd-rrb-filter-group">
                    <label className="jd-rrb-filter-label">Select Board:</label>
                    <select
                      value={rrbFilterBoard}
                      onChange={(e) => setRrbFilterBoard(e.target.value)}
                      className="jd-rrb-board-filter-select"
                    >
                      <option value="all">All RRB Boards ({job.rrbVacancies?.length || 0})</option>
                      {(job.rrbVacancies || []).map((b) => (
                        <option key={b.rrb} value={b.rrb}>
                          {b.rrb} ({(b.posts || []).length} Posts)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="jd-rrb-search-wrap">
                    <svg className="jd-rrb-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Filter by post or dept..."
                      value={rrbSearchTerm}
                      onChange={(e) => setRrbSearchTerm(e.target.value)}
                      className="jd-rrb-search-input"
                    />
                    {rrbSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setRrbSearchTerm("")}
                        className="jd-rrb-search-clear"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    className="jd-rrb-fullview-btn"
                    onClick={() => setRrbModalOpen(true)}
                    title="Open Full Table in Dedicated Expanded Modal View"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    <span>Full View</span>
                  </button>
                </div>
              </div>

              <div className="jd-vac-card__body jd-vac-card__body--no-pad">
                {(() => {
                  const allBoards = job.rrbVacancies || [];
                  const displayedBoards = allBoards.filter((b) =>
                    rrbFilterBoard === "all" ? true : b.rrb === rrbFilterBoard
                  );

                  let grandUR = 0;
                  let grandSC = 0;
                  let grandST = 0;
                  let grandOBC = 0;
                  let grandEWS = 0;
                  let grandTotal = 0;
                  let grandExSM = 0;
                  let grandPwBD = 0;

                  return (
                    <div className="jd-vac-table-container jd-rrb-table-wrap">
                      <table className="jd-vac-data-table jd-rrb-table">
                        <thead>
                          <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>Cat#</th>
                            <th style={{ minWidth: "220px" }}>Name of the Post</th>
                            <th style={{ minWidth: "130px" }}>Department</th>
                            <th style={{ minWidth: "120px" }}>Sub-Dept</th>
                            <th style={{ textAlign: "center", width: "70px" }}>Rly/PU</th>
                            <th style={{ textAlign: "center" }} className="jd-col-ur">UR</th>
                            <th style={{ textAlign: "center" }} className="jd-col-sc">SC</th>
                            <th style={{ textAlign: "center" }} className="jd-col-st">ST</th>
                            <th style={{ textAlign: "center" }} className="jd-col-obc">OBC</th>
                            <th style={{ textAlign: "center" }} className="jd-col-ews">EWS</th>
                            <th style={{ textAlign: "center" }} className="jd-col-total">Total</th>
                            <th style={{ textAlign: "center" }} className="jd-col-exsm">ExSM</th>
                            <th style={{ textAlign: "center" }} className="jd-col-pwbd">PwBD</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedBoards.map((board) => {
                            const filteredPosts = (board.posts || []).filter((p) => {
                              if (!rrbSearchTerm.trim()) return true;
                              const q = rrbSearchTerm.toLowerCase();
                              return (
                                (p.postName || "").toLowerCase().includes(q) ||
                                (p.department || "").toLowerCase().includes(q) ||
                                (p.subDepartment || "").toLowerCase().includes(q) ||
                                (p.railway || "").toLowerCase().includes(q)
                              );
                            });

                            let bUR = 0, bSC = 0, bST = 0, bOBC = 0, bEWS = 0, bTot = 0, bExSM = 0, bPwBD = 0;
                            (board.posts || []).forEach((p) => {
                              const u = Number(p.ur) || 0;
                              const sc = Number(p.sc) || 0;
                              const st = Number(p.st) || 0;
                              const ob = Number(p.obc) || 0;
                              const ew = Number(p.ews) || 0;
                              const tot = Number(p.total) || (u + sc + st + ob + ew);
                              const ex = Number(p.exsm) || 0;
                              const pw = typeof p.pwbd === "object"
                                ? Object.values(p.pwbd).reduce((a, b) => a + (Number(b) || 0), 0)
                                : Number(p.pwbd) || 0;

                              bUR += u; bSC += sc; bST += st; bOBC += ob; bEWS += ew; bTot += tot; bExSM += ex; bPwBD += pw;
                              grandUR += u; grandSC += sc; grandST += st; grandOBC += ob; grandEWS += ew; grandTotal += tot; grandExSM += ex; grandPwBD += pw;
                            });

                            return (
                              <React.Fragment key={board.rrb}>
                                <tr className="jd-rrb-board-header-row">
                                  <td colSpan={13}>
                                    <div className="jd-rrb-board-header-content">
                                      <div className="jd-rrb-board-title-group">
                                        <span className="jd-rrb-board-icon">🚆</span>
                                        <strong className="jd-rrb-board-name">{board.rrb}</strong>
                                        <span className="jd-rrb-board-count-badge">{board.posts?.length || 0} Posts</span>
                                      </div>
                                      <div className="jd-rrb-board-stat-badge">
                                        Board Subtotal: <strong>{bTot.toLocaleString("en-IN")} Vacancies</strong>
                                      </div>
                                    </div>
                                  </td>
                                </tr>

                                {filteredPosts.map((post, pIdx) => (
                                  <tr key={pIdx} className="jd-rrb-post-row">
                                    <td style={{ textAlign: "center" }}>
                                      <span className="jd-rrb-cat-num">{post.catNo}</span>
                                    </td>
                                    <td>
                                      <div className="jd-rrb-post-name">{post.postName}</div>
                                    </td>
                                    <td>
                                      <span className="jd-rrb-dept-pill">{post.department || "General"}</span>
                                    </td>
                                    <td>
                                      <span className="jd-rrb-subdept-text">{post.subDepartment || "—"}</span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      <span className="jd-rrb-zone-badge">
                                        {post.railway || "WR"}
                                      </span>
                                    </td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell">{post.ur ?? 0}</td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell">{post.sc ?? 0}</td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell">{post.st ?? 0}</td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell">{post.obc ?? 0}</td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell">{post.ews ?? 0}</td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--total">
                                      <strong>{post.total}</strong>
                                    </td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">{post.exsm ?? 0}</td>
                                    <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">
                                      {typeof post.pwbd === "object"
                                        ? Object.values(post.pwbd).reduce((a, b) => a + (Number(b) || 0), 0)
                                        : post.pwbd ?? 0}
                                    </td>
                                  </tr>
                                ))}

                                {filteredPosts.length === 0 && (
                                  <tr className="jd-rrb-empty-row">
                                    <td colSpan={13}>
                                      No posts matching "{rrbSearchTerm}" under {board.rrb}.
                                    </td>
                                  </tr>
                                )}

                                <tr className="jd-rrb-subtotal-row">
                                  <td colSpan={5} className="jd-rrb-subtotal-label">
                                    Subtotal for {board.rrb}:
                                  </td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{bUR}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{bSC}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{bST}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{bOBC}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{bEWS}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--total">
                                    <strong>{bTot}</strong>
                                  </td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">{bExSM}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">{bPwBD}</td>
                                </tr>
                              </React.Fragment>
                            );
                          })}

                          {displayedBoards.length > 0 && (
                            <tr className="jd-rrb-grandtotal-row">
                              <td colSpan={5} className="jd-rrb-grandtotal-label">
                                Grand Total ({allBoards.length} RRB Boards):
                              </td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell">{grandUR.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell">{grandSC.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell">{grandST.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell">{grandOBC.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell">{grandEWS.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--grand">
                                <strong>{grandTotal.toLocaleString("en-IN")}</strong>
                              </td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell">{grandExSM.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "center" }} className="jd-num-cell">{grandPwBD.toLocaleString("en-IN")}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Card 2B: Standard Service-wise / Post-wise Vacancy & Eligibility Details */}
          {job.vacancyTableType !== "rrb" && (!job.rrbVacancies || job.rrbVacancies.length === 0) && Array.isArray(job.serviceVacancies) && job.serviceVacancies.length > 0 && (
            <div className="jd-vac-card">
              {(() => {
                const rawServices = job.serviceVacancies;
                const hasQual = rawServices.some((s) => s.qualification || s.ageLimit);
                const hasNonZeroVacancies = rawServices.some(
                  (s) => Number(s.ur) > 0 || Number(s.obc) > 0 || Number(s.sc) > 0 || Number(s.st) > 0 || Number(s.total) > 0
                );
                const totalUr = rawServices.reduce((acc, s) => acc + (Number(s.ur) || 0), 0);
                const totalObc = rawServices.reduce((acc, s) => acc + (Number(s.obc) || 0), 0);
                const totalSc = rawServices.reduce((acc, s) => acc + (Number(s.sc) || 0), 0);
                const totalSt = rawServices.reduce((acc, s) => acc + (Number(s.st) || 0), 0);
                const totalSum = rawServices.reduce(
                  (acc, s) =>
                    acc +
                    (Number(s.total) ||
                      (Number(s.ur) || 0) +
                        (Number(s.obc) || 0) +
                          (Number(s.sc) || 0) +
                            (Number(s.st) || 0)),
                  0
                );

                return (
                  <>
                    <div className="jd-vac-card__header">
                      <div className="jd-vac-card__header-left">
                        <div className="jd-vac-card__icon-box jd-vac-card__icon-box--blue">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="jd-vac-card__title">
                            {hasQual ? "Participating Organizations, Posts & Educational Qualifications" : "Service-wise Vacancy Details"}
                          </h3>
                          <p className="jd-vac-card__desc">
                            {hasQual
                              ? `Official department-wise post distribution, qualifications and age limits under ${job.title || "this recruitment"}.`
                              : `Check the number of vacancies available in each service under ${job.title || "this recruitment"}.`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="jd-vac-view-all-link"
                        onClick={() => setServiceModalOpen(true)}
                      >
                        <span>View Detailed Service List</span>
                        <span>&rarr;</span>
                      </button>
                    </div>

                    <div className="jd-vac-card__body jd-vac-card__body--no-pad">
                      <div className="jd-vac-table-container">
                        <table className="jd-vac-data-table jd-vac-data-table--org">
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>S. No.</th>
                              <th style={{ minWidth: "220px" }}>Organization &amp; Post</th>
                              {hasQual ? (
                                <>
                                  <th style={{ minWidth: "320px" }}>Essential Educational Qualifications</th>
                                  <th style={{ minWidth: "120px", textAlign: "center" }}>Age Limit</th>
                                </>
                              ) : (
                                <>
                                  <th style={{ textAlign: "center" }}>UR</th>
                                  <th style={{ textAlign: "center" }}>OBC</th>
                                  <th style={{ textAlign: "center" }}>SC</th>
                                  <th style={{ textAlign: "center" }}>ST</th>
                                </>
                              )}
                              {hasNonZeroVacancies && (
                                <th style={{ textAlign: "center" }}>Total Vacancies</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {rawServices.map((svc, idx) => {
                              const sTotal =
                                Number(svc.total) ||
                                (Number(svc.ur) || 0) +
                                  (Number(svc.obc) || 0) +
                                  (Number(svc.sc) || 0) +
                                  (Number(svc.st) || 0);
                              return (
                                <tr key={idx}>
                                  <td>{svc.sNo || idx + 1}</td>
                                  <td>
                                    <strong>{svc.name || svc.service}</strong>
                                    {svc.post && svc.organization && svc.service !== `${svc.organization} - ${svc.post}` && (
                                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{svc.post}</div>
                                    )}
                                  </td>
                                  {hasQual ? (
                                    <>
                                      <td style={{ color: "#334155", lineHeight: 1.5, fontSize: "0.82rem" }}>
                                        {svc.qualification || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>As per official notification</span>}
                                      </td>
                                      <td style={{ textAlign: "center", fontWeight: 600, color: "#1e293b" }}>
                                        {svc.ageLimit || "—"}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td style={{ textAlign: "center" }}>{svc.ur ?? 0}</td>
                                      <td style={{ textAlign: "center" }}>{svc.obc ?? 0}</td>
                                      <td style={{ textAlign: "center" }}>{svc.sc ?? 0}</td>
                                      <td style={{ textAlign: "center" }}>{svc.st ?? 0}</td>
                                    </>
                                  )}
                                  {hasNonZeroVacancies && (
                                    <td style={{ textAlign: "center" }}>
                                      <strong>{sTotal}</strong>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                            {!hasQual && (
                              <tr className="jd-vac-total-row">
                                <td colSpan={2}>
                                  <strong>Total ({rawServices.length} Services)</strong>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <strong>{totalUr}</strong>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <strong>{totalObc}</strong>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <strong>{totalSc}</strong>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <strong>{totalSt}</strong>
                                </td>
                                {hasNonZeroVacancies && (
                                  <td style={{ textAlign: "center" }}>
                                    <strong>
                                      {job.vacancies
                                        ? Number(job.vacancies).toLocaleString("en-IN")
                                        : totalSum.toLocaleString("en-IN")}
                                    </strong>
                                  </td>
                                )}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="jd-vac__sidebar">
          {/* 1. Key Highlights Card */}
          <div className="jd-vac-sidebar-card jd-vac-highlights-card">
            <div className="jd-vac-highlights__bg-watermark">
              <img src="/emblem_india.png" alt="Emblem Watermark" onError={(e) => (e.target.style.display = "none")} />
            </div>

            <div className="jd-vac-highlights__header">
              <div className="jd-vac-highlights__title-wrap">
                <div className="jd-vac-highlights__icon">💡</div>
                <h4 className="jd-vac-highlights__title">Key Highlights</h4>
              </div>

              <div className="jd-vac-highlights__handwritten">
                Opportunities<br />
                to Build<br />
                a Stronger<br />
                <span>India</span>
              </div>
            </div>

            <ul className="jd-vac-highlights__list">
              <li>
                <span className="jd-vac-check-icon">✔</span>
                <span>Total Vacancies: <strong>{job.vacancies ? Number(job.vacancies).toLocaleString("en-IN") : "1,056"}</strong></span>
              </li>
              {job.participatingServices || (job.serviceVacancies && job.serviceVacancies.length > 0) ? (
                <li>
                  <span className="jd-vac-check-icon">✔</span>
                  <span>
                    Vacancies across {job.participatingServices || job.serviceVacancies.length} {job.postsDescription ? job.postsDescription : "Services"}
                  </span>
                </li>
              ) : job.postsDescription ? (
                <li>
                  <span className="jd-vac-check-icon">✔</span>
                  <span>{job.postsDescription}</span>
                </li>
              ) : null}
              <li>
                <span className="jd-vac-check-icon">✔</span>
                <span>Reservation applicable as per Government norms</span>
              </li>
              <li>
                <span className="jd-vac-check-icon">✔</span>
                <span>Category-wise break-up available</span>
              </li>
              <li>
                <span className="jd-vac-check-icon">✔</span>
                <span>Final vacancy count may be revised <small>(Refer to official notification)</small></span>
              </li>
            </ul>
          </div>

          {/* 2. Download Vacancy PDF Card */}
          <div className="jd-vac-sidebar-card jd-vac-pdf-card">
            <div className="jd-vac-pdf-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h4 className="jd-vac-pdf-card__title">Download Vacancy PDF</h4>
            <p className="jd-vac-pdf-card__desc">
              {job.serviceVacancies && job.serviceVacancies.length > 0
                ? "Get the complete category-wise and service-wise vacancy details in PDF format."
                : "Get the complete category-wise vacancy details in PDF format."}
            </p>
            <a
              href={job.notificationPdfUrl || "https://upsc.gov.in"}
              target="_blank"
              rel="noreferrer"
              className="jd-vac-pdf-card__btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Vacancy Details (PDF) &rarr;</span>
            </a>
          </div>

          {/* 3. Please Note Card */}
          <div className="jd-vac-sidebar-card jd-vac-note-card">
            <div className="jd-vac-note-card__header">
              <div className="jd-vac-note-card__icon">ℹ</div>
              <h4>Please Note</h4>
            </div>
            <ul className="jd-vac-note-card__bullets">
              <li>The number of vacancies is tentative and may be subject to change.</li>
              <li>Reservation and roster will be as per Government of India rules.</li>
              <li>Candidates are advised to refer to the official notification for complete and updated details.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ────────── Detailed Service List Modal ────────── */}
      {serviceModalOpen && Array.isArray(job.serviceVacancies) && job.serviceVacancies.length > 0 && (
        <div className="jd-modal-backdrop" onClick={() => setServiceModalOpen(false)}>
          <div
            className="jd-modal-box"
            style={{ maxWidth: "780px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="jd-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.4rem" }}>🏛️</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                    Complete Service-wise Vacancy Breakdown
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Participating Services ({job.title || "Recruitment Opportunity"})
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="jd-modal-close-btn"
                onClick={() => setServiceModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="jd-modal-body" style={{ maxHeight: "70vh", overflowY: "auto", padding: "16px" }}>
              {(() => {
                const svcs = job.serviceVacancies || [];
                const hasQual = svcs.some((s) => s.qualification || s.ageLimit);
                const hasNonZero = svcs.some((s) => Number(s.total) > 0 || Number(s.ur) > 0);

                return (
                  <table className="jd-vac-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>#</th>
                        <th style={{ minWidth: "220px" }}>Organization &amp; Post</th>
                        {hasQual ? (
                          <>
                            <th style={{ minWidth: "340px" }}>Essential Educational Qualifications</th>
                            <th style={{ minWidth: "110px", textAlign: "center" }}>Age Limit</th>
                          </>
                        ) : (
                          <>
                            <th>Cadre / Group</th>
                            <th style={{ textAlign: "center" }}>UR</th>
                            <th style={{ textAlign: "center" }}>OBC</th>
                            <th style={{ textAlign: "center" }}>SC</th>
                            <th style={{ textAlign: "center" }}>ST</th>
                          </>
                        )}
                        {hasNonZero && <th style={{ textAlign: "center" }}>Total</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {svcs.map((svc, idx) => {
                        const sTotal =
                          Number(svc.total) ||
                          (Number(svc.ur) || 0) +
                            (Number(svc.obc) || 0) +
                            (Number(svc.sc) || 0) +
                            (Number(svc.st) || 0);
                        return (
                          <tr key={idx}>
                            <td>{svc.sNo || idx + 1}</td>
                            <td>
                              <strong>{svc.name || svc.service}</strong>
                              {svc.post && svc.organization && svc.service !== `${svc.organization} - ${svc.post}` && (
                                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{svc.post}</div>
                              )}
                            </td>
                            {hasQual ? (
                              <>
                                <td style={{ color: "#334155", lineHeight: 1.5, fontSize: "0.82rem" }}>
                                  {svc.qualification || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>As per official notification</span>}
                                </td>
                                <td style={{ textAlign: "center", fontWeight: 600, color: "#1e293b" }}>
                                  {svc.ageLimit || "—"}
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{svc.cadre || svc.group || "Central / State Cadre"}</td>
                                <td style={{ textAlign: "center" }}>{svc.ur ?? 0}</td>
                                <td style={{ textAlign: "center" }}>{svc.obc ?? 0}</td>
                                <td style={{ textAlign: "center" }}>{svc.sc ?? 0}</td>
                                <td style={{ textAlign: "center" }}>{svc.st ?? 0}</td>
                              </>
                            )}
                            {hasNonZero && (
                              <td style={{ textAlign: "center" }}>
                                <strong>{sTotal}</strong>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                      {!hasQual && (
                        <tr className="jd-vac-total-row">
                          <td colSpan={3}>
                            <strong>Total ({svcs.length} Services)</strong>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <strong>
                              {svcs.reduce((acc, s) => acc + (Number(s.ur) || 0), 0)}
                            </strong>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <strong>
                              {svcs.reduce((acc, s) => acc + (Number(s.obc) || 0), 0)}
                            </strong>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <strong>
                              {svcs.reduce((acc, s) => acc + (Number(s.sc) || 0), 0)}
                            </strong>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <strong>
                              {svcs.reduce((acc, s) => acc + (Number(s.st) || 0), 0)}
                            </strong>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <strong>
                              {job.vacancies
                                ? Number(job.vacancies).toLocaleString("en-IN")
                                : svcs
                                    .reduce(
                                      (acc, s) =>
                                        acc +
                                        (Number(s.total) ||
                                          (Number(s.ur) || 0) +
                                            (Number(s.obc) || 0) +
                                            (Number(s.sc) || 0) +
                                            (Number(s.st) || 0)),
                                      0
                                    )
                                    .toLocaleString("en-IN")}
                            </strong>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ────────── Dedicated Full View RRB Vacancy Modal ────────── */}
      {rrbModalOpen && Array.isArray(job.rrbVacancies) && job.rrbVacancies.length > 0 && (
        <div className="jd-modal-backdrop jd-rrb-modal-backdrop" onClick={() => setRrbModalOpen(false)}>
          <div
            className="jd-modal-box jd-rrb-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="jd-modal-header jd-rrb-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.6rem" }}>🚆</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, color: "#0f172a" }}>
                    Complete RRB Regional Vacancies &amp; Category Breakdown
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {job.title || "Railway Recruitment Notice"} • {job.rrbVacancies.length} Regional Boards
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  className="jd-modal-close-btn"
                  onClick={() => setRrbModalOpen(false)}
                  title="Close modal"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Filter Bar */}
            <div className="jd-rrb-modal-toolbar">
              <div className="jd-rrb-filter-group">
                <label className="jd-rrb-filter-label">Filter Board:</label>
                <select
                  value={rrbFilterBoard}
                  onChange={(e) => setRrbFilterBoard(e.target.value)}
                  className="jd-rrb-board-filter-select"
                >
                  <option value="all">All RRB Boards ({job.rrbVacancies.length})</option>
                  {job.rrbVacancies.map((b) => (
                    <option key={b.rrb} value={b.rrb}>
                      {b.rrb} ({(b.posts || []).length} Posts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="jd-rrb-search-wrap" style={{ flex: 1, maxWidth: "340px" }}>
                <svg className="jd-rrb-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search any post, department, or railway zone..."
                  value={rrbSearchTerm}
                  onChange={(e) => setRrbSearchTerm(e.target.value)}
                  className="jd-rrb-search-input"
                  style={{ width: "100%" }}
                />
                {rrbSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setRrbSearchTerm("")}
                    className="jd-rrb-search-clear"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Modal Scrollable Table Body */}
            <div className="jd-modal-body jd-rrb-modal-body">
              {(() => {
                const allBoards = job.rrbVacancies || [];
                const displayedBoards = allBoards.filter((b) =>
                  rrbFilterBoard === "all" ? true : b.rrb === rrbFilterBoard
                );

                let grandUR = 0;
                let grandSC = 0;
                let grandST = 0;
                let grandOBC = 0;
                let grandEWS = 0;
                let grandTotal = 0;
                let grandExSM = 0;
                let grandPwBD = 0;

                return (
                  <div className="jd-vac-table-container jd-rrb-table-wrap">
                    <table className="jd-vac-data-table jd-rrb-table">
                      <thead>
                        <tr>
                          <th style={{ width: "50px", textAlign: "center" }}>Cat#</th>
                          <th style={{ minWidth: "240px" }}>Name of the Post</th>
                          <th style={{ minWidth: "140px" }}>Department</th>
                          <th style={{ minWidth: "130px" }}>Sub-Dept</th>
                          <th style={{ textAlign: "center", width: "70px" }}>Rly/PU</th>
                          <th style={{ textAlign: "center" }} className="jd-col-ur">UR</th>
                          <th style={{ textAlign: "center" }} className="jd-col-sc">SC</th>
                          <th style={{ textAlign: "center" }} className="jd-col-st">ST</th>
                          <th style={{ textAlign: "center" }} className="jd-col-obc">OBC</th>
                          <th style={{ textAlign: "center" }} className="jd-col-ews">EWS</th>
                          <th style={{ textAlign: "center" }} className="jd-col-total">Total</th>
                          <th style={{ textAlign: "center" }} className="jd-col-exsm">ExSM</th>
                          <th style={{ textAlign: "center" }} className="jd-col-pwbd">PwBD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedBoards.map((board) => {
                          const filteredPosts = (board.posts || []).filter((p) => {
                            if (!rrbSearchTerm.trim()) return true;
                            const q = rrbSearchTerm.toLowerCase();
                            return (
                              (p.postName || "").toLowerCase().includes(q) ||
                              (p.department || "").toLowerCase().includes(q) ||
                              (p.subDepartment || "").toLowerCase().includes(q) ||
                              (p.railway || "").toLowerCase().includes(q)
                            );
                          });

                          let bUR = 0, bSC = 0, bST = 0, bOBC = 0, bEWS = 0, bTot = 0, bExSM = 0, bPwBD = 0;
                          (board.posts || []).forEach((p) => {
                            const u = Number(p.ur) || 0;
                            const sc = Number(p.sc) || 0;
                            const st = Number(p.st) || 0;
                            const ob = Number(p.obc) || 0;
                            const ew = Number(p.ews) || 0;
                            const tot = Number(p.total) || (u + sc + st + ob + ew);
                            const ex = Number(p.exsm) || 0;
                            const pw = typeof p.pwbd === "object"
                              ? Object.values(p.pwbd).reduce((a, b) => a + (Number(b) || 0), 0)
                              : Number(p.pwbd) || 0;

                            bUR += u; bSC += sc; bST += st; bOBC += ob; bEWS += ew; bTot += tot; bExSM += ex; bPwBD += pw;
                            grandUR += u; grandSC += sc; grandST += st; grandOBC += ob; grandEWS += ew; grandTotal += tot; grandExSM += ex; grandPwBD += pw;
                          });

                          return (
                            <React.Fragment key={board.rrb}>
                              <tr className="jd-rrb-board-header-row">
                                <td colSpan={13}>
                                  <div className="jd-rrb-board-header-content">
                                    <div className="jd-rrb-board-title-group">
                                      <span className="jd-rrb-board-icon">🚆</span>
                                      <strong className="jd-rrb-board-name">{board.rrb}</strong>
                                      <span className="jd-rrb-board-count-badge">{board.posts?.length || 0} Posts</span>
                                    </div>
                                    <div className="jd-rrb-board-stat-badge">
                                      Board Subtotal: <strong>{bTot.toLocaleString("en-IN")} Vacancies</strong>
                                    </div>
                                  </div>
                                </td>
                              </tr>

                              {filteredPosts.map((post, pIdx) => (
                                <tr key={pIdx} className="jd-rrb-post-row">
                                  <td style={{ textAlign: "center" }}>
                                    <span className="jd-rrb-cat-num">{post.catNo}</span>
                                  </td>
                                  <td>
                                    <div className="jd-rrb-post-name">{post.postName}</div>
                                  </td>
                                  <td>
                                    <span className="jd-rrb-dept-pill">{post.department || "General"}</span>
                                  </td>
                                  <td>
                                    <span className="jd-rrb-subdept-text">{post.subDepartment || "—"}</span>
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <span className="jd-rrb-zone-badge">
                                      {post.railway || "WR"}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{post.ur ?? 0}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{post.sc ?? 0}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{post.st ?? 0}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{post.obc ?? 0}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell">{post.ews ?? 0}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--total">
                                    <strong>{post.total}</strong>
                                  </td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">{post.exsm ?? 0}</td>
                                  <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">
                                    {typeof post.pwbd === "object"
                                      ? Object.values(post.pwbd).reduce((a, b) => a + (Number(b) || 0), 0)
                                      : post.pwbd ?? 0}
                                  </td>
                                </tr>
                              ))}

                              {filteredPosts.length === 0 && (
                                <tr className="jd-rrb-empty-row">
                                  <td colSpan={13}>
                                    No posts matching "{rrbSearchTerm}" under {board.rrb}.
                                  </td>
                                </tr>
                              )}

                              <tr className="jd-rrb-subtotal-row">
                                <td colSpan={5} className="jd-rrb-subtotal-label">
                                  Subtotal for {board.rrb}:
                                </td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell">{bUR}</td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell">{bSC}</td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell">{bST}</td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell">{bOBC}</td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell">{bEWS}</td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--total">
                                  <strong>{bTot}</strong>
                                </td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">{bExSM}</td>
                                <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--sub">{bPwBD}</td>
                              </tr>
                            </React.Fragment>
                          );
                        })}

                        {displayedBoards.length > 0 && (
                          <tr className="jd-rrb-grandtotal-row">
                            <td colSpan={5} className="jd-rrb-grandtotal-label">
                              Grand Total ({allBoards.length} RRB Boards):
                            </td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell">{grandUR.toLocaleString("en-IN")}</td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell">{grandSC.toLocaleString("en-IN")}</td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell">{grandST.toLocaleString("en-IN")}</td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell">{grandOBC.toLocaleString("en-IN")}</td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell">{grandEWS.toLocaleString("en-IN")}</td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell jd-num-cell--grand">
                              <strong>{grandTotal.toLocaleString("en-IN")}</strong>
                            </td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell">{grandExSM.toLocaleString("en-IN")}</td>
                            <td style={{ textAlign: "center" }} className="jd-num-cell">{grandPwBD.toLocaleString("en-IN")}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section4Vacancy;
