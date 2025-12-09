//new
import { useState, useEffect, useRef } from "react";
import { X, Save, Upload, Loader2, Leaf } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function EditFarmModal({
  isOpen,
  onClose,
  farmData,
  onFarmUpdated,
}) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        handleClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (farmData && isOpen) {
      setFormData({
        farmName: farmData.farmName || "",
        location: farmData.location || "",
        description: farmData.description || "",
      });

      if (farmData.farmImage) {
        const imageUrl = farmData.farmImage.startsWith("http")
          ? farmData.farmImage
          : `https://papaiaapi.onrender.com${farmData.farmImage}`;
        setImagePreview(imageUrl);
      } else setImagePreview("");

      setSelectedImage(null);
      setFocusedField(null);
      setAlert({ type: "", message: "" });
    }
  }, [farmData, isOpen]);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAlert({ type: "error", message: "Please select a valid image file" });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAlert({ type: "error", message: "Image size must be less than 10MB" });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!farmData?.id) return;

    const trimmedData = {
      farmName: formData.farmName.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
    };

    const hasChanges =
      selectedImage ||
      trimmedData.farmName !== (farmData.farmName || "").trim() ||
      trimmedData.location !== (farmData.location || "").trim() ||
      trimmedData.description !== (farmData.description || "").trim();

    if (!hasChanges) {
      handleClose();
      return;
    }

    const formDataToSend = new FormData();
    if (trimmedData.farmName !== (farmData.farmName || "").trim())
      formDataToSend.append("farmName", trimmedData.farmName);
    if (trimmedData.location !== (farmData.location || "").trim())
      formDataToSend.append("location", trimmedData.location);
    if (trimmedData.description !== (farmData.description || "").trim())
      formDataToSend.append("description", trimmedData.description);
    if (selectedImage) formDataToSend.append("farmImage", selectedImage);

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farm/${farmData.id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setAlert({ type: "success", message: "Farm Updated Successfully!" });
        if (onFarmUpdated)
          onFarmUpdated(data.farm || { ...farmData, ...trimmedData });
        setTimeout(() => handleClose(), 1000);
      } else {
        throw new Error(data.message || "Failed to update farm");
      }
    } catch (error) {
      setAlert({ type: "error", message: error.message });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (selectedImage && imagePreview.startsWith("blob:"))
      URL.revokeObjectURL(imagePreview);
    setSelectedImage(null);
    setFormData({ farmName: "", location: "", description: "" });
    setImagePreview("");
    setFocusedField(null);
    setAlert({ type: "", message: "" });
    onClose();
  };

  if (!isOpen) return null;

  const saveEnabled =
    selectedImage ||
    formData.farmName.trim() !== (farmData?.farmName || "").trim() ||
    formData.location.trim() !== (farmData?.location || "").trim() ||
    formData.description.trim() !== (farmData?.description || "").trim();

  const getBorderClass = (field) =>
    focusedField === field ? "border-orange-500" : "border-gray-300";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-orange-500 rounded-t-xl p-5 relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <img
              src={PapayaLogo}
              alt="Papaia Logo"
              className="w-5 h-7"
              loading="eager"
              decoding="async"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Farm Details</h2>
            <p className="text-white/90 text-sm">
              Update your farm information
            </p>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert */}
        {alert.message && (
          <div className="mx-5 mt-5">
            <div
              className={`p-3 rounded-lg ${
                alert.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-green-50 text-green-800 border border-green-200"
              }`}
            >
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Top row: Image left + Name/Location right */}
          <div className="flex gap-5 items-start">
            {/* Left column: Farm Image */}
            <div className="w-1/3">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Farm Image{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Farm preview"
                    className="w-full h-56 object-cover rounded-lg border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No image selected</p>
                    </div>
                  </div>
                )}
                <label className="absolute bottom-3 right-3 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  {imagePreview ? "Change" : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>

            {/* Right column: Name + Location */}
            <div className="flex-1 space-y-4">
              {/* Farm Name */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Farm Name{" "}
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) =>
                    handleInputChange("farmName", e.target.value)
                  }
                  onFocus={() => setFocusedField("farmName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter farm name"
                  disabled={isLoading}
                  className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none bg-white transition-all ${getBorderClass(
                    "farmName"
                  )}`}
                />
              </div>

              {/* Farm Location */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Location{" "}
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  onFocus={() => setFocusedField("location")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter location"
                  disabled={isLoading}
                  className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none bg-white transition-all ${getBorderClass(
                    "location"
                  )}`}
                />
              </div>
            </div>
          </div>

          {/* Description full width */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Description{" "}
              <span className="text-gray-400 text-sm">(Optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              onFocus={() => setFocusedField("description")}
              onBlur={() => setFocusedField(null)}
              rows={5}
              placeholder="Enter farm description..."
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none bg-white resize-none transition-all ${getBorderClass(
                "description"
              )}`}
            />
          </div>
        </div>

        {/* Modal Footer (Buttons) */}
        <div className="p-5 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !saveEnabled}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving
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
