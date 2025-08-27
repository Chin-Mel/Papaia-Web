import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // ✅ correct

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/sign-in" replace />;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return <Navigate to="/sign-in" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/sign-in" replace />;
  }
};

export default ProtectedRoute;
