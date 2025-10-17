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

// In-memory cache for read notifications (persists during session)
const readNotificationsCache = new Set();

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

      // Apply client-side read status from cache
      // This ensures notifications stay marked as read even if backend fails
      const notificationsWithCache = notificationsArray.map((n) => ({
        ...n,
        read: n.read || readNotificationsCache.has(n.id),
      }));

      setNotifications(notificationsWithCache);
      setError(null);

      const unread = notificationsWithCache.filter(
        (n) => n.read === false
      ).length;
      setUnreadCount(unread);

      console.log(
        `Fetched ${notificationsWithCache.length} notifications, ${unread} unread (cache has ${readNotificationsCache.size} read IDs)`
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

      // Add to cache immediately
      readNotificationsCache.add(notificationId);

      // Optimistically update UI
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

        // Don't revert - keep in cache even if backend fails
        // This way it stays read on the client side
        console.warn(
          `Backend failed to mark ${notificationId} as read, but keeping client-side state`
        );

        throw new Error(
          errorData.error || "Failed to mark notification as read"
        );
      }

      const result = await response.json();
      console.log("Mark as read success:", result.message);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Don't show error toast - notification is still marked as read client-side
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

      // Add all to cache immediately
      unreadNotifications.forEach((n) => readNotificationsCache.add(n.id));

      // Optimistically update UI
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

        // Don't revert - keep in cache even if backend fails
        console.warn(
          "Backend failed to mark all as read, but keeping client-side state"
        );

        throw new Error(errorData.error || "Failed to mark all as read");
      }

      const result = await response.json();
      console.log("Mark all as read success:", result.message);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Don't show error toast - notifications are still marked as read client-side
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
