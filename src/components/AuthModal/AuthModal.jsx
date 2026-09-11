import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import "./AuthModal.css";

const AuthModal = () => {
  const { authModal, closeAuthModal, setAuthModal, setAuthData } = useAuth();
  const navigate = useNavigate();

  const isLoginTab = authModal.tab !== "signup";

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
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

  // Reset errors and lock body scroll when modal opens
  useEffect(() => {
    if (authModal.isOpen) {
      setMessage({ text: "", type: "" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [authModal.isOpen, authModal.tab]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && authModal.isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModal.isOpen]);

  if (!authModal.isOpen) return null;

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSuccessRedirect = (user, token) => {
    setAuthData(user, token);
    const destination = authModal.redirectTo;
    closeAuthModal();
    if (destination) {
      navigate(destination);
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!loginForm.email || !loginForm.password) {
      setMessage({ text: "Please enter your email and password.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.USER}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          text: data.message || "Welcome back! Logged in successfully.",
          type: "success",
        });
        setTimeout(() => {
          handleSuccessRedirect(data.user, data.token);
        }, 600);
      } else {
        setMessage({
          text: data.message || "Invalid email or password.",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Unable to reach server. Please check your connection.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit Sign Up
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!signupForm.fullname || !signupForm.email || !signupForm.password) {
      setMessage({ text: "Please fill out all required fields.", type: "error" });
      return;
    }

    if (signupForm.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.USER}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: signupForm.fullname,
          email: signupForm.email,
          phoneNumber: signupForm.phoneNumber,
          password: signupForm.password,
          role: "jobseeker",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          text: "Account created successfully! Logging you in...",
          type: "success",
        });
        // Auto-login registered user
        try {
          const loginRes = await fetch(`${API_ENDPOINTS.USER}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: signupForm.email,
              password: signupForm.password,
            }),
          });
          const loginData = await loginRes.json();
          if (loginRes.ok && loginData.success) {
            setTimeout(() => {
              handleSuccessRedirect(loginData.user, loginData.token);
            }, 600);
            return;
          }
        } catch {}

        setTimeout(() => {
          setAuthModal((prev) => ({ ...prev, tab: "login" }));
          setMessage({ text: "Please sign in with your new credentials.", type: "success" });
        }, 1000);
      } else {
        setMessage({
          text: data.message || "Registration failed. Please try again.",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Cannot connect to server. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler
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
        setMessage({
          text: `Welcome, ${data.user?.fullname || "User"}!`,
          type: "success",
        });
        setTimeout(() => {
          handleSuccessRedirect(data.user, data.token);
        }, 600);
      } else {
        setMessage({ text: data.message || "Google authentication failed.", type: "error" });
      }
    } catch {
      setMessage({ text: "Error connecting to Google authentication.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage({ text: "Google sign-in was cancelled.", type: "error" });
  };

  return (
    <div className="auth-modal__backdrop" onClick={closeAuthModal}>
      <div
        className="auth-modal__container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal__close-btn"
          onClick={closeAuthModal}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal__header">
          <div className="auth-modal__brand-badge">The Workflow</div>
          <h3 className="auth-modal__title">
            {isLoginTab ? "Welcome to The Workflow" : "Create Your Free Account"}
          </h3>
          <p className="auth-modal__sub">
            {isLoginTab
              ? "Sign in to explore opportunities, view dates & application details."
              : "Join ambitious aspirants tracking government exams & career updates."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-modal__tabs">
          <button
            type="button"
            className={`auth-modal__tab ${isLoginTab ? "auth-modal__tab--active" : ""}`}
            onClick={() => {
              setMessage({ text: "", type: "" });
              setAuthModal((prev) => ({ ...prev, tab: "login" }));
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-modal__tab ${!isLoginTab ? "auth-modal__tab--active" : ""}`}
            onClick={() => {
              setMessage({ text: "", type: "" });
              setAuthModal((prev) => ({ ...prev, tab: "signup" }));
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Alert notification */}
        {message.text && (
          <div className={`auth-modal__alert auth-modal__alert--${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="auth-modal__google-wrap">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text={isLoginTab ? "continue_with" : "signup_with"}
            shape="pill"
            width="100%"
          />
        </div>

        <div className="auth-modal__divider">
          <span>OR WITH EMAIL</span>
        </div>

        {/* ────────── LOGIN FORM ────────── */}
        {isLoginTab ? (
          <form className="auth-modal__form" onSubmit={handleLoginSubmit}>
            <div className="auth-modal__field">
              <label className="auth-modal__label">Email Address</label>
              <input
                type="email"
                name="email"
                className="auth-modal__input"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                autoFocus
              />
            </div>

            <div className="auth-modal__field">
              <label className="auth-modal__label">Password</label>
              <div className="auth-modal__input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth-modal__input"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
                <button
                  type="button"
                  className="auth-modal__eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-modal__submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <span className="auth-modal__btn-content">
                  Sign In <ArrowRight size={17} />
                </span>
              )}
            </button>
          </form>
        ) : (
          /* ────────── SIGNUP FORM ────────── */
          <form className="auth-modal__form" onSubmit={handleSignupSubmit}>
            <div className="auth-modal__field">
              <label className="auth-modal__label">Full Name</label>
              <input
                type="text"
                name="fullname"
                className="auth-modal__input"
                placeholder="e.g. Rahul Sharma"
                value={signupForm.fullname}
                onChange={handleSignupChange}
                required
                autoFocus
              />
            </div>

            <div className="auth-modal__field">
              <label className="auth-modal__label">Email Address</label>
              <input
                type="email"
                name="email"
                className="auth-modal__input"
                placeholder="you@example.com"
                value={signupForm.email}
                onChange={handleSignupChange}
                required
              />
            </div>

            <div className="auth-modal__field">
              <label className="auth-modal__label">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phoneNumber"
                className="auth-modal__input"
                placeholder="+91 9876543210"
                value={signupForm.phoneNumber}
                onChange={handleSignupChange}
              />
            </div>

            <div className="auth-modal__field">
              <label className="auth-modal__label">Password</label>
              <div className="auth-modal__input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth-modal__input"
                  placeholder="At least 6 characters"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  required
                />
                <button
                  type="button"
                  className="auth-modal__eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-modal__field">
              <label className="auth-modal__label">Confirm Password</label>
              <div className="auth-modal__input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="auth-modal__input"
                  placeholder="Re-enter your password"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
                <button
                  type="button"
                  className="auth-modal__eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle password"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-modal__submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <span className="auth-modal__btn-content">
                  Create Free Account <ArrowRight size={17} />
                </span>
              )}
            </button>
          </form>
        )}

        {/* Modal Footer Switch */}
        <div className="auth-modal__footer">
          {isLoginTab ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="auth-modal__switch-btn"
                onClick={() => {
                  setMessage({ text: "", type: "" });
                  setAuthModal((prev) => ({ ...prev, tab: "signup" }));
                }}
              >
                Sign Up for free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-modal__switch-btn"
                onClick={() => {
                  setMessage({ text: "", type: "" });
                  setAuthModal((prev) => ({ ...prev, tab: "login" }));
                }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
