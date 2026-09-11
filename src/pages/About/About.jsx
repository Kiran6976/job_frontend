import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AboutHero from "../../components/AboutHero/AboutHero";
import WhyWeExist from "../../components/WhyWeExist/WhyWeExist";
import { useAuth } from "../../context/AuthContext";
import "./About.css";

const IMPACT_METRICS = [
  { value: "500,000+", label: "Registered Aspirants", desc: "Trusting our platform daily" },
  { value: "10,000+", label: "Verified Jobs Published", desc: "Across UPSC, SSC, Banking, & State" },
  { value: "28+", label: "States & UTs Covered", desc: "Complete pan-India recruitment reach" },
  { value: "99.8%", label: "Notification Accuracy", desc: "Curated with zero misinformation" },
];

const About = () => {
  const { user, openAuthModal } = useAuth();
  const purposeRef = useRef(null);
  const impactRef = useRef(null);

  const scrollToPurpose = () => {
    purposeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToImpact = () => {
    impactRef.current?.scrollIntoView({ behavior: "smooth" });
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
          onStoryClick={scrollToPurpose}
          onMissionClick={scrollToPurpose}
        />

        {/* ────────── Why We Exist Section (Dedicated Component) ────────── */}
        <div ref={purposeRef}>
          <WhyWeExist />
        </div>

        {/* ────────── Impact Metrics ────────── */}
        <section ref={impactRef} className="about-impact">
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
                  Explore Opportunities <ArrowRight size={17} />
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
