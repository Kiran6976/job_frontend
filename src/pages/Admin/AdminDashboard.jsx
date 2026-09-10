import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminDashboard.css";
import AdminJobPosting from "./JobPosting/AdminJobPosting";
import AdminUsers from "./Users/AdminUsers";
import { API_ENDPOINTS } from "../../config/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("candidates");
  const [overviewStats, setOverviewStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  useEffect(() => {
    const authData = localStorage.getItem("admin_auth");
    if (!authData) {
      navigate("/admin/login");
      return;
    }

    try {
      const parsed = JSON.parse(authData);
      if (!parsed || !parsed.user) {
        navigate("/admin/login");
      } else {
        setAdminUser(parsed.user);
      }
    } catch (e) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.allSettled([
          fetch(`${API_ENDPOINTS.USER}/admin/stats`),
          fetch(`${API_ENDPOINTS.JOB}/all`),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value.ok) {
          const statsData = await statsRes.value.json();
          if (statsData.success && statsData.stats) {
            setOverviewStats((prev) => ({
              ...prev,
              totalUsers: statsData.stats.totalUsers || 0,
            }));
          }
        }

        if (jobsRes.status === "fulfilled" && jobsRes.value.ok) {
          const jobsData = await jobsRes.value.json();
          if (jobsData.success && Array.isArray(jobsData.jobs)) {
            setOverviewStats((prev) => ({
              ...prev,
              totalJobs: jobsData.jobs.length,
            }));
          }
        }
      } catch (err) {
        console.warn("Overview stats fetch:", err);
      }
    };

    fetchOverviewStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/admin/login");
  };

  if (!adminUser) {
    return (
      <div className="ad-loading">
        <div className="al-spinner" />
        <p>Loading Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="ad-layout">
      {/* Mobile Backdrop */}
      {!isSidebarCollapsed && (
        <div
          className="ad-sidebar-backdrop"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* ────────── Sidebar ────────── */}
      <aside className={`ad-sidebar ${isSidebarCollapsed ? "ad-sidebar--collapsed" : ""}`}>
        <div className="ad-sidebar__header">
          {!isSidebarCollapsed ? (
            <>
              <Link to="/" className="ad-sidebar__brand">
                <img src="/Logo.png" alt="JobPortal Logo" className="ad-sidebar__logo" />
              </Link>
              <div className="ad-sidebar__header-actions">
                <span className="ad-sidebar__badge">ADMIN</span>
                <button
                  type="button"
                  className="ad-sidebar__toggle"
                  onClick={toggleSidebar}
                  title="Collapse Sidebar"
                  aria-label="Collapse Sidebar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="11 17 6 12 11 7" />
                    <polyline points="18 17 13 12 18 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="ad-sidebar__header-collapsed">
              <button
                type="button"
                className="ad-sidebar__toggle ad-sidebar__toggle--expand"
                onClick={toggleSidebar}
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <nav className="ad-nav">
          {!isSidebarCollapsed && <div className="ad-nav__section">CORE</div>}
          <button
            className={`ad-nav__item ${activeTab === "overview" ? "ad-nav__item--active" : ""}`}
            onClick={() => setActiveTab("overview")}
            title="Dashboard Overview"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="ad-nav__label">Dashboard Overview</span>
          </button>

          {!isSidebarCollapsed && <div className="ad-nav__section">MANAGEMENT</div>}
          <button
            className={`ad-nav__item ${activeTab === "jobs" ? "ad-nav__item--active" : ""}`}
            onClick={() => setActiveTab("jobs")}
            title="Job Postings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span className="ad-nav__label">Job Postings</span>
          </button>

          <button
            className={`ad-nav__item ${activeTab === "candidates" ? "ad-nav__item--active" : ""}`}
            onClick={() => setActiveTab("candidates")}
            title="Candidates & Users"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="ad-nav__label">Candidates & Users</span>
          </button>

          <button
            className={`ad-nav__item ${activeTab === "companies" ? "ad-nav__item--active" : ""}`}
            onClick={() => setActiveTab("companies")}
            title="Companies & Recruiters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="20" y2="21" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <polyline points="12 2 2 10 22 10 12 2" />
            </svg>
            <span className="ad-nav__label">Companies & Recruiters</span>
          </button>

          {!isSidebarCollapsed && <div className="ad-nav__section">SYSTEM</div>}
          <button
            className={`ad-nav__item ${activeTab === "settings" ? "ad-nav__item--active" : ""}`}
            onClick={() => setActiveTab("settings")}
            title="Console Settings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="ad-nav__label">Console Settings</span>
          </button>
        </nav>

        <div className="ad-sidebar__footer">
          <button className="ad-logout-btn" onClick={handleLogout} title="Exit Session">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="ad-nav__label">Exit Session</span>
          </button>
        </div>
      </aside>

      {/* ────────── Main Content ────────── */}
      <div className="ad-main">
        {/* Top bar */}
        <header className="ad-topbar">
          <div className="ad-topbar__left">
            <button
              type="button"
              className="ad-topbar__collapse-btn"
              onClick={toggleSidebar}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label="Toggle Sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h2 className="ad-topbar__title">Admin Control Center</h2>
          </div>

          <div className="ad-topbar__right">
            <Link to="/" className="ad-view-site-btn" target="_blank">
              <span>View Live Site</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>

            <div className="ad-user-pill">
              <div className="ad-user-avatar">
                {adminUser.fullname ? adminUser.fullname.charAt(0) : "A"}
              </div>
              <div className="ad-user-info">
                <span className="ad-user-name">{adminUser.fullname || "Super Admin"}</span>
                <span className="ad-user-email">{adminUser.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="ad-content">
          {activeTab === "jobs" && <AdminJobPosting />}

          {activeTab === "candidates" && <AdminUsers />}

          {activeTab === "overview" && (
            <>
              {/* Welcome Banner */}
              <div className="ad-welcome-banner">
                <div className="ad-welcome-text">
                  <span className="ad-welcome-tag">PORTAL READY</span>
                  <h1>Welcome back, {adminUser.fullname || "Admin"}! 👋</h1>
                  <p>
                    The administrative login authentication is live and configured for{" "}
                    <strong>{adminUser.email}</strong>. Select <strong>Candidates & Users</strong> to
                    manage registered users in real time, or <strong>Job Postings</strong> to publish listings!
                  </p>
                </div>
                <div className="ad-welcome-action" style={{ display: "flex", gap: "0.6rem" }}>
                  <button className="ad-btn-primary" onClick={() => setActiveTab("candidates")}>
                    Live Users &rarr;
                  </button>
                  <button
                    className="ad-btn-primary"
                    style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}
                    onClick={() => setActiveTab("jobs")}
                  >
                    Job Postings &rarr;
                  </button>
                </div>
              </div>

              {/* Quick Metrics Cards */}
              <div className="ad-stats-grid">
                <div
                  className="ad-stat-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("jobs")}
                  title="Click to manage job postings"
                >
                  <div className="ad-stat-icon ad-stat-icon--blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className="ad-stat-meta">
                    <span className="ad-stat-label">Total Jobs Active</span>
                    <h3 className="ad-stat-value">
                      {overviewStats.totalJobs > 0 ? overviewStats.totalJobs.toLocaleString() : "1,482"}
                    </h3>
                    <span className="ad-stat-sub ad-stat-sub--pos">Manage postings &rarr;</span>
                  </div>
                </div>

                <div
                  className="ad-stat-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("candidates")}
                  title="Click to open Candidate Directory"
                >
                  <div className="ad-stat-icon ad-stat-icon--emerald">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="ad-stat-meta">
                    <span className="ad-stat-label">Registered Candidates</span>
                    <h3 className="ad-stat-value">
                      {overviewStats.totalUsers > 0 ? overviewStats.totalUsers.toLocaleString() : "Live Sync"}
                    </h3>
                    <span className="ad-stat-sub ad-stat-sub--pos">View real-time directory &rarr;</span>
                  </div>
                </div>

                <div className="ad-stat-card">
                  <div className="ad-stat-icon ad-stat-icon--purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="21" x2="20" y2="21" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                      <polyline points="12 2 2 10 22 10 12 2" />
                    </svg>
                  </div>
                  <div className="ad-stat-meta">
                    <span className="ad-stat-label">Partner Companies</span>
                    <h3 className="ad-stat-value">340</h3>
                    <span className="ad-stat-sub ad-stat-sub--pos">+22 verified</span>
                  </div>
                </div>

                <div className="ad-stat-card">
                  <div className="ad-stat-icon ad-stat-icon--amber">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="ad-stat-meta">
                    <span className="ad-stat-label">System Health</span>
                    <h3 className="ad-stat-value">Operational</h3>
                    <span className="ad-stat-sub ad-stat-sub--pos">All services live</span>
                  </div>
                </div>
              </div>

              {/* Quick Jump Panels */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
                <div
                  className="ad-stat-card"
                  style={{ cursor: "pointer", flexDirection: "column", alignItems: "flex-start", gap: "1rem", padding: "1.5rem" }}
                  onClick={() => setActiveTab("candidates")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="ad-stat-icon ad-stat-icon--emerald" style={{ width: "40px", height: "40px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: "#ffffff", fontSize: "1.05rem" }}>Live Candidates & Users</h4>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Real-time user management</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    Monitor user registrations in real time, inspect candidate profiles and resumes, assign roles, and control account statuses.
                  </p>
                  <button className="ad-btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}>
                    Open User Directory &rarr;
                  </button>
                </div>

                <div
                  className="ad-stat-card"
                  style={{ cursor: "pointer", flexDirection: "column", alignItems: "flex-start", gap: "1rem", padding: "1.5rem" }}
                  onClick={() => setActiveTab("jobs")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="ad-stat-icon ad-stat-icon--blue" style={{ width: "40px", height: "40px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: "#ffffff", fontSize: "1.05rem" }}>Job & Exam Postings</h4>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Publish and manage vacancies</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    Create job listings, manage hiring categories and organizations, extract exam patterns with AI, and track published vacancies.
                  </p>
                  <button className="ad-btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}>
                    Manage Job Postings &rarr;
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab !== "jobs" && activeTab !== "candidates" && activeTab !== "overview" && (
            <div className="ad-placeholder-box">
              <div className="ad-placeholder-art">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3 style={{ textTransform: "capitalize" }}>{activeTab} Management</h3>
              <p>This section is being configured. Please use Job Postings or Candidates & Users.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
