import { useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AboutHero from "../../components/AboutHero/AboutHero";
import WhyWeExist from "../../components/WhyWeExist/WhyWeExist";
import OurStory from "../../components/OurStory/OurStory";
import OurValues from "../../components/OurValues/OurValues";
import "./About.css";

const About = () => {
  const purposeRef = useRef(null);
  const storyRef = useRef(null);

  const scrollToPurpose = () => {
    purposeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: "smooth" });
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

        {/* ────────── Our Values Section (Dedicated Component) ────────── */}
        <OurValues />
      </main>

      <Footer />
    </div>
  );
};

export default About;

