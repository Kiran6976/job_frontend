import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "#" },
  { label: "About", href: "#" },
  { label: "For Employers", href: "#" },
];

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* ── Logo ── */}
      <a href="/" className="navbar__logo">
        <img src="/Logo.png" alt="JobPortal Logo" />
      </a>

      {/* ── Navigation Links ── */}
      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="navbar__link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* ── Auth Buttons ── */}
      <div className="navbar__auth">
        <a href="/login" className="navbar__btn navbar__btn--ghost">
          Login
        </a>
        <a href="/signup" className="navbar__btn navbar__btn--primary">
          Sign Up &rarr;
        </a>
      </div>
    </nav>
  );
};

export default Navbar;



