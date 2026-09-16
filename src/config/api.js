export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, "")
  : typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ? "https://job-backend-production-11ab.up.railway.app"
  : "http://localhost:8000";

export const API_ENDPOINTS = {
  USER: `${API_BASE_URL}/api/v1/user`,
  JOB: `${API_BASE_URL}/api/v1/job`,
};

