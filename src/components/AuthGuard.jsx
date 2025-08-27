// src/components/AuthGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { getLoggedInUser } from "../utils/security";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → redirect to landing page
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    // Token expired → clear token & redirect
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    // Token valid → allow access
    return children;
  } catch (error) {
    // Invalid token → clear and redirect
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
};

export default AuthGuard;
