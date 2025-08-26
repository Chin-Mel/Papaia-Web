import { useState, useEffect } from "react";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  Lock,
  Power,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../utils/security";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import defaultUserPic from "../assets/default-user.png";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const loggedInUser = getLoggedInUser();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!loggedInUser) return;
    setFormData({
      firstName: loggedInUser.firstName || "",
      lastName: loggedInUser.lastName || "",
      username: loggedInUser.username || "",
      email: loggedInUser.email || "",
      phone: loggedInUser.phone || loggedInUser.contactNumber || "",
      birthDate: loggedInUser.dateOfBirth || loggedInUser.birthDate || "",
      profilePicture: loggedInUser.profilePicture || null,
    });
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/owner/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        console.error("Failed to update profile");
        return;
      }

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/profile"); // go back to profile page
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 mt-16 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Edit Profile
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  formData.profilePicture
                    ? `https://papaiaapi.onrender.com${formData.profilePicture}`
                    : defaultUserPic
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
              />
              <p className="text-gray-500 mt-2 text-sm">
                Profile picture cannot be changed here.
              </p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" /> First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" /> Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <AtSign className="w-4 h-4" /> Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4" /> Contact Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" /> Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button className="w-full md:w-auto bg-[#F97316] hover:bg-[#FF8C42] text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md">
                <Lock className="w-4 h-4" /> Change Password
              </button>

              <button className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md">
                <Power className="w-4 h-4" /> Deactivate Account
              </button>

              <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md">
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
