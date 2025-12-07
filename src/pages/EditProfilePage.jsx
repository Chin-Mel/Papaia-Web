import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  User,
  Shield,
  Save,
  AlertCircle,
  ChevronDown,
  Camera,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/Popups/ChangePasswordModal";
import DeactivateAccountModal from "../components/Popups/DeactivateAccountModal";
import defaultUserPic from "../assets/default-user.png";
import { getLoggedInUser } from "../utils/security";
import { useAlert } from "../AlertContext";

export default function EditProfilePage() {
  const { showAlert } = useAlert();
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
      });

      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${userId}`,
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
      } finally {
        setInitialLoad(false);
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
      const { userId, token } = getUserFromStorage();

      if (!userId || !token) {
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
    const pic = userData?.profilePicture;
    if (pic && typeof pic === "string") {
      return `${pic}${pic.includes("?") ? "&" : "?"}t=${Date.now()}`;
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <HeaderMain />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureSelect}
        accept="image/*"
        style={{ display: "none" }}
      />

      <main className="flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <img
                  src={getProfilePictureUrl()}
                  alt={`${userData?.firstName || ""} ${
                    userData?.lastName || ""
                  }`}
                  className="w-24 h-24 rounded-full border-2 border-gray-200 object-cover"
                  onError={(e) => (e.currentTarget.src = defaultUserPic)}
                />
                <button
                  onClick={handleCameraClick}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition border-2 border-white"
                  title="Change profile picture"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {userData?.firstName}{" "}
                  {userData?.middleName
                    ? `${userData.middleName.charAt(0)}. `
                    : ""}
                  {userData?.lastName}
                  {userData?.suffix ? ` ${userData.suffix}` : ""}
                </h1>
                <p className="text-gray-600 mb-2">Farm Owner</p>
              </div>
            </div>
          </div>

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
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                value={formValues.firstName}
                placeholder="First Name"
                onChange={(val) => handleChange("firstName", val)}
              />
              <InputField
                label="Middle Name"
                value={formValues.middleName}
                placeholder="Middle Name"
                optional
                onChange={(val) => handleChange("middleName", val)}
              />
              <InputField
                label="Last Name"
                value={formValues.lastName}
                placeholder="Last Name"
                onChange={(val) => handleChange("lastName", val)}
              />
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
              <InputField
                label="Username"
                value={formValues.username}
                placeholder="Username"
                onChange={(val) => handleChange("username", val)}
              />
              <InputField
                label="Email Address"
                type="email"
                icon={Mail}
                value={formValues.email}
                placeholder="Email"
                onChange={(val) => handleChange("email", val)}
              />
              <InputField
                label="Contact Number"
                type="tel"
                icon={Phone}
                value={formValues.contactNumber}
                placeholder="Contact Number"
                onChange={(val) => handleChange("contactNumber", val)}
              />
            </div>
          </div>

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

          <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-4 pb-4 border-b border-red-200">
              Danger Zone
            </h2>
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
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-2">
      {label}{" "}
      {optional && (
        <span className="text-gray-400 font-normal">(Optional)</span>
      )}
    </label>
    <div className="relative flex items-center">
      <div className="absolute left-3 text-gray-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
      />
    </div>
  </div>
);

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
// import defaultUserPic from "../assets/default-user.png";
// import { getLoggedInUser } from "../utils/security";
// import Alert from "../components/Alert";

// export default function EditProfilePage() {
//   const [userData, setUserData] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const [error, setError] = useState(null);
//   const fileInputRef = useRef();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const navigate = useNavigate();
//   const [alert, setAlert] = useState({ type: "", message: "" });
//   const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
//   const [showDeactivateAccountModal, setShowDeactivateAccountModal] =
//     useState(false);

//   // Helper function to format date for input[type="date"]
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
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

//         if (res.ok) {
//           const data = await res.json();
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

//           localStorage.setItem("user", JSON.stringify(freshUser));
//           setError(null);
//         }
//       } catch (err) {
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Handle profile picture selection (preview only, no upload yet)
//   const handleProfilePictureSelect = (e) => {
//     const file = e.target.files[0];

//     if (!file) {
//       return;
//     }

//     if (file.size > 10485760) {
//       setAlert({ type: "error", message: "File size exceeds 10MB limit" });
//       return;
//     }

//     if (!file.type.startsWith("image/")) {
//       setAlert({ type: "error", message: "Please select a valid image file" });
//       return;
//     }

//     setSelectedImage(file);
//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);
//   };

//   const handleCameraClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleChange = (key, value) => {
//     setFormValues({ ...formValues, [key]: value });
//   };

//   const handleSaveChanges = async () => {
//     if (!formValues.firstName?.trim()) {
//       setAlert({
//         type: "error",
//         message: "First name is required and cannot be empty",
//       });
//       return;
//     }

//     if (!formValues.lastName?.trim()) {
//       setAlert({
//         type: "error",
//         message: "Last name is required and cannot be empty",
//       });
//       return;
//     }

//     if (!formValues.username?.trim()) {
//       setAlert({
//         type: "error",
//         message: "Username is required and cannot be empty",
//       });
//       return;
//     }

//     if (!formValues.email?.trim()) {
//       setAlert({
//         type: "error",
//         message: "Email is required and cannot be empty",
//       });
//       return;
//     }

//     if (!formValues.contactNumber?.trim()) {
//       setAlert({
//         type: "error",
//         message: "Contact number is required and cannot be empty",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const { userId, token } = getUserFromStorage();

//       if (!userId || !token) {
//         throw new Error("Authentication error. Please log in again.");
//       }

//       let updatedProfilePicture = userData.profilePicture;
//       if (selectedImage) {
//         const formData = new FormData();
//         formData.append("profilePicture", selectedImage);

//         try {
//           const res = await fetch(
//             "https://papaiaapi.onrender.com/api/profile-picture",
//             {
//               method: "PUT",
//               headers: { Authorization: `Bearer ${token}` },
//               body: formData,
//             }
//           );

//           if (res.ok) {
//             const data = await res.json();
//             updatedProfilePicture = data.profilePicture;
//           } else {
//             throw new Error("Failed to upload profile picture");
//           }
//         } catch (err) {
//           setAlert({
//             type: "error",
//             message: `Error uploading profile picture: ${err.message}`,
//           });
//           setLoading(false);
//           return;
//         }
//       }

//       const updatedData = {};
//       Object.keys(formValues).forEach((key) => {
//         let newValue = formValues[key];

//         if (typeof newValue === "string" && key !== "birthDate") {
//           newValue = newValue.trim();
//         }

//         const oldValue =
//           key === "birthDate"
//             ? formatDateForInput(userData[key])
//             : userData[key];

//         if (newValue !== oldValue) {
//           updatedData[key] = newValue;
//         }
//       });

//       if (Object.keys(updatedData).length === 0 && !selectedImage) {
//         setAlert({ type: "info", message: "No changes detected" });
//         setLoading(false);
//         return;
//       }

//       if (Object.keys(updatedData).length > 0) {
//         const res = await fetch(
//           `https://papaiaapi.onrender.com/api/user/${userId}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(updatedData),
//           }
//         );

