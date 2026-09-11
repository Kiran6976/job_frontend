import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Login.css";
import { API_ENDPOINTS } from "../../config/api";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [formData, setFormData] = useState({

    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.email || !formData.password) {
      setMessage({ text: "Please enter both email and password.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.USER}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });


      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          text: data.message || "Logged in successfully!",
          type: "success",
        });
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setTimeout(() => navigate(from, { replace: true }), 800);
      } else {
        setMessage({
          text: data.message || "Invalid credentials. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: "Unable to connect to server. Please ensure the backend is running.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage({ text: "", type: "" });
    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.USER}/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setMessage({ text: "Logged in with Google successfully! Redirecting...", type: "success" });
        setTimeout(() => navigate(from, { replace: true }), 800);
      } else {
        setMessage({ text: data.message || "Google login failed.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error connecting to Google authentication.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage({
      text: "Google sign-in was closed or could not be completed.",
      type: "error",
    });
  };


  return (
    <div className="login-page">
      {/* ────────── Top Navbar ────────── */}
      <header className="login-page__navbar">
        <Link to="/" className="login-page__logo">
          <img src="/Logo.png" alt="JobPortal Logo" />
        </Link>

        <div className="login-page__nav-auth">
          <span className="login-page__signup-prompt">Don't have an account?</span>
          <Link to="/signup" state={{ from }} className="login-page__signup-btn">
            Sign Up
          </Link>
        </div>
      </header>

      {/* ────────── Main Split Section ────────── */}
      <main className="login-page__main">
        {/* ────── Left Hero Area with Login.png BG ────── */}
        <div className="login-page__hero">
          {/* Background Illustration */}
          <div className="login-page__hero-bg">
            <img
              src="/Login.png"
              alt="Dusk workspace with city sunset"
              className="login-page__bg-img"
            />
            <div className="login-page__bg-overlay" />
          </div>

          {/* Foreground Content */}
          <div className="login-page__hero-content">
            {/* Tagline */}
            <span className="login-page__tagline">MORE THAN JUST JOBS</span>

            {/* Headline */}
            <h1 className="login-page__heading">
              Same People. <br />
              <span className="login-page__heading--blue">Bigger</span> <br />
              <span className="login-page__heading--purple">Opportunities.</span>
            </h1>

            {/* Subtitle */}
            <p className="login-page__subtext">
              Log in to your account and continue your journey towards a brighter,
              more successful future.
            </p>

            {/* 3 Features */}
            <div className="login-page__features">
              <div className="login-page__feature-item">
                <div className="login-page__feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div>
                  <h4 className="login-page__feat-title">Discover</h4>
                  <p className="login-page__feat-sub">Find jobs that match your skills.</p>
                </div>
              </div>

              <div className="login-page__feature-item">
                <div className="login-page__feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <h4 className="login-page__feat-title">Track</h4>
                  <p className="login-page__feat-sub">Monitor your applications easily.</p>
                </div>
              </div>

              <div className="login-page__feature-item">
                <div className="login-page__feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h4 className="login-page__feat-title">Stay Updated</h4>
                  <p className="login-page__feat-sub">Get notified about new opportunities.</p>
                </div>
              </div>
            </div>

            {/* Handwritten Left Doodle */}
            <div className="login-page__doodle">
              <span className="login-page__doodle-text">
                Good<br />Careers<br />Brighter<br />Futures
              </span>
              <svg className="login-page__doodle-underline" viewBox="0 0 65 20" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 14 C 25 18, 45 6, 60 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* ────── Right Login Card Area ────── */}
        <div className="login-page__form-wrap">
          <div className="login-page__card">
            {/* Header */}
            <div className="login-page__card-header">
              <h2 className="login-page__card-title">
                Welcome <span className="login-page__card-title--gradient">Back</span>
              </h2>
              <p className="login-page__card-sub">
                Log in to your JobPortal account and continue your journey.
              </p>
            </div>

            {/* Alert Message */}
            {message.text && (
              <div className={`login-page__alert login-page__alert--${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Login Form */}
            <form className="login-page__form" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="login-page__field">
                <label className="login-page__label">Email Address</label>
                <div className="login-page__input-box">
                  <svg className="login-page__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-page__field">
                <label className="login-page__label">Password</label>
                <div className="login-page__input-box">
                  <svg className="login-page__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="login-page__eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="login-page__forgot-row">
                <a href="#" className="login-page__forgot-link">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-page__submit-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In \u2192"}
              </button>

              {/* Divider */}
              <div className="login-page__divider">
                <span>OR CONTINUE WITH</span>
              </div>

              {/* Social Buttons */}
              <div className="login-page__social-row" style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="pill"
                  width="100%"
                />
              </div>


              {/* Security Badge */}
              <div className="login-page__security-badge">
                <div className="login-page__sec-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="login-page__sec-text">
                  <span className="login-page__sec-title">Your data is secure with us.</span>
                  <span className="login-page__sec-sub">We never share your personal information with third parties.</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
