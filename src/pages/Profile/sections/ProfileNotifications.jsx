import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../../../config/api";
import "./ProfileNotifications.css";

const ProfileNotifications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("portal_saved_jobs") || "[]");
    setSavedIds(saved);
  }, []);

  const defaultNotifications = [
    {
      _id: "6aa257c3f58e7297a035c32c",
      title: "Recruitment for Various Posts of Junior Engineer (JE) and Depot Material Superintendent (DMS) (CEN No. 04/2026)",
      organization: "Railway Recruitment Boards (RRBs)",
      category: "Government Exams",
      level: "National Level",
      vacancies: "3,993",
      applicationLastDate: "2026-09-13",
      notificationDate: "2026-09-01",
      logoUrl: "/emblem_india.png",
      status: "Active",
      isNew: true,
      postedTimeText: "Newly Announced",
      description: "Online applications invited for Junior Engineers across multiple railway zones and production units.",
    },
    {
      _id: "upsc-demo",
      title: "UPSC Civil Services Examination (CSE - IAS/IPS/IFS)",
      organization: "Union Public Service Commission",
      category: "Civil Services",
      level: "National Level",
      vacancies: "1,056",
      applicationLastDate: "2026-09-30",
      notificationDate: "2026-08-25",
      logoUrl: "/emblem_india.png",
      status: "Apply Soon",
      isNew: true,
      postedTimeText: "Recently Posted",
      description: "Official notification issued for prestigious administrative, police, and diplomatic cadres.",
    },
    {
      _id: "sbi-demo",
      title: "SBI Probationary Officers (PO) Direct Recruitment 2026",
      organization: "State Bank of India",
      category: "Banking Exams",
      level: "National Level",
      vacancies: "2,000",
      applicationLastDate: "2026-10-15",
      notificationDate: "2026-09-05",
      logoUrl: "/emblem_india.png",
      status: "Upcoming",
      isNew: true,
      postedTimeText: "1 day ago",
      description: "Scale-I officer positions open for graduates across all regional circles of SBI.",
    },
    {
      _id: "ssc-demo",
      title: "Combined Graduate Level Examination (SSC CGL 2026)",
      organization: "Staff Selection Commission",
      category: "Government Exams",
      level: "National Level",
      vacancies: "14,500",
      applicationLastDate: "2026-10-31",
      notificationDate: "2026-08-30",
      logoUrl: "/emblem_india.png",
      status: "Ongoing",
      isNew: false,
      postedTimeText: "3 days ago",
      description: "Recruitment for Group B and Group C officers across ministries and central departments.",
    },
  ];

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.JOB}/all`);
        const data = await res.json();

        let loadedJobs = [];
        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          loadedJobs = data.jobs;
          localStorage.setItem("portal_custom_jobs", JSON.stringify(data.jobs));
        } else {
          const cached = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
          loadedJobs = cached;
        }

        // Merge backend/cached jobs with default notifications, prioritizing latest
        const combined = [...loadedJobs, ...defaultNotifications];
        const unique = Array.from(new Map(combined.map((item) => [String(item._id || item.id), item])).values());
        setJobs(unique);
      } catch (err) {
        const cached = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
        const combined = [...cached, ...defaultNotifications];
        const unique = Array.from(new Map(combined.map((item) => [String(item._id || item.id), item])).values());
        setJobs(unique);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  const handleToggleSave = (jobId) => {
    const sId = String(jobId);
    let updated;
    if (savedIds.includes(sId)) {
      updated = savedIds.filter((id) => id !== sId);
    } else {
      updated = [...savedIds, sId];
    }
    setSavedIds(updated);
    localStorage.setItem("portal_saved_jobs", JSON.stringify(updated));
  };

  const filteredJobs = jobs.filter((j) => {
    if (filter === "all") return true;
    if (filter === "national") return (j.level || "").toLowerCase().includes("national");
    if (filter === "saved") return savedIds.includes(String(j._id || j.id));
    return true;
  });

  return (
    <div className="pn-container">
      {/* ── Section Header ── */}
      <div className="pn-header">
        <div className="pn-header__text">
          <div className="pn-header__title-row">
            <div className="pn-header__bell-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2.2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="pn-title">Newly Posted Job & Exam Opportunities</h3>
            <span className="pn-badge-count">{filteredJobs.length} New</span>
          </div>
          <p className="pn-subtitle">
            Instant updates on the latest official government notifications, public sector openings, and exams.
          </p>
        </div>

        {/* Filters */}
        <div className="pn-filters">
          <button
            type="button"
            className={`pn-filter-btn ${filter === "all" ? "pn-filter-btn--active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Opportunities
          </button>
          <button
            type="button"
            className={`pn-filter-btn ${filter === "national" ? "pn-filter-btn--active" : ""}`}
            onClick={() => setFilter("national")}
          >
            National Level
          </button>
          <button
            type="button"
            className={`pn-filter-btn ${filter === "saved" ? "pn-filter-btn--active" : ""}`}
            onClick={() => setFilter("saved")}
          >
            Saved Only
          </button>
        </div>
      </div>

      {/* ── Notifications Feed ── */}
      {loading ? (
        <div className="pn-loading">
          <div className="pn-loading-spinner" />
          <p>Checking for newly announced opportunities...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="pn-empty">
          <p>No job opportunities matching this filter.</p>
          <button type="button" onClick={() => setFilter("all")} className="pn-reset-btn">
            View All Opportunities
          </button>
        </div>
      ) : (
        <div className="pn-feed">
          {filteredJobs.map((job) => {
            const jobId = String(job._id || job.id);
            const isSaved = savedIds.includes(jobId);

            return (
              <div key={jobId} className="pn-card">
                {/* Top Row: Meta, Time, and Save */}
                <div className="pn-card__top">
                  <div className="pn-card__org-info">
                    <div className="pn-card__logo-wrap">
                      <img
                        src={job.logoUrl || "/emblem_india.png"}
                        alt={job.organization || "Logo"}
                        className="pn-card__logo"
                        onError={(e) => {
                          e.target.src = "/emblem_india.png";
                        }}
                      />
                    </div>
                    <div>
                      <span className="pn-card__org-name">
                        {job.organization || "Official Commission"}
                      </span>
                      <div className="pn-card__badges">
                        <span className="pn-pill pn-pill--level">{job.level || "National Level"}</span>
                        <span className="pn-pill pn-pill--category">{job.category || "Govt Exams"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pn-card__top-right">
                    <span className="pn-time-tag">
                      <span className="pn-time-dot" />
                      {job.postedTimeText || "Newly Posted"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleSave(jobId)}
                      className={`pn-save-btn ${isSaved ? "pn-save-btn--active" : ""}`}
                      title={isSaved ? "Saved" : "Save for later"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill={isSaved ? "#2563eb" : "none"}
                        stroke="#2563eb"
                        strokeWidth="2"
                      >
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Job Title */}
                <h4 className="pn-card__title">
                  <Link to={`/job/${jobId}`} className="pn-card__title-link">
                    {job.title}
                  </Link>
                </h4>

                {/* Description snippet if available */}
                {job.description && (
                  <p className="pn-card__desc">{job.description}</p>
                )}

                {/* Key Details Strip */}
                <div className="pn-card__details">
                  <div className="pn-detail-item">
                    <span className="pn-detail-label">Total Vacancies:</span>
                    <span className="pn-detail-value pn-detail-value--highlight">
                      {job.vacancies
                        ? isNaN(Number(job.vacancies))
                          ? job.vacancies
                          : Number(job.vacancies).toLocaleString("en-IN")
                        : "Multiple"}
                    </span>
                  </div>

                  <div className="pn-detail-item">
                    <span className="pn-detail-label">Apply Till:</span>
                    <span className="pn-detail-value">
                      {job.applicationLastDate || "Check official notice"}
                    </span>
                  </div>

                  <div className="pn-detail-item">
                    <span className="pn-detail-label">Status:</span>
                    <span className="pn-status-tag">{job.status || "Apply Now"}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pn-card__footer">
                  <Link to={`/job/${jobId}`} className="pn-view-btn">
                    <span>View Full Notification & Details</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileNotifications;
