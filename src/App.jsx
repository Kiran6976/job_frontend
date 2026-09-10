import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import FeaturedJobs from "./components/FeaturedJobs/FeaturedJobs";
import PopularCategories from "./components/PopularCategories/PopularCategories";
import Footer from "./components/Footer/Footer";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import Jobs from "./pages/Jobs/Jobs";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import JobDetails from "./pages/JobDetails/JobDetails";

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedJobs />
        <PopularCategories />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/find-jobs" element={<Jobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
