import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  User,
  RotateCcw,
} from "lucide-react";
import {
  getStoredEligibilityProfile,
  saveEligibilityProfile,
  clearEligibilityProfile,
  calculateExactAge,
  CATEGORY_RELAXATION,
} from "../../utils/eligibilityHelper";
import "./EligibilityModal.css";

const CATEGORY_OPTIONS = [
  { value: "UR", label: "UR (General / Unreserved)", relaxation: 0 },
  { value: "OBC", label: "OBC (Non-Creamy Layer)", relaxation: 3 },
  { value: "SC", label: "SC (Scheduled Castes)", relaxation: 5 },
  { value: "ST", label: "ST (Scheduled Tribes)", relaxation: 5 },
  { value: "EWS", label: "EWS (Economically Weaker Section)", relaxation: 0 },
  { value: "PwBD_GEN", label: "PwBD / Divyangjan (General/EWS)", relaxation: 10 },
  { value: "PwBD_OBC", label: "PwBD (OBC - NCL)", relaxation: 13 },
  { value: "PwBD_SCST", label: "PwBD (SC / ST)", relaxation: 15 },
  { value: "EX_SERVICEMEN", label: "Ex-Servicemen (Defence)", relaxation: 3 },
];

const QUALIFICATION_OPTIONS = [
  { value: "10TH", label: "10th Pass / Matriculation" },
  { value: "12TH", label: "12th Pass / Intermediate / 10+2" },
  { value: "DIPLOMA", label: "Diploma / Polytechnic (3-Year)" },
  { value: "GRADUATE", label: "Graduate / Bachelor's Degree (BA, B.Sc, B.Com, B.Tech, etc.)" },
  { value: "POST_GRADUATE", label: "Post Graduate / Master's (MA, M.Sc, M.Com, M.Tech, MBA, etc.)" },
  { value: "PHD", label: "Doctorate / Ph.D." },
];

const STREAM_OPTIONS = [
  { value: "Any", label: "Any Stream / General" },
  { value: "Engineering", label: "Engineering / Technology (B.Tech / BE)" },
  { value: "Commerce", label: "Commerce / Accounting / Finance (B.Com / CA)" },
  { value: "Science", label: "Science (B.Sc / M.Sc / Physics / Chemistry / Maths)" },
  { value: "Arts", label: "Arts / Humanities / Social Sciences" },
  { value: "Law", label: "Law (LLB / LLM)" },
  { value: "Medical", label: "Medical / Nursing / Pharmacy" },
  { value: "Management", label: "Business Management (BBA / MBA)" },
];

