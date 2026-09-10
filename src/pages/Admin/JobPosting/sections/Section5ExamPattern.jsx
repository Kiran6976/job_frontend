import React, { useState } from "react";
import "./Section5ExamPattern.css";

const DEFAULT_UPSC_EXAM_PATTERN = {
  activeTab: "prelims",
  stages: [
    { id: "prelims", name: "Prelims", subtext: "Objective Type", icon: "file" },
    { id: "mains", name: "Mains", subtext: "Descriptive Type", icon: "edit" },
    { id: "interview", name: "Personality Test", subtext: "Interview Round", icon: "user" },
  ],
  stageData: {
    prelims: {
      stageTitle: "Preliminary Examination (Prelims)",
      stageBadge: "Qualifying Stage",
      stageDescription:
        "The Preliminary Examination consists of two objective type papers. It is a screening test to shortlist candidates for the Main Examination.",
      papers: [
        {
          paper: "Paper I",
          subject: "General Studies (GS)",
          questions: "100",
          marks: "200",
          duration: "2 Hours (9:30 AM – 11:30 AM)",
          nature: "Objective Type (MCQs)",
        },
        {
          paper: "Paper II",
          subject: "Civil Services Aptitude Test (CSAT)",
          questions: "80",
          marks: "200",
          duration: "2 Hours (2:30 PM – 4:30 PM)",
          nature: "Objective Type (MCQs)",
        },
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
        advice:
          "Candidates are advised to attempt questions carefully and avoid unnecessary guessing.",
      },
    },
    mains: {
      stageTitle: "Civil Services (Main) Examination",
      stageBadge: "Merit Ranking Stage",
      stageDescription:
        "Written examination consisting of 9 papers designed to assess the academic and intellectual qualities of candidates rather than merely the range of their information.",
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
      },
      negativeMarking: {
        text: "There is NO negative marking in the descriptive Main Examination.",
        penalty: "0 marks",
        penaltyLabel: "deducted for wrong answers",
        advice: "Handwriting must be legible. Irrelevant answers may result in deduction of marks.",
      },
    },
    interview: {
      stageTitle: "Personality Test (Interview)",
      stageBadge: "Final Selection Stage",
      stageDescription:
        "The candidate will be interviewed by a competent and unbiased Board to assess personal suitability for a career in public services by purposive conversation.",
      papers: [
        { paper: "Personality Test", subject: "Personality Assessment / Viva-Voce", questions: "Conversational", marks: "275", duration: "Approx. 30–45 Mins", nature: "Oral Interview" },
      ],
      keyPoints: [
        "Evaluates mental alertness, critical assimilation, and balanced judgment.",
        "Assesses moral integrity, leadership qualities, and intellectual depth.",
        "Held at Commission Headquarters before an expert board.",
      ],
      quote: "The board does not test what you know, but who you are and how you think.",
      subjectsCovered: [
        "Detailed Application Form verification & personal background",
        "Home state, regional culture, history & local governance issues",
        "National & international current affairs, policy debates & diplomacy",
      ],
      markingScheme: { correct: "Awarded out of 275 marks", incorrect: "No deduction", unanswered: "N/A" },
      negativeMarking: {
        text: "No negative marking applies during the Personality Test.",
        penalty: "0",
        penaltyLabel: "no penalty score",
        advice: "Honesty, composure, and logical justification of opinions are key.",
      },
    },
  },
  prelimsSyllabusUrl: "",
  mainsSyllabusUrl: "",
  officialNote: "The exam pattern is as per the official notification. In case of any changes, the latest notification will be considered final.",
};

