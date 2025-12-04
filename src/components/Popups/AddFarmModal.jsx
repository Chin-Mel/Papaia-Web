import { useState, useEffect, useRef } from "react";
import { X, MapPin, Camera, Plus } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import Alert from "../../components/Alert";

export default function AddFarmModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    description: "",
    farmImage: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

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

  const handleSubmit = async () => {
    if (!formData.farmName.trim() || !formData.location.trim()) {
      setAlert({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setLoading(true);

    const farmData = {
      name: formData.farmName,
      location: formData.location,
      description: formData.description,
      farmImage: formData.farmImage,
    };

    try {
      await onSubmit(farmData);
      // Reset form after successful submission
      setFormData({
        farmName: "",
        location: "",
        description: "",
        farmImage: "",
      });
      setImagePreview(null);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to add farm. Please try again.",
      });
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

  if (!isOpen) return null;

  return (
    <>
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-orange-500 p-5 flex items-center gap-3 relative">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={PapayaLogo}
                alt="Papaia Logo"
                className="w-5 h-7"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Add a Farm</h2>
              <p className="text-white/90 text-sm">Create a new farm profile</p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              type="button"
              className="text-white/80 hover:text-white transition-colors disabled:opacity-50 bg-white/10 hover:bg-white/20 rounded-lg p-1.5 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-5">
              {/* Farm Name */}
              <div className="space-y-2">
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
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your farm name"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  Location/Address
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    placeholder="Enter farm address or location"
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Farm Image */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Farm Picture
                  <span className="text-gray-400 font-normal text-xs ml-1">
                    (Optional)
                  </span>
                </label>
                <div
                  onClick={() => !loading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  } ${imagePreview ? "bg-gray-50" : "bg-white"}`}
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Farm preview"
                        className="w-28 h-28 mx-auto object-cover rounded-lg border-2 border-gray-200"
                      />
                      <p className="text-sm text-gray-600 font-medium">
                        {loading ? "Uploading..." : "Click to change image"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-7 h-7 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload farm image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 10MB
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

              {/* Description */}
              <div className="space-y-2">
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
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.farmName.trim() ||
                  !formData.location.trim()
                }
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {loading ? "Adding..." : "Add Farm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
