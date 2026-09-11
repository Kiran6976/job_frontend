import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AboutHero from "../../components/AboutHero/AboutHero";
import WhyWeExist from "../../components/WhyWeExist/WhyWeExist";
import OurStory from "../../components/OurStory/OurStory";
import { useAuth } from "../../context/AuthContext";
import "./About.css";

const About = () => {
  const { user, openAuthModal } = useAuth();
  const purposeRef = useRef(null);
  const storyRef = useRef(null);

  const scrollToPurpose = () => {
    purposeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: "smooth" });
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
          onMissionClick={scrollToPurpose}
        />

        {/* ────────── Why We Exist Section (Dedicated Component) ────────── */}
        <div ref={purposeRef}>
          <WhyWeExist />
        </div>

        {/* ────────── Our Story Section (Dedicated Component) ────────── */}
        <div ref={storyRef}>
          <OurStory />
        </div>

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
