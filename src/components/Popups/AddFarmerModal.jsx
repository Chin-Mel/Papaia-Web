import { useState } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";

export default function AddFarmerModal({
  isOpen,
  onClose,
  onFarmerAdded,
  farmId,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    phone: "",
    street: "",
    barangay: "",
    municipality: "",
    province: "",
    zipcode: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onFarmerAdded(formData);

      // Reset form
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        phone: "",
        street: "",
        barangay: "",
        municipality: "",
        province: "",
        zipcode: "",
      });
    } catch (error) {
      console.error("Error adding farmer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-orange-500 p-6 relative rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Farmer</h2>
              <p className="text-white/80 text-sm">Add farmer to the farm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Middle Name
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) =>
                  handleInputChange("middleName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Suffix
              </label>
              <input
                type="text"
                value={formData.suffix}
                onChange={(e) => handleInputChange("suffix", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Jr., Sr., III, etc."
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="+63 912 345 6789"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Street
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter street address"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Barangay
              </label>
              <input
                type="text"
                value={formData.barangay}
                onChange={(e) => handleInputChange("barangay", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter barangay"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Municipality
              </label>
              <input
                type="text"
                value={formData.municipality}
                onChange={(e) =>
                  handleInputChange("municipality", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter municipality"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Province
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => handleInputChange("province", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter province"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Zipcode
              </label>
              <input
                type="text"
                value={formData.zipcode}
                onChange={(e) => handleInputChange("zipcode", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter zipcode"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-bold hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding Farmer...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add Farmer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
