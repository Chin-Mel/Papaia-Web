import logo from "../../assets/papaia-logo.png";
import bellIcon from "../../assets/notif-icon.png";
import defaultProfileImage from "../../assets/default-user.png";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function HeaderMain() {
  const [profilePic, setProfilePic] = useState(defaultProfileImage);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    const saved = localStorage.getItem("profileImage");
    if (saved && saved !== "undefined" && saved !== "null") {
      setProfilePic(saved);
    }
  }, []);

  useEffect(() => {
    // Set active nav based on current location
    const path = location.pathname;
    if (path === "/dashboard") {
      setActiveNav("dashboard");
    } else if (path === "/scan-history") {
      setActiveNav("scan-history");
    } else if (path === "/about") {
      setActiveNav("about");
    }
  }, [location]);

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-full flex items-center justify-center mr-3">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/dashboard"
              onClick={() => handleNavClick("dashboard")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-poppins ${
                activeNav === "dashboard"
                  ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white font-bold"
                  : "text-[#4A7C59] font-normal hover:text-[#2D5016]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/scan-history"
              onClick={() => handleNavClick("scan-history")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-poppins ${
                activeNav === "scan-history"
                  ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white font-bold"
                  : "text-[#4A7C59] font-normal hover:text-[#2D5016]"
              }`}
            >
              Scan History
            </Link>
            <Link
              to="/about"
              onClick={() => handleNavClick("about")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-poppins ${
                activeNav === "about"
                  ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white font-bold"
                  : "text-[#4A7C59] font-normal hover:text-[#2D5016]"
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right Section - Welcome Message, Notifications, Profile */}
        <div className="flex items-center space-x-6">
          {/* Welcome Message */}
          <div className="text-[#4A7C59] font-poppins">
            Welcome Back, John Michael!
          </div>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <img
              src={bellIcon}
              alt="Notifications"
              className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
            />
            {notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {notifications}
              </div>
            )}
          </div>

          {/* Profile Picture with Dropdown */}
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src={profilePic}
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <svg
              className="w-4 h-4 text-[#4A7C59]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderMain;
