import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Leaf, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = "https://papaiaapi.onrender.com/api/owner";
const DEBOUNCE_DELAY = 500;
const POLL_INTERVAL = 5000; // 5 seconds

const dataCache = new Map();
let lastScanCount = 0;
let lastFetchTime = 0;

export default function RecentScans({ farmId, timeFilter, dateRange }) {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const abortControllerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const initialLoadRef = useRef(true);

  const SCANS_PER_PAGE = 3;

  const getEndpoint = useCallback((filter, range) => {
    const endpointMap = {
      Daily: {
        "Last 7 days": "seven-days-common-diseases",
        "Last 11 days": "eleven-days-common-diseases",
        "Last 14 days": "fourteen-days-common-diseases",
      },
      Weekly: {
        "Last 4 weeks": "three-weeks-common-diseases",
        "Last 9 weeks": "nine-weeks-common-diseases",
        "Last 12 weeks": "twelve-weeks-common-diseases",
      },
      Monthly: {
        "Last 3 months": "three-month-common-diseases",
        "Last 6 months": "six-month-common-diseases",
        "Last 12 months": "twelve-month-common-diseases",
      },
      Yearly: {
        "Last 3 years": "three-year-common-diseases",
        "Last 5 years": "five-year-common-diseases",
        "Last 7 years": "seven-year-common-diseases",
      },
    };
    return endpointMap[filter]?.[range];
  }, []);

  const getPeriodsFromRange = useCallback((range, filter) => {
    const periods = {
      Daily: { "Last 7 days": 7, "Last 11 days": 11, "Last 14 days": 14 },
      Weekly: { "Last 4 weeks": 4, "Last 9 weeks": 9, "Last 12 weeks": 12 },
      Monthly: { "Last 3 months": 3, "Last 6 months": 6, "Last 12 months": 12 },
      Yearly: { "Last 3 years": 3, "Last 5 years": 5, "Last 7 years": 7 },
    };
    return periods[filter]?.[range] || 11;
  }, []);

  const filterScansByDateRange = useCallback(
    (allScans, filter, range) => {
      const periods = getPeriodsFromRange(range, filter);
      const now = new Date();
      let startDate = new Date(now);

      switch (filter) {
        case "Daily":
          startDate.setDate(startDate.getDate() - periods + 1);
          break;
        case "Weekly":
          startDate.setDate(startDate.getDate() - periods * 7);
          break;
        case "Monthly":
          startDate.setMonth(startDate.getMonth() - periods);
          break;
        case "Yearly":
          startDate.setFullYear(startDate.getFullYear() - periods);
          break;
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
    },
    [getPeriodsFromRange]
  );

  const fetchData = useCallback(
    async (silent = false) => {
      if (!farmId) return;

      const cacheKey = `recent_scans_${farmId}_${timeFilter}_${dateRange}`;
      const cached = dataCache.get(cacheKey);

      // Check cache freshness (20 seconds)
      if (cached && Date.now() - cached.timestamp < 20000) {
        setRecentScans(cached.scans);
        if (initialLoadRef.current) {
          setLoading(false);
          initialLoadRef.current = false;
        }
        return;
      }

      // Debounce rapid calls
      const now = Date.now();
      if (now - lastFetchTime < DEBOUNCE_DELAY) {
        return;
      }
      lastFetchTime = now;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // Only show loading on initial load
        if (!silent && initialLoadRef.current) {
          setLoading(true);
        }

        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(
          `${API_BASE}/identification-history/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch scans");

        const allScans = await response.json();
        const scansArray = Array.isArray(allScans) ? allScans : [];

        const endpoint = getEndpoint(timeFilter, dateRange);
        let filteredScans;

        if (!endpoint) {
          filteredScans = scansArray;
        } else {
          filteredScans = filterScansByDateRange(
            scansArray,
            timeFilter,
            dateRange
          );
        }

        // Only update state if data has changed
        setRecentScans((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(filteredScans)) {
            return filteredScans;
          }
          return prev;
        });

        // Update cache
        dataCache.set(cacheKey, {
          scans: filteredScans,
          timestamp: Date.now(),
        });

        lastScanCount = filteredScans.length;
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Recent scans fetch error:", error);
        }
      } finally {
        if (!silent && initialLoadRef.current) {
          setLoading(false);
          initialLoadRef.current = false;
        }
      }
    },
    [farmId, timeFilter, dateRange, getEndpoint, filterScansByDateRange]
  );

  const checkForNewScans = useCallback(async () => {
    if (document.hidden || !farmId) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${API_BASE}/identification-history/${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const allScans = await response.json();
        const scansArray = Array.isArray(allScans) ? allScans : [];

        const endpoint = getEndpoint(timeFilter, dateRange);
        let filteredScans;

        if (!endpoint) {
          filteredScans = scansArray;
        } else {
          filteredScans = filterScansByDateRange(
            scansArray,
            timeFilter,
            dateRange
          );
        }

        if (filteredScans.length !== lastScanCount) {
          const cacheKey = `recent_scans_${farmId}_${timeFilter}_${dateRange}`;
          dataCache.delete(cacheKey);
          fetchData(true); // Silent update
        }
      }
    } catch {}
  }, [
    farmId,
    timeFilter,
    dateRange,
    getEndpoint,
    filterScansByDateRange,
    fetchData,
  ]);

  // Initial fetch
  useEffect(() => {
    fetchData();

    pollIntervalRef.current = setInterval(
      () => checkForNewScans(),
      POLL_INTERVAL
    );

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchData, checkForNewScans]);

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
      if (!timestamp) return { date: "", time: "" };

      const parts = timestamp.trim().split(/\s+/);
      if (parts.length !== 3) return { date: timestamp, time: "" };

      const [datePart, timePart, period] = parts;
      const [month, day, year] = datePart.split("/");

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthIndex = parseInt(month) - 1;
      const monthName = monthNames[monthIndex] || month;

      return {
        date: `${monthName} ${parseInt(day)}, ${year}`,
        time: `${timePart} ${period}`,
      };
    } catch {
      return { date: timestamp, time: "" };
    }
  }, []);

  const getFarmerName = useCallback((scan) => {
    return scan.farmerName || `Farmer ${scan.idNumber}`;
  }, []);

  const handleScanClick = useCallback((scan) => {
    setSelectedScan(scan);
    setShowDetailModal(true);
  }, []);

  const totalPages = Math.ceil(recentScans.length / SCANS_PER_PAGE);
  const currentScans = useMemo(() => {
    const startIndex = (currentPage - 1) * SCANS_PER_PAGE;
    return recentScans.slice(startIndex, startIndex + SCANS_PER_PAGE);
  }, [recentScans, currentPage]);

  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [recentScans.length]);

  const FIXED_HEIGHT = "420px";

  if (loading) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Scans ({dateRange})
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
        Scans ({dateRange})
      </h2>

      <div className="flex-1 flex flex-col justify-between">
        {recentScans.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
            <p className="text-sm sm:text-base text-gray-500">No scans yet</p>
            <p className="text-xs text-gray-400 mt-1">Scans will appear here</p>
          </div>
        ) : (
          <>
            <div className="space-y-2.5 mb-3">
              {currentScans.map((scan, index) => {
                const cardStyle = getCardStyle(scan.prediction);
                const { date, time } = formatDateTime(scan.timestamp);
                return (
                  <div
                    key={`${scan.id || scan.timestamp}-${index}`}
                    onClick={() => handleScanClick(scan)}
                    className={`${cardStyle.bg} ${cardStyle.border} rounded-lg p-3 transition-all hover:shadow-md cursor-pointer hover:scale-[1.01]`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={scan.imageUrl}
                        alt="Scan"
                        className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23e5e7eb' width='56' height='56'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />

                      <div className="flex-1 min-w-0 flex justify-between items-start">
                        <div className="flex-1">
                          <p
                            className={`font-bold text-sm mb-1 ${cardStyle.textColor}`}
                          >
                            {scan.prediction}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            By: {getFarmerName(scan)}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-xs text-slate-700 font-medium">
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
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
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
          </>
        )}
      </div>

      {showDetailModal && selectedScan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Scan Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <img
                src={selectedScan.imageUrl}
                alt="Scan"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm text-gray-600">Prediction</p>
                <p className="font-semibold">{selectedScan.prediction}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Farmer</p>
                <p className="font-semibold">{getFarmerName(selectedScan)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timestamp</p>
                <p className="font-semibold">{selectedScan.timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
