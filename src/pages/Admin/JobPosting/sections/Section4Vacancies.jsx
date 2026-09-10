import React, { useState, useEffect, useMemo } from "react";
import "./Section4Vacancies.css";

// 21 Official Railway Recruitment Boards
export const OFFICIAL_RRBS = [
  "RRB - AHMEDABAD",
  "RRB - AJMER",
  "RRB - PRAYAGRAJ (ALLAHABAD)",
  "RRB - BANGALORE",
  "RRB - BHOPAL",
  "RRB - BHUBANESWAR",
  "RRB - BILASPUR",
  "RRB - CHANDIGARH",
  "RRB - CHENNAI",
  "RRB - GORAKHPUR",
  "RRB - GUWAHATI",
  "RRB - JAMMU-SRINAGAR",
  "RRB - KOLKATA",
  "RRB - MALDA",
  "RRB - MUMBAI",
  "RRB - MUZAFFARPUR",
  "RRB - PATNA",
  "RRB - RANCHI",
  "RRB - SECUNDERABAD",
  "RRB - SILIGURI",
  "RRB - THIRUVANANTHAPURAM",
];

// Sample RRB JE Presets matching official CEN 04/2026 notification
const SAMPLE_RRB_JE_VACANCIES = [
  {
    rrb: "RRB - AHMEDABAD",
    posts: [
      { catNo: "6", postName: "JUNIOR ENGINEER / ELECTRICAL / EMU", department: "ELECTRICAL", subDepartment: "EMU", railway: "WR", ur: 0, sc: 0, st: 1, obc: 0, ews: 1, total: 2, exsm: 0, pwbd: 0 },
      { catNo: "7", postName: "JUNIOR ENGINEER / ELECTRICAL / GENERAL SERVICES", department: "ELECTRICAL", subDepartment: "GENERAL SERVICES", railway: "WR", ur: 7, sc: 3, st: 0, obc: 7, ews: 1, total: 18, exsm: 1, pwbd: 1 },
      { catNo: "8", postName: "JUNIOR ENGINEER / ELECTRICAL / TRD", department: "ELECTRICAL", subDepartment: "TRD", railway: "WR", ur: 2, sc: 2, st: 2, obc: 2, ews: 1, total: 9, exsm: 1, pwbd: 0 },
      { catNo: "13", postName: "JUNIOR ENGINEER / CIVIL / DESIGN DRAWING AND ESTIMATION", department: "ENGINEERING", subDepartment: "DESIGN AND DRAWING", railway: "WR", ur: 0, sc: 0, st: 2, obc: 1, ews: 0, total: 3, exsm: 0, pwbd: 0 },
      { catNo: "17", postName: "JUNIOR ENGINEER / P. WAY", department: "ENGINEERING", subDepartment: "P. WAY", railway: "WR", ur: 12, sc: 8, st: 5, obc: 11, ews: 5, total: 41, exsm: 4, pwbd: 2 },
      { catNo: "18", postName: "JUNIOR ENGINEER / WORKS", department: "ENGINEERING", subDepartment: "WORKS", railway: "WR", ur: 7, sc: 2, st: 1, obc: 3, ews: 1, total: 14, exsm: 2, pwbd: 1 },
      { catNo: "21", postName: "JUNIOR ENGINEER / CARRIAGE and WAGON", department: "MECHANICAL", subDepartment: "CARRIAGE AND WAGON", railway: "WR", ur: 1, sc: 1, st: 0, obc: 2, ews: 0, total: 4, exsm: 0, pwbd: 0 },
      { catNo: "27", postName: "JUNIOR ENGINEER / MECHANICAL (WORKSHOP)", department: "MECHANICAL", subDepartment: "WORKSHOP", railway: "WR", ur: 7, sc: 2, st: 3, obc: 4, ews: 3, total: 19, exsm: 2, pwbd: 1 },
      { catNo: "35", postName: "JUNIOR ENGINEER / S and T / SIGNAL", department: "S and T", subDepartment: "SIGNAL", railway: "WR", ur: 5, sc: 1, st: 2, obc: 3, ews: 2, total: 13, exsm: 1, pwbd: 0 },
      { catNo: "36", postName: "JUNIOR ENGINEER / S and T / TELECOMMUNICATION", department: "S and T", subDepartment: "TELECOMMUNICATION", railway: "WR", ur: 0, sc: 1, st: 1, obc: 0, ews: 0, total: 2, exsm: 0, pwbd: 0 },
      { catNo: "37", postName: "DEPOT MATERIAL SUPERINTENDENT", department: "STORES", subDepartment: "STORES DEPOT", railway: "WR", ur: 4, sc: 4, st: 2, obc: 5, ews: 3, total: 18, exsm: 2, pwbd: 1 },
    ],
  },
  {
    rrb: "RRB - AJMER",
    posts: [
      { catNo: "6", postName: "JUNIOR ENGINEER / ELECTRICAL / EMU", department: "ELECTRICAL", subDepartment: "EMU", railway: "NWR", ur: 4, sc: 1, st: 1, obc: 2, ews: 1, total: 9, exsm: 1, pwbd: 0 },
      { catNo: "17", postName: "JUNIOR ENGINEER / P. WAY", department: "ENGINEERING", subDepartment: "P. WAY", railway: "WCR", ur: 10, sc: 4, st: 2, obc: 7, ews: 3, total: 26, exsm: 3, pwbd: 1 },
      { catNo: "18", postName: "JUNIOR ENGINEER / WORKS", department: "ENGINEERING", subDepartment: "WORKS", railway: "NWR", ur: 6, sc: 2, st: 1, obc: 4, ews: 2, total: 15, exsm: 1, pwbd: 0 },
    ],
  },
];

