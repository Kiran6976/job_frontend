import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./TopOpportunities.css";
import { OPPORTUNITY_TABS } from "./opportunitiesData";
import { API_ENDPOINTS } from "../../config/api";


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
  const [activeTab, setActiveTab] = useState("all");
  const [rawCategories, setRawCategories] = useState([]);
  const [customJobs, setCustomJobs] = useState([]);
  const [savedExams, setSavedExams] = useState({});
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [searchParams] = useSearchParams();

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

  // Filter jobs based on activeTab
  const displayedJobs = allFormattedJobs.filter((job) => {
    if (activeTab === "all") return true;
    const currentTab = dynamicTabs.find((t) => t.id === activeTab);
    return matchesTab(job, activeTab, currentTab?.label);
  });

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
                  <span className="to__flame">🔥</span>{" "}
                  {activeTab === "all"
                    ? "Trending Opportunities"
                    : dynamicTabs.find((t) => t.id === activeTab)?.label || "Opportunities"}
                </h3>
                <p className="to__section-sub">
                  {displayedJobs.length} {displayedJobs.length === 1 ? "opportunity" : "opportunities"} available. Start preparing today!
                </p>
              </div>
            </div>

            <div className="to__section-controls">
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
                    No opportunities found in this category
                  </h4>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "16px" }}>
                    New positions are posted frequently. Check back soon or explore other categories.
                  </p>
                  <button
                    onClick={() => setActiveTab("all")}
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

                      <button
                        type="button"
                        className={`to__bookmark-btn ${savedExams[exam.id] ? "to__bookmark-btn--active" : ""}`}
                        onClick={() => toggleSaveExam(exam.id)}
                        aria-label="Save Exam"
                      >
                        <svg viewBox="0 0 24 24" fill={savedExams[exam.id] ? "#2563eb" : "none"} stroke={savedExams[exam.id] ? "#2563eb" : "#94a3b8"} strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
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
