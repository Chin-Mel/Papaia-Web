import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Trash2,
  Save,
  Camera,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/FooterMain";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/Popups/ChangePasswordModal";
import DeactivateAccountModal from "../components/Popups/DeactivateAccountModal";
import DeleteAccountModal from "../components/Popups/DeleteAccountModal";

function EditProfilePage() {
  const [userData, setUserData] = useState({});
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeactivateAccountModal, setShowDeactivateAccountModal] =
    useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const userId = user?.id;
  const token = localStorage.getItem("token");
  const fileInputRef = useRef();

  // Fetch current user data
  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        const user = data.user || data;
        setUserData(user);
        setFormValues({
          firstName: user.firstName || "",
          middleName: user.middleName || "",
          lastName: user.lastName || "",
          username: user.username || "",
          email: user.email || "",
          contactNumber: user.contactNumber || "",
          birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
        });
      } catch (err) {
        console.error(err);
        alert("Error fetching user data");
      }
    };

    fetchUserData();
  }, [userId, token, navigate]);

  // Handle input changes
  const handleChange = (key, value) => {
    setFormValues({ ...formValues, [key]: value });
  };

  // Handle profile picture upload - FIXED ENDPOINT
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !token) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      // Fixed: Use correct endpoint from API docs
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/profile-picture`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to upload profile picture");

      const updatedUser = await res.json();

      // Update userData with new profile picture, preserving other data
      const updatedUserData = {
        ...userData,
        ...updatedUser,
        profilePicture: updatedUser.profilePicture,
      };
      setUserData(updatedUserData);

      // Update localStorage with complete user data
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      // Dispatch event to update header and other components immediately
      window.dispatchEvent(new Event("userUpdated"));

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading profile picture");
    } finally {
      setUploading(false);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      const updatedData = {};

      // Include only changed fields
      [
        "firstName",
        "middleName",
        "lastName",
        "username",
        "email",
        "contactNumber",
        "birthDate",
      ].forEach((key) => {
        if (formValues[key] !== userData[key]) {
          updatedData[key] = formValues[key];
        }
      });

      // Always include required fields
      updatedData.username = formValues.username || userData.username;
      updatedData.email = formValues.email || userData.email;
      updatedData.role = "owner";

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
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update user");
      }

      const updated = await res.json();

      // Preserve profile picture if it exists
      const finalUserData = {
        ...userData,
        ...updated,
        profilePicture: userData.profilePicture || updated.profilePicture,
      };

      localStorage.setItem("user", JSON.stringify(finalUserData));
      setUserData(finalUserData);
      setFormValues({
        firstName: finalUserData.firstName || "",
        middleName: finalUserData.middleName || "",
        lastName: finalUserData.lastName || "",
        username: finalUserData.username || "",
        email: finalUserData.email || "",
        contactNumber: finalUserData.contactNumber || "",
        birthDate: finalUserData.birthDate
          ? finalUserData.birthDate.split("T")[0]
          : "",
      });

      // Dispatch event to update other components
      window.dispatchEvent(new Event("userUpdated"));

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleCloseChangePasswordModal = () =>
    setShowChangePasswordModal(false);
  const handleCloseDeactivateAccountModal = () =>
    setShowDeactivateAccountModal(false);
  const handleCloseDeleteAccountModal = () => setShowDeleteAccountModal(false);

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <HeaderMain />

      <main className="flex-1 px-4 sm:px-6 lg:px-16 py-10 mt-0">
        {/* Profile Picture Upload Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePictureUpload}
          accept="image/*"
          style={{ display: "none" }}
        />

        {/* Top Profile Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 pb-8 border-b border-gray-200 mb-5">
          {/* Profile Picture with Status Icon and Camera Button */}
          <div className="relative mb-4 sm:mb-0">
            <img
              src={
                userData.profilePicture
                  ? `https://papaiaapi.onrender.com${userData.profilePicture}`
                  : "/default-user.png"
              }
              alt={`${userData.firstName || ""} ${userData.lastName || ""}`}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md mx-auto sm:mx-0 object-cover"
              onError={(e) => (e.currentTarget.src = "/default-user.png")}
            />

            {/* Status Icon */}
            <div className="absolute bottom-1 right-8 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Camera Button */}
            <button
              onClick={handleCameraClick}
              disabled={uploading}
              className="absolute bottom-1 right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white hover:bg-orange-600 transition-colors disabled:opacity-50"
              title="Change profile picture"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-base sm:text-lg text-gray-500">Farm Owner</p>

            {/* Extra Details */}
            <div className="flex flex-col sm:flex-row sm:space-x-6 mt-3 text-gray-500 text-sm sm:text-base">
              <div className="flex items-center justify-center sm:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                  />
                </svg>
                Joined{" "}
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
              Personal Information
            </h2>
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2 rounded-lg border border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProfileInput
              label="First Name"
              icon={<User size={20} />}
              value={formValues.firstName}
              placeholder={userData.firstName || "First Name"}
              onChange={(val) => handleChange("firstName", val)}
            />

            <ProfileInput
              label="Middle Name"
              icon={<User size={20} />}
              value={formValues.middleName}
              placeholder={userData.middleName || "Middle Name"}
              onChange={(val) => handleChange("middleName", val)}
            />

            <ProfileInput
              label="Last Name"
              icon={<User size={20} />}
              value={formValues.lastName}
              placeholder={userData.lastName || "Last Name"}
              onChange={(val) => handleChange("lastName", val)}
            />

            <ProfileInput
              label="Username"
              icon={<User size={20} />}
              value={formValues.username}
              placeholder={userData.username || "Username"}
              onChange={(val) => handleChange("username", val)}
            />

            <ProfileInput
              label="Email Address"
              type="email"
              icon={<Mail size={20} />}
              value={formValues.email}
              placeholder={userData.email || "Email"}
              onChange={(val) => handleChange("email", val)}
            />

            <ProfileInput
              label="Contact Number"
              type="tel"
              icon={<Phone size={20} />}
              value={formValues.contactNumber}
              placeholder={userData.contactNumber || "Contact Number"}
              onChange={(val) => handleChange("contactNumber", val)}
            />

            <ProfileInput
              label="Birth Date"
              type="date"
              icon={<Calendar size={20} />}
              value={formValues.birthDate}
              placeholder={userData.birthDate || "mm/dd/yyyy"}
              onChange={(val) => handleChange("birthDate", val)}
            />
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
            Security & Privacy
          </h2>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-xl shadow border border-gray-200">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-medium text-gray-800">
                Change Password
              </h3>
              <p className="text-sm text-gray-500">
                Update your account password to keep it secure
              </p>
            </div>
            <button
              onClick={() => setShowChangePasswordModal(true)}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Shield size={20} className="mr-2" />
              Change Password
            </button>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="p-6 rounded-2xl border-2 border-red-500 bg-white">
          <h2 className="text-xl sm:text-2xl font-semibold text-red-700 mb-6">
            Danger Zone
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 bg-red-100 rounded-xl gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-red-800">
                  Deactivate Account
                </h3>
                <p className="text-sm text-red-600">
                  Temporarily disable your account. You can reactivate it
                  anytime.
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateAccountModal(true)}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center px-5 py-2 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              >
                Deactivate Account
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 bg-red-100 rounded-xl gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-red-800">
                  Delete Account
                </h3>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteAccountModal(true)}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center px-5 py-2 rounded-lg border border-red-800 text-red-800 font-medium hover:bg-red-800 hover:text-white transition-colors disabled:opacity-50"
              >
                <Trash2 size={18} className="mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
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
      {showDeleteAccountModal && (
        <DeleteAccountModal
          isOpen={showDeleteAccountModal}
          onClose={handleCloseDeleteAccountModal}
        />
      )}

      <FooterMain />
    </div>
  );
}

const ProfileInput = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default EditProfilePage;
