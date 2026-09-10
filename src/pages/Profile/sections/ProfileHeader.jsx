import React, { useRef } from "react";
import "./ProfileHeader.css";

const ProfileHeader = ({ user, onEditProfile, onAvatarUpload }) => {
  const fileInputRef = useRef(null);

  const getInitial = () => {
    if (!user?.fullname) return "U";
    return user.fullname.trim()[0].toUpperCase();
  };

  const getMemberSince = () => {
    if (user?.createdAt) {
      try {
        const d = new Date(user.createdAt);
        return `Member since ${d.toLocaleString("en-US", { month: "short", year: "numeric" })}`;
      } catch (e) {
        return "Member since Sep 2024";
      }
    }
    return "Member since Sep 2024";
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarUpload) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="ph-banner">
      {/* Background Image: Profile_Header.png */}
      <img
        src="/Profile_Header.png"
        alt="Profile Header Landmark"
        className="ph-banner__bg"
      />
      {/* Light gradient overlay on left for optimal text contrast */}
      <div className="ph-banner__overlay" />

      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Top Right Edit Profile Button */}
      <div className="ph-banner__top-actions">
        <button
          type="button"
          onClick={onEditProfile}
          className="ph-banner__edit-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ph-banner__content">
        {/* Left Side: Avatar & Details */}
        <div className="ph-banner__left">
          {/* Avatar with Camera Overlay */}
          <div className="ph-banner__avatar-container">
            <div className="ph-banner__avatar">
              {user?.profile?.profilePhoto ? (
                <img
                  src={user.profile.profilePhoto}
                  alt={user.fullname || "User Avatar"}
                  className="ph-banner__avatar-img"
                />
              ) : (
                <div className="ph-banner__avatar-initial">{getInitial()}</div>
              )}
            </div>
            <button
              type="button"
              onClick={handleCameraClick}
              className="ph-banner__camera-btn"
              title="Change Profile Photo"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="2.2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          {/* User Details */}
          <div className="ph-banner__info">
            <div className="ph-banner__badge">
              {user?.profile?.headline || "Aspirant | Always Learning"}
            </div>

            <h1 className="ph-banner__name">
              {user?.fullname || "Kiran Samanta"}
            </h1>

            <p className="ph-banner__motto">
              &ldquo;{user?.profile?.motto || "Discipline today, a better tomorrow."}&rdquo;
            </p>

            <div className="ph-banner__meta-row">
              {/* Email */}
              <div className="ph-banner__meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{user?.email || "kiran.samanta@gmail.com"}</span>
              </div>

              {/* Phone */}
              <div className="ph-banner__meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{user?.phoneNumber || "+91 98765 43210"}</span>
              </div>

              {/* Location */}
              <div className="ph-banner__meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{user?.profile?.location || "Kolkata, West Bengal"}</span>
              </div>

              {/* Member Since */}
              <div className="ph-banner__meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{getMemberSince()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Decorative Callout & Quote Card */}
        <div className="ph-banner__right">
          {/* Handwritten Aspirations Graphic Text */}
          <div className="ph-banner__slogan">
            <span className="ph-banner__slogan-line1">Big</span>
            <span className="ph-banner__slogan-line2">Aspirations</span>
            <span className="ph-banner__slogan-line3">Brighter</span>
            <span className="ph-banner__slogan-line4">Tomorrows</span>
            <svg className="ph-banner__slogan-curve" viewBox="0 0 120 18" fill="none">
              <path d="M4 14C35 4 85 4 116 14" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Inspirational Quote Card */}
          <div className="ph-banner__quote-card">
            <div className="ph-banner__quote-icon">“</div>
            <div className="ph-banner__quote-text">
              <p>&ldquo;Success is the sum of small efforts, repeated day in and day out.&rdquo;</p>
              <cite>— Robert Collier</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
