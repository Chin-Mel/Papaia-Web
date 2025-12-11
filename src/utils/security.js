/**
 *
 * @param {string} input
 * @returns {string}
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
 *
 * @param {string} url
 * @param {Object} options
 * @returns {Promise}
 */
export async function secureApiCall(url, options = {}) {
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        localStorage.removeItem("token");
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
    throw error;
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  const feedback = [];

  if (password.length >= minLength) score += 1;
  else feedback.push(`Password must be at least ${minLength} characters long`);

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

export function clearSensitiveData() {
  const safeKeys = ["theme", "language", "ui-preferences"];

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

export function secureLogout() {
  localStorage.removeItem("token");
  clearSensitiveData();

  window.location.href = "/sign-in";
}

export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

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
