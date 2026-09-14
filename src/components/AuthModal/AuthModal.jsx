import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import "./AuthModal.css";

const AuthModal = () => {
  const { authModal, closeAuthModal, setAuthModal, setAuthData } = useAuth();
  const navigate = useNavigate();

  const isLoginTab = authModal.tab !== "signup";

  const [signupStep, setSignupStep] = useState("form"); // "form" | "otp"
  const [modalVerificationMethod, setModalVerificationMethod] = useState("phone"); // "phone" | "email"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = React.useRef([]);
  const [resendTimer, setResendTimer] = useState(0);

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

  // Reset errors, step and lock body scroll when modal opens or tab changes
  useEffect(() => {
    if (authModal.isOpen) {
      setMessage({ text: "", type: "" });
      setSignupStep("form");
      setOtp(["", "", "", "", "", ""]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [authModal.isOpen, authModal.tab]);

  // Resend OTP countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Focus OTP box when entering OTP step
  useEffect(() => {
    if (signupStep === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [signupStep]);

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

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      if (pastedDigits.length > 0) {
        const newOtp = [...otp];
        pastedDigits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        const nextIndex = Math.min(pastedDigits.length, 5);
        otpInputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
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

  // Step 1: Submit Sign Up Form to Send OTP (Phone SMS or Email)
  const handleSignupRequestOtp = async (e, preferredMethod = null) => {
    if (e && e.preventDefault) e.preventDefault();
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

    const targetMethod = preferredMethod || (signupForm.phoneNumber && signupForm.phoneNumber.trim().length >= 10 ? "phone" : "email");
    setModalVerificationMethod(targetMethod);

    setLoading(true);
    try {
      let endpoint = `${API_ENDPOINTS.USER}/send-phone-otp`;
      let payload = { phoneNumber: signupForm.phoneNumber };

      if (targetMethod === "email") {
        endpoint = `${API_ENDPOINTS.USER}/send-otp`;
        payload = { email: signupForm.email, fullname: signupForm.fullname };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSignupStep("otp");
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setMessage({
          text: targetMethod === "phone"
            ? `SMS code sent to ${signupForm.phoneNumber}.`
            : `Verification code sent to ${signupForm.email}.`,
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Failed to send verification code.",
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

  // Modal Resend OTP
  const handleModalResendOtp = async () => {
    if (resendTimer > 0 || loading) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let endpoint = `${API_ENDPOINTS.USER}/send-phone-otp`;
      let payload = { phoneNumber: signupForm.phoneNumber };

      if (modalVerificationMethod === "email") {
        endpoint = `${API_ENDPOINTS.USER}/send-otp`;
        payload = { email: signupForm.email, fullname: signupForm.fullname };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResendTimer(60);
        setMessage({
          text: modalVerificationMethod === "phone"
            ? "New SMS verification code sent."
            : "A new verification code has been sent.",
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Failed to resend code.",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Cannot reach server to resend code.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Register
  const handleSignupVerifyAndRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const otpCode = otp.join("").trim();
    if (otpCode.length !== 6) {
      setMessage({ text: "Please enter the complete 6-digit code.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.USER}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullname: signupForm.fullname,
          email: signupForm.email,
          phoneNumber: signupForm.phoneNumber,
          password: signupForm.password,
          role: "jobseeker",
          otp: otpCode,
          verificationMethod: modalVerificationMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          text: "Account verified & created successfully!",
          type: "success",
        });
        setTimeout(() => {
          handleSuccessRedirect(data.user, data.token);
        }, 600);
      } else {
        setMessage({
          text: data.message || "Verification failed. Please check the code.",
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

  // Google OAuth Handler (Popup Flow)
  const handleModalGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setMessage({ text: "", type: "" });
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.USER}/google-auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token: tokenResponse.access_token }),
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
    },
    onError: () => {
      setMessage({ text: "Google sign-in was cancelled.", type: "error" });
    },
  });

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
          <button
            type="button"
            className="auth-modal__google-btn"
            onClick={() => handleModalGoogleAuth()}
            disabled={loading}
          >
            <svg className="auth-modal__google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoginTab ? "Continue with Google" : "Sign up with Google"}</span>
          </button>
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
        ) : signupStep === "otp" ? (
          /* ────────── SIGNUP OTP VERIFICATION ────────── */
          <form className="auth-modal__form auth-modal__otp-wrap" onSubmit={handleSignupVerifyAndRegister}>
            <div className="auth-modal__otp-icon">
              {modalVerificationMethod === "phone" ? (
                <EyeOff size={24} style={{ display: "none" }} />
              ) : null}
              <ArrowRight size={24} />
            </div>

            <div className="auth-modal__otp-info">
              <p className="auth-modal__otp-desc">
                {modalVerificationMethod === "phone"
                  ? "We sent a 6-digit SMS verification code to:"
                  : "We sent a 6-digit verification code to:"}
              </p>
              <div className="auth-modal__otp-badge">
                <span>
                  {modalVerificationMethod === "phone"
                    ? signupForm.phoneNumber || signupForm.email
                    : signupForm.email}
                </span>
                <button
                  type="button"
                  className="auth-modal__otp-edit"
                  onClick={() => {
                    setSignupStep("form");
                    setMessage({ text: "", type: "" });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>

            {/* 6 Digit OTP Inputs */}
            <div className="auth-modal__otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className={`auth-modal__otp-digit ${digit ? "auth-modal__otp-digit--filled" : ""}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="auth-modal__otp-resend">
              {resendTimer > 0 ? (
                <span>Resend code in <strong>{resendTimer}s</strong></span>
              ) : (
                <>
                  <span>Didn't get code?</span>
                  <button
                    type="button"
                    className="auth-modal__otp-resend-btn"
                    onClick={handleModalResendOtp}
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                </>
              )}
            </div>

            {/* Switch Verification Method if both phone and email exist */}
            {signupForm.phoneNumber && signupForm.email && (
              <div style={{ marginTop: "-4px" }}>
                <button
                  type="button"
                  className="auth-modal__otp-edit"
                  style={{ fontSize: "12px" }}
                  onClick={() =>
                    handleSignupRequestOtp(
                      null,
                      modalVerificationMethod === "phone" ? "email" : "phone"
                    )
                  }
                  disabled={loading}
                >
                  {modalVerificationMethod === "phone"
                    ? "✉️ Send code via Email instead"
                    : "📱 Send code via Phone SMS instead"}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="auth-modal__submit-btn"
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? (
                "Verifying..."
              ) : (
                <span className="auth-modal__btn-content">
                  Verify & Create Account <ArrowRight size={17} />
                </span>
              )}
            </button>

            <button
              type="button"
              className="auth-modal__otp-back"
              onClick={() => {
                setSignupStep("form");
                setMessage({ text: "", type: "" });
              }}
            >
              &larr; Back to registration details
            </button>
          </form>
        ) : (
          /* ────────── SIGNUP FORM ────────── */
          <form className="auth-modal__form" onSubmit={handleSignupRequestOtp}>
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
                "Sending Verification Code..."
              ) : (
                <span className="auth-modal__btn-content">
                  Continue & Verify Email <ArrowRight size={17} />
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
