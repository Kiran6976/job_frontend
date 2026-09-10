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
  { icon: "💼", value: "10K+", label: "Job Opportunities" },
  { icon: "🏢", value: "1K+", label: "Trusted Companies" },
  { icon: "👥", value: "50K+", label: "Active Job Seekers" },
  { icon: "⭐", value: "4.8", label: "User Satisfaction" },
];

/* ── Component ── */
const HeroSection = () => {
  return (
    <section className="hero">
      {/* ────────── Main Container ────────── */}
      <div className="hero__container">
        {/* ────────── Left Column ────────── */}
        <div className="hero__left">
          {/* Tagline badge */}
          <span className="hero__badge">
            <span className="hero__badge-dot" />
            Your Next Opportunity Awaits
          </span>

          {/* Headline */}
          <h1 className="hero__heading">
            Find a Job <br />
            <span className="hero__heading--accent">That Fits</span> <br />
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

        {/* ────────── Right Column ────────── */}
        <div className="hero__right">
          <div className="hero__image-wrapper">
            <div className="hero__blob" />
            <img
              src="/Hero_Image.png"
              alt="Professional job seeker"
              className="hero__image"
            />
          </div>
        </div>
      </div>

      {/* ────────── Bottom Scroll Cue ────────── */}
      <div className="hero__scroll-cue">
        <div className="hero__scroll-circle">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="18"
            height="18"
          >
            <path d="m12 5 0 14M5 13l7 7 7-7" />
          </svg>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default HeroSection;
