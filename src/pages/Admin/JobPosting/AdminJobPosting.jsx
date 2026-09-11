import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Briefcase,
  GraduationCap,
  Laptop,
  BookOpen,
  Shield,
  Globe,
  Folder,
  Edit3,
  Plus,
  Archive,
} from "lucide-react";
import "./AdminJobPosting.css";
import PostJobForm from "./PostJobForm";
import ManageCategories from "./ManageCategories";
import PublishedJobsList from "./PublishedJobsList";
import ArchivedJobsList from "./ArchivedJobsList";
import { isJobExpired } from "../../../utils/jobHelpers";
import { API_ENDPOINTS } from "../../../config/api";

// Helper for category icons
const getCategoryIcon = (name) => {
  const lower = (name || "").toLowerCase();
  if (lower.includes("all")) return <Globe size={15} />;
  if (lower.includes("govt") || lower.includes("exam") || lower.includes("upsc") || lower.includes("ssc")) return <Building2 size={15} />;
  if (lower.includes("private") || lower.includes("it") || lower.includes("software") || lower.includes("tech")) return <Briefcase size={15} />;
  if (lower.includes("intern")) return <GraduationCap size={15} />;
  if (lower.includes("wfh") || lower.includes("remote") || lower.includes("home")) return <Laptop size={15} />;
  if (lower.includes("state")) return <Building2 size={15} />;
  if (lower.includes("teach") || lower.includes("school") || lower.includes("edu")) return <BookOpen size={15} />;
  if (lower.includes("defense") || lower.includes("police") || lower.includes("navy") || lower.includes("army") || lower.includes("security")) return <Shield size={15} />;
  return <Folder size={15} />;
};

