// hooks/useNotifications.js
import { useState, useEffect, useRef } from "react";

// Toast notification function
export function showToast(message, type = "success") {
  const toast = document.createElement("div");

  const bgColor = type === "error" ? "bg-red-600" : "bg-green-600";

  toast.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2`;

  toast.innerHTML = `
    <span>${type === "error" ? "⚠️" : "🔔"}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slide-out 0.3s ease-out forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousCountRef = useRef(0);
  const isFirstLoadRef = useRef(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        setError("No authentication token found");
        return;
      }

      console.log(
        "Fetching notifications with token:",
        token.substring(0, 20) + "..."
      );

      const response = await fetch(
        "https://papaiaapi.onrender.com/api/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        if (response.status === 404) {
          console.warn("Notifications API not yet available (404)");
          setNotifications([]);
          setUnreadCount(0);
          setError("Notifications feature is currently unavailable");
          setLoading(false);
          return;
        }

        if (response.status === 401) {
          console.error("Unauthorized - token may be invalid or expired");
          setError("Unauthorized - please log in again");
          setLoading(false);
          return;
        }

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      // Ensure data is an array
      const notificationsArray = Array.isArray(data) ? data : [];

      setNotifications(notificationsArray);
      setError(null);

      const unread = notificationsArray.filter((n) => n.read === false).length;

      // Show toast only if:
      // 1. Not first load
      // 2. There are NEW unread notifications
      // 3. Page is visible
      if (
        !isFirstLoadRef.current &&
        unread > previousCountRef.current &&
        !document.hidden
      ) {
        const newCount = unread - previousCountRef.current;
        const message =
          newCount === 1
            ? "New notification received!"
            : `${newCount} new notifications received!`;
        showToast(message);
      }

      previousCountRef.current = unread;
      setUnreadCount(unread);
      isFirstLoadRef.current = false;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(error.message);
      // Don't show error toast on every poll - only log it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      const response = await fetch(
        `https://papaiaapi.onrender.com/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      previousCountRef.current = Math.max(0, previousCountRef.current - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showToast("Failed to mark as read", "error");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      const unreadNotifications = notifications.filter((n) => !n.read);

      if (unreadNotifications.length === 0) {
        return; // Nothing to mark
      }

      // Optimistically update UI first
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      previousCountRef.current = 0;

      // Send requests in parallel
      const results = await Promise.allSettled(
        unreadNotifications.map((n) =>
          fetch(
            `https://papaiaapi.onrender.com/api/notifications/${n.id}/read`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      // Check if any failed
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        console.warn(`${failed.length} notifications failed to mark as read`);
        // Optionally refetch to sync state
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showToast("Failed to mark all as read", "error");
      // Revert optimistic update by refetching
      fetchNotifications();
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
