import React, { useState, useRef, useEffect } from "react";
import "./PostJobForm.css";

// Modular Section Components
import AiNotificationBanner from "./sections/AiNotificationBanner";
import Section1BasicInfo from "./sections/Section1BasicInfo";
import Section2MediaBranding from "./sections/Section2MediaBranding";
import Section3Eligibility from "./sections/Section3Eligibility";
import Section4Vacancies from "./sections/Section4Vacancies";
import Section5ExamPattern from "./sections/Section5ExamPattern";
import { API_ENDPOINTS } from "../../../config/api";


// Presets
export const PRESET_LOGOS = [
  {
    name: "Emblem of India",
    url: "/emblem_india.png",
  },
  {
    name: "Indian Railways (RRB)",
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Indian_Railways_logo.svg/300px-Indian_Railways_logo.svg.png",
  },
  {
    name: "Indian Navy",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Emblem_of_the_Indian_Navy.svg/300px-Emblem_of_the_Indian_Navy.svg.png",
  },
  {
    name: "Banking (IBPS)",
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/IBPS_Logo.svg/300px-IBPS_Logo.svg.png",
  },
  {
    name: "Government Commission",
    url: "/JobPortal_Logo_Transparent.png",
  },
];

export const PRESET_BANNERS = [
  { name: "UPSC Rashtrapati Bhavan", url: "/UPSC.png" },
  { name: "Government Hero", url: "/Job_Hero.png" },
  { name: "Opportunity Banner 2", url: "/Job_Second.png" },
  { name: "Modern Career Hero", url: "/Hero_Image.png" },
];

export const QUICK_ATTEMPT_CATEGORIES = [
  "General",
  "OBC",
  "SC/ST",
  "PwBD",
  "EWS",
  "Ex-Servicemen",
  "Female Candidates",
];

export const QUICK_ATTEMPT_VALUES = [
  "6 attempts",
  "9 attempts",
  "No limit",
  "4 attempts",
  "Unlimited",
  "As per rules",
];

export const ATTEMPT_PRESETS = [
  {
    name: "Civil Services (UPSC)",
    rules: [
      { category: "General", attempts: "6 attempts" },
      { category: "OBC", attempts: "9 attempts" },
      { category: "SC/ST", attempts: "No limit" },
      { category: "PwBD", attempts: "9 attempts" },
    ],
    note: "(PwBD candidates get additional attempts as per rules)",
  },
  {
    name: "Banking / SSC / Railways (No Limit)",
    rules: [
      { category: "General", attempts: "No limit" },
      { category: "OBC", attempts: "No limit" },
      { category: "SC/ST", attempts: "No limit" },
      { category: "EWS", attempts: "No limit" },
    ],
    note: "No limit on attempts (subject to upper age limit)",
  },
  {
    name: "Defence (NDA/CDS)",
    rules: [
      { category: "All Candidates", attempts: "Subject to age limit only" },
    ],
    note: "No attempt restrictions as long as age limit criteria is met",
  },
];

const DEFAULT_VACANCY_CATEGORIES = [
  { key: "ur", name: "UR", label: "Unreserved", color: "#38bdf8", placeholder: 430 },
  { key: "obc", name: "OBC", label: "Non-Creamy", color: "#34d399", placeholder: 281 },
  { key: "sc", name: "SC", label: "Scheduled Caste", color: "#fcd34d", placeholder: 175 },
  { key: "st", name: "ST", label: "Scheduled Tribe", color: "#c084fc", placeholder: 170 },
];

const COLOR_PALETTE = [
  "#38bdf8", "#34d399", "#fcd34d", "#c084fc", "#f43f5e", 
  "#fb923c", "#a78bfa", "#22d3ee", "#e879f9", "#4ade80"
];

