import { useState } from "react";
import "./SignUp.css";
import { API_ENDPOINTS } from "../../config/api";

const SignUp = () => {
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


  return (
    <div className="su">
      {/* ────────── Top Navbar ────────── */}
      <header className="su__navbar">
        <a href="/" className="su__logo">
          <img src="/Logo.png" alt="JobPortal Logo" />
        </a>

        <nav className="su__nav-links">
          <a href="#" className="su__nav-link">Find Jobs</a>
          <a href="#" className="su__nav-link">Companies</a>
          <a href="#" className="su__nav-link">Resources</a>
          <a href="#" className="su__nav-link">About</a>
        </nav>

        <div className="su__nav-auth">
          <span className="su__login-prompt">Already have an account?</span>
          <a href="/login" className="su__login-btn">
            Login
          </a>
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
              <div className="su__social-row">
                <button type="button" className="su__social-btn">
                  <img
                    src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                    alt="Google"
                    className="su__social-logo"
                  />
                  <span>Google</span>
                </button>

                <button type="button" className="su__social-btn">
                  <svg className="su__social-logo su__social-logo--li" viewBox="0 0 24 24" fill="#0a66c2">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66 1 0 1.74-.74 1.74-1.66 0-.92-.74-1.66-1.74-1.66z" />
                  </svg>
                  <span>LinkedIn</span>
                </button>

                <button type="button" className="su__social-btn">
                  <svg className="su__social-logo" viewBox="0 0 24 24" fill="#24292f">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
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

