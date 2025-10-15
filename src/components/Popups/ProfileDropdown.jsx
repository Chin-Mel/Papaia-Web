import { useState, useEffect } from "react";
import { CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultUserPic from "../../assets/default-user.png";
import { getLoggedInUser } from "../../utils/security";

export default function ProfileDropdown({ isOpen, onClose, onLogout, user }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);

  if (!isOpen) return null;

  const goToProfilePage = () => {
    onClose();
    navigate("/profile");
  };

  // Sync local state whenever prop changes
  useEffect(() => {
    setUserData(user);
  }, [user]);

  // Listen for profile updates from other components
  useEffect(() => {
    const updateUser = () => {
      const updatedUser = getLoggedInUser();
      if (updatedUser) {
        setUserData(updatedUser);
      }
    };

    window.addEventListener("userUpdated", updateUser);
    return () => window.removeEventListener("userUpdated", updateUser);
  }, []);

  // Fixed helper function to get profile picture URL
  const getProfilePictureUrl = () => {
    if (userData?.profilePicture) {
      // Check if it's already a full URL or just a path
      if (userData.profilePicture.startsWith("http")) {
        return userData.profilePicture;
      }
      return `https://papaiaapi.onrender.com${userData.profilePicture}`;
    }
    return defaultUserPic;
  };

  // Helper function to get user's display name
  const getDisplayName = () => {
    if (userData?.firstName && userData?.lastName) {
      const middleInitial = userData.middleName
        ? `${userData.middleName.charAt(0)}. `
        : "";
      const suffix = userData.suffix ? ` ${userData.suffix}` : "";

      return `${userData.firstName} ${middleInitial}${userData.lastName}${suffix}`;
    }
    return userData?.username || "Unknown User";
  };
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 text-lg">Account</h3>
      </div>

      {/* Profile Information Section - Clickable */}
      <div
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={goToProfilePage}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToProfilePage();
          }
        }}
      >
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src={getProfilePictureUrl()}
              alt={getDisplayName()}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultUserPic;
              }}
            />
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-lg truncate">
              {getDisplayName()}
            </h4>
            <p className="text-gray-600 text-sm truncate">
              {userData?.email || "No email"}
            </p>
            <p className="text-gray-400 text-xs mt-1">View Profile</p>
          </div>
        </div>
      </div>

      {/* Navigation/Options Section */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => {
            onClose();
            alert("Plans & Pricing clicked");
          }}
          className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <div className="mt-1 flex-shrink-0">
            <CreditCard className="w-5 h-5 text-gray-700" />
          </div>
          <div className="flex-1">
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
