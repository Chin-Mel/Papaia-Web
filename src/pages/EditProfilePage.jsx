import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Trash2,
  Save,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/FooterMain";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/Popups/ChangePasswordModal";
import DeactivateAccountModal from "../components/Popups/DeactivateAccountModal";
import DeleteAccountModal from "../components/Popups/DeleteAccountModal";
import defaultUserPic from "../assets/default-user.png";

function EditProfilePage() {
  const [userData, setUserData] = useState({});
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  const navigate = useNavigate();

  // Debug: Log what's in localStorage
  const userFromStorage = localStorage.getItem("user");
  const tokenFromStorage = localStorage.getItem("token");

  console.log("=== EDIT PROFILE DEBUG ===");
  console.log("Raw user from localStorage:", userFromStorage);
  console.log("Token exists:", !!tokenFromStorage);

  let user = null;
  let userId = null;

  try {
    user = userFromStorage ? JSON.parse(userFromStorage) : null;
    console.log("Parsed user object:", user);

    // Try different possible ID field names
    userId = user?.id || user?._id || user?.userId || user?.ID;
    console.log("Extracted userId:", userId);
    console.log("User object keys:", user ? Object.keys(user) : "null");
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeactivateAccountModal, setShowDeactivateAccountModal] =
    useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const token = tokenFromStorage;

  // Fetch current user data
  useEffect(() => {
    if (!userId || !token) {
      console.log("Missing credentials - userId:", userId, "token:", !!token);
      setDebugInfo({
        error: "Missing authentication",
        userId: userId,
        hasToken: !!token,
        userObject: user,
      });

      // Don't redirect immediately, show debug info
      setInitialLoad(false);
      return;
    }

    const fetchUserData = async () => {
      const url = `https://papaiaapi.onrender.com/api/user/${userId}`;
      console.log("Fetching user from:", url);

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);

        if (!res.ok) {
          if (res.status === 404) {
            setDebugInfo({
              error: "User not found (404)",
              userId: userId,
              url: url,
              suggestion:
                "The user ID in localStorage may be invalid or the user was deleted",
            });

            // Show error but don't redirect yet
            setInitialLoad(false);
            return;
          }
          throw new Error(`Failed to fetch user data: ${res.status}`);
        }

        const data = await res.json();
        console.log("User data received:", data);

        setUserData(data);
        setFormValues({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          username: data.username || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
        });
        setDebugInfo(null); // Clear debug info on success
      } catch (err) {
        console.error("Error fetching user data:", err);
        setDebugInfo({
          error: err.message,
          userId: userId,
          url: url,
        });
      } finally {
        setInitialLoad(false);
      }
    };

    fetchUserData();
  }, [userId, token, navigate]);

  // Handle input changes
  const handleChange = (key, value) => {
    setFormValues({ ...formValues, [key]: value });
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!formValues.username || !formValues.email) {
      alert("Username and email are required fields");
      return;
    }

    if (!formValues.firstName || !formValues.lastName) {
      alert("First name and last name are required fields");
      return;
    }

    setLoading(true);

    try {
      const updatedData = {};

      Object.keys(formValues).forEach((key) => {
        const newValue = formValues[key];
        const oldValue = userData[key];

        if (newValue !== oldValue && newValue !== "") {
          updatedData[key] = newValue;
        }
      });

      if (Object.keys(updatedData).length === 0) {
        alert("No changes detected");
        setLoading(false);
        return;
      }

      console.log("Sending update data:", updatedData);

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
        console.error("Update failed:", errorData);
        throw new Error(
          errorData.error ||
            errorData.message ||
            `Failed to update profile: ${res.status}`
        );
      }

      const updatedUser = await res.json();
      console.log("Updated user response:", updatedUser);

      const mergedData = { ...userData, ...updatedData };
      setUserData(mergedData);
      localStorage.setItem("user", JSON.stringify(mergedData));

      setFormValues({
        firstName: mergedData.firstName || "",
        middleName: mergedData.middleName || "",
        lastName: mergedData.lastName || "",
        username: mergedData.username || "",
        email: mergedData.email || "",
        contactNumber: mergedData.contactNumber || "",
        birthDate: mergedData.birthDate
          ? mergedData.birthDate.split("T")[0]
          : "",
      });

      window.dispatchEvent(new Event("userUpdated"));

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || "Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChangePasswordModal = () =>
    setShowChangePasswordModal(false);
  const handleCloseDeactivateAccountModal = () =>
    setShowDeactivateAccountModal(false);
  const handleCloseDeleteAccountModal = () => setShowDeleteAccountModal(false);

  const getProfilePictureUrl = () => {
    if (userData.profilePicture) {
      if (userData.profilePicture.startsWith("http")) {
        return userData.profilePicture;
      }
      return `https://papaiaapi.onrender.com${userData.profilePicture}`;
    }
    return defaultUserPic;
  };

  // Handle clearing localStorage and redirecting to login
  const handleClearAndLogin = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (initialLoad) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </main>
        <FooterMain />
      </div>
    );
  }

  // Show debug information if there's an error
  if (debugInfo) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">!</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-800 mb-2">
                  Authentication Error
                </h2>
                <p className="text-red-700 mb-4">{debugInfo.error}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 font-mono text-sm">
              <h3 className="font-bold text-gray-800 mb-2">
                Debug Information:
              </h3>
              <pre className="whitespace-pre-wrap text-gray-700">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-yellow-800 mb-2">
                Possible Solutions:
              </h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Your session may have expired - try logging in again</li>
                <li>The user ID in localStorage may be corrupted</li>
                <li>Your account may have been deleted from the database</li>
                <li>
                  Check with your administrator if the API is working correctly
                </li>
              </ul>
            </div>

            <button
              onClick={handleClearAndLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Clear Session & Return to Login
            </button>
          </div>
        </main>
        <FooterMain />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <HeaderMain />

      <main className="flex-1 px-4 sm:px-6 lg:px-16 py-10 mt-0">
        {/* Top Profile Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 pb-8 border-b border-gray-200 mb-5">
          <div className="relative mb-4 sm:mb-0">
            <img
              src={getProfilePictureUrl()}
              alt={`${userData.firstName || ""} ${userData.lastName || ""}`}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md mx-auto sm:mx-0 object-cover"
              onError={(e) => (e.currentTarget.src = defaultUserPic)}
            />

            <div className="absolute bottom-1 right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
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
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-base sm:text-lg text-gray-500">Farm Owner</p>

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
