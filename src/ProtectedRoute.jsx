import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading state
  }

  if (!user) {
    // Redirect to the sign-in page if not authenticated
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children (the protected page component)
  return children;
};

export default ProtectedRoute;