// ────────── Custom High-End Dropdown ──────────
const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="ajp-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className={`ajp-dropdown__trigger ${isOpen ? "ajp-dropdown__trigger--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="ajp-dropdown__trigger-left">
          {selectedOption?.icon && (
            <span className="ajp-dropdown__icon">{selectedOption.icon}</span>
          )}
          {selectedOption?.color && (
            <span
              className="ajp-dropdown__color-dot"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className="ajp-dropdown__value-text">
            {selectedOption?.label || placeholder}
          </span>
        </div>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`ajp-dropdown__chevron ${isOpen ? "ajp-dropdown__chevron--up" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="ajp-dropdown__menu">
          <div className="ajp-dropdown__list">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`ajp-dropdown__item ${isSelected ? "ajp-dropdown__item--selected" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <div className="ajp-dropdown__item-left">
                    {option.icon && (
                      <span className="ajp-dropdown__icon">{option.icon}</span>
                    )}
                    {option.color && (
                      <span
                        className="ajp-dropdown__color-dot"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="ajp-dropdown__item-label">{option.label}</span>
                  </div>

                  <div className="ajp-dropdown__item-right">
                    {option.badge && (
                      <span className="ajp-dropdown__item-badge">{option.badge}</span>
                    )}
                    {isSelected && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        className="ajp-dropdown__check"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminJobPosting = () => {
  const [activeTab, setActiveTab] = useState("post-job"); // 'post-job' | 'categories' | 'job-list'
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });

  const handleEditJob = (jobToEdit) => {
    setEditingJob(jobToEdit);
    setActiveTab("post-job");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
  };

  const showNotification = (text, type = "info") => {
    setActionMessage({ text, type });
    setTimeout(() => {
      setActionMessage({ text: "", type: "" });
    }, 4500);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/category/all`);
      const data = await res.json();
      if (res.ok && data.categories) {
        setCategories(data.categories);
        localStorage.setItem("portal_categories", JSON.stringify(data.categories));
      }
    } catch (err) {
      const cached = localStorage.getItem("portal_categories");
      if (cached) setCategories(JSON.parse(cached));
    }
  };

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/organization/all`);
      const data = await res.json();
      if (res.ok && data.organizations) {
        setOrganizations(data.organizations);
        localStorage.setItem("portal_organizations", JSON.stringify(data.organizations));
      }
    } catch (err) {
      const cached = localStorage.getItem("portal_organizations");
      if (cached) setOrganizations(JSON.parse(cached));
    }
  };

  // Fetch jobs (including archived for admin management)
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.JOB}/all?includeArchived=true`);
      const data = await res.json();
      if (res.ok && data.jobs) {
        setJobs(data.jobs);
        localStorage.setItem("portal_custom_jobs", JSON.stringify(data.jobs));
      }
    } catch (err) {
      const cached = localStorage.getItem("portal_custom_jobs");
      if (cached) setJobs(JSON.parse(cached));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchOrganizations();
    fetchJobs();
  }, []);

  // Category deletion
  const handleDeleteCategory = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category '${catName}'?`)) return;

    try {
      await fetch(`${API_ENDPOINTS.JOB}/category/${id}`, { method: "DELETE" });
      showNotification(`Category '${catName}' removed.`, "info");
      fetchCategories();
    } catch (err) {
      const updated = categories.filter((c) => c._id !== id);
      setCategories(updated);
      localStorage.setItem("portal_categories", JSON.stringify(updated));
      showNotification(`Category removed locally.`, "info");
    }
  };

  // Organization deletion
  const handleDeleteOrganization = async (id, orgName) => {
    if (!window.confirm(`Are you sure you want to remove organization '${orgName}'?`)) return;

    try {
      await fetch(`${API_ENDPOINTS.JOB}/organization/${id}`, { method: "DELETE" });
      showNotification(`Organization '${orgName}' removed.`, "info");
      fetchOrganizations();
    } catch (err) {
      const updated = organizations.filter((o) => o._id !== id);
      setOrganizations(updated);
      localStorage.setItem("portal_organizations", JSON.stringify(updated));
      showNotification("Organization removed locally.", "info");
    }
  };

  // Job deletion
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;

    try {
      await fetch(`${API_ENDPOINTS.JOB}/${id}`, { method: "DELETE" });
      showNotification("Job listing deleted.", "info");
      fetchJobs();
      fetchCategories();
    } catch (err) {
      const updated = jobs.filter((j) => j._id !== id);
      setJobs(updated);
      localStorage.setItem("portal_custom_jobs", JSON.stringify(updated));
      showNotification("Job listing deleted.", "info");
      fetchCategories();
    }
  };


  const categoryOptions =
    categories.length > 0
      ? categories.map((c) => ({
          value: c.name,
          label: c.name,
          icon: getCategoryIcon(c.name),
          badge: c.count ? `${c.count.toLocaleString()} jobs` : "0 jobs",
        }))
      : [
          { value: "Government Exams", label: "Government Exams", icon: <Building2 size={15} />, badge: "8,340 jobs" },
          { value: "Private Jobs", label: "Private Jobs", icon: <Briefcase size={15} />, badge: "3,920 jobs" },
        ];

  const scopeOptions = [
    { value: "National", label: "National Level", icon: <Building2 size={15} /> },
    { value: "State", label: "State Government", icon: <Building2 size={15} /> },
    { value: "Global", label: "Global / MNC", icon: <Globe size={15} /> },
    { value: "Remote", label: "Remote / Work From Home", icon: <Laptop size={15} /> },
  ];

  const statusOptions = [
    { value: "Apply Soon", label: "Apply Soon", color: "#f59e0b", badge: "Upcoming" },
    { value: "Apply Now", label: "Apply Now", color: "#10b981", badge: "Open" },
    { value: "Ongoing", label: "Ongoing", color: "#ef4444", badge: "Live" },
    { value: "Upcoming", label: "Upcoming", color: "#a855f7", badge: "Notified" },
  ];

  const publishedJobs = jobs.filter((j) => !isJobExpired(j));
  const archivedJobs = jobs.filter((j) => isJobExpired(j));

  return (
    <div className="ajp">
      {/* Top Action & Navigation Bar */}
      <div className="ajp__header">
        <div className="ajp__header-info">
          <span className="ajp__badge">OPPORTUNITIES ENGINE</span>
          <h1 className="ajp__title">Job Postings &amp; Category Management</h1>
          <p className="ajp__subtitle">
            Create categories, manage organizations (UPSC, RRB, Banking), and publish notifications with full detailed pages.
          </p>
        </div>

        <div className="ajp__stats">
          <div className="ajp__stat-pill">
            <span className="ajp__stat-num">{publishedJobs.length}</span>
            <span className="ajp__stat-label">Published</span>
          </div>
          <div className="ajp__stat-pill">
            <span className="ajp__stat-num">{archivedJobs.length}</span>
            <span className="ajp__stat-label">Archived</span>
          </div>
          <div className="ajp__stat-pill">
            <span className="ajp__stat-num">{categories.length}</span>
            <span className="ajp__stat-label">Categories</span>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage.text && (
        <div className={`ajp__alert ajp__alert--${actionMessage.type}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Modular Sections / Tab Switcher */}
      <div className="ajp__tabs">
        <button
          type="button"
          className={`ajp__tab-btn ${activeTab === "post-job" ? "ajp__tab-btn--active" : ""}`}
          onClick={() => {
            if (activeTab !== "post-job") {
              setEditingJob(null);
            }
            setActiveTab("post-job");
          }}
        >
          {editingJob ? <Edit3 size={16} /> : <Plus size={16} />}
          <span>{editingJob ? "Edit Opportunity" : "Post New Job / Exam"}</span>
        </button>

        <button
          type="button"
          className={`ajp__tab-btn ${activeTab === "categories" ? "ajp__tab-btn--active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span>Manage Categories ({categories.length})</span>
        </button>

        <button
          type="button"
          className={`ajp__tab-btn ${activeTab === "job-list" ? "ajp__tab-btn--active" : ""}`}
          onClick={() => setActiveTab("job-list")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>Published Jobs ({publishedJobs.length})</span>
        </button>

        <button
          type="button"
          className={`ajp__tab-btn ${activeTab === "archives" ? "ajp__tab-btn--active" : ""}`}
          onClick={() => setActiveTab("archives")}
        >
          <Archive size={16} />
          <span>Archives ({archivedJobs.length})</span>
        </button>
      </div>

      {/* ── Tab 1 Component: PostJobForm.jsx ── */}
      {activeTab === "post-job" && (
        <PostJobForm
          categories={categories}
          organizations={organizations}
          categoryOptions={categoryOptions}
          scopeOptions={scopeOptions}
          statusOptions={statusOptions}
          CustomDropdown={CustomDropdown}
          editingJob={editingJob}
          onCancelEdit={handleCancelEdit}
          onJobPublished={() => {
            setEditingJob(null);
            fetchJobs();
            fetchCategories();
            setActiveTab("job-list");
          }}
          showNotification={showNotification}
        />
      )}

      {/* ── Tab 2 Component: ManageCategories.jsx ── */}
      {activeTab === "categories" && (
        <ManageCategories
          categories={categories}
          organizations={organizations}
          jobs={jobs}
          isLoading={isLoading}
          CustomDropdown={CustomDropdown}
          onCategoryCreated={(newCat) => {
            setCategories([...categories, newCat]);
          }}
          onCategoryDeleted={handleDeleteCategory}
          onOrganizationCreated={(newOrg) => {
            setOrganizations([...organizations, newOrg]);
          }}
          onOrganizationDeleted={handleDeleteOrganization}
          fetchCategories={fetchCategories}
          fetchOrganizations={fetchOrganizations}
          fetchJobs={fetchJobs}
          showNotification={showNotification}
        />
      )}

      {/* ── Tab 3 Component: PublishedJobsList.jsx ── */}
      {activeTab === "job-list" && (
        <PublishedJobsList
          jobs={publishedJobs}
          onDeleteJob={handleDeleteJob}
          onEditJob={handleEditJob}
          onNavigatePostJob={() => {
            setEditingJob(null);
            setActiveTab("post-job");
          }}
        />
      )}

      {/* ── Tab 4 Component: ArchivedJobsList.jsx ── */}
      {activeTab === "archives" && (
        <ArchivedJobsList
          jobs={archivedJobs}
          onDeleteJob={handleDeleteJob}
          onEditJob={handleEditJob}
          onNavigatePostJob={() => {
            setEditingJob(null);
            setActiveTab("post-job");
          }}
        />
      )}
    </div>
  );
};

export default AdminJobPosting;
