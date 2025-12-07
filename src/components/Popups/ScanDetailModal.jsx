import { X, Calendar, User, AlertCircle } from "lucide-react";
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

  const formatDateTime = (timestamp) => {
    try {
      if (!timestamp) return { date: "", time: "" };

      // Handle both Date objects and string timestamps
      const date = new Date(timestamp);

      // Check if valid date
      if (isNaN(date.getTime())) {
        // Fallback: try parsing custom format "MM/DD/YYYY HH:MM AM/PM"
        const parts = timestamp.trim().split(/\s+/);
        if (parts.length === 3) {
          const [datePart, timePart, period] = parts;
          const [month, day, year] = datePart.split("/");
          const [hours, minutes] = timePart.split(":");
          let hour24 = parseInt(hours);
          if (period === "PM" && hour24 !== 12) hour24 += 12;
          if (period === "AM" && hour24 === 12) hour24 = 0;

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

          return {
            date: `${monthNames[parseInt(month) - 1]} ${parseInt(
              day
            )}, ${year}`,
            time: `${timePart} ${period}`,
          };
        }
        return { date: timestamp, time: "" };
      }

      const dateStr = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return { date: dateStr, time: timeStr };
    } catch {
      return { date: timestamp, time: "" };
    }
  };

  const { date, time } = formatDateTime(scan.timestamp);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-orange-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={PapayaLogo}
                alt="Papaia Logo"
                className="w-5 h-7"
                loading="eager"
                decoding="async"
              />
            </div>
            <h2 className="text-xl font-bold text-white">Scan Details</h2>
          </div>
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
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='256'%3E%3Crect fill='%23e5e7eb' width='800' height='256'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Prediction Badge and Confidence */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Disease Detected */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Disease Detected
                </label>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-base ${cardStyle.badge}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {scan.prediction}
                </span>
              </div>

              {/* Confidence Level */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Confidence Level
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-[200px]">
                    <div
                      className={`h-3 rounded-full ${
                        scan.prediction === "Healthy"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                      style={{
                        width: `${(scan.confidence * 100).toFixed(0)}%`,
                      }}
                    />
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    {(scan.confidence * 100).toFixed(0)}%
                  </span>
                </div>
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
                {date}{" "}
                {time && <span className="text-gray-600">at {time}</span>}
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
