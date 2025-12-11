import { useEffect, useRef } from "react";

export default function PrivacyPolicyModal({ isOpen, onClose, onAgree }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAgree = () => {
    if (onAgree) {
      onAgree();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <div
        ref={modalRef}
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-6 py-4 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Privacy Policy
          </h3>
          <p className="text-xs sm:text-sm text-white/90 mt-1">
            Last Updated: October 29, 2025
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to Papaia, an AI-powered system for papaya disease
              identification and farm management. By creating an account and
              using this system, you agree to comply with these Privacy
              Policies. Please read this document carefully before proceeding.
            </p>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                1. Data Collection and Privacy
              </h3>
              <p>Papaia collects the following user and farm-related data:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Account details (name, email, role, and farm affiliation)
                </li>
                <li>Uploaded images (papaya leaf/fruit scans)</li>
                <li>Activity and usage logs</li>
              </ul>
              <p className="mt-2">
                All data are processed in accordance with the{" "}
                <strong>Data Privacy Act of 2012 (RA 10173).</strong> Data are
                used solely for:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>AI-based disease analysis and model improvement</li>
                <li>Research and system analytics</li>
                <li>User experience enhancement</li>
              </ul>
              <p className="mt-2">
                Papaia does not <strong>sell, trade, or disclose</strong>{" "}
                personal data to third parties without prior consent, except as
                required by law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                2. Data Retention and Deletion
              </h3>
              <p>
                User data will remain stored securely for as long as the account
                is active. If a farmer account is deleted, their scan records
                remain visible to the farm owner in anonymized form (e.g.,
                timestamps, disease results) for analytics integrity. Users may
                request data deletion or export in compliance with RA 10173.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                3. Security and Confidentiality
              </h3>
              <p>
                Papaia uses <strong>Google Firebase</strong> for encrypted,
                cloud-based data storage. All transmitted data are protected
                through{" "}
                <strong>SSL encryption and authentication protocols.</strong>{" "}
                Periodic security audits are conducted to safeguard against
                unauthorized access. However, users acknowledge that no online
                system is completely secure and that they share data at their
                own discretion.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 active:scale-95"
          >
            Disagree
          </button>
          <button
            onClick={handleAgree}
            className="flex-1 h-11 bg-[#F97316] hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 active:scale-95"
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
}
