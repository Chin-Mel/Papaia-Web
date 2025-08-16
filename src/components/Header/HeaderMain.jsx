import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { secureLogout } from "../../utils/security";

export default function HeaderMain() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [notifications] = useState(3); // Mock data
  const location = useLocation();

  useEffect(() => {
    // Set active nav based on current path
    const path = location.pathname;
    if (path === "/dashboard") setActiveNav("dashboard");
    else if (path === "/scan-history") setActiveNav("scan-history");
    else if (path === "/about") setActiveNav("about");
    else if (path === "/profile") setActiveNav("profile");
    else if (path === "/edit-profile") setActiveNav("edit-profile");
    else if (path === "/farm-dashboard") setActiveNav("farm-dashboard");
    else if (path === "/scan-details") setActiveNav("scan-details");
  }, [location.pathname]);

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  };

  const handleLogout = () => {
    // Use secure logout function
    secureLogout();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-[#4A7C59] to-[#FF8C42] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Papaia</span>
        </div>

        {/* Navigation */}
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

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          {/* Welcome Message */}
          <span className="text-gray-700 font-medium">
            Welcome Back, John Michael!
          </span>

          {/* Notification Bell */}
          <div className="relative">
            <button className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l2.25 2.25H2.25L4.5 13.5V9.75a6 6 0 0 1 6-6z"
                />
              </svg>
            </button>
            {notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {notifications}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <img
                src="https://source.unsplash.com/32x32/?man,portrait"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <svg
                className="w-4 h-4"
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
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
