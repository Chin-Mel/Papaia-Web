// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check for JWT

  if (!token) {
    return <Navigate to="/" replace />; // redirect if not logged in
  }

  try {
    const { exp } = jwt_decode(token);
    if (Date.now() >= exp * 1000) {
      // Token expired
      localStorage.removeItem("token");
      return <Navigate to="/sign-in" replace />;
    }
  } catch (err) {
    // Invalid token
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children; // render protected page
};

export default ProtectedRoute;
