import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Check } from "lucide-react";
import { useNotifications } from "../NotificationContext";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";

export default function NotificationPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const unreadNotificationIds = notifications
    .filter((n) => !n.read)
    .map((n) => n.id);

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

  const formatMessage = (disease) => {
    if (disease === "Anthracnose") {
      return `An <strong>${disease}</strong> disease has been detected on your farm!`;
    }
    return `A <strong>${disease}</strong> disease has been detected on your farm!`;
  };

  const handleCheckboxChange = (notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleSelectAllChange = () => {
    if (selectAllChecked) {
      setSelectedNotifications(new Set());
      setSelectAllChecked(false);
    } else {
      setSelectedNotifications(new Set(unreadNotificationIds));
      setSelectAllChecked(true);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.size === 0) return;

    const promises = Array.from(selectedNotifications).map((id) =>
      markAsRead(id)
    );
    await Promise.all(promises);

    setSelectedNotifications(new Set());
    setSelectAllChecked(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setSelectedNotifications(new Set());
    setSelectAllChecked(false);
  };

  useEffect(() => {
    if (
      unreadNotificationIds.length > 0 &&
      selectedNotifications.size === unreadNotificationIds.length
    ) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [selectedNotifications, unreadNotificationIds.length]);

  return (
    <>
      <HeaderMain />

      <div className="min-h-screen bg-gray-50">
        <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-[#4A7C59]" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectAllChecked}
                      onChange={handleSelectAllChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Select all unread
                    </span>
                  </label>

                  {selectedNotifications.size > 0 ? (
                    <button
                      onClick={handleMarkSelectedAsRead}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark {selectedNotifications.size} as read
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-4 py-2 bg-[#4A7C59] text-white text-sm font-medium rounded-lg hover:bg-[#2D5016] transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59] mx-auto"></div>
                <p className="text-gray-500 text-sm mt-4">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  You'll see notifications here when you have them
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const color = getNotificationColor(notification.disease);
                const styles = getNotificationStyles(color);
                const isSelected = selectedNotifications.has(notification.id);

                return (
                  <div
                    key={notification.id}
                    className={`${styles.container} ${
                      !notification.read ? "opacity-100" : "opacity-60"
                    } bg-white rounded-lg shadow-sm p-4 sm:p-5 hover:shadow-md transition-all relative`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`${styles.icon} mt-0.5 flex-shrink-0`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm sm:text-base">
                              {notification.title}
                            </p>
                            <p
                              className="text-gray-600 text-sm mt-1"
                              dangerouslySetInnerHTML={{
                                __html: formatMessage(notification.disease),
                              }}
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mt-3">
                              <p className="text-gray-500 text-xs sm:text-sm">
                                {notification.farmName}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>

                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleCheckboxChange(notification.id)
                                }
                                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                              />
                            </div>
                          )}

                          {notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600" />
                              </div>
                            </div>
                          )}
                        </div>

                        {!notification.read && (
                          <div className="absolute top-4 right-16 sm:right-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// import React from "react";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Bell, AlertTriangle, Check } from "lucide-react";
// import { useNotifications } from "../NotificationContext";
// import HeaderMain from "../components/Header/HeaderMain";
// import Footer from "../components/Footer/Footer";

// export default function NotificationPage() {
//   const navigate = useNavigate();
//   const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
//     useNotifications();

//   const [selectedNotifications, setSelectedNotifications] = useState(new Set());
//   const [selectAllChecked, setSelectAllChecked] = useState(false);

//   // Get unread notification IDs
//   const unreadNotificationIds = notifications
//     .filter((n) => !n.read)
//     .map((n) => n.id);

//   const getNotificationColor = (disease) => {
//     const diseaseColors = {
//       "Ring Spot Virus": "orange",
//       Anthracnose: "red",
//       "Powdery Mildew": "blue",
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
//       case "orange":
//         return {
//           container: "bg-orange-50 border-l-4 border-orange-500",
//           icon: "text-orange-500",
//         };
//       case "blue":
//         return {
//           container: "bg-blue-50 border-l-4 border-blue-500",
//           icon: "text-blue-500",
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

//   const formatMessage = (disease) => {
//     if (disease === "Anthracnose") {
//       return `An <strong>${disease}</strong> disease has been detected on your farm!`;
//     }
//     return `A <strong>${disease}</strong> disease has been detected on your farm!`;
//   };

//   const handleCheckboxChange = (notificationId) => {
//     const newSelected = new Set(selectedNotifications);
//     if (newSelected.has(notificationId)) {
//       newSelected.delete(notificationId);
//     } else {
//       newSelected.add(notificationId);
//     }
//     setSelectedNotifications(newSelected);
//   };

//   const handleSelectAllChange = () => {
//     if (selectAllChecked) {
//       setSelectedNotifications(new Set());
//       setSelectAllChecked(false);
//     } else {
//       setSelectedNotifications(new Set(unreadNotificationIds));
//       setSelectAllChecked(true);
//     }
//   };

//   const handleMarkSelectedAsRead = async () => {
//     if (selectedNotifications.size === 0) return;

//     const promises = Array.from(selectedNotifications).map((id) =>
//       markAsRead(id)
//     );
//     await Promise.all(promises);

//     setSelectedNotifications(new Set());
//     setSelectAllChecked(false);
//   };

//   const handleMarkAllAsRead = async () => {
//     await markAllAsRead();
//     setSelectedNotifications(new Set());
//     setSelectAllChecked(false);
//   };

//   useEffect(() => {
//     if (
//       unreadNotificationIds.length > 0 &&
//       selectedNotifications.size === unreadNotificationIds.length
//     ) {
//       setSelectAllChecked(true);
//     } else {
//       setSelectAllChecked(false);
//     }
//   }, [selectedNotifications, unreadNotificationIds.length]);

//   return (
//     <>
//       <HeaderMain />

//       <div className="min-h-screen bg-gray-50">
//         <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-6">
//           {/* Header */}
//           <div className="mb-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-[#4A7C59]" />
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//                   Notifications
//                 </h1>
//                 {unreadCount > 0 && (
//                   <span className="bg-red-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
//                     {unreadCount} unread
//                   </span>
//                 )}
//               </div>

//               {/* Mark All As Read with Checkbox */}
//               {unreadCount > 0 && (
//                 <div className="flex items-center gap-3">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={selectAllChecked}
//                       onChange={handleSelectAllChange}
//                       className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-gray-700 font-medium">
//                       Select all unread
//                     </span>
//                   </label>

//                   {selectedNotifications.size > 0 ? (
//                     <button
//                       onClick={handleMarkSelectedAsRead}
//                       className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Mark {selectedNotifications.size} as read
//                     </button>
//                   ) : (
//                     <button
//                       onClick={handleMarkAllAsRead}
//                       className="px-4 py-2 bg-[#4A7C59] text-white text-sm font-medium rounded-lg hover:bg-[#2D5016] transition-colors"
//                     >
//                       Mark all as read
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Notifications List */}
//           <div className="space-y-4">
//             {loading ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59] mx-auto"></div>
//                 <p className="text-gray-500 text-sm mt-4">
//                   Loading notifications...
//                 </p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//                 <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg">No notifications yet</p>
//                 <p className="text-gray-400 text-sm mt-2">
//                   You'll see notifications here when you have them
//                 </p>
//               </div>
//             ) : (
//               notifications.map((notification) => {
//                 const color = getNotificationColor(notification.disease);
//                 const styles = getNotificationStyles(color);
//                 const isSelected = selectedNotifications.has(notification.id);

//                 return (
//                   <div
//                     key={notification.id}
//                     className={`${styles.container} ${
//                       !notification.read ? "opacity-100" : "opacity-60"
//                     } bg-white rounded-lg shadow-sm p-4 sm:p-5 hover:shadow-md transition-all relative`}
//                   >
//                     <div className="flex items-start gap-3 sm:gap-4">
//                       {/* Icon */}
//                       <div className={`${styles.icon} mt-0.5 flex-shrink-0`}>
//                         <AlertTriangle className="w-5 h-5" />
//                       </div>

//                       {/* Content */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between gap-3">
//                           <div className="flex-1 min-w-0">
//                             <p className="font-bold text-gray-800 text-sm sm:text-base">
//                               {notification.title}
//                             </p>
//                             <p
//                               className="text-gray-600 text-sm mt-1"
//                               dangerouslySetInnerHTML={{
//                                 __html: formatMessage(notification.disease),
//                               }}
//                             />
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mt-3">
//                               <p className="text-gray-500 text-xs sm:text-sm">
//                                 {notification.farmName}
//                               </p>
//                               <p className="text-gray-400 text-xs">
//                                 {notification.timestamp}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Checkbox - Only show for unread */}
//                           {!notification.read && (
//                             <div className="flex-shrink-0">
//                               <input
//                                 type="checkbox"
//                                 checked={isSelected}
//                                 onChange={() =>
//                                   handleCheckboxChange(notification.id)
//                                 }
//                                 className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
//                               />
//                             </div>
//                           )}

//                           {/* Read indicator */}
//                           {notification.read && (
//                             <div className="flex-shrink-0">
//                               <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
//                                 <Check className="w-3 h-3 text-green-600" />
//                               </div>
//                             </div>
//                           )}
//                         </div>

//                         {!notification.read && (
//                           <div className="absolute top-4 right-16 sm:right-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }
