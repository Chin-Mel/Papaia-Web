import { X, User, Phone, CheckCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import defaultUserPic from "../../assets/default-user.png";

function FarmerDetailModal({ isOpen, onClose, onRemoveFarmer, farmer }) {
  if (!isOpen || !farmer) return null;

  // Fixed field name handling - API returns lowercase field names
  const fullName = [
    farmer.firstname || farmer.firstName || "",
    farmer.middlename || farmer.middleName || "",
    farmer.lastname || farmer.lastName || "",
    farmer.suffix || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative">
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
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={farmer.profilePicture || defaultUserPic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => (e.target.src = defaultUserPic)}
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {fullName || "N/A"}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Farmer ID: {farmer.idNumber || "N/A"}
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

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Personal Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-orange-500" />
                <h4 className="font-semibold text-gray-800 text-sm">
                  Personal Information
                </h4>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p className="text-gray-600 text-xs">First Name</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.firstname || farmer.firstName || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p className="text-gray-600 text-xs">Middle Name</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.middlename || farmer.middleName || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p className="text-gray-600 text-xs">Last Name</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.lastname || farmer.lastName || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p className="text-gray-600 text-xs">Suffix</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.suffix || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <h4 className="font-semibold text-gray-800 text-sm">
                  Contact Information
                </h4>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p className="text-gray-600 text-xs">Email Address</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.email || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p className="text-gray-600 text-xs">Phone Number</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.contactNumber || farmer.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 p-2 rounded text-sm mb-6">
            <p className="text-gray-600 text-xs">Address</p>
            <p className="text-gray-800 font-medium">
              {(() => {
                const addressParts = [
                  farmer.street,
                  farmer.barangay,
                  farmer.municipality,
                  farmer.province,
                  farmer.zipcode || farmer.zipCode,
                ].filter(Boolean);

                return addressParts.length > 0
                  ? addressParts.join(", ")
                  : "N/A";
              })()}
            </p>
          </div>

          {/* Remove Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onRemoveFarmer}
              className="w-full px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
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
