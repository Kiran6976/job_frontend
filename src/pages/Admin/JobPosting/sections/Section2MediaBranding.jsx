import React from "react";
import { Palette, Zap, Building2, FileText } from "lucide-react";
import "./Section2MediaBranding.css";

const Section2MediaBranding = ({
  formData,
  setFormData,
  handleChange,
  PRESET_LOGOS,
  PRESET_BANNERS,
  logoInputRef,
  bannerInputRef,
  pdfInputRef,
  isUploadingLogo,
  isUploadingBanner,
  isUploadingPdf,
  handleLogoFileUpload,
  handleBannerFileUpload,
  handlePdfFileUpload,
  pdfFileName,
  setPdfFileName,
  setLogoUploadSuccess,
}) => {
  return (
    <div className="ajp__section-container ajp__section-media-branding">
      <div className="ajp__section-header">
        <h3 className="ajp__section-title">
          <Palette size={18} color="#c084fc" /> Section 2: Branding, Media &amp; Official Links
        </h3>
        <p className="ajp__section-subtitle">
          Organization logos, panoramic hero banner, notification PDF document, and application link.
        </p>
      </div>

      {/* Row 8: Organization Emblem / Logo Cloudinary Uploader */}
      <div className="ajp__field">
        <div className="ajp__logo-header-row">
          <label className="ajp__label">
            Organization Emblem / Logo <span className="ajp__req">*</span>
          </label>
          <span className="ajp__logo-spec-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Zap size={11} /> Cloudinary Auto-Fixed 400×400px (1:1 Square)
          </span>
        </div>

        <div className="ajp__logo-uploader">
          <input
            type="file"
            ref={logoInputRef}
            onChange={handleLogoFileUpload}
            accept="image/*"
            style={{ display: "none" }}
          />

          <div className="ajp__logo-thumb-box">
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                alt="Organization Logo"
                className="ajp__logo-thumb"
                onError={(e) => {
                  e.target.style.display = "none";
                  const ph = e.target.parentElement?.querySelector(".ajp__logo-thumb-ph");
                  if (ph) ph.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="ajp__logo-thumb-ph"
              style={{ display: formData.logoUrl ? "none" : "flex" }}
            >
              <Building2 size={24} color="#64748b" />
            </div>
          </div>

          <div className="ajp__logo-controls">
            <button
              type="button"
              className="ajp__upload-btn"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{isUploadingLogo ? "Uploading..." : "Upload Logo (Cloudinary)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 9: Hero Banner Selection & Uploader (1600x600 Fixed Fit) */}
      <div className="ajp__field">
        <div className="ajp__logo-header-row">
          <label className="ajp__label">Hero Section Background Banner Graphic</label>
          <span className="ajp__logo-spec-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Zap size={11} /> Auto-Fit Cloudinary (1600×600px 16:6 Panoramic)
          </span>
        </div>

        <div className="ajp__banner-uploader-box">
          <input
            type="file"
            ref={bannerInputRef}
            onChange={handleBannerFileUpload}
            accept="image/*"
            style={{ display: "none" }}
          />

          {/* Banner Live Preview Frame */}
          <div className="ajp__banner-preview-frame">
            <img
              src={formData.bannerUrl || "/UPSC.png"}
              alt="Hero Banner Preview"
              className="ajp__banner-preview-img"
              onError={(e) => {
                e.target.src = "/UPSC.png";
              }}
            />
            <div className="ajp__banner-preview-overlay">
              <span>1600 × 600 Fixed Hero Fit</span>
            </div>
          </div>

          <div className="ajp__banner-controls">
            <button
              type="button"
              className="ajp__upload-btn"
              onClick={() => bannerInputRef.current?.click()}
              disabled={isUploadingBanner}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{isUploadingBanner ? "Uploading Banner..." : "Upload New Hero Banner Image"}</span>
            </button>

            {/* Quick Presets for Banner */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
              {PRESET_BANNERS.map((banner) => (
                <button
                  key={banner.name}
                  type="button"
                  className={`ajp__preset-btn ${formData.bannerUrl === banner.url ? "ajp__preset-btn--active" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: banner.url }))}
                >
                  <span>{banner.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 10: About Organization */}
      <div className="ajp__field">
        <label className="ajp__label">About Organization / Exam Overview</label>
        <textarea
          name="aboutOrg"
          rows={3}
          className="ajp__textarea"
          placeholder="Provide background context about this organization, regional branches, and opportunity..."
          value={formData.aboutOrg}
          onChange={handleChange}
        />
      </div>

      {/* Row 11: Links (Online Apply URL & Official Notification PDF) */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">Online Application Portal URL</label>
          <input
            type="url"
            name="applyUrl"
            className="ajp__input"
            placeholder="https://indianrailways.gov.in or https://upsconline.nic.in"
            value={formData.applyUrl}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <div className="ajp__logo-header-row">
            <label className="ajp__label">Official Notification PDF Document</label>
            <span
              className="ajp__logo-spec-badge"
              style={{
                color: "#a855f7",
                background: "rgba(168, 85, 247, 0.12)",
                borderColor: "rgba(168, 85, 247, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <FileText size={11} /> PDF Max 10MB
            </span>
          </div>

          <input
            type="file"
            ref={pdfInputRef}
            onChange={handlePdfFileUpload}
            accept="application/pdf"
            style={{ display: "none" }}
          />

          <div className="ajp__pdf-uploader-box">
            <div className="ajp__pdf-controls">
              <button
                type="button"
                className="ajp__pdf-upload-btn"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isUploadingPdf}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <span>{isUploadingPdf ? "Uploading (Max 10MB)..." : "Upload PDF (Max 10MB)"}</span>
              </button>

              {formData.notificationPdfUrl && (
                <div className="ajp__pdf-attached-badge">
                  <span className="ajp__pdf-attached-icon">
                    <FileText size={15} />
                  </span>
                  <span className="ajp__pdf-attached-name">
                    {pdfFileName || "Notification.pdf"}
                  </span>
                  <a
                    href={formData.notificationPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ajp__pdf-view-link"
                    title="Open PDF"
                  >
                    Preview ↗
                  </a>
                  <button
                    type="button"
                    className="ajp__pdf-remove-btn"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, notificationPdfUrl: "" }));
                      setPdfFileName("");
                    }}
                    title="Remove PDF"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <div className="ajp__pdf-url-fallback">
              <span className="ajp__pdf-or-divider">or enter direct PDF URL:</span>
              <input
                type="url"
                name="notificationPdfUrl"
                className="ajp__input ajp__input--sm"
                placeholder="https://example.gov.in/notifications/exam-2026.pdf"
                value={formData.notificationPdfUrl}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section2MediaBranding;
