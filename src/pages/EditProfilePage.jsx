import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

function EditProfilePage() {
  const { id } = useParams(); // get user id from route param
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch user data on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/user/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else {
          console.error("User not found");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      const res = await fetch(`/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // add Authorization header if needed
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate(`/profile/${id}`); // redirect back to profile page
      } else {
        console.error("Failed to update user");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <HeaderMain />

      <main className="flex-1 px-4 sm:px-8 lg:px-16 py-10 mt-16">
        {/* Top Profile Info */}
        <div className="flex items-center space-x-6 pb-8 border-b border-gray-200 mb-10">
          <div className="relative">
            <img
              src={userData.profilePicture || "https://placehold.co/100x100"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-lg text-gray-500">{userData.role}</p>
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
              label="First Name"
              placeholder={userData.firstName || ""}
              value={formData.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              icon={<User size={20} />}
            />
            <ProfileInput
              label="Middle Name"
              placeholder={userData.middleName || ""}
              value={formData.middleName || ""}
              onChange={(e) => handleChange("middleName", e.target.value)}
            />
            <ProfileInput
              label="Last Name"
              placeholder={userData.lastName || ""}
              value={formData.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
            <ProfileInput
              label="Username"
              placeholder={userData.username || ""}
              value={formData.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            <ProfileInput
              label="Email Address"
              placeholder={userData.email || ""}
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              type="email"
              icon={<Mail size={20} />}
            />
            <ProfileInput
              label="Contact Number"
              placeholder={userData.contactNumber || ""}
              value={formData.contactNumber || ""}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
              type="tel"
              icon={<Phone size={20} />}
            />
            <ProfileInput
              label="Birth Date"
              placeholder={userData.birthDate || ""}
              value={formData.birthDate || ""}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              type="date"
              icon={<Calendar size={20} />}
            />
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Security & Privacy
          </h2>
          <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow border border-gray-200">
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

        {/* Danger Zone Section */}
        <section className="p-6 rounded-2xl border-2 border-red-500 bg-red-50">
          <h2 className="text-2xl font-semibold text-red-700 mb-6">
            Danger Zone
          </h2>
          <div className="space-y-6">
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
              <button className="flex items-center px-5 py-2 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors">
                Deactivate Account
              </button>
            </div>

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
              <button className="flex items-center px-5 py-2 rounded-lg border border-red-800 text-red-800 font-medium hover:bg-red-800 hover:text-white transition-colors">
                <Trash2 size={18} className="mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </section>
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
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
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
