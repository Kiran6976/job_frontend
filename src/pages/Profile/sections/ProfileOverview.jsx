import React from "react";
import "./ProfileOverview.css";

const ProfileOverview = ({ user, onEditProfile }) => {
  const skills = user?.profile?.skills?.length
    ? user.profile.skills
    : ["General Studies", "Quantitative Aptitude", "Indian Polity", "Economics", "Current Affairs", "Logical Reasoning"];

  const education = user?.profile?.education?.length
    ? user.profile.education
    : [
        {
          degree: "Bachelor of Technology (B.Tech) - Computer Science",
          institution: "Jadavpur University, Kolkata",
          year: "2020 - 2024",
          grade: "8.8 CGPA",
        },
        {
          degree: "Higher Secondary (10+2) - Science",
          institution: "South Point High School",
          year: "2018 - 2020",
          grade: "92.4%",
        },
      ];

  return (
    <div className="po-container">
      {/* ── Section 1: About Me / Bio ── */}
      <div className="po-card">
        <div className="po-card__header">
          <div className="po-card__title-wrap">
            <div className="po-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="po-card__title">About Me</h3>
          </div>
          <button type="button" onClick={onEditProfile} className="po-card__edit-btn">
            Edit
          </button>
        </div>

        <p className="po-bio-text">
          {user?.profile?.bio ||
            "Dedicated civil services aspirant preparing for UPSC and State PSC exams. Passionate about governance, public policy, and administrative leadership. Consistently seeking to expand knowledge across constitutional law, Indian history, and global economics."}
        </p>
      </div>

      {/* ── Section 2: Skills & Competencies ── */}
      <div className="po-card">
        <div className="po-card__header">
          <div className="po-card__title-wrap">
            <div className="po-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="po-card__title">Skills & Key Subject Areas</h3>
          </div>
          <button type="button" onClick={onEditProfile} className="po-card__edit-btn">
            Manage Skills
          </button>
        </div>

        <div className="po-skills-wrap">
          {skills.map((skill, index) => (
            <span key={index} className="po-skill-pill">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 3: Educational Qualifications ── */}
      <div className="po-card">
        <div className="po-card__header">
          <div className="po-card__title-wrap">
            <div className="po-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h3 className="po-card__title">Educational Qualifications</h3>
          </div>
          <button type="button" onClick={onEditProfile} className="po-card__edit-btn">
            Add / Edit
          </button>
        </div>

        <div className="po-edu-list">
          {education.map((item, idx) => (
            <div key={idx} className="po-edu-item">
              <div className="po-edu-bullet" />
              <div className="po-edu-content">
                <h4 className="po-edu-degree">{item.degree}</h4>
                <p className="po-edu-institution">{item.institution}</p>
                <div className="po-edu-meta">
                  <span className="po-edu-year">{item.year}</span>
                  {item.grade && <span className="po-edu-grade">• Score: {item.grade}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
