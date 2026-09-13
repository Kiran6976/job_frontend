import { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  User,
  RotateCcw,
  ChevronDown,
  Check,
  BookOpen,
  Briefcase,
} from "lucide-react";
import {
  getStoredEligibilityProfile,
  saveEligibilityProfile,
  clearEligibilityProfile,
  calculateExactAge,
} from "../../utils/eligibilityHelper";
import "./EligibilityModal.css";

const CATEGORY_OPTIONS = [
  { value: "UR", label: "UR (General / Unreserved)", sub: "Open category", relaxation: 0, tag: "Standard Max Age" },
  { value: "OBC", label: "OBC (Non-Creamy Layer)", sub: "Other Backward Classes", relaxation: 3, tag: "+3 Yrs Relaxation" },
  { value: "SC", label: "SC (Scheduled Castes)", sub: "Scheduled Castes", relaxation: 5, tag: "+5 Yrs Relaxation" },
  { value: "ST", label: "ST (Scheduled Tribes)", sub: "Scheduled Tribes", relaxation: 5, tag: "+5 Yrs Relaxation" },
  { value: "EWS", label: "EWS (Economically Weaker Section)", sub: "Income & Asset criteria", relaxation: 0, tag: "Standard Max Age" },
  { value: "PwBD_GEN", label: "PwBD (General / EWS)", sub: "Benchmark Disabilities", relaxation: 10, tag: "+10 Yrs Relaxation" },
  { value: "PwBD_OBC", label: "PwBD (OBC - NCL)", sub: "Disability + OBC", relaxation: 13, tag: "+13 Yrs Relaxation" },
  { value: "PwBD_SCST", label: "PwBD (SC / ST)", sub: "Disability + SC/ST", relaxation: 15, tag: "+15 Yrs Relaxation" },
  { value: "EX_SERVICEMEN", label: "Ex-Servicemen (Defence)", sub: "Armed Forces Veteran", relaxation: 3, tag: "+3 Yrs Relaxation" },
];

const QUALIFICATION_OPTIONS = [
  { value: "10TH", label: "10th Pass / Matriculation", sub: "Secondary School Certificate (SSC / SSLC)" },
  { value: "12TH", label: "12th Pass / Intermediate (10+2)", sub: "Higher Secondary (Science / Commerce / Arts)" },
  { value: "DIPLOMA", label: "Diploma / Polytechnic", sub: "3-Year Technical / Vocational Diploma" },
  { value: "GRADUATE", label: "Graduate / Bachelor's Degree", sub: "B.Tech, BE, B.Sc, B.Com, BA, BBA, BCA, LLB, etc." },
  { value: "POST_GRADUATE", label: "Post Graduate / Master's Degree", sub: "M.Tech, M.Sc, M.Com, MA, MBA, MCA, LLM, etc." },
  { value: "PHD", label: "Doctorate / Ph.D.", sub: "Doctor of Philosophy / Research" },
];

const STREAM_OPTIONS = [
  { value: "Any", label: "Any Stream / All Graduates", sub: "General eligibility for all streams" },
  { value: "Engineering", label: "Engineering & Technology", sub: "B.Tech, BE, GATE disciplines (CS, Mech, Civil, EE, EC)" },
  { value: "Commerce", label: "Commerce, Finance & Accounts", sub: "B.Com, M.Com, CA, CFA, CS, ICWA, Finance" },
  { value: "Science", label: "Science & Mathematics", sub: "B.Sc, M.Sc (Physics, Chemistry, Maths, Bio, Biotech)" },
  { value: "Arts", label: "Arts, Humanities & Social Sciences", sub: "BA, MA (History, Polity, Economics, English, etc.)" },
  { value: "Law", label: "Law & Legal Studies", sub: "LLB, LLM, Bar Council registered" },
  { value: "Medical", label: "Medical, Nursing & Pharmacy", sub: "MBBS, BDS, B.Pharm, Nursing, AYUSH" },
  { value: "Management", label: "Business & Management", sub: "BBA, MBA, PGDM, Marketing, HR, Operations" },
];

// Custom Elegant Dropdown Component
const CustomDropdown = ({ label, icon, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="c-dropdown" ref={dropdownRef}>
      <label className="el-modal__label">
        {icon} {label} <span className="el-modal__req">*</span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        className={`c-dropdown__trigger ${isOpen ? "c-dropdown__trigger--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="c-dropdown__trigger-content">
          <span className="c-dropdown__trigger-title">{selectedOption?.label || placeholder}</span>
          {selectedOption?.tag && (
            <span
              className={`c-dropdown__badge ${
                selectedOption.relaxation > 0 ? "c-dropdown__badge--green" : "c-dropdown__badge--gray"
              }`}
            >
              {selectedOption.tag}
            </span>
          )}
        </div>
        <ChevronDown size={18} className={`c-dropdown__chevron ${isOpen ? "c-dropdown__chevron--rotated" : ""}`} />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="c-dropdown__menu" role="listbox">
          <div className="c-dropdown__list">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  className={`c-dropdown__item ${isSelected ? "c-dropdown__item--selected" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="c-dropdown__item-info">
                    <div className="c-dropdown__item-header">
                      <span className="c-dropdown__item-title">{option.label}</span>
                      {option.tag && (
                        <span
                          className={`c-dropdown__badge ${
                            option.relaxation > 0 ? "c-dropdown__badge--green" : "c-dropdown__badge--gray"
                          }`}
                        >
                          {option.tag}
                        </span>
                      )}
                    </div>
                    {option.sub && <span className="c-dropdown__item-sub">{option.sub}</span>}
                  </div>

                  {isSelected && (
                    <div className="c-dropdown__check">
                      <Check size={16} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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
                Set your details once to instantly see your real-time eligibility &amp; age limits across all exams.
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

            {/* 2. Custom Reservation Category Dropdown */}
            <div className="el-modal__field">
              <CustomDropdown
                label="Reservation Category"
                icon={<ShieldCheck size={15} />}
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(val) => setCategory(val)}
                placeholder="Select Reservation Category"
              />
            </div>

            {/* 3. Gender Toggle */}
            <div className="el-modal__field">
              <label className="el-modal__label">
                <User size={15} /> Gender <span className="el-modal__req">*</span>
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

            {/* 4. Custom Highest Qualification Dropdown */}
            <div className="el-modal__field">
              <CustomDropdown
                label="Highest Educational Qualification"
                icon={<GraduationCap size={15} />}
                options={QUALIFICATION_OPTIONS}
                value={qualification}
                onChange={(val) => setQualification(val)}
                placeholder="Select Educational Qualification"
              />
            </div>

            {/* 5. Custom Stream / Specialization Dropdown */}
            <div className="el-modal__field el-modal__field--full">
              <CustomDropdown
                label="Field of Study / Discipline (Stream)"
                icon={<Briefcase size={15} />}
                options={STREAM_OPTIONS}
                value={stream}
                onChange={(val) => setStream(val)}
                placeholder="Select Field of Study / Stream"
              />
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
