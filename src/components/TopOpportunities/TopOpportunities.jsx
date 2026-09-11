import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "./TopOpportunities.css";
import { OPPORTUNITY_TABS } from "./opportunitiesData";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";


// Comprehensive dictionary for acronyms, exam abbreviations, and synonyms
const ACRONYM_SYNONYMS = {
  ssc: ["staff selection commission", "cgl", "chsl", "mts", "gd", "cpo", "je", "stenographer", "selection posts", "steno"],
  "staff selection commission": ["ssc", "cgl", "chsl", "mts", "gd", "cpo", "je", "stenographer"],
  cgl: ["combined graduate level", "ssc", "staff selection commission"],
  chsl: ["combined higher secondary", "ssc", "10+2", "12th", "staff selection commission"],
  mts: ["multi tasking staff", "ssc", "staff selection commission"],
  upsc: ["union public service commission", "civil services", "ias", "ips", "ifs", "nda", "cds", "capf", "ese", "cms", "cse"],
  "union public service commission": ["upsc", "civil services", "ias", "ips", "ifs", "nda", "cds", "capf"],
  ias: ["upsc", "civil services", "union public service commission"],
  ips: ["upsc", "civil services", "union public service commission"],
  ifs: ["upsc", "civil services", "union public service commission"],
  cse: ["upsc", "civil services", "union public service commission"],
  nda: ["national defence academy", "upsc", "defense", "defence"],
  cds: ["combined defence services", "upsc", "defense", "defence"],
  rrb: ["railway recruitment board", "railway", "railways", "indian railways", "ntpc", "group d", "alp", "rpf", "loco pilot"],
  railway: ["rrb", "railway recruitment board", "railways", "indian railways", "ntpc", "group d", "alp", "rpf"],
  railways: ["rrb", "railway recruitment board", "railway", "indian railways", "ntpc", "group d", "alp", "rpf"],
  "indian railways": ["rrb", "railway recruitment board", "railway", "railways", "ntpc", "group d", "alp", "rpf"],
  "railway recruitment board": ["rrb", "railway", "railways", "indian railways", "ntpc", "group d", "alp", "rpf"],
  ntpc: ["non technical popular categories", "rrb", "railway", "railways"],
  alp: ["assistant loco pilot", "rrb", "railway"],
  rpf: ["railway protection force", "rrb", "railway"],
  ibps: ["institute of banking personnel selection", "bank", "banking", "po", "clerk", "so", "probationary officer"],
  "institute of banking personnel selection": ["ibps", "bank", "banking", "po", "clerk", "so"],
  sbi: ["state bank of india", "bank", "banking", "po", "clerk"],
  "state bank of india": ["sbi", "bank", "banking"],
  rbi: ["reserve bank of india", "bank", "banking", "grade b", "assistant"],
  "reserve bank of india": ["rbi", "bank", "banking"],
  drdo: ["defence research and development organisation", "defence research and development organization", "defence", "defense", "ceptam"],
  "defence research and development organisation": ["drdo", "defense", "defence"],
  isro: ["indian space research organisation", "indian space research organization", "space"],
  "indian space research organisation": ["isro", "space"],
  nta: ["national testing agency", "neet", "jee", "cuet", "ugc net"],
  ctet: ["teacher eligibility test", "central teacher eligibility test", "teaching", "teacher"],
  tet: ["teacher eligibility test", "central teacher eligibility test", "teaching", "teacher"],
  gate: ["graduate aptitude test in engineering", "engineering", "engineer"],
  psc: ["public service commission", "state psc", "uppsc", "bpsc", "mppsc", "rpsc", "wbpsc", "tnpsc", "kpsc", "appsc", "opsc"],
  "public service commission": ["psc", "state psc", "uppsc", "bpsc", "mppsc", "rpsc", "wbpsc", "tnpsc", "kpsc"],
  uppsc: ["uttar pradesh public service commission", "psc"],
  bpsc: ["bihar public service commission", "psc"],
  mppsc: ["madhya pradesh public service commission", "psc"],
  rpsc: ["rajasthan public service commission", "psc"],
  wbpsc: ["west bengal public service commission", "psc"],
  tnpsc: ["tamil nadu public service commission", "psc"],
  kpsc: ["karnataka public service commission", "psc", "kerala public service commission"],
  "12th": ["class 12", "12th", "10+2", "class12", "higher secondary", "intermediate", "12th pass", "+2"],
  "class 12": ["12th", "10+2", "class12", "higher secondary", "intermediate", "12th pass", "+2"],
  "class12": ["12th", "class 12", "10+2", "higher secondary", "intermediate", "12th pass"],
  "10+2": ["class 12", "12th", "class12", "higher secondary", "intermediate", "12th pass", "chsl"],
  intermediate: ["class 12", "12th", "10+2", "class12", "higher secondary"],
  "higher secondary": ["class 12", "12th", "10+2", "class12", "intermediate", "chsl"],
  "10th": ["class 10", "10th", "class10", "matriculation", "matric", "secondary", "10th pass"],
  "class 10": ["10th", "class 10", "class10", "matriculation", "matric", "secondary", "10th pass", "mts"],
  class10: ["10th", "class 10", "matriculation", "matric", "secondary", "10th pass"],
  matric: ["class 10", "10th", "class10", "matriculation", "secondary"],
  matriculation: ["class 10", "10th", "class10", "matric", "secondary"],
  graduate: ["graduate", "graduation", "degree", "bachelor", "b.tech", "btech", "b.e", "be", "b.sc", "b.com", "b.a", "cgl"],
  graduation: ["graduate", "degree", "bachelor", "b.tech", "btech", "b.e", "be", "b.sc", "b.com", "b.a", "cgl"],
  engineering: ["engineer", "engineering", "b.tech", "btech", "b.e", "be", "diploma", "junior engineer", "assistant engineer", "je", "ae", "gate"],
  engineer: ["engineering", "engineer", "b.tech", "btech", "b.e", "be", "diploma", "junior engineer", "assistant engineer", "je", "ae", "gate"],
  teaching: ["teaching", "teacher", "faculty", "professor", "ctet", "tet", "pgt", "tgt", "prt", "lecturer"],
  teacher: ["teaching", "teacher", "faculty", "professor", "ctet", "tet", "pgt", "tgt", "prt", "lecturer"],
  defense: ["defense", "defence", "police", "army", "navy", "air force", "airforce", "nda", "cds", "afcat", "crpf", "bsf", "cisf", "itbp", "ssb", "capf", "constable", "si"],
  defence: ["defense", "defence", "police", "army", "navy", "air force", "airforce", "nda", "cds", "afcat", "crpf", "bsf", "cisf", "itbp", "ssb", "capf", "constable", "si"],
  police: ["police", "defense", "defence", "constable", "si", "sub inspector"],
  army: ["army", "defense", "defence", "agniveer", "nda", "cds"],
  navy: ["navy", "defense", "defence", "agniveer", "nda", "cds", "indian navy"],
  airforce: ["air force", "airforce", "defense", "defence", "agniveer", "afcat", "nda"],
  "air force": ["air force", "airforce", "defense", "defence", "agniveer", "afcat", "nda"],
};

