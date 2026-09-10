import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";
import { API_ENDPOINTS } from "../../config/api";


const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Preset admin credentials
  const ADMIN_EMAIL = "Kiransamanta88@gmail.com";
  const ADMIN_PASS = "Kiran123456?";

  const handleQuickFill = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASS);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg("Please provide both administrator email and password.");
      return;
    }

    setIsLoading(true);

    try {
      // First attempt backend authentication
      let authenticated = false;
      let userData = null;
      let authToken = null;

      try {
        const response = await fetch(`${API_ENDPOINTS.USER}/login`, {
          method: "POST",

          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: trimmedEmail,
            password: password,
            role: "admin",
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          authenticated = true;
          userData = data.user;
          authToken = data.token || "admin-session-token-" + Date.now();
        }
      } catch (backendError) {
        console.warn("Backend login attempt unavailable, verifying credentials locally:", backendError);
      }

      // If backend was not reached or returned error, check against authorized admin credentials
      if (!authenticated) {
        if (
          trimmedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
          password === ADMIN_PASS
        ) {
          authenticated = true;
          userData = {
            fullname: "Kiran Samanta",
            email: ADMIN_EMAIL,
            role: "admin",
          };
          authToken = "admin-session-token-" + Date.now();
        }
      }

      if (authenticated) {
        setSuccessMsg("Authentication successful! Loading admin console...");

        const sessionPayload = {
          user: userData || {
            fullname: "Kiran Samanta",
            email: ADMIN_EMAIL,
            role: "admin",
          },
          token: authToken,
          loginTime: new Date().toISOString(),
          rememberMe,
        };

        localStorage.setItem("admin_auth", JSON.stringify(sessionPayload));

        setTimeout(() => {
          navigate("/admin");
        }, 800);
      } else {
        setErrorMsg("Access Denied: Invalid administrator email or password.");
      }
    } catch (err) {
      setErrorMsg("An unexpected authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="al-page">
      {/* Background Graphic Accents Layer */}
      <div className="al-bg-layer" aria-hidden="true">
        <div className="al-bg-grid" />
        <div className="al-glow-top" />
        <div className="al-glow-bottom" />
      </div>

      {/* Top Header */}
      <header className="al-header">
        <div className="al-header__inner">
          <Link to="/" className="al-brand">
            <img src="/Logo.png" alt="JobPortal Logo" className="al-brand__logo" />
          </Link>
          <div className="al-status-badge">
            <span className="al-status-dot" />
            <span className="al-status-text">SYSTEM SECURE & OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Wrapper */}
      <main className="al-container">
        <div className="al-card">
          {/* Top Security Banner Inside Card */}
          <div className="al-card__top">
            <div className="al-shield-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="al-card__tag">SUPER ADMIN PORTAL</div>
            <h1 className="al-card__title">Administrative Login</h1>
            <p className="al-card__subtitle">
              Restricted area. Please verify your administrator credentials to access the console.
            </p>
          </div>

          {/* Quick Fill Demo Helper */}
          <div className="al-quickfill-box">
            <div className="al-quickfill-info">
              <span className="al-quickfill-title">Authorized Admin Account</span>
              <code className="al-quickfill-code">{ADMIN_EMAIL}</code>
            </div>
            <button
              type="button"
              className="al-quickfill-btn"
              onClick={handleQuickFill}
              title="Click to auto-fill admin credentials"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              Auto Fill
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="al-alert al-alert--error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="al-alert al-alert--success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form className="al-form" onSubmit={handleSubmit}>
            {/* Admin Email */}
            <div className="al-form__group">
              <label htmlFor="admin-email" className="al-form__label">
                Administrator Email
              </label>
              <div className="al-input-wrap">
                <span className="al-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="admin-email"
                  type="email"
                  className="al-input"
                  placeholder="Kiransamanta88@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Admin Password */}
            <div className="al-form__group">
              <div className="al-form__label-row">
                <label htmlFor="admin-password" className="al-form__label">
                  Master Password
                </label>
                <span className="al-form__hint">Protected credential</span>
              </div>
              <div className="al-input-wrap">
                <span className="al-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  className="al-input al-input--password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="al-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Security info */}
            <div className="al-form__options">
              <label className="al-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="al-checkbox"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`al-submit-btn ${isLoading ? "al-submit-btn--loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="al-spinner" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Console</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Security Footer Details */}
          <div className="al-card__footer">
            <div className="al-security-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL Encrypted Session • IP & Device Activity Monitored</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="al-return-wrap">
          <Link to="/" className="al-return-link">
            &larr; Return to Public Job Portal
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
