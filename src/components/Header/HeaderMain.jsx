import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { secureLogout, getLoggedInUser } from "../../utils/security";

import papaiaLogo from "../../assets/papaia-logo.png";
import notificationIcon from "../../assets/bell-icon.png";
import hamburgerMenuIcon from "../../assets/burger-bar.png";
import defaultUser from "../../assets/default-user.png";

import ProfileDropdown from "../Popups/ProfileDropdown";
import NotificationDropdown from "../Popups/NotificationDropdown";
import { ChevronDown, LogOut } from "lucide-react";

export default function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notificationCount] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Scan History", href: "/scan-history" },
    { label: "About", href: "/about" },
  ];

  // Load user initially + listen for updates
  useEffect(() => {
    const loadUser = () => {
      const user = getLoggedInUser();
      setUserData(user);
    };

    loadUser();

    // Listen for profile updates in the same tab
    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
    secureLogout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate("/sign-in");
  };

  // Helper function to get profile picture URL
  const getProfilePictureUrl = () => {
    if (userData?.profilePicture) {
      if (userData.profilePicture.startsWith("http")) {
        return userData.profilePicture;
      }
      return `https://papaiaapi.onrender.com${userData.profilePicture}`;
    }
    return defaultUser;
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData?.username || "User";
  };

  // Handle mobile profile click
  const handleMobileProfileClick = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-3 sm:px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center">
              <img src={papaiaLogo} alt="Papaia Logo" className="w-7 h-7" />
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

          {/* Right: Welcome + Notifications + Profile + Burger */}
          <div className="flex items-center gap-4 relative">
            {/* Welcome Message */}
            <span className="hidden md:block text-[#4A7C59] font-medium truncate max-w-[180px]">
              {userData
                ? `Welcome, ${
                    userData.firstName || userData.username || "User"
                  }!`
                : "Loading..."}
            </span>

            {/* Notification */}
            <div className="relative">
              <button
                className={`relative cursor-pointer p-2 rounded-full transition-colors
                  ${
                    isNotifOpen
                      ? "bg-gray-100 text-[#4A7C59]"
                      : "text-[#4A7C59] hover:text-black hover:bg-gray-100"
                  }`}
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <img
                  src={notificationIcon}
                  alt="Notifications"
                  className="w-5 h-5"
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notificationCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            {/* Desktop Profile */}
            <div className="hidden lg:flex items-center gap-2 relative">
              <button
                className={`flex items-center gap-2 rounded-md px-2 py-1 transition-colors
                  ${
                    isProfileOpen
                      ? "bg-gray-100"
                      : "hover:bg-gray-100 active:bg-gray-200"
                  }`}
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={getProfilePictureUrl()}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = defaultUser;
                    }}
                  />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isProfileOpen && (
                <ProfileDropdown
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onLogout={handleLogout}
                  user={userData}
                />
              )}
            </div>

            {/* Mobile Burger */}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-100 space-y-3">
            {/* Navigation Links */}
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

            {/* Mobile Profile Section - Clickable */}
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

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="pt-14 sm:pt-16"></div>
    </>
  );
}
