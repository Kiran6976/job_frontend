import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FeaturedJobs.css";
import { FILTER_TABS, FEATURED_JOBS, TRUST_FEATURES } from "./jobData";
import { API_ENDPOINTS } from "../../config/api";

const timeAgo = (dateStr) => {
  if (!dateStr) return "Recently posted";
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diffMs) || diffMs < 0) return "Recently posted";
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `Posted ${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `Posted ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return `Posted on ${new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`;
  } catch (e) {
    return "Recently posted";
  }
};

const FeaturedJobs = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [savedJobs, setSavedJobs] = useState({});
  const [customJobs, setCustomJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.JOB}/all`);
        const data = await res.json();

        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setCustomJobs(data.jobs);
          localStorage.setItem("portal_custom_jobs", JSON.stringify(data.jobs));
        } else {
          const fallback = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
          if (fallback.length > 0) setCustomJobs(fallback);
        }
      } catch (err) {
        const fallback = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
        if (fallback.length > 0) setCustomJobs(fallback);
      }
    };
    loadJobs();
  }, []);

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTabIcon = (type) => {
    switch (type) {
      case "grid":
        return (
          <svg className="fj__tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        );
      case "home":
        return (
          <svg className="fj__tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case "briefcase":
        return (
          <svg className="fj__tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      case "clock":
        return (
          <svg className="fj__tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case "academic":
        return (
          <svg className="fj__tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderTrustIcon = (icon) => {
    switch (icon) {
      case "shield":
        return (
          <div className="fj__trust-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        );
      case "document":
        return (
          <div className="fj__trust-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        );
      case "chart":
        return (
          <div className="fj__trust-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Convert custom published jobs from admin into card format
  const formattedCustomJobs = customJobs.map((j) => {
    const rawTags = Array.isArray(j.tags) && j.tags.length > 0 ? j.tags : [];
    const skills =
      rawTags.length > 0
        ? rawTags
        : [
            j.vacancies ? `${Number(j.vacancies).toLocaleString("en-IN")} Vacancies` : "Central Govt",
            j.level || "National Level",
            "Graduate",
          ];

    return {
      id: j._id || j.id,
      company: j.organization || "Govt Organization",
      logo: j.logoUrl || "/emblem_india.png",
      verified: true,
      industry: j.category || "Government Exams",
      title: j.title,
      description:
        j.postsDescription ||
        j.aboutOrg ||
        (j.slogan ? `“${j.slogan}” — Official Notification` : "Official recruitment opportunity announced. Check eligibility and apply."),
      location: j.location || "All India",
      type: j.level || (j.type === "govt" ? "Govt Exam" : "Full-time"),
      typeVariant:
        j.status === "Apply Now"
          ? "green"
          : j.level === "State Level"
          ? "purple"
          : "blue",
      salary: j.salary
        ? j.salary
        : j.vacancies
        ? `${Number(j.vacancies).toLocaleString("en-IN")} Vacancies`
        : "As per 7th CPC",
      skills: skills.slice(0, 3),
      extraSkillsCount: Math.max(0, skills.length - 3),
      postedTime: timeAgo(j.createdAt),
      detailUrl: `/job/${j._id || j.id}`,
    };
  });

  // Use posted jobs if available; otherwise use default sample jobs
  const rawJobs = formattedCustomJobs.length > 0 ? formattedCustomJobs : FEATURED_JOBS;

  // Filter based on activeTab
  const displayedJobs = rawJobs.filter((job) => {
    if (activeTab === "all") return true;
    const loc = String(job.location || "").toLowerCase();
    const type = String(job.type || "").toLowerCase();
    const ind = String(job.industry || "").toLowerCase();

    if (activeTab === "remote") return loc.includes("remote");
    if (activeTab === "fulltime")
      return type.includes("full") || type.includes("govt") || type.includes("national") || ind.includes("govt");
    if (activeTab === "parttime") return type.includes("part") || type.includes("state");
    if (activeTab === "internship") return type.includes("intern") || ind.includes("intern");
    return true;
  });

  return (
    <section className="fj">
      <div className="fj__container">
        {/* ────────── Header ────────── */}
        <div className="fj__header">
          {/* Badge */}
          <div className="fj__badge">
            <svg className="fj__badge-star" viewBox="0 0 24 24" fill="#2563eb">
              <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Featured Opportunities</span>
          </div>

          {/* Heading with sparkle doodle */}
          <div className="fj__heading-wrap">
            <div className="fj__sparkle">
              <span className="fj__sparkle-ray fj__sparkle-ray--1" />
              <span className="fj__sparkle-ray fj__sparkle-ray--2" />
              <span className="fj__sparkle-ray fj__sparkle-ray--3" />
            </div>
            <h2 className="fj__title">
              Featured <span className="fj__title--accent">Jobs</span>
            </h2>
          </div>

          <p className="fj__subtitle">
            Explore hand-picked opportunities from top organizations and commissions.
          </p>

          {/* Handwritten top-right doodle */}
          <div className="fj__doodle-top">
            <span className="fj__doodle-text">
              Great Careers Start Here
            </span>
            <svg className="fj__doodle-arrow" viewBox="0 0 50 40" fill="none" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 5 C 25 15, 38 22, 35 32 C 34 35, 29 34, 30 28 C 30.5 24, 34 25, 38 29" />
            </svg>
          </div>
        </div>

        {/* ────────── Filter Tabs ────────── */}
        <div className="fj__filters">
          <div className="fj__tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`fj__tab-btn ${activeTab === tab.id ? "fj__tab-btn--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {renderTabIcon(tab.icon)}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <Link to="/jobs" className="fj__view-all-btn">
            View All Jobs
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ────────── Job Cards Grid ────────── */}
        <div className="fj__grid">
          {displayedJobs.map((job) => (
            <div key={job.id} className="fj__card">
              {/* Card Header: Company Logo, Info & Save Heart */}
              <div className="fj__card-top">
                <div className="fj__card-company">
                  <div className="fj__card-logo-wrap">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="fj__card-logo"
                      onError={(e) => {
                        e.target.src = "/emblem_india.png";
                      }}
                    />
                  </div>
                  <div className="fj__card-company-info">
                    <div className="fj__card-company-name-row">
                      <h4 className="fj__card-company-name">{job.company}</h4>
                      {job.verified && (
                        <svg className="fj__verified-badge" viewBox="0 0 24 24" fill="#2563eb">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                    <span className="fj__card-industry">{job.industry}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`fj__heart-btn ${savedJobs[job.id] ? "fj__heart-btn--active" : ""}`}
                  onClick={() => toggleSaveJob(job.id)}
                  aria-label="Save job"
                >
                  <svg viewBox="0 0 24 24" fill={savedJobs[job.id] ? "#ef4444" : "none"} stroke={savedJobs[job.id] ? "#ef4444" : "#94a3b8"} strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="fj__card-title">
                <Link
                  to={job.detailUrl || `/job/${job.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {job.title}
                </Link>
              </h3>
              <p className="fj__card-desc">{job.description}</p>

              {/* Location & Type badge */}
              <div className="fj__card-meta">
                <div className="fj__meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="fj__meta-icon">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>{job.location}</span>
                </div>

                <span className={`fj__type-badge fj__type-badge--${job.typeVariant}`}>
                  {job.typeVariant === "green" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  )}
                  {job.typeVariant === "blue" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                  )}
                  {job.typeVariant === "purple" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  )}
                  {job.type}
                </span>
              </div>

              {/* Salary */}
              <div className="fj__card-salary">
                <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" className="fj__salary-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>{job.salary}</span>
              </div>

              {/* Skills Tags */}
              <div className="fj__card-skills">
                {job.skills.map((skill) => (
                  <span key={skill} className="fj__skill-tag">
                    {skill}
                  </span>
                ))}
                {job.extraSkillsCount > 0 && (
                  <span className="fj__skill-tag fj__skill-tag--count">
                    +{job.extraSkillsCount}
                  </span>
                )}
              </div>

              {/* Card Footer: Posted time & Apply button */}
              <div className="fj__card-footer">
                <span className="fj__posted-time">{job.postedTime}</span>
                <Link to={job.detailUrl || `/job/${job.id}`} className="fj__apply-btn">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}

          {displayedJobs.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No opportunities found in this category.</p>
              <Link to="/jobs" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                Browse all available opportunities &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* ────────── Trust Banner ────────── */}
        <div className="fj__trust-banner">
          {/* Stack item 1: Avatars */}
          <div className="fj__trust-item fj__trust-item--social">
            <div className="fj__trust-avatars">
              {TRUST_FEATURES[0].avatars.map((url, i) => (
                <img key={i} src={url} alt="User" className="fj__trust-avatar" />
              ))}
              <div className="fj__trust-avatar fj__trust-avatar--plus">+</div>
            </div>
            <div className="fj__trust-text-group">
              <span className="fj__trust-count">{TRUST_FEATURES[0].title}</span>
              <span className="fj__trust-sub">{TRUST_FEATURES[0].subtitle}</span>
            </div>
          </div>

          <div className="fj__trust-divider" />

          {/* Feature 2: Verified */}
          <div className="fj__trust-item">
            {renderTrustIcon(TRUST_FEATURES[1].icon)}
            <div className="fj__trust-text-group">
              <span className="fj__trust-title">{TRUST_FEATURES[1].title}</span>
              <span className="fj__trust-sub">{TRUST_FEATURES[1].subtitle}</span>
            </div>
          </div>

          <div className="fj__trust-divider" />

          {/* Feature 3: Easy Application */}
          <div className="fj__trust-item">
            {renderTrustIcon(TRUST_FEATURES[2].icon)}
            <div className="fj__trust-text-group">
              <span className="fj__trust-title">{TRUST_FEATURES[2].title}</span>
              <span className="fj__trust-sub">{TRUST_FEATURES[2].subtitle}</span>
            </div>
          </div>

          <div className="fj__trust-divider" />

          {/* Feature 4: Better Opportunities */}
          <div className="fj__trust-item">
            {renderTrustIcon(TRUST_FEATURES[3].icon)}
            <div className="fj__trust-text-group">
              <span className="fj__trust-title">{TRUST_FEATURES[3].title}</span>
              <span className="fj__trust-sub">{TRUST_FEATURES[3].subtitle}</span>
            </div>
          </div>
        </div>

        {/* ────────── Bottom CTA Section ────────── */}
        <div className="fj__bottom-cta">
          {/* Bottom Left Doodle */}
          <div className="fj__doodle-bottom">
            <span className="fj__doodle-text">Build<br />Your Future</span>
            <svg className="fj__doodle-arrow-bottom" viewBox="0 0 60 40" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 32 C 24 24, 38 12, 50 6 M 38 5 L 51 6 L 48 18" />
            </svg>
          </div>

          {/* CTA Center Button */}
          <div className="fj__cta-center">
            <Link to="/jobs" className="fj__cta-btn">
              Browse All Jobs &rarr;
            </Link>
            <p className="fj__cta-subtext">
              More Opportunities. A Brighter Tomorrow.
            </p>
          </div>

          {/* Bottom Right Decorative Dot Grid */}
          <div className="fj__dot-grid">
            {Array.from({ length: 24 }).map((_, idx) => (
              <span key={idx} className="fj__dot" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
