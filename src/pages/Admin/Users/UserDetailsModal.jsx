import React, { useEffect } from "react";
import "./UserDetailsModal.css";
import "./AdminUsers.css";

const UserDetailsModal = ({
  user,
  onClose,
  onRoleChange,
  onStatusChange,
  onDelete,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!user) return null;

  const isGoogleUser = Boolean(user.googleId);
  const isSuperAdmin = user.email?.toLowerCase() === "kiransamanta88@gmail.com";
  const status = user.status || "active";
  const skills = user.profile?.skills || [];
  const resume = user.profile?.resume;
  const resumeName = user.profile?.resumeOriginalName || "Candidate_Resume.pdf";
  const profilePhoto = user.profile?.profilePhoto;

  const formattedCreated = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  return (
    <div className="udm-backdrop" onClick={onClose}>
      <div className="udm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="udm-header">
          <div className="udm-header-user">
            {profilePhoto && !profilePhoto.includes("unsplash") ? (
              <img
                src={profilePhoto}
                alt={user.fullname}
                className="udm-avatar"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="udm-avatar udm-avatar--fallback">
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="udm-title-area">
              <div className="udm-name-row">
                <h2 className="udm-name">{user.fullname}</h2>
                <span
                  className={`au-role-badge au-role-badge--${user.role}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {user.role === "jobseeker" ? "Job Seeker" : user.role}
                </span>
                <span
                  className={`au-status-badge au-status-badge--${status}`}
                >
                  {status}
                </span>
              </div>
              <span className="udm-email-sub">
                {isGoogleUser && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
                {user.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="udm-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="udm-body">
          {/* Account Details */}
          <div>
            <div className="udm-section-title">Account Information</div>
            <div className="udm-grid">
              <div className="udm-info-box">
                <span className="udm-info-label">Phone Number</span>
                <span className="udm-info-value">
                  {user.phoneNumber || "Not provided"}
                </span>
              </div>
              <div className="udm-info-box">
                <span className="udm-info-label">Sign-up Method</span>
                <span className="udm-info-value">
                  {isGoogleUser ? "Google OAuth 2.0" : "Email & Password"}
                </span>
              </div>
              <div className="udm-info-box">
                <span className="udm-info-label">Registration Date</span>
                <span className="udm-info-value">{formattedCreated}</span>
              </div>
              <div className="udm-info-box">
                <span className="udm-info-label">User ID</span>
                <span className="udm-info-value" style={{ fontSize: "0.75rem" }}>
                  {user._id}
                </span>
              </div>
            </div>
          </div>

          {/* Candidate Bio */}
          {user.profile?.bio && (
            <div>
              <div className="udm-section-title">Candidate Bio / Summary</div>
              <div className="udm-bio-box">{user.profile.bio}</div>
            </div>
          )}

          {/* Candidate Skills */}
          {skills.length > 0 && (
            <div>
              <div className="udm-section-title">Listed Skills & Expertise</div>
              <div className="udm-skills-wrap">
                {skills.map((skill, index) => (
                  <span key={index} className="udm-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resume */}
          <div>
            <div className="udm-section-title">Uploaded Resume / CV</div>
            {resume ? (
              <div className="udm-resume-box">
                <div className="udm-resume-left">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>{resumeName}</span>
                </div>
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="udm-resume-btn"
                >
                  <span>Download / View</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            ) : (
              <div className="udm-bio-box" style={{ color: "#94a3b8" }}>
                No resume uploaded yet by this user.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="udm-footer">
          <div className="udm-action-group">
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Change Role:
            </span>
            <select
              className="udm-select-role"
              value={user.role}
              disabled={isSuperAdmin}
              onChange={(e) => onRoleChange(user._id, e.target.value)}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Administrator</option>
            </select>

            {!isSuperAdmin && (
              <button
                type="button"
                className={`udm-btn-toggle-status udm-btn-toggle-status--${
                  status === "active" ? "suspend" : "activate"
                }`}
                onClick={() =>
                  onStatusChange(
                    user._id,
                    status === "active" ? "suspended" : "active"
                  )
                }
              >
                {status === "active" ? "Suspend Account" : "Reactivate Account"}
              </button>
            )}
          </div>

          {!isSuperAdmin && (
            <button
              type="button"
              className="udm-btn-delete"
              onClick={() => onDelete(user._id, user.fullname)}
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