// Helper: Extract acronym from text, e.g. "Staff Selection Commission" -> "SSC"
const getAcronym = (text) => {
  if (!text) return "";
  const words = String(text)
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !["of", "and", "in", "the", "for", "to", "board", "commission"].includes(w.toLowerCase()));
  if (words.length <= 1) return "";
  return words.map((w) => w[0].toUpperCase()).join("");
};

// Helper: Normalize string by removing punctuation and spaces
const normalizeStr = (str) => String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Helper: Get all search tokens and expanded aliases
const getSearchTokens = (query) => {
  if (!query) return [];
  const raw = String(query).toLowerCase().trim();
  const clean = raw.replace(/\b(jobs?|exams?|recruitment|vacancy|vacancies|posts?|forms?|online)\b/gi, "").trim();

  const tokens = new Set();
  if (raw) tokens.add(raw);
  if (clean) tokens.add(clean);

  // Split clean query into individual words
  const words = clean.split(/\s+/).filter(Boolean);
  words.forEach((w) => tokens.add(w));

  // Expand aliases for all tokens
  const currentTokens = Array.from(tokens);
  currentTokens.forEach((t) => {
    const tNorm = normalizeStr(t);
    if (ACRONYM_SYNONYMS[t]) {
      ACRONYM_SYNONYMS[t].forEach((alias) => tokens.add(alias.toLowerCase()));
    }
    // Check key match
    Object.keys(ACRONYM_SYNONYMS).forEach((key) => {
      if (normalizeStr(key) === tNorm) {
        ACRONYM_SYNONYMS[key].forEach((alias) => tokens.add(alias.toLowerCase()));
      }
    });
  });

  return Array.from(tokens).filter(Boolean);
};

