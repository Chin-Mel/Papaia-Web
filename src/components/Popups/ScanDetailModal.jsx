import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function ScanDetailModal({ isOpen, onClose, scan, farmerName }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !scan) return null;

  const getStatusInfo = (prediction) => {
    if (!prediction) {
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        badgeBg: "bg-green-50",
        badgeText: "text-green-700",
      };
    }

    const predLower = prediction.toLowerCase();
    if (predLower === "healthy") {
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        badgeBg: "bg-green-50",
        badgeText: "text-green-700",
      };
    }

    return {
      status: "disease-detected",
      label: "Disease Detected",
      color: "text-red-600",
      badgeBg: "bg-red-50",
      badgeText: "text-red-700",
    };
  };

  const formatDateTime = (timestamp) => {
    try {
      if (!timestamp) return { date: "Unknown Date", time: "Unknown Time" };

      const [datePart, timePart, period] = timestamp.split(/\s+/);
      if (datePart && timePart && period) {
        const [month, day, year] = datePart.split("/");
        const [hours, minutes] = timePart.split(":");

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const monthIndex = parseInt(month) - 1;
        const monthName = monthNames[monthIndex] || month;

        return {
          date: `${monthName} ${parseInt(day)}, ${year}`,
          time: `${hours}:${minutes} ${period}`,
        };
      }

      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return { date: "Unknown Date", time: "Unknown Time" };
      }

      return {
        date: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch {
      return { date: "Unknown Date", time: "Unknown Time" };
    }
  };

  const parseSuggestions = (suggestions) => {
    if (!suggestions) return [];
    return suggestions
      .split("\n")
      .map((line) => line.replace(/^\*\s*/, "").trim())
      .filter((line) => line.length > 0);
  };

  const statusInfo = getStatusInfo(scan.prediction);
  const dateTime = formatDateTime(scan.timestamp);
  const apiSuggestions = parseSuggestions(scan.suggestions);
  const confidencePercentage = Math.min(
    100,
    Math.max(0, Math.round(scan.confidence * 100 || 0))
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-5 relative rounded-t-2xl">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/30">
              <img
                src={PapayaLogo}
                alt="Papaia Logo"
                className="w-6 h-8"
                loading="eager"
              />
            </div>
          </div>
          <h2 className="text-lg font-bold text-white text-center mb-1">
            Scan Results
          </h2>
          <p className="text-sm text-white/90 text-center">
            Detailed analysis of crop health
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Image */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Scanned Image
                  </h3>
                </div>
                <div className="p-4">
                  <img
                    src={
                      scan.imageUrl ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt="Scan"
                    className="w-full h-64 object-cover rounded-lg mb-4 border border-gray-200"
                    loading="eager"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scan Date:</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {dateTime.date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scan Time:</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {dateTime.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Scan Status */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Scan Status
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-50">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-red-600">
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-2">
                        Disease Identified
                      </div>
                      <div
                        className={`text-xl font-semibold ${statusInfo.color}`}
                      >
                        {scan.prediction}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-sm text-blue-600 font-semibold mb-2">
                        AI Verified
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {confidencePercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Information */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Farmer Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {farmerName?.charAt(0)?.toUpperCase() || "F"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {farmerName || "Unknown Farmer"}
                      </div>
                      <div className="text-sm text-gray-600">Farmer</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Treatment */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Suggested Treatment
                  </h3>
                </div>
                <div className="p-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <ul className="space-y-2 list-disc list-inside">
                      {(apiSuggestions.length > 0
                        ? apiSuggestions
                        : ["No treatment suggestions available."]
                      ).map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 leading-relaxed"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
