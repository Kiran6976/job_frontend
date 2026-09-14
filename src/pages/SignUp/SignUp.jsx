import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./SignUp.css";
import { API_ENDPOINTS } from "../../config/api";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthData } = useAuth();
  const from = location.state?.from || "/";

  // Step state: "form" (filling details) | "otp" (verifying OTP)
  const [step, setStep] = useState("form");
  const [verificationMethod, setVerificationMethod] = useState("email"); // "email" (phone SMS OTP deferred)

  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  // Inline Phone Verification State
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState({ text: "", type: "" });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Countdown timer for full-page OTP resend
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

  // Countdown timer for inline phone OTP resend
  useEffect(() => {
    let interval = null;
    if (phoneResendTimer > 0) {
      interval = setInterval(() => {
        setPhoneResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phoneResendTimer]);

  // Focus first OTP input on transitioning to OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phoneNumber") {
      setIsPhoneVerified(false);
      setIsVerifyingPhone(false);
      setPhoneOtp("");
      setPhoneMessage({ text: "", type: "" });
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Inline Send Phone OTP
  const handleSendPhoneOtpDirect = async () => {
    const cleanPhone = formData.phoneNumber.replace(/[^\d]/g, "");
    if (cleanPhone.length < 10) {
      setPhoneMessage({ text: "Please enter a valid 10-digit mobile number.", type: "error" });
      return;
    }

    setPhoneLoading(true);
    setPhoneMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_ENDPOINTS.USER}/send-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsVerifyingPhone(true);
        setPhoneResendTimer(60);
        setPhoneMessage({
          text: `SMS OTP sent to ${formData.phoneNumber}.`,
          type: "success",
        });
      } else {
        setPhoneMessage({
          text: data.message || "Failed to send SMS OTP.",
          type: "error",
        });
      }
    } catch {
      setPhoneMessage({
        text: "Cannot reach server to send SMS OTP.",
        type: "error",
      });
    } finally {
      setPhoneLoading(false);
    }
  };

  // Inline Verify Phone OTP
  const handleVerifyPhoneOtpDirect = async () => {
    if (!phoneOtp || phoneOtp.trim().length !== 6) {
      setPhoneMessage({ text: "Please enter the 6-digit OTP received via SMS.", type: "error" });
      return;
    }

    setPhoneLoading(true);
    setPhoneMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_ENDPOINTS.USER}/verify-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          otp: phoneOtp.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsPhoneVerified(true);
        setIsVerifyingPhone(false);
        setPhoneMessage({
          text: "Mobile phone verified successfully! ✓",
          type: "success",
        });
      } else {
        setPhoneMessage({
          text: data.message || "Invalid or expired OTP.",
          type: "error",
        });
      }
    } catch {
      setPhoneMessage({
        text: "Error verifying OTP.",
        type: "error",
      });
    } finally {
      setPhoneLoading(false);
    }
  };

  // Cancel inline phone verification
  const handleCancelPhoneOtpDirect = () => {
    setIsVerifyingPhone(false);
    setPhoneOtp("");
    setPhoneMessage({ text: "", type: "" });
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    // Handle paste of full 6-digit code
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      if (pastedDigits.length > 0) {
        const newOtp = [...otp];
        pastedDigits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        const nextFocusIndex = Math.min(pastedDigits.length, 5);
        otpInputRefs.current[nextFocusIndex]?.focus();
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    // Auto-advance to next box if character was entered
    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Password rules validation
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.password === formData.confirmPassword;

  // Step 1: Submit Details & Request OTP (Phone SMS or Email)
  const handleRequestOtp = async (e, preferredMethod = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.fullname || !formData.email || !formData.password) {
      setMessage({
        text: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (!hasMinLength) {
      setMessage({
        text: "Password must be at least 8 characters.",
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

    // Standard Email OTP verification (phone SMS verification deferred for later)
    const targetMethod = "email";
    setVerificationMethod("email");

    setLoading(true);

    try {
      const endpoint = `${API_ENDPOINTS.USER}/send-otp`;
      const payload = { email: formData.email, fullname: formData.fullname };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep("otp");
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setMessage({
          text: `Verification code sent to ${formData.email}. Please check your inbox.`,
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Failed to send verification code.",
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

  // Switch method between Phone and Email on the fly (kept for later)
  const handleSwitchVerificationMethod = async (newMethod) => {
    if (loading) return;
    await handleRequestOtp(null, newMethod);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const endpoint = `${API_ENDPOINTS.USER}/send-otp`;
      const payload = { email: formData.email, fullname: formData.fullname };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResendTimer(60);
        setMessage({
          text: "A new verification code has been sent to your email.",
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Failed to resend verification code.",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: "Cannot reach server to resend OTP.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const otpCode = otp.join("").trim();
    if (otpCode.length !== 6) {
      setMessage({
        text: "Please enter the complete 6-digit verification code.",
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
        credentials: "include",
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: "jobseeker",
          otp: otpCode,
          verificationMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          text: "Verified & account created successfully! Logging you in...",
          type: "success",
        });

        if (data.token && data.user) {
          setAuthData(data.user, data.token);
        }

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      } else {
        setMessage({
          text: data.message || "Verification failed. Please check the code.",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: "Cannot reach server. Make sure the backend server is running.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler (Popup Flow)
  const handleGoogleSignup = useGoogleLogin({
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
          if (data.token && data.user) {
            setAuthData(data.user, data.token);
          }
          setMessage({ text: "Signed up with Google successfully! Redirecting...", type: "success" });
          setTimeout(() => navigate(from, { replace: true }), 800);
        } else {
          setMessage({ text: data.message || "Google sign-up failed.", type: "error" });
        }
      } catch (err) {
        setMessage({ text: "Error connecting to Google authentication.", type: "error" });
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setMessage({ text: "Google Sign-In was cancelled or could not be completed.", type: "error" });
    },
  });

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
                {step === "otp" ? (
                  <>
                    Verify Your{" "}
                    <span className="su__card-title--gradient">
                      {verificationMethod === "phone" ? "Mobile Phone" : "Email"}
                    </span>
                  </>
                ) : (
                  <>
                    Create Your <span className="su__card-title--gradient">Account</span>
                  </>
                )}
              </h2>
              <p className="su__card-sub">
                {step === "otp"
                  ? verificationMethod === "phone"
                    ? "Enter the 6-digit SMS code sent to your mobile number."
                    : "Enter the 6-digit code sent to your email to activate your account."
                  : "Join JobPortal and take the next step towards a brighter future."}
              </p>
            </div>

            {/* Feedback Alert */}
            {message.text && (
              <div className={`su__alert su__alert--${message.type}`}>
                {message.text}
              </div>
            )}

            {step === "otp" ? (
              /* ────────── STEP 2: OTP VERIFICATION ────────── */
              <form className="su__form su__otp-wrap" onSubmit={handleVerifyAndRegister}>
                <div className="su__otp-header-icon">
                  {verificationMethod === "phone" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </div>

                <div className="su__otp-info">
                  <p className="su__otp-desc">
                    {verificationMethod === "phone"
                      ? "We sent a 6-digit SMS verification code to:"
                      : "We sent a 6-digit verification code to:"}
                  </p>
                  <div className="su__otp-email-badge">
                    <span>
                      {verificationMethod === "phone"
                        ? formData.phoneNumber || formData.email
                        : formData.email}
                    </span>
                    <button
                      type="button"
                      className="su__otp-edit-btn"
                      onClick={() => {
                        setStep("form");
                        setMessage({ text: "", type: "" });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* 6 Digit OTP Inputs */}
                <div className="su__otp-inputs">
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
                      className={`su__otp-digit ${digit ? "su__otp-digit--filled" : ""}`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Resend OTP Row */}
                <div className="su__otp-resend-row">
                  {resendTimer > 0 ? (
                    <span>Resend code in <strong>{resendTimer}s</strong></span>
                  ) : (
                    <>
                      <span>Didn't receive the code?</span>
                      <button
                        type="button"
                        className="su__otp-resend-btn"
                        onClick={handleResendOtp}
                        disabled={loading}
                      >
                        Resend Code
                      </button>
                    </>
                  )}
                </div>

                {/* Switch Verification Method commented out for now
                {formData.phoneNumber && formData.email && (
                  <div style={{ marginTop: "-6px" }}>
                    <button
                      type="button"
                      className="su__otp-edit-btn"
                      style={{ fontSize: "13px" }}
                      onClick={() =>
                        handleSwitchVerificationMethod(
                          verificationMethod === "phone" ? "email" : "phone"
                        )
                      }
                      disabled={loading}
                    >
                      {verificationMethod === "phone"
                        ? "✉️ Send code via Email instead"
                        : "📱 Send code via Phone SMS instead"}
                    </button>
                  </div>
                )}
                */}

                {/* Submit Verification */}
                <button
                  type="submit"
                  className="su__submit-btn"
                  style={{ width: "100%" }}
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading ? "Verifying & Creating Account..." : "Verify & Create Account \u2192"}
                </button>

                {/* Back to Form */}
                <button
                  type="button"
                  className="su__otp-back-link"
                  onClick={() => {
                    setStep("form");
                    setMessage({ text: "", type: "" });
                  }}
                >
                  &larr; Back to registration details
                </button>
              </form>
            ) : (
              /* ────────── STEP 1: REGISTRATION FORM ────────── */
              <form className="su__form" onSubmit={handleRequestOtp}>
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

                  {/* Phone Number with inline Verify button */}
                  <div className="su__field">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label className="su__label">Phone Number</label>
                      {phoneMessage.text && (
                        <span style={{ fontSize: "11px", color: phoneMessage.type === "success" ? "#059669" : "#dc2626", fontWeight: 600 }}>
                          {phoneMessage.text}
                        </span>
                      )}
                    </div>
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

                      {/* Phone verification button commented out for later implementation
                      {isPhoneVerified ? (
                        <span className="su__verified-pill">✓ Verified</span>
                      ) : formData.phoneNumber && formData.phoneNumber.replace(/[^\d]/g, "").length >= 10 ? (
                        <button
                          type="button"
                          className="su__verify-btn"
                          onClick={handleSendPhoneOtpDirect}
                          disabled={phoneLoading}
                        >
                          {phoneLoading ? "Sending..." : isVerifyingPhone ? "Resend" : "Verify"}
                        </button>
                      ) : null}
                      */}
                    </div>

                    {/* Inline Phone OTP Drawer commented out for later implementation
                    {isVerifyingPhone && !isPhoneVerified && (
                      <div className="su__inline-otp-box su__inline-otp-box--blue">
                        <p className="su__inline-otp-msg">
                          Enter the 6-digit SMS OTP sent to <strong>{formData.phoneNumber}</strong>:
                        </p>
                        <div className="su__inline-otp-row">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="••••••"
                            className="su__inline-otp-input"
                            value={phoneOtp}
                            onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="su__inline-otp-submit"
                            onClick={handleVerifyPhoneOtpDirect}
                            disabled={phoneLoading || phoneOtp.length !== 6}
                          >
                            {phoneLoading ? "Verifying..." : "Verify OTP"}
                          </button>
                        </div>
                        <div className="su__inline-otp-footer">
                          {phoneResendTimer > 0 ? (
                            <span>Resend in {phoneResendTimer}s</span>
                          ) : (
                            <button
                              type="button"
                              className="su__inline-otp-resend"
                              onClick={handleSendPhoneOtpDirect}
                              disabled={phoneLoading}
                            >
                              Resend SMS OTP
                            </button>
                          )}
                          <button
                            type="button"
                            className="su__inline-otp-cancel"
                            onClick={handleCancelPhoneOtpDirect}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    */}
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
                  {loading ? "Sending Verification Code..." : "Create Account \u2192"}
                </button>

                {/* Divider */}
                <div className="su__divider">
                  <span>OR SIGN UP WITH</span>
                </div>

                {/* Google Sign-up Button */}
                <button
                  type="button"
                  className="su__google-btn"
                  onClick={() => handleGoogleSignup()}
                  disabled={loading}
                >
                  <svg className="su__google-icon" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </button>

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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;