// RRB 2-Stage CBT Pattern Preset
const DEFAULT_RRB_EXAM_PATTERN = {
  activeTab: "prelims",
  stages: [
    { id: "prelims", name: "1st Stage CBT", subtext: "Screening Exam", icon: "laptop" },
    { id: "mains", name: "2nd Stage CBT", subtext: "Technical Exam", icon: "cpu" },
    { id: "interview", name: "DV & Medical", subtext: "Final Verification", icon: "check-circle" },
  ],
  stageData: {
    prelims: {
      stageTitle: "1st Stage Computer Based Test (CBT-1)",
      stageBadge: "Screening Examination",
      stageDescription: "Common for all posts. Objective type multiple choice questions.",
      papers: [
        { paper: "Mathematics", subject: "Mathematics", questions: "30", marks: "30", duration: "90 Minutes", nature: "Objective Type (MCQs)" },
        { paper: "General Intelligence & Reasoning", subject: "Reasoning", questions: "25", marks: "25", duration: "90 Minutes", nature: "Objective Type (MCQs)" },
        { paper: "General Awareness", subject: "General Awareness", questions: "15", marks: "15", duration: "90 Minutes", nature: "Objective Type (MCQs)" },
        { paper: "General Science", subject: "Physics, Chemistry & Life Sciences", questions: "30", marks: "30", duration: "90 Minutes", nature: "Objective Type (MCQs)" },
      ],
      keyPoints: [
        "Total 100 Questions carrying 100 Marks.",
        "Total Duration: 90 Minutes (120 minutes for eligible PwBD candidates).",
        "Negative marking: 1/3rd (0.33) marks deducted for each wrong answer.",
        "Shortlisting for 2nd Stage CBT is 15 times the vacancy count.",
      ],
      quote: "Speed and conceptual accuracy are key to clearing CBT 1.",
      subjectsCovered: [
        "Mathematics (Number systems, BODMAS, Algebra, Geometry, Trigonometry, Statistics)",
        "General Intelligence & Reasoning (Analogies, Coding-Decoding, Syllogism, Venn Diagrams)",
        "General Awareness (Current Affairs, Science & Tech, Sports, Indian Culture, Geography)",
        "General Science (Physics, Chemistry and Life Sciences up to 10th standard)",
      ],
      markingScheme: { correct: "+1 mark", incorrect: "-0.33 marks", unanswered: "0 marks" },
      negativeMarking: {
        text: "There shall be negative marking in CBT (Computer Based Test) and marks shall be deducted for each wrong answer @ 1/3 of the marks allotted for each question.",
        penalty: "-0.33 marks",
        penaltyLabel: "for each wrong answer",
        advice: "Candidates are advised to avoid wild guessing due to 1/3rd penalty.",
      },
    },
    mains: {
      stageTitle: "2nd Stage Computer Based Test (CBT-2)",
      stageBadge: "Technical Qualification Stage",
      stageDescription: "Comprises Part A (General Aptitude) and Part B (Relevant Technical Specialization).",
      papers: [
        { paper: "General Awareness", subject: "Current Affairs & GK", questions: "15", marks: "15", duration: "120 Minutes", nature: "Objective Type (MCQs)" },
        { paper: "Physics & Chemistry", subject: "10th Standard Science", questions: "15", marks: "15", duration: "120 Minutes", nature: "Objective Type (MCQs)" },
        { paper: "Basics of Computers", subject: "Computer Applications & IT", questions: "10", marks: "10", duration: "120 Minutes", nature: "Objective Type (MCQs)" },
        { paper: "Basics of Env & Pollution", subject: "Environmental Science", questions: "10", marks: "10", duration: "120 Minutes", nature: "Objective Type (MCQs)" },
        { paper: "Technical Abilities", subject: "Relevant Engineering Discipline", questions: "100", marks: "100", duration: "120 Minutes", nature: "Objective Type (MCQs)" },
      ],
      keyPoints: [
        "Total 150 questions carrying 150 marks.",
        "Total Duration: 120 minutes (160 mins for PwBD).",
        "Technical Abilities carries 100 marks determining primary merit.",
        "1/3rd negative marking applies for wrong answers.",
      ],
      quote: "Domain technical knowledge determines your final rank.",
      subjectsCovered: [
        "General Awareness & Current Affairs",
        "Physics and Chemistry (10th standard syllabus)",
        "Basics of Computers and Applications (OS, MS Office, Networks)",
        "Basics of Environment and Pollution Control (Air, Water, Noise, Ozone)",
        "Technical Engineering Syllabus (Civil, Mechanical, Electrical, Electronics, IT)",
      ],
      markingScheme: { correct: "+1 mark", incorrect: "-0.33 marks", unanswered: "0 marks" },
      negativeMarking: {
        text: "1/3rd mark will be deducted for each incorrect answer in CBT-2.",
        penalty: "-0.33 marks",
        penaltyLabel: "for each wrong answer",
        advice: "Focus on technical accuracy to maximize your score.",
      },
    },
    interview: {
      stageTitle: "Document Verification (DV) & Medical Examination",
      stageBadge: "Final Appointment Stage",
      stageDescription: "Verification of original certificates and comprehensive railway medical fitness test.",
      papers: [
        { paper: "Document Verification", subject: "Verification of Educational & Community Certificates", questions: "Original Documents", marks: "Qualifying", duration: "1 Day", nature: "Verification" },
      ],
      keyPoints: [
        "Candidates equal to the number of vacancies are called for DV.",
        "Candidates must pass required Railway Medical Fitness Standard (A-3, B-1, or B-2).",
        "Final appointment is subject to medical clearance and document validity.",
      ],
      quote: "Ensure all educational and caste certificates match notification requirements.",
      subjectsCovered: [
        "10th / Matriculation Certificate for Date of Birth verification",
        "Engineering Degree / Diploma Marksheets and Certificates",
        "Caste Certificates in Central Railway format (SC, ST, OBC-NCL, EWS)",
        "Medical Fitness Test as per Railway Medical Manual",
      ],
      markingScheme: { correct: "Qualifying", incorrect: "Disqualification if ineligible", unanswered: "N/A" },
      negativeMarking: { text: "No negative marking applies.", penalty: "0", penaltyLabel: "no penalty", advice: "Carry all original certificates along with 2 sets of self-attested copies." },
    },
  },
  prelimsSyllabusUrl: "",
  mainsSyllabusUrl: "",
  officialNote: "Railway recruitment strictly follows the official CEN notification guidelines and normalized score rules.",
};

