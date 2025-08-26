import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Shield,
  Trash2,
  Save,
} from "lucide-react";

import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/FooterMain";

function EditProfilePage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 px-6 py-10">
        {/* Top Profile Info */}
        <div className="flex items-center space-x-6 pb-8 border-b border-gray-200 mb-10">
          <div className="relative">
            {/* Profile Picture */}
            <img
              src="https://placehold.co/100x100/A7F3D0/065F46?text=JA"
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
            {/* Online Status */}
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
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Personal Information
            </h2>
            <button className="flex items-center px-5 py-2 rounded-lg border border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors">
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            {/* Deactivate Account */}
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

            {/* Delete Account */}
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

      {/* Footer */}
      <FooterMain />
    </div>
  );
}

const ProfileInput = ({ label, placeholder, type = "text", icon }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default EditProfilePage;
