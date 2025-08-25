import { X, User, Phone, CheckCircle, Trash2 } from "lucide-react";
import defaultUserPic from "../assets/default-user.png";

function FarmerDetailModal({ isOpen, onClose, onRemoveFarmer, farmer }) {
  if (!isOpen || !farmer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-orange-500 rounded-t-lg p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Farmer Details</h2>
              <p className="text-white/80 text-sm">
                Complete farmer profile information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img
                src={
                  farmer.profilePicture || farmer.profileImage || defaultUserPic
                }
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = defaultUserPic;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {farmer.firstname || farmer.firstName || ""}{" "}
                {farmer.middlename || farmer.middleName || ""}{" "}
                {farmer.lastname || farmer.lastName || ""} {farmer.suffix || ""}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Farmer ID: {farmer.id || farmer.farmerId || "N/A"}
              </p>
              <span className="inline-flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {farmer.status
                  ? farmer.status.charAt(0).toUpperCase() +
                    farmer.status.slice(1)
                  : "Active"}
              </span>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-orange-500" />
              <h4 className="font-semibold text-gray-800 text-sm">
                Personal Information
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm mb-1">Full Name</p>
                <p className="text-gray-800 font-medium text-sm">
                  {farmer.firstname || farmer.firstName || ""}{" "}
                  {farmer.middlename || farmer.middleName || ""}{" "}
                  {farmer.lastname || farmer.lastName || ""}{" "}
                  {farmer.suffix || ""}
                </p>
              </div>

              {farmer.dateOfBirth && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">Date of Birth</p>
                  <p className="text-gray-800 font-medium text-sm">
                    {farmer.dateOfBirth}
                  </p>
                </div>
              )}

              {farmer.age && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">Age</p>
                  <p className="text-gray-800 font-medium text-sm">
                    {farmer.age} years old
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-orange-500" />
              <h4 className="font-semibold text-gray-800 text-sm">
                Contact Information
              </h4>
            </div>

            <div className="space-y-3">
              {farmer.username && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">Username</p>
                  <p className="text-gray-800 font-medium text-sm">
                    {farmer.username}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-600 text-sm mb-1">Email Address</p>
                <p className="text-gray-800 font-medium text-sm">
                  {farmer.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">Phone Number</p>
                <p className="text-gray-800 font-medium text-sm">
                  {farmer.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Farms Section */}
          {farmer.farms && farmer.farms.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">🏡</span>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Assigned Farms
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {farmer.farms.map((farm, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-800">
                      {farm.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Location: {farm.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remove Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onRemoveFarmer}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Remove Farmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDetailModal;
