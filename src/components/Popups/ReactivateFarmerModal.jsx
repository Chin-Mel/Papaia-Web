import { CheckCircle, X, UserPlus } from "lucide-react";
import { useRef, useEffect } from "react";

export default function ReactivateFarmerModal({
  isOpen,
  onClose,
  onConfirm,
  farmer,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const formatName = () => {
    if (!farmer) return "Unknown Farmer";
    const firstName = farmer.firstname || farmer.firstName || "";
    const middleName = farmer.middlename || farmer.middleName || "";
    const lastName = farmer.lastname || farmer.lastName || "";
    const suffix = farmer.suffix || "";
    const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(" ") : "Unknown Farmer";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 sm:p-8 relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            Reactivate Farmer?
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
            This will restore full access for{" "}
            <span className="font-semibold text-gray-900">{formatName()}</span>{" "}
            and their future scans will be added to this farm again.
          </p>

          {/* Farmer Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 mb-6 border border-green-200/50">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">
                    {formatName()}
                  </h3>
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full flex-shrink-0">
                    Reactivating
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-mono">
                  ID: {farmer?.idNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900 font-medium mb-2">
              After reactivation:
            </p>
            <ul className="text-xs text-blue-800 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Farmer status will change to "Active"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>New scans will be added to this farm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Full access to farm operations restored</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Previous scans remain accessible</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
