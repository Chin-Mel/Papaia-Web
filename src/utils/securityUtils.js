// ../utils/securityUtils.js

// Helper to sanitize input
export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input.trim();
}

// Secure API call function
export async function secureApiCall(url, options = {}) {
  // Make sure getCSRFToken is defined somewhere in your project
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": typeof getCSRFToken === "function" ? getCSRFToken() : "",
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/sign-in";
        throw new Error("Authentication required");
      } else if (response.status === 403) {
        throw new Error("Access denied");
      } else if (response.status >= 500) {
        throw new Error("Server error occurred");
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    // Return the response so .json() can be called
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
