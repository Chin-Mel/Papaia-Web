import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/sign-in" replace />;
    }
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
}
