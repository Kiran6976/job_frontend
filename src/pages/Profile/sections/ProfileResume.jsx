import React, { useRef, useState } from "react";
import "./ProfileResume.css";

const ProfileResume = ({ user, onResumeUpload }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      if (onResumeUpload) {
        await onResumeUpload(file);
      }
      setSuccessMsg(`Uploaded "${file.name}" successfully!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const resumeName = user?.profile?.resumeOriginalName || "Kiran_Samanta_Resume.pdf";
  const hasResume = !!user?.profile?.resume || !!user?.profile?.resumeOriginalName;

  return (
    <div className="pr-container">
      <div className="pr-header">
        <h3 className="pr-title">Resume & Professional Documents</h3>
        <p className="pr-subtitle">
          Keep your resume updated for 1-click exam registrations and job applications.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        style={{ display: "none" }}
      />

      {successMsg && <div className="pr-alert">{successMsg}</div>}

      <div className="pr-card">
        <div className="pr-card__icon-wrap">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#2563eb" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 2 2h12a2 2 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>

        <div className="pr-card__info">
          <h4 className="pr-card__name">{hasResume ? resumeName : "No resume uploaded yet"}</h4>
          <p className="pr-card__meta">
            {hasResume ? "PDF Document • Updated recently • Active for applications" : "Upload your latest CV in PDF format"}
          </p>
        </div>

        <div className="pr-card__actions">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="pr-btn pr-btn--primary"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : hasResume ? "Replace Resume" : "Upload Resume"}
          </button>

          {hasResume && (
            <a
              href={user?.profile?.resume || "#"}
              download={resumeName}
              target="_blank"
              rel="noreferrer"
              className="pr-btn pr-btn--secondary"
            >
              Download
            </a>
          )}
        </div>
      </div>

      {/* Verification checklist card */}
      <div className="pr-checklist-card">
        <h4 className="pr-checklist-title">Document Guidelines & Best Practices</h4>
        <ul className="pr-checklist">
          <li>Ensure your full contact number and active email address are stated at the top.</li>
          <li>Include relevant educational degrees, universities, and graduation percentages.</li>
          <li>For government exam applications, ensure your category/domicile certificates match your stated details.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileResume;
