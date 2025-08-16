import { X, User, Phone, Leaf, CheckCircle, Trash2 } from "lucide-react";

export default function FarmerDetailModal({ isOpen, onClose, onRemoveFarmer }) {
  if (!isOpen) return null;

  // Mock farmer data
  const farmer = {
    name: "John Michael Thompson",
    farmerId: "FM-2024-0856",
    status: "Active",
    dateOfBirth: "March 15, 1985",
    age: "39 years old",
    username: "@johnthompson",
    email: "john.thompson@farmmail.com",
    phone: "+1 (555) 123-4567",
    profileImage: "https://source.unsplash.com/120x120/?man,portrait",
    assignedFarms: [
      {
        name: "Green Valley Farm",
        location: "Valley Ridge, CA",
        color: "green",
      },
      {
        name: "Sunset Orchard",
        location: "Hillside, CA",
        color: "orange",
      },
    ],
  };

  const getFarmCardStyles = (color) => {
    switch (color) {
      case "green":
        return {
          background: "bg-green-50",
          text: "text-green-800",
          location: "text-green-600",
        };
      case "orange":
        return {
          background: "bg-orange-50",
          text: "text-orange-800",
          location: "text-orange-600",
        };
      default:
        return {
          background: "bg-gray-50",
          text: "text-gray-800",
          location: "text-gray-600",
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#F97316] rounded-t-lg p-6 relative">
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Farmer Profile Overview */}
          <div className="flex items-start gap-6 mb-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={farmer.profileImage}
                alt={farmer.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Farmer Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {farmer.name}
              </h3>
              <p className="text-gray-600 mb-3">Farmer ID: {farmer.farmerId}</p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {farmer.status}
              </span>
            </div>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold text-gray-800">
                  Personal Information
                </h4>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Full Name</p>
                  <p className="text-gray-800 font-medium">{farmer.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Date of Birth</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.dateOfBirth}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Age</p>
                  <p className="text-gray-800 font-medium">{farmer.age}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold text-gray-800">Contact Information</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Username</p>
                  <p className="text-gray-800 font-medium">{farmer.username}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Email Address</p>
                  <p className="text-gray-800 font-medium">{farmer.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                  <p className="text-gray-800 font-medium">{farmer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Farms Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-orange-500" />
              <h4 className="font-bold text-gray-800">Assigned Farms</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmer.assignedFarms.map((farm, index) => {
                const styles = getFarmCardStyles(farm.color);
                return (
                  <div
                    key={index}
                    className={`${styles.background} rounded-lg p-4`}
                  >
                    <h5 className={`font-bold ${styles.text} mb-1`}>
                      {farm.name}
                    </h5>
                    <p className={`text-sm ${styles.location}`}>
                      Location: {farm.location}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={onRemoveFarmer}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
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
