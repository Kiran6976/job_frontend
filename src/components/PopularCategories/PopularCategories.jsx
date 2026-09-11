import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./PopularCategories.css";
import { CATEGORY_HIGHLIGHTS } from "./categoriesData";
import { API_ENDPOINTS } from "../../config/api";

const CATEGORY_STYLES = {
  "government exams": {
    topColor: "#2563eb",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    arrowBg: "#2563eb",
    arrowColor: "#ffffff",
    isPrimary: true,
  },
  "state govt. jobs": {
    topColor: "#f59e0b",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    arrowBg: "#fffbeb",
    arrowColor: "#d97706",
  },
  "teaching jobs": {
    topColor: "#10b981",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    arrowBg: "#f0fdf4",
    arrowColor: "#16a34a",
  },
  "defense jobs": {
    topColor: "#f97316",
    iconBg: "#ffedd5",
    iconColor: "#ea580c",
    arrowBg: "#fff7ed",
    arrowColor: "#ea580c",
  },
  "banking": {
    topColor: "#a855f7",
    iconBg: "#f3e8ff",
    iconColor: "#9333ea",
    arrowBg: "#faf5ff",
    arrowColor: "#9333ea",
  },
  "private jobs": {
    topColor: "#ec4899",
    iconBg: "#fce7f3",
    iconColor: "#db2777",
    arrowBg: "#fdf2f8",
    arrowColor: "#db2777",
  },
  "internships": {
    topColor: "#06b6d4",
    iconBg: "#cffafe",
    iconColor: "#0891b2",
    arrowBg: "#ecfeff",
    arrowColor: "#0891b2",
  },
  "work from home": {
    topColor: "#6366f1",
    iconBg: "#e0e7ff",
    iconColor: "#4f46e5",
    arrowBg: "#eef2ff",
    arrowColor: "#4f46e5",
  },
};

const DEFAULT_DISPLAY_CATEGORIES = [
  {
    id: "govt",
    title: "Government Exams",
    jobs: "8+ Jobs",
    icon: "building",
    topColor: "#2563eb",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    arrowBg: "#2563eb",
    arrowColor: "#ffffff",
    isPrimary: true,
  },
  {
    id: "state",
    title: "State Govt. Jobs",
    jobs: "Explore Opportunities",
    icon: "landmark",
    topColor: "#f59e0b",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    arrowBg: "#fffbeb",
    arrowColor: "#d97706",
  },
  {
    id: "teaching",
    title: "Teaching Jobs",
    jobs: "Explore Opportunities",
    icon: "teaching",
    topColor: "#10b981",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    arrowBg: "#f0fdf4",
    arrowColor: "#16a34a",
  },
  {
    id: "defense",
    title: "Defense Jobs",
    jobs: "Explore Opportunities",
    icon: "defense",
    topColor: "#f97316",
    iconBg: "#ffedd5",
    iconColor: "#ea580c",
    arrowBg: "#fff7ed",
    arrowColor: "#ea580c",
  },
  {
    id: "banking",
    title: "Banking",
    jobs: "Explore Opportunities",
    icon: "building",
    topColor: "#a855f7",
    iconBg: "#f3e8ff",
    iconColor: "#9333ea",
    arrowBg: "#faf5ff",
    arrowColor: "#9333ea",
  },
];

