import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Bell } from "lucide-react";
import { getLoggedInUser } from "../../utils/security";
import { useNotifications } from "../../NotificationContext";

import papaiaLogo from "../../assets/ic_papaia_logo_no_word.png";
import hamburgerMenuIcon from "../../assets/burger-bar.png";
import defaultUser from "../../assets/default-user.png";

import ProfileDropdown from "../Popups/ProfileDropdown";
import NotificationDropdown from "../Popups/NotificationDropdown";
import LogoutModal from "../Popups/LogoutModal";

export default function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Scan History", href: "/scan-history" },
    { label: "About", href: "/about" },
  ];

  useEffect(() => {
    const loadUser = () => {
      const user = getLoggedInUser();
      setUserData(user);
    };

    loadUser();

    const handleUserUpdate = () => loadUser();
    window.addEventListener("userUpdated", handleUserUpdate);

    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleConfirmLogout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();

    setUserData(null);
    setShowLogoutModal(false);
    setIsProfileOpen(false);
    setIsMenuOpen(false);

    window.location.href = "/sign-in";
  };

  const getProfilePictureUrl = () => {
    return userData?.profilePicture || defaultUser;
  };

  const getDisplayName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData?.username || "User";
  };

  const handleMobileProfileClick = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const handleNotificationClick = () => {
    if (window.innerWidth < 1024) {
      navigate("/notifications");
    } else {
      setIsNotifOpen(!isNotifOpen);
      setIsProfileOpen(false);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotifOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (
        !target.closest(".notification-container") &&
        !target.closest(".profile-container")
      ) {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    };

    if (isNotifOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isNotifOpen, isProfileOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-3 sm:px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-6">
            <Link to="/dashboard">
              <img
                src={PapaiaLogo}
                alt="Papaia Logo"
                className="w-5 h-7 sm:w-6 sm:h-8 md:w-7 md:h-9 object-contain"
              />
            </Link>

            <nav className="hidden lg:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`cursor-pointer font-medium px-3 py-1 rounded-md text-base transition-colors
                    ${
                      location.pathname === item.href
                        ? "bg-[#4A7C59] text-white"
                        : "text-[#4A7C59] hover:text-black hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 relative">
            <span className="hidden md:block text-[#4A7C59] font-medium truncate max-w-[180px]">
              {userData
                ? `Welcome, ${userData.username || "User"}!`
                : "Loading..."}
            </span>

            <div className="relative notification-container">
              <button
                className={`relative cursor-pointer p-2 rounded-full transition-colors
                  ${
                    isNotifOpen
                      ? "bg-gray-100 text-[#4A7C59]"
                      : "text-[#4A7C59] hover:text-black hover:bg-gray-100"
                  }`}
                onClick={handleNotificationClick}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              <div className="hidden lg:block">
                <NotificationDropdown
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  loading={loading}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 relative profile-container">
              <button
                className={`flex items-center gap-2 rounded-md px-2 py-1 transition-colors
                  ${
                    isProfileOpen
                      ? "bg-gray-100"
                      : "hover:bg-gray-100 active:bg-gray-200"
                  }`}
                onClick={handleProfileClick}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={getProfilePictureUrl()}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultUser;
                    }}
                  />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {isProfileOpen && (
                <ProfileDropdown
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onLogout={handleLogoutClick}
                  user={userData}
                />
              )}
            </div>

            <button
              className="lg:hidden text-[#2D5016]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <img
                src={hamburgerMenuIcon}
                alt="Menu"
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-100 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block cursor-pointer font-medium px-3 py-2 rounded-md text-base transition-colors
                  ${
                    location.pathname === item.href
                      ? "bg-[#4A7C59] text-white"
                      : "text-[#4A7C59] hover:text-black hover:bg-gray-100"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-gray-200 my-2"></div>

            <button
              onClick={handleMobileProfileClick}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <img
                  src={getProfilePictureUrl()}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultUser;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-base truncate">
                  {getDisplayName()}
                </p>
                <p className="text-gray-500 text-sm truncate">View Profile</p>
              </div>
            </button>

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      <div className="pt-14 sm:pt-16"></div>
    </>
  );
}
