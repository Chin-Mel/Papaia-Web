// ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { secureApiCall } from "../utils/securityUtils";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await secureApiCall(
          "https://papaiaapi.onrender.com/api/verify"
        );
        if (response.ok) setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (isLoading) return null; // or a spinner

  return isLoggedIn ? children : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