const PostJobForm = ({
  categories = [],
  organizations = [],
  categoryOptions = [],
  scopeOptions = [],
  statusOptions = [],
  CustomDropdown,
  onJobPublished,
  showNotification,
  editingJob = null,
  onCancelEdit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    category: "Government Exams",
    type: "govt",
    level: "National",
    status: "Apply Soon",
    vacancies: "",
    notificationDate: "",
    applicationStartDate: "",
    applicationLastDate: "",
    examDate: "",
    resultDate: "",
    salary: "",
    location: "All India",
    applyUrl: "",
    notificationPdfUrl: "",
    logoUrl: PRESET_LOGOS[0].url,
    bannerUrl: "/UPSC.png",
    slogan: "Serve Lead Bring Change",
    subSlogan: "A Stronger India Needs You",
    selectionStages: "Prelims • Mains • Interview",
    aboutOrg: "",
    educationalQualification: "A Bachelor's Degree from a recognized University or equivalent.",
    ageLimitMin: "21",
    ageLimitMax: "32",
    ageLimitAsOn: "2025-08-01",
    nationality: "Must be a citizen of India. Tibetan refugees and certain other categories are also eligible as per rules.",
    numberAttempts: "",
    importantNote: "The eligibility criteria mentioned above is a summary. Candidates must read the official notification carefully for complete and accurate details.",
    // Section 4: Vacancies
    participatingServices: "",
    postsDescription: "",
    categoryVacancies: { ur: "", obc: "", sc: "", st: "" },
    serviceVacancies: [],
    vacancyTableType: "standard",
    rrbVacancies: [],
    // Section 5: Exam Pattern
    examPattern: {
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
          stageDescription: "The Preliminary Examination consists of objective type papers.",
          papers: [],
          keyPoints: [],
          subjectsCovered: [],
          markingScheme: { correct: "+2 marks", incorrect: "-0.66 marks", unanswered: "No marks" },
          negativeMarking: { text: "Negative marking applies.", penalty: "-0.66 marks", penaltyLabel: "for each incorrect answer", advice: "Attempt carefully." },
        },
        mains: {
          stageTitle: "Main Examination",
          stageBadge: "Merit Ranking Stage",
          stageDescription: "Written examination assessing comprehensive aptitude.",
          papers: [],
          keyPoints: [],
          subjectsCovered: [],
          markingScheme: { correct: "Descriptive assessment", incorrect: "No negative marking", unanswered: "0 marks" },
          negativeMarking: { text: "No negative marking in descriptive exams.", penalty: "0 marks", penaltyLabel: "no penalty", advice: "Maintain handwriting and structured answers." },
        },
        interview: {
          stageTitle: "Personality Test (Interview)",
          stageBadge: "Final Selection Stage",
          stageDescription: "Interview before a competent board.",
          papers: [],
          keyPoints: [],
          subjectsCovered: [],
          markingScheme: { correct: "Out of 275 marks", incorrect: "No deduction", unanswered: "N/A" },
          negativeMarking: { text: "No negative marking.", penalty: "0", penaltyLabel: "no penalty", advice: "Honesty and composure are key." },
        },
      },
      prelimsSyllabusUrl: "",
      mainsSyllabusUrl: "",
      officialNote: "The exam pattern is as per the official notification.",
    },
    // Application Fee
    applicationFee: null,
    description: "",
  });


  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState(["Civil Services", "IAS", "IPS", "National"]);
  const [tagInput, setTagInput] = useState("");

  // Media Refs & Upload States
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const autoFillInputRef = useRef(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const [, setLogoUploadSuccess] = useState(false);

  // AI Parser States
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState(""); // "uploading" | "extracting" | "ai" | "done" | "error"
  const [autoFillResult, setAutoFillResult] = useState(null);

  // Section 3: Attempts state
  const [attemptRules, setAttemptRules] = useState([]);
  const [additionalAttemptNote, setAdditionalAttemptNote] = useState("");

  // Section 4: Vacancy state
  const [vacancyCategories, setVacancyCategories] = useState(DEFAULT_VACANCY_CATEGORIES);
  const [isManageCatOpen, setIsManageCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceUR, setNewServiceUR] = useState("");
  const [newServiceOBC, setNewServiceOBC] = useState("");
  const [newServiceSC, setNewServiceSC] = useState("");
  const [newServiceST, setNewServiceST] = useState("");

  // Populate when editingJob is provided
  useEffect(() => {
    if (editingJob) {
      setFormData((prev) => ({
        ...prev,
        ...editingJob,
        title: editingJob.title || "",
        organization: editingJob.organization || "",
        category: editingJob.category || "Government Exams",
        type: editingJob.type || "govt",
        level: editingJob.level || "National",
        status: editingJob.status || "Apply Soon",
        vacancies: editingJob.vacancies ? String(editingJob.vacancies) : "",
        notificationDate: editingJob.notificationDate || "",
        applicationStartDate: editingJob.applicationStartDate || "",
        applicationLastDate: editingJob.applicationLastDate || "",
        examDate: editingJob.examDate || "",
        resultDate: editingJob.resultDate || "",
        salary: editingJob.salary || "",
        location: editingJob.location || "All India",
        applyUrl: editingJob.applyUrl || "",
        notificationPdfUrl: editingJob.notificationPdfUrl || "",
        logoUrl: editingJob.logoUrl || PRESET_LOGOS[0].url,
        bannerUrl: editingJob.bannerUrl || "/UPSC.png",
        slogan: editingJob.slogan || "Serve Lead Bring Change",
        subSlogan: editingJob.subSlogan || "A Stronger India Needs You",
        selectionStages: editingJob.selectionStages || "Prelims • Mains • Interview",
        aboutOrg: editingJob.aboutOrg || "",
        educationalQualification: editingJob.educationalQualification || "",
        ageLimitMin: editingJob.ageLimitMin ? String(editingJob.ageLimitMin) : "",
        ageLimitMax: editingJob.ageLimitMax ? String(editingJob.ageLimitMax) : "",
        ageLimitAsOn: editingJob.ageLimitAsOn || "",
        nationality: editingJob.nationality || "",
        numberAttempts: editingJob.numberAttempts || "",
        importantNote: editingJob.importantNote || "",
        participatingServices: editingJob.participatingServices ? String(editingJob.participatingServices) : "",
        postsDescription: editingJob.postsDescription || "",
        categoryVacancies: editingJob.categoryVacancies || { ur: "", obc: "", sc: "", st: "" },
        serviceVacancies: editingJob.serviceVacancies || [],
        vacancyTableType: editingJob.vacancyTableType || (editingJob.rrbVacancies?.length > 0 ? "rrb" : "standard"),
        rrbVacancies: editingJob.rrbVacancies || [],
        examPattern: editingJob.examPattern || prev.examPattern,
        description: editingJob.description || "",
      }));

      if (editingJob.tags && Array.isArray(editingJob.tags)) {
        setTags(editingJob.tags);
      }

      if (editingJob.numberAttempts && editingJob.numberAttempts.trim()) {
        const parts = editingJob.numberAttempts.split("•").map((s) => s.trim()).filter(Boolean);
        const rules = parts
          .filter((s) => s.includes(":"))
          .map((s) => {
            const [cat, att] = s.split(":").map((x) => x.trim());
            return { category: cat, attempts: att };
          });
        setAttemptRules(rules);
        const note = parts.find((s) => !s.includes(":"));
        setAdditionalAttemptNote(note || "");
      }
    }
  }, [editingJob]);

  // Generic Field Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Organization Auto-suggest
  const handleOrgChange = (orgName) => {
    setFormData((prev) => ({ ...prev, organization: orgName }));
    const match = organizations.find((o) => o.name.toLowerCase() === orgName.toLowerCase());
    if (match) {
      setFormData((prev) => ({
        ...prev,
        category: match.category || prev.category,
        logoUrl: match.logoUrl || prev.logoUrl,
        bannerUrl: match.bannerUrl || prev.bannerUrl,
        slogan: match.slogan || prev.slogan,
        subSlogan: match.subSlogan || prev.subSlogan,
        selectionStages: match.selectionStages || prev.selectionStages,
        aboutOrg: match.about || prev.aboutOrg,
        applyUrl: match.officialWebsite || prev.applyUrl,
      }));
    }
  };

  // Application Fee Field Change
  const handleFeeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      applicationFee: {
        ...(prev.applicationFee || {}),
        [field]: value,
      },
    }));
  };

  // Tag Handlers
  const handleAddTag = (e) => {
    e.preventDefault();
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Logo Upload
  const handleLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("logo", file);
    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/upload-logo`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      const uploadedUrl = data.logoUrl || data.url || data.secure_url;
      if (res.ok && data.success && uploadedUrl) {
        setFormData((prev) => ({ ...prev, logoUrl: uploadedUrl }));
        setLogoUploadSuccess(true);
        showNotification("Logo uploaded to Cloudinary successfully!", "success");
      } else {
        showNotification(data.message || "Failed to upload logo", "error");
      }
    } catch {
      showNotification("Error uploading logo to server", "error");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Banner Upload
  const handleBannerFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("banner", file);
    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/upload-banner`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      const uploadedUrl = data.bannerUrl || data.url || data.secure_url;
      if (res.ok && data.success && uploadedUrl) {
        setFormData((prev) => ({ ...prev, bannerUrl: uploadedUrl }));
        showNotification("Banner uploaded to Cloudinary successfully!", "success");
      } else {
        showNotification(data.message || "Failed to upload banner", "error");
      }
    } catch {
      showNotification("Error uploading banner to server", "error");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // PDF Document Upload
  const handlePdfFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(file.name);
    setIsUploadingPdf(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("pdf", file);
    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/upload-pdf`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      const uploadedUrl = data.pdfUrl || data.url || data.secure_url;
      if (res.ok && data.success && uploadedUrl) {
        setFormData((prev) => ({ ...prev, notificationPdfUrl: uploadedUrl }));
        showNotification("PDF uploaded to Cloudinary successfully!", "success");
      } else {
        showNotification(data.message || "Failed to upload PDF", "error");
      }
    } catch {
      showNotification("Error uploading PDF", "error");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // AI PDF Notification Auto-Fill Handler
  const handleAutoFillFromPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (e.target) e.target.value = "";

    if (file.type !== "application/pdf") {
      showNotification("Please upload a PDF file!", "error");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showNotification("PDF must be under 15 MB.", "error");
      return;
    }

    setIsParsing(true);
    setParseStep("uploading");
    setAutoFillResult(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      setParseStep("ai");
      const res = await fetch(`${API_ENDPOINTS.JOB}/parse-pdf-ai`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showNotification(data.message || "AI parsing failed. Please try again.", "error");
        setParseStep("error");
        return;
      }

      const p = data.parsedData || {};
      const pdfUrl = data.pdfUrl || "";

      const updates = {};
      if (p.title) updates.title = p.title;
      if (p.organization) updates.organization = p.organization;
      if (p.category) updates.category = p.category;
      if (p.level) updates.level = p.level;
      if (p.vacancies) updates.vacancies = String(p.vacancies);
      if (p.salary) updates.salary = p.salary;
      if (p.notificationDate) updates.notificationDate = p.notificationDate;
      if (p.applicationStartDate) updates.applicationStartDate = p.applicationStartDate;
      if (p.applicationLastDate) updates.applicationLastDate = p.applicationLastDate;
      if (p.examDate) updates.examDate = p.examDate;
      if (p.educationalQualification) updates.educationalQualification = p.educationalQualification;
      if (p.ageLimitMin) updates.ageLimitMin = String(p.ageLimitMin);
      if (p.ageLimitMax) updates.ageLimitMax = String(p.ageLimitMax);
      if (p.ageLimitAsOn) updates.ageLimitAsOn = p.ageLimitAsOn;
      if (p.nationality) updates.nationality = p.nationality;
      if (p.numberAttempts) updates.numberAttempts = p.numberAttempts;
      if (p.importantNote) updates.importantNote = p.importantNote;
      if (p.aboutOrg) updates.aboutOrg = p.aboutOrg;
      if (p.slogan) updates.slogan = p.slogan;
      if (p.applyUrl) updates.applyUrl = p.applyUrl;
      if (pdfUrl) updates.notificationPdfUrl = pdfUrl;
      if (p.participatingServices) updates.participatingServices = String(p.participatingServices);
      if (p.postsDescription) updates.postsDescription = p.postsDescription;
      if (p.selectionStages) updates.selectionStages = p.selectionStages;

      // Category vacancies
      if (p.categoryVacancies && typeof p.categoryVacancies === "object") {
        updates.categoryVacancies = {
          ur: String(p.categoryVacancies.ur || ""),
          obc: String(p.categoryVacancies.obc || ""),
          sc: String(p.categoryVacancies.sc || ""),
          st: String(p.categoryVacancies.st || ""),
          ews: String(p.categoryVacancies.ews || ""),
          pwbd: String(p.categoryVacancies.pwbd || ""),
        };
        if (p.categoryVacancies.ews) {
          setVacancyCategories((prev) => {
            if (!prev.find((c) => c.key === "ews")) {
              return [...prev, { key: "ews", name: "EWS", label: "Economically Weaker", color: "#fb923c", placeholder: 0 }];
            }
            return prev;
          });
        }
      }

      // RRB Vacancies
      if (p.vacancyTableType) {
        updates.vacancyTableType = p.vacancyTableType;
      }
      if (Array.isArray(p.rrbVacancies) && p.rrbVacancies.length > 0) {
        updates.rrbVacancies = p.rrbVacancies;
        updates.vacancyTableType = "rrb";
        setVacancyCategories((prev) => {
          if (!prev.find((c) => c.key === "ews")) {
            return [...prev, { key: "ews", name: "EWS", label: "Economically Weaker", color: "#fb923c", placeholder: 0 }];
          }
          return prev;
        });
      }

      // Exam pattern
      if (p.examPattern && p.examPattern.stageData) {
        updates.examPattern = {
          ...formData.examPattern,
          officialNote: p.examPattern.officialNote || formData.examPattern?.officialNote,
          stageData: {
            ...formData.examPattern?.stageData,
            ...p.examPattern.stageData,
          },
        };
      }

      // Application Fee
      if (p.applicationFee && typeof p.applicationFee === "object") {
        updates.applicationFee = {
          general: String(p.applicationFee.general || ""),
          sc_st_pwd_female_exsm: String(p.applicationFee.sc_st_pwd_female_exsm || ""),
          exempted: String(p.applicationFee.exempted || ""),
          refundPolicy: p.applicationFee.refundPolicy || "",
          paymentMode: p.applicationFee.paymentMode || "Online",
          note: p.applicationFee.note || "",
        };
      }

      setFormData((prev) => ({ ...prev, ...updates }));


      const filledCount = Object.keys(updates).length;
      setAutoFillResult({ pdfUrl, fieldsCount: filledCount });
      setParseStep("done");
      showNotification(`✅ AI extracted ${filledCount} fields from notification PDF!`, "success");
    } catch (err) {
      console.error("Auto-fill error:", err);
      showNotification("Network error during AI parsing.", "error");
      setParseStep("error");
    } finally {
      setIsParsing(false);
    }
  };

  // Vacancy Handlers
  const handleCategoryVacancyChange = (catKey, val) => {
    const num = val === "" ? "" : Math.max(0, parseInt(val, 10) || 0);
    setFormData((prev) => ({
      ...prev,
      categoryVacancies: {
        ...(prev.categoryVacancies || {}),
        [catKey]: num,
      },
    }));
  };

  const handleAddCustomCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "_");
    if (vacancyCategories.some((c) => c.key === key)) return;

    const assignedColor = COLOR_PALETTE[vacancyCategories.length % COLOR_PALETTE.length];
    const newCategory = {
      key,
      name: trimmed.toUpperCase(),
      label: newCatLabel.trim() || trimmed,
      color: assignedColor,
      placeholder: 0,
    };
    setVacancyCategories((prev) => [...prev, newCategory]);
    setNewCatName("");
    setNewCatLabel("");
  };

  const handleRemoveCategory = (catKey) => {
    if (vacancyCategories.length <= 1) return;
    setVacancyCategories((prev) => prev.filter((c) => c.key !== catKey));
    setFormData((prev) => {
      const updated = { ...(prev.categoryVacancies || {}) };
      delete updated[catKey];
      return { ...prev, categoryVacancies: updated };
    });
  };

  const handleApplyVacancyPreset = (type) => {
    if (type === "upsc") {
      setFormData((prev) => ({
        ...prev,
        participatingServices: "24",
        postsDescription: "Group A & B Central Civil Services",
        serviceVacancies: [
          { sNo: 1, service: "Indian Administrative Service (IAS)", ur: 73, obc: 42, sc: 28, st: 17, total: 160 },
          { sNo: 2, service: "Indian Police Service (IPS)", ur: 60, obc: 38, sc: 27, st: 15, total: 140 },
          { sNo: 3, service: "Indian Foreign Service (IFS)", ur: 34, obc: 22, sc: 16, st: 8, total: 80 },
          { sNo: 4, service: "Indian Revenue Service (IRS - IT)", ur: 55, obc: 36, sc: 24, st: 15, total: 130 },
          { sNo: 5, service: "Indian Audit & Accounts Service", ur: 28, obc: 18, sc: 12, st: 7, total: 65 },
        ],
      }));
    } else if (type === "clear") {
      setFormData((prev) => ({ ...prev, serviceVacancies: [] }));
    }
  };

  const handleAddServiceRow = (e) => {
    if (e) e.preventDefault();
    if (!newServiceName.trim()) return;
    const ur = parseInt(newServiceUR, 10) || 0;
    const obc = parseInt(newServiceOBC, 10) || 0;
    const sc = parseInt(newServiceSC, 10) || 0;
    const st = parseInt(newServiceST, 10) || 0;
    const total = ur + obc + sc + st;

    const existing = formData.serviceVacancies || [];
    setFormData((prev) => ({
      ...prev,
      serviceVacancies: [
        ...existing,
        {
          sNo: existing.length + 1,
          service: newServiceName.trim(),
          ur,
          obc,
          sc,
          st,
          total,
        },
      ],
    }));
    setNewServiceName("");
    setNewServiceUR("");
    setNewServiceOBC("");
    setNewServiceSC("");
    setNewServiceST("");
  };

  const handleRemoveServiceRow = (index) => {
    const filtered = (formData.serviceVacancies || []).filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, serviceVacancies: filtered }));
  };

  // Submit Job
  const handleSubmitJob = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.organization.trim()) {
      showNotification("Please fill in both Title and Organization.", "error");
      return;
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      tags,
    };

    const isEditMode = Boolean(editingJob && (editingJob._id || editingJob.id));
    const targetId = isEditMode ? editingJob._id || editingJob.id : null;
    const url = isEditMode
      ? `${API_ENDPOINTS.JOB}/${targetId}`
      : `${API_ENDPOINTS.JOB}/create`;
    const method = isEditMode ? "PUT" : "POST";


    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(
          isEditMode
            ? "Job notification updated successfully!"
            : "Job notification published successfully!",
          "success"
        );
        if (onJobPublished) onJobPublished(data.job || { ...editingJob, ...payload });
      } else {
        // Fallback local storage
        const existing = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
        let finalJob;
        if (isEditMode) {
          finalJob = { ...editingJob, ...payload, _id: targetId };
          const updated = existing.map((j) =>
            String(j._id) === String(targetId) || String(j.id) === String(targetId) ? finalJob : j
          );
          localStorage.setItem("portal_custom_jobs", JSON.stringify(updated));
        } else {
          finalJob = {
            ...payload,
            _id: "job-" + Date.now(),
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem("portal_custom_jobs", JSON.stringify([finalJob, ...existing]));
        }
        showNotification("Job saved to portal successfully!", "success");
        if (onJobPublished) onJobPublished(finalJob);
      }
    } catch {
      const existing = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
      const finalJob = {
        ...payload,
        _id: "job-" + Date.now(),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("portal_custom_jobs", JSON.stringify([finalJob, ...existing]));
      showNotification("Job saved locally!", "success");
      if (onJobPublished) onJobPublished(finalJob);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ajp__form-container">
      <div className="ajp__card ajp__card--form">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "1rem" }}>
          <div>
            <h2 className="ajp__card-title">
              {editingJob ? `✏️ Edit: ${editingJob.title || "Job Notification"}` : "Notification & Detailed Listing"}
            </h2>
            <p className="ajp__card-desc">
              {editingJob
                ? "Update dates, vacancies, eligibility criteria, or multi-stage exam patterns. Changes apply immediately."
                : "Details entered here will render in the opportunity card AND create the full-fledged detailed page for candidates."}
            </p>
          </div>
          {editingJob && (
            <button
              type="button"
              onClick={onCancelEdit}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(239,68,68,0.35)",
                background: "rgba(239,68,68,0.12)",
                color: "#f87171",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              ✕ Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitJob} className="ajp__form">
          {/* AI Notification Auto-Fill Banner */}
          <AiNotificationBanner
            isParsing={isParsing}
            parseStep={parseStep}
            autoFillResult={autoFillResult}
            autoFillInputRef={autoFillInputRef}
            onFileSelect={handleAutoFillFromPdf}
          />

          {/* Section 1: Basic Info & Timelines */}
          <Section1BasicInfo
            formData={formData}
            handleChange={handleChange}
            handleOrgChange={handleOrgChange}
            handleFeeChange={handleFeeChange}
            organizations={organizations}
            categoryOptions={categoryOptions}
            scopeOptions={scopeOptions}
            statusOptions={statusOptions}
            CustomDropdown={CustomDropdown}
          />

          {/* Section 2: Media, Branding & Official Links */}
          <Section2MediaBranding
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            PRESET_LOGOS={PRESET_LOGOS}
            PRESET_BANNERS={PRESET_BANNERS}
            logoInputRef={logoInputRef}
            bannerInputRef={bannerInputRef}
            pdfInputRef={pdfInputRef}
            isUploadingLogo={isUploadingLogo}
            isUploadingBanner={isUploadingBanner}
            isUploadingPdf={isUploadingPdf}
            handleLogoFileUpload={handleLogoFileUpload}
            handleBannerFileUpload={handleBannerFileUpload}
            handlePdfFileUpload={handlePdfFileUpload}
            pdfFileName={pdfFileName}
            setPdfFileName={setPdfFileName}
            setLogoUploadSuccess={setLogoUploadSuccess}
          />

          {/* Section 3: Eligibility Criteria & Requirements */}
          <Section3Eligibility
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            attemptRules={attemptRules}
            setAttemptRules={setAttemptRules}
            additionalAttemptNote={additionalAttemptNote}
            setAdditionalAttemptNote={setAdditionalAttemptNote}
            ATTEMPT_PRESETS={ATTEMPT_PRESETS}
            QUICK_ATTEMPT_CATEGORIES={QUICK_ATTEMPT_CATEGORIES}
            QUICK_ATTEMPT_VALUES={QUICK_ATTEMPT_VALUES}
          />

          {/* Section 4: Vacancy Details & Distribution (Standard + RRB Mode) */}
          <Section4Vacancies
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            vacancyCategories={vacancyCategories}
            setVacancyCategories={setVacancyCategories}
            handleCategoryVacancyChange={handleCategoryVacancyChange}
            isManageCatOpen={isManageCatOpen}
            setIsManageCatOpen={setIsManageCatOpen}
            newCatName={newCatName}
            setNewCatName={setNewCatName}
            newCatLabel={newCatLabel}
            setNewCatLabel={setNewCatLabel}
            handleAddCustomCategory={handleAddCustomCategory}
            handleRemoveCategory={handleRemoveCategory}
            handleApplyVacancyPreset={handleApplyVacancyPreset}
            handleAddServiceRow={handleAddServiceRow}
            handleRemoveServiceRow={handleRemoveServiceRow}
            newServiceName={newServiceName}
            setNewServiceName={setNewServiceName}
            newServiceUR={newServiceUR}
            setNewServiceUR={setNewServiceUR}
            newServiceOBC={newServiceOBC}
            setNewServiceOBC={setNewServiceOBC}
            newServiceSC={newServiceSC}
            setNewServiceSC={setNewServiceSC}
            newServiceST={newServiceST}
            setNewServiceST={setNewServiceST}
          />

          {/* Section 5: Exam Pattern & Structure */}
          <Section5ExamPattern
            formData={formData}
            setFormData={setFormData}
            showNotification={showNotification}
          />

          {/* Filter Tags & Badges */}
          <div className="ajp__field" style={{ marginTop: "1rem" }}>
            <label className="ajp__label">Filter Tags &amp; Badges</label>
            <div className="ajp__tag-input-row">
              <input
                type="text"
                className="ajp__input"
                placeholder="Add a tag (e.g. Engineering, Diploma, Central Govt) and click Add"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
              />
              <button type="button" className="ajp__tag-add-btn" onClick={handleAddTag}>
                + Add Tag
              </button>
            </div>

            <div className="ajp__tags-display">
              {tags.map((t) => (
                <span key={t} className="ajp__tag-chip">
                  {t}
                  <button type="button" onClick={() => handleRemoveTag(t)}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="ajp__submit-wrap" style={{ marginTop: "1.5rem" }}>
            <button
              type="submit"
              className="ajp__submit-btn"
              disabled={isLoading}
              style={
                editingJob
                  ? {
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      boxShadow: "0 4px 16px rgba(245, 158, 11, 0.4)",
                    }
                  : undefined
              }
            >
              {isLoading ? (
                <span>{editingJob ? "Updating Changes..." : "Publishing Notification..."}</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {editingJob ? (
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    ) : (
                      <>
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </>
                    )}
                  </svg>
                  <span>{editingJob ? "Save & Update Opportunity →" : "Publish Job Notification →"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
