import React from "react";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import "./WhyWeExist.css";

const PURPOSE_CARDS = [
  {
    id: "01",
    title: "Our Mission",
    desc: "Make government job opportunities and exam information simple, accessible, and reliable for every aspirant.",
    btnText: "Opportunities for All",
    icon: <Target size={26} strokeWidth={2.2} />,
    colorClass: "wwe__card--blue",
  },
  {
    id: "02",
    title: "Our Vision",
    desc: "Build India's most trusted platform for discovering opportunities and preparing for a better career.",
    btnText: "A Brighter Tomorrow",
    icon: <Eye size={26} strokeWidth={2.2} />,
    colorClass: "wwe__card--green",
  },
  {
    id: "03",
    title: "Our Values",
    desc: "Accuracy, transparency, accessibility, and an unwavering focus on the aspirant.",
    btnText: "People First",
    icon: <Heart size={26} strokeWidth={2.2} />,
    colorClass: "wwe__card--purple",
  },
];

const WhyWeExist = () => {
  return (
    <section className="wwe">
      {/* Background Graphic with Parliament & Indian Flag */}
      <div className="wwe__bg-wrapper">
        <img
          src="/ChatGPT%20Image%20Sep%2011,%202026,%2008_10_19%20PM.png"
          alt="Why We Exist - The Workflow Background"
          className="wwe__bg-img"
        />
        <div className="wwe__bg-overlay" />
      </div>

      <div className="wwe__container">
        {/* Top Header */}
        <div className="wwe__header">
          <div className="wwe__pretitle-wrap">
            <span className="wwe__dash" />
            <span className="wwe__pretitle">WHY WE EXIST</span>
            <span className="wwe__dash" />
          </div>

          <h2 className="wwe__title">
            More Than a Platform,<br />
            <span className="wwe__title-highlight">
              A Purpose.
              <svg
                className="wwe__title-curl"
                viewBox="0 0 160 14"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.8"
                strokeLinecap="round"
              >
                <path d="M3 10 C 45 4, 110 4, 157 9" />
              </svg>
            </span>
          </h2>

          <p className="wwe__desc">
            Finding the right government job shouldn&apos;t mean searching through dozens
            of websites, scattered notifications, and outdated information. theworkflow
            brings opportunities, exam updates, and preparation resources together
            in one place.
          </p>
        </div>

        {/* Left Handwritten Doodle */}
        <div className="wwe__doodle-left">
          <span className="wwe__doodle-text">
            Better<br />Opportunities<br />Brighter<br />Futures
          </span>
          <svg
            className="wwe__doodle-curve-left"
            viewBox="0 0 130 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M6 16 C 45 4, 85 4, 124 14" />
          </svg>
        </div>

        {/* Right Handwritten Doodle */}
        <div className="wwe__doodle-right">
          <span className="wwe__doodle-text">
            For<br />a Stronger<br />India
          </span>
          <svg
            className="wwe__doodle-curve-right"
            viewBox="0 0 110 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M6 16 C 40 4, 75 4, 104 14" />
          </svg>
        </div>

        {/* Cards Grid */}
        <div className="wwe__grid">
          {PURPOSE_CARDS.map((card) => (
            <div key={card.id} className={`wwe__card ${card.colorClass}`}>
              <div className="wwe__card-top">
                <div className="wwe__icon-box">{card.icon}</div>
                <span className="wwe__card-number">{card.id}</span>
              </div>

              <h3 className="wwe__card-title">{card.title}</h3>
              <p className="wwe__card-desc">{card.desc}</p>

              <div className="wwe__card-btn">
                <span>{card.btnText}</span>
                <ArrowRight size={14} className="wwe__btn-arrow" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Slogan Divider */}
        <div className="wwe__footer-tagline">
          <span className="wwe__footer-dash" />
          <span className="wwe__footer-text">SAME ASPIRATIONS. A BRIGHTER TOMORROW.</span>
          <span className="wwe__footer-dash" />
        </div>
      </div>
    </section>
  );
};

export default WhyWeExist;
