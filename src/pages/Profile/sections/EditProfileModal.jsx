import React, { useState } from "react";
import "./EditProfileModal.css";

const EditProfileModal = ({ user, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [fullname, setFullname] = useState(user?.fullname || "");
  const [headline, setHeadline] = useState(user?.profile?.headline || "Aspirant | Always Learning");
  const [motto, setMotto] = useState(user?.profile?.motto || "Discipline today, a better tomorrow.");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [location, setLocation] = useState(user?.profile?.location || "Kolkata, West Bengal");
  const [bio, setBio] = useState(
    user?.profile?.bio ||
      "Dedicated civil services aspirant preparing for UPSC and State PSC exams. Passionate about governance, public policy, and administrative leadership."
  );

  const [skills, setSkills] = useState(
    user?.profile?.skills?.length
      ? [...user.profile.skills]
      : ["General Studies", "Quantitative Aptitude", "Indian Polity", "Economics", "Current Affairs"]
  );
  const [newSkill, setNewSkill] = useState("");

  const [education, setEducation] = useState(
    user?.profile?.education?.length
      ? [...user.profile.education]
      : [
          {
            degree: "Bachelor of Technology (B.Tech) - Computer Science",
            institution: "Jadavpur University, Kolkata",
            year: "2020 - 2024",
            grade: "8.8 CGPA",
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      { degree: "", institution: "", year: "", grade: "" },
    ]);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullname.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        fullname,
        headline,
        motto,
        email,
        phoneNumber,
        location,
        bio,
        skills,
        education,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ep-modal-overlay" onClick={onClose}>
      <div className="ep-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="ep-modal-header">
          <div>
            <h2 className="ep-modal-title">Edit & Build Profile</h2>
            <p className="ep-modal-subtitle">Keep your personal and academic credentials up to date.</p>
          </div>
          <button type="button" onClick={onClose} className="ep-close-btn" aria-label="Close modal">
            &times;
          </button>
        </div>

        {error && <div className="ep-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="ep-modal-form">
          <div className="ep-modal-scroll">
            {/* ── Basic Information ── */}
            <h3 className="ep-section-heading">Basic Information</h3>
            <div className="ep-form-grid">
              <div className="ep-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="e.g. Kiran Samanta"
                  required
                />
              </div>

              <div className="ep-form-group">
                <label>Headline / Tagline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Aspirant | Always Learning"
                />
              </div>

              <div className="ep-form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kiran.samanta@gmail.com"
                  required
                />
              </div>

              <div className="ep-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div className="ep-form-group ep-form-group--full">
                <label>Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kolkata, West Bengal"
                />
              </div>

              <div className="ep-form-group ep-form-group--full">
                <label>Motto / Personal Quote</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder='e.g. "Discipline today, a better tomorrow."'
                />
              </div>

              <div className="ep-form-group ep-form-group--full">
                <label>About Me (Bio)</label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell recruiters and exam evaluators about yourself, your background, and your aspirations..."
                />
              </div>
            </div>

            {/* ── Skills Manager ── */}
            <h3 className="ep-section-heading" style={{ marginTop: "24px" }}>
              Key Skills & Examination Subjects
            </h3>
            <div className="ep-skills-input-row">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                placeholder="Type a skill and press Enter (e.g. Indian Polity, Quantitative Aptitude)"
              />
              <button type="button" onClick={handleAddSkill} className="ep-add-skill-btn">
                Add Skill
              </button>
            </div>

            <div className="ep-tags-container">
              {skills.map((s, idx) => (
                <span key={idx} className="ep-tag">
                  {s}
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="ep-tag-remove">
                    &times;
                  </button>
                </span>
              ))}
            </div>

            {/* ── Educational Qualifications ── */}
            <div className="ep-section-header-row" style={{ marginTop: "28px" }}>
              <h3 className="ep-section-heading" style={{ margin: 0 }}>
                Educational Qualifications
              </h3>
              <button type="button" onClick={handleAddEducation} className="ep-add-edu-btn">
                + Add Degree
              </button>
            </div>

            <div className="ep-edu-builder">
              {education.map((edu, index) => (
                <div key={index} className="ep-edu-card">
                  <div className="ep-edu-card-top">
                    <span className="ep-edu-index">Qualification #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="ep-edu-del-btn"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="ep-form-grid">
                    <div className="ep-form-group">
                      <label>Degree / Examination</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        placeholder="e.g. B.Tech in CSE / Higher Secondary"
                      />
                    </div>

                    <div className="ep-form-group">
                      <label>Institution / Board</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        placeholder="e.g. Jadavpur University"
                      />
                    </div>

                    <div className="ep-form-group">
                      <label>Passing Year / Duration</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                        placeholder="e.g. 2020 - 2024"
                      />
                    </div>

                    <div className="ep-form-group">
                      <label>Score / Percentage / CGPA</label>
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) => handleEducationChange(index, "grade", e.target.value)}
                        placeholder="e.g. 8.8 CGPA or 85%"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="ep-modal-footer">
            <button type="button" onClick={onClose} className="ep-btn ep-btn--cancel" disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="ep-btn ep-btn--save" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
