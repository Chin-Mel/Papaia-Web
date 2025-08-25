import { X, User, Phone, CheckCircle, Trash2 } from "lucide-react";

function FarmerDetailModal({ isOpen, onClose, onRemoveFarmer, farmer }) {
  if (!isOpen || !farmer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {farmer.firstname || farmer.firstName}{" "}
                {farmer.middlename || farmer.middleName}{" "}
                {farmer.lastname || farmer.lastName} {farmer.suffix}
              </h3>
              <p className="text-gray-600 mb-3">
                Farmer ID: {farmer.id || farmer.farmerId}
              </p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {farmer.status
                  ? farmer.status.charAt(0).toUpperCase() +
                    farmer.status.slice(1)
                  : "Active"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                  <p className="text-gray-800 font-medium">
                    {farmer.firstname || farmer.firstName}{" "}
                    {farmer.middlename || farmer.middleName}{" "}
                    {farmer.lastname || farmer.lastName} {farmer.suffix}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Address</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.address ||
                      `${farmer.street || ""}, ${farmer.barangay || ""}, ${
                        farmer.municipality || ""
                      }, ${farmer.province || ""} ${farmer.zipcode || ""}`
                        .replace(/^,\s*|,\s*$/g, "")
                        .replace(/,\s*,/g, ",")}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold text-gray-800">Contact Information</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Email Address</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.email || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                  <p className="text-gray-800 font-medium">
                    {farmer.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

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

export default FarmerDetailModal;
