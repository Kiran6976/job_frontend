import React from "react";
import { Link } from "react-router-dom";
import "./ProfileApplications.css";

const ProfileApplications = () => {
  const applications = [
    {
      id: "app-1",
      jobTitle: "Recruitment for Various Posts of Junior Engineer (JE) and DMS (CEN No. 04/2026)",
      organization: "Railway Recruitment Boards (RRBs)",
      appliedDate: "Sep 04, 2026",
      status: "Under Review",
      statusColor: "amber",
      applicationNo: "RRB-2026-98412",
      jobId: "6aa257c3f58e7297a035c32c",
    },
    {
      id: "app-2",
      jobTitle: "Civil Services Examination (CSE - IAS/IPS)",
      organization: "Union Public Service Commission (UPSC)",
      appliedDate: "Aug 28, 2026",
      status: "Application Accepted",
      statusColor: "emerald",
      applicationNo: "UPSC-CSE-55209",
      jobId: "upsc-demo",
    },
    {
      id: "app-3",
      jobTitle: "Probationary Officers (PO) Recruitment 2026",
      organization: "State Bank of India (SBI)",
      appliedDate: "Aug 15, 2026",
      status: "Prelims Scheduled",
      statusColor: "blue",
      applicationNo: "SBI-PO-33129",
      jobId: "sbi-demo",
    },
  ];

  return (
    <div className="pa-container">
      <div className="pa-header">
        <div>
          <h3 className="pa-title">My Job & Exam Applications</h3>
          <p className="pa-subtitle">Track the status of your submitted examination and job applications.</p>
        </div>
        <Link to="/jobs" className="pa-browse-btn">
          Browse More Opportunities &rarr;
        </Link>
      </div>

      <div className="pa-list">
        {applications.map((app) => (
          <div key={app.id} className="pa-card">
            <div className="pa-card__top">
              <div className="pa-card__org">{app.organization}</div>
              <span className={`pa-status pa-status--${app.statusColor}`}>{app.status}</span>
            </div>

            <h4 className="pa-card__title">{app.jobTitle}</h4>

            <div className="pa-card__meta">
              <span><strong>App No:</strong> {app.applicationNo}</span>
              <span>•</span>
              <span><strong>Applied:</strong> {app.appliedDate}</span>
            </div>

            <div className="pa-card__actions">
              <Link to={`/job/${app.jobId}`} className="pa-action-btn pa-action-btn--primary">
                View Opportunity Details &rarr;
              </Link>
              <button type="button" className="pa-action-btn pa-action-btn--secondary">
                Download Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileApplications;
