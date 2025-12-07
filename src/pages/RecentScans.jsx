import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import ScanDetailModal from "../components/Popups/ScanDetailModal";

const API_BASE = "https://papaiaapi.onrender.com/api/owner";

// Generate hash for data comparison
const generateHash = (data) => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

export default function RecentScans({ farmId, timeFilter, dateRange }) {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const abortControllerRef = useRef(null);
  const lastScansHashRef = useRef(null);
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

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (!silent && initialLoadRef.current) {
          setLoading(true);
        }

        const response = await fetch(
          `${API_BASE}/identification-history/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch scans");

        const allScans = await response.json();

        // Generate hash to check if data changed
        const newHash = generateHash(allScans);

        // Only update if hash changed
        if (silent && lastScansHashRef.current === newHash) {
          return; // No changes, skip update
        }

        lastScansHashRef.current = newHash;

        const endpoint = getEndpoint(timeFilter, dateRange);

        if (!endpoint) {
          setRecentScans(Array.isArray(allScans) ? allScans : []);
        } else {
          const filtered = filterScansByDateRange(
            Array.isArray(allScans) ? allScans : [],
            timeFilter,
            dateRange
          );
          setRecentScans(filtered);
        }
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

  // Initial load
  useEffect(() => {
    fetchData(false);
  }, [farmId, timeFilter, dateRange]);

  // Silent polling for updates
  useEffect(() => {
    const checkForUpdates = async () => {
      if (!document.hidden && farmId) {
        await fetchData(true);
      }
    };

    pollIntervalRef.current = setInterval(checkForUpdates, 15000); // Poll every 15 seconds

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [farmId, fetchData]);

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

      <div className="flex-1 flex flex-col">
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
        <ScanDetailModal
          isOpen={showDetailModal}
          scan={selectedScan}
          farmerName={getFarmerName(selectedScan)}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
}

// import { useState, useEffect, useCallback, useRef, useMemo } from "react";
// import { Leaf, ChevronLeft, ChevronRight } from "lucide-react";

// const API_BASE = "https://papaiaapi.onrender.com/api/owner";

// export default function RecentScans({ farmId, timeFilter, dateRange }) {
//   const [recentScans, setRecentScans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [selectedScan, setSelectedScan] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const abortControllerRef = useRef(null);
//   const cacheRef = useRef({});
//   const SCANS_PER_PAGE = 3;

//   const getEndpoint = useCallback((filter, range) => {
//     const endpointMap = {
//       Daily: {
//         "Last 7 days": "seven-days-common-diseases",
//         "Last 11 days": "eleven-days-common-diseases",
//         "Last 14 days": "fourteen-days-common-diseases",
//       },
//       Weekly: {
//         "Last 4 weeks": "three-weeks-common-diseases",
//         "Last 9 weeks": "nine-weeks-common-diseases",
//         "Last 12 weeks": "twelve-weeks-common-diseases",
//       },
//       Monthly: {
//         "Last 3 months": "three-month-common-diseases",
//         "Last 6 months": "six-month-common-diseases",
//         "Last 12 months": "twelve-month-common-diseases",
//       },
//       Yearly: {
//         "Last 3 years": "three-year-common-diseases",
//         "Last 5 years": "five-year-common-diseases",
//         "Last 7 years": "seven-year-common-diseases",
//       },
//     };
//     return endpointMap[filter]?.[range];
//   }, []);

//   const getPeriodsFromRange = useCallback((range, filter) => {
//     const periods = {
//       Daily: { "Last 7 days": 7, "Last 11 days": 11, "Last 14 days": 14 },
//       Weekly: { "Last 4 weeks": 4, "Last 9 weeks": 9, "Last 12 weeks": 12 },
//       Monthly: { "Last 3 months": 3, "Last 6 months": 6, "Last 12 months": 12 },
//       Yearly: { "Last 3 years": 3, "Last 5 years": 5, "Last 7 years": 7 },
//     };
//     return periods[filter]?.[range] || 11;
//   }, []);

//   const filterScansByDateRange = useCallback(
//     (allScans, filter, range) => {
//       const periods = getPeriodsFromRange(range, filter);
//       const now = new Date();
//       let startDate = new Date(now);

//       switch (filter) {
//         case "Daily":
//           startDate.setDate(startDate.getDate() - periods + 1);
//           break;
//         case "Weekly":
//           startDate.setDate(startDate.getDate() - periods * 7);
//           break;
//         case "Monthly":
//           startDate.setMonth(startDate.getMonth() - periods);
//           break;
//         case "Yearly":
//           startDate.setFullYear(startDate.getFullYear() - periods);
//           break;
//       }

//       startDate.setHours(0, 0, 0, 0);

//       return allScans.filter((scan) => {
//         try {
//           const [datePart, timePart, period] = scan.timestamp.split(/\s+/);
//           const [month, day, year] = datePart.split("/");
//           const [hours, minutes] = timePart.split(":");
//           let hour24 = parseInt(hours);
//           if (period === "PM" && hour24 !== 12) hour24 += 12;
//           if (period === "AM" && hour24 === 12) hour24 = 0;
//           const scanDate = new Date(year, month - 1, day, hour24, minutes);
//           return scanDate >= startDate && scanDate <= now;
//         } catch {
//           return false;
//         }
//       });
//     },
//     [getPeriodsFromRange]
//   );

//   const fetchData = useCallback(async () => {
//     if (!farmId) return;

//     const endpoint = getEndpoint(timeFilter, dateRange);

//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     try {
//       if (isInitialLoad) {
//         setLoading(true);
//       }

//       const response = await fetch(
//         `${API_BASE}/identification-history/${farmId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           signal: controller.signal,
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch scans");

//       const allScans = await response.json();
//       cacheRef.current[`all-scans-${farmId}`] = allScans;

//       if (!endpoint) {
//         setRecentScans(Array.isArray(allScans) ? allScans : []);
//       } else {
//         const filtered = filterScansByDateRange(
//           Array.isArray(allScans) ? allScans : [],
//           timeFilter,
//           dateRange
//         );
//         setRecentScans(filtered);
//       }
//     } catch (error) {
//       if (error.name !== "AbortError") {
//         console.error("Recent scans fetch error:", error);
//       }
//     } finally {
//       if (isInitialLoad) {
//         setLoading(false);
//         setIsInitialLoad(false);
//       }
//     }
//   }, [
//     farmId,
//     timeFilter,
//     dateRange,
//     getEndpoint,
//     filterScansByDateRange,
//     isInitialLoad,
//   ]);

//   useEffect(() => {
//     fetchData();

//     const interval = setInterval(fetchData, 30000);

//     return () => {
//       clearInterval(interval);
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [fetchData]);

//   const getCardStyle = useCallback((prediction) => {
//     const styles = {
//       Healthy: {
//         bg: "bg-emerald-50/50",
//         border: "border-l-2 border-emerald-700",
//         textColor: "text-emerald-700",
//       },
//       "Ring Spot Virus": {
//         bg: "bg-orange-50/50",
//         border: "border-l-2 border-orange-600",
//         textColor: "text-orange-600",
//       },
//       Anthracnose: {
//         bg: "bg-rose-50/50",
//         border: "border-l-2 border-rose-600",
//         textColor: "text-rose-600",
//       },
//       "Powdery Mildew": {
//         bg: "bg-blue-50/50",
//         border: "border-l-2 border-blue-600",
//         textColor: "text-blue-600",
//       },
//     };
//     return (
//       styles[prediction] || {
//         bg: "bg-slate-50/50",
//         border: "border-l-2 border-slate-600",
//         textColor: "text-slate-600",
//       }
//     );
//   }, []);

//   const formatDateTime = useCallback((timestamp) => {
//     try {
//       if (!timestamp) return { date: "", time: "" };

//       const parts = timestamp.trim().split(/\s+/);
//       if (parts.length !== 3) return { date: timestamp, time: "" };

//       const [datePart, timePart, period] = parts;
//       const [month, day, year] = datePart.split("/");

//       const monthNames = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];

//       const monthIndex = parseInt(month) - 1;
//       const monthName = monthNames[monthIndex] || month;

//       return {
//         date: `${monthName} ${parseInt(day)}, ${year}`,
//         time: `${timePart} ${period}`,
//       };
//     } catch {
//       return { date: timestamp, time: "" };
//     }
//   }, []);

//   const getFarmerName = useCallback((scan) => {
//     return scan.farmerName || `Farmer ${scan.idNumber}`;
//   }, []);

//   const handleScanClick = useCallback((scan) => {
//     setSelectedScan(scan);
//     setShowDetailModal(true);
//   }, []);

//   const totalPages = Math.ceil(recentScans.length / SCANS_PER_PAGE);
//   const currentScans = useMemo(() => {
//     const startIndex = (currentPage - 1) * SCANS_PER_PAGE;
//     return recentScans.slice(startIndex, startIndex + SCANS_PER_PAGE);
//   }, [recentScans, currentPage]);

//   const goToPage = useCallback(
//     (page) => {
//       setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//     },
//     [totalPages]
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [recentScans.length]);

//   const FIXED_HEIGHT = "340px";

//   if (loading) {
//     return (
//       <div
//         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//         style={{ height: FIXED_HEIGHT }}
//       >
//         <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//           Scans ({dateRange})
//         </h2>
//         <div className="flex justify-center items-center flex-1">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//       style={{ height: FIXED_HEIGHT }}
//     >
//       <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//         Scans ({dateRange})
//       </h2>

//       <div className="flex-1 flex flex-col overflow-hidden">
//         {recentScans.length === 0 ? (
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
//             <p className="text-sm sm:text-base text-gray-500">No scans yet</p>
//             <p className="text-xs text-gray-400 mt-1">
//               Scans from {dateRange.toLowerCase()} will appear here
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="flex-1 space-y-2 overflow-y-auto">
//               {currentScans.map((scan, index) => {
//                 const cardStyle = getCardStyle(scan.prediction);
//                 const { date, time } = formatDateTime(scan.timestamp);
//                 return (
//                   <div
//                     key={`${scan.id || scan.timestamp}-${index}`}
//                     onClick={() => handleScanClick(scan)}
//                     className={`${cardStyle.bg} ${cardStyle.border} rounded-lg p-2.5 transition-all hover:shadow-md cursor-pointer hover:scale-[1.01]`}
//                   >
//                     <div className="flex items-start gap-2.5">
//                       <img
//                         src={scan.imageUrl}
//                         alt="Scan"
//                         className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
//                         onError={(e) => {
//                           e.target.src =
//                             "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23e5e7eb' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='9'%3ENo Image%3C/text%3E%3C/svg%3E";
//                         }}
//                       />

//                       <div className="flex-1 min-w-0 flex justify-between items-start">
//                         <div className="flex-1">
//                           <p
//                             className={`font-bold text-sm mb-0.5 ${cardStyle.textColor}`}
//                           >
//                             {scan.prediction}
//                           </p>
//                           <p className="text-xs text-slate-500 truncate">
//                             By: {getFarmerName(scan)}
//                           </p>
//                         </div>

//                         <div className="text-right flex-shrink-0 ml-2">
//                           <p className="text-xs text-slate-700 font-medium">
//                             {date}
//                           </p>
//                           <p className="text-xs text-slate-500">{time}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {totalPages > 1 && (
//               <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
//                 <div className="text-xs text-gray-600">
//                   Page {currentPage} of {totalPages}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => goToPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => goToPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {showDetailModal && selectedScan && (
//         <ScanDetailModal
//           isOpen={showDetailModal}
//           scan={selectedScan}
//           farmerName={getFarmerName(selectedScan)}
//           onClose={() => setShowDetailModal(false)}
//         />
//       )}
//     </div>
//   );
// }
