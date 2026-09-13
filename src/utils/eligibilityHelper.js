/**
 * Eligibility Helper Utility
 * Comprehensive age & qualification evaluation engine for Indian Competitive Exams & Jobs.
 */

export const STORAGE_KEY = "theworkflow_eligibility_profile";
export const ELIGIBILITY_EVENT = "theworkflow_eligibility_updated";

// Category-based standard age relaxation rules (Central/State Govt standards)
export const CATEGORY_RELAXATION = {
  UR: 0, // General / Unreserved
  EWS: 0, // Economically Weaker Section
  OBC: 3, // Other Backward Classes (NCL)
  SC: 5, // Scheduled Castes
  ST: 5, // Scheduled Tribes
  PwBD_GEN: 10, // Persons with Benchmark Disabilities (General/EWS)
  PwBD_OBC: 13, // PwBD (OBC)
  PwBD_SCST: 15, // PwBD (SC/ST)
  EX_SERVICEMEN: 3, // Ex-Servicemen (Military service + 3 years average)
};

// Hierarchy of educational qualifications for ranking & minimum match
export const QUALIFICATION_LEVELS = {
  NONE: 0,
  "10TH": 1, // 10th / Matriculation / Secondary
  "12TH": 2, // 12th / Intermediate / Higher Secondary
  DIPLOMA: 3, // Diploma (Polytechnic / 3-year)
  GRADUATE: 4, // Bachelor's Degree (BA, B.Sc, B.Com, B.Tech, BE, BBA, LLB, etc.)
  POST_GRADUATE: 5, // Master's Degree (MA, M.Sc, M.Com, M.Tech, MBA, LLM, etc.)
  PHD: 6, // Doctorate / Ph.D.
};

/**
 * Retrieve saved eligibility profile from localStorage
 */
export const getStoredEligibilityProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.dob && parsed.category && parsed.qualification) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Save eligibility profile to localStorage and broadcast change
 */
export const saveEligibilityProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(ELIGIBILITY_EVENT, { detail: profile }));
  } catch (err) {
    console.error("Failed to save eligibility profile:", err);
  }
};

/**
 * Clear stored eligibility profile
 */
export const clearEligibilityProfile = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(ELIGIBILITY_EVENT, { detail: null }));
  } catch (err) {
    console.error("Failed to clear eligibility profile:", err);
  }
};

/**
 * Calculate exact age in years, months, and days
 */
export const calculateExactAge = (dobString, targetDate = new Date()) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;

  const target = new Date(targetDate);
  let years = target.getFullYear() - dob.getFullYear();
  let months = target.getMonth() - dob.getMonth();
  let days = target.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const exactDecimal = years + months / 12 + days / 365;

  return {
    years,
    months,
    days,
    exactDecimal,
    formatted: `${years} yrs, ${months} mos`,
  };
};

/**
 * Extract accepted streams / disciplines from job text
 */
export const parseJobAcceptedStreams = (text) => {
  const t = String(text || "").toLowerCase();
  const accepted = [];
  if (/\b(b\.?tech|engineering|technician|junior engineer|je\b|cse|ece|eee|civil|mechanical|electrical|it\b|information technology)\b/i.test(t)) {
    accepted.push("Engineering");
  }
  if (/\b(b\.?com|m\.?com|commerce|finance|economics|ca\b|cfa|icwa|cma|accountant|accounts|aca|fca|acs|fcs|acma|fcma)\b/i.test(t)) {
    accepted.push("Commerce");
  }
  if (/\b(llb|llm|law\b|advocate|legal|judiciary)\b/i.test(t)) {
    accepted.push("Law");
  }
  if (/\b(mbbs|bds|nursing|b\.?pharm|m\.?pharm|ayush|medical|doctor|veterinary)\b/i.test(t)) {
    accepted.push("Medical");
  }
  if (/\b(b\.?sc|m\.?sc|science|physics|chemistry|mathematics|statistics|data science|botany|zoology|geology|agriculture)\b/i.test(t)) {
    accepted.push("Science");
  }
  if (/\b(b\.?a\b|m\.?a\b|arts|humanities|hindi|english|history|political science|sociology|journalism)\b/i.test(t)) {
    accepted.push("Arts");
  }
  if (/\b(any discipline|any graduate|any degree|recognized university|any stream|in any discipline)\b/i.test(t)) {
    accepted.push("Any");
  }
  return accepted;
};

