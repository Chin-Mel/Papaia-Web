import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function TermsModal({ isOpen, onClose }) {
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

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <div
        ref={modalRef}
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-6 py-4 text-center relative">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Terms & Conditions
          </h3>
          <p className="text-xs sm:text-sm text-white/90 mt-1">
            Last Updated: October 29, 2025
          </p>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to Papaia, an AI-powered system for papaya disease
              identification and farm management. By creating an account and
              using this system, you agree to comply with these Terms and
              Conditions of Use. Please read this document carefully before
              proceeding.
            </p>

            <hr className="border-gray-300 my-3" />

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                1. Acceptance of Terms
              </h3>
              <p>
                By registering or accessing Papaia via mobile or web platforms,
                you acknowledge that you have read, understood, and agreed to
                these Terms and Conditions, the Privacy Policy, and any future
                updates. Continued use of Papaia constitutes acceptance of all
                revisions. Users who do not agree must discontinue the use of
                the platform immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                2. Purpose of the System
              </h3>
              <p>
                Papaia is designed to assist farmers and farm managers in
                detecting papaya leaf and fruit diseases using{" "}
                <strong>
                  AI-based image recognition, scan history logs, and farm
                  monitoring tools.
                </strong>{" "}
                The platform aims to improve disease prevention, productivity,
                and agricultural decision-making. Papaia is intended for{" "}
                <strong>
                  informational and educational purposes only and does not
                  replace certified agricultural consultation or laboratory
                  diagnostics.
                </strong>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                3. Account Registration and Responsibilities
              </h3>
              <p>
                Users must provide{" "}
                <strong>accurate and truthful information</strong> during
                registration. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities under your account.
              </p>
              <p className="mt-2">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Impersonate another person or entity;</li>
                <li>Share your credentials; or</li>
                <li>
                  Use the system for illegal, fraudulent, or harmful purposes.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                4. Payment and Subscription Policy
              </h3>
              <p>
                Some features of Papaia may be subject to subscription plans.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
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
                  Farm owners with active subscriptions automatically extend
                  paid access to their connected farmer accounts.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                5. AI and Data Accuracy Disclaimer
              </h3>
              <p>
                Papaia's disease identification results are generated using
                <strong> machine learning models (CNNs)</strong> trained on
                validated papaya datasets. While the model strives for high
                accuracy,{" "}
                <strong>results should be treated as decision support</strong>,
                not as an absolute diagnosis. The developers, researchers, and
                partner institutions <strong>shall not be held liable</strong>{" "}
                for losses, crop damage, or mismanagement resulting from
                reliance solely on AI outputs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                6. Bugs, Fixes, and Updates
              </h3>
              <p>
                Papaia undergoes regular updates to improve security,
                performance, and functionality. During maintenance, temporary
                downtime or limited access may occur. Users are encouraged to
                report bugs or feedback through the Help & Support section.
                Reported issues will be prioritized based on severity and
                impact.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                7. Maintenance and System Availability
              </h3>
              <p>
                While the development team strives for maximum uptime, Papaia
                may experience temporary interruptions due to maintenance,
                internet issues, or third-party service disruptions (e.g.,
                Firebase, Render, or Vercel). The team reserves the right to
                perform scheduled maintenance without prior notice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                8. Limitation of Liability
              </h3>
              <p>
                Under no circumstance shall Papaia, its developers, affiliated
                institutions, or partners be liable for:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Direct or indirect losses resulting from the use or inability
                  to use the system;
                </li>
                <li>Damage to crops, farm property, or equipment;</li>
                <li>
                  Service interruptions or inaccurate data due to technical or
                  environmental factors.
                </li>
              </ul>
              <p className="mt-2">
                Use of Papaia implies acknowledgment and acceptance of these
                limitations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                9. No Warranty Clause
              </h3>
              <p>
                Papaia is provided on an{" "}
                <strong>"as is" and "as available"</strong> basis. No
                warranties, whether express or implied, are made regarding:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Accuracy or reliability of results,</li>
                <li>System performance, or</li>
                <li>Availability of service.</li>
              </ul>
              <p className="mt-2">
                The developers disclaim all liability arising from system
                errors, omissions, or temporary downtime.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                10. Indemnification Clause
              </h3>
              <p>
                By using Papaia, you agree to{" "}
                <strong>indemnify and hold harmless</strong> the developers,
                affiliated institutions, and partners from any claims, losses,
                or damages (including legal fees) resulting from:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Your misuse of the system,</li>
                <li>Violation of these Terms & Conditions, or</li>
                <li>Breach of any applicable law or regulation.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                11. Intellectual Property Rights
              </h3>
              <p>
                All trademarks, models, designs, software code, and content in
                Papaia are intellectual property of the development team.
                Unauthorized copying, reverse engineering, or redistribution of
                any component of Papaia is strictly prohibited.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                12. Governing Law and Jurisdiction
              </h3>
              <p>
                These Terms and Conditions shall be governed by and construed in
                accordance with the{" "}
                <strong>laws of the Republic of the Philippines.</strong>
                Any dispute arising from the use of Papaia shall fall under the
                <strong>
                  {" "}
                  exclusive jurisdiction of the courts of Cebu City,
                  Philippines.
                </strong>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                13. Contact and Support
              </h3>
              <p>
                For technical assistance, bug reporting, or account issues, you
                may reach the team through: Email at{" "}
                <strong>support.papaia@gmail.com</strong> or via the in-app Help
                & Feedback feature.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                14. Consent
              </h3>
              <p>
                By <strong>checking the checkbox</strong>, you confirm that you:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Have read and understood these Terms and Conditions;</li>
                <li>
                  Consent to the collection, processing, and storage of your
                  data; and
                </li>
                <li>
                  Agree to comply with all policies governing the use of Papaia.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
