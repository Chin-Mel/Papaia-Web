// hooks/useNotifications.js
import { useState, useEffect } from "react";

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
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        setError("No authentication token found");
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      console.log("Fetching notifications...");

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

      console.log("Notifications API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 404) {
          console.log("Notifications API not yet available (404)");
          setNotifications([]);
          setUnreadCount(0);
          setError("Notifications feature is currently unavailable");
          return;
        }

        if (response.status === 401) {
          console.error("Unauthorized - token may be invalid or expired");
          setError("Unauthorized - please log in again");
          setNotifications([]);
          setUnreadCount(0);
          return;
        }

        console.error("Notifications API error:", response.status, errorData);
        setError(errorData.error || `API Error: ${response.status}`);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const data = await response.json();
      console.log("Notifications response:", data);

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
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      console.log(`Marking notification ${notificationId} as read...`);

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
        throw new Error(
          errorData.error || "Failed to mark notification as read"
        );
      }

      const result = await response.json();
      console.log("Mark as read success:", result.message);

      // Refetch notifications to get updated state from backend
      await fetchNotifications();
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
        throw new Error(errorData.error || "Failed to mark all as read");
      }

      const result = await response.json();
      console.log("Mark all as read success:", result.message);

      // Refetch notifications to get updated state from backend
      await fetchNotifications();
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
    refresh: fetchNotifications,
  };
}