// Check if a text field matches any search token or acronym
const checkTextMatch = (targetText, searchTokens, rawQuery) => {
  if (!targetText || searchTokens.length === 0) return false;
  const targetLower = String(targetText).toLowerCase();
  const targetNorm = normalizeStr(targetText);
  const targetAcronym = getAcronym(targetText).toLowerCase();
  const rawQueryNorm = normalizeStr(rawQuery);

  // Direct acronym match
  if (targetAcronym && (searchTokens.includes(targetAcronym) || targetAcronym === rawQueryNorm)) {
    return true;
  }

  // Token matches
  return searchTokens.some((token) => {
    const tokenLower = token.toLowerCase();
    const tokenNorm = normalizeStr(token);
    if (!tokenNorm) return false;
    return (
      targetLower.includes(tokenLower) ||
      targetNorm.includes(tokenNorm) ||
      (targetAcronym && targetAcronym.includes(tokenNorm))
    );
  });
};

// Check if tag list matches search tokens
const checkTagsMatch = (tags, searchTokens, rawQuery) => {
  if (!Array.isArray(tags) || tags.length === 0 || searchTokens.length === 0) return false;
  return tags.some((tag) => checkTextMatch(tag, searchTokens, rawQuery));
};

const matchesTab = (job, tabId, tabLabel) => {
  if (!tabId || tabId === "all") return true;
  const cat = String(job.category || "").toLowerCase();
  const title = String(job.title || "").toLowerCase();
  const org = String(job.organization || "").toLowerCase();
  const label = String(tabLabel || "").toLowerCase();
  const id = String(tabId).toLowerCase();

  // Direct match
  if (cat === label || cat === id) return true;

  if (id === "govt" || id.includes("government") || label.includes("government")) {
    return (
      cat.includes("govt") ||
      cat.includes("exam") ||
      cat.includes("commission") ||
      cat.includes("upsc") ||
      title.includes("upsc") ||
      org.includes("upsc")
    );
  }
  if (id === "banking" || label.includes("banking")) {
    return (
      cat.includes("bank") ||
      org.includes("bank") ||
      org.includes("ibps") ||
      org.includes("sbi") ||
      title.includes("bank")
    );
  }
  if (
    id === "defense" ||
    id.includes("defense") ||
    label.includes("defense") ||
    id.includes("defence") ||
    label.includes("defence")
  ) {
    return (
      cat.includes("defense") ||
      cat.includes("defence") ||
      cat.includes("police") ||
      cat.includes("army") ||
      cat.includes("navy") ||
      title.includes("nda") ||
      title.includes("cds")
    );
  }
  if (id.includes("state") || label.includes("state")) {
    return (
      String(job.scope || "").toLowerCase().includes("state") ||
      cat.includes("state")
    );
  }
  if (id.includes("teaching") || label.includes("teaching")) {
    return (
      cat.includes("teach") ||
      title.includes("teacher") ||
      title.includes("professor") ||
      title.includes("faculty")
    );
  }
  if (id.includes("intern") || label.includes("intern")) {
    return cat.includes("intern") || title.includes("intern");
  }

  return cat.includes(id) || cat.includes(label) || label.includes(cat);
};

