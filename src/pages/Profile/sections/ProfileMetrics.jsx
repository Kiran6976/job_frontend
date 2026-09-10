import React from "react";
import "./ProfileMetrics.css";

const ProfileMetrics = ({ counts = {}, onCardClick }) => {
  const cards = [
    {
      id: "applications",
      count: counts.applications || 12,
      title: "Applications",
      subtitle: "Track your progress",
      theme: "blue",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: "saved",
      count: counts.saved || 8,
      title: "Saved Jobs & Exams",
      subtitle: "View your saved items",
      theme: "purple",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      ),
    },
    {
      id: "alerts",
      count: counts.alerts || 5,
      title: "Exam Alerts",
      subtitle: "Stay updated",
      theme: "pink",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      id: "deadlines",
      count: counts.deadlines || 3,
      title: "Upcoming Deadlines",
      subtitle: "Don't miss important dates",
      theme: "green",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="pm-grid">
      {cards.map((c) => (
        <div
          key={c.id}
          className={`pm-card pm-card--${c.theme}`}
          onClick={() => onCardClick && onCardClick(c.id)}
        >
          <div className={`pm-card__icon-box pm-card__icon-box--${c.theme}`}>
            {c.icon}
          </div>

          <div className="pm-card__info">
            <div className="pm-card__count">{c.count}</div>
            <div className="pm-card__title">{c.title}</div>
            <div className="pm-card__subtitle">{c.subtitle}</div>
          </div>

          <div className="pm-card__arrow">&rsaquo;</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileMetrics;
