import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  User,
  Shield,
  AlertCircle,
  Camera,
  Calendar,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/Popups/ChangePasswordModal";
import DeactivateAccountModal from "../components/Popups/DeactivateAccountModal";
import { getLoggedInUser } from "../utils/security";
import { useAlert } from "../AlertContext";
import UserAvatar from "../components/UserAvatar";

export default function EditProfilePage() {
  const { showAlert } = useAlert();
  const [userData, setUserData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeactivateAccountModal, setShowDeactivateAccountModal] =
    useState(false);

  const getUserFromStorage = () => {
    try {
      const user = getLoggedInUser();
      const token = localStorage.getItem("token");

      if (!user || !token) {
        return { user: null, token: null, error: "Not authenticated" };
      }

      if (!user.idNumber) {
        return {
          user: null,
          token: null,
          error: "User ID not found in stored data",
        };
      }

      return { user, idNumber: user.idNumber, token, error: null };
    } catch (err) {
      return { user: null, token: null, error: "Invalid user data in storage" };
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { user, idNumber, token, error: authError } = getUserFromStorage();

      if (authError) {
        setError(authError);
        return;
      }

      setUserData(user);
      setFormValues({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        suffix: user.suffix || "",
        username: user.username || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
      });

      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${idNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const freshUser = data.user || data;
          setUserData(freshUser);
          setFormValues({
            firstName: freshUser.firstName || "",
            middleName: freshUser.middleName || "",
            lastName: freshUser.lastName || "",
            suffix: freshUser.suffix || "",
            username: freshUser.username || "",
            email: freshUser.email || "",
            contactNumber: freshUser.contactNumber || "",
          });
          localStorage.setItem("user", JSON.stringify(freshUser));
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePictureSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10485760) {
      showAlert("File size exceeds 10MB limit", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert("Please select a valid image file", "error");
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (key, value) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const handleSaveChanges = async () => {
    if (!formValues.firstName?.trim()) {
      showAlert("First name is required", "error");
      return;
    }

    if (!formValues.lastName?.trim()) {
      showAlert("Last name is required", "error");
      return;
    }

    if (!formValues.username?.trim()) {
      showAlert("Username is required", "error");
      return;
    }

    if (!formValues.email?.trim()) {
      showAlert("Email is required", "error");
      return;
    }

    if (!formValues.contactNumber?.trim()) {
      showAlert("Contact number is required", "error");
      return;
    }

    setLoading(true);

    try {
      const { idNumber, token } = getUserFromStorage();

      if (!idNumber || !token) {
        throw new Error("Authentication error. Please log in again.");
      }

      let updatedProfilePicture = userData.profilePicture;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("profilePicture", selectedImage);

        const res = await fetch(
          "https://papaiaapi.onrender.com/api/profile-picture",
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (res.ok) {
          const data = await res.json();
          updatedProfilePicture = data.profilePicture;
        } else {
          throw new Error("Failed to upload profile picture");
        }
      }

      const updatedData = {};
      Object.keys(formValues).forEach((key) => {
        let newValue = formValues[key];
        if (typeof newValue === "string") {
          newValue = newValue.trim();
        }
        const oldValue = userData[key];
        if (newValue !== oldValue) {
          updatedData[key] = newValue;
        }
      });

      if (Object.keys(updatedData).length === 0 && !selectedImage) {
        showAlert("No changes detected", "info");
        setLoading(false);
        return;
      }

      if (Object.keys(updatedData).length > 0) {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${idNumber}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              errorData.message ||
              `Failed to update profile (Status: ${res.status})`
          );
        }
      }

      const mergedData = {
        ...userData,
        ...updatedData,
        profilePicture: updatedProfilePicture,
      };

      setUserData(mergedData);
      localStorage.setItem("user", JSON.stringify(mergedData));
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setFormValues({
        firstName: mergedData.firstName || "",
        middleName: mergedData.middleName || "",
        lastName: mergedData.lastName || "",
        suffix: mergedData.suffix || "",
        username: mergedData.username || "",
        email: mergedData.email || "",
        contactNumber: mergedData.contactNumber || "",
      });

      window.dispatchEvent(new Event("userUpdated"));
      showAlert("Profile updated successfully!", "success");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      showAlert(
        err.message || "Error updating profile. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureUrl = () => {
    if (previewUrl) return previewUrl;
    return userData?.profilePicture || null;
  };

  const getFullName = () => {
    if (!userData) return "";
    const parts = [
      userData.firstName,
      userData.middleName ? `${userData.middleName.charAt(0)}.` : "",
      userData.lastName,
      userData.suffix || "",
    ];
    return parts.filter(Boolean).join(" ");
  };

  const getJoinedDate = () => {
    if (!userData?.createdAt) return "Recently";
    const date = new Date(userData.createdAt);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleClearAndLogin = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Show error state if authentication fails
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-800 mb-2">
                  Unable to Load Profile
                </h2>
                <p className="text-red-700 mb-4">{error}</p>
              </div>
            </div>
            <button
              onClick={handleClearAndLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Login
            </button>
          </div>
        </main>
        <FooterMain />
      </div>
    );
  }

  // No loading state - show content immediately!
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <HeaderMain />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureSelect}
        accept="image/*"
        style={{ display: "none" }}
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-slate-600">
              Update your personal information and account settings
            </p>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 sm:p-8 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-slate-100 rounded-full text-6xl">
                  <UserAvatar
                    name={getFullName()}
                    profileImageUrl={getProfilePictureUrl()}
                    className="w-full h-full"
                  />
                </div>
                <button
                  onClick={handleCameraClick}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition border-3 border-white"
                  title="Change profile picture"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 truncate">
                {getFullName()}
              </h2>
              <p className="text-slate-600 text-base mb-2">Farm Owner</p>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Joined {getJoinedDate()}</span>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Personal Information
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Update your personal details
                </p>
              </div>
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                value={formValues.firstName}
                placeholder="Enter first name"
                onChange={(val) => handleChange("firstName", val)}
                icon={User}
              />
              <InputField
                label="Last Name"
                value={formValues.lastName}
                placeholder="Enter last name"
                onChange={(val) => handleChange("lastName", val)}
                icon={User}
              />
              <InputField
                label="Username"
                value={formValues.username}
                placeholder="Enter username"
                onChange={(val) => handleChange("username", val)}
                icon={User}
              />
              <InputField
                label="Email Address"
                type="email"
                icon={Mail}
                value={formValues.email}
                placeholder="Enter email address"
                onChange={(val) => handleChange("email", val)}
              />
              <div className="sm:col-span-2">
                <InputField
                  label="Contact Number"
                  type="tel"
                  icon={Phone}
                  value={formValues.contactNumber}
                  placeholder="Enter contact number"
                  onChange={(val) => handleChange("contactNumber", val)}
                />
              </div>
            </div>
          </div>

          {/* Security & Privacy Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Security & Privacy
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Change Password
                </h3>
                <p className="text-sm text-slate-600">
                  Update your account password to keep it secure
                </p>
              </div>
              <button
                onClick={() => setShowChangePasswordModal(true)}
                disabled={loading}
                className="w-full sm:w-auto md:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
            <h2 className="text-xl font-bold text-red-700 mb-4 pb-4 border-b border-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-red-50 rounded-xl border border-red-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Deactivate Account
                </h3>
                <p className="text-sm text-slate-600">
                  Temporarily disable your account. You can reactivate it
                  anytime.
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateAccountModal(true)}
                disabled={loading}
                className="w-full sm:w-auto md:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
      {showDeactivateAccountModal && (
        <DeactivateAccountModal
          isOpen={showDeactivateAccountModal}
          onClose={() => setShowDeactivateAccountModal(false)}
        />
      )}

      <FooterMain />
    </div>
  );
}

const InputField = ({
  label,
  value,
  placeholder,
  onChange,
  optional,
  type = "text",
  icon: Icon = User,
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <Icon className="w-4 h-4 text-slate-400" />
      {label}
      {optional && (
        <span className="text-slate-400 font-normal">(Optional)</span>
      )}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
    />
  </div>
);
