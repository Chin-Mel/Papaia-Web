import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      console.log("useUser - Token from localStorage:", token);

      if (!token) {
        console.log("useUser - No token found");
        setLoading(false);
        return;
      }

      try {
        // Decode token to get user ID
        const decoded = jwtDecode(token);
        console.log("useUser - Decoded token:", decoded);

        const userId = decoded.id || decoded.userId || decoded.sub;
        console.log("useUser - User ID:", userId);

        if (!userId) {
          throw new Error("No user ID found in token");
        }

        const response = await fetch(
          `https://papaiaapi.onrender.com/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("useUser - API Response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/sign-in";
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("useUser - User data received:", data);

        setUser(data);
      } catch (err) {
        console.error("useUser - Error:", err);
        setError(err.message);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded.userId || decoded.sub;

      const response = await fetch(
        `https://papaiaapi.onrender.com/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, refreshUser };
};
