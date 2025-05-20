// src/utils/fetchWrapper.js
import { toast } from "react-toastify";

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const [resource, config = {}] = args;

  // Add Authorization header if token exists
  const token = localStorage.getItem("authToken");

  const updatedHeaders = Object.fromEntries(
    Object.entries({
      ...(config.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    }).filter(([_, v]) => v !== undefined)
  );

  const newConfig = {
    ...config,
    headers: updatedHeaders,
  };

  try {
    const response = await originalFetch(resource, newConfig);

    if (response.status === 401 || response.status === 403) {
      toast.error("Session expired. Redirecting to login...", { autoClose: 2000 });
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 2000);
    }

    return response;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};