const EligibilityModal = ({ isOpen, onClose, onProfileSaved }) => {
  const [dob, setDob] = useState("2001-05-15");
  const [category, setCategory] = useState("UR");
  const [gender, setGender] = useState("Male");
  const [qualification, setQualification] = useState("GRADUATE");
  const [stream, setStream] = useState("Any");
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredEligibilityProfile();
      if (stored) {
        if (stored.dob) setDob(stored.dob);
        if (stored.category) setCategory(stored.category);
        if (stored.gender) setGender(stored.gender);
        if (stored.qualification) setQualification(stored.qualification);
        if (stored.stream) setStream(stored.stream);
        setHasExistingProfile(true);
      } else {
        setHasExistingProfile(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const ageData = calculateExactAge(dob);
  const selectedCatObj = CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];
  const selectedQualObj = QUALIFICATION_OPTIONS.find((q) => q.value === qualification) || QUALIFICATION_OPTIONS[3];

  const handleSave = (e) => {
    e.preventDefault();
    if (!dob) return;

    const profileData = {
      dob,
      category,
      categoryLabel: selectedCatObj.label,
      gender,
      qualification,
      qualificationLabel: selectedQualObj.label,
      stream,
      updatedAt: new Date().toISOString(),
    };

    saveEligibilityProfile(profileData);
    if (onProfileSaved) onProfileSaved(profileData);
    onClose();
  };

  const handleReset = () => {
    clearEligibilityProfile();
    setHasExistingProfile(false);
    if (onProfileSaved) onProfileSaved(null);
    onClose();
  };

  return (
    <div className="el-modal__backdrop" onClick={onClose}>
      <div className="el-modal__card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="el-modal__header">
          <div className="el-modal__header-left">
            <div className="el-modal__icon-badge">
              <Sparkles size={20} className="el-modal__sparkle-icon" />
            </div>
            <div>
              <h2 className="el-modal__title">Instant Eligibility Calculator</h2>
              <p className="el-modal__subtitle">
                Set your details once to instantly see your eligibility & age limits across all exams.
              </p>
            </div>
          </div>
          <button className="el-modal__close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="el-modal__form">
          <div className="el-modal__grid">
            {/* 1. Date of Birth */}
            <div className="el-modal__field">
              <label className="el-modal__label">
                <Calendar size={15} /> Date of Birth (DOB) <span className="el-modal__req">*</span>
              </label>
              <input
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                min="1960-01-01"
                className="el-modal__input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              {ageData && (
                <div className="el-modal__live-age">
                  Current Age: <strong>{ageData.years} yrs, {ageData.months} mos</strong>
                </div>
              )}
            </div>

            {/* 2. Category & Reservation */}
            <div className="el-modal__field">
              <label className="el-modal__label">
                <ShieldCheck size={15} /> Reservation Category <span className="el-modal__req">*</span>
              </label>
              <select
                className="el-modal__select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} {cat.relaxation > 0 ? `(+${cat.relaxation} yrs relaxation)` : ""}
                  </option>
                ))}
              </select>
              <div className="el-modal__live-benefit">
                {selectedCatObj.relaxation > 0 ? (
                  <span className="el-benefit-tag el-benefit-tag--green">
                    ✓ +{selectedCatObj.relaxation} Years Age Relaxation Applicable
                  </span>
                ) : (
                  <span className="el-benefit-tag el-benefit-tag--gray">
                    Standard Unreserved Max Age Limit Applicable
                  </span>
                )}
              </div>
            </div>

            {/* 3. Gender */}
            <div className="el-modal__field">
              <label className="el-modal__label">
                <User size={15} /> Gender
              </label>
              <div className="el-modal__gender-group">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`el-gender-btn ${gender === g ? "el-gender-btn--active" : ""}`}
                    onClick={() => setGender(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Highest Qualification */}
            <div className="el-modal__field">
              <label className="el-modal__label">
                <GraduationCap size={15} /> Highest Educational Qualification <span className="el-modal__req">*</span>
              </label>
              <select
                className="el-modal__select"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              >
                {QUALIFICATION_OPTIONS.map((qual) => (
                  <option key={qual.value} value={qual.value}>
                    {qual.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Stream / Specialization */}
            <div className="el-modal__field el-modal__field--full">
              <label className="el-modal__label">
                Field of Study / Stream (Optional)
              </label>
              <select
                className="el-modal__select"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
              >
                {STREAM_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="el-modal__summary-card">
            <div className="el-modal__summary-left">
              <div className="el-modal__summary-title">Summary of Your Eligibility Profile:</div>
              <div className="el-modal__summary-chips">
                <span className="el-chip">🎂 {ageData ? `${ageData.years} yrs ${ageData.months} mos` : "--"}</span>
                <span className="el-chip">🛡️ {selectedCatObj.label.split("(")[0]}</span>
                <span className="el-chip">🎓 {selectedQualObj.label.split("(")[0]}</span>
                {stream !== "Any" && <span className="el-chip">🔬 {stream}</span>}
              </div>
            </div>
            <div className="el-modal__summary-badge">
              <CheckCircle2 size={16} /> Auto-Evaluates All Cards
            </div>
          </div>

          {/* Action Buttons */}
          <div className="el-modal__actions">
            {hasExistingProfile && (
              <button
                type="button"
                className="el-modal__btn-reset"
                onClick={handleReset}
                title="Remove saved eligibility profile"
              >
                <RotateCcw size={15} /> Clear Profile
              </button>
            )}
            <div className="el-modal__actions-right">
              <button type="button" className="el-modal__btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="el-modal__btn-submit">
                Save &amp; Check All Jobs &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EligibilityModal;
