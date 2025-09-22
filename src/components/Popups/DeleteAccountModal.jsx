import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [confirmText, setConfirmText] = useState("");

  const isDeleteEnabled = confirmText === "DELETE";

  const handleCancel = () => {
    setIsOpen(false);
    setConfirmText("");
  };

  const handleDelete = () => {
    if (isDeleteEnabled) {
      // Handle delete logic here
      console.log("Account deleted");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="p-8 text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Open Delete Account Modal
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";

      return () => {
        document.body.style.overflow = "unset";
        document.body.style.pointerEvents = "auto";
      };
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-white font-semibold text-lg">Delete Account</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm leading-relaxed">
              Deleting your account is permanent. This action cannot be undone.
            </p>
          </div>

          {/* What will be lost */}
          <div>
            <h3 className="text-gray-900 font-medium mb-4">
              What will be lost:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  All farm data and analytics
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Scan history and treatment records
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Subscriptions and preferences
                </span>
              </li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <p className="text-gray-700 text-sm mb-3">
              Type <span className="font-bold text-red-600">DELETE</span> to
              confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isDeleteEnabled}
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
              isDeleteEnabled
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
