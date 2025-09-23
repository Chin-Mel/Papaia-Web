import { useState, useEffect, useRef } from "react";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  Camera,
  Edit3,
  Tractor,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../utils/security";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import defaultUserPic from "../assets/default-user.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [farmCount, setFarmCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const loggedInUser = getLoggedInUser();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!loggedInUser || !token) return;

    // Set initial user data
    setUserData(loggedInUser);

    let mounted = true;

    // Fetch latest user data from server to ensure we have current info
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${loggedInUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const data = await res.json();
          // Handle both possible response formats
          const user = data.user || data;
          if (mounted) {
            setUserData(user);
            // Update localStorage with fresh data
            localStorage.setItem("user", JSON.stringify(user));
          }
        }
      } catch (err) {
        console.warn("Could not fetch fresh user data:", err.message);
      }
    };

    const fetchFarmCount = async () => {
      try {
        const res = await fetch(
          "https://papaiaapi.onrender.com/api/owner/count-farms",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          if (res.status === 401) console.warn("Unauthorized: invalid token");
          else console.warn("Failed to fetch farm count:", res.status);
          return;
        }

        const data = await res.json();
        // Use the correct property name from API docs
        if (mounted) setFarmCount(data.farmCount ?? 0);
      } catch (err) {
        console.warn("Could not fetch farm count:", err.message);
      }
    };

    fetchUserData();
    fetchFarmCount();

    // Listen for user updates from other components
    const handleUserUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (mounted && updatedUser.id) {
        setUserData(updatedUser);
      }
    };

    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      mounted = false;
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !token) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/profile-picture",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update profile picture");
      }

      const updatedData = await res.json();

      // Update userData with new profile picture, preserving existing data
      const updatedUserData = {
        ...userData,
        ...updatedData,
        profilePicture: updatedData.profilePicture,
      };

      setUserData(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      // Dispatch event to update header and other components immediately
      window.dispatchEvent(new Event("userUpdated"));

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      alert("Error uploading profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const renderField = (value) => (
    <span className={value ? "text-gray-800" : "text-gray-400 italic"}>
      {value || "N/A"}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getFullName = () => {
    const { firstName, lastName, middleName } = userData;
    if (firstName && lastName) {
      return middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;
    }
    return userData.username || "N/A";
  };

  // Fixed profile picture URL generation
  const getProfilePictureUrl = () => {
    if (userData.profilePicture) {
      // If it's already a full URL, use it as is
      if (userData.profilePicture.startsWith("http")) {
        return userData.profilePicture;
      }
      // If it's a relative path, prepend the API base URL
      return `https://papaiaapi.onrender.com${userData.profilePicture}`;
    }
    return defaultUserPic;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 mt-16 px-4 sm:px-6 lg:px-8 mb-5">
        <div className="w-full">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Profile Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your account information and preferences
            </p>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureUpload}
            accept="image/*"
            style={{ display: "none" }}
          />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Profile Card */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col items-center">
                {/* Profile Picture */}
                <div className="relative">
                  <img
                    src={getProfilePictureUrl()}
                    alt={getFullName()}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100"
                    onError={(e) => {
                      e.currentTarget.src = defaultUserPic;
                    }}
                  />

                  {/* Camera button */}
                  <button
                    onClick={handleCameraClick}
                    disabled={uploading}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-full flex items-center justify-center shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Change profile picture"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* User Info */}
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-4 mb-1 text-center">
                  {getFullName()}
                </h2>
                <p className="text-gray-600 text-sm mb-3">Farm Owner</p>

                {/* Farm Count Card */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Tractor className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Farms Managed
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {farmCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                  <h3 className="text-lg font-bold text-gray-800 text-center sm:text-left">
                    Personal Information
                  </h3>
                  <button
                    onClick={handleEditProfile}
                    disabled={!userData.id}
                    className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition shadow hover:shadow-md self-center sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(getFullName())}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <AtSign className="w-4 h-4" /> Username
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(userData.username)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(userData.email)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" /> Contact Number
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(userData.contactNumber)}
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4" /> Birth Date
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(formatDate(userData.birthDate))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
