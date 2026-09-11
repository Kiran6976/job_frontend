import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./SignUp.css";
import { API_ENDPOINTS } from "../../config/api";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [formData, setFormData] = useState({

    fullname: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Password rules validation
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.fullname || !formData.email || !formData.password) {
      setMessage({
        text: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        text: "Passwords do not match.",
        type: "error",
      });
      return;
    }

    if (!formData.agreed) {
      setMessage({
        text: "Please accept the Terms of Service and Privacy Policy.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.USER}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: "jobseeker",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          text: "Account created successfully! You can now log in.",
          type: "success",
        });
        setFormData({
          fullname: "",
          phoneNumber: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreed: false,
        });
      } else {
        setMessage({
          text: data.message || "Failed to create account.",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: "Cannot reach backend server. Make sure the server is running.",
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
        setMessage({ text: "Signed up with Google successfully! Redirecting...", type: "success" });
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } else {
        setMessage({ text: data.message || "Google sign-up failed.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error connecting to Google authentication.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage({ text: "Google Sign-In was cancelled or failed.", type: "error" });
  };

  return (
    <div className="su">
      {/* ────────── Top Navbar ────────── */}
      <header className="su__navbar">
        <Link to="/" className="su__logo">
          <img src="/Logo.png" alt="JobPortal Logo" />
        </Link>

        <nav className="su__nav-links">
          <Link to="/jobs" className="su__nav-link">Find Jobs</Link>
          <a href="#" className="su__nav-link">Companies</a>
          <a href="#" className="su__nav-link">Resources</a>
          <a href="#" className="su__nav-link">About</a>
        </nav>

        <div className="su__nav-auth">
          <span className="su__login-prompt">Already have an account?</span>
          <Link to="/login" state={{ from }} className="su__login-btn">
            Login
          </Link>
        </div>
      </header>

      {/* ────────── Main Split Section ────────── */}
      <main className="su__main">
        {/* ────── Left Hero Area ────── */}
        <div className="su__hero">
          {/* Background Illustration */}
          <div className="su__hero-bg">
            <img src="/SignIn.png" alt="Workspace with city skyline" className="su__bg-img" />
            <div className="su__bg-overlay" />
          </div>

          {/* Foreground Content */}
          <div className="su__hero-content">
            {/* Pill Badge */}
            <div className="su__badge">
              <span className="su__badge-icon">🚀</span>
              <span>More Than Just Jobs</span>
            </div>

            {/* Headline */}
            <h1 className="su__heading">
              Create Today <br />
              For a <span className="su__heading--blue">Brighter</span> <br />
              <span className="su__heading--purple">Tomorrow</span>
            </h1>

            {/* Subtitle */}
            <p className="su__subtext">
              Join thousands of professionals who are building better careers with
              JobPortal. Create your account today and unlock a world of opportunities.
            </p>

            {/* Features List */}
            <div className="su__features">
              <div className="su__feature-item">
                <div className="su__feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div>
                  <h4 className="su__feat-title">Access to top jobs</h4>
                  <p className="su__feat-sub">Explore opportunities from leading companies.</p>
                </div>
              </div>

              <div className="su__feature-item">
                <div className="su__feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <h4 className="su__feat-title">Track your progress</h4>
                  <p className="su__feat-sub">Manage all your applications in one place.</p>
                </div>
              </div>

              <div className="su__feature-item">
                <div className="su__feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h4 className="su__feat-title">Get personalized alerts</h4>
                  <p className="su__feat-sub">Be the first to know about new opportunities.</p>
                </div>
              </div>
            </div>

            {/* Handwritten Bottom Left Doodle */}
            <div className="su__doodle-left">
              <span className="su__doodle-text">
                Good<br />Careers<br />Brighter<br />Futures
              </span>
              <svg className="su__doodle-underline" viewBox="0 0 60 20" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
                <path d="M5 15 C 25 18, 45 6, 55 4" />
              </svg>
            </div>

            {/* Bottom Stats Banner */}
            <div className="su__stats-strip">
              <div className="su__stat-item">
                <div className="su__stat-icon-wrap su__stat-icon-wrap--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <span className="su__stat-num">50K+</span>
                  <span className="su__stat-lbl">Active Job Seekers</span>
                </div>
              </div>

              <div className="su__stat-divider" />

              <div className="su__stat-item">
                <div className="su__stat-icon-wrap su__stat-icon-wrap--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <line x1="8" y1="6" x2="8" y2="6.01" />
                    <line x1="16" y1="6" x2="16" y2="6.01" />
                    <line x1="8" y1="10" x2="8" y2="10.01" />
                    <line x1="16" y1="10" x2="16" y2="10.01" />
                    <line x1="8" y1="14" x2="8" y2="14.01" />
                    <line x1="16" y1="14" x2="16" y2="14.01" />
                  </svg>
                </div>
                <div>
                  <span className="su__stat-num">1,200+</span>
                  <span className="su__stat-lbl">Trusted Companies</span>
                </div>
              </div>

              <div className="su__stat-divider" />

              <div className="su__stat-item">
                <div className="su__stat-icon-wrap su__stat-icon-wrap--green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <span className="su__stat-num">95%</span>
                  <span className="su__stat-lbl">Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ────── Right Form Area ────── */}
        <div className="su__form-wrap">
          <div className="su__card">
            {/* Card Header */}
            <div className="su__card-header">
              <h2 className="su__card-title">
                Create Your <span className="su__card-title--gradient">Account</span>
              </h2>
              <p className="su__card-sub">
                Join JobPortal and take the next step towards a brighter future.
              </p>
            </div>

            {/* Feedback Alert */}
            {message.text && (
              <div className={`su__alert su__alert--${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Form */}
            <form className="su__form" onSubmit={handleSubmit}>
              <div className="su__form-grid">
                {/* Full Name */}
                <div className="su__field">
                  <label className="su__label">Full Name</label>
                  <div className="su__input-box">
                    <svg className="su__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="su__field">
                  <label className="su__label">Phone Number</label>
                  <div className="su__input-box">
                    <svg className="su__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="su__field su__field--full">
                  <label className="su__label">Email Address</label>
                  <div className="su__input-box">
                    <svg className="su__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <div className="su__field">
                  <label className="su__label">Password</label>
                  <div className="su__input-box">
                    <svg className="su__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      className="su__eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="su__field">
                  <label className="su__label">Confirm Password</label>
                  <div className="su__input-box">
                    <svg className="su__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="su__eye-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Checklist */}
              <div className="su__checklist">
                <div className={`su__check-item ${hasMinLength ? "su__check-item--valid" : ""}`}>
                  <span className="su__check-dot">{hasMinLength ? "✓" : "○"}</span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`su__check-item ${hasSpecial ? "su__check-item--valid" : ""}`}>
                  <span className="su__check-dot">{hasSpecial ? "✓" : "○"}</span>
                  <span>Contains a special character</span>
                </div>
                <div className={`su__check-item ${hasNumber ? "su__check-item--valid" : ""}`}>
                  <span className="su__check-dot">{hasNumber ? "✓" : "○"}</span>
                  <span>Contains a number</span>
                </div>
                <div className={`su__check-item ${passwordsMatch ? "su__check-item--valid" : ""}`}>
                  <span className="su__check-dot">{passwordsMatch ? "✓" : "○"}</span>
                  <span>Both passwords must match</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="su__submit-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account \u2192"}
              </button>

              {/* Divider */}
              <div className="su__divider">
                <span>OR SIGN UP WITH</span>
              </div>

              {/* Social Buttons */}
              <div className="su__social-row" style={{ display: "flex", justifyContent: "center" }}>
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


              {/* Agreement Checkbox */}
              <label className="su__agreement">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </span>
              </label>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;

