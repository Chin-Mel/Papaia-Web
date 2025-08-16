import { useState } from "react";
import { X, Leaf, Save } from "lucide-react";

export default function EditFarmModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    farmName: "Green Valley Organic Farm",
    location: "Sonoma County, California",
    description:
      "Green Valley Organic Farm is a 125-acre sustainable agriculture operation specializing in organic vegetables and herbs. We practice regenerative farming specializing in organic vegetables and herbs. We practice regenerative farming planting. Our commitment to environmental stewardship and community-",
    farmImage:
      "https://source.unsplash.com/600x400/?farm,sunset,solar-panels,greenhouse",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#F97316] rounded-t-lg p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Edit Farm Description
              </h2>
              <p className="text-white/80 text-sm">
                Update your farm details and description
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
        <div className="p-6 space-y-6">
          {/* Farm Image Section */}
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Farm Image
            </label>
            <div className="relative">
              <img
                src={formData.farmImage}
                alt="Farm at sunset"
                className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-green-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
            </div>
          </div>

          {/* Farm Name and Location Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farm Name */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Farm Name
              </label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => handleInputChange("farmName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
                placeholder="Enter farm name"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Farm Description Section */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Farm Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white resize-none"
              placeholder="Enter farm description..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white rounded-lg font-bold hover:from-[#F97316] hover:to-[#FF8C42] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
