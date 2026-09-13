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
  Layers,
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

// Department / Specialization options mapped per stream
const DEPARTMENT_OPTIONS = {
  Engineering: [
    { value: "Any_Engg", label: "Any / All Engineering Branches", sub: "Eligible for all B.Tech / BE opportunities" },
    { value: "CSE_IT", label: "Computer Science & IT (CSE / IT)", sub: "Software, Programming, Data & Networks" },
    { value: "EE", label: "Electrical Engineering (EE / EEE)", sub: "Power Systems, Electrical Machines & Circuits" },
    { value: "ECE", label: "Electronics & Communication (ECE / ETC)", sub: "Signals, VLSI, Embedded & Telecommunication" },
    { value: "ME", label: "Mechanical Engineering (ME)", sub: "Thermal, Design, Production & Automobile" },
    { value: "CE", label: "Civil Engineering (CE)", sub: "Structures, Transportation, Water Resources & Survey" },
    { value: "CHE", label: "Chemical Engineering", sub: "Petrochemicals, Process & Polymers" },
    { value: "AERO", label: "Aerospace / Aeronautical Engineering", sub: "Avionics, Propulsion & Flight Mechanics" },
    { value: "BT", label: "Biotechnology / Biomedical", sub: "Bioinformatics, Genetic & Medical Engineering" },
    { value: "OTHER_ENGG", label: "Other Engineering Branch", sub: "Mining, Metallurgical, Marine, Textile, etc." },
  ],
  Commerce: [
    { value: "General_Comm", label: "General Commerce (B.Com / M.Com)", sub: "Accounting, Business Studies & Taxation" },
    { value: "CA", label: "Chartered Accountancy (CA / Inter CA)", sub: "ICAI certified or pursuing" },
    { value: "CMA", label: "Cost & Management Accounting (CMA / ICWA)", sub: "ICMAI certified" },
    { value: "CS", label: "Company Secretary (CS)", sub: "ICSI certified" },
    { value: "Finance_Analyst", label: "Finance & Investment (CFA / MBA Finance)", sub: "Financial Markets & Banking" },
    { value: "Econ_Stats", label: "Economics & Business Statistics", sub: "Economic analysis & Quantitative methods" },
  ],
  Science: [
    { value: "Physics", label: "Physics / Applied Physics", sub: "Mechanics, Quantum & Astrophysics" },
    { value: "Chemistry", label: "Chemistry / Applied Chemistry", sub: "Organic, Inorganic & Analytical Chemistry" },
    { value: "Maths_Stats", label: "Mathematics & Statistics", sub: "Pure/Applied Maths & Actuarial" },
    { value: "Bio_Life", label: "Biology / Botany / Zoology / Life Sciences", sub: "Genetics, Microbiology & Biochemistry" },
    { value: "Agri_Forest", label: "Agriculture, Forestry & Horticulture", sub: "Agronomy, Soil Science & Plant Breeding" },
    { value: "CS_BSc_BCA", label: "Computer Science (B.Sc CS / BCA / MCA)", sub: "Computing & Information Technology" },
    { value: "Geology_Env", label: "Geology / Earth & Environmental Sciences", sub: "Geophysics, Ecology & Environment" },
  ],
  Arts: [
    { value: "History_Arch", label: "History & Archaeology", sub: "Ancient, Medieval & Modern Indian History" },
    { value: "Pol_IR", label: "Political Science & International Relations", sub: "Governance, Diplomacy & Constitution" },
    { value: "Pub_Ad", label: "Public Administration", sub: "Administrative theory & Public Policy" },
    { value: "Sociology_MSW", label: "Sociology & Social Work (MSW)", sub: "Social welfare & Community development" },
    { value: "Economics_BA", label: "Economics", sub: "Micro/Macro Economics & Public Finance" },
    { value: "Languages", label: "Languages & Literature (English / Hindi / Regional)", sub: "Translation & Linguistics" },
    { value: "Psychology", label: "Psychology & Behavioral Sciences", sub: "Clinical & Applied Psychology" },
    { value: "Media_Journ", label: "Journalism & Mass Communication", sub: "Print, Broadcast & Digital Media" },
  ],
  Law: [
    { value: "General_Law", label: "General Law (LLB 3-Yr / 5-Yr Integrated)", sub: "Civil, Criminal & Constitutional Law" },
    { value: "Corporate_Law", label: "Corporate, Commercial & Tax Law", sub: "Company law, IPR & Arbitration" },
    { value: "LLM_Master", label: "LLM (Master of Laws)", sub: "Specialized Legal Master's" },
    { value: "Advocate_Bar", label: "Practicing Advocate / Bar Council Registered", sub: "Active court practice experience" },
  ],
  Medical: [
    { value: "MBBS", label: "MBBS (Allopathic Medicine & Surgery)", sub: "MCI / NMC registered practitioner" },
    { value: "BDS", label: "BDS (Dental Surgery)", sub: "DCI registered dental surgeon" },
    { value: "AYUSH", label: "AYUSH Medicine (BAMS / BHMS / BUMS)", sub: "Ayurveda, Homeopathy & Unani" },
    { value: "Nursing", label: "Nursing (B.Sc Nursing / GNM / M.Sc Nursing)", sub: "INC registered nurse" },
    { value: "Pharmacy", label: "Pharmacy (B.Pharm / M.Pharm / Pharm.D)", sub: "PCI registered pharmacist" },
    { value: "Physiotherapy", label: "Physiotherapy & Rehabilitation (BPT / MPT)", sub: "Physical therapist" },
    { value: "Allied_MLT", label: "Medical Lab Tech / Allied Health (MLT / Radiology)", sub: "Diagnostics & Imaging" },
  ],
  Management: [
    { value: "General_Mgmt", label: "General Management (BBA / MBA / PGDM)", sub: "Core Business & Administration" },
    { value: "Marketing", label: "Marketing & Sales Management", sub: "Brand, Digital Marketing & Retail" },
    { value: "HR", label: "Human Resources (HR / Personnel Management)", sub: "Talent, Industrial Relations & Labor Law" },
    { value: "Finance_Mgmt", label: "Financial Management", sub: "Corporate Finance, Investment & Banking" },
    { value: "Operations_SCM", label: "Operations & Supply Chain Management", sub: "Logistics, Procurement & Quality" },
    { value: "Analytics_IT", label: "Business Analytics & IT Management", sub: "Data-driven Decision Making & Systems" },
  ],
};

