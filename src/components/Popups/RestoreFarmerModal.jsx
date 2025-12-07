import { X, UserPlus, Loader2, RotateCcw } from "lucide-react";
import { useRef, useEffect, useState, useMemo } from "react";
import { useAlert } from "../../AlertContext";

export default function RestoreFarmerModal({
  isOpen,
  onClose,
  onConfirm,
  farmer,
}) {
  const [isRestoring, setIsRestoring] = useState(false);
  const modalRef = useRef(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        if (!isRestoring) onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, isRestoring]);

  useEffect(() => {
    if (!isOpen) {
      setIsRestoring(false);
    }
  }, [isOpen]);

  const formatName = useMemo(() => {
    if (!farmer) return "Unknown Farmer";
    const firstName = farmer.firstname || farmer.firstName || "";
    const middleName = farmer.middlename || farmer.middleName || "";
    const lastName = farmer.lastname || farmer.lastName || "";
    const suffix = farmer.suffix || "";
    const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(" ") : "Unknown Farmer";
  }, [farmer]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsRestoring(true);
    try {
      await onConfirm();
      showAlert("success", "Farmer Restored Successfully!");
      onClose();
    } catch (error) {
      const errorMessage = error.message?.toLowerCase() || "";

      if (
        errorMessage.includes("already added") ||
        errorMessage.includes("already assigned") ||
        errorMessage.includes("another farm") ||
        errorMessage.includes("different farm") ||
        errorMessage.includes("other farm") ||
        errorMessage.includes("restored") ||
        errorMessage.includes("already active") ||
        errorMessage.includes("currently active")
      ) {
        showAlert(
          "error",
          "Adding failed. This farmer is already assigned to another farm."
        );
      } else if (
        errorMessage.includes("not found") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("does not exist")
      ) {
        showAlert("error", "Invalid farmer ID");
      } else {
        showAlert(
          "error",
          error.message || "Failed to restore farmer. Please try again."
        );
      }

      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
      >
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/30">
              <RotateCcw className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white text-center">
            Restore Farmer?
          </h2>
          <button
            onClick={onClose}
            disabled={isRestoring}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 text-center mb-6">
            This will restore{" "}
            <span className="font-semibold text-gray-900">{formatName}</span>{" "}
            back to active status.
          </p>

          <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-xl p-4 mb-6 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {formatName}
                </h3>
                <p className="text-xs text-slate-600 font-mono">
                  ID: {farmer?.idNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isRestoring}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isRestoring}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all font-semibold shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Restoring
                </>
              ) : (
                "Restore Farmer"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
