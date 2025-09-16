import { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  Leaf,
  MapPin,
  CheckCircle,
  Trash2,
  Loader2,
} from "lucide-react";

function DeactivateFarmModal({ isOpen, onClose, farm, onConfirmDeactivate }) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDeactivate = async () => {
    if (confirmationText !== "DEACTIVATE") return;

    setIsLoading(true);
    try {
      await onConfirmDeactivate(farm.id || farm._id || farmId); // call parent handler with farm ID
    } catch (error) {
      alert("Error deactivating farm: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#F97316] rounded-t-lg p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Deactivate Farm</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {farm && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {farm.farmName}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-700 text-sm">
                    <MapPin className="w-3 h-3 text-green-600" />
                    {farm.location || "No location specified"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-800 font-medium">
            Type <span className="font-bold">DEACTIVATE</span> to confirm
            deactivation.
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type DEACTIVATE here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
            disabled={isLoading}
          />
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDeactivate}
            disabled={confirmationText !== "DEACTIVATE" || isLoading}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Deactivate Farm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeactivateFarmModal;
