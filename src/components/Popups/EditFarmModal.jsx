//new
import React, { useState, useRef, useEffect } from "react";
import { X, Leaf, Save, Upload, Loader2 } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

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
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load farm data when modal opens
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
      } else {
        setImagePreview("");
      }

      setSelectedImage(null);
      setErrors({});
    }
  }, [farmData, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        farmImage: "Please select a valid image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        farmImage: "Image size must be less than 5MB",
      }));
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, farmImage: "" }));
  };

  const handleSave = async () => {
    setErrors({});

    if (!farmData?.id) {
      setErrors({ general: "Farm ID is missing. Please try again." });
      return;
    }

    // Determine which fields have changed
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

    // Build FormData
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
      const url = `https://papaiaapi.onrender.com/api/owner/farm/${farmData.id}`;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const responseText = await response.text();
      if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try {
          const data = JSON.parse(responseText);
          msg = data.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = JSON.parse(responseText);

      if (data.status === "success") {
        if (onFarmUpdated) {
          // Pass updated farm to parent
          onFarmUpdated(data.farm || { ...farmData, ...trimmedData });
        }
        handleClose();
        alert("Farm updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update farm");
      }
    } catch (error) {
      setErrors({ general: `Failed to update farm: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (selectedImage && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setFormData({ farmName: "", location: "", description: "" });
    setImagePreview("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  // Check if changes exist to enable Save button
  const saveEnabled =
    selectedImage ||
    formData.farmName.trim() !== (farmData?.farmName || "").trim() ||
    formData.location.trim() !== (farmData?.location || "").trim() ||
    formData.description.trim() !== (farmData?.description || "").trim();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-gray-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
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
            <p className="text-white/80 text-sm">
              Update your farm information and description
            </p>
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
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Farm Image{" "}
              <span className="text-gray-500 text-sm">(Optional)</span>
            </label>
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Farm preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                  onError={(e) => (e.target.style.display = "none")}
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

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Farm Name{" "}
                <span className="text-gray-500 text-sm">(Optional)</span>
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
                <span className="text-gray-500 text-sm">(Optional)</span>
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
              <span className="text-gray-500 text-sm">(Optional)</span>
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
            disabled={isLoading || !saveEnabled}
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

// import React, { useState, useRef, useEffect } from "react";
// import { X, Leaf, Save, Upload, Loader2 } from "lucide-react";

// function EditFarmModal({ isOpen, onClose, farmData, onFarmUpdated }) {
//   const [formData, setFormData] = useState({
//     farmName: "",
//     location: "",
//     description: "",
//   });
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const modalRef = useRef(null);

//   // 👇 Close when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);

//   useEffect(() => {
//     if (farmData && isOpen) {
//       console.log("🔍 Farm data loaded:", farmData);

//       setFormData({
//         farmName: farmData.farmName || "",
//         location: farmData.location || "",
//         description: farmData.description || "",
//       });

//       // Set current farm image as preview
//       if (farmData.farmImage) {
//         const imageUrl = farmData.farmImage.startsWith("http")
//           ? farmData.farmImage
//           : `https://papaiaapi.onrender.com${farmData.farmImage}`;
//         setImagePreview(imageUrl);
//       } else {
//         setImagePreview("");
//       }

//       setSelectedImage(null);
//       setErrors({});
//     }
//   }, [farmData, isOpen]);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     // Clear error for this field when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: "",
//       }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         setErrors((prev) => ({
//           ...prev,
//           farmImage: "Please select a valid image file",
//         }));
//         return;
//       }

//       // Validate file size (e.g., 5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors((prev) => ({
//           ...prev,
//           farmImage: "Image size must be less than 5MB",
//         }));
//         return;
//       }

//       setSelectedImage(file);
//       setImagePreview(URL.createObjectURL(file));
//       setErrors((prev) => ({
//         ...prev,
//         farmImage: "",
//       }));
//     }
//   };

//   const handleSave = async () => {
//     console.log("💾 Starting save process...");

//     // Clear any previous errors
//     setErrors({});

//     // Validate that we have a farm ID
//     if (!farmData?.id) {
//       console.error("❌ Farm ID is missing");
//       setErrors({ general: "Farm ID is missing. Please try again." });
//       return;
//     }

//     console.log("✅ Farm ID:", farmData.id);

//     // Build form data with only changed fields
//     const updatedData = {};
//     let hasChanges = false;

//     // Get trimmed values
//     const trimmedFarmName = formData.farmName.trim();
//     const trimmedLocation = formData.location.trim();
//     const trimmedDescription = formData.description.trim();

//     // Get original values (handle undefined/null)
//     const originalFarmName = String(farmData?.farmName || "").trim();
//     const originalLocation = String(farmData?.location || "").trim();
//     const originalDescription = String(farmData?.description || "").trim();

//     console.log("📊 Comparing values:");
//     console.log("Farm Name:", {
//       original: originalFarmName,
//       new: trimmedFarmName,
//     });
//     console.log("Location:", {
//       original: originalLocation,
//       new: trimmedLocation,
//     });
//     console.log("Description:", {
//       original: originalDescription,
//       new: trimmedDescription,
//     });

//     // Check and add changed fields - ALLOW EMPTY VALUES
//     if (trimmedFarmName !== originalFarmName) {
//       updatedData.farmName = trimmedFarmName;
//       hasChanges = true;
//       console.log("✏️ Farm name changed");
//     }

//     if (trimmedLocation !== originalLocation) {
//       updatedData.location = trimmedLocation;
//       hasChanges = true;
//       console.log("✏️ Location changed");
//     }

//     if (trimmedDescription !== originalDescription) {
//       updatedData.description = trimmedDescription;
//       hasChanges = true;
//       console.log("✏️ Description changed");
//     }

//     // Handle image separately since it needs FormData
//     const hasImageChange = !!selectedImage;
//     if (hasImageChange) {
//       hasChanges = true;
//       console.log("✏️ Image changed");
//     }

//     // Check if at least one field has been changed
//     if (!hasChanges) {
//       console.warn("⚠️ No changes detected");
//       handleClose();
//       return;
//     }

//     // Build FormData for the request
//     const formDataToSend = new FormData();

//     // Add all changed fields to FormData
//     Object.keys(updatedData).forEach((key) => {
//       formDataToSend.append(key, updatedData[key]);
//     });

//     // Add image if changed
//     if (selectedImage) {
//       formDataToSend.append("farmImage", selectedImage);
//     }

//     console.log("📤 Sending changes to server...");
//     setIsLoading(true);

//     try {
//       const url = `https://papaiaapi.onrender.com/api/owner/farm/${farmData.id}`;
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Authentication token not found. Please log in again.");
//       }

//       console.log("🌐 Request URL:", url);
//       console.log("🔑 Token exists:", !!token);
//       console.log("📦 FormData contents:");
//       for (let pair of formDataToSend.entries()) {
//         console.log(
//           pair[0],
//           typeof pair[1] === "object" ? `File: ${pair[1].name}` : pair[1]
//         );
//       }

//       const response = await fetch(url, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // Don't set Content-Type for FormData - browser will set it with boundary
//         },
//         body: formDataToSend,
//       });

//       console.log("📥 Response status:", response.status);
//       console.log(
//         "📥 Response headers:",
//         Object.fromEntries(response.headers.entries())
//       );

//       // Get response text first
//       const responseText = await response.text();
//       console.log("📥 Raw response:", responseText);

//       if (!response.ok) {
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(responseText);
//           errorMessage =
//             errorData.message || `HTTP error! status: ${response.status}`;
//           console.error("❌ Error data:", errorData);
//         } catch {
//           errorMessage = `HTTP error! status: ${response.status}. Response: ${responseText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       // Parse successful response
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         console.error("❌ Failed to parse response:", e);
//         throw new Error("Invalid response from server");
//       }

//       console.log("✅ Success response:", data);

//       if (data.status === "success") {
//         console.log("🎉 Farm updated successfully!");

//         // Refresh activities immediately
//         if (onRefresh) {
//           onRefresh();
//         }

//         // Call the update callback
//         if (onFarmUpdated) {
//           onFarmUpdated();
//         }

//         // Close modal
//         handleClose();

//         // Show success message
//         alert("Farm updated successfully!");
//       } else {
//         throw new Error(data.message || "Failed to update farm");
//       }
//     } catch (error) {
//       console.error("❌ Error updating farm:", error);
//       setErrors({
//         general: `Failed to update farm: ${error.message}`,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     console.log("🔒 Closing modal...");

//     // Clean up image preview URL to prevent memory leaks
//     if (selectedImage && imagePreview && imagePreview.startsWith("blob:")) {
//       URL.revokeObjectURL(imagePreview);
//     }

//     setSelectedImage(null);
//     setFormData({
//       farmName: "",
//       location: "",
//       description: "",
//     });
//     setImagePreview("");
//     setErrors({});
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-gray-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
//               <Leaf className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">
//                 Edit Farm Details
//               </h2>
//               <p className="text-white/80 text-sm">
//                 Update your farm information and description
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleClose}
//             className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
//             disabled={isLoading}
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* General Error Message */}
//           {errors.general && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               {errors.general}
//             </div>
//           )}

//           {/* Farm Image Section */}
//           <div>
//             <label className="block text-gray-800 font-medium mb-3">
//               Farm Image{" "}
//               <span className="text-gray-500 text-sm font-normal">
//                 (Optional)
//               </span>
//             </label>
//             <div className="relative">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Farm preview"
//                   className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
//                   onError={(e) => {
//                     console.error("Failed to load image:", imagePreview);
//                     e.target.src = "";
//                     e.target.style.display = "none";
//                     e.target.nextSibling.style.display = "flex";
//                   }}
//                 />
//               ) : null}

//               <div
//                 className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
//                 style={{ display: imagePreview ? "none" : "flex" }}
//               >
//                 <div className="text-center">
//                   <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//                   <p className="text-gray-500">No image selected</p>
//                 </div>
//               </div>

//               <label className="absolute bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors flex items-center gap-2">
//                 <Upload className="w-4 h-4" />
//                 {imagePreview ? "Change Image" : "Upload Image"}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   disabled={isLoading}
//                 />
//               </label>
//             </div>
//             {errors.farmImage && (
//               <p className="text-red-500 text-sm mt-2">{errors.farmImage}</p>
//             )}
//           </div>

//           {/* Form Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-800 font-medium mb-2">
//                 Farm Name{" "}
//                 <span className="text-gray-500 text-sm font-normal">
//                   (Optional)
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.farmName}
//                 onChange={(e) => handleInputChange("farmName", e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
//                 placeholder="Enter farm name"
//                 disabled={isLoading}
//               />
//             </div>

//             <div>
//               <label className="block text-gray-800 font-medium mb-2">
//                 Location{" "}
//                 <span className="text-gray-500 text-sm font-normal">
//                   (Optional)
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.location}
//                 onChange={(e) => handleInputChange("location", e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
//                 placeholder="Enter location"
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-gray-800 font-medium mb-2">
//               Farm Description{" "}
//               <span className="text-gray-500 text-sm font-normal">
//                 (Optional)
//               </span>
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               rows={6}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white resize-none"
//               placeholder="Enter farm description..."
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-200 flex justify-between">
//           <button
//             onClick={handleClose}
//             className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//             disabled={isLoading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={isLoading}
//             className="px-6 py-3 bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white rounded-lg font-bold hover:from-[#F97316] hover:to-[#FF8C42] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Saving Changes...
//               </>
//             ) : (
//               <>
//                 <Save className="w-4 h-4" />
//                 Save Changes
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditFarmModal;
