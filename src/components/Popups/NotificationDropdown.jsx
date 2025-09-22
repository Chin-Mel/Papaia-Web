import { Bell, AlertTriangle, TrendingUp } from "lucide-react";

export default function NotificationDropdown({ isOpen, onClose }) {
  // Mock notification data
  const notifications = [
    {
      id: 1,
      type: "warning",
      icon: AlertTriangle,
      mainMessage: "No Recent Activity",
      detail: "Green Valley Farm - Check",
      timestamp: "2 hours ago",
      color: "red",
    },
    {
      id: 2,
      type: "warning",
      icon: AlertTriangle,
      mainMessage: "Multiple Disease Detected",
      detail: "Green Valley Farm - Check",
      timestamp: "6 hours ago",
      color: "yellow",
    },
    {
      id: 3,
      type: "info",
      icon: TrendingUp,
      mainMessage: "Monthly report generated",
      detail: "Productivity analytics ready",
      timestamp: "2 days ago",
      color: "purple",
    },
  ];

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
      default:
        return {
          container: "bg-gray-50 border-l-4 border-gray-500",
          icon: "text-gray-500",
        };
    }
  };

  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";

      return () => {
        document.body.style.overflow = "unset";
        document.body.style.pointerEvents = "auto";
      };
    }
  }, [isOpen]);

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Bell className="w-5 h-5 text-gray-600" />
        <h3 className="font-bold text-gray-800">Notifications</h3>
      </div>

      {/* Notification List */}
      <div className="p-4 space-y-3">
        {notifications.map((notification) => {
          const styles = getNotificationStyles(notification.color);
          const IconComponent = notification.icon;

          return (
            <div
              key={notification.id}
              className={`${styles.container} rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`${styles.icon} mt-0.5`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">
                    {notification.mainMessage}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {notification.detail}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional: View All Notifications Link */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
}
