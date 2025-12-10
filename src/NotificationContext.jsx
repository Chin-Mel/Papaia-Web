import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAlert } from "./AlertContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { showAlert } = useAlert();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const previousNotificationIdsRef = useRef(new Set());
  const isMountedRef = useRef(true);
  const lastDataHashRef = useRef(null);

  const hashData = useCallback((data) => {
    return JSON.stringify(data);
  }, []);

  const fetchNotifications = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        const token = localStorage.getItem("token");
        if (!token) {
          if (!silent) setLoading(false);
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
          if (response.status === 404 || response.status === 401) {
            setNotifications([]);
            setUnreadCount(0);
            if (!silent) setLoading(false);
            return;
          }
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const notificationsArray = Array.isArray(data) ? data : [];
        const newHash = hashData(notificationsArray);

        // Only update if data changed
        if (newHash !== lastDataHashRef.current && isMountedRef.current) {
          lastDataHashRef.current = newHash;

          // Check for new notifications
          const newNotifications = notificationsArray.filter(
            (n) => !previousNotificationIdsRef.current.has(n.id) && !n.read
          );

          if (newNotifications.length > 0 && silent) {
            newNotifications.forEach((n) => {
              const article = n.disease === "Anthracnose" ? "An" : "A";
              showAlert(
                "info",
                `${article} ${n.disease} disease detected on ${n.farmName}!`
              );
            });
          }

          previousNotificationIdsRef.current = new Set(
            notificationsArray.map((n) => n.id)
          );

          setNotifications(notificationsArray);
          const unread = notificationsArray.filter((n) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Notification fetch error:", error);
        if (!silent && isMountedRef.current) {
          setNotifications([]);
          setUnreadCount(0);
        }
      } finally {
        if (!silent && isMountedRef.current) setLoading(false);
      }
    },
    [showAlert, hashData]
  );

  useEffect(() => {
    isMountedRef.current = true;

    fetchNotifications(false);

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 5000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Optimistic update
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
          await fetchNotifications(true);
        }
      } catch (error) {
        console.error("Mark as read error:", error);
        await fetchNotifications(true);
      }
    },
    [fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const unreadNotifications = notifications.filter((n) => !n.read);

      if (unreadNotifications.length === 0) {
        return;
      }

      // Optimistic update
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);

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
        await fetchNotifications(true);
      }
    } catch (error) {
      console.error("Mark all as read error:", error);
      await fetchNotifications(true);
    }
  }, [notifications, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
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

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}

// // contexts/NotificationContext.js
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// import { useAlert } from "./AlertContext";

// const NotificationContext = createContext(null);

// // Toast notification function
// export function showToast(message, type = "success") {
//   const toast = document.createElement("div");
//   const bgColor = type === "error" ? "bg-red-600" : "bg-green-600";

//   toast.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
//   toast.style.animation = "slideIn 0.3s ease-out";

//   toast.innerHTML = `
//     <span>${type === "error" ? "⚠️" : "✓"}</span>
//     <span>${message}</span>
//   `;

//   document.body.appendChild(toast);

//   setTimeout(() => {
//     toast.style.animation = "slideOut 0.3s ease-out";
//     setTimeout(() => toast.remove(), 300);
//   }, 3000);
// }

// // Notification Provider Component
// export function NotificationProvider({ children }) {
//   const { showAlert } = useAlert();
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const previousCountRef = useRef(0);
//   const isMountedRef = useRef(true);

//   const fetchNotifications = useCallback(
//     async (silent = false) => {
//       try {
//         if (!silent) {
//           setLoading(true);
//         }
//         setError(null);

//         const token = localStorage.getItem("token");
//         if (!token) {
//           if (!silent) setLoading(false);
//           setError("No authentication token found");
//           setNotifications([]);
//           setUnreadCount(0);
//           return;
//         }

//         const response = await fetch(
//           "https://papaiaapi.onrender.com/api/owner/notifications",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({}));

