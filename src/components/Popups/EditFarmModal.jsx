import { useState } from "react";
import { X, Leaf, Save } from "lucide-react";

function EditFarmModal({ isOpen, onClose, onSave, farm }) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    description: "",
    farmImage: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (farm && isOpen) {
      setFormData({
        farmName: farm.farmName || "",
        location: farm.location || "",
        description: farm.description || "",
        farmImage: farm.farmImage || "",
      });
    }
  }, [farm, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await mockAPI.updateFarm(farm.id, formData);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error updating farm:", error);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative">
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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Farm Image
            </label>
            <div className="relative">
              <img
                src={formData.farmImage}
                alt="Farm"
                className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-green-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white rounded-lg font-bold hover:from-[#F97316] hover:to-[#FF8C42] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditFarmModal;
