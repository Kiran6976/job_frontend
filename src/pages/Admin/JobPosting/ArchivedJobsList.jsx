import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  Search,
  RotateCcw,
  Trash2,
  Eye,
  Calendar,
  Building2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { formatJobDate } from "../../../utils/jobHelpers";
import "./ArchivedJobsList.css";

const ArchivedJobsList = ({
  jobs = [],
  onDeleteJob,
  onEditJob,
  onNavigatePostJob,
  onRestoreJob,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(jobs.map((j) => j.category).filter(Boolean))),
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm.trim() ||
      (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.organization || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.category || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="ajp__card ajp-archive">
      {/* ── Header ── */}
      <div className="ajp__card-head-row">
        <div>
          <div className="ajp-archive__title-wrap">
            <h2 className="ajp__card-title">Archived Opportunities ({jobs.length})</h2>
            <span className="ajp-archive__status-pill">
              <Clock size={13} /> Application Closed
            </span>
          </div>
          <p className="ajp__card-desc">
            Job postings whose application deadline has passed or were archived. These postings are removed from the public portal and stored safely here.
          </p>
        </div>

        <button
          type="button"
          className="ajp__btn-new-tab"
          onClick={onNavigatePostJob}
        >
          + Post New Job / Exam
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="ajp-archive__toolbar">
        <div className="ajp-archive__search-wrap">
          <Search size={16} className="ajp-archive__search-icon" />
          <input
            type="text"
            placeholder="Search archived jobs by title, organization, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ajp-archive__search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="ajp-archive__search-clear"
            >
              ✕
            </button>
          )}
        </div>

        {categories.length > 2 && (
          <div className="ajp-archive__cat-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`ajp-archive__cat-btn ${
                  selectedCategory === cat ? "ajp-archive__cat-btn--active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content Feed / Empty State ── */}
      {jobs.length === 0 ? (
        <div className="ajp-archive__empty">
          <div className="ajp-archive__empty-icon">
            <Archive size={40} />
          </div>
          <h3 className="ajp-archive__empty-title">No Archived Opportunities</h3>
          <p className="ajp-archive__empty-desc">
            When any job posting's application last date passes, it will automatically move from the public portal to this Archives section.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="ajp-archive__empty">
          <h3 className="ajp-archive__empty-title">No matching archived jobs found</h3>
          <p className="ajp-archive__empty-desc">
            Try adjusting your search query or category filters.
          </p>
          <button
            type="button"
            className="ajp-archive__reset-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="ajp-archive__grid">
          {filteredJobs.map((job) => {
            const jobId = job._id || job.id;
            return (
              <div key={jobId} className="ajp-archive__item">
                <div className="ajp-archive__item-top">
                  <div className="ajp-archive__org-box">
                    <img
                      src={job.logoUrl || "/emblem_india.png"}
                      alt={job.organization || "Logo"}
                      className="ajp-archive__logo"
                      onError={(e) => {
                        e.target.src = "/emblem_india.png";
                      }}
                    />
                    <div className="ajp-archive__meta-wrap">
                      <span className="ajp-archive__org-name">
                        {job.organization || "Government Commission"}
                      </span>
                      <div className="ajp-archive__pills">
                        <span className="ajp-archive__pill ajp-archive__pill--category">
                          {job.category || "Govt Exams"}
                        </span>
                        <span className="ajp-archive__pill ajp-archive__pill--level">
                          {job.level || "National"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ajp-archive__badge-closed">
                    <AlertCircle size={13} />
                    <span>Application Closed</span>
                  </div>
                </div>

                <h3 className="ajp-archive__item-title">{job.title}</h3>

                <div className="ajp-archive__specs">
                  <div className="ajp-archive__spec-item">
                    <span className="ajp-archive__spec-label">Vacancies:</span>
                    <span className="ajp-archive__spec-value">
                      {job.vacancies || "Multiple"}
                    </span>
                  </div>
                  <div className="ajp-archive__spec-item">
                    <span className="ajp-archive__spec-label">Last Date Was:</span>
                    <span className="ajp-archive__spec-value ajp-archive__spec-value--date">
                      {formatJobDate(job.applicationLastDate, "Closed")}
                    </span>
                  </div>
                </div>

                {/* ── Actions Footer ── */}
                <div className="ajp-archive__item-actions">
                  <button
                    type="button"
                    onClick={() => onEditJob(job)}
                    className="ajp-archive__btn ajp-archive__btn--reactivate"
                    title="Extend last date or edit details to reactivate on public site"
                  >
                    <RotateCcw size={14} />
                    <span>Reactivate / Extend</span>
                  </button>

                  <Link
                    to={`/job/${jobId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ajp-archive__btn ajp-archive__btn--view"
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => onDeleteJob(jobId, job.title)}
                    className="ajp-archive__btn ajp-archive__btn--delete"
                    title="Delete permanently from database"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArchivedJobsList;
