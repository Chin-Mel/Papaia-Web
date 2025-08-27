import { useState, useEffect, useRef } from "react";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  Camera,
  Edit3,
  Tractor,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import defaultUserPic from "../assets/default-user.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [farmCount, setFarmCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const { user, isAuthenticated } = useAuth();

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id || decoded._id || decoded.userId; // adjust to backend payload
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in", { replace: true });
      return;
    }
    const fetchUser = async () => {
      if (!token || !userId) return;

      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUserData(data);
        localStorage.setItem("user", JSON.stringify(data)); // keep localStorage updated
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [token, isAuthenticated, userId]);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !token) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/profile-picture",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        console.error("Failed to update profile picture");
        return;
      }

      const updatedUser = await res.json();

      const updatedUserData = {
        ...userData,
        profilePicture: updatedUser.profilePicture,
      };

      setUserData(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleEditProfile = () => {
    navigate("/edit-profile"); // your route to EditProfilePage
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePictureUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      <main className="flex-1 mt-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={userData.profilePicture || defaultUserPic}
                      alt={`${userData.firstName || ""} ${
                        userData.lastName || ""
                      }`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                      onError={(e) => (e.currentTarget.src = defaultUserPic)}
                    />

                    <button
                      onClick={handleCameraClick}
                      disabled={uploading}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Change profile picture"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mt-4 mb-1">
                    {userData.firstName && userData.lastName
                      ? `${userData.firstName} ${userData.lastName}`
                      : userData.username || "User"}
                  </h2>
                  <p className="text-gray-600 mb-3">Farm Owner</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Tractor className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Farms Managed
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {farmCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Personal Information
                  </h3>
                  <button
                    onClick={handleEditProfile}
                    className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.firstName && userData.lastName
                        ? `${userData.firstName} ${userData.lastName}`
                        : "Not provided"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <AtSign className="w-4 h-4" /> Username
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.username || "Not provided"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.email || "Not provided"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" /> Contact Number
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.phone ||
                        userData.contactNumber ||
                        "Not provided"}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4" /> Birth Date
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                      {userData.dateOfBirth ||
                        userData.birthDate ||
                        "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
