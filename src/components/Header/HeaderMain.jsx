import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { secureLogout, getLoggedInUser } from "../../utils/security";
import ProfileDropdown from "../Popups/ProfileDropdown";
import defaultUser from "../../assets/default-user.png"; // ✅ Import default profile image

export default function HeaderMain() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [notifications] = useState(3);
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items mapping
  const navRoutes = {
    "/dashboard": "dashboard",
    "/scan-history": "scan-history",
    "/about": "about",
  };

  // Sync active nav with current route
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedNav = navRoutes[currentPath];

    if (matchedNav) {
      setActiveNav(matchedNav);
    } else if (currentPath.startsWith("/farm-dashboard/")) {
      setActiveNav("dashboard");
    } else {
      setActiveNav("dashboard");
    }
  }, [location.pathname]);

  // Fetch user data
  useEffect(() => {
    const user = getLoggedInUser();
    const token = localStorage.getItem("token");

    if (user?.id && token) {
      fetch(`https://papaiaapi.onrender.com/api/user/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("User not found or unauthorized");
          return res.json();
        })
        .then((data) => {
          setUserData(data); // store whole user object
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);

    switch (navItem) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "scan-history":
        navigate("/scan-history");
        break;
      case "about":
        navigate("/about");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleLogout = () => secureLogout();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
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
          {["dashboard", "scan-history", "about"].map((nav) => (
            <button
              key={nav}
              onClick={() => handleNavClick(nav)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-poppins ${
                activeNav === nav
                  ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white font-bold"
                  : "text-[#4A7C59] font-normal hover:text-[#2D5016]"
              }`}
            >
              {nav
                .split("-")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
            </button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          <span className="text-gray-700 font-medium">
            Welcome Back,{" "}
            {userData?.firstName
              ? `${userData.firstName} ${userData.lastName}`
              : "..."}
            !
          </span>

          {/* Notifications */}
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
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <img
                src={userData?.profilePicture || defaultUser} // ✅ Use defaultUser if no profile picture
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

            {showProfileModal && (
              <ProfileDropdown
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                onLogout={handleLogout}
                user={userData}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