//           if (response.status === 404) {
//             setNotifications([]);
//             setUnreadCount(0);
//             if (!silent) setLoading(false);
//             return;
//           }

//           if (response.status === 401) {
//             setError("Unauthorized - please log in again");
//             setNotifications([]);
//             setUnreadCount(0);
//             if (!silent) setLoading(false);
//             return;
//           }

//           throw new Error(errorData.error || `API Error: ${response.status}`);
//         }

//         const data = await response.json();
//         const notificationsArray = Array.isArray(data) ? data : [];

//         // Normalize the read status
//         const normalizedNotifications = notificationsArray.map((notif) => ({
//           ...notif,
//           read: notif.read === true || notif.isRead === true,
//         }));

//         // Only update if component is still mounted
//         if (isMountedRef.current) {
//           // Compare old vs new unread notifications
//           const oldUnreadIds = notifications
//             .filter((n) => !n.read)
//             .map((n) => n.id);
//           const newUnread = normalized.filter(
//             (n) => !n.read && !oldUnreadIds.includes(n.id)
//           );

//           // Show alert for new notifications
//           newUnread.forEach((n) => {
//             showAlert(`New notification: ${n.disease} detected!`, "info", 4000);
//           });

//           setNotifications(normalized);
//           const unread = normalized.filter((n) => !n.read).length;
//           setUnreadCount(unread);
//           previousCountRef.current = unread;
//         }
//       } catch (error) {
//       } finally {
//         if (!silent && isMountedRef.current) setLoading(false);
//       }
//     },
//     [notifications, showAlert]
//   );

//   useEffect(() => {
//     isMountedRef.current = true;

//     // Initial fetch
//     fetchNotifications(false);

//     // Poll for new notifications every 15 seconds (silent)
//     const interval = setInterval(() => {
//       fetchNotifications(true);
//     }, 15000);

//     return () => {
//       isMountedRef.current = false;
//       clearInterval(interval);
//     };
//   }, [fetchNotifications]);

//   const markAsRead = useCallback(
//     async (notificationId) => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           showToast("Authentication required", "error");
//           return;
//         }
//         setNotifications((prev) =>
//           prev.map((notif) =>
//             notif.id === notificationId ? { ...notif, read: true } : notif
//           )
//         );
//         setUnreadCount((prev) => Math.max(0, prev - 1));

//         const response = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/notifications/${notificationId}/read`,
//           {
//             method: "PATCH",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({}));
//           await fetchNotifications(true);
//           throw new Error(errorData.error || "Failed to mark as read");
//         }
//       } catch (error) {}
//     },
//     [fetchNotifications]
//   );

//   const markAllAsRead = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         showToast("Authentication required", "error");
//         return;
//       }

//       const unreadNotifications = notifications.filter((n) => !n.read);

//       if (unreadNotifications.length === 0) {
//         showToast("All notifications are already read", "success");
//         return;
//       }
//       setNotifications((prev) =>
//         prev.map((notif) => ({ ...notif, read: true }))
//       );
//       setUnreadCount(0);
//       previousCountRef.current = 0;

//       const response = await fetch(
//         "https://papaiaapi.onrender.com/api/owner/notifications/read-all",
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         await fetchNotifications(true);
//         throw new Error(errorData.error || "Failed to mark all as read");
//       }

//       showToast("All notifications marked as read", "success");
//     } catch (error) {
//       showToast("Failed to mark all as read", "error");
//     }
//   }, [notifications, fetchNotifications]);

//   const value = {
//     notifications,
//     unreadCount,
//     loading,
//     error,
//     markAsRead,
//     markAllAsRead,
//     refresh: () => fetchNotifications(false),
//   };

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// // Hook to use notifications
// export function useNotifications() {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error(
//       "useNotifications must be used within NotificationProvider"
//     );
//   }
//   return context;
// }
