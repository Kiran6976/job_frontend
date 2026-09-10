import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProfileSavedJobs.css";

const ProfileSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const customJobs = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
    const savedIds = JSON.parse(localStorage.getItem("portal_saved_jobs") || "[]");

    const defaultSaved = [
      {
        id: "6aa257c3f58e7297a035c32c",
        title: "Recruitment for Various Posts of Junior Engineer (JE) and DMS (CEN No. 04/2026)",
        organization: "Railway Recruitment Boards (RRBs)",
        vacancies: "3,993",
        lastDate: "Sep 13, 2026",
        category: "National Level",
      },
      {
        id: "upsc-demo",
        title: "UPSC Civil Services Examination (CSE - IAS/IPS)",
        organization: "Union Public Service Commission",
        vacancies: "1,056",
        lastDate: "Aug 30, 2026",
        category: "Civil Services",
      },
    ];

    const matchedCustom = customJobs
      .filter((j) => savedIds.includes(String(j._id || j.id)))
      .map((j) => ({
        id: j._id || j.id,
        title: j.title,
        organization: j.organization,
        vacancies: j.vacancies || "1,000+",
        lastDate: j.applicationLastDate || "Upcoming",
        category: j.category || "General",
      }));

    const combined = [...defaultSaved, ...matchedCustom];
    // Remove duplicates
    const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
    setSavedJobs(unique);
  }, []);

  const handleRemove = (id) => {
    const savedIds = JSON.parse(localStorage.getItem("portal_saved_jobs") || "[]");
    const updated = savedIds.filter((item) => item !== String(id));
    localStorage.setItem("portal_saved_jobs", JSON.stringify(updated));
    setSavedJobs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="psj-container">
      <div className="psj-header">
        <div>
          <h3 className="psj-title">Saved Jobs & Examination Alerts</h3>
          <p className="psj-subtitle">Items bookmarked for quick access and last-date tracking.</p>
        </div>
        <span className="psj-count-badge">{savedJobs.length} Saved</span>
      </div>

      {savedJobs.length === 0 ? (
        <div className="psj-empty">
          <p>No saved opportunities yet.</p>
          <Link to="/jobs" className="psj-explore-link">
            Explore Opportunities &rarr;
          </Link>
        </div>
      ) : (
        <div className="psj-grid">
          {savedJobs.map((job) => (
            <div key={job.id} className="psj-card">
              <div className="psj-card__top">
                <span className="psj-badge">{job.category}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(job.id)}
                  className="psj-unsave-btn"
                  title="Remove from saved"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#2563eb" stroke="#2563eb" strokeWidth="2">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </button>
              </div>

              <h4 className="psj-card__title">{job.title}</h4>
              <p className="psj-card__org">{job.organization}</p>

              <div className="psj-card__meta">
                <span><strong>Vacancies:</strong> {job.vacancies}</span>
                <span>•</span>
                <span><strong>Last Date:</strong> {job.lastDate}</span>
              </div>

              <div className="psj-card__footer">
                <Link to={`/job/${job.id}`} className="psj-view-btn">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSavedJobs;
