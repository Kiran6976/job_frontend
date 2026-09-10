import React from "react";
import "./Section1BasicInfo.css";

const Section1BasicInfo = ({
  formData,
  handleChange,
  handleOrgChange,
  handleFeeChange,
  organizations = [],
  categoryOptions = [],
  scopeOptions = [],
  statusOptions = [],
  CustomDropdown,
}) => {
  const fee = formData.applicationFee || {};

  return (
    <div className="ajp__section-container ajp__section-basic-info">
      <div className="ajp__section-header">
        <h3 className="ajp__section-title">
          <span>📌</span> Section 1: Basic Information &amp; Timelines
        </h3>
        <p className="ajp__section-subtitle">
          Primary exam details, dates, organization, and summary figures.
        </p>
      </div>

      {/* Row 1: Title & Organization */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">
            Job / Exam Title <span className="ajp__req">*</span>
          </label>
          <input
            type="text"
            name="title"
            className="ajp__input"
            placeholder="e.g. UPSC Civil Services (IAS) or RRB JE 2026"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">
            Organization / Commission <span className="ajp__req">*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              name="organization"
              list="org-suggestions"
              className="ajp__input"
              placeholder="e.g. Railway Recruitment Board or Union Public Service Commission"
              value={formData.organization}
              onChange={(e) => handleOrgChange(e.target.value)}
              required
            />
            <datalist id="org-suggestions">
              {organizations.map((org) => (
                <option key={org._id || org.name} value={org.name}>
                  {org.code ? `${org.code} (${org.category})` : org.category}
                </option>
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {/* Row 2: Category & Scope Level */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">
            Category <span className="ajp__req">*</span>
          </label>
          <CustomDropdown
            options={categoryOptions}
            value={formData.category}
            onChange={(val) => {
              handleChange({ target: { name: "category", value: val } });
            }}
            placeholder="Select category..."
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Opportunity Scope</label>
          <CustomDropdown
            options={scopeOptions}
            value={formData.level}
            onChange={(val) => {
              handleChange({ target: { name: "level", value: val } });
            }}
            placeholder="Select scope..."
          />
        </div>
      </div>

      {/* Row 3: Status Badge & Vacancies */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">Status Badge</label>
          <CustomDropdown
            options={statusOptions}
            value={formData.status}
            onChange={(val) => {
              handleChange({ target: { name: "status", value: val } });
            }}
            placeholder="Select status..."
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Vacancies Count (Integer)</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="0"
            step="1"
            name="vacancies"
            className="ajp__input ajp__input--no-spinner"
            placeholder="e.g. 1056"
            value={formData.vacancies}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>

      {/* Row 4: Timeline Dates (Notification, Application Start, Last Date) */}
      <div className="ajp__form-row ajp__form-row--3col">
        <div className="ajp__field">
          <label className="ajp__label">Notification Released Date</label>
          <div className="ajp__date-input-wrap">
            <input
              type="date"
              name="notificationDate"
              className="ajp__input ajp__input--date"
              value={formData.notificationDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Application Start Date</label>
          <div className="ajp__date-input-wrap">
            <input
              type="date"
              name="applicationStartDate"
              className="ajp__input ajp__input--date"
              value={formData.applicationStartDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Last Date to Apply</label>
          <div className="ajp__date-input-wrap">
            <input
              type="date"
              name="applicationLastDate"
              className="ajp__input ajp__input--date"
              value={formData.applicationLastDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Row 5: Exam Date & Result Date */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">Exam Date (e.g. Prelims / CBT 1)</label>
          <div className="ajp__date-input-wrap">
            <input
              type="date"
              name="examDate"
              className="ajp__input ajp__input--date"
              value={formData.examDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Result Expected Date (Text or Month)</label>
          <input
            type="text"
            name="resultDate"
            className="ajp__input"
            placeholder="e.g. July 2025 (Tentative)"
            value={formData.resultDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Row 6: Selection Stages & Slogans */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">Selection Stages</label>
          <input
            type="text"
            name="selectionStages"
            className="ajp__input"
            placeholder="e.g. CBT 1 • CBT 2 • Document Verification"
            value={formData.selectionStages}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Hero Slogan &amp; Callout</label>
          <input
            type="text"
            name="slogan"
            className="ajp__input"
            placeholder="e.g. Serve Lead Bring Change"
            value={formData.slogan}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Row 7: Salary & Location */}
      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">Salary / Pay Scale (Optional)</label>
          <input
            type="text"
            name="salary"
            className="ajp__input"
            placeholder="e.g. Pay Level-6 (₹35,400 - ₹1,12,400)"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Location / Posting</label>
          <input
            type="text"
            name="location"
            className="ajp__input"
            placeholder="e.g. All India"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ── Application Fee Sub-Section ── */}
      <div className="ajp__fee-subsection">
        <div className="ajp__fee-subsection__header">
          <span className="ajp__fee-subsection__icon">💰</span>
          <div>
            <h4 className="ajp__fee-subsection__title">Application Fee</h4>
            <p className="ajp__fee-subsection__hint">AI auto-fills from PDF. Edit if needed.</p>
          </div>
        </div>

        {/* Fee Row 1: General & Reserved */}
        <div className="ajp__form-row">
          <div className="ajp__field">
            <label className="ajp__label">
              General / UR Fee
              <span className="ajp__fee-badge ajp__fee-badge--general">₹</span>
            </label>
            <input
              type="text"
              className="ajp__input"
              placeholder="e.g. 500"
              value={fee.general || ""}
              onChange={(e) => handleFeeChange("general", e.target.value)}
            />
          </div>
          <div className="ajp__field">
            <label className="ajp__label">
              SC / ST / PwBD / Female / Ex-SM Fee
              <span className="ajp__fee-badge ajp__fee-badge--reserved">₹</span>
            </label>
            <input
              type="text"
              className="ajp__input"
              placeholder="e.g. 250 or 0 (Nil)"
              value={fee.sc_st_pwd_female_exsm || ""}
              onChange={(e) => handleFeeChange("sc_st_pwd_female_exsm", e.target.value)}
            />
          </div>
        </div>

        {/* Fee Row 2: Payment Mode & Exempted */}
        <div className="ajp__form-row">
          <div className="ajp__field">
            <label className="ajp__label">Payment Mode</label>
            <input
              type="text"
              className="ajp__input"
              placeholder="e.g. Online / SBI Challan / UPI"
              value={fee.paymentMode || ""}
              onChange={(e) => handleFeeChange("paymentMode", e.target.value)}
            />
          </div>
          <div className="ajp__field">
            <label className="ajp__label">Exempted Categories (if any)</label>
            <input
              type="text"
              className="ajp__input"
              placeholder="e.g. 0 (fully exempt for minorities)"
              value={fee.exempted || ""}
              onChange={(e) => handleFeeChange("exempted", e.target.value)}
            />
          </div>
        </div>

        {/* Fee Row 3: Refund Policy (full width) */}
        <div className="ajp__form-row">
          <div className="ajp__field ajp__field--full">
            <label className="ajp__label">Refund Policy</label>
            <input
              type="text"
              className="ajp__input"
              placeholder="e.g. Fee refunded on appearing in 1st Stage CBT"
              value={fee.refundPolicy || ""}
              onChange={(e) => handleFeeChange("refundPolicy", e.target.value)}
            />
          </div>
        </div>

        {/* Fee Row 4: Additional Note (full width) */}
        <div className="ajp__form-row">
          <div className="ajp__field ajp__field--full">
            <label className="ajp__label">Additional Fee Note</label>
            <input
              type="text"
              className="ajp__input"
              placeholder="e.g. Only candidates appearing in CBT-1 are eligible for refund"
              value={fee.note || ""}
              onChange={(e) => handleFeeChange("note", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1BasicInfo;

