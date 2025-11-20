import React from "react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="w-full max-w-lg mx-auto rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header with gradient background */}
        <div
          className="flex flex-col items-center justify-center text-white p-6"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="bg-white rounded-full p-4 shadow-lg mb-4">
            <img
              src={PapayaLogo || "https://via.placeholder.com/56"}
              alt="Papaia Logo"
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Privacy Policy
          </h2>
          <p className="text-sm sm:text-base text-center opacity-90 mt-1">
            Last Updated: October 29, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-6 overflow-y-auto flex-1">
          <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to Papaia, an AI-powered system for papaya disease
              identification and farm management. By creating an account and
              using this system, you agree to comply with these Privacy
              Policies. Please read this document carefully before proceeding.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                1. Data Collection and Privacy
              </h3>
            </div>

            <p>Papaia collects the following user and farm-related data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account details (name, email, role, and farm affiliation)</li>
              <li>Uploaded images (papaya leaf/fruit scans)</li>
              <li>Activity and usage logs</li>
            </ul>
            <p>
              All data are processed in accordance with the Data Privacy Act of
              2012 (RA 10173). Data are used solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>AI-based disease analysis and model improvement</li>
              <li>Research and system analytics</li>
              <li>User experience enhancement</li>
            </ul>
            <p>
              Papaia does not sell, trade, or disclose personal data to third
              parties without prior consent, except as required by law.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                2. Data Retention and Deletion
              </h3>
            </div>

            <p>
              User data will remain stored securely for as long as the account
              is active. If a farmer account is deleted, their scan records
              remain visible to the farm owner in anonymized form (e.g.,
              timestamps, disease results) for analytics integrity. Users may
              request data deletion or export in compliance with RA 10173.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                3. Security and Confidentiality
              </h3>
            </div>

            <p>
              Papaia uses Google Firebase for encrypted, cloud-based data
              storage. All transmitted data are protected through SSL encryption
              and authentication protocols. Periodic security audits are
              conducted to safeguard against unauthorized access. However, users
              acknowledge that no online system is completely secure and that
              they share data at their own discretion.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer mt-6 w-full flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow bg-orange-500 hover:bg-orange-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