//         if (!res.ok) {
//           const errorData = await res.json().catch(() => ({}));
//           throw new Error(
//             errorData.error ||
//               errorData.message ||
//               `Failed to update profile (Status: ${res.status})`
//           );
//         }
//       }

//       const mergedData = {
//         ...userData,
//         ...updatedData,
//         profilePicture: updatedProfilePicture,
//       };

//       setUserData(mergedData);
//       localStorage.setItem("user", JSON.stringify(mergedData));

//       setSelectedImage(null);
//       setPreviewUrl(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

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

//       window.dispatchEvent(new Event("userUpdated"));

//       setAlert({ type: "success", message: "Profile updated successfully!" });
//       navigate("/profile");
//     } catch (err) {
//       setAlert({
//         type: "error",
//         message: err.message || "Error updating profile. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseChangePasswordModal = () =>
//     setShowChangePasswordModal(false);
//   const handleCloseDeactivateAccountModal = () =>
//     setShowDeactivateAccountModal(false);

//   const getProfilePictureUrl = () => {
//     if (previewUrl) {
//       return previewUrl;
//     }

//     const pic = userData?.profilePicture;

//     if (pic && typeof pic === "string") {
//       return `${pic}${pic.includes("?") ? "&" : "?"}t=${Date.now()}`;
//     }

//     return defaultUserPic;
//   };

//   const handleClearAndLogin = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   if (initialLoad) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex flex-col">
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

//   if (error) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex flex-col">
//         <HeaderMain />
//         <Alert
//           type={alert.type}
//           message={alert.message}
//           onClose={() => setAlert({ type: "", message: "" })}
//         />
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

//   return (
//     <div className="bg-gray-50 min-h-screen flex flex-col">
//       <HeaderMain />

//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleProfilePictureSelect}
//         accept="image/*"
//         style={{ display: "none" }}
//       />

//       <main className="flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8">
//         {/* Profile Header Card */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
//             <div className="relative">
//               <img
//                 src={getProfilePictureUrl()}
//                 alt={`${userData?.firstName || ""} ${userData?.lastName || ""}`}
//                 className="w-24 h-24 rounded-full border-2 border-gray-200 object-cover"
//                 onError={(e) => (e.currentTarget.src = defaultUserPic)}
//               />

//               <button
//                 onClick={handleCameraClick}
//                 className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition border-2 border-white"
//                 title="Change profile picture"
//               >
//                 <Camera className="w-4 h-4 text-white" />
//               </button>
//             </div>

