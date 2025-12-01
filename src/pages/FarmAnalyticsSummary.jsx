import React, { useState, useEffect, useRef } from "react";
import { ChartBarIncreasing, AlertCircle, CheckCircle } from "lucide-react";
import ScanDetailModal from "../components/Popups/ScanDetailModal";

// Simple in-memory cache
const cache = {
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

  set(key, value, ttl = 60000) {
    const userId = this.getUserId();
    if (!userId) return;
    const userKey = `${userId}:${key}`;
    this.data[userKey] = {
      value,
      expires: Date.now() + ttl,
    };
  },

  get(key) {
    const userId = this.getUserId();
    if (!userId) return null;
    const userKey = `${userId}:${key}`;
    const item = this.data[userKey];
    if (!item) return null;
    if (Date.now() > item.expires) {
      delete this.data[userKey];
      return null;
    }
    return item.value;
  },

  clear() {
    this.data = {};
  },
};

// Function to clean text - remove emojis and asterisks
const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      ""
    )
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
};

export default function FarmAnalyticsSummary({
  farmId,
  timeFilter,
  dateRange,
}) {
  const [summaryData, setSummaryData] = useState(null);
  const [commonDiseaseData, setCommonDiseaseData] = useState(null);
  const [scansInRange, setScansInRange] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const abortControllerRef = useRef(null);

  // Helper function to get number of periods based on date range
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

  // Filter scans based on date range
  const filterScansByDateRange = (allScans, filter, range) => {
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
  };

  // Format timestamp to readable date
  const formatScanDate = (timestamp) => {
    try {
      const [datePart] = timestamp.split(/\s+/);
      const [month, day, year] = datePart.split("/");
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return timestamp;
    }
  };

  const getFarmerName = (idNumber) => {
    const farmer = farmers.find((f) => f.idNumber === idNumber);
    if (!farmer) return `Farmer ${idNumber}`;

    let fullName = "";
    if (farmer.firstname) fullName += farmer.firstname;
    if (farmer.middlename) fullName += ` ${farmer.middlename}`;
    if (farmer.lastname) fullName += ` ${farmer.lastname}`;
    if (farmer.suffix) fullName += ` ${farmer.suffix}`;

    return fullName.trim() || farmer.fullName || `Farmer ${idNumber}`;
  };

  const getCardStyle = (prediction) => {
    const styles = {
      Healthy: {
        bg: "bg-emerald-50",
        border: "border-l-4 border-emerald-600",
        text: "text-emerald-700",
      },
      "Ring Spot Virus": {
        bg: "bg-orange-50",
        border: "border-l-4 border-orange-600",
        text: "text-orange-700",
      },
      Anthracnose: {
        bg: "bg-rose-50",
        border: "border-l-4 border-rose-600",
        text: "text-rose-700",
      },
      "Powdery Mildew": {
        bg: "bg-blue-50",
        border: "border-l-4 border-blue-600",
        text: "text-blue-700",
      },
    };

    return (
      styles[prediction] || {
        bg: "bg-slate-50",
        border: "border-l-4 border-slate-600",
        text: "text-slate-700",
      }
    );
  };

  const handleScanClick = (scan) => {
    setSelectedScan(scan);
    setShowDetailModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!farmId) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const endpointMap = {
        Daily: "daily-summary",
        Weekly: "weekly-summary",
        Monthly: "monthly-summary",
        Yearly: "yearly-summary",
      };

      const endpoint = endpointMap[timeFilter] || "daily-summary";
      const summaryCacheKey = `summary-${farmId}-${endpoint}`;
      const diseaseCacheKey = `disease-${farmId}`;

      const cachedSummary = cache.get(summaryCacheKey);
      const cachedDisease = cache.get(diseaseCacheKey);

      if (cachedSummary) {
        setSummaryData(cachedSummary);
        setLoading(false);
      }
      if (cachedDisease) {
        setCommonDiseaseData(cachedDisease);
      }

      if (cachedSummary || cachedDisease) {
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        // Fetch summary, disease data, farmers, and scans in parallel
        const [
          summaryResponse,
          diseaseResponse,
          farmersResponse,
          scansResponse,
        ] = await Promise.all([
          fetch(
            `https://papaiaapi.onrender.com/api/owner/${endpoint}/${farmId}`,
            { headers, signal: abortController.signal }
          ),
          fetch(
            `https://papaiaapi.onrender.com/api/owner/common-diseases/${farmId}`,
            { headers, signal: abortController.signal }
          ),
          fetch(`https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`, {
            headers,
            signal: abortController.signal,
          }),
          fetch(
            `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
            { headers, signal: abortController.signal }
          ),
        ]);

        const [summaryResult, diseaseResult, farmersData, scansData] =
          await Promise.all([
            summaryResponse.ok ? summaryResponse.json() : null,
            diseaseResponse.ok ? diseaseResponse.json() : null,
            farmersResponse.ok ? farmersResponse.json() : { status: "error" },
            scansResponse.ok ? scansResponse.json() : [],
          ]);

        if (summaryResult) {
          setSummaryData(summaryResult);
          cache.set(summaryCacheKey, summaryResult, 30000);
        }

        if (diseaseResult) {
          diseaseResult._fetchedAt = Date.now();
          setCommonDiseaseData(diseaseResult);
          cache.set(diseaseCacheKey, diseaseResult, 120000);
        }

        if (farmersData.status === "success") {
          const farmersList = farmersData.farmers || [];
          setFarmers(farmersList);

          const farmerIdNumbers = farmersList.map((f) => f.idNumber);

          // Filter scans by active farmers
          const activeFarmerScans = (scansData || [])
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
              const parseTimestamp = (timestamp) => {
                if (!timestamp) return new Date(0);
                try {
                  const [datePart, timePart, period] = timestamp.split(/\s+/);
                  const [month, day, year] = datePart.split("/");
                  const [hours, minutes] = timePart.split(":");
                  let hour24 = parseInt(hours);
                  if (period === "PM" && hour24 !== 12) hour24 += 12;
                  if (period === "AM" && hour24 === 12) hour24 = 0;
                  return new Date(year, month - 1, day, hour24, minutes);
                } catch {
                  return new Date(timestamp);
                }
              };
              return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
            });

          // Filter by date range
          const filteredScans = filterScansByDateRange(
            activeFarmerScans,
            timeFilter,
            dateRange
          );
          setScansInRange(filteredScans);
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        if (!cachedSummary) setSummaryData(null);
        if (!cachedDisease) setCommonDiseaseData(null);
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
  }, [farmId, timeFilter, dateRange]);

  if (loading && !summaryData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (!summaryData && !commonDiseaseData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <p className="text-gray-500 text-center text-sm sm:text-base">
          No summary data available
        </p>
      </div>
    );
  }

  const hasDisease = commonDiseaseData && commonDiseaseData.count > 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ChartBarIncreasing className="w-5 h-5 text-green-700" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Summary
          </h2>
        </div>

        {/* Summary Content */}
        <div className="space-y-4">
          {/* AI-Generated Summary */}
          {summaryData?.summary && (
            <div className="border-b border-gray-100 pb-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {cleanText(summaryData.summary)}
              </p>
            </div>
          )}

          {/* Most Common Disease Section */}
          {commonDiseaseData && (
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {hasDisease ? (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 text-sm sm:text-base ${
                      hasDisease ? "text-amber-900" : "text-emerald-900"
                    }`}
                  >
                    {hasDisease ? "Most Common Disease" : "Farm Health Status"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    {cleanText(commonDiseaseData.message)}
                  </p>
                  {hasDisease && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                      <span className="px-2 py-1 bg-gray-50 rounded-md font-medium text-amber-800 border border-amber-100">
                        {commonDiseaseData.count} cases
                      </span>
                      <span className="px-2 py-1 bg-gray-50 rounded-md font-medium text-amber-800 border border-amber-100">
                        {commonDiseaseData.percentage}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Scans in Range Section */}
          {scansInRange.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Scans in Selected Range ({scansInRange.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {scansInRange.map((scan, index) => {
                  const cardStyle = getCardStyle(scan.prediction);
                  return (
                    <div
                      key={`${scan.id || scan.timestamp}-${index}`}
                      onClick={() => handleScanClick(scan)}
                      className={`${cardStyle.bg} ${cardStyle.border} rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={scan.imageUrl}
                          alt="Scan"
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-bold text-xs mb-0.5 ${cardStyle.text}`}
                          >
                            {scan.prediction}
                          </p>
                          <p className="text-xs text-slate-600 mb-0.5 truncate">
                            {formatScanDate(scan.timestamp)}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            By: {getFarmerName(scan.idNumber)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {scansInRange.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">
                No scans found in the selected date range
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scan Detail Modal */}
      <ScanDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        scan={selectedScan}
        farmerName={selectedScan ? getFarmerName(selectedScan.idNumber) : ""}
      />
    </>
  );
}

// //new
// import React, { useState, useEffect, useRef } from "react";
// import { ChartBarIncreasing, AlertCircle, CheckCircle } from "lucide-react";

// // Simple in-memory cache
// const cache = {
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

//   set(key, value, ttl = 60000) {
//     const userId = this.getUserId();
//     if (!userId) return;
//     const userKey = `${userId}:${key}`;
//     this.data[userKey] = {
//       value,
//       expires: Date.now() + ttl,
//     };
//   },

//   get(key) {
//     const userId = this.getUserId();
//     if (!userId) return null;
//     const userKey = `${userId}:${key}`;
//     const item = this.data[userKey];
//     if (!item) return null;
//     if (Date.now() > item.expires) {
//       delete this.data[userKey];
//       return null;
//     }
//     return item.value;
//   },

//   clear() {
//     this.data = {};
//   },
// };

// // Function to clean text - remove emojis and asterisks
// const cleanText = (text) => {
//   if (!text) return "";
//   return text
//     .replace(
//       /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
//       ""
//     ) // Remove emojis
//     .replace(/\*\*/g, "") // Remove bold markdown
//     .replace(/\*/g, "") // Remove asterisks
//     .trim();
// };

// export default function FarmAnalyticsSummary({ farmId, timeFilter }) {
//   const [summaryData, setSummaryData] = useState(null);
//   const [commonDiseaseData, setCommonDiseaseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const abortControllerRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!farmId) return;

//       // Cancel previous request if still pending
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }

//       const abortController = new AbortController();
//       abortControllerRef.current = abortController;

//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };

//       // Map timeFilter to the correct endpoint
//       const endpointMap = {
//         Daily: "daily-summary",
//         Weekly: "weekly-summary",
//         Monthly: "monthly-summary",
//         Yearly: "yearly-summary",
//       };

//       const endpoint = endpointMap[timeFilter] || "daily-summary";
//       const summaryCacheKey = `summary-${farmId}-${endpoint}`;
//       const diseaseCacheKey = `disease-${farmId}`;

//       // Check cache first - show stale data immediately
//       const cachedSummary = cache.get(summaryCacheKey);
//       const cachedDisease = cache.get(diseaseCacheKey);

//       if (cachedSummary) {
//         setSummaryData(cachedSummary);
//         setLoading(false);
//       }
//       if (cachedDisease) {
//         setCommonDiseaseData(cachedDisease);
//       }

//       // If we have cached data, set loading to false immediately
//       if (cachedSummary || cachedDisease) {
//         setLoading(false);
//       } else {
//         setLoading(true);
//       }

//       try {
//         // Fetch summary first (priority)
//         const summaryResponse = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/${endpoint}/${farmId}`,
//           {
//             headers,
//             signal: abortController.signal,
//           }
//         );

//         if (!summaryResponse.ok) {
//           throw new Error(`HTTP error! status: ${summaryResponse.status}`);
//         }

//         const summaryResult = await summaryResponse.json();

//         // Update summary immediately
//         setSummaryData(summaryResult);
//         cache.set(summaryCacheKey, summaryResult, 30000);

//         // Fetch common diseases in background
//         if (
//           !cachedDisease ||
//           Date.now() - (cachedDisease._fetchedAt || 0) > 120000
//         ) {
//           fetch(
//             `https://papaiaapi.onrender.com/api/owner/common-diseases/${farmId}`,
//             { headers }
//           )
//             .then((res) => (res.ok ? res.json() : null))
//             .then((diseaseResult) => {
//               if (diseaseResult && !abortController.signal.aborted) {
//                 diseaseResult._fetchedAt = Date.now();
//                 setCommonDiseaseData(diseaseResult);
//                 cache.set(diseaseCacheKey, diseaseResult, 120000);
//               }
//             })
//             .catch((err) => {});
//         }
//       } catch (error) {
//         if (error.name === "AbortError") {
//           return;
//         }

//         if (!cachedSummary) {
//           setSummaryData(null);
//         }
//         if (!cachedDisease) {
//           setCommonDiseaseData(null);
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
//   }, [farmId, timeFilter]);

//   if (loading && !summaryData) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//         <div className="flex items-center justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!summaryData && !commonDiseaseData) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//         <p className="text-gray-500 text-center text-sm sm:text-base">
//           No summary data available
//         </p>
//       </div>
//     );
//   }

//   const hasDisease = commonDiseaseData && commonDiseaseData.count > 0;

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <ChartBarIncreasing className="w-5 h-5 text-green-700" />
//         <h2 className="text-lg sm:text-xl font-bold text-gray-800">Summary</h2>
//       </div>

//       {/* Summary Content */}
//       <div className="space-y-4">
//         {/* AI-Generated Summary - Clean paragraph */}
//         {summaryData?.summary && (
//           <div className="border-b border-gray-100 pb-4">
//             <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
//               {cleanText(summaryData.summary)}
//             </p>
//           </div>
//         )}

//         {/* Most Common Disease Section - Clean */}
//         {commonDiseaseData && (
//           <div className="border-b border-gray-100 pb-4">
//             <div className="flex items-start gap-3">
//               <div className="mt-0.5">
//                 {hasDisease ? (
//                   <AlertCircle className="w-5 h-5 text-amber-600" />
//                 ) : (
//                   <CheckCircle className="w-5 h-5 text-emerald-600" />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <h3
//                   className={`font-semibold mb-1 text-sm sm:text-base ${
//                     hasDisease ? "text-amber-900" : "text-emerald-900"
//                   }`}
//                 >
//                   {hasDisease ? "Most Common Disease" : "Farm Health Status"}
//                 </h3>
//                 <p className="text-sm sm:text-base text-gray-700">
//                   {cleanText(commonDiseaseData.message)}
//                 </p>
//                 {hasDisease && (
//                   <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
//                     <span className="px-2 py-1 bg-gray-50 rounded-md font-medium text-amber-800 border border-amber-100">
//                       {commonDiseaseData.count} cases
//                     </span>
//                     <span className="px-2 py-1 bg-gray-50 rounded-md font-medium text-amber-800 border border-amber-100">
//                       {commonDiseaseData.percentage}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Trends - Clean paragraph format */}
//         {summaryData?.trends && summaryData.trends.length > 0 && (
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">
//               Key Trends
//             </h3>
//             <div className="space-y-2">
//               {summaryData.trends.slice(0, 3).map((trend, index) => (
//                 <p
//                   key={index}
//                   className="text-xs sm:text-sm text-gray-600 leading-relaxed"
//                 >
//                   {cleanText(trend)}
//                 </p>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
