import { useState, useEffect, useCallback, useRef } from "react";
import { Leaf } from "lucide-react";
import ScanDetailModal from "../components/Popups/ScanDetailModal";

// Simple cache for faster subsequent loads
const scanCache = {
  data: {},

  getUserId() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || payload.id || payload.sub;
    } catch {
      return null;
    }
  },

  set(key, value, ttl = 30000) {
    const userId = this.getUserId();
    if (!userId) return;
    const userKey = `${userId}:${key}`;
    this.data[userKey] = { value, expires: Date.now() + ttl };
  },

  get(key) {
    const userId = this.getUserId();
    if (!userId) return null;
    const userKey = `${userId}:${key}`;
    const item = this.data[userKey];
    if (!item || Date.now() > item.expires) {
      delete this.data[userKey];
      return null;
    }
    return item.value;
  },
};

export default function RecentScans({ farmId, dateRange, timeFilter }) {
  const [allScans, setAllScans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const abortControllerRef = useRef(null);

  // Parse date from timestamp string
  const parseTimestamp = useCallback((timestamp) => {
    if (!timestamp) return new Date(0);
    try {
      const [datePart, timePart, period] = timestamp.split(/\s+/);
      const [month, day, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");
      let hour24 = parseInt(hours);
      if (period === "PM" && hour24 !== 12) hour24 += 12;
      if (period === "AM" && hour24 === 12) hour24 = 0;
      const fullYear = year.length === 2 ? `20${year}` : year;
      return new Date(fullYear, month - 1, day, hour24, minutes);
    } catch {
      return new Date(timestamp);
    }
  }, []);

  // Get periods to show based on date range
  const getPeriodsToShow = useCallback((range, filter) => {
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
  }, []);

  // Filter scans based on date range
  useEffect(() => {
    if (!dateRange || !timeFilter) {
      setFilteredScans(allScans);
      return;
    }

    const now = new Date();
    const periodsToShow = getPeriodsToShow(dateRange, timeFilter);
    let cutoffDate;

    switch (timeFilter) {
      case "Daily":
        cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - periodsToShow);
        break;

      case "Weekly":
        cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - periodsToShow * 7);
        break;

      case "Monthly":
        cutoffDate = new Date(now);
        cutoffDate.setMonth(cutoffDate.getMonth() - periodsToShow);
        break;

      case "Yearly":
        cutoffDate = new Date(now);
        cutoffDate.setFullYear(cutoffDate.getFullYear() - periodsToShow);
        break;

      default:
        setFilteredScans(allScans);
        return;
    }

    const filtered = allScans.filter((scan) => {
      const scanDate = parseTimestamp(scan.timestamp);
      return scanDate >= cutoffDate;
    });

    setFilteredScans(filtered);
  }, [dateRange, timeFilter, allScans, getPeriodsToShow, parseTimestamp]);

  useEffect(() => {
    if (!farmId) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      const cacheKey = `scans-${farmId}`;
      const cached = scanCache.get(cacheKey);

      // Show cached data immediately
      if (cached) {
        setFarmers(cached.farmers);
        setAllScans(cached.scans);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        // Fetch both in parallel - using the same API as scan history page
        const [farmersResponse, scansResponse] = await Promise.all([
          fetch(`https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }),
          fetch(
            `https://papaiaapi.onrender.com/api/owner/predictions-history/${farmId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              signal: controller.signal,
            }
          ),
        ]);

        const [farmersData, scansData] = await Promise.all([
          farmersResponse.ok ? farmersResponse.json() : { status: "error" },
          scansResponse.ok ? scansResponse.json() : [],
        ]);

        if (farmersData.status === "success") {
          const farmersList = farmersData.farmers || [];
          setFarmers(farmersList);

          // Get farmer ID numbers
          const farmerIdNumbers = farmersList.map((f) => f.idNumber);

          // Process scans - normalize result/prediction field
          const processedScans = (Array.isArray(scansData) ? scansData : [])
            .map((scan) => ({
              ...scan,
              // Normalize to use 'prediction' field (API may use 'result')
              prediction: scan.result || scan.prediction,
            }))
            .filter((scan) => {
              const farmer = farmersList.find(
                (f) => f.idNumber === scan.idNumber
              );
              const isActive =
                farmer &&
                farmer.status !== "deactivate" &&
                farmer.status !== "inactive";
              return farmerIdNumbers.includes(scan.idNumber) && isActive;
            })
            .sort((a, b) => {
              return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
            });

          setAllScans(processedScans);

          // Cache the results
          scanCache.set(cacheKey, {
            farmers: farmersList,
            scans: processedScans,
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          if (!cached) {
            setAllScans([]);
            setFarmers([]);
          }
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
  }, [farmId, parseTimestamp]);

  // Get card styling based on disease type
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

      const monthName = monthNames[parseInt(month) - 1];
      const fullYear = year.length === 2 ? `20${year}` : year;

      return `${monthName} ${parseInt(day)}, ${fullYear}`;
    } catch (error) {
      return timestamp;
    }
  }, []);

  const getFarmerName = useCallback(
    (idNumber) => {
      const farmer = farmers.find((f) => f.idNumber === idNumber);
      return farmer
        ? farmer.fullName || farmer.firstname || `Farmer ${idNumber}`
        : `ID: ${idNumber}`;
    },
    [farmers]
  );

  const handleImageError = useCallback((e) => {
    e.target.style.display = "none";
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = "flex";
    }
  }, []);

  const handleScanClick = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  // Updated to match FarmAnalytics height
  const FIXED_HEIGHT = "580px";

  const displayScans = dateRange && timeFilter ? filteredScans : allScans;

  if (loading && !allScans.length) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Recent Scans
        </h2>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Recent Scans
        </h2>

        {displayScans.length === 0 ? (
          <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
            <p className="text-sm sm:text-base text-gray-500">
              No scans available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {dateRange && timeFilter
                ? `No scans found for ${dateRange}`
                : "Scans will appear when assigned farmers make predictions"}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {displayScans.map((scan, index) => {
                const cardStyle = getCardStyle(scan.prediction);
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

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-bold text-sm mb-0.5 ${cardStyle.textColor}`}
                        >
                          {scan.prediction}
                        </p>
                        <p className="text-xs text-slate-700 font-medium mb-0.5 break-words">
                          {formatDateTime(scan.timestamp)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {getFarmerName(scan.idNumber)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 text-center flex-shrink-0">
              <p className="text-xs text-gray-500">
                {displayScans.length > 0
                  ? `Showing ${displayScans.length} scan${
                      displayScans.length !== 1 ? "s" : ""
                    }${dateRange && timeFilter ? ` for ${dateRange}` : ""}`
                  : "No scans from assigned farmers yet"}
              </p>
            </div>
          </div>
        )}
      </div>

      <ScanDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scan={selectedScan}
        farmerName={selectedScan ? getFarmerName(selectedScan.idNumber) : ""}
      />
    </>
  );
}

// import { useState, useEffect, useCallback, useRef } from "react";
// import { Leaf } from "lucide-react";

// // Simple cache for faster subsequent loads
// const scanCache = {
//   data: {},

//   getUserId() {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return null;
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const payload = JSON.parse(window.atob(base64));
//       return payload.userId || payload.id || payload.sub;
//     } catch {
//       return null;
//     }
//   },

//   set(key, value, ttl = 30000) {
//     const userId = this.getUserId();
//     if (!userId) return;
//     const userKey = `${userId}:${key}`;
//     this.data[userKey] = { value, expires: Date.now() + ttl };
//   },

//   get(key) {
//     const userId = this.getUserId();
//     if (!userId) return null;
//     const userKey = `${userId}:${key}`;
//     const item = this.data[userKey];
//     if (!item || Date.now() > item.expires) {
//       delete this.data[userKey];
//       return null;
//     }
//     return item.value;
//   },
// };

// export default function RecentScans({ farmId }) {
//   const [recentScans, setRecentScans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [farmers, setFarmers] = useState([]);
//   const abortControllerRef = useRef(null);

//   useEffect(() => {
//     if (!farmId) return;

//     // Cancel previous request
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     const fetchData = async () => {
//       const cacheKey = `scans-${farmId}`;
//       const cached = scanCache.get(cacheKey);

//       // Show cached data immediately
//       if (cached) {
//         setFarmers(cached.farmers);
//         setRecentScans(cached.scans);
//         setLoading(false);
//       } else {
//         setLoading(true);
//       }

//       try {
//         // Fetch both in parallel
//         const [farmersResponse, scansResponse] = await Promise.all([
//           fetch(`https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             signal: controller.signal,
//           }),
//           fetch(
//             `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//               signal: controller.signal,
//             }
//           ),
//         ]);

//         const [farmersData, scansData] = await Promise.all([
//           farmersResponse.ok ? farmersResponse.json() : { status: "error" },
//           scansResponse.ok ? scansResponse.json() : [],
//         ]);

//         if (farmersData.status === "success") {
//           const farmersList = farmersData.farmers || [];
//           setFarmers(farmersList);

//           // Get farmer ID numbers
//           const farmerIdNumbers = farmersList.map((f) => f.idNumber);

//           // Filter and sort scans - now showing 5 instead of 4
//           // const filteredScans = (scansData || [])
//           //   .filter((scan) => farmerIdNumbers.includes(scan.idNumber))
//           //   .sort((a, b) => {
//           //     const parseTimestamp = (timestamp) => {
//           //       if (!timestamp) return new Date(0);
//           //       try {
//           //         const [datePart, timePart, period] = timestamp.split(/\s+/);
//           //         const [month, day, year] = datePart.split("/");
//           //         const [hours, minutes] = timePart.split(":");
//           //         let hour24 = parseInt(hours);
//           //         if (period === "PM" && hour24 !== 12) hour24 += 12;
//           //         if (period === "AM" && hour24 === 12) hour24 = 0;
//           //         return new Date(year, month - 1, day, hour24, minutes);
//           //       } catch {
//           //         return new Date(timestamp);
//           //       }
//           //     };
//           //     return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
//           //   })
//           //   .slice(0, 5);
//           // Update the filter to exclude deactivated farmers
//           const filteredScans = (scansData || [])
//             .filter((scan) => {
//               const farmer = farmersList.find(
//                 (f) => f.idNumber === scan.idNumber
//               );
//               const isActive =
//                 farmer &&
//                 farmer.status !== "deactivate" &&
//                 farmer.status !== "inactive";
//               return farmerIdNumbers.includes(scan.idNumber) && isActive;
//             })
//             .sort((a, b) => {
//               const parseTimestamp = (timestamp) => {
//                 if (!timestamp) return new Date(0);
//                 try {
//                   const [datePart, timePart, period] = timestamp.split(/\s+/);
//                   const [month, day, year] = datePart.split("/");
//                   const [hours, minutes] = timePart.split(":");
//                   let hour24 = parseInt(hours);
//                   if (period === "PM" && hour24 !== 12) hour24 += 12;
//                   if (period === "AM" && hour24 === 12) hour24 = 0;
//                   return new Date(year, month - 1, day, hour24, minutes);
//                 } catch {
//                   return new Date(timestamp);
//                 }
//               };
//               return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
//             })
//             .slice(0, 5);

//           setRecentScans(filteredScans);

//           // Cache the results
//           scanCache.set(cacheKey, {
//             farmers: farmersList,
//             scans: filteredScans,
//           });
//         }
//       } catch (error) {
//         if (error.name !== "AbortError") {
//           if (!cached) {
//             setRecentScans([]);
//             setFarmers([]);
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [farmId]);

//   // Get card styling based on disease type
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
//       if (!timestamp) return "";

//       const parts = timestamp.trim().split(/\s+/);
//       if (parts.length !== 3) return timestamp;

//       const datePart = parts[0];
//       const timePart = parts[1];
//       const period = parts[2];

//       const [month, day, year] = datePart.split("/");
//       if (!month || !day || !year) return timestamp;

//       const [hours, minutes] = timePart.split(":");
//       if (!hours || !minutes) return timestamp;

//       const shortYear = year.slice(-2);
//       return `${month.padStart(2, "0")}/${day.padStart(
//         2,
//         "0"
//       )}/${shortYear} ${hours.padStart(2, "0")}:${minutes.padStart(
//         2,
//         "0"
//       )} ${period}`;
//     } catch (error) {
//       return timestamp;
//     }
//   }, []);

//   const getFarmerName = useCallback(
//     (idNumber) => {
//       const farmer = farmers.find((f) => f.idNumber === idNumber);
//       return farmer
//         ? farmer.fullName || farmer.firstname || `Farmer ${idNumber}`
//         : `ID: ${idNumber}`;
//     },
//     [farmers]
//   );

//   const handleImageError = useCallback((e) => {
//     e.target.style.display = "none";
//     if (e.target.nextSibling) {
//       e.target.nextSibling.style.display = "flex";
//     }
//   }, []);

//   // Updated to match FarmAnalytics height
//   const FIXED_HEIGHT = "580px";

//   if (loading && !recentScans.length) {
//     return (
//       <div
//         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//         style={{ height: FIXED_HEIGHT }}
//       >
//         <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//           Recent Scans
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
//         Recent Scans
//       </h2>

//       {recentScans.length === 0 ? (
//         <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
//           <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
//           <p className="text-sm sm:text-base text-gray-500">
//             No recent scans available
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             Scans will appear when assigned farmers make predictions
//           </p>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col">
//           <div className="space-y-3 flex-1">
//             {recentScans.map((scan, index) => {
//               const cardStyle = getCardStyle(scan.prediction);
//               return (
//                 <div
//                   key={`${scan.id || scan.timestamp}-${index}`}
//                   className={`${cardStyle.bg} ${cardStyle.border} rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="relative flex-shrink-0">
//                       <img
//                         src={scan.imageUrl}
//                         alt="Scan"
//                         className="w-14 h-14 rounded-lg object-cover border border-gray-200"
//                         onError={handleImageError}
//                       />
//                       <div
//                         className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-200 items-center justify-center text-gray-400 text-xs hidden"
//                         style={{ display: "none" }}
//                       >
//                         No Image
//                       </div>
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <p
//                         className={`font-bold text-sm mb-0.5 ${cardStyle.textColor}`}
//                       >
//                         {scan.prediction}
//                       </p>
//                       <p className="text-xs text-slate-700 font-medium mb-0.5 break-words">
//                         {formatDateTime(scan.timestamp)}
//                       </p>
//                       <p className="text-xs text-slate-500">
//                         {getFarmerName(scan.idNumber)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-3 pt-3 border-t border-gray-200 text-center">
//             <p className="text-xs text-gray-500">
//               {recentScans.length > 0
//                 ? `Showing ${recentScans.length} most recent scans`
//                 : "No scans from assigned farmers yet"}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
