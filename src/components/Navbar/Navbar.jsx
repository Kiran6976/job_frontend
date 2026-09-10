import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="16" y2="12" />
        <line x1="12" x2="12.01" y1="8" y2="8" />
      </svg>
    ),
  },
];

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const isActive = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && href !== "#" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <nav className="navbar">
        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo" onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/Logo.png" alt="JobPortal Logo" />
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <ul className="navbar__links">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.label}>
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className={`navbar__link ${active ? "navbar__link--active" : ""}`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className={`navbar__link ${active ? "navbar__link--active" : ""}`}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* ── Desktop & Mobile Right Actions ── */}
        <div className="navbar__actions">
          {user ? (
            <div className="navbar__user-profile">
              <Link
                to="/profile"
                className="navbar__user-avatar-wrap"
                title={`Logged in as ${user.fullname || "User"} - View Profile`}
              >
                {user.profile?.profilePhoto ? (
                  <img
                    src={user.profile.profilePhoto}
                    alt={user.fullname || "User"}
                    className="navbar__user-avatar"
                  />
                ) : (
                  <div className="navbar__user-avatar-placeholder">
                    {(user.fullname || "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="navbar__user-name">
                  {user.fullname ? user.fullname.split(" ")[0] : "Account"}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="navbar__logout-btn"
                title="Log Out"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="navbar__auth-desktop">
              <Link to="/login" className="navbar__btn navbar__btn--ghost">
                Login
              </Link>
              <Link to="/signup" className="navbar__btn navbar__btn--primary">
                Sign Up &rarr;
              </Link>
            </div>
          )}

          {/* ── Hamburger Menu Toggle (Mobile only) ── */}
          <button
            type="button"
            className={`navbar__hamburger ${isMobileMenuOpen ? "navbar__hamburger--open" : ""}`}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Backdrop ── */}
      {isMobileMenuOpen && (
        <div
          className="navbar__backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Dropdown ── */}
      <div
        className={`navbar__mobile-menu ${isMobileMenuOpen ? "navbar__mobile-menu--open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* User Card inside Mobile Menu if logged in */}
        {user ? (
          <div className="navbar__mobile-user-card">
            <Link
              to="/profile"
              className="navbar__mobile-user-info"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ textDecoration: "none" }}
            >
              {user.profile?.profilePhoto ? (
                <img
                  src={user.profile.profilePhoto}
                  alt={user.fullname || "User"}
                  className="navbar__mobile-user-avatar"
                />
              ) : (
                <div className="navbar__mobile-user-avatar-placeholder">
                  {(user.fullname || "U")[0].toUpperCase()}
                </div>
              )}
              <div className="navbar__mobile-user-text">
                <span className="navbar__mobile-user-name">{user.fullname || "User"}</span>
                <span className="navbar__mobile-user-role">
                  {user.role === "recruiter" ? "Employer Account" : "Job Seeker • View Profile &rarr;"}
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="navbar__mobile-logout-btn"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="navbar__mobile-auth-buttons">
            <Link
              to="/login"
              className="navbar__mobile-btn navbar__mobile-btn--ghost"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="navbar__mobile-btn navbar__mobile-btn--primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up &rarr;
            </Link>
          </div>
        )}

        <div className="navbar__mobile-divider" />

        {/* Mobile Nav Links */}
        <ul className="navbar__mobile-links">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.label}>
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className={`navbar__mobile-link ${active ? "navbar__mobile-link--active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-icon">{link.icon}</span>
                    <span className="navbar__mobile-link-text">{link.label}</span>
                    <span className="navbar__mobile-link-arrow">&rsaquo;</span>
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className={`navbar__mobile-link ${active ? "navbar__mobile-link--active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-icon">{link.icon}</span>
                    <span className="navbar__mobile-link-text">{link.label}</span>
                    <span className="navbar__mobile-link-arrow">&rsaquo;</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
