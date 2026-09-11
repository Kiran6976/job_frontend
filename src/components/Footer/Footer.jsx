import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import {
  EXPLORE_LINKS,
  TOP_EXAMS_LINKS,
  QUICK_LINKS,
  CONTACT_INFO,
  LEGAL_LINKS,
} from "./footerData";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user, openAuthModal } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleLinkClick = (e, href) => {
    if (!user && href && (href.startsWith("/job") || href.startsWith("/find-jobs"))) {
      e.preventDefault();
      openAuthModal(href);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const renderContactIcon = (icon) => {
    switch (icon) {
      case "location":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        );
      case "phone":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        );
      case "mail":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case "clock":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderFooterLink = (link) => {
    if (link.href && link.href.startsWith("/")) {
      return (
        <Link
          to={link.href}
          onClick={(e) => handleLinkClick(e, link.href)}
          className="footer__link"
        >
          {link.label}
        </Link>
      );
    }
    return (
      <a href={link.href || "#"} className="footer__link">
        {link.label}
      </a>
    );
  };

  return (
    <footer className="footer">
      {/* ────────── Pre-Footer Floating CTA Card ────────── */}
      <div className="footer__cta-wrap">
        <div className="footer__cta-card">
          {/* Sparkle doodle top-left */}
          <div className="footer__sparkle">
            <span className="footer__sparkle-ray footer__sparkle-ray--1" />
            <span className="footer__sparkle-ray footer__sparkle-ray--2" />
            <span className="footer__sparkle-ray footer__sparkle-ray--3" />
          </div>

          {/* Left Handwritten Doodle */}
          <div className="footer__doodle-left">
            <span className="footer__doodle-text">
              Better<br />Careers<br />Brighter<br />Futures
            </span>
            <svg className="footer__doodle-arrow-left" viewBox="0 0 35 40" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 4 C 8 16, 8 28, 16 34 C 18 36, 21 34, 18 30 C 15 27, 10 32, 12 36" />
            </svg>
          </div>

          {/* Text Content */}
          <div className="footer__cta-content">
            <h2 className="footer__cta-title">
              Ready to Take the{" "}
              <span className="footer__cta-title--gradient">Next Step?</span>
            </h2>
            <p className="footer__cta-sub">
              Explore thousands of verified government job recruitments, admit cards &amp; exam patterns today.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="footer__cta-actions">
            <Link
              to="/jobs"
              onClick={(e) => handleLinkClick(e, "/jobs")}
              className="footer__btn footer__btn--primary"
            >
              Find a Job &rarr;
            </Link>
          </div>

          {/* Paper Airplane Doodle & Text on Right */}
          <div className="footer__plane-doodle">
            <svg className="footer__plane-path" viewBox="0 0 140 90" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4">
              <path d="M10 80 C 45 85, 80 75, 95 50 C 110 25, 85 5, 60 15 C 40 25, 45 60, 80 65 C 105 70, 120 40, 130 18" />
            </svg>
            <div className="footer__plane-icon-wrap">
              <svg className="footer__plane-svg" viewBox="0 0 24 24" fill="#a855f7">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
            <span className="footer__plane-text">
              Your<br />Dream Career<br />Awaits!
            </span>
          </div>
        </div>
      </div>

      {/* ────────── Main Footer Columns ────────── */}
      <div className="footer__main">
        <div className="footer__container">
          {/* Column 1: Brand & Newsletter */}
          <div className="footer__col footer__col--brand">
            <Link to="/" className="footer__logo-wrap">
              <img
                src="/Logo_Footer.png"
                alt="JobPortal Logo"
                className="footer__logo-img"
              />
            </Link>

            <p className="footer__brand-desc">
              Connecting aspirants with authentic recruitment notifications, official eligibility criteria, syllabus, and exam structures across India.
            </p>

            {/* Social Icons */}
            <div className="footer__socials">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66 1 0 1.74-.74 1.74-1.66 0-.92-.74-1.66-1.74-1.66z" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Twitter / X">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0b0f19" />
                </svg>
              </a>
            </div>

            {/* Newsletter Subscription */}
            <div className="footer__newsletter">
              <h4 className="footer__newsletter-title">Subscribe to Notification Alerts</h4>
              <p className="footer__newsletter-sub">
                Get the latest job notifications, exam dates, and admit card updates delivered to your inbox.
              </p>
              <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
                <div className="footer__input-wrap">
                  <svg className="footer__mail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="footer__input"
                    required
                  />
                </div>
                <button type="submit" className="footer__subscribe-btn">
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Explore by Category */}
          <div className="footer__col">
            <h4 className="footer__col-title">Explore Categories</h4>
            <ul className="footer__links">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  {renderFooterLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Exams & Recruiters */}
          <div className="footer__col">
            <h4 className="footer__col-title">Top Recruiters</h4>
            <ul className="footer__links">
              {TOP_EXAMS_LINKS.map((link) => (
                <li key={link.label}>
                  {renderFooterLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__links">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  {renderFooterLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Us & Real-Time Alert Card */}
          <div className="footer__col footer__col--contact">
            <h4 className="footer__col-title">Contact &amp; Support</h4>
            <ul className="footer__contact-list">
              {CONTACT_INFO.map((item, idx) => (
                <li key={idx} className="footer__contact-item">
                  <span className="footer__contact-icon">
                    {renderContactIcon(item.icon)}
                  </span>
                  <span className="footer__contact-text">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Real-time Alert Callout Card */}
            <div className="footer__alert-card">
              <div className="footer__alert-card-header">
                <span className="footer__alert-pulse" />
                <span className="footer__alert-title">Real-Time Exam Alerts</span>
              </div>
              <p className="footer__alert-desc">
                Central &amp; State government notifications, admit cards and results updated daily.
              </p>
              <Link
                to="/jobs"
                onClick={(e) => handleLinkClick(e, "/jobs")}
                className="footer__alert-link"
              >
                View All Opportunities &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* ────────── Bottom Copyright Bar ────────── */}
        <div className="footer__bottom">
          <div className="footer__bottom-container">
            <span className="footer__copyright">
              &copy; 2026 The Workflow. All rights reserved.
            </span>

            <span className="footer__made-with">
              Made with <span className="footer__heart">❤️</span> for ambitious aspirants.
            </span>

            <div className="footer__legal">
              {LEGAL_LINKS.map((link, idx) => (
                <span key={link.label} className="footer__legal-item">
                  {link.href.startsWith("/") ? (
                    <Link to={link.href} className="footer__legal-link">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="footer__legal-link">
                      {link.label}
                    </a>
                  )}
                  {idx < LEGAL_LINKS.length - 1 && (
                    <span className="footer__legal-divider">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



