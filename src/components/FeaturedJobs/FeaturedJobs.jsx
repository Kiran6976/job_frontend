import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FeaturedJobs.css";
import { FILTER_TABS, FEATURED_JOBS } from "./jobData";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

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
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [savedJobs, setSavedJobs] = useState({});
  const [customJobs, setCustomJobs] = useState([]);
  const videoRef = useRef(null);

  const handleJobClick = (e, targetUrl) => {
    if (!user) {
      e.preventDefault();
      openAuthModal(targetUrl);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

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

  // Convert custom published jobs from admin into card format, sorted by latest
  const sortedCustomJobs = [...customJobs].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const formattedCustomJobs = sortedCustomJobs.map((j) => {
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

  // Filter based on activeTab and limit to 4 latest cards only
  const displayedJobs = rawJobs
    .filter((job) => {
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
    })
    .slice(0, 4);

  return (
    <section className="fj">
      {/* Background Video */}
      <div className="fj__video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          defaultMuted
          playsInline
          preload="auto"
          className="fj__bg-video"
          src="/make_it_animate_1080p_20260911110940.mp4"
        >
          <source src="/make_it_animate_1080p_20260911110940.mp4" type="video/mp4" />
        </video>
        <div className="fj__video-overlay" />
      </div>

      <div className="fj__container">
        {/* ────────── Header Row (Left: Header, Right: Doodle) ────────── */}
        <div className="fj__header-row">
          <div className="fj__header-left">
            <div className="fj__pretitle-wrap">
              <span className="fj__pretitle">OPPORTUNITIES AWAIT</span>
              <span className="fj__pretitle-dash" />
            </div>

            <h2 className="fj__title">
              Discover Your Next <span className="fj__title-highlight">Opportunity</span>
            </h2>

            <p className="fj__subtitle">
              Find verified jobs from government, banking, education, defense and leading organizations.
            </p>
          </div>

          <div className="fj__doodle-wrap">
            <span className="fj__doodle-text">
              Better<br />Careers<br />Brighter<br />Tomorrows
            </span>
            <svg
              className="fj__doodle-curve"
              viewBox="0 0 130 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 16 C 45 4, 85 4, 124 14" />
            </svg>
          </div>
        </div>

        {/* ────────── Filter Tabs & View All ────────── */}
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

          <Link
            to="/jobs"
            className="fj__view-all-btn"
            onClick={(e) => handleJobClick(e, "/jobs")}
          >
            View All Jobs
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
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
                  onClick={(e) => handleJobClick(e, job.detailUrl || `/job/${job.id}`)}
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
                <Link
                  to={job.detailUrl || `/job/${job.id}`}
                  className="fj__apply-btn"
                  onClick={(e) => handleJobClick(e, job.detailUrl || `/job/${job.id}`)}
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}

          {displayedJobs.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No opportunities found in this category.</p>
              <Link
                to="/jobs"
                style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
                onClick={(e) => handleJobClick(e, "/jobs")}
              >
                Browse all available opportunities &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