const FALLBACK_PALETTES = [
  { topColor: "#2563eb", iconBg: "#dbeafe", iconColor: "#2563eb", arrowBg: "#2563eb", arrowColor: "#ffffff" },
  { topColor: "#f59e0b", iconBg: "#fef3c7", iconColor: "#d97706", arrowBg: "#fffbeb", arrowColor: "#d97706" },
  { topColor: "#10b981", iconBg: "#dcfce7", iconColor: "#16a34a", arrowBg: "#f0fdf4", arrowColor: "#16a34a" },
  { topColor: "#f97316", iconBg: "#ffedd5", iconColor: "#ea580c", arrowBg: "#fff7ed", arrowColor: "#ea580c" },
  { topColor: "#a855f7", iconBg: "#f3e8ff", iconColor: "#9333ea", arrowBg: "#faf5ff", arrowColor: "#9333ea" },
  { topColor: "#ec4899", iconBg: "#fce7f3", iconColor: "#db2777", arrowBg: "#fdf2f8", arrowColor: "#db2777" },
  { topColor: "#06b6d4", iconBg: "#cffafe", iconColor: "#0891b2", arrowBg: "#ecfeff", arrowColor: "#0891b2" },
];

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [customJobs, setCustomJobs] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

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
      case "banking":
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
            <rect x="5" y="4" width="14" height="17" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="13" y2="13" />
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
      case "wfh":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </svg>
        );
      default:
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

  // Filter out "all" / "All Opportunities"
  const actualCategories = categories.filter(
    (c) => c.slug !== "all" && c.name?.toLowerCase() !== "all opportunities"
  );

  const displayCategories =
    actualCategories.length > 0
      ? actualCategories.map((cat, idx) => {
          const lowerName = String(cat.name || "").toLowerCase().trim();
          const matchedStyle =
            CATEGORY_STYLES[lowerName] ||
            FALLBACK_PALETTES[idx % FALLBACK_PALETTES.length];

          const matchingCount = customJobs.filter(
            (j) => j.category && j.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          let jobsText = "Explore Opportunities";
          let isBadge = false;

          if (cat.count && Number(cat.count) > 0) {
            jobsText = `${Number(cat.count).toLocaleString("en-IN")}+ Jobs`;
            isBadge = true;
          } else if (matchingCount > 0) {
            jobsText = `${matchingCount}+ Jobs`;
            isBadge = true;
          } else if (idx === 0) {
            jobsText = "8+ Jobs";
            isBadge = true;
          }

          return {
            id: cat._id || cat.slug || idx,
            title: cat.name,
            jobs: jobsText,
            isBadge: isBadge,
            icon: cat.icon || "building",
            topColor: matchedStyle.topColor,
            iconBg: matchedStyle.iconBg,
            iconColor: matchedStyle.iconColor,
            arrowBg: matchedStyle.arrowBg,
            arrowColor: matchedStyle.arrowColor,
            linkUrl: `/jobs?category=${encodeURIComponent(cat.name)}`,
          };
        })
      : DEFAULT_DISPLAY_CATEGORIES;

  return (
    <section className="pc">
      {/* Background Video */}
      <div className="pc__video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          defaultMuted
          playsInline
          preload="auto"
          className="pc__bg-video"
          src="/animate_it_1080p_20260911105841.mp4"
        >
          <source src="/animate_it_1080p_20260911105841.mp4" type="video/mp4" />
        </video>
        <div className="pc__video-overlay" />
      </div>

      <div className="pc__container">
        {/* ────────── Header Row ────────── */}
        <div className="pc__header-row">
          {/* Left: Titles */}
          <div className="pc__header-left">
            <div className="pc__pretitle-wrap">
              <span className="pc__pretitle-dash" />
              <span className="pc__pretitle">EXPLORE OPPORTUNITIES</span>
            </div>

            <h2 className="pc__title">
              Find Your Path<br />
              Across{" "}
              <span className="pc__title-highlight">
                Every Sector
                <svg
                  className="pc__title-curl"
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

            <p className="pc__subtitle">
              Explore job opportunities in government, state, teaching, defense, banking and more — all in one place.
            </p>
          </div>

          {/* Right: Handwritten Slogan Doodle */}
          <div className="pc__doodle-wrap">
            <span className="pc__doodle-text">
              Bigger<br />Opportunities<br />Brighter<br />Tomorrows
            </span>
            <svg
              className="pc__doodle-curve"
              viewBox="0 0 130 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 16 C 45 4, 85 4, 124 14" />
            </svg>
          </div>
        </div>

        {/* ────────── Category Cards Grid ────────── */}
        <div className="pc__grid">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.linkUrl || `/jobs?category=${encodeURIComponent(cat.title)}`}
              className="pc__card"
              style={{
                "--card-accent": cat.topColor,
              }}
            >
              {/* Icon Container */}
              <div
                className="pc__card-icon-box"
                style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
              >
                {renderCategoryIcon(cat.icon)}
              </div>

              {/* Card Body: Title, Jobs info & Arrow button */}
              <div className="pc__card-body">
                <div className="pc__card-info">
                  <h4 className="pc__card-title">{cat.title}</h4>
                  {cat.isBadge ? (
                    <span className="pc__card-jobs-badge">{cat.jobs}</span>
                  ) : (
                    <span
                      className="pc__card-jobs-text"
                      style={{ color: cat.iconColor }}
                    >
                      {cat.jobs}
                    </span>
                  )}
                </div>

                <div
                  className="pc__arrow-btn"
                  style={{ backgroundColor: cat.arrowBg, color: cat.arrowColor }}
                  aria-label={`Explore ${cat.title}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    width="15"
                    height="15"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ────────── Bottom Floating Highlights Pill Bar ────────── */}
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
      </div>
    </section>
  );
};

export default PopularCategories;
