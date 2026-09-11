import React from "react";
import { Users, BookOpen, Star, Sprout, Settings, ArrowRight } from "lucide-react";
import "./OurStory.css";

const STORY_METRICS = [
  {
    icon: <Users size={20} color="#ffffff" />,
    iconBg: "#0284c7",
    value: "500K+",
    label: "Aspirants Supported",
  },
  {
    icon: <BookOpen size={20} color="#0284c7" />,
    iconBg: "#e0f2fe",
    value: "100+",
    label: "Study Resources",
  },
  {
    icon: <Star size={20} color="#2563eb" fill="#2563eb" />,
    iconBg: "#dbeafe",
    value: "4.8/5",
    label: "User Satisfaction",
  },
];

const JOURNEY_STEPS = [
  {
    icon: <Sprout size={22} color="#0284c7" />,
    iconBg: "#e0f2fe",
    title: "A Simple Idea",
    desc: "To simplify the journey for government job aspirants.",
  },
  {
    icon: <Settings size={22} color="#7c3aed" />,
    iconBg: "#ede9fe",
    title: "A Focused Effort",
    desc: "To build a reliable and easy to use platform.",
  },
  {
    icon: <Users size={22} color="#059669" />,
    iconBg: "#d1fae5",
    title: "A Bigger Impact",
    desc: "To empower lakhs of aspirants across India.",
  },
];

const OurStory = () => {
  return (
    <section className="our-story">
      {/* Background Scenic Landscape Artwork */}
      <div className="our-story__bg-wrapper">
        <img
          src="/ChatGPT%20Image%20Sep%2011,%202026,%2008_18_16%20PM.png"
          alt="Our Story Landscape Background"
          className="our-story__bg-img"
        />
        {/* Soft frosted gradient overlay on the left */}
        <div className="our-story__bg-overlay" />
      </div>

      <div className="our-story__container">
        {/* ────────── Left Column Content ────────── */}
        <div className="our-story__left">
          {/* Pre-title */}
          <div className="our-story__pretitle-wrap">
            <span className="our-story__pretitle">OUR STORY</span>
            <span className="our-story__pretitle-dash" />
          </div>

          {/* Main Headline */}
          <h2 className="our-story__heading">
            <span className="our-story__heading-dark">Built by Aspirants,</span><br />
            <span className="our-story__heading-blue">for Aspirants.</span>
          </h2>

          {/* Story Paragraphs */}
          <p className="our-story__p">
            theworkflow was founded with a simple idea — to create a one-stop
            platform where every government job aspirant can find accurate information,
            study resources, and guidance without the hassle.
          </p>
          <p className="our-story__p">
            Having experienced the challenges of navigating multiple websites and
            unreliable sources, we decided to build a better way — a platform that
            is reliable, easy to use, and truly focused on the needs of aspirants.
          </p>

          {/* Metrics Row */}
          <div className="our-story__metrics-row">
            {STORY_METRICS.map((metric, idx) => (
              <div key={idx} className="our-story__metric-item">
                <div
                  className="our-story__metric-icon"
                  style={{ backgroundColor: metric.iconBg }}
                >
                  {metric.icon}
                </div>
                <div className="our-story__metric-info">
                  <span className="our-story__metric-val">{metric.value}</span>
                  <span className="our-story__metric-label">{metric.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Journey Progression Card */}
          <div className="our-story__journey-card">
            {JOURNEY_STEPS.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="our-story__journey-step">
                  <div
                    className="our-story__step-icon-box"
                    style={{ backgroundColor: step.iconBg }}
                  >
                    {step.icon}
                  </div>
                  <div className="our-story__step-info">
                    <h4 className="our-story__step-title">{step.title}</h4>
                    <p className="our-story__step-desc">{step.desc}</p>
                  </div>
                </div>
                {idx < JOURNEY_STEPS.length - 1 && (
                  <ArrowRight size={20} className="our-story__step-arrow" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ────────── Right Doodles & Overlays ────────── */}
        <div className="our-story__right">
          {/* Top-right Cursive Doodle */}
          <div className="our-story__doodle-top">
            <div className="our-story__doodle-content">
              <span className="our-story__doodle-text">
                Same<br />Aspirations<br />A Brighter<br />Tomorrow
              </span>
              <svg
                className="our-story__doodle-curve-top"
                viewBox="0 0 150 26"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.8"
                strokeLinecap="round"
              >
                <path d="M8 20 C 50 4, 105 4, 142 16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom-left Cursive Doodle */}
        <div className="our-story__doodle-bottom-left">
          <span className="our-story__doodle-text-bl">
            From<br />Aspirations<br />to Achievements
          </span>
          <svg
            className="our-story__doodle-curve-bl"
            viewBox="0 0 140 26"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <path d="M6 18 C 45 4, 95 4, 134 18" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
