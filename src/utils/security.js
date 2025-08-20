// Security utility functions

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Get CSRF token from meta tag
 * @returns {string} - CSRF token
 */
export function getCSRFToken() {
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag ? metaTag.getAttribute("content") : "";
}

/**
 * Secure API call with CSRF protection and error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export async function secureApiCall(url, options = {}) {
  const defaultOptions = {
    credentials: "include", // Include cookies for session auth
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCSRFToken(), // CSRF protection
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
      // Handle different error status codes
      if (response.status === 401) {
        // Unauthorized - redirect to login
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

    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with score and feedback
 */
export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  const feedback = [];

  if (password.length >= minLength) {
    score += 1;
  } else {
    feedback.push(`Password must be at least ${minLength} characters long`);
  }

  if (hasUpperCase) score += 1;
  else feedback.push("Include at least one uppercase letter");

  if (hasLowerCase) score += 1;
  else feedback.push("Include at least one lowercase letter");

  if (hasNumbers) score += 1;
  else feedback.push("Include at least one number");

  if (hasSpecialChar) score += 1;
  else feedback.push("Include at least one special character");

  return {
    score,
    isValid: score >= 4,
    feedback,
  };
}

/**
 * Clear sensitive data from localStorage and sessionStorage
 */
export function clearSensitiveData() {
  // Never store JWTs in localStorage/sessionStorage
  // Only clear non-sensitive data
  const safeKeys = ["theme", "language", "ui-preferences"];

  // Clear all except safe keys
  Object.keys(localStorage).forEach((key) => {
    if (!safeKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  Object.keys(sessionStorage).forEach((key) => {
    if (!safeKeys.includes(key)) {
      sessionStorage.removeItem(key);
    }
  });
}

/**
 * Logout function - clear state and redirect
 */
export function secureLogout() {
  // Clear any sensitive data
  clearSensitiveData();

  // Call logout API to invalidate session
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCSRFToken(),
    },
  }).finally(() => {
    // Redirect to login page
    window.location.href = "/sign-in";
  });
}

/**
 * Confirm destructive action with user
 * @param {string} action - Action description
 * @param {string} itemName - Name of item being affected
 * @returns {Promise<boolean>} - User confirmation
 */
export function confirmDestructiveAction(action, itemName) {
  return new Promise((resolve) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${sanitizeInput(
        itemName
      )}"? This action cannot be undone.`
    );
    resolve(confirmed);
  });
}
