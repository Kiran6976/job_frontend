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
  "10TH": 1, // 10th / Matriculation
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
 * Extract required qualification level from job attributes, tags, and text
 */
export const parseJobRequiredQualification = (job) => {
  const combinedText = [
    job.eligibility,
    job.educationQualification,
    job.postsDescription,
    job.title,
    ...(Array.isArray(job.tags) ? job.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let requiredLevel = QUALIFICATION_LEVELS.GRADUATE; // Default for most competitive exams
  let label = "Bachelor's Degree / Graduate";
  let requiredStream = null;

  if (
    combinedText.includes("ph.d") ||
    combinedText.includes("phd") ||
    combinedText.includes("doctorate")
  ) {
    requiredLevel = QUALIFICATION_LEVELS.PHD;
    label = "Ph.D. / Doctorate";
  } else if (
    combinedText.includes("post graduate") ||
    combinedText.includes("post-graduate") ||
    combinedText.includes("master") ||
    combinedText.includes("m.tech") ||
    combinedText.includes("mtech") ||
    combinedText.includes("mba") ||
    combinedText.includes("m.sc") ||
    combinedText.includes("m.com")
  ) {
    requiredLevel = QUALIFICATION_LEVELS.POST_GRADUATE;
    label = "Master's Degree / Post Graduate";
  } else if (
    combinedText.includes("diploma") ||
    combinedText.includes("polytechnic")
  ) {
    requiredLevel = QUALIFICATION_LEVELS.DIPLOMA;
    label = "Diploma";
  } else if (
    combinedText.includes("12th") ||
    combinedText.includes("intermediate") ||
    combinedText.includes("10+2") ||
    combinedText.includes("higher secondary") ||
    combinedText.includes("chsl")
  ) {
    requiredLevel = QUALIFICATION_LEVELS.QUALIFICATION_LEVELS?.["12TH"] || 2;
    label = "12th Pass / Intermediate";
  } else if (
    combinedText.includes("10th") ||
    combinedText.includes("matric") ||
    combinedText.includes("secondary school") ||
    combinedText.includes("mts") ||
    combinedText.includes("group d")
  ) {
    requiredLevel = QUALIFICATION_LEVELS["10TH"];
    label = "10th Pass / Matriculation";
  } else {
    requiredLevel = QUALIFICATION_LEVELS.GRADUATE;
    label = "Bachelor's Degree / Graduate";
  }

  // Stream checks
  if (
    combinedText.includes("engineering") ||
    combinedText.includes("b.tech") ||
    combinedText.includes("btech") ||
    combinedText.includes("b.e.") ||
    combinedText.includes("gate")
  ) {
    requiredStream = "Engineering";
  } else if (
    combinedText.includes("commerce") ||
    combinedText.includes("b.com") ||
    combinedText.includes("ca") ||
    combinedText.includes("cfa") ||
    combinedText.includes("finance")
  ) {
    requiredStream = "Commerce";
  } else if (
    combinedText.includes("law") ||
    combinedText.includes("llb") ||
    combinedText.includes("advocate")
  ) {
    requiredStream = "Law";
  } else if (
    combinedText.includes("mbbs") ||
    combinedText.includes("medical") ||
    combinedText.includes("nursing") ||
    combinedText.includes("pharmacy")
  ) {
    requiredStream = "Medical";
  }

  return { level: requiredLevel, label, stream: requiredStream };
};

/**
 * Main evaluation function: Checks if user is eligible for a specific job.
 */
export const evaluateJobEligibility = (job, userProfile) => {
  if (!userProfile || !userProfile.dob || !userProfile.category) {
    return {
      status: "pending_profile",
      isEligible: null,
      badgeText: "Check Eligibility",
      color: "slate",
      reasons: [],
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
      reasons: [],
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
  } else if (titleLower.includes("chsl") || titleLower.includes("12th") || titleLower.includes("mts")) {
    baseMaxAge = Number(job.ageLimitMax) || 27;
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
    ageMessage = `Below minimum age limit (${minAge} yrs). You need ${diff.toFixed(1)} more years.`;
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
    ageMessage = `Within age limit (${minAge}–${effectiveMaxAge} yrs with ${userCat} relaxation). ${remainingTimeText}.`;
  }

  // 3. Qualification Match Check
  const jobReq = parseJobRequiredQualification(job);
  const userQualLevel = QUALIFICATION_LEVELS[userProfile.qualification] || QUALIFICATION_LEVELS.GRADUATE;

  let qualPassed = true;
  let qualMessage = "";

  if (userQualLevel < jobReq.level) {
    qualPassed = false;
    qualMessage = `Requires ${jobReq.label}. Your profile: ${userProfile.qualificationLabel || userProfile.qualification}.`;
  } else {
    // Check specific stream and department if applicable
    if (
      jobReq.stream &&
      userProfile.stream &&
      userProfile.stream !== "Any" &&
      userProfile.stream !== "Other" &&
      !userProfile.stream.toLowerCase().includes(jobReq.stream.toLowerCase())
    ) {
      qualPassed = false;
      qualMessage = `Requires ${jobReq.stream} specialization. Your profile: ${userProfile.stream}.`;
    } else {
      qualPassed = true;
      const deptStr = userProfile.departmentLabel || userProfile.department;
      qualMessage = deptStr
        ? `Educational criteria satisfied (${jobReq.label} - ${deptStr.split("(")[0]}).`
        : `Educational criteria satisfied (${jobReq.label}).`;
    }
  }

  // 4. Final Verdict
  const isEligible = agePassed && qualPassed;

  let badgeText = "";
  let color = "slate";

  if (isEligible) {
    badgeText = `Eligible • ${remainingTimeText || "Verified"}`;
    color = "green";
  } else if (!agePassed) {
    badgeText = `Ineligible • Age (${userAge.years} yrs)`;
    color = "red";
  } else {
    badgeText = `Ineligible • Qualification`;
    color = "red";
  }

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
    requiredQualification: jobReq.label,
    requiredStream: jobReq.stream,
    remainingTimeText,
  };
};
