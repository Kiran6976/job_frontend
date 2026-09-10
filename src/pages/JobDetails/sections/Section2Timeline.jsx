import React from "react";
import { formatDate, isDatePresent, getWeekday } from "../jobDetailsHelpers";
import "./Section2Timeline.css";

const Section2Timeline = ({ job, timeLeft, saved, onToggleSave, vacanciesCount }) => {
  const hasNotificationDate = isDatePresent(job?.notificationDate);
  const hasResultDate = isDatePresent(job?.resultDate);
  const visibleDateCount = (hasNotificationDate ? 1 : 0) + 3 + (hasResultDate ? 1 : 0);
  const trackInsetPercent = visibleDateCount > 1 ? (100 / (visibleDateCount * 2)).toFixed(2) : 10;
  const trackGradient =
    hasNotificationDate && hasResultDate
      ? "linear-gradient(90deg, #3b82f6 0%, #10b981 25%, #f59e0b 50%, #ef4444 75%, #8b5cf6 100%)"
      : !hasNotificationDate && !hasResultDate
      ? "linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)"
      : !hasNotificationDate
      ? "linear-gradient(90deg, #10b981 0%, #f59e0b 33%, #ef4444 66%, #8b5cf6 100%)"
      : "linear-gradient(90deg, #3b82f6 0%, #10b981 33%, #f59e0b 66%, #ef4444 100%)";

  return (
    <section className="jd-timeline-section">
      <div className="jd-timeline__header">
        <span className="jd-timeline__badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Important Dates</span>
        </span>

        <h2 className="jd-timeline__title">
          Important Dates &amp; <span>Application Timeline</span>
        </h2>
        <p className="jd-timeline__sub">
          Stay updated with all key dates. Make sure you don't miss any important deadlines.
        </p>

        <div className="jd-timeline__callout-top">
          Plan Today<br />For a Brighter Tomorrow
        </div>
      </div>

      <div className="jd-timeline__body">
        <div className="jd-flow">
          <div
            className="jd-flow__track"
            style={{
              gridTemplateColumns: `repeat(${visibleDateCount}, 1fr)`,
              "--track-cols": visibleDateCount,
              "--track-inset": `${trackInsetPercent}%`,
              "--track-bg": trackGradient,
            }}
          >
            {hasNotificationDate && (
              <div className="jd-flow__step-node">
                <div className="jd-flow__node-circle" style={{ background: "#3b82f6" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="jd-flow__node-label">Notification<br />Released</span>
              </div>
            )}

            <div className="jd-flow__step-node">
              <div className="jd-flow__node-circle" style={{ background: "#10b981" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                </svg>
              </div>
              <span className="jd-flow__node-label">Application<br />Starts</span>
            </div>

            <div className="jd-flow__step-node">
              <div className="jd-flow__node-circle" style={{ background: "#f59e0b" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="jd-flow__node-label">Last Date<br />to Apply</span>
            </div>

            <div className="jd-flow__step-node">
              <div className="jd-flow__node-circle" style={{ background: "#ef4444" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="jd-flow__node-label">Exam<br />Date</span>
            </div>

            {hasResultDate && (
              <div className="jd-flow__step-node">
                <div className="jd-flow__node-circle" style={{ background: "#8b5cf6" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
                  </svg>
                </div>
                <span className="jd-flow__node-label">Result<br />(Expected)</span>
              </div>
            )}
          </div>

          <div
            className="jd-flow__cards-row"
            style={{
              gridTemplateColumns: `repeat(${visibleDateCount}, 1fr)`,
              "--track-cols": visibleDateCount,
            }}
          >
            {hasNotificationDate && (
              <div className="jd-t-card jd-t-card--1">
                <div className="jd-t-card__icon" style={{ background: "#3b82f6" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="jd-t-card__tag">Notification Released</span>
                <strong className="jd-t-card__date">
                  {formatDate(job.notificationDate, job.notificationDate)}
                </strong>
                <span className="jd-t-card__day">
                  {getWeekday(job.notificationDate, "")}
                </span>
                <p className="jd-t-card__desc">
                  Official notification released by {job.organization || "commission"}.
                </p>
              </div>
            )}

            <div className="jd-t-card jd-t-card--2">
              <div className="jd-t-card__icon" style={{ background: "#10b981" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                </svg>
              </div>
              <span className="jd-t-card__tag">Application Starts</span>
              <strong className="jd-t-card__date">
                {isDatePresent(job.applicationStartDate)
                  ? formatDate(job.applicationStartDate, job.applicationStartDate)
                  : "Announced"}
              </strong>
              <span className="jd-t-card__day">
                {isDatePresent(job.applicationStartDate)
                  ? getWeekday(job.applicationStartDate, "")
                  : "Online Mode"}
              </span>
              <p className="jd-t-card__desc">Online application process begins.</p>
            </div>

            <div className="jd-t-card jd-t-card--3">
              <div className="jd-t-card__icon" style={{ background: "#f59e0b" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="jd-t-card__tag">Last Date to Apply</span>
              <strong className="jd-t-card__date">
                {isDatePresent(job.applicationLastDate)
                  ? formatDate(job.applicationLastDate, job.applicationLastDate)
                  : "Ongoing"}
              </strong>
              <span className="jd-t-card__day">
                {isDatePresent(job.applicationLastDate)
                  ? getWeekday(job.applicationLastDate, "")
                  : "Closing Soon"}
              </span>
              <p className="jd-t-card__desc">Last date to submit application form.</p>
            </div>

            <div className="jd-t-card jd-t-card--4">
              <div className="jd-t-card__icon" style={{ background: "#ef4444" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="jd-t-card__tag">Exam Date</span>
              <strong
                className="jd-t-card__date"
                style={{
                  fontSize: isDatePresent(job.examDate) ? "1.05rem" : "0.92rem",
                  lineHeight: 1.3,
                }}
              >
                {isDatePresent(job.examDate)
                  ? formatDate(job.examDate, job.examDate)
                  : "Will be announced soon"}
              </strong>
              <span className="jd-t-card__day">
                {isDatePresent(job.examDate)
                  ? getWeekday(job.examDate, "Tentative")
                  : "To be notified"}
              </span>
              <p className="jd-t-card__desc">
                {isDatePresent(job.examDate)
                  ? `${job.title} Prelims (exact date as per admit card).`
                  : "Exact examination schedule will be announced soon by the commission."}
              </p>
            </div>

            {hasResultDate && (
              <div className="jd-t-card jd-t-card--5">
                <div className="jd-t-card__icon" style={{ background: "#8b5cf6" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
                  </svg>
                </div>
                <span className="jd-t-card__tag">Result (Expected)</span>
                <strong className="jd-t-card__date">
                  {formatDate(job.resultDate, job.resultDate)}
                </strong>
                <span className="jd-t-card__day">Tentative</span>
                <p className="jd-t-card__desc">
                  Result expected in {formatDate(job.resultDate, job.resultDate)}.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="jd-deadline-card">
          <div className="jd-deadline-card__head">
            <div className={`jd-deadline-card__bell ${timeLeft.isExpired ? "jd-deadline-card__bell--expired" : ""}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="jd-deadline-card__title-box">
              <h4>{timeLeft.isExpired ? "Applications Closed" : "Don't Miss the Deadline!"}</h4>
              <span>{timeLeft.statusText}</span>
            </div>
          </div>

          <div className="jd-timer-boxes">
            <div className="jd-timer-box">
              <span className="jd-timer-box__num">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="jd-timer-box__label">Days</span>
            </div>
            <div className="jd-timer-box">
              <span className="jd-timer-box__num">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="jd-timer-box__label">Hours</span>
            </div>
            <div className="jd-timer-box">
              <span className="jd-timer-box__num">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="jd-timer-box__label">Minutes</span>
            </div>
            <div className="jd-timer-box">
              <span className="jd-timer-box__num">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="jd-timer-box__label">Seconds</span>
            </div>
          </div>

          <a
            href={job.applyUrl && job.applyUrl !== "#" ? job.applyUrl : "#"}
            target="_blank"
            rel="noreferrer"
            className="jd-deadline-card__apply-btn"
            style={timeLeft.isExpired ? { background: "#64748b", boxShadow: "none" } : {}}
            onClick={(e) => {
              if (!job.applyUrl || job.applyUrl === "#") {
                e.preventDefault();
                alert("Official application link will be updated soon.");
              }
            }}
          >
            <span>{timeLeft.isExpired ? "Application Closed — Official Portal →" : "Apply Online →"}</span>
          </a>

          <div className="jd-deadline-card__actions-row">
            <a
              href={job.notificationPdfUrl || job.applyUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="jd-deadline-card__btn-sub"
              onClick={(e) => {
                if (!job.notificationPdfUrl && (!job.applyUrl || job.applyUrl === "#")) {
                  e.preventDefault();
                  alert("Official notification PDF is not available yet.");
                }
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PDF</span>
            </a>

            <button
              type="button"
              className="jd-deadline-card__btn-sub"
              onClick={onToggleSave}
            >
              <svg
                viewBox="0 0 24 24"
                fill={saved ? "#2563eb" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                width="14"
                height="14"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              <span>{saved ? "Saved" : "Save for Later"}</span>
            </button>
          </div>

          <p className="jd-deadline-card__quote">
            {job.slogan ? `"${job.slogan}"` : '"A small step today, a big future tomorrow."'}
          </p>
        </div>
      </div>

      <div className="jd-meta-strip">
        <div className="jd-meta-item">
          <div className="jd-meta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="jd-meta-text">
            <strong>{vacanciesCount}</strong>
            <span>Total Vacancies</span>
          </div>
        </div>

        <div className="jd-meta-item">
          <div className="jd-meta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="jd-meta-text">
            <strong>{job.location || "All India"}</strong>
            <span>Job Location</span>
          </div>
        </div>

        <div className="jd-meta-item">
          <div className="jd-meta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="jd-meta-text">
            <strong>{job.selectionStages || "Prelims • Mains • Interview"}</strong>
            <span>Selection Stages</span>
          </div>
        </div>

        <div className="jd-meta-item">
          <div className="jd-meta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="jd-meta-text">
            <strong>Check Eligibility</strong>
            <span>Before Applying</span>
          </div>
        </div>

        <div className="jd-meta-item">
          <div className="jd-meta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="jd-meta-text">
            <strong>Read Official Notification</strong>
            <span>For Complete Details</span>
          </div>
        </div>
      </div>

      <div className="jd-disclaimer-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span>
          All dates are tentative and subject to change. Please refer to the official notification for the most accurate and updated information.
        </span>
      </div>
    </section>
  );
};

export default Section2Timeline;