const Section5ExamPattern = ({
  formData,
  setFormData,
  showNotification,
}) => {
  const [adminSelectedStage, setAdminSelectedStage] = useState("prelims");

  // New Paper inputs state
  const [newPaperData, setNewPaperData] = useState({
    paper: "",
    subject: "",
    questions: "",
    marks: "",
    duration: "",
    nature: "Objective Type (MCQs)",
  });

  const [newKeyPointInput, setNewKeyPointInput] = useState("");
  const [newSubjectInput, setNewSubjectInput] = useState("");

  const getActiveStageData = () => {
    return formData.examPattern?.stageData?.[adminSelectedStage] || {};
  };

  const handleStageFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      examPattern: {
        ...prev.examPattern,
        stageData: {
          ...prev.examPattern?.stageData,
          [adminSelectedStage]: {
            ...prev.examPattern?.stageData?.[adminSelectedStage],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleStageMarkingSchemeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      examPattern: {
        ...prev.examPattern,
        stageData: {
          ...prev.examPattern?.stageData,
          [adminSelectedStage]: {
            ...prev.examPattern?.stageData?.[adminSelectedStage],
            markingScheme: {
              ...prev.examPattern?.stageData?.[adminSelectedStage]?.markingScheme,
              [field]: value,
            },
          },
        },
      },
    }));
  };

  const handleStageNegativeMarkingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      examPattern: {
        ...prev.examPattern,
        stageData: {
          ...prev.examPattern?.stageData,
          [adminSelectedStage]: {
            ...prev.examPattern?.stageData?.[adminSelectedStage],
            negativeMarking: {
              ...prev.examPattern?.stageData?.[adminSelectedStage]?.negativeMarking,
              [field]: value,
            },
          },
        },
      },
    }));
  };

  const handleExamPatternGlobalFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      examPattern: {
        ...prev.examPattern,
        [field]: value,
      },
    }));
  };

  const handleAddPaper = () => {
    if (!newPaperData.paper.trim() || !newPaperData.subject.trim()) return;
    const currentPapers = getActiveStageData().papers || [];
    handleStageFieldChange("papers", [...currentPapers, { ...newPaperData }]);
    setNewPaperData({
      paper: "",
      subject: "",
      questions: "",
      marks: "",
      duration: "",
      nature: "Objective Type (MCQs)",
    });
  };

  const handleRemovePaper = (index) => {
    const currentPapers = getActiveStageData().papers || [];
    handleStageFieldChange(
      "papers",
      currentPapers.filter((_, idx) => idx !== index)
    );
  };

  const handleAddKeyPoint = () => {
    if (!newKeyPointInput.trim()) return;
    const currentKPs = getActiveStageData().keyPoints || [];
    handleStageFieldChange("keyPoints", [...currentKPs, newKeyPointInput.trim()]);
    setNewKeyPointInput("");
  };

  const handleRemoveKeyPoint = (index) => {
    const currentKPs = getActiveStageData().keyPoints || [];
    handleStageFieldChange(
      "keyPoints",
      currentKPs.filter((_, idx) => idx !== index)
    );
  };

  const handleAddSubjectCovered = () => {
    if (!newSubjectInput.trim()) return;
    const currentSubs = getActiveStageData().subjectsCovered || [];
    handleStageFieldChange("subjectsCovered", [...currentSubs, newSubjectInput.trim()]);
    setNewSubjectInput("");
  };

  const handleRemoveSubjectCovered = (index) => {
    const currentSubs = getActiveStageData().subjectsCovered || [];
    handleStageFieldChange(
      "subjectsCovered",
      currentSubs.filter((_, idx) => idx !== index)
    );
  };

  const activeData = getActiveStageData();

  return (
    <div
      className="ajp__card ajp__section-exam-pattern"
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
            📋 Section 5: Exam Pattern &amp; Multi-Stage Structure
          </h3>
          <p style={{ fontSize: "0.775rem", color: "#94a3b8", margin: 0 }}>
            Configure examination stages, papers, questions, marks, duration, syllabus topics, and negative marking rules.
          </p>
        </div>

        {/* Quick Presets for Exam Pattern */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="ajp__attempts-preset-btn"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                examPattern: DEFAULT_UPSC_EXAM_PATTERN,
              }));
              if (showNotification) {
                showNotification("Loaded UPSC 3-Stage Exam Pattern Preset!", "success");
              }
            }}
          >
            ⚡ UPSC 3-Stage Preset
          </button>
          <button
            type="button"
            className="ajp__attempts-preset-btn"
            style={{ background: "rgba(59, 130, 246, 0.25)", color: "#93c5fd", borderColor: "#3b82f6" }}
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                examPattern: DEFAULT_RRB_EXAM_PATTERN,
              }));
              if (showNotification) {
                showNotification("Loaded RRB 2-Stage CBT Exam Pattern Preset!", "success");
              }
            }}
          >
            ⚡ RRB CBT 1 &amp; 2 Preset
          </button>
        </div>
      </div>

      {/* Stage Selector Pills (Prelims, Mains, Personality Test) */}
      <div
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
          padding: "0.75rem",
          background: "rgba(30, 41, 59, 0.6)",
          borderRadius: "12px",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#f8fafc",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🎯 Select Stage to Edit:</span>
            <span style={{ color: "#38bdf8", textTransform: "uppercase" }}>[{adminSelectedStage}]</span>
          </span>
          <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
            Customize papers, marks, syllabus, and scoring rules for each stage independently.
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "prelims", name: "Prelims / CBT 1", subtext: "Stage 1", icon: "📄" },
            { id: "mains", name: "Mains / CBT 2", subtext: "Stage 2", icon: "✍️" },
            { id: "interview", name: "Interview / DV", subtext: "Final Stage", icon: "🎙️" },
          ].map((stg) => {
            const isSelected = adminSelectedStage === stg.id;
            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => setAdminSelectedStage(stg.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: isSelected
                    ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
                    : "rgba(15, 23, 42, 0.6)",
                  color: isSelected ? "#ffffff" : "#94a3b8",
                  border: isSelected ? "1px solid #60a5fa" : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isSelected ? "0 2px 10px rgba(37, 99, 235, 0.3)" : "none",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{stg.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div>{stg.name}</div>
                  <div style={{ fontSize: "0.68rem", opacity: 0.8 }}>{stg.subtext}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Stage Info & Description */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">Stage Title</label>
          <input
            type="text"
            className="ajp__input"
            placeholder="e.g. Preliminary Examination (Prelims) or 1st Stage CBT"
            value={activeData.stageTitle ?? ""}
            onChange={(e) => handleStageFieldChange("stageTitle", e.target.value)}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Stage Badge</label>
          <input
            type="text"
            className="ajp__input"
            placeholder="e.g. Qualifying Stage or Screening Test"
            value={activeData.stageBadge ?? ""}
            onChange={(e) => handleStageFieldChange("stageBadge", e.target.value)}
          />
        </div>
      </div>

      <div className="ajp__field" style={{ marginTop: "0.75rem" }}>
        <label className="ajp__label">Stage Description</label>
        <textarea
          className="ajp__textarea"
          rows={2}
          placeholder="Brief summary of what this examination stage consists of..."
          value={activeData.stageDescription ?? ""}
          onChange={(e) => handleStageFieldChange("stageDescription", e.target.value)}
        />
      </div>

      {/* 2. Exam Papers Table Editor */}
      <div style={{ marginTop: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.6rem",
          }}
        >
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f1f5f9" }}>
            Papers Breakdown Table for {adminSelectedStage.toUpperCase()} (
            {(activeData.papers || []).length} Papers)
          </span>
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
            (Columns: Paper, Subject, Questions, Marks, Duration, Nature)
          </span>
        </div>

        <div
          style={{
            overflowX: "auto",
            background: "#0f172a",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "0.75rem",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
            <thead>
              <tr style={{ background: "rgba(30, 41, 59, 0.8)", color: "#94a3b8", textAlign: "left" }}>
                <th style={{ padding: "8px 12px" }}>Paper</th>
                <th style={{ padding: "8px 12px" }}>Subject</th>
                <th style={{ padding: "8px 12px", textAlign: "center" }}>Questions</th>
                <th style={{ padding: "8px 12px", textAlign: "center" }}>Marks</th>
                <th style={{ padding: "8px 12px" }}>Duration</th>
                <th style={{ padding: "8px 12px" }}>Nature</th>
                <th style={{ padding: "8px 12px", textAlign: "center", width: "40px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {(activeData.papers || []).map((p, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: "8px 12px", color: "#38bdf8", fontWeight: 700 }}>{p.paper}</td>
                  <td style={{ padding: "8px 12px", color: "#f1f5f9", fontWeight: 600 }}>{p.subject}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", color: "#cbd5e1" }}>{p.questions}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", color: "#cbd5e1" }}>{p.marks}</td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{p.duration}</td>
                  <td style={{ padding: "8px 12px", color: "#a78bfa" }}>{p.nature}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleRemovePaper(idx)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#f87171",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                      title="Remove paper"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
              {(activeData.papers || []).length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: "14px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}
                  >
                    No papers added for this stage yet. Fill the row below and click "+ Add Paper".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Paper Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 0.8fr 0.8fr 1.5fr 1.2fr auto",
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
            placeholder="e.g. Paper I"
            value={newPaperData.paper}
            onChange={(e) => setNewPaperData((prev) => ({ ...prev, paper: e.target.value }))}
          />
          <input
            type="text"
            className="ajp__input ajp__input--sm"
            placeholder="e.g. General Studies"
            value={newPaperData.subject}
            onChange={(e) => setNewPaperData((prev) => ({ ...prev, subject: e.target.value }))}
          />
          <input
            type="text"
            className="ajp__input ajp__input--sm"
            placeholder="Qs (e.g. 100)"
            value={newPaperData.questions}
            onChange={(e) => setNewPaperData((prev) => ({ ...prev, questions: e.target.value }))}
          />
          <input
            type="text"
            className="ajp__input ajp__input--sm"
            placeholder="Marks (e.g. 200)"
            value={newPaperData.marks}
            onChange={(e) => setNewPaperData((prev) => ({ ...prev, marks: e.target.value }))}
          />
          <input
            type="text"
            className="ajp__input ajp__input--sm"
            placeholder="Duration (e.g. 90 Mins)"
            value={newPaperData.duration}
            onChange={(e) => setNewPaperData((prev) => ({ ...prev, duration: e.target.value }))}
          />
          <input
            type="text"
            className="ajp__input ajp__input--sm"
            placeholder="Nature (e.g. Objective)"
            value={newPaperData.nature}
            onChange={(e) => setNewPaperData((prev) => ({ ...prev, nature: e.target.value }))}
          />
          <button
            type="button"
            className="ajp__attempts-add-btn"
            style={{ height: "34px", padding: "0 12px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
            onClick={handleAddPaper}
          >
            + Add Paper
          </button>
        </div>
      </div>

      {/* 3. 2-Column: Key Points & Subjects Covered */}
      <div className="ajp__form-row" style={{ marginTop: "1.25rem" }}>
        {/* Left: Key Points */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.4)",
            padding: "1rem",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <label className="ajp__label" style={{ color: "#38bdf8", marginBottom: "0.5rem", display: "block" }}>
            💡 Key Points for {adminSelectedStage.toUpperCase()} ({(activeData.keyPoints || []).length})
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              maxHeight: "160px",
              overflowY: "auto",
              marginBottom: "0.6rem",
            }}
          >
            {(activeData.keyPoints || []).map((kp, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.4rem 0.6rem",
                  background: "rgba(15, 23, 42, 0.6)",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  color: "#e2e8f0",
                }}
              >
                <span>☑ {kp}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyPoint(idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    marginLeft: "6px",
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input
              type="text"
              className="ajp__input ajp__input--sm"
              placeholder="Add key takeaway / point..."
              value={newKeyPointInput}
              onChange={(e) => setNewKeyPointInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddKeyPoint();
                }
              }}
            />
            <button
              type="button"
              className="ajp__attempts-add-btn"
              onClick={handleAddKeyPoint}
              style={{ whiteSpace: "nowrap" }}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Right: Subjects Covered (Syllabus items) */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.4)",
            padding: "1rem",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <label className="ajp__label" style={{ color: "#34d399", marginBottom: "0.5rem", display: "block" }}>
            📖 Subjects Covered ({(activeData.subjectsCovered || []).length})
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              maxHeight: "160px",
              overflowY: "auto",
              marginBottom: "0.6rem",
            }}
          >
            {(activeData.subjectsCovered || []).map((sub, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.4rem 0.6rem",
                  background: "rgba(15, 23, 42, 0.6)",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  color: "#e2e8f0",
                }}
              >
                <span>✔ {sub}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubjectCovered(idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    marginLeft: "6px",
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input
              type="text"
              className="ajp__input ajp__input--sm"
              placeholder="Add subject (e.g. Mathematics, General Science)..."
              value={newSubjectInput}
              onChange={(e) => setNewSubjectInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubjectCovered();
                }
              }}
            />
            <button
              type="button"
              className="ajp__attempts-add-btn"
              onClick={handleAddSubjectCovered}
              style={{ whiteSpace: "nowrap" }}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* 4. Marking Scheme & Negative Marking Settings */}
      <div className="ajp__form-row" style={{ marginTop: "1rem" }}>
        {/* Marking Scheme */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.4)",
            padding: "1rem",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <label className="ajp__label" style={{ color: "#a78bfa", marginBottom: "0.6rem", display: "block" }}>
            📊 Marking Scheme ({adminSelectedStage.toUpperCase()})
          </label>
          <div className="ajp__form-row" style={{ gap: "0.5rem" }}>
            <div className="ajp__field">
              <label className="ajp__label" style={{ fontSize: "0.7rem" }}>Correct Answer</label>
              <input
                type="text"
                className="ajp__input ajp__input--sm"
                placeholder="e.g. +1 mark"
                value={activeData.markingScheme?.correct ?? ""}
                onChange={(e) => handleStageMarkingSchemeChange("correct", e.target.value)}
              />
            </div>
            <div className="ajp__field">
              <label className="ajp__label" style={{ fontSize: "0.7rem" }}>Incorrect Answer</label>
              <input
                type="text"
                className="ajp__input ajp__input--sm"
                placeholder="e.g. -0.33 marks"
                value={activeData.markingScheme?.incorrect ?? ""}
                onChange={(e) => handleStageMarkingSchemeChange("incorrect", e.target.value)}
              />
            </div>
          </div>
          <div className="ajp__field" style={{ marginTop: "0.5rem" }}>
            <label className="ajp__label" style={{ fontSize: "0.7rem" }}>Unanswered Questions</label>
            <input
              type="text"
              className="ajp__input ajp__input--sm"
              placeholder="e.g. 0 marks"
              value={activeData.markingScheme?.unanswered ?? ""}
              onChange={(e) => handleStageMarkingSchemeChange("unanswered", e.target.value)}
            />
          </div>
        </div>

        {/* Negative Marking */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.4)",
            padding: "1rem",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <label className="ajp__label" style={{ color: "#fcd34d", marginBottom: "0.6rem", display: "block" }}>
            ⚠️ Negative Marking Warning ({adminSelectedStage.toUpperCase()})
          </label>
          <div className="ajp__field">
            <label className="ajp__label" style={{ fontSize: "0.7rem" }}>Penalty Amount</label>
            <input
              type="text"
              className="ajp__input ajp__input--sm"
              placeholder="e.g. -0.33 marks (1/3rd)"
              value={activeData.negativeMarking?.penalty ?? ""}
              onChange={(e) => handleStageNegativeMarkingChange("penalty", e.target.value)}
            />
          </div>
          <div className="ajp__field" style={{ marginTop: "0.5rem" }}>
            <label className="ajp__label" style={{ fontSize: "0.7rem" }}>Candidate Advice</label>
            <input
              type="text"
              className="ajp__input ajp__input--sm"
              placeholder="e.g. Candidates are advised to avoid guessing..."
              value={activeData.negativeMarking?.advice ?? ""}
              onChange={(e) => handleStageNegativeMarkingChange("advice", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 5. Motivational Quote */}
      <div className="ajp__field" style={{ marginTop: "1rem" }}>
        <label className="ajp__label">Motivational Quote Callout ({adminSelectedStage.toUpperCase()})</label>
        <input
          type="text"
          className="ajp__input"
          placeholder='e.g. "Precision and discipline turn dreams into appointments."'
          value={activeData.quote ?? ""}
          onChange={(e) => handleStageFieldChange("quote", e.target.value)}
        />
      </div>

      {/* 6. Global Official Disclaimer & Syllabus PDF Links */}
      <div className="ajp__form-row" style={{ marginTop: "1rem" }}>
        <div className="ajp__field">
          <label className="ajp__label">Official Disclaimer / Footnote</label>
          <input
            type="text"
            className="ajp__input"
            placeholder="e.g. The exam pattern is as per the official notification..."
            value={formData.examPattern?.officialNote ?? ""}
            onChange={(e) => handleExamPatternGlobalFieldChange("officialNote", e.target.value)}
          />
        </div>
      </div>

      <div className="ajp__form-row" style={{ marginTop: "1rem" }}>
        <div className="ajp__field">
          <label className="ajp__label">Prelims Syllabus PDF Link (Optional)</label>
          <input
            type="text"
            className="ajp__input"
            placeholder="e.g. https://example.gov.in/syllabus/cbt1.pdf"
            value={formData.examPattern?.prelimsSyllabusUrl ?? ""}
            onChange={(e) => handleExamPatternGlobalFieldChange("prelimsSyllabusUrl", e.target.value)}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Mains Syllabus PDF Link (Optional)</label>
          <input
            type="text"
            className="ajp__input"
            placeholder="e.g. https://example.gov.in/syllabus/cbt2.pdf"
            value={formData.examPattern?.mainsSyllabusUrl ?? ""}
            onChange={(e) => handleExamPatternGlobalFieldChange("mainsSyllabusUrl", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Section5ExamPattern;
