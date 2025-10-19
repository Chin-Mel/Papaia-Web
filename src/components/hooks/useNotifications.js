import React, { useState, useEffect } from "react";
import { Bell, AlertTriangle, X, Check } from "lucide-react";

// Toast notification function
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  const bgColor = type === "error" ? "bg-red-600" : "bg-green-600";

  toast.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
  toast.style.animation = "slideIn 0.3s ease-out";

  toast.innerHTML = `
    <span>${type === "error" ? "⚠️" : "✓"}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Custom hook for notifications
export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate token from localStorage
      const token = "demo_token_12345";

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

      if (!response.ok) {
        if (response.status === 404) {
          setNotifications([]);
          setUnreadCount(0);
          setError("Notifications feature is currently unavailable");
          return;
        }

        if (response.status === 401) {
          setError("Unauthorized - please log in again");
          setNotifications([]);
          setUnreadCount(0);
          return;
        }

        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const notificationsArray = Array.isArray(data) ? data : [];

      setNotifications(notificationsArray);
      setError(null);

      const unread = notificationsArray.filter((n) => !n.read).length;
      setUnreadCount(unread);
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
      const token = "demo_token_12345";

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
        throw new Error(
          errorData.error || "Failed to mark notification as read"
        );
      }

      // Update local state immediately for better UX
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));

      showToast("Notification marked as read", "success");

      // Refetch to sync with backend
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showToast("Failed to mark as read", "error");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = "demo_token_12345";
      const unreadNotifications = notifications.filter((n) => !n.read);

      if (unreadNotifications.length === 0) {
        showToast("All notifications are already read", "success");
        return;
      }

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
        throw new Error(errorData.error || "Failed to mark all as read");
      }

      // Update local state immediately
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );

      setUnreadCount(0);

      showToast("All notifications marked as read", "success");

      // Refetch to sync with backend
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
