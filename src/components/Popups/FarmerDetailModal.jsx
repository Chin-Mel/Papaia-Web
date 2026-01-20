import {
  X,
  User,
  Phone,
  CheckCircle,
  RotateCcw,
  Trash2,
  UserMinus,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useMemo, useState } from "react";
import { useAlert } from "../../AlertContext";
import UserAvatar from "../UserAvatar";

export default function FarmerDetailModal({
  isOpen,
  onClose,
  onRestoreFarmer,
  onRemoveFarmer,
  farmer,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const farmerData = useMemo(() => {
    if (!farmer) return null;

    const firstName = farmer.firstname || farmer.firstName || "";
    const middleName = farmer.middlename || farmer.middleName || "";
    const lastName = farmer.lastname || farmer.lastName || "";
    const fullName =
      [firstName, middleName, lastName].filter(Boolean).join(" ") || "N/A";
    const isArchived =
      farmer.isArchived || farmer.status?.toLowerCase() === "archived";

    const addressParts = [
      farmer.street,
      farmer.barangay,
      farmer.municipality,
      farmer.province,
    ].filter(Boolean);
    const hasAddress = addressParts.length > 0;
    const fullAddress = hasAddress ? addressParts.join(", ") : "";

    return {
      firstName,
      lastName,
      fullName,
      isArchived,
      hasAddress,
      fullAddress,
      idNumber: farmer.idNumber || "N/A",
      contactNumber: farmer.contactNumber || "N/A",
      profilePicture: farmer.profilePicture || null,
    };
  }, [farmer]);

  if (!isOpen || !farmerData) return null;

  const {
    firstName,
    lastName,
    fullName,
    isArchived,
    hasAddress,
    fullAddress,
    idNumber,
    contactNumber,
    profilePicture,
  } = farmerData;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
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
                {isArchived ? "Archived Farmer" : "Farmer Details"}
              </h2>
              <p className="text-white/90 text-sm">
                {isArchived ? "This farmer is archived" : "View profile"}
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

        {isArchived && (
          <div className="bg-red-50 border-b-2 border-red-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-red-900">
                This farmer is currently archived
              </p>
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16">
                <UserAvatar
                  name={fullName}
                  profileImageUrl={profilePicture}
                  className="w-full h-full"
                />
              </div>

              <div
                className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md ${
                  isArchived ? "bg-red-500" : "bg-green-500"
                }`}
              >
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg font-bold mb-0.5 ${
                  isArchived ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {fullName}
              </h3>
              <p
                className={`text-xs mb-1.5 ${
                  isArchived ? "text-gray-400" : "text-gray-500"
                }`}
              >
                ID:{" "}
                <span
                  className={`font-semibold ${
                    isArchived ? "text-gray-500" : "text-gray-700"
                  }`}
                >
                  {idNumber}
                </span>
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isArchived
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isArchived ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                {isArchived ? "Archived" : "Active"}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div
              className={`p-2.5 rounded-lg border ${
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
                className={`text-sm font-semibold ${
                  isArchived ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {contactNumber}
              </p>
            </div>

            <div
              className={`p-2.5 rounded-lg border ${
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
                className={`text-sm font-semibold ${
                  isArchived ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {hasAddress ? fullAddress : "No address"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            {isArchived ? (
              <button
                onClick={onRestoreFarmer}
                className="w-full px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Restore Farmer
              </button>
            ) : (
              <button
                onClick={onRemoveFarmer}
                className="w-full px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
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
