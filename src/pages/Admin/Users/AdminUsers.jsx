import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Phone, Mail } from "lucide-react";
import "./AdminUsers.css";
import UserDetailsModal from "./UserDetailsModal";
import { API_ENDPOINTS } from "../../../config/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobseekers: 0,
    totalRecruiters: 0,
    totalAdmins: 0,
    totalGoogleUsers: 0,
    newToday: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch Users & Real-time Stats
  const fetchData = useCallback(
    async (showLoadingSpinner = false) => {
      if (showLoadingSpinner) {
        setIsLoading(true);
      } else {
        setIsSyncing(true);
      }

      try {
        const queryParams = new URLSearchParams({
          search,
          role: roleFilter,
          provider: providerFilter,
          status: statusFilter,
          sortBy,
          page: String(page),
          limit: "15",
        });

        const [usersRes, statsRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.USER}/admin/all?${queryParams.toString()}`),
          fetch(`${API_ENDPOINTS.USER}/admin/stats`),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.success) {
            setUsers(usersData.users || []);
            setTotalPages(usersData.totalPages || 1);
            setTotalCount(usersData.total || 0);
          }
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success && statsData.stats) {
            setStats(statsData.stats);
          }
        }

        setLastSynced(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Real-time fetch error:", err);
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    [search, roleFilter, providerFilter, statusFilter, sortBy, page]
  );

  // Initial and reactive fetch on filter change
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Real-time polling interval (every 10 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.USER}/admin/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message, "success");
        // Update local state immediately
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser((prev) => ({ ...prev, role: newRole }));
        }
        fetchData(false);
      } else {
        showToast(data.message || "Failed to update role.", "error");
      }
    } catch (err) {
      showToast("Network error updating role.", "error");
    }
  };

  // Handle Status Change (Active / Suspended)
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.USER}/admin/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message, "success");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser((prev) => ({ ...prev, status: newStatus }));
        }
        fetchData(false);
      } else {
        showToast(data.message || "Failed to update status.", "error");
      }
    } catch (err) {
      showToast("Network error updating status.", "error");
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete user "${userName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.USER}/admin/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message, "success");
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null);
        }
        fetchData(false);
      } else {
        showToast(data.message || "Failed to delete user.", "error");
      }
    } catch (err) {
      showToast("Network error deleting user.", "error");
    }
  };

  // Time format helper (relative time)
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="au-container">
      {/* ────────── Header Area ────────── */}
      <div className="au-header">
        <div className="au-title-group">
          <h1>Candidates & User Directory</h1>
          <p className="au-subtitle">
            Real-time candidate monitoring, authentication methods, role assignments, and live registration stream.
          </p>
        </div>

        {/* Real-time controls */}
        <div className="au-realtime-controls">
          <div
            className={`au-pulse-badge ${
              autoRefresh ? "au-pulse-badge--active" : "au-pulse-badge--paused"
            }`}
          >
            <span className="au-pulse-dot" />
            <span>{autoRefresh ? "LIVE SYNC ON" : "SYNC PAUSED"}</span>
          </div>

          <label className="au-toggle-switch" title="Toggle automatic 10s polling">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto (10s)</span>
          </label>

          <button
            type="button"
            className="au-btn-sync"
            onClick={() => fetchData(false)}
            disabled={isSyncing}
            title="Fetch latest updates from database"
          >
            <svg
              className={`au-sync-icon ${isSyncing ? "au-sync-icon--spin" : ""}`}
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
          </button>

          {lastSynced && (
            <span className="au-last-synced">Synced {lastSynced}</span>
          )}
        </div>
      </div>

      {/* ────────── Metrics Grid ────────── */}
      <div className="au-metrics-grid">
        <div className="au-metric-card">
          <div className="au-metric-icon au-metric-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="au-metric-meta">
            <span className="au-metric-label">Total Users</span>
            <h3 className="au-metric-val">
              {stats.totalUsers.toLocaleString()}
            </h3>
            <span className="au-metric-sub">
              {stats.newToday > 0 ? `+${stats.newToday} today` : "Live database"}
            </span>
          </div>
        </div>

        <div className="au-metric-card">
          <div className="au-metric-icon au-metric-icon--emerald">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="au-metric-meta">
            <span className="au-metric-label">Job Seekers</span>
            <h3 className="au-metric-val">
              {stats.totalJobseekers.toLocaleString()}
            </h3>
            <span className="au-metric-sub">Active candidates</span>
          </div>
        </div>

        <div className="au-metric-card">
          <div className="au-metric-icon au-metric-icon--purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className="au-metric-meta">
            <span className="au-metric-label">Recruiters</span>
            <h3 className="au-metric-val">
              {stats.totalRecruiters.toLocaleString()}
            </h3>
            <span className="au-metric-sub">Hiring partners</span>
          </div>
        </div>

        <div className="au-metric-card">
          <div className="au-metric-icon au-metric-icon--google">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>
          <div className="au-metric-meta">
            <span className="au-metric-label">Google OAuth Users</span>
            <h3 className="au-metric-val">
              {stats.totalGoogleUsers.toLocaleString()}
            </h3>
            <span className="au-metric-sub">1-Click authenticated</span>
          </div>
        </div>

        <div className="au-metric-card">
          <div className="au-metric-icon au-metric-icon--amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="au-metric-meta">
            <span className="au-metric-label">New Registrations</span>
            <h3 className="au-metric-val">
              {stats.newToday}
            </h3>
            <span className="au-metric-sub">Registered today</span>
          </div>
        </div>
      </div>

      {/* ────────── Filter & Search Toolbar ────────── */}
      <div className="au-toolbar">
        <div className="au-toolbar-top">
          {/* Search box */}
          <div className="au-search-box">
            <svg
              className="au-search-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="au-search-input"
              placeholder="Search by name, email, or phone number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button
                type="button"
                className="au-search-clear"
                onClick={() => setSearch("")}
                title="Clear search"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="au-toolbar-filters">
            {/* Provider Filter */}
            <select
              className="au-select"
              value={providerFilter}
              onChange={(e) => {
                setProviderFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Auth Providers</option>
              <option value="google">Google OAuth Only</option>
              <option value="local">Email & Password</option>
            </select>

            {/* Status Filter */}
            <select
              className="au-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>

            {/* Sort Order */}
            <select
              className="au-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name_asc">Sort: Name (A to Z)</option>
              <option value="name_desc">Sort: Name (Z to A)</option>
            </select>
          </div>
        </div>

        {/* Role Quick Filter Pills */}
        <div className="au-role-pills">
          <span style={{ fontSize: "0.75rem", color: "#64748b", marginRight: "0.25rem" }}>
            Role:
          </span>
          <button
            type="button"
            className={`au-pill-btn ${roleFilter === "all" ? "au-pill-btn--active" : ""}`}
            onClick={() => {
              setRoleFilter("all");
              setPage(1);
            }}
          >
            All Roles ({stats.totalUsers})
          </button>
          <button
            type="button"
            className={`au-pill-btn ${roleFilter === "jobseeker" ? "au-pill-btn--active" : ""}`}
            onClick={() => {
              setRoleFilter("jobseeker");
              setPage(1);
            }}
          >
            Job Seekers ({stats.totalJobseekers})
          </button>
          <button
            type="button"
            className={`au-pill-btn ${roleFilter === "recruiter" ? "au-pill-btn--active" : ""}`}
            onClick={() => {
              setRoleFilter("recruiter");
              setPage(1);
            }}
          >
            Recruiters ({stats.totalRecruiters})
          </button>
          <button
            type="button"
            className={`au-pill-btn ${roleFilter === "admin" ? "au-pill-btn--active" : ""}`}
            onClick={() => {
              setRoleFilter("admin");
              setPage(1);
            }}
          >
            Administrators ({stats.totalAdmins})
          </button>
        </div>
      </div>

      {/* ────────── User Table Card ────────── */}
      <div className="au-table-card">
        {isLoading ? (
          <div className="au-state-box">
            <div className="al-spinner" />
            <p>Loading real-time user directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="au-state-box">
            <svg viewBox="0 0 24 24" width="42" height="42" stroke="#64748b" fill="none" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <h3>No candidates found</h3>
            <p>
              {search || roleFilter !== "all" || providerFilter !== "all" || statusFilter !== "all"
                ? "No registered users match your search criteria. Try clearing some filters."
                : "No users have registered yet. New registrations will automatically appear here live."}
            </p>
          </div>
        ) : (
          <>
            <div className="au-table-wrap">
              <table className="au-table">
                <thead>
                  <tr>
                    <th>Candidate / User</th>
                    <th>Contact & Auth</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isGoogle = Boolean(user.googleId);
                    const isSuperAdmin =
                      user.email?.toLowerCase() === "kiransamanta88@gmail.com";
                    const status = user.status || "active";
                    const photo = user.profile?.profilePhoto;

                    return (
                      <tr key={user._id}>
                        {/* User Column */}
                        <td>
                          <div className="au-user-cell">
                            {photo && !photo.includes("unsplash") ? (
                              <img
                                src={photo}
                                alt={user.fullname}
                                className="au-user-avatar"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="au-user-avatar au-user-avatar--fallback">
                                {user.fullname
                                  ? user.fullname.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                            )}
                            <div className="au-user-meta">
                              <span className="au-user-name">
                                {user.fullname}
                              </span>
                              <span className="au-user-id">
                                ID: {user._id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact & Auth Column */}
                        <td>
                          <div className="au-contact-cell">
                            <span className="au-contact-email">
                              {user.email}
                            </span>
                            {user.phoneNumber && (
                              <span className="au-contact-phone" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                <Phone size={11} /> {user.phoneNumber}
                              </span>
                            )}
                            <div className="au-provider-badge">
                              {isGoogle ? (
                                <>
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                  </svg>
                                  Google OAuth
                                </>
                              ) : (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                  <Mail size={10} /> Password
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td>
                          <span
                            className={`au-role-badge au-role-badge--${user.role}`}
                          >
                            {user.role === "jobseeker"
                              ? "Job Seeker"
                              : user.role === "recruiter"
                              ? "Recruiter"
                              : "Admin"}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td>
                          <span
                            className={`au-status-badge au-status-badge--${status}`}
                          >
                            <span className="au-status-dot" />
                            {status}
                          </span>
                        </td>

                        {/* Joined Column */}
                        <td>
                          <span
                            title={
                              user.createdAt
                                ? new Date(user.createdAt).toLocaleString()
                                : ""
                            }
                          >
                            {formatTimeAgo(user.createdAt)}
                          </span>
                        </td>

                        {/* Actions Column */}
                        <td style={{ textAlign: "right" }}>
                          <div
                            className="au-action-btns"
                            style={{ justifyContent: "flex-end" }}
                          >
                            {/* Quick Role Switcher */}
                            {!isSuperAdmin && (
                              <select
                                className="au-select-quickrole"
                                value={user.role}
                                title="Change user role"
                                onChange={(e) =>
                                  handleRoleChange(user._id, e.target.value)
                                }
                              >
                                <option value="jobseeker">Job Seeker</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}

                            {/* View Profile / Details Button */}
                            <button
                              type="button"
                              className="au-btn-action au-btn-action--details"
                              title="View Full Profile Details"
                              onClick={() => setSelectedUser(user)}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="15"
                                height="15"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>

                            {/* Status Quick Toggle */}
                            {!isSuperAdmin && (
                              <button
                                type="button"
                                className="au-btn-action"
                                title={
                                  status === "active"
                                    ? "Suspend Account"
                                    : "Activate Account"
                                }
                                onClick={() =>
                                  handleStatusChange(
                                    user._id,
                                    status === "active"
                                      ? "suspended"
                                      : "active"
                                  )
                                }
                              >
                                {status === "active" ? (
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    fill="none"
                                    stroke="#f87171"
                                    strokeWidth="2"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                  </svg>
                                ) : (
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    fill="none"
                                    stroke="#34d399"
                                    strokeWidth="2"
                                  >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                  </svg>
                                )}
                              </button>
                            )}

                            {/* Delete User Button */}
                            {!isSuperAdmin && (
                              <button
                                type="button"
                                className="au-btn-action au-btn-action--delete"
                                title="Delete User Permanently"
                                onClick={() =>
                                  handleDeleteUser(user._id, user.fullname)
                                }
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="14"
                                  height="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ────────── Pagination ────────── */}
            <div className="au-pagination">
              <span>
                Showing {users.length} of {totalCount} total candidates
              </span>

              {totalPages > 1 && (
                <div className="au-pagination-btns">
                  <button
                    type="button"
                    className="au-btn-page"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    &larr; Previous
                  </button>
                  <span style={{ margin: "0 0.5rem" }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="au-btn-page"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ────────── Candidate Profile Modal ────────── */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteUser}
        />
      )}

      {/* ────────── Toast Notification ────────── */}
      {toast && (
        <div className={`au-toast au-toast--${toast.type}`}>
          {toast.type === "success" ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
