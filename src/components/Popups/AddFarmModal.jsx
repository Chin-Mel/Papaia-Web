import { useState, useEffect, useRef } from "react";
import { X, MapPin, Camera, Plus } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import { useAlert } from "../../AlertContext";

export default function AddFarmModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    description: "",
    farmImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    farmName: false,
    location: false,
  });
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showAlert("error", "Image exceeds 10 MB");
        return;
      }

      setFormData((prev) => ({ ...prev, farmImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setTouched({
      farmName: true,
      location: true,
    });

    if (!formData.farmName.trim() || !formData.location.trim()) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const farmData = {
      name: formData.farmName,
      location: formData.location,
      description: formData.description || "No farm description",
      farmImage: formData.farmImage,
    };

    try {
      await onSubmit(farmData);
      setFormData({
        farmName: "",
        location: "",
        description: "",
        farmImage: null,
      });
      setImagePreview(null);
      setTouched({
        farmName: false,
        location: false,
      });
      onClose();
    } catch (error) {
      showAlert(
        "error",
        error.message || "Failed to add farm. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isFieldInvalid = (field) => {
    return touched[field] && !formData[field].trim();
  };

  const getInputBorderClass = (field) => {
    if (isFieldInvalid(field)) {
      return "border-red-500 border-2 focus:ring-red-400";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2 focus:ring-orange-400";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        style={{ maxWidth: "calc(768px - 10px)" }}
      >
        {/* Modal Header - Smaller */}
        <div className="bg-gradient-to-r from-green-700 to-orange-500 p-3.5 flex items-center gap-2.5 relative">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <img
              src={PapayaLogo}
              alt="Papaia Logo"
              className="w-4 h-6"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Add a Farm</h2>
            <p className="text-white/90 text-xs">Create a new farm profile</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            type="button"
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50 bg-white/10 hover:bg-white/20 rounded-lg p-1.5 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Vertical Layout */}
        <div className="flex-1">
          <div className="p-5 space-y-2.5">
            {/* Farm Image at Top */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Farm Picture
                <span className="text-gray-400 font-normal text-xs ml-1">
                  (Optional)
                </span>
              </label>
              <div
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } ${imagePreview ? "bg-gray-50" : "bg-white"}`}
                style={{ height: "115px" }}
              >
                {imagePreview ? (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={imagePreview}
                      alt="Farm preview"
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <p className="text-xs text-gray-600 font-medium ml-3">
                      {loading ? "Uploading..." : "Click to change"}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 h-full">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-700">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name and Location Side by Side */}
            <div className="flex gap-3">
              {/* Farm Name */}
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  Farm Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) =>
                    handleInputChange("farmName", e.target.value)
                  }
                  onBlur={() => handleBlur("farmName")}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter farm name"
                  disabled={loading}
                  style={{ width: "100%" }}
                  className={`px-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400 ${getInputBorderClass(
                    "farmName"
                  )}`}
                />
              </div>

              {/* Farm Location */}
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  Location/Address
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    onBlur={() => handleBlur("location")}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter location"
                    disabled={loading}
                    style={{ width: "100%" }}
                    className={`pl-9 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400 ${getInputBorderClass(
                      "location"
                    )}`}
                  />
                </div>
              </div>
            </div>

            {/* Description Below - Fixed Height with Scroll */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Description
                <span className="text-gray-400 font-normal text-xs ml-1">
                  (Optional)
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your farm, crops, farming practices, or any other relevant information..."
                disabled={loading}
                style={{ width: "100%", height: "95px" }}
                className="px-3.5 py-2 border border-gray-300 focus:border-orange-500 focus:border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400 overflow-y-auto"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer - Compact Buttons */}
        <div className="px-5 py-3 bg-white">
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Farm
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
