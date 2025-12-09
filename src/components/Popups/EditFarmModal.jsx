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

  // Inside the return statement - replace everything inside return():

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        style={{ maxWidth: "calc(768px - 10px)" }}
      >
        {/* Modal Header */}
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
            <h2 className="text-lg font-bold text-white">Edit Farm</h2>
            <p className="text-white/90 text-xs">Update farm information</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            type="button"
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50 bg-white/10 hover:bg-white/20 rounded-lg p-1.5 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
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
                onClick={() =>
                  !isLoading &&
                  document.getElementById("farmImageInput")?.click()
                }
                className={`border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
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
                      {isLoading ? "Uploading..." : "Click to change"}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 h-full">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-orange-500" />
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
                  id="farmImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
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
                  onFocus={() => setFocusedField("farmName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter farm name"
                  disabled={isLoading}
                  style={{ width: "100%" }}
                  className={`px-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400 ${getBorderClass(
                    "farmName"
                  )} focus:border-orange-500 focus:border-2 focus:ring-orange-400`}
                />
              </div>

              {/* Farm Location */}
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  Location/Address
                  <span className="text-red-500">*</span>
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
                  style={{ width: "100%" }}
                  className={`px-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400 ${getBorderClass(
                    "location"
                  )} focus:border-orange-500 focus:border-2 focus:ring-orange-400`}
                />
              </div>
            </div>

            {/* Description Below */}
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
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                placeholder="Describe your farm, crops, farming practices, or any other relevant information..."
                disabled={isLoading}
                style={{ width: "100%", height: "95px" }}
                className={`px-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-800 placeholder-gray-400 overflow-y-auto ${getBorderClass(
                  "description"
                )} focus:border-orange-500 focus:border-2 focus:ring-orange-400`}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white">
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || !saveEnabled}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
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
    </div>
  );
}
