import React from "react";
import { Link } from "react-router-dom";
import { Megaphone, Building2, Eye, Edit2 } from "lucide-react";
import "./PublishedJobsList.css";

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

const PublishedJobsList = ({
  jobs = [],
  onDeleteJob,
  onEditJob,
  onNavigatePostJob,
}) => {
  return (
    <div className="ajp__card">
      <div className="ajp__card-head-row">
        <div>
          <h2 className="ajp__card-title">Published Opportunities ({jobs.length})</h2>
          <p className="ajp__card-desc">
            Real-time listings synchronized with the user-facing portal &amp; detailed pages.
          </p>
        </div>
        <button
          type="button"
          className="ajp__btn-new-tab"
          onClick={onNavigatePostJob}
        >
          + Post Another Notification
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="ajp__empty-box">
          <div className="ajp__empty-icon">
            <Megaphone size={36} color="#64748b" />
          </div>
          <h3>No custom notifications published yet</h3>
          <p>Click "Post New Job / Exam" above to publish your first notification to the portal.</p>
        </div>
      ) : (
        <div className="ajp__table-wrap">
          <table className="ajp__table">
            <thead>
              <tr>
                <th style={{ minWidth: "220px" }}>Opportunity / Exam</th>
                <th style={{ minWidth: "160px" }}>Organization / Commission</th>
                <th>Category</th>
                <th style={{ textAlign: "center" }}>Vacancies</th>
                <th>Application Start</th>
                <th>Exam Date</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "right", minWidth: "180px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    <div className="ajp__table-title-cell">
                      {job.logoUrl ? (
                        <img
                          src={job.logoUrl}
                          alt={job.title}
                          className="ajp__table-emblem"
                        />
                      ) : (
                        <div className="ajp__table-emblem-ph">
                          <Building2 size={18} color="#64748b" />
                        </div>
                      )}
                      <div>
                        <strong className="ajp__table-title">{job.title}</strong>
                        <span className="ajp__table-level">{job.level || "National"}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{job.organization}</span>
                  </td>
                  <td>
                    <span className="ajp__table-cat">{job.category}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <strong style={{ color: "#38bdf8", fontSize: "0.95rem" }}>
                      {job.vacancies ? Number(job.vacancies).toLocaleString("en-IN") : "—"}
                    </strong>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatDateDisplay(job.applicationStartDate || job.notificationDate)}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatDateDisplay(job.examDate)}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    <span
                      className={`ajp-badge ajp-badge--status ajp-badge--${(job.status || "").toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "flex-end" }}>
                      <Link
                        to={`/job/${job._id}`}
                        target="_blank"
                        className="ajp__btn-preview-link"
                        title="View Detailed Public Page"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Eye size={13} /> View
                      </Link>
                      <button
                        type="button"
                        className="ajp__btn-edit-btn"
                        onClick={() => onEditJob && onEditJob(job)}
                        title="Edit all fields of this job"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="ajp__table-del-btn"
                        onClick={() => onDeleteJob(job._id)}
                        title="Delete listing"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublishedJobsList;
