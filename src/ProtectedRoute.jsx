import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simply check if token exists
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) return null; // or <Spinner />

  return isLoggedIn ? children : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
