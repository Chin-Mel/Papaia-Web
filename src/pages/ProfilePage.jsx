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
  const [userData, setUserData] = useState(null);
  const [farmCount, setFarmCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Get user status based on last login
  const getUserStatus = (lastLogin) => {
    if (!lastLogin) return { status: "inactive", color: "red" };

    const lastLoginDate = new Date(lastLogin);
    const currentDate = new Date();
    const daysDifference = Math.floor(
      (currentDate - lastLoginDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference >= 3) {
      return { status: "inactive", color: "red" };
    } else {
      return { status: "active", color: "green" };
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getLoggedInUser();
        const token = localStorage.getItem("token");

        if (!user?.id || !token) {
          navigate("/login");
          return;
        }

        // Fetch user details
        const userResponse = await fetch(
          `https://papaiaapi.onrender.com/api/user/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userInfo = await userResponse.json();
        setUserData(userInfo);

        // Fetch farm count
        const farmResponse = await fetch(
          "https://papaiaapi.onrender.com/api/owner/count-farms",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (farmResponse.ok) {
          const farmData = await farmResponse.json();
          setFarmCount(farmData.farmCount || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch(
        "https://papaiaapi.onrender.com/api/profile-picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }

      const result = await response.json();

      // Update userData with new profile picture
      setUserData((prev) => ({
        ...prev,
        profilePicture: result.profilePicture || result.profilePictureUrl,
      }));

      // Trigger a refresh of the header component by reloading user data
      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 mt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 mt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Failed to load profile data.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const userStatus = getUserStatus(userData.lastLogin);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Main Content */}
      <main className="flex-1 mt-16 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={userData.profilePicture || defaultUserPic}
                      alt={`${userData.firstName} ${userData.lastName}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                      onError={(e) => {
                        e.target.src = defaultUserPic;
                      }}
                    />
                    <button
                      onClick={handleCameraClick}
                      disabled={uploading}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>

                  {/* User Info */}
                  <h2 className="text-xl font-bold text-gray-800 mt-4 mb-1">
                    {userData.firstName && userData.lastName
                      ? `${userData.firstName} ${userData.lastName}`
                      : userData.username || "User"}
                  </h2>
                  <p className="text-gray-600 mb-3">Farm Owner</p>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className={`w-3 h-3 bg-${userStatus.color}-500 rounded-full`}
                    ></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {userStatus.status}
                    </span>
                  </div>
                </div>

                {/* Farms Managed */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
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

            {/* Right Panel - Personal Information Display */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Form Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Personal Information
                  </h3>
                  <button
                    onClick={handleEditProfile}
                    className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                {/* Information Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.firstName && userData.lastName
                        ? `${userData.firstName} ${userData.lastName}`
                        : "Not provided"}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <AtSign className="w-4 h-4" />
                      Username
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.username || "Not provided"}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.email || "Not provided"}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" />
                      Contact Number
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.phone ||
                        userData.contactNumber ||
                        "Not provided"}
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4" />
                      Birth Date
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.dateOfBirth ||
                        userData.birthDate ||
                        "Not provided"}
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