//             <div className="flex-1 text-center sm:text-left">
//               <h1 className="text-2xl font-bold text-gray-900 mb-1">
//                 {userData?.firstName}{" "}
//                 {userData?.middleName
//                   ? `${userData.middleName.charAt(0)}. `
//                   : ""}
//                 {userData?.lastName}
//                 {userData?.suffix ? ` ${userData.suffix}` : ""}
//               </h1>
//               <p className="text-gray-600 mb-2">Farm Owner</p>

//               <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Joined{" "}
//                 {userData?.createdAt
//                   ? new Date(userData.createdAt).toLocaleString("default", {
//                       month: "long",
//                       year: "numeric",
//                     })
//                   : "October 2025"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Personal Information Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Personal Information
//             </h2>
//             <button
//               onClick={handleSaveChanges}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
//             >
//               <Save size={18} />
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* First Name */}
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-2">
//                 First Name
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-3 text-gray-400">
//                   <User size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   value={formValues.firstName}
//                   placeholder="First Name"
//                   onChange={(e) => handleChange("firstName", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             {/* Middle Name */}
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-2">
//                 Middle Name{" "}
//                 <span className="text-gray-400 font-normal">(Optional)</span>
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-3 text-gray-400">
//                   <User size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   value={formValues.middleName}
//                   placeholder="Middle Name"
//                   onChange={(e) => handleChange("middleName", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             {/* Last Name */}
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-3 text-gray-400">
//                   <User size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   value={formValues.lastName}
//                   placeholder="Last Name"
//                   onChange={(e) => handleChange("lastName", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             {/* Suffix */}
//             <ProfileSelect
//               label="Suffix"
//               value={formValues.suffix}
//               onChange={(val) => handleChange("suffix", val)}
//               options={[
//                 { value: "", label: "Select Suffix (Optional)" },
//                 { value: "Jr.", label: "Jr." },
//                 { value: "Sr.", label: "Sr." },
//                 { value: "II", label: "II" },
//                 { value: "III", label: "III" },
//                 { value: "IV", label: "IV" },
//                 { value: "V", label: "V" },
//               ]}
//             />

//             {/* Username */}
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-2">
//                 Username
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-3 text-gray-400">
//                   <User size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   value={formValues.username}
//                   placeholder="Username"
//                   onChange={(e) => handleChange("username", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-3 text-gray-400">
//                   <Mail size={18} />
//                 </div>
//                 <input
//                   type="email"
//                   value={formValues.email}
//                   placeholder="Email"
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             {/* Contact Number */}
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-2">
//                 Contact Number
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-3 text-gray-400">
//                   <Phone size={18} />
//                 </div>
//                 <input
//                   type="tel"
//                   value={formValues.contactNumber}
//                   placeholder="Contact Number"
//                   onChange={(e) =>
//                     handleChange("contactNumber", e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             {/* Birth Date */}
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-700 mb-2">
//                 Birth Date{" "}
//                 <span className="text-gray-400 font-normal">(Optional)</span>
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-3 text-gray-400">
//                   <Calendar size={18} />
//                 </div>
//                 <input
//                   type="date"
//                   value={formValues.birthDate}
//                   onChange={(e) => handleChange("birthDate", e.target.value)}
//                   max={(() => {
//                     const today = new Date();
//                     today.setFullYear(today.getFullYear() - 18);
//                     return today.toISOString().split("T")[0];
//                   })()}
//                   className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Security & Privacy Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">
//             Security & Privacy
//           </h2>
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-1">
//                 Change Password
//               </h3>
//               <p className="text-sm text-gray-600">
//                 Update your account password to keep it secure
//               </p>
//             </div>
//             <button
//               onClick={() => setShowChangePasswordModal(true)}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-sm hover:shadow-md whitespace-nowrap"
//             >
//               <Shield size={18} />
//               Change Password
//             </button>
//           </div>
//         </div>

//         {/* Danger Zone Card */}
//         <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
//           <h2 className="text-2xl font-bold text-red-700 mb-4 pb-4 border-b border-red-200">
//             Danger Zone
//           </h2>
//           <div className="space-y-4">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-red-50 rounded-xl border border-red-200">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-1">
//                   Deactivate Account
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   Temporarily disable your account. You can reactivate it
//                   anytime.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowDeactivateAccountModal(true)}
//                 disabled={loading}
//                 className="px-6 py-3 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
//               >
//                 Deactivate Account
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

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

//       <FooterMain />
//     </div>
//   );
// }

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

//   const displayValue = value || options[0]?.label || "Select";

//   return (
//     <div className="flex flex-col" ref={dropdownRef}>
//       <label className="text-sm font-semibold text-gray-700 mb-2">
//         {label}
//       </label>
//       <div className="relative">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg flex justify-between items-center text-sm hover:bg-gray-50 bg-white transition-all cursor-pointer text-gray-800"
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
//                 className="px-4 py-2 cursor-pointer hover:bg-orange-500 hover:text-white text-sm whitespace-nowrap transition-colors"
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
