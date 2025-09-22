import { X } from "lucide-react";
import { useState } from "react";

function AddFarmerModal({ isOpen, onClose, onSubmit, farmId }) {
  const [farmerId, setFarmerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idNumber: farmerId, // <-- correct field
            farmId: farmId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to add farmer");
      }

      const data = await response.json();
      console.log("Farmer added response:", data);

      if (data.farmer) {
        onSubmit(data.farmer);
      }

      setFarmerId("");
      onClose();
    } catch (err) {
      console.error("Error adding farmer:", err);
      alert("Error adding farmer: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");

      return () => {
        document.body.classList.remove("modal-open");
      };
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Farmer by ID</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-gray-700 font-medium mb-2">
            Farmer ID
          </label>
          <input
            type="text"
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            placeholder="Enter Farmer ID"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition disabled:opacity-50"
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
