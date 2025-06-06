import axios from "axios";
import { toast } from "react-toastify";

// Create a new axios instance
const axiosInstance = axios.create();

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      toast.error("Session expired. Redirecting to login...", { autoClose: 2000 });
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
