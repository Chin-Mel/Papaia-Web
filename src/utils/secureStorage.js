// utils/secureStorage.js

/**
 * Simple encryption using base64 encoding
 * Note: This is obfuscation, not true encryption
 * For true security, use httpOnly cookies on the backend
 */
const encryptData = (data) => {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (error) {
    return null;
  }
};

const decryptData = (encryptedData) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encryptedData)));
  } catch (error) {
    return null;
  }
};

/**
 * Secure storage wrapper for localStorage
 * Encrypts data before storing and decrypts when retrieving
 */
export const secureStorage = {
  setItem: (key, value) => {
    const encrypted = encryptData(value);
    if (encrypted) {
      localStorage.setItem(`_sec_${key}`, encrypted);
    }
  },

  getItem: (key) => {
    const encrypted = localStorage.getItem(`_sec_${key}`);
    return encrypted ? decryptData(encrypted) : null;
  },

  removeItem: (key) => {
    localStorage.removeItem(`_sec_${key}`);
  },

  clear: () => {
    // Only clear items with _sec_ prefix
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("_sec_")) {
        localStorage.removeItem(key);
      }
    });
  },
};

/**
 * Get authentication token
 */
export const getToken = () => {
  return secureStorage.getItem("token");
};

/**
 * Get user data
 */
export const getUser = () => {
  return secureStorage.getItem("user");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Logout - clear all secure storage
 */
export const logout = () => {
  secureStorage.clear();
};

/**
 * API fetch wrapper with automatic token injection
 */
export const secureFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
