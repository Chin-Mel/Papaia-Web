import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Calendar,
  Save,
  Key,
  UserMinus,
  Trash2,
  User,
  AtSign,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../utils/security";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import defaultUserPic from "../assets/default-user.png";

export default function EditProfilePage() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getLoggedInUser();
        const token = localStorage.getItem("token");

        if (!user?.id || !token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `https://papaiaapi.onrender.com/api/user/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userInfo = await response.json();
        setUserData(userInfo.user || userInfo);

        // Set form data with current user data
        setFormData({
          firstName: userInfo.user?.firstName || userInfo.firstName || "",
          lastName: userInfo.user?.lastName || userInfo.lastName || "",
          username: userInfo.user?.username || userInfo.username || "",
          email: userInfo.user?.email || userInfo.email || "",
          phone:
            userInfo.user?.phone ||
            userInfo.phone ||
            userInfo.user?.contactNumber ||
            userInfo.contactNumber ||
            "",
          dateOfBirth:
            userInfo.user?.dateOfBirth ||
            userInfo.dateOfBirth ||
            userInfo.user?.birthDate ||
            userInfo.birthDate ||
            "",
          address: userInfo.user?.address || userInfo.address || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors({ general: "Failed to load user data" });
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataUpload = new FormData();
      formDataUpload.append("profilePicture", file);

      const response = await fetch(
        "https://papaiaapi.onrender.com/api/profile-picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }

      const result = await response.json();

      // Update userData with new profile picture
      setUserData((prev) => ({
        ...prev,
        profilePicture:
          result.profilePicture || result.profilePictureUrl || result.imageUrl,
      }));
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

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const user = getLoggedInUser();
      const token = localStorage.getItem("token");

      if (!user?.id || !token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://papaiaapi.onrender.com/api/user/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        const errorData = await response.json();
        setErrors({
          general:
            errorData.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({
        general: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleDeactivateAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate your account? This action can be reversed later."
      )
    ) {
      alert("Account deactivation feature coming soon!");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
      )
    ) {
      alert("Account deletion feature coming soon!");
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 mt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={userData.profilePicture || defaultUserPic}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                  onError={(e) => {
                    e.target.src = defaultUserPic;
                  }}
                />
                <button
                  onClick={handleCameraClick}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Camera className="w-3 h-3 text-white" />
                  )}
                </button>
                {/* Green online indicator */}
                <div className="absolute bottom-1 right-5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.username || "User"}
                </h1>
                <p className="text-gray-600 mb-2">Farm Owner</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📅 Joined March 2023</span>
                  <span>🏛️ Consolacion, Cebu</span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>💾 Save Changes</>
                )}
              </button>
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={`${formData.firstName} ${formData.lastName}`.trim()}
                  onChange={(e) => {
                    const names = e.target.value.split(" ");
                    const firstName = names[0] || "";
                    const lastName = names.slice(1).join(" ") || "";
                    handleInputChange("firstName", firstName);
                    handleInputChange("lastName", lastName);
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Anderson"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="john_anderson"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="john.anderson@agrotech.com"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.dateOfBirth)}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="1234 Farm Road, Fresno, CA 93720"
                />
              </div>
            </div>
          </div>

          {/* Security & Privacy Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Security & Privacy
            </h2>

            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500">
                  Update your account password to keep it secure
                </p>
              </div>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                🔐 Change Password
              </button>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Danger Zone
            </h2>

            <div className="space-y-4">
              {/* Deactivate Account */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Deactivate Account
                  </h3>
                  <p className="text-sm text-gray-500">
                    Temporarily disable your account. You can reactivate it
                    anytime.
                  </p>
                </div>
                <button
                  onClick={handleDeactivateAccount}
                  className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  ⛔ Deactivate Account
                </button>
              </div>

              <hr className="border-gray-200" />

              {/* Delete Account */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