/**
 * Extract required qualification level from job attributes, tags, and text
 */
export const parseJobRequiredQualification = (job) => {
  if (!job) return { level: QUALIFICATION_LEVELS.GRADUATE, label: "Bachelor's Degree / Graduate", stream: null, acceptedStreams: [] };

  // Primary qualification fields
  const primaryQualText = [
    job.educationalQualification,
    job.educationQualification,
    job.qualification,
    job.eligibility,
  ]
    .filter(Boolean)
    .join(" ");

  // Fallback text if primary qualification fields are empty
  const fallbackText = [
    job.title,
    job.postsDescription,
    ...(Array.isArray(job.tags) ? job.tags : []),
  ]
    .filter(Boolean)
    .join(" ");

  const textToScan = (primaryQualText.trim() || fallbackText.trim()).toLowerCase();

  const has10th = /\b(10th|matric|matriculation|secondary school|sse\b|sslc\b|high school|class 10|10 th)\b/i.test(textToScan);
  const has12th = /\b(12th|intermediate|10\+2|higher secondary|chsl\b|hsc\b|class 12|senior secondary|12 th)\b/i.test(textToScan);
  const hasDiploma = /\b(diploma|polytechnic|iti\b)\b/i.test(textToScan);
  const hasPG = /\b(post[\s-]?graduate|master(?:'s)?|m\.?tech|mba\b|m\.?sc|m\.?com|mca\b|m\.?e\.|llm\b|pg degree)\b/i.test(textToScan);
  const hasPhD = /\b(ph\.?d|doctorate|doctoral)\b/i.test(textToScan);
  const hasDegree = /\b(bachelor(?:'s)?|graduate|graduation|degree|b\.?tech|b\.?sc|b\.?com|bba\b|bca\b|llb\b|mbbs\b|b\.?pharm|bds\b|cgl\b|b\.e\.|bachelor of)\b/i.test(textToScan);

  let requiredLevel = QUALIFICATION_LEVELS.GRADUATE;
  let label = "Bachelor's Degree / Graduate";

  // When multiple entry pathways are accepted, find the lowest entry tier:
  if (has10th && !has12th && !hasDiploma && !hasDegree && !hasPG && !hasPhD) {
    requiredLevel = QUALIFICATION_LEVELS["10TH"];
    label = "10th Pass / Matriculation";
  } else if (has12th && !hasDiploma && !hasDegree && !hasPG && !hasPhD) {
    requiredLevel = QUALIFICATION_LEVELS["12TH"];
    label = "12th Pass / Intermediate";
  } else if (hasDiploma && !hasDegree && !hasPG && !hasPhD) {
    requiredLevel = QUALIFICATION_LEVELS.DIPLOMA;
    label = "Diploma / Polytechnic";
  } else if (has10th && !hasDegree && !hasPG && !hasPhD) {
    requiredLevel = QUALIFICATION_LEVELS["10TH"];
    label = "10th Pass / Matriculation";
  } else if (has12th && !hasDegree && !hasPG && !hasPhD) {
    requiredLevel = QUALIFICATION_LEVELS["12TH"];
    label = "12th Pass / Intermediate";
  } else if (hasDiploma && !hasDegree && !hasPG && !hasPhD) {
    requiredLevel = QUALIFICATION_LEVELS.DIPLOMA;
    label = "Diploma / Polytechnic";
  } else if (hasDegree) {
    // Bachelor's degree pathway is available (e.g. Master's in any discipline OR Bachelor's in Law/Engineering)
    requiredLevel = QUALIFICATION_LEVELS.GRADUATE;
    label = "Bachelor's Degree / Graduate";
  } else if (hasPG) {
    requiredLevel = QUALIFICATION_LEVELS.POST_GRADUATE;
    label = "Master's Degree / Post Graduate";
  } else if (hasPhD) {
    requiredLevel = QUALIFICATION_LEVELS.PHD;
    label = "Ph.D. / Doctorate";
  } else {
    // Default fallback
    requiredLevel = QUALIFICATION_LEVELS.GRADUATE;
    label = "Bachelor's Degree / Graduate";
  }

  const fullText = (primaryQualText + " " + fallbackText).toLowerCase();
  const acceptedStreams = parseJobAcceptedStreams(fullText);
  let requiredStream = acceptedStreams.length === 1 && acceptedStreams[0] !== "Any" ? acceptedStreams[0] : null;

  return { level: requiredLevel, label, stream: requiredStream, acceptedStreams };
};

/**
 * Main evaluation function: Evaluates candidate eligibility across all parameters
 */
export const evaluateJobEligibility = (job, userProfile) => {
  if (!userProfile || !userProfile.dob || !userProfile.category) {
    return {
      status: "pending_profile",
      isEligible: null,
      badgeText: "Check Eligibility",
      color: "slate",
      parameters: [],
      ineligibleReasons: [],
    };
  }

  // Reference date for age calculation: notification date, application last date, or current date
  const refDate = job.notificationDate || job.applicationLastDate || new Date();
  const userAge = calculateExactAge(userProfile.dob, refDate);
  if (!userAge) {
    return {
      status: "pending_profile",
      isEligible: null,
      badgeText: "Check Eligibility",
      color: "slate",
      parameters: [],
      ineligibleReasons: [],
    };
  }

  // 1. Determine Min & Max age limits from job
  let minAge = Number(job.ageLimitMin) || 18;
  let baseMaxAge = Number(job.ageLimitMax) || 30;

  // Fallback heuristic if not explicitly set
  const titleLower = String(job.title || "").toLowerCase();
  if (titleLower.includes("cgl") || titleLower.includes("civil services") || titleLower.includes("upsc")) {
    baseMaxAge = Number(job.ageLimitMax) || 32;
    minAge = Number(job.ageLimitMin) || 21;
  } else if (titleLower.includes("chsl") || titleLower.includes("12th") || titleLower.includes("mts") || titleLower.includes("gds")) {
    baseMaxAge = Number(job.ageLimitMax) || 40;
    minAge = Number(job.ageLimitMin) || 18;
  }

  // 2. Compute Age Relaxation
  const userCat = userProfile.category || "UR";
  const relaxationYears = CATEGORY_RELAXATION[userCat] || 0;
  const effectiveMaxAge = baseMaxAge + relaxationYears;

  let agePassed = true;
  let ageMessage = "";
  let remainingTimeText = "";

  if (userAge.years < minAge) {
    agePassed = false;
    const diff = minAge - userAge.exactDecimal;
    ageMessage = `Below minimum age (${minAge} yrs). You need ${diff.toFixed(1)} more years.`;
  } else if (userAge.exactDecimal > effectiveMaxAge) {
    agePassed = false;
    const over = userAge.exactDecimal - effectiveMaxAge;
    const overMonths = Math.round(over * 12);
    ageMessage = `Exceeds max limit (${effectiveMaxAge} yrs with ${userCat} relaxation) by ${
      overMonths < 12 ? `${overMonths} mos` : `${(overMonths / 12).toFixed(1)} yrs`
    }.`;
  } else {
    agePassed = true;
    const remaining = effectiveMaxAge - userAge.exactDecimal;
    if (remaining < 1) {
      remainingTimeText = `${Math.round(remaining * 12)} mos remaining`;
    } else {
      remainingTimeText = `${remaining.toFixed(1)} yrs remaining`;
    }
    ageMessage = `Within prescribed age limit (${minAge}–${effectiveMaxAge} yrs with ${userCat} relaxation). ${remainingTimeText}.`;
  }

  // 3. Qualification Match Check
  const jobReq = parseJobRequiredQualification(job);
  const userQualLevel = QUALIFICATION_LEVELS[userProfile.qualification] || QUALIFICATION_LEVELS.GRADUATE;

  let qualPassed = true;
  let qualMessage = "";

  // Higher degree holders (e.g. Graduates/Masters) are fully eligible for lower requirements (10th/12th/Diploma)
  if (userQualLevel < jobReq.level) {
    qualPassed = false;
    qualMessage = `Requires minimum ${jobReq.label}. Your profile has ${userProfile.qualificationLabel?.split("(")[0] || userProfile.qualification}.`;
  } else {
    qualPassed = true;
    qualMessage = `Educational criteria fulfilled (${jobReq.label} or higher).`;
  }

  // 4. Specialization / Stream Match Check
  let streamPassed = true;
  let streamMessage = "";

  const acceptedStreams = jobReq.acceptedStreams || [];

  if (
    acceptedStreams.length > 0 &&
    !acceptedStreams.includes("Any") &&
    userProfile.stream &&
    userProfile.stream !== "Any" &&
    userProfile.stream !== "Other"
  ) {
    const matchesStream = acceptedStreams.some(
      (s) =>
        userProfile.stream.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(userProfile.stream.toLowerCase()) ||
        (userProfile.department && userProfile.department.toLowerCase().includes(s.toLowerCase()))
    );

    if (!matchesStream) {
      streamPassed = false;
      streamMessage = `Requires ${acceptedStreams.join(" / ")} specialization. Your stream: ${userProfile.stream}.`;
    } else {
      streamPassed = true;
      streamMessage = `Stream matched (${userProfile.stream}).`;
    }
  } else {
    streamPassed = true;
    streamMessage = acceptedStreams.length > 0 && !acceptedStreams.includes("Any") && userProfile.stream
      ? `Stream matched (${userProfile.stream}).`
      : `Open to any discipline / stream.`;
  }

  // 5. Final Verdict
  const isEligible = agePassed && qualPassed && streamPassed;

  let badgeText = "";
  let color = "slate";

  if (isEligible) {
    badgeText = "Eligible";
    color = "green";
  } else {
    badgeText = "Ineligible";
    color = "red";
  }

  // Ineligible reasons list
  const ineligibleReasons = [];
  if (!agePassed) ineligibleReasons.push({ parameter: "Age Limit Criteria", reason: ageMessage });
  if (!qualPassed) ineligibleReasons.push({ parameter: "Educational Qualification", reason: qualMessage });
  if (!streamPassed) ineligibleReasons.push({ parameter: "Discipline / Stream", reason: streamMessage });

  const parameters = [
    {
      name: "Age Limit & Cut-off",
      passed: agePassed,
      userValue: `${userAge.years} yrs, ${userAge.months} mos`,
      requiredValue: `${minAge} – ${effectiveMaxAge} yrs (${userCat} ${relaxationYears > 0 ? `+${relaxationYears}y` : "norm"})`,
      detail: ageMessage,
    },
    {
      name: "Educational Qualification",
      passed: qualPassed,
      userValue: userProfile.qualificationLabel?.split("(")[0] || userProfile.qualification,
      requiredValue: jobReq.label,
      detail: qualMessage,
    },
    {
      name: "Discipline / Stream",
      passed: streamPassed,
      userValue: userProfile.stream !== "Any" ? `${userProfile.stream} (${userProfile.departmentLabel?.split("(")[0] || "General"})` : "Any Stream",
      requiredValue: jobReq.stream ? `${jobReq.stream} Discipline` : "Any Discipline Accepted",
      detail: streamMessage,
    },
    {
      name: "Nationality & Citizenship",
      passed: true,
      userValue: "Indian Citizen",
      requiredValue: "Citizen of India",
      detail: "Standard citizenship requirement met.",
    },
  ];

  return {
    status: isEligible ? "eligible" : "ineligible",
    isEligible,
    badgeText,
    color,
    userAge,
    minAge,
    baseMaxAge,
    effectiveMaxAge,
    relaxationYears,
    category: userCat,
    agePassed,
    ageMessage,
    qualPassed,
    qualMessage,
    streamPassed,
    streamMessage,
    requiredQualification: jobReq.label,
    requiredStream: jobReq.stream,
    acceptedStreams: jobReq.acceptedStreams,
    remainingTimeText,
    parameters,
    ineligibleReasons,
  };
};