// Custom Elegant Dropdown Component
const CustomDropdown = ({ label, icon, options, value, onChange, placeholder, required = true }) => {
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
        {icon} {label} {required && <span className="el-modal__req">*</span>}
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
  const [stream, setStream] = useState("Engineering");
  const [department, setDepartment] = useState("CSE_IT");
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
        if (stored.department) setDepartment(stored.department);
        setHasExistingProfile(true);
      } else {
        setHasExistingProfile(false);
      }
    }
  }, [isOpen]);

  // When stream changes, automatically set department to the first department of the new stream
  const handleStreamChange = (newStream) => {
    setStream(newStream);
    const availableDepts = DEPARTMENT_OPTIONS[newStream];
    if (availableDepts && availableDepts.length > 0) {
      setDepartment(availableDepts[0].value);
    } else {
      setDepartment("");
    }
  };

  if (!isOpen) return null;

  const ageData = calculateExactAge(dob);
  const selectedCatObj = CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];
  const selectedQualObj = QUALIFICATION_OPTIONS.find((q) => q.value === qualification) || QUALIFICATION_OPTIONS[3];
  const availableDepts = DEPARTMENT_OPTIONS[stream] || [];
  const selectedDeptObj = availableDepts.find((d) => d.value === department) || availableDepts[0];

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
      department: stream !== "Any" ? department : "",
      departmentLabel: stream !== "Any" && selectedDeptObj ? selectedDeptObj.label : "",
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
            <div className={`el-modal__field ${stream === "Any" ? "el-modal__field--full" : ""}`}>
              <CustomDropdown
                label="Field of Study / Stream"
                icon={<Briefcase size={15} />}
                options={STREAM_OPTIONS}
                value={stream}
                onChange={handleStreamChange}
                placeholder="Select Field of Study / Stream"
              />
            </div>

            {/* 6. Contextual Department / Branch Dropdown (shows if Stream is not 'Any') */}
            {stream !== "Any" && availableDepts.length > 0 && (
              <div className="el-modal__field el-modal__field--dept-fade">
                <CustomDropdown
                  label="Department / Branch / Specialization"
                  icon={<Layers size={15} />}
                  options={availableDepts}
                  value={department}
                  onChange={(val) => setDepartment(val)}
                  placeholder="Select Department / Branch"
                />
              </div>
            )}
          </div>

          {/* Quick Summary Card */}
          <div className="el-modal__summary-card">
            <div className="el-modal__summary-left">
              <div className="el-modal__summary-title">Summary of Your Eligibility Profile:</div>
              <div className="el-modal__summary-chips">
                <span className="el-chip">🎂 {ageData ? `${ageData.years} yrs ${ageData.months} mos` : "--"}</span>
                <span className="el-chip">🛡️ {selectedCatObj.label.split("(")[0]}</span>
                <span className="el-chip">🎓 {selectedQualObj.label.split("(")[0]}</span>
                {stream !== "Any" && (
                  <span className="el-chip">
                    🔬 {stream} {selectedDeptObj ? `• ${selectedDeptObj.label.split("(")[0]}` : ""}
                  </span>
                )}
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
