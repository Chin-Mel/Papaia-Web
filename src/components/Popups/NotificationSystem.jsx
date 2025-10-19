export default function NotificationSystem() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Notification System Demo
          </h1>
          <p className="text-gray-600">
            Click the bell icon to view and manage your notifications
          </p>
        </div>

        <div className="flex justify-end relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Bell
              className={`w-6 h-6 ${
                unreadCount > 0 ? "text-blue-600" : "text-gray-600"
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            notifications={notifications}
            unreadCount={unreadCount}
            loading={loading}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
          />
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">⚠️ {error}</p>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                Click individual notifications to mark them as read (persists
                forever)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                Use "Mark all as read" button to mark all notifications at once
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Unread notifications have a blue dot indicator</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                Read notifications appear faded for visual distinction
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                Color-coded by disease type (yellow, red, purple, green)
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
