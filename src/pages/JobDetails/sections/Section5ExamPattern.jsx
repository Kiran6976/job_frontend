import React, { useState } from "react";
import "./Section5ExamPattern.css";

const Section5ExamPattern = ({ job }) => {
  const [examPatternStageTab, setExamPatternStageTab] = useState("prelims");

  const ep = job?.examPattern || {};
  const stages = ep.stages && ep.stages.length > 0 ? ep.stages : [
    { id: "prelims", name: "Prelims", subtext: "Objective Type", icon: "file" },
    { id: "mains", name: "Mains", subtext: "Descriptive Type", icon: "edit" },
    { id: "interview", name: "Personality Test", subtext: "Interview Round", icon: "user" },
  ];

  // Default fallback dataset for UPSC stages
  const DEFAULT_STAGES = {
    prelims: {
      stageTitle: "Preliminary Examination (Prelims)",
      stageBadge: "Qualifying Stage",
      stageDescription: "The Preliminary Examination consists of two objective type papers. It is a screening test to shortlist candidates for the Main Examination.",
      papers: [
        { paper: "Paper I", subject: "General Studies (GS)", questions: "100", marks: "200", duration: "2 Hours\n(9:30 AM – 11:30 AM)", nature: "Objective Type (MCQs)" },
        { paper: "Paper II", subject: "Civil Services Aptitude Test (CSAT)", questions: "80", marks: "200", duration: "2 Hours\n(2:30 PM – 4:30 PM)", nature: "Objective Type (MCQs)" },
      ],
      keyPoints: [
        "Both papers are of objective type (MCQs).",
        "Questions are based on the syllabus prescribed by UPSC.",
        "Paper II (CSAT) is qualifying in nature (minimum 33% marks required).",
        "Marks obtained in Prelims are not counted for final merit.",
        "Candidates who qualify Prelims appear for Mains.",
      ],
      quote: "The Prelims test your preparation, but Mains tests your perspective.",
      subjectsCovered: [
        "Current events of national and international importance",
        "History of India and Indian National Movement",
        "Indian and World Geography",
        "Indian Polity and Governance",
        "Economic and Social Development",
        "Environment, Ecology and Biodiversity",
        "General Science",
        "Important Government Schemes",
        "And related topics",
      ],
      markingScheme: {
        correct: "+2 marks",
        incorrect: "-0.66 marks",
        unanswered: "No marks",
        totalPaper1: "200",
        totalPaper2: "200",
      },
      negativeMarking: {
        text: "There is negative marking in both Paper I and Paper II.",
        penalty: "-0.66 marks",
        penaltyLabel: "for each incorrect answer",
        advice: "Candidates are advised to attempt questions carefully and avoid unnecessary guessing.",
      },
    },
    mains: {
      stageTitle: "Civil Services (Main) Examination",
      stageBadge: "Merit Ranking Stage",
      stageDescription: "Written examination consisting of 9 papers designed to assess the academic and intellectual qualities of candidates rather than merely the range of their information.",
      papers: [
        { paper: "Paper A", subject: "Indian Language (Qualifying)", questions: "Subjective", marks: "300", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper B", subject: "English (Qualifying)", questions: "Subjective", marks: "300", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper I", subject: "Essay", questions: "Subjective", marks: "250", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper II", subject: "General Studies I (Heritage, History & Geo)", questions: "20", marks: "250", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper III", subject: "General Studies II (Governance, Polity, IR)", questions: "20", marks: "250", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper IV", subject: "General Studies III (Economy, Sci & Tech, Env)", questions: "20", marks: "250", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper V", subject: "General Studies IV (Ethics, Integrity & Aptitude)", questions: "19", marks: "250", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper VI", subject: "Optional Subject - Paper 1", questions: "Subjective", marks: "250", duration: "3 Hours", nature: "Descriptive Type" },
        { paper: "Paper VII", subject: "Optional Subject - Paper 2", questions: "Subjective", marks: "250", duration: "3 Hours", nature: "Descriptive Type" },
      ],
      keyPoints: [
        "Consists of 9 written descriptive papers held over 5 days.",
        "Paper A & B are qualifying (25% minimum marks required) and not counted in merit.",
        "Papers I to VII (7 papers × 250 = 1,750 marks) decide merit for interview call.",
        "Answer scripts must be written in the chosen medium / language.",
        "Focuses on clear, coherent, and structured answer writing within time limit.",
      ],
      quote: "Mains is an endurance test of critical thinking, analytical depth, and clear expression.",
      subjectsCovered: [
        "Essay writing on diverse philosophical & socio-economic themes",
        "Indian Heritage, Culture, History & World Geography (GS I)",
        "Governance, Constitution, Polity, Social Justice & IR (GS II)",
        "Technology, Economic Development, Biodiversity & Security (GS III)",
        "Ethics, Integrity, Human Values & Case Studies (GS IV)",
        "Selected Optional Subject (Paper 1 & Paper 2)",
      ],
      markingScheme: {
        correct: "Based on depth & structure",
        incorrect: "No negative marking",
        unanswered: "0 marks",
        totalPaper1: "1750 (Merit Total)",
        totalPaper2: "600 (Qualifying)",
      },
      negativeMarking: {
        text: "There is NO negative marking in the descriptive Main Examination.",
        penalty: "0 marks",
        penaltyLabel: "deducted for wrong answers",
        advice: "Handwriting must be legible. Irrelevant answers or superficial points may result in deduction of marks.",
      },
    },
    interview: {
      stageTitle: "Personality Test (Interview)",
      stageBadge: "Final Selection Stage",
      stageDescription: "The candidate will be interviewed by a competent and unbiased Board to assess personal suitability for a career in public services by purposive conversation.",
      papers: [
        { paper: "Personality Test", subject: "Personality Assessment / Viva-Voce", questions: "Conversational", marks: "275", duration: "Approx. 30–45 Mins", nature: "Oral Interview" },
      ],
      keyPoints: [
        "Evaluates mental alertness, critical assimilation, and balanced judgment.",
        "Assesses moral integrity, leadership qualities, and intellectual depth.",
        "Held at UPSC Dholpur House, New Delhi before an expert board.",
        "No minimum qualifying marks are required in the personality test.",
        "Final Merit = Mains (1,750 marks) + Interview (275 marks) = 2,025 Marks Total.",
      ],
      quote: "The board does not test what you know, but who you are and how you think.",
      subjectsCovered: [
        "Detailed Application Form (DAF) verification & personal background",
        "Home state, regional culture, history & local governance issues",
        "National & international current affairs, policy debates & diplomacy",
        "Situational case questions, administrative dilemmas & ethical choices",
        "Hobbies, interests, service preferences & cadre allocation rationale",
      ],
      markingScheme: {
        correct: "Awarded out of 275 marks",
        incorrect: "No deduction",
        unanswered: "N/A",
        totalPaper1: "275 (Interview)",
        totalPaper2: "2025 (Grand Total)",
      },
      negativeMarking: {
        text: "No negative marking applies during the Personality Test.",
        penalty: "0",
        penaltyLabel: "no penalty score",
        advice: "Honesty, composure, respectful communication and logical justification of opinions are key.",
      },
    },
  };

  // Active stage data lookup: checks stageData[tab], falls back to top-level if prelims or default dataset
  const activeStageObj =
    (ep.stageData && ep.stageData[examPatternStageTab]) ||
    (examPatternStageTab === "prelims"
      ? {
          stageTitle: ep.stageTitle,
          stageBadge: ep.stageBadge,
          stageDescription: ep.stageDescription,
          papers: ep.papers,
          keyPoints: ep.keyPoints,
          quote: ep.quote,
          subjectsCovered: ep.subjectsCovered,
          markingScheme: ep.markingScheme,
          negativeMarking: ep.negativeMarking,
        }
      : null) ||
    DEFAULT_STAGES[examPatternStageTab] ||
    DEFAULT_STAGES.prelims;

  const stageTitle = activeStageObj.stageTitle || DEFAULT_STAGES[examPatternStageTab]?.stageTitle || "Examination Stage";
  const stageBadge = activeStageObj.stageBadge || DEFAULT_STAGES[examPatternStageTab]?.stageBadge || "";
  const stageDescription = activeStageObj.stageDescription || DEFAULT_STAGES[examPatternStageTab]?.stageDescription || "";

  const papers =
    activeStageObj.papers && activeStageObj.papers.length > 0
      ? activeStageObj.papers
      : DEFAULT_STAGES[examPatternStageTab]?.papers || DEFAULT_STAGES.prelims.papers;

  const keyPoints =
    activeStageObj.keyPoints && activeStageObj.keyPoints.length > 0
      ? activeStageObj.keyPoints
      : DEFAULT_STAGES[examPatternStageTab]?.keyPoints || DEFAULT_STAGES.prelims.keyPoints;

  const quote = activeStageObj.quote || DEFAULT_STAGES[examPatternStageTab]?.quote || "";

  const subjectsCovered =
    activeStageObj.subjectsCovered && activeStageObj.subjectsCovered.length > 0
      ? activeStageObj.subjectsCovered
      : DEFAULT_STAGES[examPatternStageTab]?.subjectsCovered || DEFAULT_STAGES.prelims.subjectsCovered;

  const markingScheme = activeStageObj.markingScheme || DEFAULT_STAGES[examPatternStageTab]?.markingScheme || DEFAULT_STAGES.prelims.markingScheme;
  const negativeMarking = activeStageObj.negativeMarking || DEFAULT_STAGES[examPatternStageTab]?.negativeMarking || DEFAULT_STAGES.prelims.negativeMarking;
  const officialNote = ep.officialNote || "The exam pattern is as per the official UPSC notification. In case of any changes, the latest notification will be considered final.";

  return (
    <section className="jd-pattern-section" id="exam-pattern">
      {/* Header with National Monument Artwork & Slogans */}
      <div className="jd-pattern__header">
        <div className="jd-pattern__header-text">
          <span className="jd-vac__section-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="8" x2="16" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="12" y2="16" />
            </svg>
            <span>Exam Pattern</span>
          </span>

          <h2 className="jd-pattern__title">
            Exam <span className="jd-pattern__title-accent">Pattern</span>
          </h2>
          <p className="jd-pattern__subtitle">
            Understand the complete exam structure, subjects, marking scheme and duration for {job.title || "UPSC Civil Services Examination 2025"}.
          </p>
        </div>

        {/* Right Artwork with Ashoka Emblem / Building Banner */}
        <div className="jd-pattern__header-art">
          <div className="jd-pattern__quote-callout">
            "Discipline<br />
            today, a better<br />
            <span className="jd-pattern__quote-highlight">nation tomorrow."</span>
            <div className="jd-pattern__slogan-sub">
              CIVIL SERVICES • BUILD A STRONGER INDIA
            </div>
          </div>

          <div className="jd-pattern__monument-wrap">
            <img
              src={job.bannerUrl || "/UPSC.png"}
              alt="National Monument"
              className="jd-pattern__monument-img"
              onError={(e) => {
                e.target.src = "/UPSC.png";
              }}
            />
            <div className="jd-pattern__corner-badge">
              SAME<br />EXAM<br /><strong>BIGGER</strong><br />PURPOSE
            </div>
          </div>
        </div>
      </div>

      {/* Stage Navigation Tabs (Prelims, Mains, Personality Test) */}
      <div className="jd-pattern__stage-tabs">
        {stages.map((stg) => {
          const isActive = examPatternStageTab === stg.id;
          return (
            <button
              key={stg.id}
              type="button"
              className={`jd-pattern__stage-tab ${isActive ? "active" : ""}`}
              onClick={() => setExamPatternStageTab(stg.id)}
            >
              <div className="jd-pattern__stage-tab-icon">
                {stg.id === "prelims" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                )}
                {stg.id === "mains" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                )}
                {stg.id !== "prelims" && stg.id !== "mains" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )}
              </div>
              <div className="jd-pattern__stage-tab-text">
                <strong className="jd-pattern__stage-tab-name">{stg.name}</strong>
                <span className="jd-pattern__stage-tab-sub">{stg.subtext}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Content Grid: Left Stage Details + Right Key Points Sidebar */}
      <div className="jd-pattern__grid">
        {/* Left Column: Stage Header & Papers Table */}
        <div className="jd-pattern__main-col">
          <div className="jd-pattern__card">
            {/* Stage Header Info */}
            <div className="jd-pattern__stage-banner">
              <div className="jd-pattern__stage-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="jd-pattern__stage-info">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <h3 className="jd-pattern__stage-title">{stageTitle}</h3>
                  {stageBadge && (
                    <span className="jd-pattern__stage-badge">{stageBadge}</span>
                  )}
                </div>
                <p className="jd-pattern__stage-desc">{stageDescription}</p>
              </div>
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="jd-pattern__scroll-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                <path d="M17 8l4 4m0 0l-4 4" />
              </svg>
              <span>Scroll horizontally to view full table</span>
            </div>

            {/* Papers Breakdown Table */}
            <div className="jd-pattern__table-wrap">
              <table className="jd-pattern__data-table">
                <thead>
                  <tr>
                    <th>Paper</th>
                    <th>Subject</th>
                    <th style={{ textAlign: "center" }}>No. of Questions</th>
                    <th style={{ textAlign: "center" }}>Maximum Marks</th>
                    <th>Duration</th>
                    <th>Nature</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="jd-pattern__paper-badge">{row.paper}</span>
                      </td>
                      <td>
                        <strong className="jd-pattern__subject-name">{row.subject}</strong>
                      </td>
                      <td style={{ textAlign: "center" }}>{row.questions}</td>
                      <td style={{ textAlign: "center" }}>
                        <strong>{row.marks}</strong>
                      </td>
                      <td>
                        <span style={{ whiteSpace: "pre-line" }}>{row.duration}</span>
                      </td>
                      <td>
                        <span className="jd-pattern__nature-pill">{row.nature}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Key Points Card & Quote */}
        <div className="jd-pattern__sidebar">
          <div className="jd-pattern__sidebar-card">
            <div className="jd-pattern__sidebar-header">
              <div className="jd-pattern__sidebar-icon">💡</div>
              <h4 className="jd-pattern__sidebar-title">Key Points</h4>
            </div>

            <ul className="jd-pattern__keypoints-list">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="jd-pattern__keypoint-item">
                  <span className="jd-pattern__keypoint-check">☑</span>
                  <span className="jd-pattern__keypoint-text">{point}</span>
                </li>
              ))}
            </ul>

            {quote && (
              <div className="jd-pattern__quote-box">
                <span className="jd-pattern__quote-icon">“</span>
                <p className="jd-pattern__quote-text">"{quote}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom 4-Card Grid: Subjects Covered, Marking Scheme, Negative Marking, Download Detailed Syllabus */}
      <div className="jd-pattern__bottom-grid">
        {/* 1. Subjects Covered */}
        <div className="jd-pattern__subcard">
          <div className="jd-pattern__subcard-header">
            <div className="jd-pattern__subcard-icon jd-pattern__subcard-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h4 className="jd-pattern__subcard-title">
              Subjects Covered ({stages.find((s) => s.id === examPatternStageTab)?.name || "Stage"})
            </h4>
          </div>
          <ul className="jd-pattern__subjects-list">
            {subjectsCovered.map((sub, idx) => (
              <li key={idx}>
                <span className="jd-pattern__subject-check">✔</span>
                <span>{sub}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Marking Scheme */}
        <div className="jd-pattern__subcard">
          <div className="jd-pattern__subcard-header">
            <div className="jd-pattern__subcard-icon jd-pattern__subcard-icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h4 className="jd-pattern__subcard-title">Marking Scheme</h4>
          </div>
          <div className="jd-pattern__marking-list">
            <div className="jd-pattern__marking-item">
              <span className="jd-pattern__marking-check">✔</span>
              <span className="jd-pattern__marking-label">Each correct answer:</span>
              <span className="jd-pattern__marking-pill jd-pattern__marking-pill--pos">
                {markingScheme.correct || "+2 marks"}
              </span>
            </div>
            <div className="jd-pattern__marking-item">
              <span className="jd-pattern__marking-check">✔</span>
              <span className="jd-pattern__marking-label">Each incorrect answer:</span>
              <span className="jd-pattern__marking-pill jd-pattern__marking-pill--neg">
                {markingScheme.incorrect || "-0.66 marks"}
              </span>
            </div>
            <div className="jd-pattern__marking-item">
              <span className="jd-pattern__marking-check">✔</span>
              <span className="jd-pattern__marking-label">Unanswered questions:</span>
              <span className="jd-pattern__marking-val">
                {markingScheme.unanswered || "No marks"}
              </span>
            </div>
            <div className="jd-pattern__marking-item">
              <span className="jd-pattern__marking-check">✔</span>
              <span className="jd-pattern__marking-label">Total Marks (Paper I):</span>
              <strong className="jd-pattern__marking-val">{markingScheme.totalPaper1 || "200"}</strong>
            </div>
            <div className="jd-pattern__marking-item">
              <span className="jd-pattern__marking-check">✔</span>
              <span className="jd-pattern__marking-label">Total Marks (Paper II):</span>
              <strong className="jd-pattern__marking-val">{markingScheme.totalPaper2 || "200"}</strong>
            </div>
          </div>
        </div>

        {/* 3. Negative Marking */}
        <div className="jd-pattern__subcard jd-pattern__subcard--warning">
          <div className="jd-pattern__subcard-header">
            <div className="jd-pattern__subcard-icon jd-pattern__subcard-icon--amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h4 className="jd-pattern__subcard-title">Negative Marking</h4>
          </div>
          <p className="jd-pattern__neg-desc">{negativeMarking.text}</p>
          <div className="jd-pattern__neg-callout">
            <div className="jd-pattern__neg-circle">
              <span className="jd-pattern__neg-minus">–</span>
            </div>
            <div>
              <strong className="jd-pattern__neg-val">{negativeMarking.penalty}</strong>
              <span className="jd-pattern__neg-val-sub">{negativeMarking.penaltyLabel}</span>
            </div>
          </div>
          {negativeMarking.advice && (
            <div className="jd-pattern__neg-advice">
              <span className="jd-pattern__neg-advice-icon">ℹ</span>
              <span>{negativeMarking.advice}</span>
            </div>
          )}
        </div>

        {/* 4. Download Detailed Syllabus */}
        <div className="jd-pattern__subcard">
          <div className="jd-pattern__subcard-header">
            <div className="jd-pattern__subcard-icon jd-pattern__subcard-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h4 className="jd-pattern__subcard-title">Download Detailed Syllabus</h4>
              <p className="jd-pattern__syllabus-sub">
                Get the official UPSC syllabus for Prelims and Mains in PDF format.
              </p>
            </div>
          </div>

          <div className="jd-pattern__syllabus-btns">
            <a
              href={ep.prelimsSyllabusUrl || job.notificationPdfUrl || "https://upsc.gov.in"}
              target="_blank"
              rel="noreferrer"
              className="jd-pattern__download-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Prelims Syllabus &rarr;</span>
            </a>

            <a
              href={ep.mainsSyllabusUrl || job.notificationPdfUrl || "https://upsc.gov.in"}
              target="_blank"
              rel="noreferrer"
              className="jd-pattern__download-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Mains Syllabus &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Notification Note / Disclaimer */}
      {officialNote && (
        <div className="jd-pattern__footer-note">
          <span className="jd-pattern__footer-icon">ℹ</span>
          <span>
            <strong>Note:</strong> {officialNote}
          </span>
        </div>
      )}
    </section>
  );
};

export default Section5ExamPattern;
