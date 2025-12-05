// // apiConfig.js
// const API_CONFIG = {
//   BASE_URL:
//     import.meta.env.VITE_API_BASE_URL || "https://papaiaapi.onrender.com/api",
//   TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
//   ENDPOINTS: {
//     AUTH: {
//       SIGNIN: "/sign-in",
//       SIGNUP: "/sign-up",
//       SIGNOUT: "/auth/sign-out",
//     },
//     PROFILE: {
//       GET: "/user",
//       UPDATE: "/profile/update",
//     },
//     FARMS: {
//       LIST: "/farms",
//       CREATE: "/farms",
//       UPDATE: "/farms/:id",
//       DELETE: "/farms/:id",
//     },
//     SCANS: {
//       LIST: "/scans",
//       CREATE: "/scans",
//       GET: "/scans/:id",
//     },
//   },
// };

// export function getApiUrl(endpoint) {
//   const baseUrl = API_CONFIG.BASE_URL;
//   if (import.meta.env.PROD && !baseUrl.startsWith("https://")) {
//     console.warn("API base URL should use HTTPS in production");
//   }
//   return `${baseUrl}${endpoint}`;
// }

// export function withTimeout(promise, timeoutMs = API_CONFIG.TIMEOUT) {
//   return Promise.race([
//     promise,
//     new Promise((_, reject) =>
//       setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
//     ),
//   ]);
// }

// // ✅ Default headers WITHOUT cookies
// export function getDefaultHeaders() {
//   const token = localStorage.getItem("token"); // grab JWT
//   return {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}), // attach JWT if present
//   };
// }

// export function handleApiError(error) {
//   if (error.name === "TypeError" && error.message?.includes("fetch")) {
//     return {
//       message: "Network error. Please check your connection.",
//       type: "network",
//     };
//   }
//   if (error.message === "Request timeout") {
//     return { message: "Request timed out. Please try again.", type: "timeout" };
//   }
//   return {
//     message: error.message || "An unexpected error occurred.",
//     type: "unknown",
//   };
// }

// // ✅ API fetch wrapper (JWT from localStorage, no cookies)
// export async function apiFetch(endpoint, options = {}) {
//   const url = getApiUrl(endpoint);
//   const defaultOptions = {
//     method: "GET",
//     headers: getDefaultHeaders(),
//   };
//   const finalOptions = { ...defaultOptions, ...options };

//   try {
//     const response = await withTimeout(fetch(url, finalOptions));

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || "API request failed");
//     }

//     return response.json();
//   } catch (err) {
//     throw handleApiError(err);
//   }
// }

// export default API_CONFIG;
