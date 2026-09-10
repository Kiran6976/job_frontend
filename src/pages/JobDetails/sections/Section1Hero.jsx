import React, { useState } from "react";
import { formatDate, isDatePresent, parseJobDate } from "../jobDetailsHelpers";
import "./Section1Hero.css";

const Section1Hero = ({ job, timeLeft, saved, onToggleSave, vacanciesCount }) => {
  const [notified, setNotified] = useState(false);

  const resolvedStatus = (() => {
    if (job?.applicationStartDate) {
      const start = parseJobDate(job.applicationStartDate);
      if (start) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (today >= start) {
          return "Ongoing";
        }
      }
    }
    return job?.status || "Apply Soon";
  })();

  return (
    <section className="jd-hero">
      <div className="jd-hero__backdrop">
        <img
          src={job.bannerUrl || "/UPSC.png"}
          alt="Landmark Backdrop"
          className="jd-hero__bg-art"
          onError={(e) => {
            e.target.src = "/UPSC.png";
          }}
        />
        <div className="jd-hero__overlay" />
      </div>

      <div className="jd-hero__main">
        <div className="jd-hero__profile">
          <div className="jd-hero__emblem-box">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={job.title}
                className="jd-hero__emblem"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="jd-hero__emblem-ph">🏛️</div>
            )}
          </div>

          <div className="jd-hero__details">
            <div className="jd-hero__meta-top">
              <span className="jd-badge jd-badge--scope">{job.level || "National Level"}</span>
              <span className={`jd-badge jd-badge--status jd-badge--status-${resolvedStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                {resolvedStatus}
              </span>
              <button
                type="button"
                className="jd-hero__bookmark"
                onClick={onToggleSave}
                title={saved ? "Saved" : "Save for later"}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={saved ? "#2563eb" : "none"}
                  stroke="#2563eb"
                  strokeWidth="2"
                  width="18"
                  height="18"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </button>
            </div>

            <h1 className="jd-hero__title">{job.title}</h1>
            <h2 className="jd-hero__org">{job.organization}</h2>

            <p className="jd-hero__about-text">
              {job.aboutOrg ||
                job.description ||
                "Join the prestigious Civil Services and be a part of nation building. Serve the country and create a meaningful impact through policy making, governance and public welfare."}
            </p>

            {job.subSlogan && (
              <div className="jd-hero__slogan-callout">
                {job.subSlogan}
              </div>
            )}
          </div>
        </div>

        <div className="jd-action-card">
          <div className="jd-action-card__header">
            <div className="jd-action-card__bell">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="jd-action-card__timer-info">
              <span className="jd-action-card__timer-label">
                {timeLeft.isExpired
                  ? "Applications"
                  : timeLeft.hasDate
                  ? "Application Closes In"
                  : "Application Starts In"}
              </span>
              <strong className="jd-action-card__timer-val">
                {timeLeft.isExpired
                  ? "Closed"
                  : timeLeft.hasDate
                  ? `${timeLeft.days} Days`
                  : "Upcoming"}
              </strong>
              <span className="jd-action-card__timer-sub">
                {formatDate(job.applicationLastDate || job.applicationStartDate || job.notificationDate, "Tentative")}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="jd-action-card__btn-primary"
            onClick={() => setNotified(!notified)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span>{notified ? "Subscribed to Alerts" : "Notify Me"}</span>
          </button>

          <div className="jd-action-card__row">
            <button
              type="button"
              className="jd-action-card__btn-sec"
              onClick={onToggleSave}
            >
              <svg
                viewBox="0 0 24 24"
                fill={saved ? "#2563eb" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                width="15"
                height="15"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              <span>{saved ? "Saved" : "Save for Later"}</span>
            </button>

            <button
              type="button"
              className="jd-action-card__btn-icon"
              title="Share Opportunity"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Opportunity link copied to clipboard!");
                }
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          <div className="jd-action-card__vacancies-callout">
            <div className="jd-action-card__vac-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="jd-action-card__vac-text">
              <strong>{vacanciesCount} Vacancies (Expected)</strong>
              <span>Be among lakhs of aspirants shaping a better India.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="jd-hero__facts-strip">
        <div className="jd-fact-item">
          <div className="jd-fact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="jd-fact-info">
            <span>Total Vacancies</span>
            <strong>{vacanciesCount}</strong>
            <small>(Expected)</small>
          </div>
        </div>

        <div className="jd-fact-item">
          <div className="jd-fact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="jd-fact-info">
            <span>Application Start Date</span>
            <strong>{formatDate(job.applicationStartDate || job.notificationDate, "1 Feb 2025")}</strong>
            <small>(Tentative)</small>
          </div>
        </div>

        <div className="jd-fact-item">
          <div className="jd-fact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="jd-fact-info">
            <span>Last Date to Apply</span>
            <strong>
              {isDatePresent(job.applicationLastDate)
                ? formatDate(job.applicationLastDate)
                : "Ongoing"}
            </strong>
            {isDatePresent(job.applicationLastDate) ? <small>(Tentative)</small> : null}
          </div>
        </div>

        <div className="jd-fact-item">
          <div className="jd-fact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="jd-fact-info">
            <span>Exam Date</span>
            <strong style={{ fontSize: isDatePresent(job.examDate) ? "0.95rem" : "0.82rem" }}>
              {isDatePresent(job.examDate)
                ? formatDate(job.examDate)
                : "Will be announced soon"}
            </strong>
            {isDatePresent(job.examDate) ? <small>(Tentative)</small> : null}
          </div>
        </div>

        <div className="jd-fact-item">
          <div className="jd-fact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="jd-fact-info">
            <span>Job Location</span>
            <strong>{job.location || "All India"}</strong>
          </div>
        </div>

        <div className="jd-fact-item">
          <div className="jd-fact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="jd-fact-info">
            <span>Selection Stages</span>
            <strong>{job.selectionStages || "Prelims • Mains • Interview"}</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1Hero;
