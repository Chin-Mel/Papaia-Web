import { X, Calendar, User, MapPin, AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ScanDetailModal({ isOpen, onClose, scan, farmerName }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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

  const getCardStyle = (prediction) => {
    const styles = {
      Healthy: {
        bg: "from-emerald-500 to-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
      },
      "Ring Spot Virus": {
        bg: "from-orange-500 to-orange-600",
        badge: "bg-orange-100 text-orange-700",
      },
      Anthracnose: {
        bg: "from-rose-500 to-rose-600",
        badge: "bg-rose-100 text-rose-700",
      },
      "Powdery Mildew": {
        bg: "from-blue-500 to-blue-600",
        badge: "bg-blue-100 text-blue-700",
      },
    };

    return (
      styles[prediction] || {
        bg: "from-slate-500 to-slate-600",
        badge: "bg-slate-100 text-slate-700",
      }
    );
  };

  const cardStyle = getCardStyle(scan.prediction);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-orange-500 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scan Details</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Image */}
          <div className="mb-6">
            <img
              src={scan.imageUrl}
              alt="Scan"
              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
              onError={(e) => {
                e.target.src = "";
                e.target.alt = "Image not available";
                e.target.className =
                  "w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400";
              }}
            />
          </div>

          {/* Prediction Badge and Confidence */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Disease Detected
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${cardStyle.badge}`}
              >
                <AlertCircle className="w-5 h-5" />
                {scan.prediction}
              </span>
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      scan.prediction === "Healthy"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        : "bg-gradient-to-r from-red-500 to-red-600"
                    }`}
                    style={{ width: `${(scan.confidence * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-gray-700">
                  {(scan.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Farmer Name */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-500" />
                <label className="text-xs font-semibold text-gray-600">
                  Scanned By
                </label>
              </div>
              <p className="text-sm font-medium text-gray-800">{farmerName}</p>
            </div>

            {/* Timestamp */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-xs font-semibold text-gray-600">
                  Date & Time
                </label>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {new Date(scan.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Suggestions */}
          {scan.suggestions && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Recommendations
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="prose prose-sm max-w-none">
                  {scan.suggestions.split("\n").map((line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    // Check if line starts with bullet point
                    if (trimmedLine.startsWith("*")) {
                      return (
                        <p
                          key={index}
                          className="text-sm text-gray-700 mb-2 pl-4"
                        >
                          • {trimmedLine.substring(1).trim()}
                        </p>
                      );
                    }

                    return (
                      <p key={index} className="text-sm text-gray-700 mb-2">
                        {trimmedLine}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
