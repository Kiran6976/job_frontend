import { useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AboutHero from "../../components/AboutHero/AboutHero";
import { useAuth } from "../../context/AuthContext";
import "./About.css";

const MISSION_PILLARS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "100% Authentic & Verified",
    desc: "Every job notice, exam syllabus, and admit card update is verified against official government gazettes and commission portals.",
    badge: "Truth First",
    color: "#2563eb",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Instant Real-Time Alerts",
    desc: "Receive immediate updates directly in your inbox the second an application window opens or deadlines approach.",
    badge: "Speed & Reliability",
    color: "#f59e0b",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: "Crystal-Clear Information",
    desc: "We deconstruct complex 80-page notifications into easy-to-read eligibility, age limits, syllabus, and salary breakdowns.",
    badge: "Simplicity",
    color: "#10b981",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Equal Access for Every Aspirant",
    desc: "Bridging the information divide for candidates across Tier-1, Tier-2, Tier-3 cities and remote rural regions of India.",
    badge: "Inclusive",
    color: "#a855f7",
  },
];

const IMPACT_METRICS = [
  { value: "500,000+", label: "Registered Aspirants", desc: "Trusting our platform daily" },
  { value: "10,000+", label: "Verified Jobs Published", desc: "Across UPSC, SSC, Banking, & State" },
  { value: "28+", label: "States & UTs Covered", desc: "Complete pan-India recruitment reach" },
  { value: "99.8%", label: "Notification Accuracy", desc: "Curated with zero misinformation" },
];

const About = () => {
  const { user, openAuthModal } = useAuth();
  const storyRef = useRef(null);
  const missionRef = useRef(null);

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMission = () => {
    missionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExploreJobs = (e) => {
    if (!user) {
      e.preventDefault();
      openAuthModal("/jobs");
    }
  };

  return (
    <div className="about-page">
      <Navbar />

      <main>
        {/* ────────── Hero Section ────────── */}
        <AboutHero
          onStoryClick={scrollToStory}
          onMissionClick={scrollToMission}
        />

        {/* ────────── Our Story Section ────────── */}
        <section ref={storyRef} className="about-story">
          <div className="about-container">
            <div className="about-story__grid">
              <div className="about-story__left">
                <div className="about-badge">OUR STORY &amp; ORIGIN</div>
                <h2 className="about-section-title">
                  Breaking Information Barriers in{" "}
                  <span className="about-gradient-text">Public Recruitment</span>
                </h2>
                <p className="about-story__p">
                  For millions of hardworking young people across India, government and public sector examinations represent more than just employment — they represent financial independence, social prestige, and a transformative stepping stone for entire families.
                </p>
                <p className="about-story__p">
                  Yet, for decades, aspirants have struggled with chaotic notice boards, confusing official PDFs, fake recruitment scams, and missed application deadlines.
                </p>
                <p className="about-story__p">
                  <strong>The Workflow</strong> was built to solve this fundamental problem. We aggregate, parse, verify, and deliver reliable career opportunities in one clean, fast, and structured platform.
                </p>
              </div>

              <div className="about-story__right">
                <div className="about-story__card">
                  <div className="about-story__card-quote">
                    &ldquo;Our vision is simple: No aspirant in India should ever miss their dream career opportunity due to a lack of timely, accurate information.&rdquo;
                  </div>
                  <div className="about-story__card-author">
                    <span className="about-story__author-name">The Workflow Team</span>
                    <span className="about-story__author-title">Democratizing Opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────── Mission & Pillars ────────── */}
        <section ref={missionRef} className="about-mission">
          <div className="about-container">
            <div className="about-section-header">
              <div className="about-badge">CORE PILLARS</div>
              <h2 className="about-section-title">What Drives Our Mission</h2>
              <p className="about-section-sub">
                Built on integrity, transparency, and relentless focus on the student journey.
              </p>
            </div>

            <div className="about-mission__grid">
              {MISSION_PILLARS.map((pillar, idx) => (
                <div key={idx} className="about-mission__card">
                  <div
                    className="about-mission__icon-box"
                    style={{ backgroundColor: `${pillar.color}18`, color: pillar.color }}
                  >
                    {pillar.icon}
                  </div>
                  <span className="about-mission__card-badge">{pillar.badge}</span>
                  <h3 className="about-mission__card-title">{pillar.title}</h3>
                  <p className="about-mission__card-desc">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────── Impact Metrics ────────── */}
        <section className="about-impact">
          <div className="about-container">
            <div className="about-impact__wrapper">
              <div className="about-section-header about-section-header--light">
                <div className="about-badge about-badge--light">OUR IMPACT</div>
                <h2 className="about-section-title about-section-title--white">
                  Empowering Futures at Scale
                </h2>
              </div>

              <div className="about-impact__grid">
                {IMPACT_METRICS.map((metric, idx) => (
                  <div key={idx} className="about-impact__item">
                    <span className="about-impact__value">{metric.value}</span>
                    <h4 className="about-impact__label">{metric.label}</h4>
                    <p className="about-impact__desc">{metric.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ────────── CTA Section ────────── */}
        <section className="about-cta">
          <div className="about-container">
            <div className="about-cta__card">
              <h2 className="about-cta__title">Start Your Career Journey Today</h2>
              <p className="about-cta__sub">
                Explore thousands of verified government jobs, exam syllabi, and cutoff trends tailored to your qualifications.
              </p>
              <div className="about-cta__actions">
                <Link
                  to="/jobs"
                  onClick={handleExploreJobs}
                  className="about-hero__btn about-hero__btn--primary"
                >
                  Explore Opportunities &rarr;
                </Link>
                {!user && (
                  <button
                    type="button"
                    onClick={() => openAuthModal(null, "signup")}
                    className="about-hero__btn about-hero__btn--secondary"
                  >
                    Create Free Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
