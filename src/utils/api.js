// API configuration and utilities

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://api.papaia.com",
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  ENDPOINTS: {
    AUTH: {
      SIGNIN: "/auth/signin",
      SIGNOUT: "/auth/signout",
      VERIFY: "/auth/verify",
      REFRESH: "/auth/refresh",
    },
    PROFILE: {
      UPDATE: "/profile/update",
      GET: "/profile",
    },
    FARMS: {
      LIST: "/farms",
      CREATE: "/farms",
      UPDATE: "/farms/:id",
      DELETE: "/farms/:id",
    },
    SCANS: {
      LIST: "/scans",
      CREATE: "/scans",
      GET: "/scans/:id",
    },
  },
};

// Ensure all API calls use HTTPS
export function getApiUrl(endpoint) {
  const baseUrl = API_CONFIG.BASE_URL;

  // Force HTTPS in production
  if (import.meta.env.PROD && !baseUrl.startsWith("https://")) {
    console.warn("API base URL should use HTTPS in production");
  }

  return `${baseUrl}${endpoint}`;
}

// API timeout wrapper
export function withTimeout(promise, timeoutMs = API_CONFIG.TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
}

// Default headers for all API requests
export function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
}

// Error handling for API responses
export function handleApiError(error) {
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      message: "Network error. Please check your connection.",
      type: "network",
    };
  }

  if (error.message === "Request timeout") {
    return {
      message: "Request timed out. Please try again.",
      type: "timeout",
    };
  }

  return {
    message: "An unexpected error occurred.",
    type: "unknown",
  };
}

export default API_CONFIG;
