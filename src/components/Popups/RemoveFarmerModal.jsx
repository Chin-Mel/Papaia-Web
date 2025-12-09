import { useState, useEffect, useRef } from "react";
import { X, User, UserMinus, Loader2 } from "lucide-react";
import { useAlert } from "../../AlertContext";

export default function RemoveFarmerModal({
  isOpen,
  onClose,
  onConfirmRemove,
  farmer,
}) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getFullName = (farmer) => {
    if (!farmer) return "Unknown Farmer";
    return (
      [
        farmer.firstname || farmer.firstName || "",
        farmer.middlename || farmer.middleName || "",
        farmer.lastname || farmer.lastName || "",
        farmer.suffix || "",
      ]
        .filter(Boolean)
        .join(" ") || "Unknown Farmer"
    );
  };

  const handleConfirmRemove = async () => {
    if (confirmationText !== "REMOVE") {
      showAlert(
        "warning",
        'Please type "REMOVE" in capital letters to confirm'
      );
      return;
    }

    setIsLoading(true);
    try {
      await onConfirmRemove();
      onClose();
    } catch (error) {
      showAlert("error", "Failed to remove farmer. Please try again.");
      setIsLoading(false);
    }
  };

  const isButtonEnabled = confirmationText === "REMOVE" && !isLoading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
      >
        <div className="bg-gradient-to-r from-green-700 to-orange-500 p-5 relative rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
              <UserMinus className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Remove Farmer</h2>
              <p className="text-white/90 text-sm">Revoke farm access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50 bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-green-50 rounded-xl p-3.5 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {getFullName(farmer)}
                </h3>
                <p className="text-sm text-gray-600">
                  ID:{" "}
                  <span className="font-semibold">
                    {farmer?.idNumber || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3.5">
            <p className="font-bold text-amber-900 mb-2 text-sm">
              This action cannot be undone and will have the following
              consequences:
            </p>
            <ul className="space-y-1.5 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Farmer will lose access to the farm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>
                  All their existing reports and analytics will remain.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm text-gray-800 font-semibold mb-2">
              Type <span className="font-bold text-red-600">"REMOVE"</span> (in
              capital letters) to confirm:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type REMOVE here"
              className="w-full px-4 py-2.5 border-3 border-gray-300 rounded-xl focus:outline-none transition-all focus:border-orange-500"
              style={{ borderWidth: "3px" }}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRemove}
              disabled={!isButtonEnabled}
              className="flex-1 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Removing
                </>
              ) : (
                <>
                  <UserMinus className="w-4 h-4" />
                  Remove Farmer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
