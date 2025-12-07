import React, { useState, useEffect, useRef, useCallback } from "react";
import { BarChart3 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  const abortControllerRef = useRef(null);
  const lastHashRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const initialLoadRef = useRef(true);

  // Map timeFilter and dateRange to API endpoints
  const getApiEndpoints = useCallback((filter, range) => {
    const endpoints = {
      Daily: {
        "Last 7 days": {
          summary: "seven-days-summary",
        },
        "Last 11 days": {
          summary: "eleven-days-summary",
        },
        "Last 14 days": {
          summary: "fourteen-days-summary",
        },
      },
      Weekly: {
        "Last 4 weeks": {
          summary: "four-week-summary",
        },
        "Last 9 weeks": {
          summary: "nine-week-summary",
        },
        "Last 12 weeks": {
          summary: "twelve-week-summary",
        },
      },
      Monthly: {
        "Last 3 months": {
          summary: "three-month-summary",
        },
        "Last 6 months": {
          summary: "six-month-summary",
        },
        "Last 12 months": {
          summary: "twelve-month-summary",
        },
      },
      Yearly: {
        "Last 3 years": {
          summary: "three-year-summary",
        },
        "Last 5 years": {
          summary: "five-year-summary",
        },
        "Last 7 years": {
          summary: "seven-year-summary",
        },
      },
    };

    return endpoints[filter]?.[range] || endpoints.Daily["Last 11 days"];
  }, []);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!farmId) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const endpoints = getApiEndpoints(timeFilter, dateRange);

      try {
        if (!silent && initialLoadRef.current) {
          setLoading(true);
        }

        const summaryResponse = await fetch(
          `https://papaiaapi.onrender.com/api/owner/${endpoints.summary}/${farmId}`,
          { headers, signal: abortController.signal }
        );

        if (!summaryResponse.ok) {
          if (!silent) {
            setSummaryData(null);
          }
          return;
        }

        const summaryResult = await summaryResponse.json();

        // Generate hash to check if data changed
        const newHash = generateHash(summaryResult);

        // Only update if hash changed
        if (silent && lastHashRef.current === newHash) {
          return; // No changes, skip update
        }

        lastHashRef.current = newHash;
        setSummaryData(summaryResult);
      } catch (error) {
        if (error.name === "AbortError") return;

        if (!silent) {
          setSummaryData(null);
        }
      } finally {
        if (!silent && initialLoadRef.current) {
          setLoading(false);
          initialLoadRef.current = false;
        }
      }
    },
    [farmId, timeFilter, dateRange, getApiEndpoints]
  );

  // Initial fetch
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

  const FIXED_HEIGHT = "420px";

  if (loading) {
    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-green-700" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Summary ({dateRange})
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-center text-sm sm:text-base">
            No scans available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-700" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Summary ({dateRange})
        </h2>
      </div>

      {/* Summary Content */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* AI-Generated Summary */}
        {summaryData?.summary && (
          <div className="pb-4">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {cleanText(summaryData.summary)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import { BarChart3 } from "lucide-react";

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
//     )
//     .replace(/\*\*/g, "")
//     .replace(/\*/g, "")
//     .trim();
// };

// export default function FarmAnalyticsSummary({
//   farmId,
//   timeFilter,
//   dateRange,
// }) {
//   const [summaryData, setSummaryData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const abortControllerRef = useRef(null);

//   // Map timeFilter and dateRange to API endpoints
//   const getApiEndpoints = (filter, range) => {
//     const endpoints = {
//       Daily: {
//         "Last 7 days": {
//           summary: "seven-days-summary",
//         },
//         "Last 11 days": {
//           summary: "eleven-days-summary",
//         },
//         "Last 14 days": {
//           summary: "fourteen-days-summary",
//         },
//       },
//       Weekly: {
//         "Last 4 weeks": {
//           summary: "four-week-summary",
//         },
//         "Last 9 weeks": {
//           summary: "nine-week-summary",
//         },
//         "Last 12 weeks": {
//           summary: "twelve-week-summary",
//         },
//       },
//       Monthly: {
//         "Last 3 months": {
//           summary: "three-month-summary",
//         },
//         "Last 6 months": {
//           summary: "six-month-summary",
//         },
//         "Last 12 months": {
//           summary: "twelve-month-summary",
//         },
//       },
//       Yearly: {
//         "Last 3 years": {
//           summary: "three-year-summary",
//         },
//         "Last 5 years": {
//           summary: "five-year-summary",
//         },
//         "Last 7 years": {
//           summary: "seven-year-summary",
//         },
//       },
//     };

//     return endpoints[filter]?.[range] || endpoints.Daily["Last 11 days"];
//   };

//   useEffect(() => {
//     const fetchData = async (silent = false) => {
//       if (!farmId) return;

//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }

//       const abortController = new AbortController();
//       abortControllerRef.current = abortController;

//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };

//       const endpoints = getApiEndpoints(timeFilter, dateRange);
//       const summaryCacheKey = `summary-${farmId}-${endpoints.summary}`;

//       const cachedSummary = cache.get(summaryCacheKey);

//       if (cachedSummary) {
//         setSummaryData(cachedSummary);
//         if (isInitialLoad) {
//           setLoading(false);
//         }
//       } else if (!silent && isInitialLoad) {
//         setLoading(true);
//       }

//       try {
//         const summaryResponse = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/${endpoints.summary}/${farmId}`,
//           { headers, signal: abortController.signal }
//         );

//         const summaryResult = summaryResponse.ok
//           ? await summaryResponse.json()
//           : null;

//         if (summaryResult) {
//           setSummaryData(summaryResult);
//           cache.set(summaryCacheKey, summaryResult, 30000);
//         }
//       } catch (error) {
//         if (error.name === "AbortError") return;

//         if (!cachedSummary) setSummaryData(null);
//       } finally {
//         if (!silent && isInitialLoad) {
//           setLoading(false);
//           setIsInitialLoad(false);
//         }
//       }
//     };

//     // Initial fetch
//     fetchData();

//     // Poll every 30 seconds
//     const interval = setInterval(() => fetchData(true), 30000);

//     return () => {
//       clearInterval(interval);
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [farmId, timeFilter, dateRange, isInitialLoad]);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//         <div className="flex items-center justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!summaryData) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//         <p className="text-gray-500 text-center text-sm sm:text-base">
//           No summary data available
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <BarChart3 className="w-5 h-5 text-green-700" />
//         <h2 className="text-lg sm:text-xl font-bold text-gray-800">
//           Summary ({dateRange})
//         </h2>
//       </div>

//       {/* Summary Content */}
//       <div className="space-y-4">
//         {/* AI-Generated Summary */}
//         {summaryData?.summary && (
//           <div className="pb-4">
//             <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
//               {cleanText(summaryData.summary)}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
