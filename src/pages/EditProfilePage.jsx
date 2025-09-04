// EditProfilePage.jsx
import React, { useEffect, useState } from "react";
import { User, Save } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/FooterMain";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../utils/security";

function EditProfilePage() {
  const navigate = useNavigate();
  const loggedInUser = getLoggedInUser(); // ✅ Get user from localStorage
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch user data
  useEffect(() => {
    if (!loggedInUser?._id) return; // ✅ safeguard

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${loggedInUser._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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
  }, [loggedInUser]);

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
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/user/${loggedInUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        navigate("/profile"); // ✅ redirect back to frontend profile page
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
        {/* Profile Info */}
        <div className="flex items-center space-x-6 pb-8 border-b border-gray-200 mb-10">
          <div className="relative">
            <img
              src={userData?.profilePicture || "https://placehold.co/100x100"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {userData?.firstName} {userData?.lastName}
            </h1>
            <p className="text-lg text-gray-500">{userData?.role}</p>
          </div>
        </div>

        {/* Personal Information */}
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
              placeholder={userData?.firstName || ""}
              value={formData.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              icon={<User size={20} />}
            />
            {/* Repeat for other fields */}
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
}) => (
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

export default EditProfilePage;
