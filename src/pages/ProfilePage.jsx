import { useState, useEffect } from "react";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Tractor,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/useUser";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";
import defaultUserPic from "../assets/default-user.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: userData, loading: userLoading, refreshUser } = useUser();
  const [farmCount, setFarmCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userData || !token) return;

    let mounted = true;

    const fetchFarmCount = async () => {
      try {
        const res = await fetch(
          "https://papaiaapi.onrender.com/api/owner/count-farms",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          if (res.status === 401) console.warn("Unauthorized: invalid token");
          else console.warn("Failed to fetch farm count:", res.status);
          return;
        }

        const data = await res.json();
        if (mounted) setFarmCount(data.farmCount ?? 0);
      } catch (err) {
        console.warn("Could not fetch farm count:", err.message);
      }
    };

    fetchFarmCount();

    return () => {
      mounted = false;
    };
  }, [userData, token]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const renderField = (value) => (
    <span className={value ? "text-gray-800" : "text-gray-400 italic"}>
      {value || "N/A"}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getFullName = () => {
    if (!userData) return "N/A";
    const { firstName, lastName, middleName, suffix } = userData;
    if (firstName && lastName) {
      let fullName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

      if (suffix) {
        fullName += ` ${suffix}`;
      }

      return fullName;
    }
    return userData.username || "N/A";
  };

  const getProfilePictureUrl = () => {
    if (userData?.profilePicture) {
      if (userData.profilePicture.startsWith("http")) {
        return userData.profilePicture;
      }
      return `https://papaiaapi.onrender.com${userData.profilePicture}`;
    }
    return defaultUserPic;
  };

  // Show loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-gray-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if no user
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Unable to load profile data.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 mt-16 px-4 sm:px-6 lg:px-8 mb-5">
        <div className="w-full">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Profile Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your account information and preferences
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Profile Card */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col items-center">
                {/* Profile Picture */}
                <div className="relative">
                  <img
                    src={getProfilePictureUrl()}
                    alt={getFullName()}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100"
                    onError={(e) => {
                      e.currentTarget.src = defaultUserPic;
                    }}
                  />
                </div>

                {/* User Info */}
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-4 mb-1 text-center">
                  {getFullName()}
                </h2>
                <p className="text-gray-600 text-sm mb-3">Farm Owner</p>

                {/* Farm Count Card */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
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

            {/* Right Panel - Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                  <h3 className="text-lg font-bold text-gray-800 text-center sm:text-left">
                    Personal Information
                  </h3>
                  <button
                    onClick={handleEditProfile}
                    disabled={!userData.id}
                    className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition shadow hover:shadow-md self-center sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(getFullName())}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <AtSign className="w-4 h-4" /> Username
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(userData.username)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(userData.email)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" /> Contact Number
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(userData.contactNumber)}
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4" /> Birth Date
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {renderField(formatDate(userData.birthDate))}
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
