import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user has a valid session by calling your auth API
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            // Redirect to login with return URL
            navigate("/signin", {
              state: { from: location.pathname },
              replace: true,
            });
          }
        } else {
          // Redirect to login with return URL
          navigate("/signin", {
            state: { from: location.pathname },
            replace: true,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Redirect to login with return URL
        navigate("/signin", {
          state: { from: location.pathname },
          replace: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate, location.pathname]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? children : null;
}
