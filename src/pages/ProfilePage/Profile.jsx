import React from "react";
import { FaUser, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Profile() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Profile</h2>

      <div className="bg-white rounded-xl shadow-md p-6 relative">
        {/* Deactivate Button */}
        <button className="absolute top-4 right-4 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500">
          Deactivate Account
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">Juan Dela Cruz</h3>
            <p className="text-gray-600">@juandelacruz</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InputField icon={<FaUser />} placeholder="Dela Cruz" />
          <InputField placeholder="Juan" />
          <InputField placeholder="Middle Name" />
          <InputField placeholder="Suffix" />

          <InputField icon={<FaUser />} placeholder="@juandelacruz" />
          <InputField
            icon={<FaEnvelope />}
            placeholder="juandelacruz@gmail.com"
          />

          <InputField icon={<FaMapMarkerAlt />} placeholder="Street" />
          <InputField placeholder="Barangay" />
          <InputField placeholder="Municipality" />
          <InputField placeholder="Province" />
          <InputField placeholder="Zip Code" />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button className="bg-lime-400 hover:bg-lime-500 text-white px-6 py-2 rounded">
            Logout
          </button>
          <button className="bg-[#8C6239] hover:bg-[#A9744D] text-white px-6 py-2 rounded">
            Change Password
          </button>
          <button className="bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {icon}
        </span>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full border-2 border-green-400 rounded px-10 py-2 text-sm focus:outline-none focus:border-green-600 ${
          icon ? "pl-10" : "pl-3"
        }`}
      />
    </div>
  );
}

export default Profile;
