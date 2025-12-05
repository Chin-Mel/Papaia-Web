import { X, UserPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Alert from "../../components/Alert";

function AddFarmerModal({ isOpen, onClose, onFarmerAdded, farmId, onRefresh }) {
  const [farmerId, setFarmerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const modalRef = useRef(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFarmerId("");
      setHasError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateFarmerId = (id) => {
    const pattern = /^FMR-\d+$/;
    return pattern.test(id.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerId.trim()) {
      setHasError(true);
      setAlert({
        type: "error",
        message: "Please enter a farmer ID.",
      });
      return;
    }

    if (!validateFarmerId(farmerId)) {
      setHasError(true);
      setAlert({
        type: "error",
        message: "Invalid format. Farmer ID must be in format: FMR-123456",
      });
      return;
    }

    setHasError(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

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
          setAlert({
            type: "error",
            message: "This farmer is already added to this farm.",
          });
          setIsLoading(false);
          return;
        }
      }

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

        if (
          errorData?.message?.includes("already added") ||
          errorData?.message?.includes("another farm")
        ) {
          throw new Error("This farmer is already added to another farm.");
        }

        throw new Error(
          errorData.message || `Failed to add farmer (${response.status})`
        );
      }

      const data = await response.json();

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

      const farmerData = {
        idNumber: farmerId,
        ...farmerDetails,
        ...data.farmer,
      };

      const refreshedFarmersRes = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let refreshedFarmers = [];
      if (refreshedFarmersRes.ok) {
        const refreshedData = await refreshedFarmersRes.json();
        if (refreshedData.status === "success") {
          refreshedFarmers = refreshedData.farmers || [];
        }
      }

      onFarmerAdded(farmerData, refreshedFarmers);

      if (onRefresh) {
        onRefresh();
      }

      setAlert({
        type: "success",
        message: "Farmer added successfully!",
      });

      setFarmerId("");
      setHasError(false);
      onClose();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFarmerId("");
    setHasError(false);
    onClose();
  };

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 flex items-center justify-between rounded-t-2xl relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add Farmer</h2>
                <p className="text-white/90 text-sm">Add Farmer to the farm</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                required
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                  hasError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-transparent"
                }`}
                placeholder="Enter Farmer ID (e.g., FMR-123456)"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Format: FMR-123456 (FMR- followed by numbers)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !farmerId.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {isLoading ? "Adding..." : "Add Farmer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default AddFarmerModal;
