import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ProfileSidebar from "./sections/ProfileSidebar";
import ProfileHeader from "./sections/ProfileHeader";
import ProfileMetrics from "./sections/ProfileMetrics";
import ProfileOverview from "./sections/ProfileOverview";
import ProfileNotifications from "./sections/ProfileNotifications";
import ProfileSavedJobs from "./sections/ProfileSavedJobs";
import ProfileResume from "./sections/ProfileResume";
import EditProfileModal from "./sections/EditProfileModal";
import { API_ENDPOINTS } from "../../config/api";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default fallback user matching the reference design
  const defaultUser = {
    fullname: "Kiran Samanta",
    email: "kiran.samanta@gmail.com",
    phoneNumber: "+91 98765 43210",
    role: "jobseeker",
    createdAt: "2024-09-01T00:00:00.000Z",
    profile: {
      headline: "Aspirant | Always Learning",
      motto: "Discipline today, a better tomorrow.",
      location: "Kolkata, West Bengal",
      bio: "Dedicated civil services aspirant preparing for UPSC and State PSC exams. Passionate about governance, public policy, and administrative leadership. Consistently seeking to expand knowledge across constitutional law, Indian history, and global economics.",
      skills: [
        "General Studies",
        "Quantitative Aptitude",
        "Indian Polity",
        "Economics",
        "Current Affairs",
        "Logical Reasoning",
      ],
      education: [
        {
          degree: "Bachelor of Technology (B.Tech) - Computer Science",
          institution: "Jadavpur University, Kolkata",
          year: "2020 - 2024",
          grade: "8.8 CGPA",
        },
        {
          degree: "Higher Secondary (10+2) - Science",
          institution: "South Point High School",
          year: "2018 - 2020",
          grade: "92.4%",
        },
      ],
      resumeOriginalName: "Kiran_Samanta_Resume.pdf",
      resume: "",
      profilePhoto: "",
      bannerImage: "/Profile_Header.png",
    },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        let currentUser = storedUser ? JSON.parse(storedUser) : defaultUser;

        if (token) {
          try {
            const res = await fetch(`${API_ENDPOINTS.USER}/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            if (res.ok && data.success && data.user) {
              currentUser = data.user;
              localStorage.setItem("user", JSON.stringify(data.user));
            }
          } catch (apiErr) {
            console.warn("Could not fetch remote profile, using local:", apiErr);
          }
        }

        // Merge defaults if profile fields are empty
        if (!currentUser.profile) currentUser.profile = {};
        currentUser.profile.headline = currentUser.profile.headline || defaultUser.profile.headline;
        currentUser.profile.motto = currentUser.profile.motto || defaultUser.profile.motto;
        currentUser.profile.location = currentUser.profile.location || defaultUser.profile.location;
        currentUser.profile.bannerImage = "/Profile_Header.png";

        setUser(currentUser);
      } catch (e) {
        setUser(defaultUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleSaveProfile = async (updatedData) => {
    const token = localStorage.getItem("token");

    const mergedUser = {
      ...user,
      fullname: updatedData.fullname,
      email: updatedData.email,
      phoneNumber: updatedData.phoneNumber,
      profile: {
        ...user.profile,
        headline: updatedData.headline,
        motto: updatedData.motto,
        location: updatedData.location,
        bio: updatedData.bio,
        skills: updatedData.skills,
        education: updatedData.education,
      },
    };

    // Update local state and localStorage immediately
    setUser(mergedUser);
    localStorage.setItem("user", JSON.stringify(mergedUser));

    // Persist to backend if token exists
    if (token) {
      try {
        const res = await fetch(`${API_ENDPOINTS.USER}/profile/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullname: updatedData.fullname,
            email: updatedData.email,
            phoneNumber: updatedData.phoneNumber,
            headline: updatedData.headline,
            motto: updatedData.motto,
            location: updatedData.location,
            bio: updatedData.bio,
            skills: updatedData.skills,
            education: updatedData.education,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Backend profile update failed:", err);
      }
    }
  };

  const handleAvatarUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result;
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          profilePhoto: base64Url,
        },
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          await fetch(`${API_ENDPOINTS.USER}/profile/update`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        } catch (e) {
          console.error("Avatar upload to backend failed:", e);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = async (file) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        resumeOriginalName: file.name,
        resume: URL.createObjectURL(file),
      },
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-page__loading">
          <div className="profile-page__spinner">🏛️</div>
          <h2>Loading Profile...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const counts = {
    applications: 12,
    saved: 8,
    notifications: 3,
    alerts: 5,
    deadlines: 3,
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-page__container">
        {/* Left Sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
          onLogout={handleLogout}
        />

        {/* Right Main Content Area */}
        <main className="profile-page__main">
          {/* Header Banner with Profile_Header.png */}
          <ProfileHeader
            user={user}
            onEditProfile={() => setIsEditModalOpen(true)}
            onAvatarUpload={handleAvatarUpload}
          />

          {/* 4 Summary Metric Cards */}
          <ProfileMetrics
            counts={counts}
            onCardClick={(tabId) => setActiveTab(tabId)}
          />

          {/* Active Tab View */}
          <section className="profile-page__tab-content">
            {activeTab === "profile" && (
              <ProfileOverview
                user={user}
                onEditProfile={() => setIsEditModalOpen(true)}
              />
            )}

            {activeTab === "notifications" && <ProfileNotifications />}

            {activeTab === "alerts" && <ProfileNotifications />}

            {activeTab === "saved" && <ProfileSavedJobs />}

            {activeTab === "resume" && (
              <ProfileResume
                user={user}
                onResumeUpload={handleResumeUpload}
              />
            )}

            {(activeTab === "preferences" || activeTab === "settings") && (
              <div className="profile-settings-card">
                <h3>Account & Examination Settings</h3>
                <p>Configure notification channels, SMS alerts, and personalized category recommendations.</p>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="profile-settings-btn"
                >
                  Edit Profile Information &rarr;
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <Footer />
    </div>
  );
};

export default Profile;
