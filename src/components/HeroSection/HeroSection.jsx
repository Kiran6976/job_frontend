import {
  Briefcase,
  Building2,
  Users,
  Star,
} from "lucide-react";
import "./HeroSection.css";

/* ── Static data ── */
const POPULAR_SEARCHES = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Remote",
  "Internship",
  "Data Analyst",
];

const STATS = [
  { icon: <Briefcase size={20} color="#2563eb" />, value: "10K+", label: "Job Opportunities" },
  { icon: <Building2 size={20} color="#2563eb" />, value: "1K+", label: "Trusted Companies" },
  { icon: <Users size={20} color="#2563eb" />, value: "50K+", label: "Active Job Seekers" },
  { icon: <Star size={20} color="#f59e0b" fill="#f59e0b" />, value: "4.8", label: "User Satisfaction" },
];

/* ── Component ── */
const HeroSection = () => {
  return (
    <section className="hero">
      {/* Soft gradient overlay for text contrast */}
      <div className="hero__overlay" />
      <div className="hero__bottom-fade" />

      {/* ────────── Main Container ────────── */}
      <div className="hero__container">
        {/* ────────── Left Column ────────── */}
        <div className="hero__left">
          {/* Tagline badge */}
          <span className="hero__badge">
            <span className="hero__badge-dot" />
            Your Next Opportunity Awaits
          </span>

          {/* Headline with custom brush underline */}
          <h1 className="hero__heading">
            Find a Job <br />
            <span className="hero__heading--accent">
              That Fits
              <svg
                className="hero__brush-stroke"
                viewBox="0 0 160 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9C45 3.5 115 3.5 158 8C110 11.5 50 11 2 9Z"
                  fill="url(#heroBrushGrad)"
                />
                <defs>
                  <linearGradient id="heroBrushGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </span> <br />
            Your Future
          </h1>

          {/* Sub-text */}
          <p className="hero__subtext">
            Explore thousands of job opportunities, connect with top companies,
            and take the next step in your career — all in one place.
          </p>

          {/* Search bar */}
          <form className="hero__search" onSubmit={(e) => e.preventDefault()}>
            <div className="hero__search-field hero__search-field--text">
              <svg
                className="hero__search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Job title, skills, or company"
                className="hero__input"
              />
            </div>

            <div className="hero__search-field hero__search-field--location">
              <svg
                className="hero__search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <input
                type="text"
                placeholder="Location"
                className="hero__input"
              />
              <svg
                className="hero__chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <button type="submit" className="hero__search-btn">
              Search Jobs &rarr;
            </button>
          </form>

          {/* Popular searches */}
          <div className="hero__popular">
            <span className="hero__popular-label">Popular Searches:</span>
            {POPULAR_SEARCHES.map((tag) => (
              <button key={tag} className="hero__tag">
                {tag}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="hero__stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <span className="hero__stat-icon">{stat.icon}</span>
                <div>
                  <p className="hero__stat-value">{stat.value}</p>
                  <p className="hero__stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ────────── Right Column: Cursive Text in Scenic Sky ────────── */}
        <div className="hero__right">
          <div className="hero__callout">
            <span className="hero__callout-line hero__callout-line--1">Better</span>
            <span className="hero__callout-line hero__callout-line--2">Careers</span>
            <span className="hero__callout-line hero__callout-line--3">Brighter</span>
            <span className="hero__callout-line hero__callout-line--4">Tomorrows</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
