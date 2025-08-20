export async function secureApiCall(url, options = {}) {
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCSRFToken(),
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
        throw new Error("Request failed");
      }
    }

    // ✅ Return response object so .json() works
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
