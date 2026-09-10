import { useState, useEffect } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "#" },
  { label: "About", href: "#" },
  { label: "For Employers", href: "#" },
];

const Navbar = () => {
  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="navbar">
      {/* ── Logo ── */}
      <a href="/" className="navbar__logo">
        <img src="/Logo.png" alt="JobPortal Logo" />
      </a>

      {/* ── Navigation Links ── */}
      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="navbar__link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* ── Auth Area ── */}
      <div className="navbar__auth">
        {user ? (
          <div className="navbar__user-profile">
            <div className="navbar__user-avatar-wrap">
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
            </div>
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
          <>
            <a href="/login" className="navbar__btn navbar__btn--ghost">
              Login
            </a>
            <a href="/signup" className="navbar__btn navbar__btn--primary">
              Sign Up &rarr;
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




