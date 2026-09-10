import React, { useState } from "react";
import { formatDate } from "../jobDetailsHelpers";
import "./Section3Eligibility.css";

const Section3Eligibility = ({ job }) => {
  const [eligibilityChecklist, setEligibilityChecklist] = useState({
    citizenship: true,
    qualification: true,
    ageLimit: true,
    relaxation: true,
    otherConditions: true,
  });
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [userAgeInput, setUserAgeInput] = useState("");
  const [userCategoryInput, setUserCategoryInput] = useState("General");
  const [eligibilityResult, setEligibilityResult] = useState(null);

  return (
    <section className="jd-el-section">
      {/* Header Area with Hand-drawn Slogans and Background Monument Art */}
      <div className="jd-el__header">
        <div className="jd-el__header-left">
          <span className="jd-el__badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span>Eligibility Criteria</span>
          </span>

          <h2 className="jd-el__title">
            Eligibility Criteria &amp; <span>Requirements</span>
          </h2>
          <p className="jd-el__sub">
            Check if you meet the eligibility criteria before applying. Make sure you fulfill all requirements as per the official notification.
          </p>
        </div>

        {/* Slogans and Landmark Dome Artwork */}
        <div className="jd-el__header-artwork">
          <div className="jd-el__slogan-callout jd-el__slogan-callout--left">
            Right<br />Preparation<br />Starts with<br />Knowing<br />You're Eligible
          </div>
          <img
            src={job.bannerUrl || "/UPSC.png"}
            alt="Landmark Backdrop"
            className="jd-el__monument-img"
            onError={(e) => {
              e.target.src = "/UPSC.png";
            }}
          />
          <div className="jd-el__slogan-callout jd-el__slogan-callout--right">
            "Equal<br />Opportunity<br />for a Stronger<br />India"
          </div>
        </div>
      </div>

      {/* Main Content Layout: 6 Cards (Left 2-col) + Right Interactive Checker */}
      <div className="jd-el__grid">
        {/* Left Criteria Cards */}
        <div className="jd-el__cards-grid">
          {/* Card 1: Educational Qualification */}
          <div className="jd-el-card">
            <div className="jd-el-card__icon-box jd-el-card__icon-box--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="jd-el-card__body">
              <h3 className="jd-el-card__title">Educational Qualification</h3>
              <p className="jd-el-card__desc">
                {job.educationalQualification ||
                  "A Bachelor's Degree from a recognized University or equivalent."}
              </p>
              <a
                href={job.notificationPdfUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="jd-el-card__link"
              >
                View accepted qualifications &rarr;
              </a>
            </div>
          </div>

          {/* Card 2: Age Limit */}
          <div className="jd-el-card">
            <div className="jd-el-card__icon-box jd-el-card__icon-box--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="jd-el-card__body">
              <h3 className="jd-el-card__title">
                Age Limit (as on {formatDate(job.ageLimitAsOn, "01 Aug 2025")})
              </h3>
              <div className="jd-el-card__meta-lines">
                <div>
                  <span>Minimum Age:</span> <strong>{job.ageLimitMin || "21"} years</strong>
                </div>
                <div>
                  <span>Maximum Age:</span> <strong>{job.ageLimitMax || "32"} years</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Nationality */}
          <div className="jd-el-card">
            <div className="jd-el-card__icon-box jd-el-card__icon-box--flag">
              <span className="jd-el-card__flag-icon">🇮🇳</span>
            </div>
            <div className="jd-el-card__body">
              <h3 className="jd-el-card__title">Nationality</h3>
              <p className="jd-el-card__desc">
                {job.nationality ||
                  "Must be a citizen of India. Tibetan refugees and certain other categories are also eligible as per rules."}
              </p>
              <a
                href={job.notificationPdfUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="jd-el-card__link"
              >
                View details &rarr;
              </a>
            </div>
          </div>

          {/* Card 4: Age Relaxation */}
          <div className="jd-el-card">
            <div className="jd-el-card__icon-box jd-el-card__icon-box--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="jd-el-card__body">
              <h3 className="jd-el-card__title">Age Relaxation</h3>
              <p className="jd-el-card__desc">
                Relaxation in upper age limit is applicable for reserved categories as per Government norms:
              </p>

              <div className="jd-el-table">
                <div className="jd-el-table__row">
                  <span className="jd-el-table__cat">SC / ST</span>
                  <strong className="jd-el-table__val">
                    {job.ageRelaxation?.scSt || "5 years"}
                  </strong>
                </div>
                <div className="jd-el-table__row">
                  <span className="jd-el-table__cat">OBC (Non-Creamy Layer)</span>
                  <strong className="jd-el-table__val">
                    {job.ageRelaxation?.obc || "3 years"}
                  </strong>
                </div>
                <div className="jd-el-table__row">
                  <span className="jd-el-table__cat">PwBD</span>
                  <strong className="jd-el-table__val">
                    {job.ageRelaxation?.pwbd || "10 years"}
                  </strong>
                </div>
                <div className="jd-el-table__row">
                  <span className="jd-el-table__cat">Ex-Servicemen</span>
                  <strong className="jd-el-table__val">
                    {job.ageRelaxation?.exServicemen || "As per rules"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Number of Attempts */}
          {job.numberAttempts && job.numberAttempts.trim() ? (
            <div className="jd-el-card">
              <div className="jd-el-card__icon-box jd-el-card__icon-box--blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="jd-el-card__body">
                <h3 className="jd-el-card__title">Number of Attempts</h3>
                <div className="jd-el-card__list-simple">
                  {(() => {
                    const rawStr = job.numberAttempts.trim();
                    const parts = rawStr
                      .split(/[•\n]/)
                      .map((s) => s.trim())
                      .filter(Boolean);

                    if (parts.length === 0) {
                      return null;
                    }

                    return parts.map((part, idx) => {
                      if (part.includes(":")) {
                        const [cat, ...valParts] = part.split(":");
                        return (
                          <div key={idx}>
                            <strong>{cat.trim()}:</strong> {valParts.join(":").trim()}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={idx}
                          style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px" }}
                        >
                          {part}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          ) : null}

          {/* Card 6: Other Requirements */}
          <div className="jd-el-card">
            <div className="jd-el-card__icon-box jd-el-card__icon-box--teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="jd-el-card__body">
              <h3 className="jd-el-card__title">Other Requirements</h3>
              <ul className="jd-el-card__checklist">
                <li>
                  <span className="jd-el-check">✔</span>
                  <span>Must be of good moral character</span>
                </li>
                <li>
                  <span className="jd-el-check">✔</span>
                  <span>Meet physical and medical standards (as applicable)</span>
                </li>
                <li>
                  <span className="jd-el-check">✔</span>
                  <span>No criminal record</span>
                </li>
                <li>
                  <span className="jd-el-check">✔</span>
                  <span>Should not be debarred from any government examination</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 7: Application Fee (conditional) */}
          {job.applicationFee && (job.applicationFee.general || job.applicationFee.sc_st_pwd_female_exsm) && (
            <div className="jd-el-card jd-el-card--fee">
              <div className="jd-el-card__icon-box jd-el-card__icon-box--emerald">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="jd-el-card__body">
                <h3 className="jd-el-card__title">Application Fee</h3>
                <div className="jd-fee-table">
                  {job.applicationFee.general && (
                    <div className="jd-fee-table__row">
                      <span className="jd-fee-table__cat">General / UR</span>
                      <strong className="jd-fee-table__val jd-fee-table__val--general">
                        ₹{job.applicationFee.general}
                      </strong>
                    </div>
                  )}
                  {job.applicationFee.sc_st_pwd_female_exsm && (
                    <div className="jd-fee-table__row">
                      <span className="jd-fee-table__cat">SC / ST / PwBD / Female / Ex-SM</span>
                      <strong className="jd-fee-table__val jd-fee-table__val--reserved">
                        ₹{job.applicationFee.sc_st_pwd_female_exsm}
                      </strong>
                    </div>
                  )}
                  {job.applicationFee.exempted && job.applicationFee.exempted !== "0" && (
                    <div className="jd-fee-table__row">
                      <span className="jd-fee-table__cat">Exempted Categories</span>
                      <strong className="jd-fee-table__val jd-fee-table__val--exempt">
                        ₹{job.applicationFee.exempted}
                      </strong>
                    </div>
                  )}
                </div>
                {job.applicationFee.paymentMode && (
                  <div className="jd-fee-meta">
                    <span className="jd-fee-meta__label">💳 Payment Mode:</span>
                    <span className="jd-fee-meta__val">{job.applicationFee.paymentMode}</span>
                  </div>
                )}
                {job.applicationFee.refundPolicy && (
                  <div className="jd-fee-refund">
                    <span className="jd-fee-refund__icon">↩</span>
                    {job.applicationFee.refundPolicy}
                  </div>
                )}
                {job.applicationFee.note && (
                  <p className="jd-fee-note">{job.applicationFee.note}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive "Are You Eligible?" Checklist & Motivational Card */}
        <div className="jd-el__sidebar">
          {/* Checklist Card */}
          <div className="jd-el-checker-card">
            <div className="jd-el-checker__header">
              <div className="jd-el-checker__target-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <div>
                <h3 className="jd-el-checker__title">Are You Eligible?</h3>
                <p className="jd-el-checker__desc">
                  Quickly check if you meet the basic criteria to apply for this exam.
                </p>
              </div>
            </div>

            {/* Interactive Checklist Items */}
            <div className="jd-el-checker__list">
              <label className="jd-el-checker__item">
                <input
                  type="checkbox"
                  checked={eligibilityChecklist.citizenship}
                  onChange={(e) =>
                    setEligibilityChecklist({ ...eligibilityChecklist, citizenship: e.target.checked })
                  }
                />
                <span className="jd-el-checker__custom-box">✔</span>
                <span className="jd-el-checker__text">
                  I am an Indian citizen (or eligible as per rules)
                </span>
              </label>

              <label className="jd-el-checker__item">
                <input
                  type="checkbox"
                  checked={eligibilityChecklist.qualification}
                  onChange={(e) =>
                    setEligibilityChecklist({ ...eligibilityChecklist, qualification: e.target.checked })
                  }
                />
                <span className="jd-el-checker__custom-box">✔</span>
                <span className="jd-el-checker__text">
                  I meet the educational qualification
                </span>
              </label>

              <label className="jd-el-checker__item">
                <input
                  type="checkbox"
                  checked={eligibilityChecklist.ageLimit}
                  onChange={(e) =>
                    setEligibilityChecklist({ ...eligibilityChecklist, ageLimit: e.target.checked })
                  }
                />
                <span className="jd-el-checker__custom-box">✔</span>
                <span className="jd-el-checker__text">
                  I am within the prescribed age limit
                </span>
              </label>

              <label className="jd-el-checker__item">
                <input
                  type="checkbox"
                  checked={eligibilityChecklist.relaxation}
                  onChange={(e) =>
                    setEligibilityChecklist({ ...eligibilityChecklist, relaxation: e.target.checked })
                  }
                />
                <span className="jd-el-checker__custom-box">✔</span>
                <span className="jd-el-checker__text">
                  I understand the age relaxation rules (if applicable)
                </span>
              </label>

              <label className="jd-el-checker__item">
                <input
                  type="checkbox"
                  checked={eligibilityChecklist.otherConditions}
                  onChange={(e) =>
                    setEligibilityChecklist({ ...eligibilityChecklist, otherConditions: e.target.checked })
                  }
                />
                <span className="jd-el-checker__custom-box">✔</span>
                <span className="jd-el-checker__text">
                  I meet all other eligibility conditions
                </span>
              </label>
            </div>

            <button
              type="button"
              className="jd-el-checker__btn"
              onClick={() => setEligibilityModalOpen(true)}
            >
              Check My Eligibility &rarr;
            </button>
          </div>

          {/* Motivational Quote & Stacking Books Artwork */}
          <div className="jd-el-quote-card">
            <div className="jd-el-quote__bubble">
              <div className="jd-el-quote__symbol">❝</div>
              <p className="jd-el-quote__text">
                "A small check today can save you from disappointment tomorrow."
              </p>
            </div>

            {/* Stacking Books Illustration with Prepare Practice Achieve */}
            <div className="jd-el-books-art">
              <div className="jd-el-book jd-el-book--top">
                <div className="jd-el-book__grad-cap">🎓</div>
                <span>PREPARE</span>
              </div>
              <div className="jd-el-book jd-el-book--mid">
                <span>PRACTICE</span>
              </div>
              <div className="jd-el-book jd-el-book--bot">
                <span>ACHIEVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Important Note Banner with Direct Official Notification Link */}
      <div className="jd-el-bottom-note">
        <div className="jd-el-bottom-note__left">
          <div className="jd-el-bottom-note__icon">!</div>
          <div>
            <strong>Important Note</strong>
            <p>
              {job.importantNote ||
                "The eligibility criteria mentioned above is a summary. Candidates must read the official notification carefully for complete and accurate details. In case of any discrepancy, the official notification issued by UPSC shall be final."}
            </p>
          </div>
        </div>

        <a
          href={job.notificationPdfUrl || "https://upsc.gov.in"}
          target="_blank"
          rel="noreferrer"
          className="jd-el-bottom-note__pdf-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>Read Official Notification &rarr;</span>
        </a>
      </div>

      {/* Interactive Eligibility Checker Modal */}
      {eligibilityModalOpen && (
        <div className="jd-modal-backdrop" onClick={() => setEligibilityModalOpen(false)}>
          <div className="jd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="jd-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>🎯</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                    Instant Eligibility Evaluator
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Target Exam: {job.title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="jd-modal-close-btn"
                onClick={() => setEligibilityModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="jd-modal-body">
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Your Current Age (in years):
                </label>
                <input
                  type="number"
                  min="16"
                  max="60"
                  className="ajp__input"
                  style={{ background: "#ffffff", border: "1.5px solid #cbd5e1", color: "#0f172a", width: "100%", padding: "10px 12px", borderRadius: "8px", boxSizing: "border-box" }}
                  placeholder="e.g. 24"
                  value={userAgeInput}
                  onChange={(e) => setUserAgeInput(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Reservation Category:
                </label>
                <select
                  className="ajp__select"
                  style={{ background: "#ffffff", border: "1.5px solid #cbd5e1", color: "#0f172a", width: "100%", padding: "10px 12px", borderRadius: "8px", boxSizing: "border-box" }}
                  value={userCategoryInput}
                  onChange={(e) => setUserCategoryInput(e.target.value)}
                >
                  <option value="General">General / EWS (Max: {job.ageLimitMax || 32} yrs)</option>
                  <option value="OBC">OBC (+3 yrs relaxation)</option>
                  <option value="SC/ST">SC / ST (+5 yrs relaxation)</option>
                  <option value="PwBD">PwBD (+10 yrs relaxation)</option>
                  <option value="Ex-Servicemen">Ex-Servicemen (As per rules)</option>
                </select>
              </div>

              <button
                type="button"
                className="jd-action-card__btn-primary"
                style={{ width: "100%" }}
                onClick={() => {
                  const min = Number(job.ageLimitMin || 21);
                  let max = Number(job.ageLimitMax || 32);
                  if (userCategoryInput === "OBC") max += 3;
                  if (userCategoryInput === "SC/ST") max += 5;
                  if (userCategoryInput === "PwBD") max += 10;

                  const age = Number(userAgeInput);
                  if (!age) {
                    setEligibilityResult({ ok: false, msg: "Please enter your age first." });
                    return;
                  }

                  if (age >= min && age <= max) {
                    setEligibilityResult({
                      ok: true,
                      msg: `🎉 Congratulations! You meet the prescribed age criteria (${min} to ${max} years for ${userCategoryInput}). You are eligible to apply!`,
                    });
                  } else {
                    setEligibilityResult({
                      ok: false,
                      msg: `⚠️ As per standard notification norms, your age (${age}) is outside the permitted range of ${min} - ${max} years for ${userCategoryInput}.`,
                    });
                  }
                }}
              >
                Verify My Eligibility Now
              </button>

              {eligibilityResult && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    background: eligibilityResult.ok ? "#ecfdf5" : "#fef2f2",
                    color: eligibilityResult.ok ? "#065f46" : "#991b1b",
                    border: `1px solid ${eligibilityResult.ok ? "#a7f3d0" : "#fecaca"}`,
                  }}
                >
                  {eligibilityResult.msg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section3Eligibility;
