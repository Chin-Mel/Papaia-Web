import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // You'll need: npm install jwt-decode

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Decode token to get user ID
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

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
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
