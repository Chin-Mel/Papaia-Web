// // Helper to sanitize input
// export function sanitizeInput(input) {
//   if (typeof input !== "string") return "";
//   return input.trim();
// }

// // Secure API call function using localStorage JWT (no cookies)
// export async function secureApiCall(url, options = {}) {
//   // 🔑 Grab token from localStorage
//   const token = localStorage.getItem("token");

//   const defaultOptions = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}), // attach token if available
//     },
//   };

//   const finalOptions = {
//     ...defaultOptions,
//     ...options,
//     headers: {
//       ...defaultOptions.headers,
//       ...options.headers,
//     },
//   };

//   try {
//     const response = await fetch(url, finalOptions);

//     if (!response.ok) {
//       if (response.status === 401) {
//         localStorage.removeItem("token"); // 🔥 clear bad token
//         throw new Error("Authentication required");
//       } else if (response.status === 403) {
//         throw new Error("Access denied");
//       } else if (response.status >= 500) {
//         throw new Error("Server error occurred");
//       } else {
//         throw new Error(`Request failed with status ${response.status}`);
//       }
//     }

//     return response; // so caller can still call .json()
//   } catch (error) {
//     console.error("API call failed:", error);
//     throw error;
//   }
// }

// // 🔥 Optional: clear cookies completely in case old ones exist
// export function clearAllCookies() {
//   document.cookie.split(";").forEach((c) => {
//     document.cookie = c
//       .replace(/^ +/, "")
//       .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
//   });
// }
