import { useState, useRef } from "react";
import { X, Leaf, MapPin, Camera, Plus } from "lucide-react";

export default function AddFarmModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    description: "",
    farmImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, farmImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only send farmName & location as per API
    const payload = {
      farmName: formData.farmName,
      location: formData.location,
    };

    try {
      const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "success") {
        // Construct new farm object for UI
        const newFarm = {
          id: data.farmId,
          name: formData.farmName,
          location: formData.location,
          desc: formData.description,
          img: imagePreview || "https://source.unsplash.com/400x300/?farm",
          health: 100,
          status: "Active",
        };

        onSubmit(newFarm); // update DashboardPage state
      } else {
        console.error("Failed to add farm:", data.message);
      }
    } catch (err) {
      console.error("Error adding farm:", err);
    } finally {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ background: "transparent" }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#FF8C42] rounded-t-lg p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add a Farm</h2>
              <p className="text-white/80 text-sm">Create a new farm profile</p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Farm Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Farm Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => handleInputChange("farmName", e.target.value)}
                placeholder="Enter your farm name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Location/Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Enter farm address or location"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                />
              </div>
            </div>

            {/* Farm Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Farm Picture (Optional)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Farm preview"
                      className="w-32 h-32 mx-auto object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload farm image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your farm..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Farm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
