import { LogOut } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirmLogout }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Top Section - Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Middle Section - Title and Message */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Logout</h2>
          <div className="text-gray-600 space-y-1">
            <p>Are you sure you want to sign out of your account?</p>
            <p>You'll need to sign in again to access your dashboard.</p>
          </div>
        </div>

        {/* Bottom Section - Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmLogout}
            className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
