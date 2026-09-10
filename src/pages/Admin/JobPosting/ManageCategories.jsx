import React, { useState, useRef } from "react";
import "./ManageCategories.css";
import { API_ENDPOINTS } from "../../../config/api";


const PRESET_ICONS = [
  { value: "building", label: "Government / Commission", icon: "🏛️" },
  { value: "briefcase", label: "Private / Corporate", icon: "💼" },
  { value: "graduation-cap", label: "Education / Internship", icon: "🎓" },
  { value: "laptop", label: "Remote / Work From Home", icon: "💻" },
  { value: "shield", label: "Defense & Police", icon: "🛡️" },
  { value: "book", label: "Teaching & Faculty", icon: "📚" },
  { value: "grid", label: "All Opportunities", icon: "🌐" },
];

const PRESET_BANNERS = [
  { name: "UPSC Parliament Backdrop", url: "/UPSC.png" },
  { name: "Indian Railways", url: "/Job_Hero.png" },
  { name: "Banking & Financial", url: "/Job_Second.png" },
  { name: "Navy & Defense Force", url: "/Hero_Image.png" },
];

const PRESET_EMBLEMS = [
  {
    name: "Emblem of India",
    url: "/emblem_india.png",
  },
  {
    name: "Indian Railways (RRB)",
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Indian_Railways_logo.svg/300px-Indian_Railways_logo.svg.png",
  },
  {
    name: "Banking (IBPS)",
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/IBPS_Logo.svg/300px-IBPS_Logo.svg.png",
  },
  {
    name: "Government Commission",
    url: "/JobPortal_Logo_Transparent.png",
  },
];

