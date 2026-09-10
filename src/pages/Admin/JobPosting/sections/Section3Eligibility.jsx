import React, { useState } from "react";
import "./Section3Eligibility.css";

const Section3Eligibility = ({
  formData,
  setFormData,
  handleChange,
  attemptRules,
  setAttemptRules,
  additionalAttemptNote,
  setAdditionalAttemptNote,
  ATTEMPT_PRESETS = [],
  QUICK_ATTEMPT_CATEGORIES = [],
  QUICK_ATTEMPT_VALUES = [],
}) => {
  const [selectedCatInput, setSelectedCatInput] = useState("");
  const [selectedAttemptInput, setSelectedAttemptInput] = useState("");

  const syncAttemptRules = (rules, note) => {
    if (!rules || rules.length === 0) {
      setFormData((prev) => ({
        ...prev,
        numberAttempts: note ? note.trim() : "",
      }));
      return;
    }
    const formatted = rules.map((r) => `${r.category}: ${r.attempts}`).join(" • ");
    const full = note && note.trim() ? `${formatted} • ${note.trim()}` : formatted;
    setFormData((prev) => ({ ...prev, numberAttempts: full }));
  };

  const handleApplyPreset = (preset) => {
    setAttemptRules(preset.rules);
    setAdditionalAttemptNote(preset.note || "");
    syncAttemptRules(preset.rules, preset.note || "");
    setSelectedCatInput("");
    setSelectedAttemptInput("");
  };

  const handleClearAttemptRules = () => {
    setAttemptRules([]);
    setAdditionalAttemptNote("");
    syncAttemptRules([], "");
    setSelectedCatInput("");
    setSelectedAttemptInput("");
  };

  const handleAddOrUpdateAttemptRule = () => {
    if (!selectedCatInput.trim() || !selectedAttemptInput.trim()) return;
    const cat = selectedCatInput.trim();
    const att = selectedAttemptInput.trim();

    const existingIdx = attemptRules.findIndex(
      (r) => r.category.toLowerCase() === cat.toLowerCase()
    );
    let updated;
    if (existingIdx >= 0) {
      updated = [...attemptRules];
      updated[existingIdx] = { category: cat, attempts: att };
    } else {
      updated = [...attemptRules, { category: cat, attempts: att }];
    }
    setAttemptRules(updated);
    syncAttemptRules(updated, additionalAttemptNote);
    setSelectedCatInput("");
    setSelectedAttemptInput("");
  };

  const handleRemoveAttemptRule = (catName) => {
    const updated = attemptRules.filter(
      (r) => r.category.toLowerCase() !== catName.toLowerCase()
    );
    setAttemptRules(updated);
    syncAttemptRules(updated, additionalAttemptNote);
  };

  return (
    <div className="ajp__card ajp__section-eligibility" style={{ padding: "1.25rem", background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(59, 130, 246, 0.25)", marginTop: "0.5rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#93c5fd", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "6px" }}>
        🎓 Section 3: Eligibility Criteria &amp; Requirements
      </h3>
      <p style={{ fontSize: "0.775rem", color: "#94a3b8", marginBottom: "1rem" }}>
        These parameters configure the interactive eligibility cards, age calculator widget, and qualification checklist.
      </p>

      <div className="ajp__form-row">
        <div className="ajp__field">
          <label className="ajp__label">Educational Qualification</label>
          <input
            type="text"
            name="educationalQualification"
            className="ajp__input"
            placeholder="e.g. A Bachelor's Degree in Engineering / Diploma or equivalent."
            value={formData.educationalQualification}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Nationality Requirement</label>
          <input
            type="text"
            name="nationality"
            className="ajp__input"
            placeholder="e.g. Must be a citizen of India."
            value={formData.nationality}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="ajp__form-row ajp__form-row--3col" style={{ marginTop: "0.75rem" }}>
        <div className="ajp__field">
          <label className="ajp__label">Minimum Age (Years)</label>
          <input
            type="number"
            name="ageLimitMin"
            className="ajp__input"
            placeholder="18"
            value={formData.ageLimitMin}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Maximum Age (Years)</label>
          <input
            type="number"
            name="ageLimitMax"
            className="ajp__input"
            placeholder="33"
            value={formData.ageLimitMax}
            onChange={handleChange}
          />
        </div>

        <div className="ajp__field">
          <label className="ajp__label">Age Cut-off Date</label>
          <div className="ajp__date-input-wrap">
            <input
              type="date"
              name="ageLimitAsOn"
              className="ajp__input ajp__input--date"
              value={formData.ageLimitAsOn && formData.ageLimitAsOn.includes("-") ? formData.ageLimitAsOn : ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  ageLimitAsOn: e.target.value,
                }));
              }}
            />
          </div>
        </div>
      </div>

      <div className="ajp__field" style={{ marginTop: "0.75rem" }}>
        <div className="ajp__attempts-header">
          <div>
            <label className="ajp__label" style={{ marginBottom: "2px" }}>
              Number of Attempts Rules
            </label>
            <p className="ajp__attempts-sublabel">
              Quickly configure category-wise attempt rules by clicking presets or categories below.
            </p>
          </div>
        </div>

        <div className="ajp__attempts-builder">
          {/* 1. Quick Presets */}
          <div className="ajp__attempts-presets-row">
            <span className="ajp__attempts-presets-tag">⚡ One-Click Presets:</span>
            <div className="ajp__attempts-presets-buttons">
              {ATTEMPT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="ajp__attempts-preset-btn"
                  onClick={() => handleApplyPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
              <button
                type="button"
                className="ajp__attempts-preset-btn ajp__attempts-preset-btn--clear"
                onClick={handleClearAttemptRules}
                title="Clear all configured attempt rules"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* 2. Quick Click Selector Pills */}
          <div className="ajp__attempts-quick-section">
            <div className="ajp__attempts-quick-row">
              <span className="ajp__attempts-quick-title">Click Category:</span>
              <div className="ajp__attempts-quick-pills">
                {QUICK_ATTEMPT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`ajp__attempts-quick-pill ${
                      selectedCatInput.toLowerCase() === cat.toLowerCase() ? "is-selected" : ""
                    }`}
                    onClick={() => setSelectedCatInput(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="ajp__attempts-quick-row">
              <span className="ajp__attempts-quick-title">Click Attempts:</span>
              <div className="ajp__attempts-quick-pills">
                {QUICK_ATTEMPT_VALUES.map((att) => (
                  <button
                    key={att}
                    type="button"
                    className={`ajp__attempts-quick-pill ${
                      selectedAttemptInput.toLowerCase() === att.toLowerCase() ? "is-selected" : ""
                    }`}
                    onClick={() => setSelectedAttemptInput(att)}
                  >
                    {att}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Add / Edit Rule Input Row */}
          <div className="ajp__attempts-add-grid">
            <div className="ajp__attempts-input-col">
              <span className="ajp__attempts-input-col-label">Category Name</span>
              <input
                type="text"
                className="ajp__input ajp__attempts-input"
                placeholder="e.g. General, OBC, EWS..."
                value={selectedCatInput}
                onChange={(e) => setSelectedCatInput(e.target.value)}
              />
            </div>
            <div className="ajp__attempts-input-col">
              <span className="ajp__attempts-input-col-label">Allowed Attempts</span>
              <input
                type="text"
                className="ajp__input ajp__attempts-input"
                placeholder="e.g. 6 attempts, No limit..."
                value={selectedAttemptInput}
                onChange={(e) => setSelectedAttemptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOrUpdateAttemptRule();
                  }
                }}
              />
            </div>
            <div className="ajp__attempts-btn-col">
              <button
                type="button"
                className="ajp__attempts-add-btn"
                onClick={() => handleAddOrUpdateAttemptRule()}
              >
                + Add / Update Rule
              </button>
            </div>
          </div>

          {/* 4. Active Category Rules List Display */}
          <div className="ajp__attempts-active-section">
            <div className="ajp__attempts-active-header">
              <span className="ajp__attempts-active-title">
                Configured Category Rules ({attemptRules.length})
              </span>
              <span className="ajp__attempts-active-tip">
                (Click a card to edit it, or &times; to remove)
              </span>
            </div>

            {attemptRules.length === 0 ? (
              <div className="ajp__attempts-empty-box">
                No category rules added yet. Click one of the presets or pick a category above to add.
              </div>
            ) : (
              <div className="ajp__attempts-cards-wrap">
                {attemptRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="ajp__attempt-card"
                    onClick={() => {
                      setSelectedCatInput(rule.category);
                      setSelectedAttemptInput(rule.attempts);
                    }}
                  >
                    <span className="ajp__attempt-card-cat">{rule.category}</span>
                    <span className="ajp__attempt-card-divider">:</span>
                    <span className="ajp__attempt-card-val">{rule.attempts}</span>
                    <button
                      type="button"
                      className="ajp__attempt-card-remove"
                      title={`Remove ${rule.category}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAttemptRule(rule.category);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Optional Additional Note / Clause */}
          <div className="ajp__attempts-note-box">
            <label className="ajp__attempts-note-title">
              Additional Attempts Note / PwBD Clause (Optional):
            </label>
            <input
              type="text"
              className="ajp__input ajp__input--sm"
              placeholder="e.g. (PwBD candidates get additional attempts as per rules)"
              value={additionalAttemptNote}
              onChange={(e) => {
                setAdditionalAttemptNote(e.target.value);
                syncAttemptRules(attemptRules, e.target.value);
              }}
            />
          </div>

          {/* 6. Formatted Preview String */}
          <div className="ajp__attempts-summary-box">
            <span className="ajp__attempts-summary-title">Live Preview / Stored Value:</span>
            <div className="ajp__attempts-summary-content">
              {formData.numberAttempts || <em>(Empty - all unlimited)</em>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section3Eligibility;
