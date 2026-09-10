export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, "")
  : "http://localhost:8000";

export const API_ENDPOINTS = {
  USER: `${API_BASE_URL}/api/v1/user`,
  JOB: `${API_BASE_URL}/api/v1/job`,
};
