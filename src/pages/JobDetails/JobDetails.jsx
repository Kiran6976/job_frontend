import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatDate, parseJobDate } from "./jobDetailsHelpers";
import Section1Hero from "./sections/Section1Hero";
import Section2Timeline from "./sections/Section2Timeline";
import Section3Eligibility from "./sections/Section3Eligibility";
import Section4Vacancy from "./sections/Section4Vacancy";
import Section5ExamPattern from "./sections/Section5ExamPattern";
import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    hasDate: false,
    statusText: "Applications close soon",
  });

  useEffect(() => {
    if (job) {
      const savedJobs = JSON.parse(localStorage.getItem("portal_saved_jobs") || "[]");
      const jobId = String(job._id || id);
      setSaved(savedJobs.includes(jobId));
    }
  }, [job, id]);

  const handleToggleSave = () => {
    const savedJobs = JSON.parse(localStorage.getItem("portal_saved_jobs") || "[]");
    const jobId = String(job?._id || id);
    let updated;
    if (saved) {
      updated = savedJobs.filter((item) => item !== jobId);
      setSaved(false);
    } else {
      updated = [...savedJobs, jobId];
      setSaved(true);
    }
    localStorage.setItem("portal_saved_jobs", JSON.stringify(updated));
  };

  useEffect(() => {
    if (!job) return;

    const computeTime = () => {
      const deadlineStr = job.applicationLastDate;
      const parsedDeadline = parseJobDate(deadlineStr);

      if (!parsedDeadline) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: false,
          hasDate: false,
          statusText: "Closing date to be announced",
        });
        return;
      }

      const now = new Date();
      const diff = parsedDeadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          hasDate: true,
          statusText: `Closed on ${formatDate(deadlineStr)}`,
        });
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      let status = "Applications close soon";
      if (days === 0) {
        status = "Hurry! Closes today";
      } else if (days === 1) {
        status = "Hurry! Closes tomorrow";
      } else if (days <= 5) {
        status = `Closing in ${days} days`;
      } else {
        status = `Last date: ${formatDate(deadlineStr)}`;
      }

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        hasDate: true,
        statusText: status,
      });
    };

    computeTime();
    const timer = setInterval(computeTime, 1000);
    return () => clearInterval(timer);
  }, [job]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/v1/job/detail/${id}`);
        const data = await res.json();
        if (res.ok && data.success && data.job) {
          setJob(data.job);
        } else {
          fallbackLocalJob();
        }
      } catch (err) {
        fallbackLocalJob();
      } finally {
        setLoading(false);
      }
    };

    const fallbackLocalJob = () => {
      const localJobs = JSON.parse(localStorage.getItem("portal_custom_jobs") || "[]");
      const found = localJobs.find((j) => String(j._id) === String(id) || String(j.id) === String(id));
      if (found) {
        setJob(found);
      } else {
        setJob({
          _id: id || "upsc-demo",
          title: "UPSC Civil Services (IAS)",
          organization: "Union Public Service Commission",
          category: "Government Exams",
          level: "National Level",
          status: "Apply Soon",
          vacancies: "1056",
          location: "All India",
          selectionStages: "Prelims • Mains • Interview",
          applicationStartDate: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
          applicationLastDate: new Date(Date.now() + 15 * 86400000 + 8 * 3600000 + 21 * 60000 + 34000).toISOString().slice(0, 10),
          notificationDate: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
          examDate: new Date(Date.now() + 75 * 86400000).toISOString().slice(0, 10),
          resultDate: "Tentative",
          slogan: "Serve Lead Bring Change",
          subSlogan: "A Stronger India Needs You",
          bannerUrl: "/UPSC.png",
          logoUrl: "/emblem_india.png",
          aboutOrg:
            "Join the prestigious Civil Services and be a part of nation building. Serve the country and create a meaningful impact through policy making, governance and public welfare.",
          applyUrl: "https://upsconline.nic.in",
          notificationPdfUrl: "https://upsc.gov.in",
          tags: ["Graduate", "All India", "IAS", "IPS", "IFS"],
          educationalQualification: "A Bachelor's Degree from a recognized University or equivalent.",
          ageLimitMin: "21",
          ageLimitMax: "32",
          ageLimitAsOn: "01 Aug 2025",
          nationality: "Must be a citizen of India. Tibetan refugees and certain other categories are also eligible as per rules.",
          ageRelaxation: {
            scSt: "5 years",
            obc: "3 years",
            pwbd: "10 years",
            exServicemen: "As per rules",
          },
          numberAttempts: "General: 6 attempts • OBC: 9 attempts • SC/ST: No limit • (PwBD candidates get additional attempts as per rules)",
          serviceVacancies: [
            { name: "Indian Administrative Service (IAS)", ur: 73, obc: 42, sc: 28, st: 17, total: 160 },
            { name: "Indian Police Service (IPS)", ur: 60, obc: 38, sc: 27, st: 15, total: 140 },
            { name: "Indian Foreign Service (IFS)", ur: 34, obc: 22, sc: 16, st: 8, total: 80 },
            { name: "Indian Revenue Service (IRS)", ur: 55, obc: 36, sc: 24, st: 15, total: 130 },
            { name: "Indian Audit & Accounts Service (IA&AS)", ur: 28, obc: 18, sc: 12, st: 7, total: 65 },
          ],
          otherRequirements: [
            "Must be of good moral character",
            "Meet physical and medical standards (as applicable)",
            "No criminal record",
            "Should not be debarred from any government examination",
          ],
          importantNote:
            "The eligibility criteria mentioned above is a summary. Candidates must read the official notification carefully for complete and accurate details. In case of any discrepancy, the official notification issued by UPSC shall be final.",
        });
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="jd">
        <Navbar />
        <div className="jd__container" style={{ textAlign: "center", padding: "100px 0" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏛️</div>
          <h2>Loading Opportunity Details...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jd">
        <Navbar />
        <div className="jd__container" style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Opportunity Not Found</h2>
          <p>The opportunity you are looking for does not exist or has been removed.</p>
          <Link to="/jobs" style={{ color: "#2563eb", fontWeight: 700 }}>
            &larr; Back to All Opportunities
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const vacanciesCount = job.vacancies ? Number(job.vacancies).toLocaleString("en-IN") : "1,056";

  return (
    <div className="jd">
      <Navbar />

      <div className="jd__container">
        {/* Breadcrumbs Navigation */}
        <nav className="jd__breadcrumbs">
          <Link to="/" className="jd__bc-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </Link>
          <span className="jd__bc-sep">&rsaquo;</span>
          <Link to="/jobs" className="jd__bc-link">
            {job.category || "Government Exams"}
          </Link>
          <span className="jd__bc-sep">&rsaquo;</span>
          <span className="jd__bc-curr">{job.title}</span>
        </nav>

        {/* Section 1: Hero Banner & Quick Actions */}
        <Section1Hero
          job={job}
          timeLeft={timeLeft}
          saved={saved}
          onToggleSave={handleToggleSave}
          vacanciesCount={vacanciesCount}
        />

        {/* Section 2: Important Dates & Application Timeline */}
        <Section2Timeline
          job={job}
          timeLeft={timeLeft}
          saved={saved}
          onToggleSave={handleToggleSave}
          vacanciesCount={vacanciesCount}
        />

        {/* Section 3: Eligibility Criteria & Requirements */}
        <Section3Eligibility job={job} />

        {/* Section 4: Vacancy Details */}
        <Section4Vacancy job={job} />

        {/* Section 5: Exam Pattern & Structure */}
        <Section5ExamPattern job={job} />
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;