import { X, UserPlus, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAlert } from "../../AlertContext";

export default function AddFarmerModal({
  isOpen,
  onClose,
  onFarmerAdded,
  farmId,
}) {
  const [farmerId, setFarmerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const modalRef = useRef(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        if (!isLoading) onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      setFarmerId("");
      setHasError(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateFarmerId = (id) => {
    const pattern = /^FMR-\d+$/;
    return pattern.test(id.trim());
  };

  const handleSubmit = async () => {
    if (!farmerId.trim()) {
      setHasError(true);
      return;
    }

    if (!validateFarmerId(farmerId)) {
      setHasError(true);
      showAlert("error", "Invalid farmer ID");
      return;
    }

    setIsLoading(true);
    setHasError(false);

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
            idNumber: farmerId.trim(),
            farmId: farmId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message?.toLowerCase() || "";

        if (
          errorMessage.includes("already added") ||
          errorMessage.includes("already assigned") ||
          errorMessage.includes("already exists")
        ) {
          showAlert(
            "error",
            "Adding failed. This farmer is already assigned to another farm."
          );
          setIsLoading(false);
          return;
        }

        if (
          errorMessage.includes("another farm") ||
          errorMessage.includes("different farm") ||
          errorMessage.includes("other farm")
        ) {
          showAlert(
            "error",
            "Adding failed. This farmer is already assigned to another farm."
          );
          setIsLoading(false);
          return;
        }

        if (
          errorMessage.includes("restored") ||
          errorMessage.includes("active")
        ) {
          showAlert(
            "error",
            "Adding failed. This farmer is already assigned to another farm."
          );
          setIsLoading(false);
          return;
        }

        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("invalid") ||
          errorMessage.includes("does not exist")
        ) {
          showAlert("error", "Invalid farmer ID");
          setIsLoading(false);
          return;
        }

        showAlert("error", "Invalid farmer ID");
        setIsLoading(false);
        return;
      }

      if (onFarmerAdded) {
        onFarmerAdded(data.farmer);
      }

      onClose();
    } catch (err) {
      console.error("Add farmer error:", err);
      showAlert("error", "Invalid farmer ID");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 flex items-center justify-between rounded-t-2xl relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Farmer</h2>
              <p className="text-white/90 text-sm">Add farmer to the farm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Farmer ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={farmerId}
              onChange={(e) => {
                setFarmerId(e.target.value);
                setHasError(false);
              }}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all ${
                hasError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-orange-500"
              }`}
              style={{ borderWidth: "3px" }}
              placeholder="Enter Farmer ID (e.g., FMR-123456)"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Format: FMR-123456 (FMR- followed by numbers)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !farmerId.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Farmer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
