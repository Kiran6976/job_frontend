import React from "react";
import { ShieldCheck, Users, Handshake, Star, FileText, GraduationCap, Heart } from "lucide-react";
import "./OurValues.css";

const VALUE_CARDS = [
  {
    id: "accuracy",
    title: "Accuracy",
    desc: "We ensure verified and up-to-date information, so you never miss an opportunity.",
    icon: <ShieldCheck size={26} className="ov__icon ov__icon--blue" strokeWidth={2.4} />,
    iconBg: "#eff6ff",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    desc: "We make government job information and resources simple, easy to find, and available to everyone.",
    icon: <Users size={26} className="ov__icon ov__icon--emerald" strokeWidth={2.4} />,
    iconBg: "#ecfdf5",
  },
  {
    id: "transparency",
    title: "Transparency",
    desc: "We believe in clear, honest, and reliable information — no hidden agendas, no misinformation.",
    icon: <Handshake size={26} className="ov__icon ov__icon--amber" strokeWidth={2.4} />,
    iconBg: "#fffbeb",
  },
  {
    id: "aspirant-first",
    title: "Aspirant First",
    desc: "Every decision we make is driven by what's best for you — the aspirant.",
    icon: <Star size={26} className="ov__icon ov__icon--purple" fill="currentColor" strokeWidth={2} />,
    iconBg: "#f5f3ff",
  },
];

const STATS = [
  {
    icon: <Users size={20} color="#2563eb" />,
    iconBg: "#eff6ff",
    val: "500K+",
    label: "Aspirants Supported",
  },
  {
    icon: <FileText size={20} color="#059669" />,
    iconBg: "#ecfdf5",
    val: "10K+",
    label: "Latest Job Updates",
  },
  {
    icon: <GraduationCap size={20} color="#7c3aed" />,
    iconBg: "#f5f3ff",
    val: "100+",
    label: "Study Resources",
  },
  {
    icon: <Heart size={20} color="#e11d48" fill="#e11d48" />,
    iconBg: "#fff1f2",
    val: "4.8/5",
    label: "User Satisfaction",
  },
];

const OurValues = () => {
  return (
    <section className="ov-section">
      {/* Background Image Container */}
      <div className="ov-bg-wrap">
        <img
          src="/ChatGPT%20Image%20Sep%2011,%202026,%2010_33_11%20PM.png"
          alt="Scenic Landscape Background"
          className="ov-bg-img"
        />
        <div className="ov-bg-overlay" />
      </div>

      <div className="ov-container">
        <div className="ov-main-grid">
          {/* Left Column: Heading, Description & Quote */}
          <div className="ov-left-col">
            <div className="ov-badge">
              <span className="ov-badge-text">OUR VALUES</span>
              <span className="ov-badge-line" />
            </div>

            <h2 className="ov-title">
              What Drives <br />
              <span className="ov-title-highlight">Us Forward.</span>
            </h2>

            <p className="ov-desc">
              We believe that every aspirant deserves equal access to opportunities,
              accurate information, and the right guidance. These core values shape
              everything we do at theworkflow.
            </p>

            <div className="ov-quote-card">
              <p className="ov-quote-text">
                &ldquo;A more informed India builds a brighter tomorrow.&rdquo;
              </p>
              <span className="ov-quote-author">&mdash; Our Belief</span>
            </div>
          </div>

          {/* Right Column: Doodle & 2x2 Value Cards */}
          <div className="ov-right-col">
            <div className="ov-doodle-container">
              <div className="ov-doodle-text">
                <span>Same Aspirations</span>
                <span className="ov-doodle-sub">A Brighter Tomorrow</span>
              </div>
              <svg
                className="ov-doodle-curve"
                viewBox="0 0 160 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 14C45 3 115 3 156 12"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="ov-cards-grid">
              {VALUE_CARDS.map((card) => (
                <div key={card.id} className="ov-card">
                  <div
                    className="ov-card-icon-box"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="ov-card-title">{card.title}</h3>
                  <p className="ov-card-desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Floating Stats Pill Bar */}
        <div className="ov-stats-bar">
          {STATS.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="ov-stat-item">
                <div
                  className="ov-stat-icon-wrap"
                  style={{ backgroundColor: item.iconBg }}
                >
                  {item.icon}
                </div>
                <div className="ov-stat-meta">
                  <span className="ov-stat-number">{item.val}</span>
                  <span className="ov-stat-label">{item.label}</span>
                </div>
              </div>
              {idx < STATS.length - 1 && <div className="ov-stat-sep" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
