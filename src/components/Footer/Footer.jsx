import { useState } from "react";
import "./Footer.css";
import {
  JOB_SEEKER_LINKS,
  EMPLOYER_LINKS,
  QUICK_LINKS,
  CONTACT_INFO,
  LEGAL_LINKS,
} from "./footerData";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
              Join thousands of job seekers and top companies on JobPortal today.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="footer__cta-actions">
            <a href="#" className="footer__btn footer__btn--primary">
              Find a Job &rarr;
            </a>
            <a href="#" className="footer__btn footer__btn--outline">
              Post a Job &rarr;
            </a>
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
            <div className="footer__logo-wrap">
              <img
                src="/Logo_Footer.png"
                alt="JobPortal Logo"
                className="footer__logo-img"
              />
            </div>

            <p className="footer__brand-desc">
              Connecting talent with opportunity. We help people find better jobs
              and companies build amazing teams.
            </p>

            {/* Social Icons */}
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66 1 0 1.74-.74 1.74-1.66 0-.92-.74-1.66-1.74-1.66z" />
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0b0f19" />
                </svg>
              </a>
            </div>

            {/* Newsletter Subscription */}
            <div className="footer__newsletter">
              <h4 className="footer__newsletter-title">Subscribe to our newsletter</h4>
              <p className="footer__newsletter-sub">
                Get the latest job updates, career tips, and more delivered to your inbox.
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
                    placeholder="Enter your email"
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

          {/* Column 2: For Job Seekers */}
          <div className="footer__col">
            <h4 className="footer__col-title">For Job Seekers</h4>
            <ul className="footer__links">
              {JOB_SEEKER_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Employers */}
          <div className="footer__col">
            <h4 className="footer__col-title">For Employers</h4>
            <ul className="footer__links">
              {EMPLOYER_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer__link">
                    {link.label}
                  </a>
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
                  <a href={link.href} className="footer__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Us & Download App */}
          <div className="footer__col footer__col--contact">
            <h4 className="footer__col-title">Contact Us</h4>
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

            {/* App Download */}
            <div className="footer__app">
              <h4 className="footer__app-title">Download Our App</h4>
              <p className="footer__app-sub">Find jobs on the go.</p>
              <div className="footer__app-badges">
                {/* App Store Badge */}
                <a href="#" className="footer__store-badge">
                  <svg className="footer__store-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73.99.08 2.02-.48 2.64-1.23z" />
                  </svg>
                  <div className="footer__store-text">
                    <span className="footer__store-small">Download on the</span>
                    <span className="footer__store-big">App Store</span>
                  </div>
                </a>

                {/* Google Play Badge */}
                <a href="#" className="footer__store-badge">
                  <svg className="footer__store-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a1.994 1.994 0 0 1-.61-1.427V3.241c0-.555.228-1.06.61-1.427zm11.305 11.306l2.368 2.368-12.01 6.84 9.642-9.208zm0-2.24L5.272 1.672l12.01 6.84-2.368 2.368zm1.12 1.12l3.415 1.947c.808.462.808 1.218 0 1.68l-3.415 1.947-2.164-2.164 2.164-2.41z" />
                  </svg>
                  <div className="footer__store-text">
                    <span className="footer__store-small">GET IT ON</span>
                    <span className="footer__store-big">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ────────── Bottom Copyright Bar ────────── */}
        <div className="footer__bottom">
          <div className="footer__bottom-container">
            <span className="footer__copyright">
              &copy; 2026 JobPortal. All rights reserved.
            </span>

            <span className="footer__made-with">
              Made with <span className="footer__heart">❤️</span> for a brighter tomorrow.
            </span>

            <div className="footer__legal">
              {LEGAL_LINKS.map((link, idx) => (
                <span key={link.label} className="footer__legal-item">
                  <a href={link.href} className="footer__legal-link">
                    {link.label}
                  </a>
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


