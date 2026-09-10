import { useState } from "react";
import "./Jobs.css";
import TopOpportunities from "../../components/TopOpportunities/TopOpportunities";
import Footer from "../../components/Footer/Footer";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching jobs for:", searchQuery, location);
  };

  return (
    <div className="job-page">
      {/* ────────── Top Navbar ────────── */}
      <header className="job-page__navbar">
        <a href="/" className="job-page__logo">
          <img src="/Logo.png" alt="JobPortal Logo" />
        </a>

        <nav className="job-page__nav-links">
          <a href="/jobs" className="job-page__nav-link job-page__nav-link--active">
            Find Jobs
          </a>
          <a href="#" className="job-page__nav-link">Companies</a>
          <a href="#" className="job-page__nav-link">Resources</a>
          <a href="#" className="job-page__nav-link">About</a>
        </nav>

        <div className="job-page__nav-auth">
          <a href="/login" className="job-page__login-btn">
            Login
          </a>
          <a href="/signup" className="job-page__signup-btn">
            Sign Up
          </a>
        </div>
      </header>

      {/* ────────── Job Hero Section ────────── */}
      <section className="jh">
        {/* Background Landscape Image */}
        <div className="jh__bg-wrap">
          <img
            src="/Job_Hero.png"
            alt="Scenic winding road to future sunrise city"
            className="jh__bg-img"
          />
          <div className="jh__bg-overlay" />
        </div>

        {/* Hero Container */}
        <div className="jh__container">
          {/* Left Column Content */}
          <div className="jh__content">
            {/* Pill Badge */}
            <div className="jh__badge">
              <span className="jh__badge-icon">🚀</span>
              <span>10,000+ new jobs this week</span>
            </div>

            {/* Main Headline */}
            <h1 className="jh__heading">
              Your Next <br />
              Opportunity <br />
              <span className="jh__heading--blue">Starts</span>{" "}
              <span className="jh__heading--purple">Here</span>
            </h1>

            {/* Subtext */}
            <p className="jh__subtext">
              Explore thousands of jobs from top companies, build your skills,
              and take the next step towards a brighter, more successful future.
            </p>

            {/* Big Search Bar */}
            <form className="jh__search-bar" onSubmit={handleSearch}>
              <div className="jh__search-field jh__search-field--query">
                <svg className="jh__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, skills, or keywords"
                  className="jh__input"
                />
              </div>

              <div className="jh__search-divider" />

              <div className="jh__search-field jh__search-field--location">
                <svg className="jh__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="jh__input"
                />
                <svg className="jh__chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              <button type="submit" className="jh__search-btn">
                Search Jobs &rarr;
              </button>
            </form>

            {/* Stats Row */}
            <div className="jh__stats">
              <div className="jh__stat-item">
                <div className="jh__stat-icon jh__stat-icon--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div>
                  <span className="jh__stat-value">50K+</span>
                  <span className="jh__stat-label">Active Jobs</span>
                </div>
              </div>

              <div className="jh__stat-item">
                <div className="jh__stat-icon jh__stat-icon--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <line x1="8" y1="6" x2="8" y2="6.01" />
                    <line x1="16" y1="6" x2="16" y2="6.01" />
                    <line x1="8" y1="10" x2="8" y2="10.01" />
                    <line x1="16" y1="10" x2="16" y2="10.01" />
                  </svg>
                </div>
                <div>
                  <span className="jh__stat-value">1,200+</span>
                  <span className="jh__stat-label">Hiring Companies</span>
                </div>
              </div>

              <div className="jh__stat-item">
                <div className="jh__stat-icon jh__stat-icon--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <span className="jh__stat-value">2M+</span>
                  <span className="jh__stat-label">Job Seekers</span>
                </div>
              </div>

              <div className="jh__stat-item">
                <div className="jh__stat-icon jh__stat-icon--purple">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <span className="jh__stat-value">95%</span>
                  <span className="jh__stat-label">Success Stories</span>
                </div>
              </div>
            </div>

            {/* Handwritten Left Doodle */}
            <div className="jh__doodle-left">
              <span className="jh__doodle-text">
                Better Careers<br />Brighter Futures
              </span>
              <svg className="jh__doodle-underline" viewBox="0 0 90 20" fill="none" stroke="#818cf8" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 14 C 35 18, 65 6, 85 4" />
              </svg>
            </div>
          </div>

          {/* Right Floating Cards Overlay */}
          <div className="jh__floating-wrap">
            {/* Card 1: Top Companies */}
            <div className="jh__float-card jh__float-card--1">
              <div className="jh__float-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                </svg>
              </div>
              <div className="jh__float-info">
                <h4 className="jh__float-title">Top Companies</h4>
                <p className="jh__float-sub">Work with the best</p>
              </div>
              <span className="jh__float-arrow">&rarr;</span>
            </div>

            {/* Card 2: Flexible Work */}
            <div className="jh__float-card jh__float-card--2">
              <div className="jh__float-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="2" y1="20" x2="22" y2="20" />
                </svg>
              </div>
              <div className="jh__float-info">
                <h4 className="jh__float-title">Flexible Work</h4>
                <p className="jh__float-sub">Remote & Hybrid</p>
              </div>
              <span className="jh__float-arrow">&rarr;</span>
            </div>

            {/* Card 3: Career Growth */}
            <div className="jh__float-card jh__float-card--3">
              <div className="jh__float-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="jh__float-info">
                <h4 className="jh__float-title">Career Growth</h4>
                <p className="jh__float-sub">More Possibilities</p>
              </div>
              <span className="jh__float-arrow">&rarr;</span>
            </div>

            {/* Mountain Handwritten Doodle */}
            <div className="jh__mountain-doodle">
              <span className="jh__mountain-text">
                Same<br />People<br />Bigger<br />Opportunities
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── Section 2: Top Opportunities ────────── */}
      <TopOpportunities />

      {/* ────────── Footer ────────── */}
      <Footer />
    </div>
  );
};

export default Jobs;
