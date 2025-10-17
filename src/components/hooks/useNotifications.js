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
        "https://papaiaapi.onrender.com/api/owner/notifications",
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
      setUnreadCount(unread);

      console.log(
        `Fetched ${notificationsArray.length} notifications, ${unread} unread`
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once on mount
    fetchNotifications();
  }, []); // No polling - only fetch on mount

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      console.log(`Marking notification ${notificationId} as read...`);

      // Optimistically update UI FIRST
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Mark as read failed:", response.status, errorData);

        // Revert optimistic update on failure
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
        );
        setUnreadCount((prev) => prev + 1);

        throw new Error(
          errorData.error || "Failed to mark notification as read"
        );
      }

      const result = await response.json();
      console.log("Mark as read success:", result.message);
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

      console.log(
        `Marking all ${unreadNotifications.length} notifications as read...`
      );

      // Optimistically update UI first
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      // Use the new read-all endpoint
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/owner/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Mark all as read failed:", response.status, errorData);

        // Revert optimistic update on failure by refetching
        await fetchNotifications();

        throw new Error(errorData.error || "Failed to mark all as read");
      }

      const result = await response.json();
      console.log("Mark all as read success:", result.message);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showToast("Failed to mark all as read", "error");
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications, // Can be called manually when needed
  };
}
