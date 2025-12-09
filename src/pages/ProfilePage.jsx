import React, { useState, useEffect } from "react";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Edit3,
  FileText,
  FileCheck,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../utils/security";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";
import UserAvatar from "../components/UserAvatar";
import TermsModal from "../components/Popups/TermsModal";
import PrivacyModal from "../components/Popups/PrivacyModal";

export default function ProfilePage() {
  const navigate = useNavigate();
  // Initialize with cached data immediately - no loading state needed!
  const [userData, setUserData] = useState(() => getLoggedInUser());
  const [farmCount, setFarmCount] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      return;
    }

    // Fetch fresh data in the background without showing loading
    const fetchFreshData = async () => {
      try {
        const [userRes, farmRes] = await Promise.all([
          fetch(`https://papaiaapi.onrender.com/api/user/${userData.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://papaiaapi.onrender.com/api/owner/count-farms", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          const user = userData.user || userData;
          setUserData(user);
          localStorage.setItem("user", JSON.stringify(user));
        }

        if (farmRes.ok) {
          const farmData = await farmRes.json();
          setFarmCount(farmData.farmCount ?? 0);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchFreshData();

    const handleUserUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (updatedUser.id) {
        setUserData(updatedUser);
      }
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, [userData?.id]);

  const renderField = (value) => (
    <span className={value ? "text-slate-800" : "text-slate-400 italic"}>
      {value || "N/A"}
    </span>
  );

  const getFullName = () => {
    if (!userData) return "N/A";
    const { firstName, lastName } = userData;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return userData.username || "N/A";
  };

  // No loading state - show content immediately!
  // No loading state - show content immediately!
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
            <p className="text-slate-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-slate-100 rounded-full text-5xl">
                  <UserAvatar
                    name={getFullName()}
                    profileImageUrl={userData?.profilePicture}
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {getFullName()}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mb-3">
                  @{userData?.username || "N/A"}
                </p>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100">
                  <FileCheck className="w-4 h-4" />
                  <span>Enterprise Plan</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/edit-profile")}
                disabled={!userData?.id}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 text-slate-400" /> Full Name
                    </label>
                    <div className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800">
                      {renderField(getFullName())}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <AtSign className="w-4 h-4 text-slate-400" /> Username
                    </label>
                    <div className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800">
                      {renderField(userData?.username)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400" /> Email Address
                    </label>
                    <div className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800">
                      {renderField(userData?.email)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400" /> Contact
                      Number
                    </label>
                    <div className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800">
                      {renderField(userData?.contactNumber)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/billing")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-500/20 hover:shadow-xl active:scale-95"
              >
                <FileText className="w-5 h-5" />
                <span>Manage Billing</span>
              </button>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Legal & Privacy
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors border border-slate-200 mb-4"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Terms & Conditions</span>
                  </button>

                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors border border-slate-200"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span>Privacy Policy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showTermsModal && (
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
      )}

      {showPrivacyModal && (
        <PrivacyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
