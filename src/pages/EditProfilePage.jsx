import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Trash2,
  Save,
  AlertCircle,
  ChevronDown,
  Camera,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/Popups/ChangePasswordModal";
import DeactivateAccountModal from "../components/Popups/DeactivateAccountModal";
import defaultUserPic from "../assets/default-user.png";
import { getLoggedInUser } from "../utils/security";

function EditProfilePage() {
  const [userData, setUserData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeactivateAccountModal, setShowDeactivateAccountModal] =
    useState(false);

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (err) {
      return "";
    }
  };

  // Get user data from localStorage
  const getUserFromStorage = () => {
    try {
      const user = getLoggedInUser();
      const token = localStorage.getItem("token");

      if (!user || !token) {
        return { user: null, token: null, error: "Not authenticated" };
      }

      if (!user.id) {
        return {
          user: null,
          token: null,
          error: "User ID not found in stored data",
        };
      }

      return { user, userId: user.id, token, error: null };
    } catch (err) {
      return { user: null, token: null, error: "Invalid user data in storage" };
    }
  };

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      const { user, userId, token, error: authError } = getUserFromStorage();

      if (authError) {
        setError(authError);
        setInitialLoad(false);
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
        birthDate: formatDateForInput(user.birthDate),
      });

      const url = `https://papaiaapi.onrender.com/api/user/${userId}`;

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
            birthDate: formatDateForInput(freshUser.birthDate),
          });

          localStorage.setItem("user", JSON.stringify(freshUser));
          setError(null);
        } else {
          console.warn(
            `Could not fetch fresh user data (Status: ${res.status}), using localStorage`
          );
        }
      } catch (err) {
        console.warn("Could not fetch fresh user data:", err.message);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile picture selection (preview only, no upload yet)
  const handleProfilePictureSelect = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (file.size > 10485760) {
      alert("File size exceeds 10MB limit");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
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
      alert("First name is required and cannot be empty");
      return;
    }

    if (!formValues.lastName?.trim()) {
      alert("Last name is required and cannot be empty");
      return;
    }

    if (!formValues.username?.trim()) {
      alert("Username is required and cannot be empty");
      return;
    }

    if (!formValues.email?.trim()) {
      alert("Email is required and cannot be empty");
      return;
    }

    if (!formValues.contactNumber?.trim()) {
      alert("Contact number is required and cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const { userId, token } = getUserFromStorage();

      if (!userId || !token) {
        throw new Error("Authentication error. Please log in again.");
      }

      let updatedProfilePicture = userData.profilePicture;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("profilePicture", selectedImage);

        try {
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
        } catch (err) {
          alert(`Error uploading profile picture: ${err.message}`);
          setLoading(false);
          return;
        }
      }

      const updatedData = {};
      Object.keys(formValues).forEach((key) => {
        let newValue = formValues[key];

        if (typeof newValue === "string" && key !== "birthDate") {
          newValue = newValue.trim();
        }

        const oldValue =
          key === "birthDate"
            ? formatDateForInput(userData[key])
            : userData[key];

        if (newValue !== oldValue) {
          updatedData[key] = newValue;
        }
      });

      if (Object.keys(updatedData).length === 0 && !selectedImage) {
        alert("No changes detected");
        setLoading(false);
        return;
      }

      if (Object.keys(updatedData).length > 0) {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${userId}`,
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
        birthDate: formatDateForInput(mergedData.birthDate),
      });

      window.dispatchEvent(new Event("userUpdated"));

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      alert(err.message || "Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChangePasswordModal = () =>
    setShowChangePasswordModal(false);
  const handleCloseDeactivateAccountModal = () =>
    setShowDeactivateAccountModal(false);

  const getProfilePictureUrl = () => {
    if (previewUrl) {
      return previewUrl;
    }

    if (userData?.profilePicture) {
      return `${userData.profilePicture}${
        userData.profilePicture.includes("?") ? "&" : "?"
      }t=${Date.now()}`;
    }
    return defaultUserPic;
  };

  const handleClearAndLogin = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (initialLoad) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </main>
        <FooterMain />
      </div>
    );
  }

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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-yellow-800 mb-2">What to do:</h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Your session may have expired</li>
                <li>Try logging in again</li>
                <li>If the problem persists, contact support</li>
              </ul>
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/scan-history")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-lg">Scan Results</span>
          </button>
          <p className="text-sm text-gray-600 ml-7">
            Detailed analysis of your crop health assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Scanned Image */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Scanned Image
                </h2>
              </div>
              <div className="p-6">
                <img
                  src={
                    scanDetails.imageUrl ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt="Scan"
                  className="w-full h-80 object-cover rounded-lg mb-4 border border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wide">
                      Scan Date
                    </div>
                    <div className="font-semibold text-gray-900">
                      {dateTime.date}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wide">
                      Scan Time
                    </div>
                    <div className="font-semibold text-gray-900">
                      {dateTime.time}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - All other cards */}
          <div className="space-y-6">
            {/* Scan Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Scan Status
                </h2>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    statusInfo.status === "healthy"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      statusInfo.status === "healthy"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span
                    className={`text-sm font-semibold ${
                      statusInfo.status === "healthy"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                      Disease Identified
                    </div>
                    <div className={`text-2xl font-bold ${statusInfo.color}`}>
                      {scanDetails.prediction}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">
                        Confidence Level
                      </span>
                      <span className="font-bold text-gray-900">
                        {confidencePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          statusInfo.status === "healthy"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${confidencePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Information Card */}
            {farmDetails && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Farm Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {(farmerDetails || scanDetails.idNumber) && (
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">
                            {farmerDetails?.fullName ||
                              farmerDetails?.name ||
                              scanDetails.idNumber}
                          </div>
                          <div className="text-sm text-gray-500">Farmer</div>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        Farm Name
                      </div>
                      <div className="font-semibold text-gray-900 text-base">
                        {farmDetails.farmName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Treatment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Suggested Treatment
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-1 text-base">
                    Immediate Action Required
                  </h3>
                </div>
                <ul className="space-y-3">
                  {(apiSuggestions.length > 0
                    ? apiSuggestions
                    : treatmentSuggestions
                  ).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700 leading-relaxed">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterMain />
    </div>
  );
}

// ============================================
// FILE: EditProfilePage.jsx - FIXED LAYOUT
// ============================================
import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Save,
  AlertCircle,
  ChevronDown,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/Footer";
import ChangePasswordModal from "../components/Popups/ChangePasswordModal";
import DeactivateAccountModal from "../components/Popups/DeactivateAccountModal";
import defaultUserPic from "../assets/default-user.png";
import { getLoggedInUser } from "../utils/security";

function EditProfilePage() {
  // ... (keep all state and logic the same until the return statement)

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <HeaderMain />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureSelect}
        accept="image/*"
        style={{ display: "none" }}
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto w-full">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative flex flex-col items-center">
              <img
                src={getProfilePictureUrl()}
                alt={`${userData?.firstName || ""} ${userData?.lastName || ""}`}
                className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-md object-cover"
                onError={(e) => (e.currentTarget.src = defaultUserPic)}
              />

              <button
                onClick={handleCameraClick}
                className="absolute bottom-1 right-1 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition border-2 border-white hover:bg-orange-600"
                title="Change profile picture"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>

              {selectedImage && (
                <p className="text-xs text-orange-600 mt-2 text-center max-w-[140px]">
                  New image selected. Click "Save Changes" to update.
                </p>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {userData?.firstName}{" "}
                {userData?.middleName
                  ? `${userData.middleName.charAt(0)}. `
                  : ""}
                {userData?.lastName}
                {userData?.suffix ? ` ${userData.suffix}` : ""}
              </h1>
              <p className="text-gray-600 mb-3 text-lg">Farm Owner</p>

              <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Joined{" "}
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Personal Information
            </h2>
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={formValues.firstName}
                  placeholder="First Name"
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Middle Name */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Middle Name{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={formValues.middleName}
                  placeholder="Middle Name"
                  onChange={(e) => handleChange("middleName", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={formValues.lastName}
                  placeholder="Last Name"
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Suffix */}
            <ProfileSelect
              label="Suffix"
              value={formValues.suffix}
              onChange={(val) => handleChange("suffix", val)}
              options={[
                { value: "", label: "Select Suffix (Optional)" },
                { value: "Jr.", label: "Jr." },
                { value: "Sr.", label: "Sr." },
                { value: "II", label: "II" },
                { value: "III", label: "III" },
                { value: "IV", label: "IV" },
                { value: "V", label: "V" },
              ]}
            />

            {/* Username */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={formValues.username}
                  placeholder="Username"
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formValues.email}
                  placeholder="Email"
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  value={formValues.contactNumber}
                  placeholder="Contact Number"
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Birth Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Birth Date{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  value={formValues.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                  max={(() => {
                    const today = new Date();
                    today.setFullYear(today.getFullYear() - 18);
                    return today.toISOString().split("T")[0];
                  })()}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Privacy Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">
            Security & Privacy
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Change Password
              </h3>
              <p className="text-sm text-gray-600">
                Update your account password to keep it secure
              </p>
            </div>
            <button
              onClick={() => setShowChangePasswordModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <Shield size={18} />
              Change Password
            </button>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4 pb-4 border-b border-red-200">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-red-50 rounded-xl border border-red-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Deactivate Account
                </h3>
                <p className="text-sm text-gray-600">
                  Temporarily disable your account. You can reactivate it
                  anytime.
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateAccountModal(true)}
                disabled={loading}
                className="px-6 py-3 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
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
          onClose={handleCloseChangePasswordModal}
        />
      )}
      {showDeactivateAccountModal && (
        <DeactivateAccountModal
          isOpen={showDeactivateAccountModal}
          onClose={handleCloseDeactivateAccountModal}
        />
      )}

      <FooterMain />
    </div>
  );
}

// ProfileSelect Component (keep this the same)
const ProfileSelect = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = value || options[0]?.label || "Select";

  return (
    <div className="flex flex-col" ref={dropdownRef}>
      <label className="text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg flex justify-between items-center text-sm hover:bg-gray-50 bg-white transition-all cursor-pointer text-gray-800"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
        </button>
        {isOpen && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-orange-500 hover:text-white text-sm whitespace-nowrap transition-colors"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;

//old
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Mail,
//   Phone,
//   Calendar,
//   User,
//   Shield,
//   Trash2,
//   Save,
//   AlertCircle,
//   ChevronDown,
//   Camera,
// } from "lucide-react";
// import { Navigate } from "react-router-dom";
// import HeaderMain from "../components/Header/HeaderMain";
// import FooterMain from "../components/Footer/Footer";
// import { useNavigate } from "react-router-dom";
// import ChangePasswordModal from "../components/Popups/ChangePasswordModal";
// import DeactivateAccountModal from "../components/Popups/DeactivateAccountModal";
// import DeleteAccountModal from "../components/Popups/DeleteAccountModal";
// import defaultUserPic from "../assets/default-user.png";
// import { getLoggedInUser } from "../utils/security";
// import ProfileInput from "../components/Profile/ProfileInput";
// import ProfileSelect from "../components/Profile/ProfileSelect";

// function EditProfilePage() {
//   const [userData, setUserData] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const [error, setError] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const navigate = useNavigate();

//   const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
//   const [showDeactivateAccountModal, setShowDeactivateAccountModal] =
//     useState(false);
//   const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

//   // Helper function to format date for input[type="date"]
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       // Get YYYY-MM-DD format
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     } catch (err) {
//       return "";
//     }
//   };

//   // Get user data from localStorage
//   const getUserFromStorage = () => {
//     try {
//       const user = getLoggedInUser();
//       const token = localStorage.getItem("token");

//       if (!user || !token) {
//         return { user: null, token: null, error: "Not authenticated" };
//       }

//       if (!user.id) {
//         return {
//           user: null,
//           token: null,
//           error: "User ID not found in stored data",
//         };
//       }

//       return { user, userId: user.id, token, error: null };
//     } catch (err) {
//       return { user: null, token: null, error: "Invalid user data in storage" };
//     }
//   };

//   // Fetch current user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const { user, userId, token, error: authError } = getUserFromStorage();

//       if (authError) {
//         setError(authError);
//         setInitialLoad(false);
//         return;
//       }

//       // SET DATA FROM LOCALSTORAGE FIRST (like Profile Page does)
//       setUserData(user);
//       setFormValues({
//         firstName: user.firstName || "",
//         middleName: user.middleName || "",
//         lastName: user.lastName || "",
//         suffix: user.suffix || "",
//         username: user.username || "",
//         email: user.email || "",
//         contactNumber: user.contactNumber || "",
//         birthDate: formatDateForInput(user.birthDate),
//       });

//       const url = `https://papaiaapi.onrender.com/api/user/${userId}`;

//       try {
//         const res = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // ONLY UPDATE IF SUCCESSFUL (like Profile Page does)
//         if (res.ok) {
//           const data = await res.json();
//           // Handle both possible response formats
//           const freshUser = data.user || data;

//           setUserData(freshUser);
//           setFormValues({
//             firstName: freshUser.firstName || "",
//             middleName: freshUser.middleName || "",
//             lastName: freshUser.lastName || "",
//             suffix: freshUser.suffix || "",
//             username: freshUser.username || "",
//             email: freshUser.email || "",
//             contactNumber: freshUser.contactNumber || "",
//             birthDate: formatDateForInput(freshUser.birthDate),
//           });

//           // Update localStorage with fresh data
//           localStorage.setItem("user", JSON.stringify(freshUser));
//           setError(null);
//         } else {
//           // If fetch fails, just use localStorage data (don't show error)
//           console.warn(
//             `Could not fetch fresh user data (Status: ${res.status}), using localStorage`
//           );
//         }
//       } catch (err) {
//         // If fetch fails, just use localStorage data (don't show error)
//         console.warn("Could not fetch fresh user data:", err.message);
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Handle profile picture upload
//   const handleProfilePictureUpload = async (e) => {
//     const file = e.target.files[0];
//     const { token, userId } = getUserFromStorage();

//     if (!file) {
//       return;
//     }

//     if (!token) {
//       alert("Authentication error. Please log in again.");
//       return;
//     }

//     // Check file size (10MB = 10485760 bytes)
//     if (file.size > 10485760) {
//       alert("File size exceeds 10MB limit");
//       return;
//     }

//     // Check file type
//     if (!file.type.startsWith("image/")) {
//       alert("Please select a valid image file");
//       return;
//     }

//     setUploading(true);

//     const formData = new FormData();
//     formData.append("profilePicture", file);

//     try {
//       const res = await fetch(
//         "https://papaiaapi.onrender.com/api/profile-picture",
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         }
//       );

//       if (!res.ok) {
//         const errorText = await res.text();

//         let errorMessage = "Failed to update profile picture";
//         try {
//           const errorJson = JSON.parse(errorText);
//           errorMessage = errorJson.message || errorJson.error || errorMessage;
//         } catch (e) {
//           errorMessage = errorText || errorMessage;
//         }

//         throw new Error(errorMessage);
//       }

//       const updatedData = await res.json();

//       // Update userData with new profile picture, preserving existing data
//       const updatedUserData = {
//         ...userData,
//         ...updatedData,
//         profilePicture: updatedData.profilePicture,
//       };

//       setUserData(updatedUserData);
//       localStorage.setItem("user", JSON.stringify(updatedUserData));

//       // Dispatch event to update header and other components immediately
//       window.dispatchEvent(new Event("userUpdated"));

//       alert("Profile picture updated successfully!");
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     } finally {
//       setUploading(false);
//       // Clear the file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   };

//   const handleCameraClick = () => {
//     fileInputRef.current?.click();
//   };

//   // Handle input changes
//   const handleChange = (key, value) => {
//     setFormValues({ ...formValues, [key]: value });
//   };

//   // Handle save changes
//   const handleSaveChanges = async () => {
//     // Validate required fields - they cannot be empty
//     if (!formValues.firstName?.trim()) {
//       alert("First name is required and cannot be empty");
//       return;
//     }

//     if (!formValues.lastName?.trim()) {
//       alert("Last name is required and cannot be empty");
//       return;
//     }

//     if (!formValues.username?.trim()) {
//       alert("Username is required and cannot be empty");
//       return;
//     }

//     if (!formValues.email?.trim()) {
//       alert("Email is required and cannot be empty");
//       return;
//     }

//     if (!formValues.contactNumber?.trim()) {
//       alert("Contact number is required and cannot be empty");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { userId, token } = getUserFromStorage();

//       if (!userId || !token) {
//         throw new Error("Authentication error. Please log in again.");
//       }

//       // Build update object with only changed fields
//       const updatedData = {};
//       Object.keys(formValues).forEach((key) => {
//         let newValue = formValues[key];

//         // Trim string values, but keep empty strings for optional fields
//         if (typeof newValue === "string" && key !== "birthDate") {
//           newValue = newValue.trim();
//         }

//         const oldValue =
//           key === "birthDate"
//             ? formatDateForInput(userData[key])
//             : userData[key];

//         // Include the field if it changed
//         // For optional fields (middleName, birthDate), allow empty values
//         if (newValue !== oldValue) {
//           updatedData[key] = newValue;
//         }
//       });

//       if (Object.keys(updatedData).length === 0) {
//         alert("No changes detected");
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(
//         `https://papaiaapi.onrender.com/api/user/${userId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(updatedData),
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(
//           errorData.error ||
//             errorData.message ||
//             `Failed to update profile (Status: ${res.status})`
//         );
//       }

//       const response = await res.json();

//       // Merge updated data with existing data
//       const mergedData = { ...userData, ...updatedData };

//       // Update both state and localStorage immediately
//       setUserData(mergedData);
//       localStorage.setItem("user", JSON.stringify(mergedData));

//       // Update form values to match merged data (with proper date formatting)
//       setFormValues({
//         firstName: mergedData.firstName || "",
//         middleName: mergedData.middleName || "",
//         lastName: mergedData.lastName || "",
//         suffix: mergedData.suffix || "",
//         username: mergedData.username || "",
//         email: mergedData.email || "",
//         contactNumber: mergedData.contactNumber || "",
//         birthDate: formatDateForInput(mergedData.birthDate),
//       });

//       // Dispatch event to update other components (Header, ProfilePage, etc.)
//       window.dispatchEvent(new Event("userUpdated"));

//       alert("Profile updated successfully!");
//       navigate("/profile");
//     } catch (err) {
//       alert(err.message || "Error updating profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseChangePasswordModal = () =>
//     setShowChangePasswordModal(false);
//   const handleCloseDeactivateAccountModal = () =>
//     setShowDeactivateAccountModal(false);
//   const handleCloseDeleteAccountModal = () => setShowDeleteAccountModal(false);

//   const getProfilePictureUrl = () => {
//     if (userData?.profilePicture) {
//       // Profile picture is already a full Firebase Storage URL
//       // Just add cache-busting timestamp
//       return `${userData.profilePicture}${
//         userData.profilePicture.includes("?") ? "&" : "?"
//       }t=${Date.now()}`;
//     }
//     return defaultUserPic;
//   };

//   const handleClearAndLogin = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   // Loading state
//   if (initialLoad) {
//     return (
//       <div className="bg-white min-h-screen flex flex-col">
//         <HeaderMain />
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading your profile...</p>
//           </div>
//         </main>
//         <FooterMain />
//       </div>
//     );
//   }

//   // Error state (only for auth errors, not API failures)
//   if (error) {
//     return (
//       <div className="bg-white min-h-screen flex flex-col">
//         <HeaderMain />
//         <main className="flex-1 flex items-center justify-center p-4">
//           <div className="max-w-lg w-full bg-red-50 border-2 border-red-200 rounded-lg p-6">
//             <div className="flex items-start gap-3 mb-4">
//               <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <AlertCircle className="text-white" size={24} />
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-xl font-bold text-red-800 mb-2">
//                   Unable to Load Profile
//                 </h2>
//                 <p className="text-red-700 mb-4">{error}</p>
//               </div>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
//               <h3 className="font-bold text-yellow-800 mb-2">What to do:</h3>
//               <ul className="list-disc list-inside text-yellow-700 space-y-1">
//                 <li>Your session may have expired</li>
//                 <li>Try logging in again</li>
//                 <li>If the problem persists, contact support</li>
//               </ul>
//             </div>

//             <button
//               onClick={handleClearAndLogin}
//               className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
//             >
//               Return to Login
//             </button>
//           </div>
//         </main>
//         <FooterMain />
//       </div>
//     );
//   }

//   // Main content
//   return (
//     <div className="bg-white min-h-screen flex flex-col">
//       <HeaderMain />

//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleProfilePictureUpload}
//         accept="image/*"
//         style={{ display: "none" }}
//       />

//       <main className="flex-1 px-4 sm:px-6 lg:px-16 py-10 mt-0">
//         {/* Top Profile Info */}
//         <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 pb-8 border-b border-gray-200 mb-5">
//           <div className="relative mb-4 sm:mb-0">
//             <img
//               src={getProfilePictureUrl()}
//               alt={`${userData?.firstName || ""} ${userData?.lastName || ""}`}
//               className="w-28 h-28 rounded-full border-4 border-white shadow-md mx-auto sm:mx-0 object-cover"
//               onError={(e) => (e.currentTarget.src = defaultUserPic)}
//             />

//             {/* Camera button for uploading */}
//             <button
//               onClick={handleCameraClick}
//               disabled={uploading}
//               className="absolute bottom-1 right-2 w-8 h-8 bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-full flex items-center justify-center shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
//               title="Change profile picture"
//             >
//               <Camera className="w-4 h-4 text-white" />
//             </button>
//           </div>

//           <div className="text-center sm:text-left">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//               {userData?.firstName}{" "}
//               {userData?.middleName ? `${userData.middleName.charAt(0)}. ` : ""}
//               {userData?.lastName}
//               {userData?.suffix ? ` ${userData.suffix}` : ""}
//             </h1>
//             <p className="text-base sm:text-lg text-gray-500">Farm Owner</p>

//             <div className="flex flex-col sm:flex-row sm:space-x-6 mt-3 text-gray-500 text-sm sm:text-base">
//               <div className="flex items-center justify-center sm:justify-start">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-5 h-5 mr-1"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
//                   />
//                 </svg>
//                 Joined{" "}
//                 {userData?.createdAt
//                   ? new Date(userData.createdAt).toLocaleString("default", {
//                       month: "long",
//                       year: "numeric",
//                     })
//                   : "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Personal Information Section */}
//         <section className="mb-12">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
//               Personal Information
//             </h2>
//             <button
//               onClick={handleSaveChanges}
//               disabled={loading}
//               className="w-full sm:w-auto flex items-center justify-center px-5 py-2 rounded-lg border border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50"
//             >
//               <Save size={18} className="mr-2" />
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <ProfileInput
//               label="First Name"
//               icon={<User size={20} />}
//               value={formValues.firstName}
//               placeholder="First Name"
//               onChange={(val) => handleChange("firstName", val)}
//             />

//             <ProfileInput
//               label="Middle Name (Optional)"
//               icon={<User size={20} />}
//               value={formValues.middleName}
//               placeholder="Middle Name"
//               onChange={(val) => handleChange("middleName", val)}
//             />

//             <ProfileInput
//               label="Last Name"
//               icon={<User size={20} />}
//               value={formValues.lastName}
//               placeholder="Last Name"
//               onChange={(val) => handleChange("lastName", val)}
//             />

//             <ProfileSelect
//               label="Suffix (Optional)"
//               value={formValues.suffix}
//               onChange={(val) => handleChange("suffix", val)}
//               options={[
//                 { value: "", label: "Select Suffix" },
//                 { value: "Jr.", label: "Jr." },
//                 { value: "Sr.", label: "Sr." },
//                 { value: "II", label: "II" },
//                 { value: "III", label: "III" },
//                 { value: "IV", label: "IV" },
//                 { value: "V", label: "V" },
//               ]}
//             />

//             <ProfileInput
//               label="Username"
//               icon={<User size={20} />}
//               value={formValues.username}
//               placeholder="Username"
//               onChange={(val) => handleChange("username", val)}
//             />

//             <ProfileInput
//               label="Email Address"
//               type="email"
//               icon={<Mail size={20} />}
//               value={formValues.email}
//               placeholder="Email"
//               onChange={(val) => handleChange("email", val)}
//             />

//             <ProfileInput
//               label="Contact Number"
//               type="tel"
//               icon={<Phone size={20} />}
//               value={formValues.contactNumber}
//               placeholder="Contact Number"
//               onChange={(val) => handleChange("contactNumber", val)}
//               required
//             />

//             <ProfileInput
//               label="Birth Date (Optional)"
//               type="date"
//               icon={<Calendar size={20} />}
//               value={formValues.birthDate}
//               placeholder="mm/dd/yyyy"
//               onChange={(val) => handleChange("birthDate", val)}
//               max={(() => {
//                 const today = new Date();
//                 today.setFullYear(today.getFullYear() - 18);
//                 return today.toISOString().split("T")[0];
//               })()}
//             />
//           </div>
//         </section>

//         {/* Security Section */}
//         <section className="mb-12">
//           <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
//             Security & Privacy
//           </h2>
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-xl shadow border border-gray-200">
//             <div className="flex-1 text-center sm:text-left">
//               <h3 className="text-lg font-medium text-gray-800">
//                 Change Password
//               </h3>
//               <p className="text-sm text-gray-500">
//                 Update your account password to keep it secure
//               </p>
//             </div>
//             <button
//               onClick={() => setShowChangePasswordModal(true)}
//               disabled={loading}
//               className="w-full sm:w-auto flex items-center justify-center bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow hover:bg-orange-600 transition-colors disabled:opacity-50"
//             >
//               <Shield size={20} className="mr-2" />
//               Change Password
//             </button>
//           </div>
//         </section>

//         {/* Danger Zone Section */}
//         <section className="p-6 rounded-2xl border-2 border-red-500 bg-white">
//           <h2 className="text-xl sm:text-2xl font-semibold text-red-700 mb-6">
//             Danger Zone
//           </h2>
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 bg-red-100 rounded-xl gap-4">
//               <div className="text-center sm:text-left">
//                 <h3 className="text-lg font-medium text-red-800">
//                   Deactivate Account
//                 </h3>
//                 <p className="text-sm text-red-600">
//                   Temporarily disable your account. You can reactivate it
//                   anytime.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowDeactivateAccountModal(true)}
//                 disabled={loading}
//                 className="w-full sm:w-auto flex items-center justify-center px-5 py-2 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
//               >
//                 Deactivate Account
//               </button>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 bg-red-100 rounded-xl gap-4">
//               <div className="text-center sm:text-left">
//                 <h3 className="text-lg font-medium text-red-800">
//                   Delete Account
//                 </h3>
//                 <p className="text-sm text-red-600">
//                   Permanently delete your account and all associated data. This
//                   action cannot be undone.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowDeleteAccountModal(true)}
//                 disabled={loading}
//                 className="w-full sm:w-auto flex items-center justify-center px-5 py-2 rounded-lg border border-red-800 text-red-800 font-medium hover:bg-red-800 hover:text-white transition-colors disabled:opacity-50"
//               >
//                 <Trash2 size={18} className="mr-2" />
//                 Delete Account
//               </button>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Modals */}
//       {showChangePasswordModal && (
//         <ChangePasswordModal
//           isOpen={showChangePasswordModal}
//           onClose={handleCloseChangePasswordModal}
//         />
//       )}
//       {showDeactivateAccountModal && (
//         <DeactivateAccountModal
//           isOpen={showDeactivateAccountModal}
//           onClose={handleCloseDeactivateAccountModal}
//         />
//       )}
//       {showDeleteAccountModal && (
//         <DeleteAccountModal
//           isOpen={showDeleteAccountModal}
//           onClose={handleCloseDeleteAccountModal}
//         />
//       )}

//       <FooterMain />
//     </div>
//   );
// }

// const ProfileInput = ({
//   label,
//   icon,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   max,
// }) => {
//   return (
//     <div className="flex flex-col">
//       <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
//       <div className="relative flex items-center">
//         {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
//         <input
//           type={type}
//           value={value || ""}
//           placeholder={placeholder || ""}
//           onChange={(e) => onChange(e.target.value)}
//           max={max}
//           className={`w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow ${
//             icon ? "pl-10" : ""
//           }`}
//         />
//       </div>
//     </div>
//   );
// };

// const ProfileSelect = ({ label, value, onChange, options }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const displayValue = value || "Select Suffix";

//   return (
//     <div className="flex flex-col" ref={dropdownRef}>
//       <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
//       <div className="relative">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl flex justify-between items-center text-sm hover:bg-gray-100 bg-white transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer text-gray-800"
//         >
//           <span className="truncate">{displayValue}</span>
//           <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
//         </button>
//         {isOpen && (
//           <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//             {options.map((option) => (
//               <li
//                 key={option.value}
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                 }}
//                 className="px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-sm whitespace-nowrap"
//               >
//                 {option.label}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditProfilePage;