const TopOpportunities = () => {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [rawCategories, setRawCategories] = useState([]);
  const [customJobs, setCustomJobs] = useState([]);
  const [savedExams, setSavedExams] = useState({});
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [searchParams] = useSearchParams();

  const [copiedJobId, setCopiedJobId] = useState(null);

  const handleJobClick = (e, targetUrl) => {
    if (!user) {
      e.preventDefault();
      openAuthModal(targetUrl);
    }
  };

  const handleShareJob = async (e, job) => {
    e.preventDefault();
    e.stopPropagation();

    const jobId = job._id || job.id;
    const shareUrl = `${window.location.origin}/job/${jobId}`;
    const orgName = job.organization || "The Workflow";
    const shareText = `🏛️ ${job.title}\n🏢 ${orgName}\n\nCheck official notification, eligibility & apply now:`;
    const copyText = `🏛️ ${job.title} (${orgName})\nApply here: ${shareUrl}`;

    if (navigator.share && navigator.canShare) {
      try {
        const shareData = {
          title: `${job.title} - ${orgName}`,
          text: shareText,
          url: shareUrl,
        };
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(copyText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = copyText;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedJobId(jobId);
      setTimeout(() => setCopiedJobId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  useEffect(() => {
    // Load categories from API / localStorage
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.JOB}/category/all`);
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const valid = data.categories.filter(
            (c) =>
              !c.name?.toLowerCase().includes("private") &&
              !c.slug?.toLowerCase().includes("private")
          );
          setRawCategories(valid);
          localStorage.setItem("portal_categories", JSON.stringify(valid));
        } else {
          const saved = localStorage.getItem("portal_categories");
          if (saved) {
            const valid = JSON.parse(saved).filter(
              (c) =>
                !c.name?.toLowerCase().includes("private") &&
                !c.slug?.toLowerCase().includes("private")
            );
            setRawCategories(valid);
          }
        }
      } catch (err) {
        const saved = localStorage.getItem("portal_categories");
        if (saved) {
          try {
            const valid = JSON.parse(saved).filter(
              (c) =>
                !c.name?.toLowerCase().includes("private") &&
                !c.slug?.toLowerCase().includes("private")
            );
            setRawCategories(valid);
          } catch (e) {}
        }
      }
    };

    // Load custom published jobs
    const loadJobs = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.JOB}/all`);
        const data = await res.json();

        if (data.success && Array.isArray(data.jobs)) {
          setCustomJobs(data.jobs);
          localStorage.setItem("portal_custom_jobs", JSON.stringify(data.jobs));
        }
      } catch (err) {
        const saved = localStorage.getItem("portal_custom_jobs");
        if (saved) {
          try {
            setCustomJobs(JSON.parse(saved));
          } catch (e) {}
        }
      }
    };

    loadCategories();
    loadJobs();
  }, []);

  // Format ISO date (YYYY-MM-DD) to friendly readable format
  const formatFriendlyDate = (dateStr, fallback) => {
    if (!dateStr) return fallback;
    if (!dateStr.includes("-") || dateStr.length < 10) return dateStr;
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Formatted real jobs from Admin Panel
  const allFormattedJobs = customJobs.map((j) => {
    let date1Label = "Notification";
    let date1Value = formatFriendlyDate(j.notificationDate, "");
    if (j.applicationLastDate) {
      date1Label = "Apply till";
      date1Value = formatFriendlyDate(j.applicationLastDate, "Ongoing");
    } else if (!date1Value) {
      date1Value = "Announced";
    }

    let date2Label = "Exam";
    let date2Value = formatFriendlyDate(j.examDate, "");
    if (!date2Value && j.resultDate) {
      date2Label = "Result";
      date2Value = formatFriendlyDate(j.resultDate, "");
    }
    if (!date2Value) {
      date2Value = "Will be announced soon";
    }

    return {
      id: j._id || j.id,
      title: j.title,
      organization: j.organization,
      scope: j.level || "National",
      status: j.status || "Apply Now",
      statusType: (j.status || "apply-now").toLowerCase().replace(/\s+/g, "-"),
      category: j.category || "Government Exams",
      vacancies: j.vacancies
        ? isNaN(Number(j.vacancies))
          ? j.vacancies
          : `${Number(j.vacancies).toLocaleString("en-IN")} Vacancies`
        : "Multiple Vacancies",
      date1Label,
      date1Value,
      date2Label,
      date2Value,
      tags: j.tags && j.tags.length > 0 ? j.tags.slice(0, 3) : ["Graduate"],
      allTags: Array.isArray(j.tags) ? j.tags : [],
      extraTagsCount: j.tags && j.tags.length > 3 ? j.tags.length - 3 : 0,
      emblem: j.logoUrl || "/emblem_india.png",
      btnText: "View Details \u2192",
      btnVariant: "apply",
      detailUrl: `/job/${j._id || j.id}`,
    };
  });

  // Dynamic filter tabs with live job counts
  const dynamicTabs = (() => {
    if (rawCategories.length > 0) {
      const allCategory = rawCategories.find(
        (c) => c.slug === "all" || c.name?.toLowerCase() === "all opportunities"
      );
      const specificCategories = rawCategories.filter(
        (c) => c.slug !== "all" && c.name?.toLowerCase() !== "all opportunities"
      );

      const tabsArr = [];

      // Tab 1: All Opportunities
      const totalJobs = allFormattedJobs.length;
      tabsArr.push({
        id: "all",
        label: "All Opportunities",
        count:
          totalJobs > 0
            ? totalJobs.toLocaleString("en-IN")
            : allCategory?.count
            ? allCategory.count.toLocaleString("en-IN")
            : "0",
        icon: allCategory?.icon || "grid",
      });

      // Subsequent tabs: specific categories
      specificCategories.forEach((c) => {
        const countMatching = allFormattedJobs.filter((j) =>
          matchesTab(j, c.slug, c.name)
        ).length;

        let displayCount = "0";
        if (allFormattedJobs.length > 0) {
          displayCount = countMatching.toLocaleString("en-IN");
        } else if (c.count && Number(c.count) > 0) {
          displayCount = Number(c.count).toLocaleString("en-IN");
        }

        tabsArr.push({
          id: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
          label: c.name,
          count: displayCount,
          icon: c.icon || "building",
        });
      });

      return tabsArr;
    }

    // Fallback using preset tabs (excluding private jobs) with dynamic counts
    return OPPORTUNITY_TABS
      .filter((t) => !t.label.toLowerCase().includes("private") && t.id !== "private")
      .map((t) => {
        if (t.id === "all") {
          return {
            ...t,
            count:
              allFormattedJobs.length > 0
                ? allFormattedJobs.length.toLocaleString("en-IN")
                : t.count,
          };
        }
        const matchingCount = allFormattedJobs.filter((j) =>
          matchesTab(j, t.id, t.label)
        ).length;
        return {
          ...t,
          count: allFormattedJobs.length > 0 ? matchingCount.toLocaleString("en-IN") : t.count,
        };
      });
  })();

  // Synchronize category search param from URL if navigated from another page
  useEffect(() => {
    const catQuery = searchParams.get("category");
    if (catQuery && dynamicTabs.length > 0) {
      const found = dynamicTabs.find(
        (t) =>
          t.id.toLowerCase() === catQuery.toLowerCase() ||
          t.label.toLowerCase() === catQuery.toLowerCase() ||
          matchesTab({ category: catQuery }, t.id, t.label)
      );
      if (found) {
        setActiveTab(found.id);
      }
    }
  }, [searchParams, dynamicTabs]);

  // Read search query parameter (e.g., ?q=... or ?search=...)
  const searchQuery = (searchParams.get("q") || searchParams.get("search") || "").trim();

  // Filter jobs based on activeTab and hierarchical search criteria
  const displayedJobs = (() => {
    // Hierarchical search: Title -> Tags -> Organization
    if (searchQuery) {
      const searchTokens = getSearchTokens(searchQuery);

      // Helper to run hierarchical match on a job array
      const runHierarchicalSearch = (pool) => {
        // Match level 1: Title (Priority 1)
        const titleMatches = pool.filter((j) =>
          checkTextMatch(j.title, searchTokens, searchQuery)
        );

        // Match level 2: Matching Tags (Priority 2, excluding title matches)
        const tagMatches = pool.filter((j) => {
          if (titleMatches.some((m) => String(m.id) === String(j.id))) return false;
          const candidateTags = [
            ...(Array.isArray(j.allTags) ? j.allTags : []),
            ...(Array.isArray(j.tags) ? j.tags : []),
          ];
          return checkTagsMatch(candidateTags, searchTokens, searchQuery);
        });

        // Match level 3: Organization name (Priority 3, excluding previous matches)
        const orgMatches = pool.filter((j) => {
          if (
            titleMatches.some((m) => String(m.id) === String(j.id)) ||
            tagMatches.some((m) => String(m.id) === String(j.id))
          ) {
            return false;
          }
          return checkTextMatch(j.organization, searchTokens, searchQuery);
        });

        return [...titleMatches, ...tagMatches, ...orgMatches];
      };

      // Try searching within activeTab first if not 'all'
      if (activeTab !== "all") {
        const currentTab = dynamicTabs.find((t) => t.id === activeTab);
        const tabScopedJobs = allFormattedJobs.filter((job) =>
          matchesTab(job, activeTab, currentTab?.label)
        );
        const tabResults = runHierarchicalSearch(tabScopedJobs);
        if (tabResults.length > 0) {
          return tabResults;
        }
      }

      // If activeTab is 'all' or tab search yielded 0 results, search across all jobs
      return runHierarchicalSearch(allFormattedJobs);
    }

    // Default: category tab filter only when no search query
    return allFormattedJobs.filter((job) => {
      if (activeTab === "all") return true;
      const currentTab = dynamicTabs.find((t) => t.id === activeTab);
      return matchesTab(job, activeTab, currentTab?.label);
    });
  })();

  const toggleSaveExam = (id) => {
    setSavedExams((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscribeEmail.trim()) {
      setSubscribed(true);
      setSubscribeEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const renderTabIcon = (icon) => {
    if (!icon) return null;
    if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(icon)) {
      return <span style={{ fontSize: "1.15rem" }}>{icon}</span>;
    }
    switch (icon) {
      case "grid":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        );
      case "building":
      case "bank":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="20" y2="21" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <polyline points="12 2 2 10 22 10 12 2" />
            <line x1="6" y1="10" x2="6" y2="21" />
            <line x1="10" y1="10" x2="10" y2="21" />
            <line x1="14" y1="10" x2="14" y2="21" />
            <line x1="18" y1="10" x2="18" y2="21" />
          </svg>
        );
      case "landmark":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="22" x2="21" y2="22" />
            <line x1="6" y1="18" x2="6" y2="11" />
            <line x1="10" y1="18" x2="10" y2="11" />
            <line x1="14" y1="18" x2="14" y2="11" />
            <line x1="18" y1="18" x2="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        );
      case "briefcase":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      case "academic":
      case "graduation-cap":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        );
      case "book":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case "laptop":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </svg>
        );
      case "home":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case "key":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21 2-2 2m-6 6 4-4m-6 6 2-2m-4 4 1-1m-7 7a5 5 0 1 1 7-7 5 5 0 0 1-7 7z" />
          </svg>
        );
      case "users":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "shield":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      default:
        if (icon.length <= 4) {
          return <span>{icon}</span>;
        }
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
    }
  };

  return (
    <section className="to">
      <div className="to__container">
        {/* ────────── Top Panoramic Banner (Job_Second.png) ────────── */}
        <div className="to__banner">
          {/* Background Illustration */}
          <div className="to__banner-bg">
            <img
              src="/Job_Second.png"
              alt="Indian Parliament with tricolor and sunrise"
              className="to__banner-img"
            />
            <div className="to__banner-overlay" />
          </div>

          {/* Left Text Content */}
          <div className="to__banner-content">
            <div className="to__badge">
              <span className="to__badge-icon">🏆</span>
              <span>Recommended for You</span>
            </div>

            <h2 className="to__heading">
              Top Opportunities for a{" "}
              <span className="to__heading--accent">Brighter Future</span>
            </h2>

            <p className="to__subtext">
              From Government Exams to top private companies — explore opportunities
              that match your goals and build the career you deserve.
            </p>
          </div>

          {/* Handwritten Doodle in between */}
          <div className="to__doodle-wrap">
            <span className="to__doodle-text">
              Same<br />Preparation<br />Bigger<br />Possibilities
            </span>
          </div>

          {/* Glassmorphic "Why Government Jobs?" Card */}
          <div className="to__why-card">
            <div className="to__why-header">
              <div className="to__why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="to__why-title">Why Government Jobs?</h3>
            </div>

            <ul className="to__why-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" className="to__check-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Job Security</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" className="to__check-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Respect &amp; Stability</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" className="to__check-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Serve the Nation</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" className="to__check-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Great Career Growth</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ────────── Opportunity Filter Tabs ────────── */}
        <div className="to__tabs-bar">
          {dynamicTabs.map((tab) => (
            <button
              key={tab.id}
              className={`to__tab-btn ${activeTab === tab.id ? "to__tab-btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="to__tab-icon">{renderTabIcon(tab.icon)}</span>
              <div className="to__tab-text">
                <span className="to__tab-label">{tab.label}</span>
                <span className="to__tab-count">{tab.count}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ────────── Sub-Section 1: Trending Government Exams ────────── */}
        <div className="to__section">
          {/* Section Header */}
          <div className="to__section-header">
            <div className="to__section-title-wrap">
              <div className="to__section-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <line x1="4" y1="21" x2="20" y2="21" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <polyline points="12 2 2 10 22 10 12 2" />
                  <line x1="6" y1="10" x2="6" y2="21" />
                  <line x1="10" y1="10" x2="10" y2="21" />
                  <line x1="14" y1="10" x2="14" y2="21" />
                  <line x1="18" y1="10" x2="18" y2="21" />
                </svg>
              </div>
              <div>
                <h3 className="to__section-title">
                  <span className="to__flame">{searchQuery ? "🎯" : "🔥"}</span>{" "}
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : activeTab === "all"
                    ? "Trending Opportunities"
                    : dynamicTabs.find((t) => t.id === activeTab)?.label || "Opportunities"}
                </h3>
                <p className="to__section-sub">
                  {displayedJobs.length} {displayedJobs.length === 1 ? "opportunity" : "opportunities"} available. Start preparing today!
                </p>
              </div>
            </div>

            <div className="to__section-controls">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("q");
                    params.delete("search");
                    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
                    window.dispatchEvent(new Event("popstate"));
                  }}
                  className="to__view-all-link"
                  style={{ background: "none", border: "none", cursor: "pointer", marginRight: "12px", color: "#ef4444" }}
                >
                  ✕ Clear Search
                </button>
              )}
              {activeTab !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className="to__view-all-link"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  View All Opportunities &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Two-column layout: Left Cards Stream + Fixed Right Newsletter Card */}
          <div className="to__section-layout">
            <div className="to__cards-stream">
              {displayedJobs.length === 0 ? (
                <div
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    background: "#f8fafc",
                    borderRadius: "16px",
                    border: "1px dashed #cbd5e1",
                    width: "100%",
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
                  <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>
                    {searchQuery ? `No opportunities found matching "${searchQuery}"` : "No opportunities found in this category"}
                  </h4>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "16px" }}>
                    {searchQuery
                      ? "Try searching for another keyword (e.g. Graduate, 12th, UPSC, SSC, RRB, Engineering)."
                      : "New positions are posted frequently. Check back soon or explore other categories."}
                  </p>
                  <button
                    onClick={() => {
                      if (searchQuery) {
                        const params = new URLSearchParams(searchParams);
                        params.delete("q");
                        params.delete("search");
                        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
                        window.dispatchEvent(new Event("popstate"));
                      }
                      setActiveTab("all");
                    }}
                    style={{
                      padding: "8px 18px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    View All Opportunities
                  </button>
                </div>
              ) : (
                displayedJobs.map((exam) => (
                  <div key={exam.id} className="to__exam-card">
                    {/* Top Row: Emblem, Badges, Bookmark */}
                    <div className="to__card-top">
                      <div className="to__exam-emblem-wrap">
                        <img
                          src={exam.emblem}
                          alt={exam.title}
                          className="to__exam-emblem"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/emblem_india.png";
                          }}
                        />
                      </div>

                      <div className="to__badge-group">
                        <span className="to__badge-pill to__badge-pill--scope">
                          {exam.scope}
                        </span>
                        <span className={`to__badge-pill to__badge-pill--${exam.statusType}`}>
                          {exam.status}
                        </span>
                      </div>

                      <div className="to__card-actions">
                        <button
                          type="button"
                          className={`to__action-btn to__share-btn ${copiedJobId === (exam._id || exam.id) ? "to__share-btn--copied" : ""}`}
                          onClick={(e) => handleShareJob(e, exam)}
                          aria-label="Share Job Details"
                          title={copiedJobId === (exam._id || exam.id) ? "Link Copied to Clipboard!" : "Share Job Link"}
                        >
                          {copiedJobId === (exam._id || exam.id) ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" width="16" height="16">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <circle cx="18" cy="5" r="3" />
                              <circle cx="6" cy="12" r="3" />
                              <circle cx="18" cy="19" r="3" />
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                          )}
                          {copiedJobId === (exam._id || exam.id) && (
                            <span className="to__copied-tooltip">Copied!</span>
                          )}
                        </button>

                        <button
                          type="button"
                          className={`to__action-btn to__bookmark-btn ${savedExams[exam.id] ? "to__bookmark-btn--active" : ""}`}
                          onClick={() => toggleSaveExam(exam.id)}
                          aria-label="Save Exam"
                          title={savedExams[exam.id] ? "Saved" : "Save Exam"}
                        >
                          <svg viewBox="0 0 24 24" fill={savedExams[exam.id] ? "#2563eb" : "none"} stroke={savedExams[exam.id] ? "#2563eb" : "#94a3b8"} strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Exam Title & Org */}
                    <h4 className="to__exam-title">{exam.title}</h4>
                    <p className="to__exam-org">{exam.organization}</p>

                    {/* Info List */}
                    <div className="to__exam-info">
                      <div className="to__info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="to__info-icon">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        <span>{exam.vacancies}</span>
                      </div>

                      <div className="to__info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="to__info-icon">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span><strong>{exam.date1Label}:</strong> {exam.date1Value}</span>
                      </div>

                      <div className="to__info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="to__info-icon">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <span><strong>{exam.date2Label}:</strong> {exam.date2Value}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="to__tags">
                      {exam.tags.map((tag) => (
                        <span key={tag} className="to__tag">{tag}</span>
                      ))}
                      {exam.extraTagsCount > 0 && (
                        <span className="to__tag to__tag--count">+{exam.extraTagsCount}</span>
                      )}
                    </div>

                    {/* Action Button: View Details */}
                    <Link
                      to={exam.detailUrl || `/job/${exam.id}`}
                      className={`to__card-btn to__card-btn--${exam.btnVariant || "apply"}`}
                      onClick={(e) => handleJobClick(e, exam.detailUrl || `/job/${exam.id}`)}
                    >
                      {exam.btnText || "View Details \u2192"}
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* Right Column: Anchored Stay Updated Newsletter Card */}
            <aside className="to__sidebar-col">
              <div className="to__newsletter-card">
                <div className="to__nl-bell">
                  <svg viewBox="0 0 24 24" fill="#2563eb">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>

                <h4 className="to__nl-title">Stay Updated</h4>
                <p className="to__nl-sub">
                  Get notified about the latest government exams, results, and job alerts.
                </p>

                {subscribed && (
                  <div className="to__nl-success">Subscribed successfully!</div>
                )}

                <form className="to__nl-form" onSubmit={handleSubscribe}>
                  <div className="to__nl-input-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="to__nl-input-icon">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <button type="submit" className="to__nl-btn">
                    Notify Me &rarr;
                  </button>
                </form>

                <div className="to__nl-divider">
                  <span>OR</span>
                </div>

                <div className="to__nl-socials">
                  <a href="#" className="to__nl-social to__nl-social--telegram">
                    <svg viewBox="0 0 24 24" fill="#0088cc" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                    <span>Join Telegram</span>
                  </a>

                  <a href="#" className="to__nl-social to__nl-social--whatsapp">
                    <svg viewBox="0 0 24 24" fill="#25D366" width="16" height="16">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                    </svg>
                    <span>Join WhatsApp</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TopOpportunities;
