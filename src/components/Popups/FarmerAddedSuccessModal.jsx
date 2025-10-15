import { X, Check, ArrowLeft } from "lucide-react";
import { useRef, useEffect } from "react";

function FarmerAddedSuccessModal({ isOpen, onClose, farmer }) {
  if (!isOpen) return null;

  const fullName = farmer
    ? [farmer.firstname, farmer.middlename, farmer.lastname, farmer.suffix]
        .filter(Boolean)
        .join(" ")
    : "";

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

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 text-center relative">
          <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-3">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Farmer Added Successfully
          </h2>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            The farmer has been added to the farm management system. Relevant
            data and permissions have been successfully updated.
          </p>

          {farmer && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                {farmer.profilePicture ? (
                  <img
                    src={farmer.profilePicture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                    {farmer.firstname?.[0] || "F"}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {fullName || "Farmer"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {farmer.idNumber || farmer.id || "N/A"}
                  </p>
                </div>
              </div>
              <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium">
                Added
              </span>
            </div>
          )}

          <ul className="space-y-2 text-gray-700 mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> Access permissions
              granted
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> Historical data
              available
            </li>
          </ul>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default FarmerAddedSuccessModal;
