import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import "./AboutHero.css";

const ABOUT_STATS = [
  { value: "500K+", label: "Aspirants Supported" },
  { value: "10K+", label: "Job & Exam Updates" },
  { value: "100+", label: "Study Resources" },
];

const AboutHero = ({ onStoryClick, onMissionClick }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="about-hero">
      {/* Background Video */}
      <div className="about-hero__video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          defaultMuted
          playsInline
          preload="auto"
          className="about-hero__bg-video"
          src="/Animate_realistic_no_cut_1080p_20260911200545.mp4"
        >
          <source
            src="/Animate_realistic_no_cut_1080p_20260911200545.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft frosted gradient overlay on the left for maximum text readability */}
        <div className="about-hero__gradient-overlay" />
      </div>

      <div className="about-hero__container">
        {/* Left Column: Content & Stats */}
        <div className="about-hero__left">
          {/* Pre-title */}
          <div className="about-hero__pretitle-wrap">
            <span className="about-hero__pretitle">ABOUT US</span>
            <span className="about-hero__pretitle-dash" />
          </div>

          {/* Main Headline */}
          <h1 className="about-hero__heading">
            <span className="about-hero__heading-dark">
              Empowering<br />
              Aspirations,
            </span>{" "}
            <span className="about-hero__heading-blue">
              <br className="about-hero__heading-break" />
              Building Brighter<br />
              Tomorrows.
            </span>
          </h1>

          {/* Subtitle / Paragraph */}
          <p className="about-hero__desc">
            At theworkflow, we believe that the right information can change lives.
            We&apos;re on a mission to make government job opportunities, exam resources,
            and career growth accessible to every aspirant in India.
          </p>

          {/* Action Buttons */}
          <div className="about-hero__actions">
            <button
              type="button"
              onClick={onStoryClick}
              className="about-hero__btn about-hero__btn--primary"
            >
              Our Story <ArrowRight size={17} className="about-hero__arrow" />
            </button>

            <button
              type="button"
              onClick={onMissionClick}
              className="about-hero__btn about-hero__btn--secondary"
            >
              Meet Our Mission
            </button>
          </div>

          {/* Metrics / Stats Row */}
          <div className="about-hero__stats-row">
            {ABOUT_STATS.map((stat, idx) => (
              <div key={idx} className="about-hero__stat-wrapper">
                <div className="about-hero__stat-item">
                  <span className="about-hero__stat-value">{stat.value}</span>
                  <span className="about-hero__stat-label">{stat.label}</span>
                </div>
                {idx < ABOUT_STATS.length - 1 && (
                  <div className="about-hero__stat-divider" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Handwritten Doodle */}
        <div className="about-hero__right">
          <div className="about-hero__doodle-wrap">
            <div className="about-hero__doodle-lines">
              <span className="about-hero__doodle-strikethrough">
                Same Opportunites
                <span className="about-hero__strike-bar" />
              </span>
              <span className="about-hero__doodle-main">Aspirations</span>
              <span className="about-hero__doodle-main">A Brighter</span>
              <span className="about-hero__doodle-main">Tomorrow</span>
            </div>

            {/* Handwritten curved underline flourish */}
            <svg
              className="about-hero__doodle-curve"
              viewBox="0 0 160 30"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.2"
              strokeLinecap="round"
            >
              <path d="M10 22 C 55 6, 115 6, 154 22" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
