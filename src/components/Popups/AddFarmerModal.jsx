import { X } from "lucide-react";
import { useState, useEffect } from "react";

function AddFarmerModal({ isOpen, onClose, onFarmerAdded, farmId }) {
  const [farmerId, setFarmerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerId.trim()) {
      alert("Please enter a valid farmer ID number.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // First, check if farmer already exists in this farm
      const existingFarmersRes = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (existingFarmersRes.ok) {
        const existingData = await existingFarmersRes.json();
        const existingFarmer = existingData.farmers?.find(
          (farmer) => farmer.idNumber === farmerId.trim()
        );

        if (existingFarmer) {
          alert("This farmer is already added to this farm.");
          setIsLoading(false);
          return;
        }
      }

      console.log("Adding farmer with data:", { idNumber: farmerId, farmId });

      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idNumber: farmerId.trim(),
            farmId: farmId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(
          errorData.message || `Failed to add farmer (${response.status})`
        );
      }

      const data = await response.json();
      console.log("Farmer added response:", data);

      // Fetch the complete farmer details using the new endpoint
      const farmerDetailsRes = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${
          data.farmer?.id || farmerId
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let farmerDetails = null;
      if (farmerDetailsRes.ok) {
        const detailsData = await farmerDetailsRes.json();
        if (detailsData.status === "success") {
          farmerDetails = detailsData.farmer;
        }
      }

      // Create farmer data object to pass back
      const farmerData = {
        idNumber: farmerId,
        ...farmerDetails,
        ...data.farmer,
      };

      // Refresh the farmers list directly
      const refreshedFarmersRes = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Call the parent handler with both farmer data and refreshed list
      let refreshedFarmers = [];
      if (refreshedFarmersRes.ok) {
        const refreshedData = await refreshedFarmersRes.json();
        if (refreshedData.status === "success") {
          refreshedFarmers = refreshedData.farmers || [];
        }
      }

      onFarmerAdded(farmerData, refreshedFarmers);

      // Refresh activities immediately
      if (window.refreshActivities) {
        window.refreshActivities();
      }

      // Reset form and close modal
      setFarmerId("");
      onClose();
    } catch (err) {
      console.error("Error adding farmer:", err);
      alert("Error adding farmer: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFarmerId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Farmer by ID</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Farmer ID Number
            </label>
            <input
              type="text"
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-transparent"
              placeholder="Enter Farmer ID (e.g., FMR-123456)"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the unique ID number of the farmer to add to this farm.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !farmerId.trim()}
              className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add Farmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFarmerModal;
