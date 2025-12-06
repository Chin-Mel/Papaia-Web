import { Bell, AlertTriangle, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  loading,
  markAsRead,
  markAllAsRead,
}) {
  const getNotificationColor = (disease) => {
    const diseaseColors = {
      "Ring Spot Virus": "orange",
      Anthracnose: "red",
      "Powdery Mildew": "blue",
      Healthy: "green",
    };
    return diseaseColors[disease] || "red";
  };

  const getNotificationStyles = (color) => {
    switch (color) {
      case "red":
        return {
          container: "bg-red-50 border-l-4 border-red-500",
          icon: "text-red-500",
        };
      case "orange":
        return {
          container: "bg-orange-50 border-l-4 border-orange-500",
          icon: "text-orange-500",
        };
      case "blue":
        return {
          container: "bg-blue-50 border-l-4 border-blue-500",
          icon: "text-blue-500",
        };
      case "green":
        return {
          container: "bg-green-50 border-l-4 border-green-500",
          icon: "text-green-500",
        };
      default:
        return {
          container: "bg-gray-50 border-l-4 border-gray-500",
          icon: "text-gray-500",
        };
    }
  };

  const handleCheckboxClick = (e, notificationId) => {
    e.stopPropagation();
    markAsRead(notificationId);
  };

  if (!isOpen) return null;

  const recentNotifications = notifications.slice(0, 5);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1"
            >
              Mark all as read
            </button>
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">
                Loading notifications...
              </p>
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {recentNotifications.map((notification) => {
                const color = getNotificationColor(notification.disease);
                const styles = getNotificationStyles(color);

                return (
                  <div
                    key={notification.id}
                    className={`${styles.container} ${
                      !notification.read ? "opacity-100" : "opacity-60"
                    } rounded-lg p-3 hover:shadow-md transition-all relative`}
                  >
                    {!notification.read && (
                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxClick(e, notification.id)
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          title="Mark as read"
                        />
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`${styles.icon} mt-0.5 flex-shrink-0`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <p className="font-bold text-gray-800 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-gray-500 text-xs">
                            {notification.farmName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link
          to="/notifications"
          onClick={onClose}
          className="p-4 border-t border-gray-200 text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex-shrink-0"
        >
          View All Notifications
        </Link>
      </div>
    </>
  );
}

// import { Bell, AlertTriangle, X } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function NotificationDropdown({
//   isOpen,
//   onClose,
//   notifications,
//   unreadCount,
//   loading,
//   markAsRead,
//   markAllAsRead,
// }) {
//   const getNotificationColor = (disease) => {
//     const diseaseColors = {
//       "Ring Spot Virus": "yellow",
//       Anthracnose: "red",
//       "Powdery Mildew": "purple",
//       Healthy: "green",
//     };
//     return diseaseColors[disease] || "red";
//   };

//   const getNotificationStyles = (color) => {
//     switch (color) {
//       case "red":
//         return {
//           container: "bg-red-50 border-l-4 border-red-500",
//           icon: "text-red-500",
//         };
//       case "yellow":
//         return {
//           container: "bg-yellow-50 border-l-4 border-yellow-500",
//           icon: "text-yellow-500",
//         };
//       case "purple":
//         return {
//           container: "bg-purple-50 border-l-4 border-purple-500",
//           icon: "text-purple-500",
//         };
//       case "green":
//         return {
//           container: "bg-green-50 border-l-4 border-green-500",
//           icon: "text-green-500",
//         };
//       default:
//         return {
//           container: "bg-gray-50 border-l-4 border-gray-500",
//           icon: "text-gray-500",
//         };
//     }
//   };

//   const handleNotificationClick = (notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }
//   };

//   if (!isOpen) return null;

//   // Show only recent 5 notifications
//   const recentNotifications = notifications.slice(0, 5);

//   return (
//     <>
//       <div className="fixed inset-0 z-40" onClick={onClose} />

//       <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] flex flex-col">
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <Bell className="w-5 h-5 text-gray-600" />
//             <h3 className="font-bold text-gray-800">Notifications</h3>
//             {unreadCount > 0 && (
//               <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
//                 {unreadCount}
//               </span>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {unreadCount > 0 && (
//           <div className="p-3 border-b border-gray-200 flex-shrink-0">
//             <button
//               onClick={markAllAsRead}
//               className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1"
//             >
//               Mark all as read
//             </button>
//           </div>
//         )}

//         <div className="overflow-y-auto flex-1">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
//               <p className="text-gray-500 text-sm mt-2">
//                 Loading notifications...
//               </p>
//             </div>
//           ) : recentNotifications.length === 0 ? (
//             <div className="p-8 text-center">
//               <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <p className="text-gray-500 text-sm">No notifications yet</p>
//             </div>
//           ) : (
//             <div className="p-4 space-y-3">
//               {recentNotifications.map((notification) => {
//                 const color = getNotificationColor(notification.disease);
//                 const styles = getNotificationStyles(color);

//                 return (
//                   <div
//                     key={notification.id}
//                     onClick={() => handleNotificationClick(notification)}
//                     className={`${styles.container} ${
//                       !notification.read ? "opacity-100" : "opacity-60"
//                     } rounded-lg p-3 cursor-pointer hover:shadow-md transition-all relative`}
//                   >
//                     {!notification.read && (
//                       <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                     )}

//                     <div className="flex items-start gap-3">
//                       <div className={`${styles.icon} mt-0.5 flex-shrink-0`}>
//                         <AlertTriangle className="w-4 h-4" />
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <p className="font-bold text-gray-800 text-sm">
//                           {notification.title}
//                         </p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {notification.message}
//                         </p>
//                         <div className="flex items-center justify-between mt-2">
//                           <p className="text-gray-500 text-xs">
//                             {notification.farmName}
//                           </p>
//                           <p className="text-gray-400 text-xs">
//                             {notification.timestamp}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* View All Link */}
//         <Link
//           to="/notifications"
//           onClick={onClose}
//           className="p-4 border-t border-gray-200 text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex-shrink-0"
//         >
//           View All Notifications
//         </Link>
//       </div>
//     </>
//   );
// }
