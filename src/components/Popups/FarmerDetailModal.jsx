import {
  X,
  User,
  Phone,
  CheckCircle,
  RotateCcw,
  Calendar,
  Trash2,
} from "lucide-react";
import { useEffect, useRef } from "react";
import defaultUserPic from "../../assets/default-user.png";

function FarmerDetailModal({
  isOpen,
  onClose,
  onRestoreFarmer,
  onRemoveFarmer,
  farmer,
}) {
  if (!isOpen || !farmer) return null;

  const fullName = [
    farmer.firstname || farmer.firstName || "",
    farmer.middlename || farmer.middleName || "",
    farmer.lastname || farmer.lastName || "",
    farmer.suffix || "",
  ]
    .filter(Boolean)
    .join(" ");

  const isArchived =
    farmer.isArchived || farmer.status?.toLowerCase() === "archived";

  const modalRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div
          className={`rounded-t-2xl p-6 relative ${
            isArchived
              ? "bg-gradient-to-r from-gray-500 to-gray-600"
              : "bg-gradient-to-r from-[#00712D] to-[#F97316]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <User
                className={`w-6 h-6 ${
                  isArchived ? "text-gray-600" : "text-green-600"
                }`}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isArchived ? "Archived Farmer Details" : "Farmer Details"}
              </h2>
              <p className="text-white/90 text-sm">
                {isArchived
                  ? "This farmer has been archived"
                  : "Complete farmer profile information"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Archived Banner */}
        {isArchived && (
          <div className="bg-red-50 border-b-2 border-red-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-red-900">
                This farmer is currently archived and inactive
              </p>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img
                src={farmer.profilePicture || defaultUserPic}
                alt="Profile"
                className={`w-20 h-20 rounded-full object-cover border-4 shadow-lg ${
                  isArchived ? "border-gray-300 grayscale" : "border-green-100"
                }`}
                onError={(e) => (e.target.src = defaultUserPic)}
              />
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-3 border-white shadow-md ${
                  isArchived ? "bg-red-500" : "bg-green-500"
                }`}
              >
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-1 ${
                  isArchived ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {fullName || "N/A"}
              </h3>
              <p
                className={`text-sm mb-2 ${
                  isArchived ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Farmer ID:{" "}
                <span
                  className={`font-semibold ${
                    isArchived ? "text-gray-500" : "text-gray-700"
                  }`}
                >
                  {farmer.idNumber || "N/A"}
                </span>
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isArchived
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isArchived ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                {isArchived
                  ? "Archived"
                  : farmer.status
                  ? farmer.status.charAt(0).toUpperCase() +
                    farmer.status.slice(1)
                  : "Active"}
              </span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <User
                className={`w-5 h-5 ${
                  isArchived ? "text-gray-400" : "text-orange-500"
                }`}
              />
              <h4
                className={`font-bold ${
                  isArchived ? "text-gray-600" : "text-gray-900"
                }`}
              >
                Personal Information
              </h4>
            </div>

            {/* First Name and Middle Name */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-xl border ${
                  isArchived
                    ? "bg-gray-100 border-gray-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${
                    isArchived ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  First Name
                </p>
                <p
                  className={`font-semibold ${
                    isArchived ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {farmer.firstname || farmer.firstName || "N/A"}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  isArchived
                    ? "bg-gray-100 border-gray-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${
                    isArchived ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Middle Name
                </p>
                <p
                  className={`font-semibold ${
                    isArchived ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {farmer.middlename || farmer.middleName || "N/A"}
                </p>
              </div>
            </div>

            {/* Last Name and Suffix */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-xl border ${
                  isArchived
                    ? "bg-gray-100 border-gray-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${
                    isArchived ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Last Name
                </p>
                <p
                  className={`font-semibold ${
                    isArchived ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {farmer.lastname || farmer.lastName || "N/A"}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  isArchived
                    ? "bg-gray-100 border-gray-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${
                    isArchived ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Suffix
                </p>
                <p
                  className={`font-semibold ${
                    isArchived ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {farmer.suffix || "N/A"}
                </p>
              </div>
            </div>

            {/* Contact Number and Birth Date */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-xl border ${
                  isArchived
                    ? "bg-gray-100 border-gray-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 flex items-center gap-1 ${
                    isArchived ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  Contact Number
                </p>
                <p
                  className={`font-semibold ${
                    isArchived ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {farmer.contactNumber || "N/A"}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  isArchived
                    ? "bg-gray-100 border-gray-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 flex items-center gap-1 ${
                    isArchived ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  Birth Date
                </p>
                <p
                  className={`font-semibold ${
                    isArchived ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {farmer.birthDate || "N/A"}
                </p>
              </div>
            </div>

            {/* Address - Full width */}
            <div
              className={`p-3 rounded-xl border ${
                isArchived
                  ? "bg-gray-100 border-gray-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p
                className={`text-xs font-medium mb-1 ${
                  isArchived ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Address
              </p>
              <p
                className={`font-semibold ${
                  isArchived ? "text-gray-600" : "text-gray-900"
                }`}
              >
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
          </div>

          {/* Action Button - Restore for archived, Remove for active */}
          <div className="mt-6">
            {isArchived ? (
              <button
                onClick={onRestoreFarmer}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restore Farmer
              </button>
            ) : (
              <button
                onClick={onRemoveFarmer}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Farmer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDetailModal;
