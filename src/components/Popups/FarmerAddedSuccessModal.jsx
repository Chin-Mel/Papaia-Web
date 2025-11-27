import { X, Check, ArrowLeft } from "lucide-react";
import { useRef, useEffect } from "react";

function FarmerAddedSuccessModal({ isOpen, onClose, farmer }) {
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

  const fullName = farmer
    ? [farmer.firstname, farmer.middlename, farmer.lastname, farmer.suffix]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-orange-500 p-8 relative flex-shrink-0">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Farmer Added Successfully
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            <p className="text-center text-gray-600 mb-6">
              The farmer has been added to the farm management system. Relevant
              data and permissions have been successfully updated.
            </p>

            {/* Farmer Card */}
            {farmer && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border-2 border-green-200 shadow-sm">
                <div className="flex items-center gap-4">
                  {farmer.profilePicture ? (
                    <img
                      src={farmer.profilePicture}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover border-2 border-green-300 shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0">
                      {farmer.firstname?.[0] || "F"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-slate-900 truncate">
                        {fullName || "Farmer"}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full flex-shrink-0">
                        Added
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      ID:{" "}
                      <span className="font-semibold">
                        {farmer.idNumber || farmer.id || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-slate-800 mb-3">
                Access Granted
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Access permissions granted</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Historical data available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
export default FarmerAddedSuccessModal;
