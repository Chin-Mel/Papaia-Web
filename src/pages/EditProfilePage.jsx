import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Shield,
  Trash2,
} from "lucide-react";

// The main App component that renders the Edit Profile Page
function EditProfilePage() {
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 mb-8">
          <div className="relative">
            {/* Profile Picture */}
            <img
              src="https://placehold.co/100x100/A7F3D0/065F46?text=JA"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            {/* Online Status Badge */}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">John Anderson</h1>
            <p className="text-lg text-gray-500">Farm Owner</p>
            <div className="flex items-center text-sm text-gray-400 space-x-4 mt-2">
              <span className="flex items-center">
                <Calendar size={16} className="mr-1" /> Joined March 2023
              </span>
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" /> Consolacion, Cebu
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInput
              label="Full Name"
              placeholder="John Anderson"
              icon={<User size={20} />}
            />
            <ProfileInput label="Username" placeholder="john_anderson" />
            <ProfileInput
              label="Email Address"
              placeholder="john.anderson@agrotech.com"
              type="email"
              icon={<Mail size={20} />}
            />
            <ProfileInput
              label="Contact Number"
              placeholder="+1 (555) 123-4567"
              type="tel"
              icon={<Phone size={20} />}
            />
            <ProfileInput
              label="Birth Date"
              placeholder="1985-06-15"
              type="date"
              icon={<Calendar size={20} />}
            />
            <ProfileInput
              label="Address"
              placeholder="1234 Farm Road, Fresno, CA 93720"
              icon={<MapPin size={20} />}
            />
          </div>
          <div className="mt-8 flex justify-end">
            <button className="flex items-center justify-center bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-orange-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save Changes
            </button>
          </div>
        </div>

        {/* Security & Privacy Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Security & Privacy
          </h2>
          <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Change Password
              </h3>
              <p className="text-sm text-gray-500">
                Update your account password to keep it secure
              </p>
            </div>
            <button className="flex items-center justify-center bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-orange-600 transition-colors">
              <Shield size={20} className="mr-2" />
              Change Password
            </button>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="p-6 rounded-2xl border-2 border-red-500 bg-red-50">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-100 rounded-xl">
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Deactivate Account
                </h3>
                <p className="text-sm text-red-600">
                  Temporarily disable your account. You can reactivate it
                  anytime.
                </p>
              </div>
              <button className="flex items-center justify-center bg-red-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4-12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
                </svg>
                Deactivate Account
              </button>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-100 rounded-xl">
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Delete Account
                </h3>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <button className="flex items-center justify-center bg-red-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                <Trash2 size={20} className="mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// A reusable input component with a label and optional icon
const ProfileInput = ({ label, placeholder, type = "text", icon }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default EditProfilePage;