const Section4Vacancies = ({
  formData,
  setFormData,
  handleChange,
  vacancyCategories,
  setVacancyCategories,
  handleCategoryVacancyChange,
  isManageCatOpen,
  setIsManageCatOpen,
  newCatName,
  setNewCatName,
  newCatLabel,
  setNewCatLabel,
  handleAddCustomCategory,
  handleRemoveCategory,
  handleApplyVacancyPreset,
  handleAddServiceRow,
  handleRemoveServiceRow,
  newServiceName,
  setNewServiceName,
  newServiceUR,
  setNewServiceUR,
  newServiceOBC,
  setNewServiceOBC,
  newServiceSC,
  setNewServiceSC,
  newServiceST,
  setNewServiceST,
}) => {
  // Table mode: "standard" or "rrb"
  const tableMode = formData.vacancyTableType || "standard";

  const setTableMode = (mode) => {
    setFormData((prev) => ({
      ...prev,
      vacancyTableType: mode,
    }));
  };

  // Auto-switch to RRB mode if organization mentions RRB or Railway
  useEffect(() => {
    const org = (formData.organization || "").toLowerCase();
    const title = (formData.title || "").toLowerCase();
    if (
      (org.includes("railway") || org.includes("rrb") || title.includes("rrb")) &&
      tableMode !== "rrb" &&
      (!formData.serviceVacancies || formData.serviceVacancies.length === 0)
    ) {
      setTableMode("rrb");
    }
  }, [formData.organization, formData.title]);

  // RRB State
  const rrbVacancies = formData.rrbVacancies || [];
  const [selectedRrbBoard, setSelectedRrbBoard] = useState(OFFICIAL_RRBS[0]);
  const [activeBoardTab, setActiveBoardTab] = useState(
    rrbVacancies.length > 0 ? rrbVacancies[0].rrb : OFFICIAL_RRBS[0]
  );

  // New RRB post input state
  const [newCatNo, setNewCatNo] = useState("");
  const [newPostName, setNewPostName] = useState("");
  const [newDept, setNewDept] = useState("");
  const [newSubDept, setNewSubDept] = useState("");
  const [newRly, setNewRly] = useState("WR");
  const [newUR, setNewUR] = useState("");
  const [newSC, setNewSC] = useState("");
  const [newST, setNewST] = useState("");
  const [newOBC, setNewOBC] = useState("");
  const [newEWS, setNewEWS] = useState("");
  const [newExsm, setNewExsm] = useState("");
  const [newPwbd, setNewPwbd] = useState("");

  // Calculate grand totals across all RRB boards
  const rrbGrandTotals = useMemo(() => {
    let ur = 0, sc = 0, st = 0, obc = 0, ews = 0, total = 0, exsm = 0, postsCount = 0;
    (rrbVacancies || []).forEach((board) => {
      (board.posts || []).forEach((p) => {
        ur += Number(p.ur) || 0;
        sc += Number(p.sc) || 0;
        st += Number(p.st) || 0;
        obc += Number(p.obc) || 0;
        ews += Number(p.ews) || 0;
        total += Number(p.total) || ((Number(p.ur) || 0) + (Number(p.sc) || 0) + (Number(p.st) || 0) + (Number(p.obc) || 0) + (Number(p.ews) || 0));
        exsm += Number(p.exsm) || 0;
        postsCount++;
      });
    });
    return { ur, sc, st, obc, ews, total, exsm, postsCount, boardsCount: rrbVacancies.length };
  }, [rrbVacancies]);

  // Sync grand totals to categoryVacancies and vacancies count
  const handleSyncRrbTotalsToForm = () => {
    setFormData((prev) => ({
      ...prev,
      vacancies: String(rrbGrandTotals.total),
      postsDescription: `${rrbGrandTotals.postsCount} Posts across ${rrbGrandTotals.boardsCount} RRBs`,
      participatingServices: String(rrbGrandTotals.boardsCount),
      categoryVacancies: {
        ...prev.categoryVacancies,
        ur: String(rrbGrandTotals.ur),
        sc: String(rrbGrandTotals.sc),
        st: String(rrbGrandTotals.st),
        obc: String(rrbGrandTotals.obc),
        ews: String(rrbGrandTotals.ews),
      },
    }));
  };

  // Add new RRB Board section
  const handleAddRrbBoard = (boardName) => {
    if (!boardName) return;
    const exists = rrbVacancies.some((b) => b.rrb === boardName);
    if (exists) {
      setActiveBoardTab(boardName);
      return;
    }
    const updated = [...rrbVacancies, { rrb: boardName, posts: [] }];
    setFormData((prev) => ({ ...prev, rrbVacancies: updated }));
    setActiveBoardTab(boardName);
  };

  // Remove an RRB Board section
  const handleRemoveRrbBoard = (boardName) => {
    const updated = rrbVacancies.filter((b) => b.rrb !== boardName);
    setFormData((prev) => ({ ...prev, rrbVacancies: updated }));
    if (activeBoardTab === boardName && updated.length > 0) {
      setActiveBoardTab(updated[0].rrb);
    }
  };

  // Add post under active RRB board
  const handleAddPostToActiveBoard = () => {
    if (!newPostName.trim()) return;
    const ur = Number(newUR) || 0;
    const sc = Number(newSC) || 0;
    const st = Number(newST) || 0;
    const obc = Number(newOBC) || 0;
    const ews = Number(newEWS) || 0;
    const total = ur + sc + st + obc + ews;
    const exsm = Number(newExsm) || 0;
    const pwbd = Number(newPwbd) || 0;

    const newPost = {
      catNo: newCatNo.trim() || String((currentBoardPosts.length || 0) + 1),
      postName: newPostName.trim(),
      department: newDept.trim(),
      subDepartment: newSubDept.trim(),
      railway: newRly.trim().toUpperCase(),
      ur,
      sc,
      st,
      obc,
      ews,
      total,
      exsm,
      pwbd,
    };

    const targetBoard = activeBoardTab || rrbVacancies[0]?.rrb || OFFICIAL_RRBS[0];
    let boardFound = false;
    const updated = rrbVacancies.map((board) => {
      if (board.rrb === targetBoard) {
        boardFound = true;
        return {
          ...board,
          posts: [...(board.posts || []), newPost],
        };
      }
      return board;
    });

    if (!boardFound) {
      updated.push({
        rrb: targetBoard,
        posts: [newPost],
      });
      setActiveBoardTab(targetBoard);
    }

    setFormData((prev) => ({ ...prev, rrbVacancies: updated }));

    // Reset inputs
    setNewPostName("");
    setNewDept("");
    setNewSubDept("");
    setNewUR("");
    setNewSC("");
    setNewST("");
    setNewOBC("");
    setNewEWS("");
    setNewExsm("");
    setNewPwbd("");
  };

  // Remove post row
  const handleRemovePostRow = (boardName, postIdx) => {
    const updated = rrbVacancies.map((board) => {
      if (board.rrb === boardName) {
        return {
          ...board,
          posts: board.posts.filter((_, idx) => idx !== postIdx),
        };
      }
      return board;
    });
    setFormData((prev) => ({ ...prev, rrbVacancies: updated }));
  };

  // Apply Sample RRB Preset
  const handleApplySampleRrb = () => {
    setFormData((prev) => ({
      ...prev,
      vacancyTableType: "rrb",
      rrbVacancies: SAMPLE_RRB_JE_VACANCIES,
      vacancies: "193",
      participatingServices: "2",
      postsDescription: "Junior Engineers across 2 RRB Boards",
      categoryVacancies: {
        ...prev.categoryVacancies,
        ur: "67",
        sc: "33",
        st: "25",
        obc: "51",
        ews: "24",
      },
    }));
    setActiveBoardTab(SAMPLE_RRB_JE_VACANCIES[0].rrb);
  };

  const currentBoardObj = rrbVacancies.find((b) => b.rrb === activeBoardTab);
  const currentBoardPosts = currentBoardObj?.posts || [];

  return (
    <div
      className="ajp__card ajp__section-vacancies"
      style={{
        padding: "1.25rem",
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(59, 130, 246, 0.25)",
        marginTop: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#93c5fd",
              margin: "0 0 2px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📊 Section 4: Vacancy Details &amp; Distribution
          </h3>
          <p style={{ fontSize: "0.775rem", color: "#94a3b8", margin: 0 }}>
            Configure total vacancies, category quotas, and the post distribution table.
          </p>
        </div>

        {/* Mode Switcher & Presets */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="ajp__vacancy-mode-toggle">
            <button
              type="button"
              className={`ajp__vmode-btn ${tableMode === "standard" ? "is-active" : ""}`}
              onClick={() => setTableMode("standard")}
            >
              Standard (UPSC)
            </button>
            <button
              type="button"
              className={`ajp__vmode-btn ${tableMode === "rrb" ? "is-active" : ""}`}
              onClick={() => setTableMode("rrb")}
            >
              🚆 RRB Regional Table
            </button>
          </div>

          {tableMode === "standard" ? (
            <>
              <button
                type="button"
                className="ajp__attempts-preset-btn"
                onClick={() => handleApplyVacancyPreset("upsc")}
              >
                ⚡ UPSC Standard (24 Services)
              </button>
              <button
                type="button"
                className="ajp__attempts-preset-btn ajp__attempts-preset-btn--clear"
                onClick={() => handleApplyVacancyPreset("clear")}
              >
                Clear Services
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="ajp__attempts-preset-btn"
                style={{ background: "rgba(59, 130, 246, 0.25)", color: "#93c5fd", borderColor: "#3b82f6" }}
                onClick={handleApplySampleRrb}
              >
                ⚡ RRB JE Sample (Ahmedabad &amp; Ajmer)
              </button>
              <button
                type="button"
                className="ajp__attempts-preset-btn ajp__attempts-preset-btn--clear"
                onClick={() => setFormData((prev) => ({ ...prev, rrbVacancies: [] }))}
              >
                Clear RRBs
              </button>
            </>
          )}
        </div>
      </div>

      {/* Row 1: Key Vacancy Stats Inputs */}
      <div className="ajp__form-row ajp__form-row--3col" style={{ marginTop: "1rem" }}>
        <div className="ajp__field">
          <label className="ajp__label">Total Vacancies (Count)</label>
          <input
            type="number"
            name="vacancies"
            className="ajp__input"
            placeholder="e.g. 1056"
            value={formData.vacancies ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">
            {tableMode === "rrb" ? "Participating RRB Boards" : "Participating Services"}
          </label>
          <input
            type="text"
            name="participatingServices"
            className="ajp__input"
            placeholder={tableMode === "rrb" ? "e.g. 21" : "e.g. 24"}
            value={formData.participatingServices ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Posts Scope Description</label>
          <input
            type="text"
            name="postsDescription"
            className="ajp__input"
            placeholder={tableMode === "rrb" ? "e.g. Junior Engineers across RRB branches" : "e.g. Multiple"}
            value={formData.postsDescription ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Sub-section: Category-wise Quotas */}
      <div
        style={{
          marginTop: "1.25rem",
          padding: "1rem",
          background: "rgba(30, 41, 59, 0.5)",
          borderRadius: "12px",
          border: "1px dashed rgba(148, 163, 184, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          <div>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f1f5f9" }}>
              Category-wise Vacancy Breakdown
            </span>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginLeft: "8px" }}>
              (Drives the interactive Bar &amp; Donut Charts on the details page)
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {tableMode === "rrb" && rrbVacancies.length > 0 && (
              <button
                type="button"
                className="ajp__attempts-preset-btn"
                style={{ fontSize: "0.72rem", padding: "0.3rem 0.75rem", color: "#38bdf8", borderColor: "#0284c7" }}
                onClick={handleSyncRrbTotalsToForm}
                title="Calculate and sync totals from all RRB post rows"
              >
                🔄 Auto-Calculate From RRBs
              </button>
            )}
            <button
              type="button"
              className="ajp__attempts-preset-btn"
              style={{
                fontSize: "0.72rem",
                padding: "0.3rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
              onClick={() => setIsManageCatOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Manage Categories ({vacancyCategories.length})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Category Input Grid */}
        <div
          className="ajp__form-row"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: "0.75rem" }}
        >
          {vacancyCategories.map((cat) => (
            <div className="ajp__field" key={cat.key}>
              <label
                className="ajp__label"
                style={{
                  color: cat.color || "#38bdf8",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: cat.color || "#38bdf8",
                  }}
                />
                {cat.name} {cat.label ? `(${cat.label})` : ""}
              </label>
              <input
                type="number"
                className="ajp__input"
                placeholder={cat.placeholder ? `e.g. ${cat.placeholder}` : "e.g. 0"}
                value={formData.categoryVacancies?.[cat.key] ?? ""}
                onChange={(e) => handleCategoryVacancyChange(cat.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Calculated Sum indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0.75rem",
            fontSize: "0.75rem",
            color: "#94a3b8",
          }}
        >
          <span>
            Sum of Categories:{" "}
            <strong style={{ color: "#f8fafc" }}>
              {vacancyCategories
                .reduce((acc, cat) => acc + (Number(formData.categoryVacancies?.[cat.key]) || 0), 0)
                .toLocaleString("en-IN")}{" "}
            </strong>
            vacancies
          </span>
          <span>
            Target Total:{" "}
            <strong style={{ color: "#38bdf8" }}>
              {(parseInt(formData.vacancies, 10) || 0).toLocaleString("en-IN")}
            </strong>
          </span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 1: STANDARD SERVICE-WISE TABLE (UPSC)                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {tableMode === "standard" && (
        <div style={{ marginTop: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.6rem",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f1f5f9" }}>
              Service-wise Vacancy Distribution Table ({formData.serviceVacancies?.length || 0} Services)
            </span>
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
              (Appears in the Service-wise Breakdown table on the details page)
            </span>
          </div>

          <div
            style={{
              overflowX: "auto",
              background: "#0f172a",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "0.85rem",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ background: "rgba(30, 41, 59, 0.8)", color: "#94a3b8", textAlign: "left" }}>
                  <th style={{ padding: "8px 12px", width: "40px" }}>#</th>
                  <th style={{ padding: "8px 12px" }}>Service / Post Name</th>
                  <th style={{ padding: "8px 12px", textAlign: "center" }}>UR</th>
                  <th style={{ padding: "8px 12px", textAlign: "center" }}>OBC</th>
                  <th style={{ padding: "8px 12px", textAlign: "center" }}>SC</th>
                  <th style={{ padding: "8px 12px", textAlign: "center" }}>ST</th>
                  <th style={{ padding: "8px 12px", textAlign: "center" }}>Total</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", width: "50px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(formData.serviceVacancies || []).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "8px 12px", color: "#64748b" }}>{idx + 1}</td>
                    <td style={{ padding: "8px 12px", color: "#f1f5f9", fontWeight: 600 }}>{row.service}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center", color: "#38bdf8" }}>{row.ur}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center", color: "#34d399" }}>{row.obc}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center", color: "#fcd34d" }}>{row.sc}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center", color: "#c084fc" }}>{row.st}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center", color: "#ffffff", fontWeight: 700 }}>
                      {row.total || (Number(row.ur) || 0) + (Number(row.obc) || 0) + (Number(row.sc) || 0) + (Number(row.st) || 0)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceRow(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#f87171",
                          cursor: "pointer",
                          fontSize: "1rem",
                          lineHeight: 1,
                        }}
                        title="Remove service row"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
                {(formData.serviceVacancies || []).length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>
                      No individual services added. Click "⚡ UPSC Standard" above or add a new service below.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add New Service Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr repeat(4, 0.7fr) auto",
              gap: "0.5rem",
              alignItems: "center",
              background: "rgba(30, 41, 59, 0.4)",
              padding: "0.75rem",
              borderRadius: "10px",
              border: "1px solid rgba(148, 163, 184, 0.15)",
            }}
          >
            <input
              type="text"
              className="ajp__input ajp__input--sm"
              placeholder="Service Name (e.g. Indian Administrative Service)"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
            />
            <input
              type="number"
              className="ajp__input ajp__input--sm"
              placeholder="UR"
              value={newServiceUR}
              onChange={(e) => setNewServiceUR(e.target.value)}
            />
            <input
              type="number"
              className="ajp__input ajp__input--sm"
              placeholder="OBC"
              value={newServiceOBC}
              onChange={(e) => setNewServiceOBC(e.target.value)}
            />
            <input
              type="number"
              className="ajp__input ajp__input--sm"
              placeholder="SC"
              value={newServiceSC}
              onChange={(e) => setNewServiceSC(e.target.value)}
            />
            <input
              type="number"
              className="ajp__input ajp__input--sm"
              placeholder="ST"
              value={newServiceST}
              onChange={(e) => setNewServiceST(e.target.value)}
            />
            <button
              type="button"
              className="ajp__attempts-add-btn"
              style={{ height: "34px", padding: "0 14px", fontSize: "0.78rem" }}
              onClick={handleAddServiceRow}
            >
              + Add Service
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 2: RAILWAY RECRUITMENT BOARD (RRB) HIERARCHICAL TABLE    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {tableMode === "rrb" && (
        <div className="ajp__rrb-editor-section" style={{ marginTop: "1.25rem" }}>
          {/* Header & Grand Total Banner */}
          <div className="ajp__rrb-grand-summary">
            <div className="ajp__rrb-grand-header">
              <span className="ajp__rrb-grand-title">🚆 RRB Vacancies Summary:</span>
              <span className="ajp__rrb-grand-stats">
                <strong>{rrbGrandTotals.boardsCount}</strong> RRB Boards ·{" "}
                <strong>{rrbGrandTotals.postsCount}</strong> Post Listings ·{" "}
                <span className="ajp__rrb-highlight-total">
                  {rrbGrandTotals.total.toLocaleString("en-IN")} Total Vacancies
                </span>
              </span>
            </div>
            <div className="ajp__rrb-grand-badges">
              <span className="ajp__rrb-badge ajp__rrb-badge--ur">UR: {rrbGrandTotals.ur}</span>
              <span className="ajp__rrb-badge ajp__rrb-badge--sc">SC: {rrbGrandTotals.sc}</span>
              <span className="ajp__rrb-badge ajp__rrb-badge--st">ST: {rrbGrandTotals.st}</span>
              <span className="ajp__rrb-badge ajp__rrb-badge--obc">OBC: {rrbGrandTotals.obc}</span>
              <span className="ajp__rrb-badge ajp__rrb-badge--ews">EWS: {rrbGrandTotals.ews}</span>
              <span className="ajp__rrb-badge ajp__rrb-badge--exsm">ExSM: {rrbGrandTotals.exsm}</span>
            </div>
          </div>

          {/* RRB Board Selector / Adder */}
          <div className="ajp__rrb-board-bar">
            <div className="ajp__rrb-tabs-scroll">
              {rrbVacancies.map((board) => {
                const bTotal = (board.posts || []).reduce(
                  (sum, p) => sum + (Number(p.total) || 0),
                  0
                );
                return (
                  <div
                    key={board.rrb}
                    className={`ajp__rrb-tab-pill ${activeBoardTab === board.rrb ? "is-active" : ""}`}
                    onClick={() => setActiveBoardTab(board.rrb)}
                  >
                    <span>{board.rrb}</span>
                    <span className="ajp__rrb-tab-count">({bTotal})</span>
                    <button
                      type="button"
                      className="ajp__rrb-tab-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRrbBoard(board.rrb);
                      }}
                      title={`Remove ${board.rrb}`}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
              {rrbVacancies.length === 0 && (
                <span style={{ fontSize: "0.78rem", color: "#94a3b8", padding: "6px 10px" }}>
                  No RRB boards added yet. Choose from dropdown or click sample preset.
                </span>
              )}
            </div>

            {/* Dropdown to add official RRB */}
            <div className="ajp__rrb-add-board-wrap">
              <select
                className="ajp__input ajp__input--sm ajp__rrb-select"
                value={selectedRrbBoard}
                onChange={(e) => setSelectedRrbBoard(e.target.value)}
              >
                {OFFICIAL_RRBS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="ajp__attempts-preset-btn"
                style={{ background: "#2563eb", color: "#fff", border: "none", whiteSpace: "nowrap" }}
                onClick={() => handleAddRrbBoard(selectedRrbBoard)}
              >
                + Add RRB Board
              </button>
            </div>
          </div>

          {/* Active RRB Board Table */}
          {activeBoardTab && (
            <div className="ajp__rrb-active-board-card">
              <div className="ajp__rrb-board-title-row">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.1rem" }}>📍</span>
                  <h4 style={{ margin: 0, fontSize: "0.92rem", color: "#67e8f9", fontWeight: 700 }}>
                    {activeBoardTab}
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                    ({currentBoardPosts.length} posts listed)
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#cbd5e1" }}>
                  Board Subtotal:{" "}
                  <strong style={{ color: "#38bdf8" }}>
                    {currentBoardPosts.reduce((s, p) => s + (Number(p.total) || 0), 0)} Vacancies
                  </strong>
                </div>
              </div>

              {/* Table displaying the posts under this RRB */}
              <div style={{ overflowX: "auto", background: "#0b1120", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <table className="ajp__rrb-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}>Cat#</th>
                      <th>Name of the Post</th>
                      <th>Department</th>
                      <th>Sub-Dept</th>
                      <th style={{ textAlign: "center" }}>Rly/PU</th>
                      <th style={{ textAlign: "center" }} className="col-ur">UR</th>
                      <th style={{ textAlign: "center" }} className="col-sc">SC</th>
                      <th style={{ textAlign: "center" }} className="col-st">ST</th>
                      <th style={{ textAlign: "center" }} className="col-obc">OBC</th>
                      <th style={{ textAlign: "center" }} className="col-ews">EWS</th>
                      <th style={{ textAlign: "center" }} className="col-tot">Total</th>
                      <th style={{ textAlign: "center" }}>ExSM</th>
                      <th style={{ textAlign: "center" }}>PwBD</th>
                      <th style={{ textAlign: "center", width: "40px" }}>Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBoardPosts.map((post, idx) => (
                      <tr key={idx}>
                        <td style={{ color: "#94a3b8", fontWeight: 700 }}>{post.catNo}</td>
                        <td style={{ fontWeight: 600, color: "#f8fafc" }}>{post.postName}</td>
                        <td style={{ color: "#cbd5e1" }}>{post.department}</td>
                        <td style={{ color: "#94a3b8" }}>{post.subDepartment || "-"}</td>
                        <td style={{ textAlign: "center" }}>
                          <span className="ajp__rrb-rly-pill">{post.railway || "WR"}</span>
                        </td>
                        <td style={{ textAlign: "center", color: "#38bdf8" }}>{post.ur}</td>
                        <td style={{ textAlign: "center", color: "#fcd34d" }}>{post.sc}</td>
                        <td style={{ textAlign: "center", color: "#c084fc" }}>{post.st}</td>
                        <td style={{ textAlign: "center", color: "#34d399" }}>{post.obc}</td>
                        <td style={{ textAlign: "center", color: "#fb923c" }}>{post.ews}</td>
                        <td style={{ textAlign: "center", color: "#fff", fontWeight: 700 }}>{post.total}</td>
                        <td style={{ textAlign: "center", color: "#94a3b8" }}>{post.exsm || 0}</td>
                        <td style={{ textAlign: "center", color: "#94a3b8" }}>
                          {typeof post.pwbd === "object"
                            ? Object.values(post.pwbd).reduce((a, b) => a + (Number(b) || 0), 0)
                            : post.pwbd || 0}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="ajp__rrb-del-btn"
                            onClick={() => handleRemovePostRow(activeBoardTab, idx)}
                            title="Remove post"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentBoardPosts.length === 0 && (
                      <tr>
                        <td colSpan={14} style={{ textAlign: "center", padding: "20px", color: "#64748b", fontStyle: "italic" }}>
                          No post vacancies added for {activeBoardTab} yet. Use the form below to add posts.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {currentBoardPosts.length > 0 && (
                    <tfoot>
                      <tr className="ajp__rrb-subtotal-row">
                        <td colSpan={5} style={{ textAlign: "right", fontWeight: 700 }}>
                          Sub-Total ({activeBoardTab}):
                        </td>
                        <td style={{ textAlign: "center" }}>{currentBoardPosts.reduce((s, p) => s + (Number(p.ur) || 0), 0)}</td>
                        <td style={{ textAlign: "center" }}>{currentBoardPosts.reduce((s, p) => s + (Number(p.sc) || 0), 0)}</td>
                        <td style={{ textAlign: "center" }}>{currentBoardPosts.reduce((s, p) => s + (Number(p.st) || 0), 0)}</td>
                        <td style={{ textAlign: "center" }}>{currentBoardPosts.reduce((s, p) => s + (Number(p.obc) || 0), 0)}</td>
                        <td style={{ textAlign: "center" }}>{currentBoardPosts.reduce((s, p) => s + (Number(p.ews) || 0), 0)}</td>
                        <td style={{ textAlign: "center", fontWeight: 800, color: "#38bdf8" }}>
                          {currentBoardPosts.reduce((s, p) => s + (Number(p.total) || 0), 0)}
                        </td>
                        <td style={{ textAlign: "center" }}>{currentBoardPosts.reduce((s, p) => s + (Number(p.exsm) || 0), 0)}</td>
                        <td style={{ textAlign: "center" }}>
                          {currentBoardPosts.reduce((s, p) => {
                            const val = typeof p.pwbd === "object"
                              ? Object.values(p.pwbd).reduce((a, b) => a + (Number(b) || 0), 0)
                              : Number(p.pwbd) || 0;
                            return s + val;
                          }, 0)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Add New Post Form under active RRB */}
              <div className="ajp__rrb-add-post-box">
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#93c5fd", marginBottom: "0.5rem" }}>
                  + Add Post under {activeBoardTab}
                </div>
                <div className="ajp__rrb-add-post-grid">
                  <input
                    type="text"
                    className="ajp__input ajp__input--sm"
                    placeholder="Cat#"
                    style={{ width: "65px" }}
                    value={newCatNo}
                    onChange={(e) => setNewCatNo(e.target.value)}
                  />
                  <input
                    type="text"
                    className="ajp__input ajp__input--sm"
                    placeholder="Name of the Post (e.g. JUNIOR ENGINEER / ELECTRICAL / EMU)"
                    style={{ flex: 2 }}
                    value={newPostName}
                    onChange={(e) => setNewPostName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="ajp__input ajp__input--sm"
                    placeholder="Department (e.g. ELECTRICAL)"
                    style={{ flex: 1.2 }}
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                  />
                  <input
                    type="text"
                    className="ajp__input ajp__input--sm"
                    placeholder="Sub-Dept (e.g. EMU)"
                    style={{ flex: 1 }}
                    value={newSubDept}
                    onChange={(e) => setNewSubDept(e.target.value)}
                  />
                  <input
                    type="text"
                    className="ajp__input ajp__input--sm"
                    placeholder="Rly/PU (e.g. WR)"
                    style={{ width: "80px" }}
                    value={newRly}
                    onChange={(e) => setNewRly(e.target.value)}
                  />
                </div>

                <div className="ajp__rrb-add-post-numbers-row">
                  <div className="ajp__rrb-mini-field">
                    <span>UR</span>
                    <input
                      type="number"
                      className="ajp__input ajp__input--sm"
                      placeholder="0"
                      value={newUR}
                      onChange={(e) => setNewUR(e.target.value)}
                    />
                  </div>
                  <div className="ajp__rrb-mini-field">
                    <span>SC</span>
                    <input
                      type="number"
                      className="ajp__input ajp__input--sm"
                      placeholder="0"
                      value={newSC}
                      onChange={(e) => setNewSC(e.target.value)}
                    />
                  </div>
                  <div className="ajp__rrb-mini-field">
                    <span>ST</span>
                    <input
                      type="number"
                      className="ajp__input ajp__input--sm"
                      placeholder="0"
                      value={newST}
                      onChange={(e) => setNewST(e.target.value)}
                    />
                  </div>
                  <div className="ajp__rrb-mini-field">
                    <span>OBC</span>
                    <input
                      type="number"
                      className="ajp__input ajp__input--sm"
                      placeholder="0"
                      value={newOBC}
                      onChange={(e) => setNewOBC(e.target.value)}
                    />
                  </div>
                  <div className="ajp__rrb-mini-field">
                    <span>EWS</span>
                    <input
                      type="number"
                      className="ajp__input ajp__input--sm"
                      placeholder="0"
                      value={newEWS}
                      onChange={(e) => setNewEWS(e.target.value)}
                    />
                  </div>
                  <div className="ajp__rrb-mini-field">
                    <span>ExSM</span>
                    <input
                      type="number"
                      className="ajp__input ajp__input--sm"
                      placeholder="0"
                      value={newExsm}
                      onChange={(e) => setNewExsm(e.target.value)}
                    />
                  </div>
                  <div className="ajp__rrb-mini-field">
                    <span>PwBD</span>
                    <input
                      type="number"
                      className="ajp__input ajp__input--sm"
                      placeholder="0"
                      value={newPwbd}
                      onChange={(e) => setNewPwbd(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="ajp__attempts-add-btn"
                    style={{ height: "32px", padding: "0 18px", alignSelf: "flex-end" }}
                    onClick={handleAddPostToActiveBoard}
                  >
                    + Add Post Row
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manage Categories Modal */}
      {isManageCatOpen && (
        <div className="ajp-cat-modal-backdrop" onClick={() => setIsManageCatOpen(false)}>
          <div className="ajp-cat-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ajp-cat-modal-header">
              <h4 className="ajp-cat-modal-title">
                <span>🏷️</span>
                <span>Manage Vacancy Categories</span>
              </h4>
              <button
                type="button"
                className="ajp-cat-modal-close"
                onClick={() => setIsManageCatOpen(false)}
                title="Close"
              >
                &times;
              </button>
            </div>

            <div className="ajp-cat-modal-body">
              <div>
                <div className="ajp-cat-modal-section-title">
                  Active Categories ({vacancyCategories.length})
                </div>
                <div className="ajp-cat-list">
                  {vacancyCategories.map((cat) => (
                    <div className="ajp-cat-item" key={cat.key}>
                      <div className="ajp-cat-item-left">
                        <span className="ajp-cat-item-dot" style={{ background: cat.color || "#38bdf8" }} />
                        <div>
                          <span className="ajp-cat-item-name">{cat.name}</span>{" "}
                          {cat.label && <span className="ajp-cat-item-label">({cat.label})</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ajp-cat-item-remove"
                        onClick={() => handleRemoveCategory(cat.key)}
                        title={`Remove ${cat.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="ajp-cat-modal-section-title">Add New Category</div>
                <div className="ajp-cat-add-form">
                  <input
                    type="text"
                    className="ajp__input ajp__input--sm"
                    placeholder="Category Code (e.g. EWS, PwBD, ExSM)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    style={{ flex: 1.2 }}
                  />
                  <input
                    type="text"
                    className="ajp__input ajp__input--sm"
                    placeholder="Label (e.g. Economically Weaker Section)"
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    style={{ flex: 1.5 }}
                  />
                  <button
                    type="button"
                    className="ajp__attempts-add-btn"
                    onClick={handleAddCustomCategory}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div className="ajp-cat-modal-footer">
              <button
                type="button"
                className="ajp__attempts-preset-btn"
                style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.45rem 1rem" }}
                onClick={() => setIsManageCatOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section4Vacancies;
