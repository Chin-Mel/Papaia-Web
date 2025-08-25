import { CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultUserPic from "../../assets/default-user.png"; // ✅ import default image

export default function ProfileDropdown({ isOpen, onClose, onLogout, user }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const goToProfilePage = () => {
    onClose();
    navigate("/profile");
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 text-lg">Account</h3>
      </div>

      {/* Profile Information Section */}
      <div
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={goToProfilePage}
      >
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            <img
              src={user?.profilePicture || defaultUserPic} // ✅ use uploaded or fallback
              alt={
                user?.firstName ? `${user.firstName} ${user.lastName}` : "User"
              }
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultUserPic;
              }}
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-lg">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.username || "Unknown User"}
            </h4>
            <p className="text-gray-600 text-sm">{user?.email || "No email"}</p>
          </div>
        </div>
      </div>

      {/* Navigation/Options Section */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => alert("Plans & Pricing clicked")}
          className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="mt-1">
            <CreditCard className="w-5 h-5 text-gray-700" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-gray-800">Plans and Pricing</p>
            <p className="text-gray-600 text-sm">See Offers</p>
          </div>
        </button>
      </div>

      {/* Action Button Section */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-red-500 bg-white text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
