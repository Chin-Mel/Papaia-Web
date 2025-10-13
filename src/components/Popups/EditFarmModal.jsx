import React, { useState, useEffect } from "react";
import { X, Leaf, Save, Upload, Loader2 } from "lucide-react";

function EditFarmModal({ isOpen, onClose, farmData, onFarmUpdated }) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (farmData && isOpen) {
      setFormData({
        farmName: farmData.farmName || "",
        location: farmData.location || "",
        description: farmData.description || "",
      });

      // Set current farm image as preview
      if (farmData.farmImage) {
        const imageUrl = farmData.farmImage.startsWith("http")
          ? farmData.farmImage
          : `https://papaiaapi.onrender.com${farmData.farmImage}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview("");
      }

      setSelectedImage(null);
      setErrors({});
    }
  }, [farmData, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          farmImage: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          farmImage: "Image size must be less than 5MB",
        }));
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({
        ...prev,
        farmImage: "",
      }));
    }
  };

  const handleSave = async () => {
    // Clear any previous errors
    setErrors({});

    // Build form data with only changed fields
    const formDataToSend = new FormData();
    let hasChanges = false;

    // Only add fields that have actually changed
    if (formData.farmName.trim() !== (farmData?.farmName || "")) {
      formDataToSend.append("farmName", formData.farmName.trim());
      hasChanges = true;
    }

    if (formData.location.trim() !== (farmData?.location || "")) {
      formDataToSend.append("location", formData.location.trim());
      hasChanges = true;
    }

    if (formData.description.trim() !== (farmData?.description || "")) {
      formDataToSend.append("description", formData.description.trim());
      hasChanges = true;
    }

    if (selectedImage) {
      formDataToSend.append("farmImage", selectedImage);
      hasChanges = true;
    }

    // Check if at least one field has been changed
    if (!hasChanges) {
      setErrors({
        general: "Please make at least one change before saving",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log(
        "Sending PATCH request to:",
        `https://papaiaapi.onrender.com/api/owner/farm/${farmData.id}`
      );

      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farm/${farmData.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Success response:", data);

      if (data.status === "success") {
        if (onFarmUpdated) {
          onFarmUpdated();
        }
        handleClose();
        alert("Farm updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update farm");
      }
    } catch (error) {
      console.error("Error updating farm:", error);
      setErrors({ general: `Failed to update farm: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up image preview URL to prevent memory leaks
    if (selectedImage && imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setFormData({
      farmName: "",
      location: "",
      description: "",
    });
    setImagePreview("");
    setErrors({});
    onClose();
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
                Edit Farm Details
              </h2>
              <p className="text-white/80 text-sm">
                Update your farm information and description
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Farm Image Section */}
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Farm Image{" "}
              <span className="text-gray-500 text-sm font-normal">
                (Optional)
              </span>
            </label>
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Farm preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No image selected</p>
                  </div>
                </div>
              )}

              <label className="absolute bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
            {errors.farmImage && (
              <p className="text-red-500 text-sm mt-2">{errors.farmImage}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Farm Name{" "}
                <span className="text-gray-500 text-sm font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => handleInputChange("farmName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
                placeholder="Enter farm name"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Location{" "}
                <span className="text-gray-500 text-sm font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
                placeholder="Enter location"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Farm Description{" "}
              <span className="text-gray-500 text-sm font-normal">
                (Optional)
              </span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white resize-none"
              placeholder="Enter farm description..."
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white rounded-lg font-bold hover:from-[#F97316] hover:to-[#FF8C42] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