const ManageCategories = ({
  categories = [],
  organizations = [],
  jobs = [],
  isLoading,
  CustomDropdown,
  onCategoryCreated,
  onCategoryDeleted,
  onOrganizationCreated,
  onOrganizationDeleted,
  fetchCategories,
  fetchOrganizations,
  fetchJobs,
  showNotification,
}) => {
  // Dynamic count calculator for categories
  const getCategoryCount = (cat) => {
    const availableJobs =
      jobs && jobs.length > 0
        ? jobs
        : JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");

    if (cat.slug === "all" || cat.name?.toLowerCase() === "all opportunities") {
      return availableJobs.length > 0
        ? availableJobs.length
        : typeof cat.count === "number"
        ? cat.count
        : 0;
    }

    if (availableJobs.length > 0) {
      return availableJobs.filter((j) => {
        if (!j.category) return false;
        return j.category.trim().toLowerCase() === cat.name?.trim().toLowerCase();
      }).length;
    }

    return typeof cat.count === "number" ? cat.count : 0;
  };

  const handleRefresh = async () => {
    if (fetchCategories) await fetchCategories();
    if (fetchJobs) await fetchJobs();
    if (showNotification) showNotification("Categories and opportunity counts refreshed!", "success");
  };

  // Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("building");

  // Organization Form State
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [orgForm, setOrgForm] = useState({
    name: "",
    code: "",
    category: "Government Exams",
    logoUrl: "",
    bannerUrl: "/UPSC.png",
    about: "",
    slogan: "Serve Lead Bring Change",
    subSlogan: "A Stronger India Needs You",
    selectionStages: "Prelims • Mains • Interview",
    officialWebsite: "",
  });

  // Uploader state
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const bannerFileInputRef = useRef(null);
  const logoFileInputRef = useRef(null);

  const handleOpenCreateModal = () => {
    setEditingOrgId(null);
    setOrgForm({
      name: "",
      code: "",
      category: categories[0]?.name || "Government Exams",
      logoUrl: "",
      bannerUrl: "/UPSC.png",
      about: "",
      slogan: "Serve Lead Bring Change",
      subSlogan: "A Stronger India Needs You",
      selectionStages: "Prelims • Mains • Interview",
      officialWebsite: "",
    });
    setIsOrgModalOpen(true);
  };

  const handleOpenEditModal = (org) => {
    setEditingOrgId(org._id);
    setOrgForm({
      name: org.name || "",
      code: org.code || "",
      category: org.category || "Government Exams",
      logoUrl: org.logoUrl || "",
      bannerUrl: org.bannerUrl || "/UPSC.png",
      about: org.about || "",
      slogan: org.slogan || "",
      subSlogan: org.subSlogan || "",
      selectionStages: org.selectionStages || "",
      officialWebsite: org.officialWebsite || "",
    });
    setIsOrgModalOpen(true);
  };

  // Upload Cloudinary Banner (1600x600 fixed dimension)
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/upload-banner`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setOrgForm((prev) => ({ ...prev, bannerUrl: data.url }));
        showNotification("Hero Banner uploaded to Cloudinary (1600x600) successfully!", "success");
      } else {
        const localUrl = URL.createObjectURL(file);
        setOrgForm((prev) => ({ ...prev, bannerUrl: localUrl }));
        showNotification("Local banner preview loaded.", "info");
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setOrgForm((prev) => ({ ...prev, bannerUrl: localUrl }));
      showNotification("Local banner preview loaded.", "info");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Upload Cloudinary Logo (400x400 fixed dimension)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/upload-logo`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setOrgForm((prev) => ({ ...prev, logoUrl: data.url }));
        showNotification("Emblem uploaded to Cloudinary (400x400) successfully!", "success");
      } else {
        const localUrl = URL.createObjectURL(file);
        setOrgForm((prev) => ({ ...prev, logoUrl: localUrl }));
        showNotification("Local logo preview loaded.", "info");
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setOrgForm((prev) => ({ ...prev, logoUrl: localUrl }));
      showNotification("Local logo preview loaded.", "info");
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/category/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          icon: newCatIcon,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(data.message, "success");
        setNewCatName("");
        if (fetchCategories) fetchCategories();
      } else {
        showNotification(data.message || "Could not create category.", "error");
      }
    } catch (err) {
      showNotification("Saved category locally.", "success");
      if (onCategoryCreated) {
        onCategoryCreated({
          _id: "cat-" + Date.now(),
          name: newCatName.trim(),
          icon: newCatIcon,
          count: 0,
        });
      }
      setNewCatName("");
    }
  };

  const handleSaveOrg = async (e) => {
    e.preventDefault();
    if (!orgForm.name.trim()) {
      showNotification("Organization name is required.", "error");
      return;
    }

    const endpoint = editingOrgId
      ? `${API_ENDPOINTS.JOB}/organization/${editingOrgId}`
      : `${API_ENDPOINTS.JOB}/organization/create`;
    const method = editingOrgId ? "PUT" : "POST";


    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(data.message, "success");
        setIsOrgModalOpen(false);
        if (fetchOrganizations) fetchOrganizations();
      } else {
        showNotification(data.message || "Failed to save organization.", "error");
      }
    } catch (err) {
      const localOrg = { ...orgForm, _id: editingOrgId || "org-" + Date.now() };
      if (onOrganizationCreated) onOrganizationCreated(localOrg);
      setIsOrgModalOpen(false);
      showNotification("Organization saved locally!", "success");
    }
  };

  const categoryDropdownOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  return (
    <div className="ajp__categories-layout">
      {/* ── 1. Category Creation Box ── */}
      <div className="ajp__card">
        <h2 className="ajp__card-title">Create New Category Folder</h2>
        <p className="ajp__card-desc">
          Categories organize your opportunities and appear directly as filter tabs in the portal navigation.
        </p>

        <form onSubmit={handleCreateCategory} className="ajp__cat-form">
          <div className="ajp__cat-form-row">
            <div className="ajp__field ajp__field--grow">
              <label className="ajp__label">Category Name</label>
              <input
                type="text"
                className="ajp__input"
                placeholder="e.g. Defense Jobs, Banking, Railway Exams..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
            </div>

            <div className="ajp__field">
              <label className="ajp__label">Icon Style</label>
              <CustomDropdown
                options={PRESET_ICONS}
                value={newCatIcon}
                onChange={(val) => setNewCatIcon(val)}
                placeholder="Choose icon..."
              />
            </div>

            <div className="ajp__field ajp__field--btn">
              <button type="submit" className="ajp__cat-add-btn" disabled={isLoading}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── 2. Organizations & Job Providers Section ── */}
      <div className="ajp__card">
        <div className="ajp__card-head-row">
          <div>
            <h2 className="ajp__card-title">
              Organizations &amp; Exam Commissions ({organizations.length})
            </h2>
            <p className="ajp__card-desc">
              Define presets for job providers (UPSC, RRB, Banking, etc.) with custom banners, About details, and selection stages.
            </p>
          </div>
          <button
            type="button"
            className="ajp__cat-add-btn"
            onClick={handleOpenCreateModal}
          >
            + Add New Organization
          </button>
        </div>

        {/* Modal / In-line Form for Organization */}
        {isOrgModalOpen && (
          <div className="ajp__org-modal-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, color: "#60a5fa", fontSize: "1.15rem", fontWeight: 800 }}>
                {editingOrgId ? `Edit Organization: ${orgForm.name}` : "Configure Organization / Commission Details"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOrgModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveOrg} className="ajp__form">
              <div className="ajp__form-row">
                <div className="ajp__field">
                  <label className="ajp__label">Full Organization Name *</label>
                  <input
                    type="text"
                    className="ajp__input"
                    placeholder="e.g. Union Public Service Commission"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="ajp__field">
                  <label className="ajp__label">Short Code / Acronym</label>
                  <input
                    type="text"
                    className="ajp__input"
                    placeholder="e.g. UPSC, RRB, SSC"
                    value={orgForm.code}
                    onChange={(e) => setOrgForm({ ...orgForm, code: e.target.value })}
                  />
                </div>
              </div>

              <div className="ajp__form-row">
                <div className="ajp__field">
                  <label className="ajp__label">Category Folder *</label>
                  <CustomDropdown
                    options={categoryDropdownOptions}
                    value={orgForm.category}
                    onChange={(val) => setOrgForm({ ...orgForm, category: val })}
                    placeholder="Assign under Category..."
                  />
                </div>

                <div className="ajp__field">
                  <label className="ajp__label">Selection Stages</label>
                  <input
                    type="text"
                    className="ajp__input"
                    placeholder="e.g. Prelims • Mains • Interview"
                    value={orgForm.selectionStages}
                    onChange={(e) => setOrgForm({ ...orgForm, selectionStages: e.target.value })}
                  />
                </div>
              </div>

              {/* HERO SECTION BANNER UPLOADER (Fixed dimensions for perfect fit) */}
              <div className="ajp__field">
                <div className="ajp__logo-header-row">
                  <label className="ajp__label">Hero Section Background Banner Image</label>
                  <span className="ajp__logo-spec-badge">
                    ⚡ Auto-Fit Cloudinary (1600×600px 16:6 Panoramic)
                  </span>
                </div>

                <div className="ajp__banner-uploader-box">
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />

                  {/* Banner Preview Frame */}
                  <div className="ajp__banner-preview-frame">
                    <img
                      src={orgForm.bannerUrl || "/UPSC.png"}
                      alt="Banner Preview"
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
                      onClick={() => bannerFileInputRef.current?.click()}
                      disabled={isUploadingBanner}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{isUploadingBanner ? "Uploading Banner..." : "Upload New Hero Banner Image"}</span>
                    </button>

                    {/* Quick Presets */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                      {PRESET_BANNERS.map((pb) => (
                        <button
                          key={pb.name}
                          type="button"
                          className={`ajp__preset-btn ${orgForm.bannerUrl === pb.url ? "ajp__preset-btn--active" : ""}`}
                          onClick={() => setOrgForm({ ...orgForm, bannerUrl: pb.url })}
                        >
                          {pb.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Emblem Logo Uploader (400x400) */}
              <div className="ajp__field">
                <div className="ajp__logo-header-row">
                  <label className="ajp__label">Official Emblem / Logo</label>
                  <span className="ajp__logo-spec-badge">
                    ⚡ Auto-Fit Cloudinary (400×400px 1:1)
                  </span>
                </div>

                <div className="ajp__logo-uploader">
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />

                  <div className="ajp__logo-thumb-box">
                    {orgForm.logoUrl ? (
                      <img
                        src={orgForm.logoUrl}
                        alt="Logo"
                        className="ajp__logo-thumb"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const ph = e.target.parentElement.querySelector(".ajp__logo-thumb-ph");
                          if (ph) ph.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="ajp__logo-thumb-ph"
                      style={{ display: orgForm.logoUrl ? "none" : "flex" }}
                    >
                      🏛️
                    </div>
                  </div>

                  <div className="ajp__logo-controls">
                    <button
                      type="button"
                      className="ajp__upload-btn"
                      onClick={() => logoFileInputRef.current?.click()}
                      disabled={isUploadingLogo}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{isUploadingLogo ? "Uploading..." : "Upload Official Emblem"}</span>
                    </button>

                    {orgForm.logoUrl && (
                      <button
                        type="button"
                        className="ajp__logo-remove-btn"
                        onClick={() => setOrgForm((prev) => ({ ...prev, logoUrl: "" }))}
                        title="Remove emblem"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Presets for Organization Emblem */}
                <div className="ajp__logo-presets">
                  <span className="ajp__logo-presets-label">Or choose official preset emblem:</span>
                  <div className="ajp__preset-row">
                    {PRESET_EMBLEMS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        className={`ajp__preset-btn ${orgForm.logoUrl === preset.url ? "ajp__preset-btn--active" : ""}`}
                        onClick={() => setOrgForm((prev) => ({ ...prev, logoUrl: preset.url }))}
                      >
                        <img src={preset.url} alt={preset.name} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slogans */}
              <div className="ajp__form-row">
                <div className="ajp__field">
                  <label className="ajp__label">Primary Slogan</label>
                  <input
                    type="text"
                    className="ajp__input"
                    placeholder="e.g. Serve Lead Bring Change"
                    value={orgForm.slogan}
                    onChange={(e) => setOrgForm({ ...orgForm, slogan: e.target.value })}
                  />
                </div>

                <div className="ajp__field">
                  <label className="ajp__label">Sub-Slogan Callout</label>
                  <input
                    type="text"
                    className="ajp__input"
                    placeholder="e.g. A Stronger India Needs You"
                    value={orgForm.subSlogan}
                    onChange={(e) => setOrgForm({ ...orgForm, subSlogan: e.target.value })}
                  />
                </div>
              </div>

              <div className="ajp__field">
                <label className="ajp__label">About Organization Description</label>
                <textarea
                  rows={3}
                  className="ajp__textarea"
                  placeholder="Provide default context and background for this organization..."
                  value={orgForm.about}
                  onChange={(e) => setOrgForm({ ...orgForm, about: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="ajp__refresh-btn"
                  onClick={() => setIsOrgModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ajp__cat-add-btn">
                  {editingOrgId ? "Save Changes" : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Organizations Grid grouped under Categories */}
        <div className="ajp__cat-grid" style={{ marginTop: "1rem" }}>
          {organizations.map((org) => (
            <div key={org._id || org.name} className="ajp__cat-card ajp__org-card">
              {/* Mini Banner Preview Header */}
              {org.bannerUrl && (
                <div className="ajp__org-card-banner">
                  <img src={org.bannerUrl} alt="Hero Banner" onError={(e) => (e.target.src = "/UPSC.png")} />
                  <span className="ajp__org-banner-tag">Hero Banner Configured</span>
                </div>
              )}

              <div className="ajp__org-card-main">
                <div className="ajp__cat-card-icon">
                  {org.logoUrl ? (
                    <img
                      src={org.logoUrl}
                      alt={org.name}
                      style={{ width: "28px", height: "28px", objectFit: "contain" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    "🏛️"
                  )}
                </div>

                <div className="ajp__cat-card-info">
                  <span className="ajp__cat-card-name">{org.name}</span>
                  <span className="ajp__cat-card-count" style={{ color: "#60a5fa" }}>
                    📁 {org.category} {org.code ? `• ${org.code}` : ""}
                  </span>
                  {org.slogan && (
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>
                      "{org.slogan}"
                    </span>
                  )}
                </div>

                <div className="ajp__org-actions">
                  <button
                    type="button"
                    className="ajp__org-edit-btn"
                    onClick={() => handleOpenEditModal(org)}
                    title="Edit Organization Banner & Info"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className="ajp__cat-card-del"
                    onClick={() => onOrganizationDeleted && onOrganizationDeleted(org._id, org.name)}
                    title="Delete Organization"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Active Category Folders Grid ── */}
      <div className="ajp__card">
        <div className="ajp__card-head-row">
          <h2 className="ajp__card-title">Active Filter Categories ({categories.length})</h2>
          <button
            type="button"
            className="ajp__refresh-btn"
            onClick={handleRefresh}
            title="Refresh from server"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="ajp__cat-grid">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            return (
              <div key={cat._id || cat.slug} className="ajp__cat-card">
                <div className="ajp__cat-card-icon">📁</div>
                <div className="ajp__cat-card-info">
                  <span className="ajp__cat-card-name">{cat.name}</span>
                  <span className="ajp__cat-card-count">
                    {count.toLocaleString()} {count === 1 ? "Opportunity" : "Opportunities"}
                  </span>
                </div>
                {cat.slug !== "all" && (
                  <button
                    type="button"
                    className="ajp__cat-card-del"
                    onClick={() => onCategoryDeleted && onCategoryDeleted(cat._id, cat.name)}
                    title="Delete category"
                  >
                    &times;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
