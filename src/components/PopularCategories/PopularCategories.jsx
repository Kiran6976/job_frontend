import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PopularCategories.css";
import { CATEGORIES, CATEGORY_HIGHLIGHTS } from "./categoriesData";
import { API_ENDPOINTS } from "../../config/api";

const PALETTES = [
  { iconBg: "#dbeafe", iconColor: "#2563eb", arrowBg: "#2563eb", arrowColor: "#ffffff" },
  { iconBg: "#fef3c7", iconColor: "#d97706", arrowBg: "#fffbeb", arrowColor: "#d97706" },
  { iconBg: "#dcfce7", iconColor: "#16a34a", arrowBg: "#f0fdf4", arrowColor: "#16a34a" },
  { iconBg: "#ffedd5", iconColor: "#ea580c", arrowBg: "#fff7ed", arrowColor: "#ea580c" },
  { iconBg: "#f3e8ff", iconColor: "#9333ea", arrowBg: "#faf5ff", arrowColor: "#9333ea" },
  { iconBg: "#fce7f3", iconColor: "#ec4899", arrowBg: "#fdf2f8", arrowColor: "#ec4899" },
  { iconBg: "#ccfbf1", iconColor: "#0d9488", arrowBg: "#f0fdfa", arrowColor: "#0d9488" },
  { iconBg: "#e0e7ff", iconColor: "#4f46e5", arrowBg: "#eef2ff", arrowColor: "#4f46e5" },
];

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [customJobs, setCustomJobs] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.JOB}/category/all`);
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
          localStorage.setItem("portal_categories", JSON.stringify(data.categories));
        } else {
          const fallback = JSON.parse(localStorage.getItem("portal_categories") || "[]");
          if (fallback.length > 0) setCategories(fallback);
        }
      } catch (err) {
        const fallback = JSON.parse(localStorage.getItem("portal_categories") || "[]");
        if (fallback.length > 0) setCategories(fallback);
      }
    };

    const loadJobs = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.JOB}/all`);
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs)) {
          setCustomJobs(data.jobs);
        }
      } catch (e) {}
    };


    loadCategories();
    loadJobs();
  }, []);
  const renderCategoryIcon = (icon) => {
    if (!icon) return null;
    if (typeof icon === "string" && (/\p{Extended_Pictographic}/u.test(icon) || icon.length <= 2)) {
      return <span style={{ fontSize: "1.35rem", lineHeight: 1 }}>{icon}</span>;
    }

    switch (String(icon).toLowerCase()) {
      case "building":
      case "govt":
      case "commission":
      case "landmark":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="20" y2="21" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <polyline points="12 2 2 10 22 10 12 2" />
            <line x1="6" y1="10" x2="6" y2="21" />
            <line x1="10" y1="10" x2="10" y2="21" />
            <line x1="14" y1="10" x2="14" y2="21" />
            <line x1="18" y1="10" x2="18" y2="21" />
          </svg>
        );
      case "shield":
      case "defense":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "book":
      case "teaching":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case "graduation-cap":
      case "academic":
      case "internships":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        );
      case "briefcase":
      case "corporate":
      case "private":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      case "laptop":
      case "remote":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </svg>
        );
      case "grid":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        );
      case "palette":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 9.5 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.4-.8-.4-1.4 0-.9.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z" />
          </svg>
        );
      case "chart":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        );
      case "megaphone":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 11 18-5v12L3 13v-2z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
        );
      case "users":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "heart":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.67l7.65-7.66.77-.78a5.4 5.4 0 0 0 0-7.65z" />
            <path d="M7 12h2l1-2 2 4 1-2h4" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
    }
  };

  const renderHighlightIcon = (icon) => {
    switch (icon) {
      case "target":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case "star":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case "users":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "shield":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Filter out "all" / "All Opportunities" if present
  const actualCategories = categories.filter(
    (c) => c.slug !== "all" && c.name?.toLowerCase() !== "all opportunities"
  );

  const displayCategories =
    actualCategories.length > 0
      ? actualCategories.map((cat, idx) => {
          const palette = PALETTES[idx % PALETTES.length];
          const matchingCount = customJobs.filter(
            (j) => j.category && j.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          let jobsText = "Explore Opportunities";
          if (cat.count && Number(cat.count) > 0) {
            jobsText = `${Number(cat.count).toLocaleString("en-IN")}+ Jobs`;
          } else if (matchingCount > 0) {
            jobsText = `${matchingCount} Active Opportunity${matchingCount > 1 ? "s" : ""}`;
          }

          return {
            id: cat._id || cat.slug || idx,
            title: cat.name,
            jobs: jobsText,
            icon: cat.icon || "building",
            iconBg: palette.iconBg,
            iconColor: palette.iconColor,
            arrowBg: palette.arrowBg,
            arrowColor: palette.arrowColor,
            highlight: idx === 0,
            linkUrl: `/jobs?category=${encodeURIComponent(cat.name)}`,
          };
        })
      : CATEGORIES;

  return (
    <section className="pc">
      <div className="pc__container">
        {/* ────────── Header ────────── */}
        <div className="pc__header">
          {/* Badge */}
          <div className="pc__badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pc__badge-icon">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Explore by Category</span>
          </div>

          <h2 className="pc__title">
            Popular <span className="pc__title--gradient">Categories</span>
          </h2>

          <p className="pc__subtitle">
            Find the right opportunity based on your skills and interests.<br />
            Explore jobs across top industries and kickstart your dream career.
          </p>

          {/* Handwritten Top-Right Doodle */}
          <div className="pc__doodle-top">
            <span className="pc__doodle-text">
              Explore<br />Opportunities<br />Your Way
            </span>
            <svg className="pc__doodle-arrow" viewBox="0 0 45 45" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 5 C 38 12, 38 28, 25 36 M 25 26 L 24 37 L 34 35" />
            </svg>
          </div>
        </div>

        {/* ────────── Main Section: Cards Grid + Featured Side Banner ────────── */}
        <div className="pc__main-layout">
          {/* Left Grid: Dynamic Category Cards */}
          <div className="pc__grid">
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.linkUrl || `/jobs?category=${encodeURIComponent(cat.title)}`}
                className={`pc__card ${cat.highlight ? "pc__card--highlight" : ""}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Sparkle doodle for highlighted card */}
                {cat.highlight && (
                  <div className="pc__card-sparkle">
                    <span className="pc__sparkle-bar pc__sparkle-bar--1" />
                    <span className="pc__sparkle-bar pc__sparkle-bar--2" />
                    <span className="pc__sparkle-bar pc__sparkle-bar--3" />
                  </div>
                )}

                {/* Icon square */}
                <div
                  className="pc__icon-box"
                  style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
                >
                  {renderCategoryIcon(cat.icon)}
                </div>

                {/* Category info */}
                <div className="pc__card-body">
                  <div className="pc__card-text">
                    <h4 className="pc__card-title">{cat.title}</h4>
                    <span className="pc__card-jobs">{cat.jobs}</span>
                  </div>

                  {/* Arrow Action */}
                  <span
                    className="pc__arrow-btn"
                    style={{ backgroundColor: cat.arrowBg, color: cat.arrowColor }}
                    aria-label={`View ${cat.title} jobs`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Banner: Featured Image with Floating Badges */}
          <div className="pc__side-banner">
            {/* Sparkle doodle top-right */}
            <div className="pc__banner-sparkle">
              <span className="pc__b-sparkle-1" />
              <span className="pc__b-sparkle-2" />
              <span className="pc__b-sparkle-3" />
            </div>

            {/* Floating Top Badge: Grow Your Career */}
            <div className="pc__floating-badge">
              <div className="pc__floating-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" width="18" height="18">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
              </div>
              <div className="pc__floating-text">
                <span className="pc__floating-title">Grow</span>
                <span className="pc__floating-sub">Your Career</span>
              </div>
            </div>

            {/* Banner Image */}
            <div className="pc__banner-img-wrap">
              <img
                src="/Hero_Image.png"
                alt="Job seeker exploring categories"
                className="pc__banner-img"
              />
            </div>

            {/* Floating Bottom Quote */}
            <div className="pc__quote-card">
              <span className="pc__quote-symbol">“</span>
              <p className="pc__quote-text">
                The right category today, a brighter tomorrow.
              </p>
              <svg className="pc__quote-underline" viewBox="0 0 100 12" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round">
                <path d="M2 7 C 25 1, 45 12, 70 6 C 85 2, 95 8, 98 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* ────────── Trust Highlights Banner ────────── */}
        <div className="pc__highlights-banner">
          {CATEGORY_HIGHLIGHTS.map((item, idx) => (
            <div key={item.id} className="pc__hl-item-wrapper">
              <div className="pc__hl-item">
                <div
                  className="pc__hl-icon"
                  style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                >
                  {renderHighlightIcon(item.icon)}
                </div>
                <div className="pc__hl-text">
                  <span className="pc__hl-title">{item.title}</span>
                  <span className="pc__hl-subtitle">{item.subtitle}</span>
                </div>
              </div>
              {idx < CATEGORY_HIGHLIGHTS.length - 1 && <div className="pc__hl-divider" />}
            </div>
          ))}
        </div>

        {/* ────────── Bottom CTA ────────── */}
        <div className="pc__bottom-cta">
          <Link to="/jobs" className="pc__cta-btn">
            View All Opportunities &rarr;
          </Link>
          <div className="pc__cta-subtext-wrap">
            <span className="pc__cta-subtext">
              More options. A brighter future.
            </span>
            <svg className="pc__cta-underline" viewBox="0 0 70 8" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round">
              <path d="M2 5 C 20 2, 40 7, 68 4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
