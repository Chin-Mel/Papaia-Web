// hooks/useNotifications.js
import { useState, useEffect } from "react";

// Toast notification function
export function showToast(message, type = "success") {
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
  }, 3000);
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
        console.error("[DEBUG] No token found in localStorage");
        setLoading(false);
        setError("No authentication token found");
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      console.log(
        "[DEBUG] Fetching notifications from: https://papaiaapi.onrender.com/api/owner/notifications"
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

      console.log("[DEBUG] Fetch response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 404) {
          console.log("[DEBUG] Notifications endpoint returned 404");
          setNotifications([]);
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        if (response.status === 401) {
          console.error("[DEBUG] Unauthorized - token may be invalid");
          setError("Unauthorized - please log in again");
          setNotifications([]);
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const notificationsArray = Array.isArray(data) ? data : [];

      console.log("[DEBUG] Fetched notifications:", notificationsArray);

      // FIXED: Normalize the read status - check both 'read' and 'isRead' fields
      const normalizedNotifications = notificationsArray.map((notif) => ({
        ...notif,
        // A notification is read if EITHER read===true OR isRead===true
        read: notif.read === true || notif.isRead === true,
      }));

      console.log(
        "[DEBUG] Normalized notification read states:",
        normalizedNotifications.map((n) => ({
          id: n.id,
          originalRead: data.find((x) => x.id === n.id)?.read,
          originalIsRead: data.find((x) => x.id === n.id)?.isRead,
          normalizedRead: n.read,
          title: n.title,
        }))
      );

      setNotifications(normalizedNotifications);
      setError(null);

      // Count unread notifications (where read === false)
      const unread = normalizedNotifications.filter(
        (n) => n.read === false
      ).length;
      setUnreadCount(unread);

      console.log(
        `[DEBUG] Total: ${normalizedNotifications.length} notifications, ${unread} unread`
      );
    } catch (error) {
      console.error("[DEBUG] Error fetching notifications:", error);
      setError(error.message);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll for new notifications every 30 seconds (reduced from 10s to reduce load)
    const interval = setInterval(() => {
      console.log("[DEBUG] Polling for new notifications...");
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      console.log(`[DEBUG] Marking notification ${notificationId} as read...`);
      console.log(
        `[DEBUG] Using endpoint: https://papaiaapi.onrender.com/api/owner/notifications/${notificationId}/read`
      );

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

      console.log(`[DEBUG] Mark as read response status:`, response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[DEBUG] Mark as read failed:`, errorData);
        throw new Error(
          errorData.error || "Failed to mark notification as read"
        );
      }

      const result = await response.json();
      console.log("[DEBUG] Mark as read API response:", result);

      // Update local state immediately for better UX
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      console.log(
        `[DEBUG] Successfully marked notification ${notificationId} as read`
      );
      showToast("Marked as read", "success");

      // Refetch after a short delay to confirm server state
      setTimeout(() => fetchNotifications(), 1000);
    } catch (error) {
      console.error("[DEBUG] Error in markAsRead:", error);
      showToast("Failed to mark as read", "error");
      // Refetch on error to ensure state consistency
      await fetchNotifications();
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
        console.log("[DEBUG] No unread notifications to mark");
        showToast("All notifications are already read", "success");
        return;
      }

      console.log(
        `[DEBUG] Marking all ${unreadNotifications.length} notifications as read...`
      );
      console.log(
        `[DEBUG] Using endpoint: https://papaiaapi.onrender.com/api/owner/notifications/read-all`
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

      console.log(`[DEBUG] Mark all as read response status:`, response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[DEBUG] Mark all as read failed:`, errorData);
        throw new Error(errorData.error || "Failed to mark all as read");
      }

      const result = await response.json();
      console.log("[DEBUG] Mark all as read API response:", result);

      // Update local state immediately
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);

      console.log("[DEBUG] Successfully marked all notifications as read");
      showToast("All notifications marked as read", "success");

      // Refetch after a short delay to confirm server state
      setTimeout(() => fetchNotifications(), 1000);
    } catch (error) {
      console.error("[DEBUG] Error in markAllAsRead:", error);
      showToast("Failed to mark all as read", "error");
      // Refetch on error to ensure state consistency
      await fetchNotifications();
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

export default useNotifications;
