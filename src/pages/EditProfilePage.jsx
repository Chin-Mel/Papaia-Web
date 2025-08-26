import React, { useEffect, useState, useRef } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Trash2,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/FooterMain";
import defaultUserPic from "../assets/default-user.png";
import { getLoggedInUser } from "../utils/security";

function EditProfilePage() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [showConfirm, setShowConfirm] = useState(null); // "deactivate" | "delete"
  const [confirmInput, setConfirmInput] = useState("");
  const navigate = useNavigate();

  const user = getLoggedInUser(); // contains userId & token

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [user.userId, user.token]);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    try {
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/user/${user.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        alert("Profile updated!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Confirm Deactivate/Delete
  const handleConfirm = async () => {
    if (
      showConfirm === "deactivate" &&
      confirmInput.toLowerCase() === "deactivate"
    ) {
      alert("Account deactivated successfully.");
      navigate("/sign-in");
    }
    if (showConfirm === "delete" && confirmInput.toLowerCase() === "delete") {
      alert("Account deleted successfully.");
      navigate("/");
    }
    setShowConfirm(null);
    setConfirmInput("");
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <HeaderMain />
      <main className="flex-1 px-4 sm:px-8 lg:px-16 py-10 mt-20">
        {/* Top Profile Info */}
        <div className="flex items-center space-x-6 pb-8 border-b border-gray-200 mb-10">
          <div className="relative">
            <img
              src={
                userData.profilePicture
                  ? `https://papaiaapi.onrender.com${userData.profilePicture}`
                  : defaultUserPic
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-lg text-gray-500">Farm Owner</p>
            <div className="flex items-center text-sm text-gray-400 space-x-4 mt-2">
              <span className="flex items-center">
                <Calendar size={16} className="mr-1" /> Joined{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Personal Information
            </h2>
            <button
              onClick={handleSave}
              className="flex items-center px-5 py-2 rounded-lg border border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileInput
              name="firstName"
              label="First Name"
              placeholder={userData.firstName}
              icon={<User size={20} />}
              onChange={handleChange}
            />
            <ProfileInput
              name="lastName"
              label="Last Name"
              placeholder={userData.lastName}
              icon={<User size={20} />}
              onChange={handleChange}
            />
            <ProfileInput
              name="username"
              label="Username"
              placeholder={userData.username}
              onChange={handleChange}
            />
            <ProfileInput
              name="email"
              label="Email Address"
              placeholder={userData.email}
              type="email"
              icon={<Mail size={20} />}
              onChange={handleChange}
            />
            <ProfileInput
              name="phone"
              label="Contact Number"
              placeholder={userData.phone || "Enter contact number"}
              type="tel"
              icon={<Phone size={20} />}
              onChange={handleChange}
            />
            <ProfileInput
              name="birthDate"
              label="Birth Date"
              placeholder={userData.birthDate || "YYYY-MM-DD"}
              type="date"
              icon={<Calendar size={20} />}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Security & Privacy
          </h2>
          <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl">
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Change Password
              </h3>
              <p className="text-sm text-gray-500">
                Update your account password to keep it secure
              </p>
            </div>
            <button className="flex items-center justify-center bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow hover:bg-orange-600 transition-colors">
              <Shield size={20} className="mr-2" />
              Change Password
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-6 rounded-2xl border-2 border-red-500 bg-white">
          <h2 className="text-2xl font-semibold text-red-700 mb-6">
            Danger Zone
          </h2>
          <div className="space-y-6">
            {/* Deactivate */}
            <div className="flex justify-between items-center p-5 bg-red-100 rounded-xl">
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Deactivate Account
                </h3>
                <p className="text-sm text-red-600">
                  Temporarily disable your account. You can reactivate it
                  anytime.
                </p>
              </div>
              <button
                onClick={() => setShowConfirm("deactivate")}
                className="flex items-center px-5 py-2 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors"
              >
                Deactivate Account
              </button>
            </div>

            {/* Delete */}
            <div className="flex justify-between items-center p-5 bg-red-100 rounded-xl">
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Delete Account
                </h3>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowConfirm("delete")}
                className="flex items-center px-5 py-2 rounded-lg border border-red-800 text-red-800 font-medium hover:bg-red-800 hover:text-white transition-colors"
              >
                <Trash2 size={18} className="mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </section>

        {/* Confirmation Popup */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Confirm{" "}
                {showConfirm === "deactivate" ? "Deactivation" : "Deletion"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                To confirm, type{" "}
                <span className="font-bold">{showConfirm}</span> below:
              </p>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirm(null)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <FooterMain />
    </div>
  );
}

const ProfileInput = ({
  label,
  placeholder,
  type = "text",
  icon,
  name,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default EditProfilePage;
