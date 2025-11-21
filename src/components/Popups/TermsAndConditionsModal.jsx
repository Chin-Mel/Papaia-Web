import React from "react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function TermsAndConditionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="w-full max-w-lg mx-auto rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header with gradient background */}
        <div
          className="flex flex-col items-center justify-center text-white p-4"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
            <img
              src={PapayaLogo || "https://via.placeholder.com/56"}
              alt="Papaia Logo"
              className="w-7 h-9 sm:w-7 sm:h-9"
            />
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-bold text-center">
            Terms & Conditions
          </h3>

          <p className="text-[9px] sm:text-xs md:text-sm text-center opacity-90 mt-1">
            Last Updated: October 29, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-6 overflow-y-auto flex-1">
          <div className="text-gray-700 space-y-4 text-sm leading-relaxed text-justify">
            <p>
              Welcome to Papaia, an AI-powered system for papaya disease
              identification and farm management. By creating an account and
              using this system, you agree to comply with these Terms and
              Conditions of Use. Please read this document carefully before
              proceeding.
            </p>

            <hr className="border-gray-300 my-3" />

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                1. Acceptance of Terms
              </h3>
            </div>

            <p>
              By registering or accessing Papaia via mobile or web platforms,
              you acknowledge that you have read, understood, and agreed to
              these Terms and Conditions, the Privacy Policy, and any future
              updates. Continued use of Papaia constitutes acceptance of all
              revisions. Users who do not agree must discontinue the use of the
              platform immediately.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                2. Purpose of the System
              </h3>
            </div>

            <p>
              Papaia is designed to assist farmers and farm managers in
              detecting papaya leaf and fruit diseases using{" "}
              <strong>
                AI-based image recognition, scan history logs, and farm
                monitoring tools.
              </strong>{" "}
              The platform aims to improve disease prevention, productivity, and
              agricultural decision-making. Papaia is intended for{" "}
              <strong>
                informational and educational purposes only and does not replace
                certified agricultural consultation or laboratory diagnostics.
              </strong>
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                3. Account Registration and Responsibilities
              </h3>
            </div>

            <p>
              Users must provide <b>accurate and truthful information</b> during
              registration. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              under your account.
            </p>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Impersonate another person or entity;</li>
              <li>Share your credentials; or</li>
              <li>
                Use the system for illegal, fraudulent, or harmful purposes.
              </li>
            </ul>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                4. Payment and Subscription Policy
              </h3>
            </div>

            <p>Some features of Papaia may be subject to subscription plans.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Subscription fees are clearly stated on the Subscription Page
                and processed securely via verified payment gateways.
              </li>
              <li>
                Renewals are automatic unless cancelled prior to the next
                billing cycle.
              </li>
              <li>
                Refunds, if applicable, are handled under the refund policy
                stated on the same page.
              </li>
              <li>
                Farm owners with active subscriptions automatically extend paid
                access to their connected farmer accounts.
              </li>
            </ul>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                5. AI and Data Accuracy Disclaimer
              </h3>
            </div>

            <p>
              Papaia's disease identification results are generated using
              <b>machine learning models (CNNs)</b> trained on validated papaya
              datasets. While the model strives for high accuracy,{" "}
              <b>results should be treated as decision support</b>, not as an
              absolute diagnosis. The developers, researchers, and partner
              institutions <b>shall not be held liable</b> for losses, crop
              damage, or mismanagement resulting from reliance solely on AI
              outputs.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                6. Bugs, Fixes, and Updates
              </h3>
            </div>

            <p>
              Papaia undergoes regular updates to improve security, performance,
              and functionality. During maintenance, temporary downtime or
              limited access may occur. Users are encouraged to report bugs or
              feedback through the Help & Support section. Reported issues will
              be prioritized based on severity and impact.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                7. Maintenance and System Availability
              </h3>
            </div>

            <p>
              While the development team strives for maximum uptime, Papaia may
              experience temporary interruptions due to maintenance, internet
              issues, or third-party service disruptions (e.g., Firebase,
              Render, or Vercel). The team reserves the right to perform
              scheduled maintenance without prior notice.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                8. Limitation of Liability
              </h3>
            </div>

            <p>
              Under no circumstance shall Papaia, its developers, affiliated
              institutions, or partners be liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Direct or indirect losses resulting from the use or inability to
                use the system;
              </li>
              <li>Damage to crops, farm property, or equipment;</li>
              <li>
                Service interruptions or inaccurate data due to technical or
                environmental factors.
              </li>
            </ul>
            <p>
              Use of Papaia implies acknowledgment and acceptance of these
              limitations.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                9. No Warranty Clause
              </h3>
            </div>

            <p>
              Papaia is provided on an <b>"as is" and "as available"</b> basis.
              No warranties, whether express or implied, are made regarding:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accuracy or reliability of results,</li>
              <li>System performance, or</li>
              <li>Availability of service.</li>
            </ul>
            <p>
              The developers disclaim all liability arising from system errors,
              omissions, or temporary downtime.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                10. Indemnification Clause
              </h3>
            </div>

            <p>
              By using Papaia, you agree to <b>indemnify and hold harmless</b>{" "}
              the developers, affiliated institutions, and partners from any
              claims, losses, or damages (including legal fees) resulting from:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your misuse of the system,</li>
              <li>Violation of these Terms & Conditions, or</li>
              <li>Breach of any applicable law or regulation.</li>
            </ul>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                11. Intellectual Property Rights
              </h3>
            </div>

            <p>
              All trademarks, models, designs, software code, and content in
              Papaia are intellectual property of the development team.
              Unauthorized copying, reverse engineering, or redistribution of
              any component of Papaia is strictly prohibited.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                12. Governing Law and Jurisdiction
              </h3>
            </div>

            <p>
              These Terms and Conditions shall be governed by and construed in
              accordance with the{" "}
              <b>laws of the Republic of the Philippines.</b>
              Any dispute arising from the use of Papaia shall fall under the
              <b>
                exclusive jurisdiction of the courts of Cebu City, Philippines.
              </b>
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                13. Contact and Support
              </h3>
            </div>

            <p>
              For technical assistance, bug reporting, or account issues, you
              may reach the team through: Email through{" "}
              <b>support.papaia@gmail.com</b>
              or via the in-app Help & Feedback feature.
            </p>

            <div className="pt-2">
              <h3 className="font-semibold text-base text-gray-900">
                14. Consent
              </h3>
            </div>

            <p>
              By <b>checking the checkbox</b>, you confirm that you:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Have read and understood these Terms and Conditions;</li>
              <li>
                Consent to the collection, processing, and storage of your data;
                and
              </li>
              <li>
                Agree to comply with all policies governing the use of Papaia.
              </li>
            </ul>
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
