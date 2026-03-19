import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      const code = error.response?.data?.code;
      if (
        (code === "TRIAL_EXPIRED" || code === "SUBSCRIPTION_REQUIRED") &&
        window.location.pathname !== "/upgrade"
      ) {
        window.location.href = `/upgrade?reason=${code}`;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
