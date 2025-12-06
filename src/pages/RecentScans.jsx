import { useState, useEffect, useCallback, useRef } from "react";
import { Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import ScanDetailModal from "../components/Popups/ScanDetailModal.jsx";

export default function RecentScans({ farmId, timeFilter, dateRange }) {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const abortControllerRef = useRef(null);
  const initialLoadRef = useRef(true);
  const SCANS_PER_PAGE = 4;

  const getPeriodsFromRange = (range, filter) => {
    switch (filter) {
      case "Daily":
        if (range === "Last 7 days") return 7;
        if (range === "Last 11 days") return 11;
        if (range === "Last 14 days") return 14;
        return 11;
      case "Weekly":
        if (range === "Last 4 weeks") return 4;
        if (range === "Last 9 weeks") return 9;
        if (range === "Last 12 weeks") return 12;
        return 9;
      case "Monthly":
        if (range === "Last 3 months") return 3;
        if (range === "Last 6 months") return 6;
        if (range === "Last 12 months") return 12;
        return 12;
      case "Yearly":
        if (range === "Last 3 years") return 3;
        if (range === "Last 5 years") return 5;
        if (range === "Last 7 years") return 7;
        return 7;
      default:
        return 11;
    }
  };

  const filterScansByDateRange = useCallback((allScans, filter, range) => {
    const periods = getPeriodsFromRange(range, filter);
    const now = new Date();
    let startDate;

    switch (filter) {
      case "Daily":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - periods + 1);
        break;
      case "Weekly":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - periods * 7);
        break;
      case "Monthly":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - periods);
        break;
      case "Yearly":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - periods);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 11);
    }

    startDate.setHours(0, 0, 0, 0);

    return allScans.filter((scan) => {
      try {
        const [datePart, timePart, period] = scan.timestamp.split(/\s+/);
        const [month, day, year] = datePart.split("/");
        const [hours, minutes] = timePart.split(":");
        let hour24 = parseInt(hours);
        if (period === "PM" && hour24 !== 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;
        const scanDate = new Date(year, month - 1, day, hour24, minutes);
        return scanDate >= startDate && scanDate <= now;
      } catch {
        return false;
      }
    });
  }, []);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    setFilterActive(true);
    setCurrentPage(1);
  }, [dateRange]);

  useEffect(() => {
    if (!farmId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch scans");

        const scansData = await response.json();
        const allScans = Array.isArray(scansData) ? scansData : [];

        const filteredScans = filterActive
          ? filterScansByDateRange(allScans, timeFilter, dateRange)
          : allScans;

        setRecentScans(filteredScans);
      } catch (error) {
        if (error.name !== "AbortError") {
          setRecentScans([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [farmId, timeFilter, dateRange, filterScansByDateRange, filterActive]);

  const getCardStyle = useCallback((prediction) => {
    const styles = {
      Healthy: {
        bg: "bg-emerald-50/50",
        border: "border-l-2 border-emerald-700",
        textColor: "text-emerald-700",
      },
      "Ring Spot Virus": {
        bg: "bg-orange-50/50",
        border: "border-l-2 border-orange-600",
        textColor: "text-orange-600",
      },
      Anthracnose: {
        bg: "bg-rose-50/50",
        border: "border-l-2 border-rose-600",
        textColor: "text-rose-600",
      },
      "Powdery Mildew": {
        bg: "bg-blue-50/50",
        border: "border-l-2 border-blue-600",
        textColor: "text-blue-600",
      },
    };

    return (
      styles[prediction] || {
        bg: "bg-slate-50/50",
        border: "border-l-2 border-slate-600",
        textColor: "text-slate-600",
      }
    );
  }, []);

  const formatDateTime = useCallback((timestamp) => {
    try {
      if (!timestamp) return "";

      const parts = timestamp.trim().split(/\s+/);
      if (parts.length !== 3) return timestamp;

      const datePart = parts[0];
      const timePart = parts[1];
      const period = parts[2];

      const [month, day, year] = datePart.split("/");
      if (!month || !day || !year) return timestamp;

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
        time: `${timePart} ${period}`,
      };
    } catch (error) {
      return { date: timestamp, time: "" };
    }
  }, []);

  const getFarmerName = useCallback((scan) => {
    if (scan.farmerName) {
      return scan.farmerName;
    }
    return `Farmer ${scan.idNumber}`;
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.style.display = "none";
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = "flex";
    }
  }, []);

  const handleScanClick = useCallback((scan) => {
    setSelectedScan(scan);
    setShowDetailModal(true);
  }, []);

  const totalPages = Math.ceil(recentScans.length / SCANS_PER_PAGE);
  const startIndex = (currentPage - 1) * SCANS_PER_PAGE;
  const endIndex = startIndex + SCANS_PER_PAGE;
  const currentScans = recentScans.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const FIXED_HEIGHT = "580px";

  if (loading && !recentScans.length) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Recent Scans{filterActive ? ` (${dateRange})` : ""}
        </h2>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
        Recent Scans{filterActive ? ` (${dateRange})` : ""}
      </h2>

      {recentScans.length === 0 ? (
        <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
          <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
          <p className="text-sm sm:text-base text-gray-500">
            No scans in selected range
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {filterActive
              ? `Scans from ${dateRange.toLowerCase()} will appear here`
              : "Scans from assigned farmers will appear here"}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto pr-2 space-y-3"
            style={{ scrollbarWidth: "thin" }}
          >
            {currentScans.map((scan, index) => {
              const cardStyle = getCardStyle(scan.prediction);
              const { date, time } = formatDateTime(scan.timestamp);
              return (
                <div
                  key={`${scan.id || scan.timestamp}-${index}`}
                  onClick={() => handleScanClick(scan)}
                  className={`${cardStyle.bg} ${cardStyle.border} rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={scan.imageUrl}
                        alt="Scan"
                        className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                        onError={handleImageError}
                      />
                      <div
                        className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-200 items-center justify-center text-gray-400 text-xs hidden"
                        style={{ display: "none" }}
                      >
                        No Image
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex justify-between items-start">
                      <div className="flex-1">
                        <p
                          className={`font-bold text-sm mb-0.5 ${cardStyle.textColor}`}
                        >
                          {scan.prediction}
                        </p>
                        <p className="text-xs text-slate-500">
                          By: {getFarmerName(scan)}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-700 font-medium break-words">
                          {date}
                        </p>
                        <p className="text-xs text-slate-500">{time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 flex-shrink-0">
              <div className="text-xs text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-2 text-center flex-shrink-0">
            <p className="text-xs text-gray-500">
              {recentScans.length > 0
                ? filterActive
                  ? `Showing ${recentScans.length} ${
                      recentScans.length === 1 ? "scan" : "scans"
                    } from ${dateRange.toLowerCase()}`
                  : `Showing all ${recentScans.length} ${
                      recentScans.length === 1 ? "scan" : "scans"
                    }`
                : "No scans in selected range"}
            </p>
          </div>
        </div>
      )}
      <ScanDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        scan={selectedScan}
        farmerName={selectedScan ? getFarmerName(selectedScan) : ""}
      />
    </div>
  );
}
