import { useState, useEffect, useRef } from "react";
import { CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../../utils/security";
import UserAvatar from "../UserAvatar";

export default function ProfileDropdown({ isOpen, onClose, onLogout, user }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setUserData(user);
  }, [user]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const getDisplayName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData?.username || "Unknown User";
  };

  const goToProfilePage = () => {
    onClose();
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 text-lg">Account</h3>
      </div>

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
          <div className="w-12 h-12 flex-shrink-0">
            <UserAvatar
              name={getDisplayName()}
              profileImageUrl={userData?.profilePicture}
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-lg truncate">
              {getDisplayName()}
            </h4>
            <p className="text-gray-600 text-sm truncate">Enterprise</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => {
            onClose();
            navigate("/pricing");
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

      <div className="p-4">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-red-500 bg-white text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
