// contexts/NotificationContext.js
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const NotificationContext = createContext(null);

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

// Notification Provider Component
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousCountRef = useRef(0);
  const isMountedRef = useRef(true);

  const fetchNotifications = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("[DEBUG] No token found in localStorage");
        if (!silent) setLoading(false);
        setError("No authentication token found");
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

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
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 404) {
          setNotifications([]);
          setUnreadCount(0);
          if (!silent) setLoading(false);
          return;
        }

        if (response.status === 401) {
          console.error("[DEBUG] Unauthorized - token may be invalid");
          setError("Unauthorized - please log in again");
          setNotifications([]);
          setUnreadCount(0);
          if (!silent) setLoading(false);
          return;
        }

        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const notificationsArray = Array.isArray(data) ? data : [];

      // Normalize the read status
      const normalizedNotifications = notificationsArray.map((notif) => ({
        ...notif,
        read: notif.read === true || notif.isRead === true,
      }));

      // Only update if component is still mounted
      if (isMountedRef.current) {
        setNotifications(normalizedNotifications);
        setError(null);

        // Count unread notifications
        const unread = normalizedNotifications.filter((n) => !n.read).length;

        // Update count reference for tracking
        previousCountRef.current = unread;
        setUnreadCount(unread);

        console.log(
          `[DEBUG] Total: ${normalizedNotifications.length} notifications, ${unread} unread`
        );
      }
    } catch (error) {
      console.error("[DEBUG] Error fetching notifications:", error);
      if (isMountedRef.current) {
        setError(error.message);
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      if (!silent && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch
    fetchNotifications(false);

    // Poll for new notifications every 15 seconds (silent)
    const interval = setInterval(() => {
      console.log("[DEBUG] Polling for new notifications...");
      fetchNotifications(true);
    }, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast("Authentication required", "error");
          return;
        }

        console.log(
          `[DEBUG] Marking notification ${notificationId} as read...`
        );

        // Optimistically update UI immediately
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
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
          console.error(`[DEBUG] Mark as read failed:`, errorData);

          // Revert on error
          await fetchNotifications(true);
          throw new Error(
            errorData.error || "Failed to mark notification as read"
          );
        }

        console.log(
          `[DEBUG] Successfully marked notification ${notificationId} as read`
        );
      } catch (error) {
        console.error("[DEBUG] Error in markAsRead:", error);
        showToast("Failed to mark as read", "error");
      }
    },
    [fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      const unreadNotifications = notifications.filter((n) => !n.read);

      if (unreadNotifications.length === 0) {
        showToast("All notifications are already read", "success");
        return;
      }

      console.log(
        `[DEBUG] Marking all ${unreadNotifications.length} notifications as read...`
      );

      // Optimistically update UI immediately
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      previousCountRef.current = 0;

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
        console.error(`[DEBUG] Mark all as read failed:`, errorData);

        // Revert on error
        await fetchNotifications(true);
        throw new Error(errorData.error || "Failed to mark all as read");
      }

      console.log("[DEBUG] Successfully marked all notifications as read");
      showToast("All notifications marked as read", "success");
    } catch (error) {
      console.error("[DEBUG] Error in markAllAsRead:", error);
      showToast("Failed to mark all as read", "error");
    }
  }, [notifications, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: () => fetchNotifications(false),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}
