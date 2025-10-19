// components/Popups/NotificationDropdown.js
import { Bell, AlertTriangle, X } from "lucide-react";

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
      "Ring Spot Virus": "yellow",
      Anthracnose: "red",
      "Powdery Mildew": "purple",
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
      case "yellow":
        return {
          container: "bg-yellow-50 border-l-4 border-yellow-500",
          icon: "text-yellow-500",
        };
      case "purple":
        return {
          container: "bg-purple-50 border-l-4 border-purple-500",
          icon: "text-purple-500",
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

  const handleCheckboxChange = (notification, e) => {
    e.stopPropagation();
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleMarkAllCheckbox = (e) => {
    if (e.target.checked && unreadCount > 0) {
      markAllAsRead();
    }
  };

  if (!isOpen) return null;

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

        {/* Mark All as Read Checkbox */}
        {notifications.length > 0 && (
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input
                type="checkbox"
                checked={unreadCount === 0}
                onChange={handleMarkAllCheckbox}
                disabled={unreadCount === 0}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span
                className={`text-sm font-medium ${
                  unreadCount === 0 ? "text-gray-400" : "text-blue-600"
                }`}
              >
                Mark all as read
              </span>
            </label>
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
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => {
                const color = getNotificationColor(notification.disease);
                const styles = getNotificationStyles(color);

                return (
                  <div
                    key={notification.id}
                    className={`${styles.container} ${
                      !notification.read ? "opacity-100" : "opacity-60"
                    } rounded-lg p-3 transition-all relative`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={notification.read}
                        onChange={(e) => handleCheckboxChange(notification, e)}
                        disabled={notification.read}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
                        title={
                          notification.read ? "Already read" : "Mark as read"
                        }
                      />

                      {/* Icon */}
                      <div className={`${styles.icon} mt-0.5 flex-shrink-0`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
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
      </div>
    </>
  );
}
