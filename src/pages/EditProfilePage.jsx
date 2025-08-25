import { useState } from "react";
import {
  Camera,
  Calendar,
  MapPin,
  Save,
  Key,
  UserMinus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import SecureInput from "../components/SecureInput";
import {
  secureApiCall,
  sanitizeInput,
  confirmDestructiveAction,
} from "../utils/security";
import PasswordUpdatedSuccessModal from "../components/PasswordUpdatedSuccessModal";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "John Anderson",
    username: "john_anderson",
    email: "john.anderson@agrotech.com",
    contact: "+1 (555) 123-4567",
    birthDate: "1985-06-15",
    address: "1234 Form Road, Fresno, CA 93720",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await secureApiCall("/api/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          fullName: sanitizeInput(formData.fullName),
          username: sanitizeInput(formData.username),
          email: sanitizeInput(formData.email),
          contact: sanitizeInput(formData.contact),
          birthDate: formData.birthDate,
          address: sanitizeInput(formData.address),
        }),
      });

      if (response.ok) {
        // Show success message or update UI
        console.log("Profile updated successfully");
      } else {
        const errorData = await response.json();
        setErrors({
          general:
            errorData.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({
        general: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    // Show password success modal for demo
    setShowPasswordModal(true);
  };

  const handleDeactivateAccount = async () => {
    const confirmed = await confirmDestructiveAction(
      "deactivate",
      "your account"
    );
    if (confirmed) {
      try {
        const response = await secureApiCall("/api/account/deactivate", {
          method: "POST",
        });

        if (response.ok) {
          // Redirect to login or show success message
          window.location.href = "/signin";
        } else {
          const errorData = await response.json();
          setErrors({
            general: errorData.message || "Failed to deactivate account.",
          });
        }
      } catch (error) {
        console.error("Deactivate account error:", error);
        setErrors({
          general: "An error occurred. Please try again later.",
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmDestructiveAction(
      "permanently delete",
      "your account"
    );
    if (confirmed) {
      try {
        const response = await secureApiCall("/api/account/delete", {
          method: "DELETE",
        });

        if (response.ok) {
          // Redirect to home page
          window.location.href = "/";
        } else {
          const errorData = await response.json();
          setErrors({
            general: errorData.message || "Failed to delete account.",
          });
        }
      } catch (error) {
        console.error("Delete account error:", error);
        setErrors({
          general: "An error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - User Profile Summary */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  {/* Profile Picture */}
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center">
                      <img
                        src="https://source.unsplash.com/128x128/?man,portrait"
                        alt="John Anderson"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* User Info */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    John Anderson
                  </h2>
                  <p className="text-gray-600 mb-4">Farm Owner</p>

                  {/* Joined Date & Location */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined March 2023</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Consolacion, Cebu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Sections */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Information Section */}
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Personal Information
                    </h3>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <SecureInput
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <SecureInput
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <SecureInput
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <SecureInput
                        type="tel"
                        value={formData.contact}
                        onChange={(e) =>
                          handleInputChange("contact", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Date
                      </label>
                      <div className="relative">
                        <SecureInput
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            handleInputChange("birthDate", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent pr-10"
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <SecureInput
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Security & Privacy Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Security & Privacy
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 font-medium">
                        Change Password
                      </p>
                      <p className="text-sm text-gray-600">
                        Update your account password to keep it secure
                      </p>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Danger Zone Section */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-red-600">
                      Danger Zone
                    </h3>
                  </div>

                  {/* Deactivate Account */}
                  <div className="mb-6 p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">
                          Deactivate Account
                        </p>
                        <p className="text-sm text-gray-600">
                          Temporarily disable your account. You can reactivate
                          it anytime.
                        </p>
                      </div>
                      <button
                        onClick={handleDeactivateAccount}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <UserMinus className="w-4 h-4" />
                        Deactivate Account
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">
                          Delete Account
                        </p>
                        <p className="text-sm text-gray-600">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Password Updated Success Modal */}
      <PasswordUpdatedSuccessModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onContinueToSignIn={() => {
          setShowPasswordModal(false);
          window.location.href = "/signin";
        }}
        onBackToHome={() => {
          setShowPasswordModal(false);
          window.location.href = "/";
        }}
      />
    </div>
  );
}
