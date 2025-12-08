import { useState, useEffect, useCallback, useRef } from "react";
import { Leaf, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ScansBreakdown({ farmId, timeFilter, dateRange }) {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [animationKey, setAnimationKey] = useState(0);
  const [filterActive, setFilterActive] = useState(false);
  const abortControllerRef = useRef(null);
  const initialLoadRef = useRef(true);
  const pollIntervalRef = useRef(null);
  const lastFilterRef = useRef({ timeFilter, dateRange });
  const [animationKey, setAnimationKey] = useState(0);

  // Disease colors mapping
  const diseaseColors = {
    Healthy: "#10b981",
    "Ring Spot Virus": "#ea580c",
    Anthracnose: "#f43f5e",
    "Powdery Mildew": "#3b82f6",
  };

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

  // Calculate disease distribution for pie chart
  const calculateDiseaseDistribution = useCallback((scans) => {
    const allDiseases = [
      "Healthy",
      "Ring Spot Virus",
      "Anthracnose",
      "Powdery Mildew",
    ];
    const counts = {};

    // Initialize all diseases with 0
    allDiseases.forEach((disease) => {
      counts[disease] = 0;
    });

    // Count occurrences
    scans.forEach((scan) => {
      if (counts.hasOwnProperty(scan.prediction)) {
        counts[scan.prediction]++;
      }
    });

    // Convert to array format for pie chart, filter out zero values for chart
    const chartData = allDiseases
      .filter((disease) => counts[disease] > 0)
      .map((disease) => ({
        name: disease,
        value: counts[disease],
        color: diseaseColors[disease],
      }));

    // Create list of diseases with zero cases
    const zeroCases = allDiseases
      .filter((disease) => counts[disease] === 0)
      .map((disease) => disease);

    return { chartData, zeroCases, counts };
  }, []);

  // Get most common disease(s)
  const getMostCommonDiseases = useCallback((counts) => {
    // Filter out Healthy and diseases with 0 count
    const diseaseEntries = Object.entries(counts)
      .filter(([disease, count]) => disease !== "Healthy" && count > 0)
      .sort((a, b) => b[1] - a[1]);

    if (diseaseEntries.length === 0) return [];

    const maxCount = diseaseEntries[0][1];
    return diseaseEntries
      .filter(([, count]) => count === maxCount)
      .map(([disease]) => disease);
  }, []);

  // Track when user manually changes date range (skip initial load)
  // Track when user manually changes date range (skip initial load)
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    setFilterActive(true);
  }, [dateRange]);

  // ADD THIS ENTIRE BLOCK:
  // Detect filter changes and show loading
  useEffect(() => {
    const filterChanged =
      lastFilterRef.current.timeFilter !== timeFilter ||
      lastFilterRef.current.dateRange !== dateRange;

    if (filterChanged) {
      lastFilterRef.current = { timeFilter, dateRange };
      setLoading(true);
    }
  }, [timeFilter, dateRange]);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!farmId) return;

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!silent) {
        setLoading(true);
      }

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

        if (!response.ok) {
          throw new Error("Failed to fetch scans");
        }

        const scansData = await response.json();
        const allScans = Array.isArray(scansData) ? scansData : [];

        // Only filter by date range if user has actively selected a range
        const filteredScans = filterActive
          ? filterScansByDateRange(allScans, timeFilter, dateRange)
          : allScans;

        // ✅ ADD THIS: Only update if data has actually changed
        setRecentScans((prevScans) => {
          // Compare lengths and content
          if (prevScans.length !== filteredScans.length) {
            return filteredScans;
          }

          // If lengths are same, check if content is different
          const isDifferent = filteredScans.some(
            (scan, index) =>
              scan.id !== prevScans[index]?.id ||
              scan.timestamp !== prevScans[index]?.timestamp
          );

          return isDifferent ? filteredScans : prevScans;
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
          setRecentScans([]);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [farmId, timeFilter, dateRange, filterScansByDateRange, filterActive]
  );

  // Initial load and polling
  useEffect(() => {
    if (!farmId) return;

    // Initial fetch
    fetchData(false);

    // Set up polling - fetch every 3 seconds in background
    pollIntervalRef.current = setInterval(() => {
      if (!document.hidden) {
        fetchData(true);
      }
    }, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [farmId, fetchData]);

  const FIXED_HEIGHT = "580px";

  const { chartData, zeroCases, counts } =
    calculateDiseaseDistribution(recentScans);
  const totalScans = recentScans.length;
  const mostCommonDiseases = getMostCommonDiseases(counts);

  if (loading && !recentScans.length) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Scan Breakdown{filterActive ? ` (${dateRange})` : ""}
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
        Scan Breakdown{filterActive ? ` (${dateRange})` : ""}
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
          {/* Scrollable Container */}
          <div
            className="flex-1 overflow-y-auto pr-2 space-y-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Pie Chart Section */}
            <div className="border-b border-gray-200 pb-2">
              {chartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({
                          name,
                          percent,
                          value,
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius =
                            innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="white"
                              textAnchor="middle"
                              dominantBaseline="central"
                              className="text-xs"
                            >
                              <tspan
                                x={x}
                                dy="-0.6em"
                                style={{ fontSize: "15px" }}
                              >
                                {name}
                              </tspan>
                              <tspan
                                x={x}
                                dy="1.2em"
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >{`${(percent * 100).toFixed(0)}%`}</tspan>
                              <tspan
                                x={x}
                                dy="1.2em"
                                style={{ fontSize: "14px" }}
                              >{`${value} ${
                                value === 1 ? "case" : "cases"
                              }`}</tspan>
                            </text>
                          );
                        }}
                        outerRadius={150}
                        innerRadius={0}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} cases (${(
                            (value / totalScans) *
                            100
                          ).toFixed(1)}%)`,
                          props.payload.name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {zeroCases.length > 0 && (
                    <p className="text-xs text-black mb-3 mt-3 italic font-medium text-center">
                      No cases: {zeroCases.join(", ")}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4 mt-3">
                  No data to display
                </p>
              )}
            </div>

            {/* Disease Statistics List */}
            <div className="space-y-3">
              {/* Most Common Disease */}
              {mostCommonDiseases.length > 0 && (
                <div className="bg-amber-50/50 border-l-4 border-amber-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-amber-800 mb-1">
                        Most Common Disease
                      </p>
                      <p className="text-sm text-amber-700">
                        {mostCommonDiseases.join(", ")}
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        {counts[mostCommonDiseases[0]]}{" "}
                        {counts[mostCommonDiseases[0]] === 1 ? "case" : "cases"}{" "}
                        (
                        {(
                          (counts[mostCommonDiseases[0]] / totalScans) *
                          100
                        ).toFixed(1)}
                        %)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* All Diseases List */}
              {Object.entries(counts).map(([disease, count]) => {
                const color = diseaseColors[disease] || "#64748b";

                return (
                  <div key={disease} className="flex items-center gap-2 py-2">
                    <div
                      className="w-2 h-2 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <p className="text-sm text-gray-700">{disease}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {count === 0
                          ? "No cases"
                          : `${count} ${count === 1 ? "case" : "cases"}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState, useEffect, useCallback, useRef } from "react";
// import { Leaf, TrendingUp } from "lucide-react";
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// export default function ScansBreakdown({ farmId, timeFilter, dateRange }) {
//   const [recentScans, setRecentScans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [animationKey, setAnimationKey] = useState(0);
//   const [filterActive, setFilterActive] = useState(false);
//   const abortControllerRef = useRef(null);
//   const initialLoadRef = useRef(true);

//   // Disease colors mapping
//   const diseaseColors = {
//     Healthy: "#10b981",
//     "Ring Spot Virus": "#ea580c",
//     Anthracnose: "#f43f5e",
//     "Powdery Mildew": "#3b82f6",
//   };

//   // Helper function to get number of periods based on date range
//   const getPeriodsFromRange = (range, filter) => {
//     switch (filter) {
//       case "Daily":
//         if (range === "Last 7 days") return 7;
//         if (range === "Last 11 days") return 11;
//         if (range === "Last 14 days") return 14;
//         return 11;
//       case "Weekly":
//         if (range === "Last 4 weeks") return 4;
//         if (range === "Last 9 weeks") return 9;
//         if (range === "Last 12 weeks") return 12;
//         return 9;
//       case "Monthly":
//         if (range === "Last 3 months") return 3;
//         if (range === "Last 6 months") return 6;
//         if (range === "Last 12 months") return 12;
//         return 12;
//       case "Yearly":
//         if (range === "Last 3 years") return 3;
//         if (range === "Last 5 years") return 5;
//         if (range === "Last 7 years") return 7;
//         return 7;
//       default:
//         return 11;
//     }
//   };

//   // Filter scans based on date range
//   const filterScansByDateRange = useCallback((allScans, filter, range) => {
//     const periods = getPeriodsFromRange(range, filter);
//     const now = new Date();
//     let startDate;

//     switch (filter) {
//       case "Daily":
//         startDate = new Date(now);
//         startDate.setDate(startDate.getDate() - periods + 1);
//         break;
//       case "Weekly":
//         startDate = new Date(now);
//         startDate.setDate(startDate.getDate() - periods * 7);
//         break;
//       case "Monthly":
//         startDate = new Date(now);
//         startDate.setMonth(startDate.getMonth() - periods);
//         break;
//       case "Yearly":
//         startDate = new Date(now);
//         startDate.setFullYear(startDate.getFullYear() - periods);
//         break;
//       default:
//         startDate = new Date(now);
//         startDate.setDate(startDate.getDate() - 11);
//     }

//     startDate.setHours(0, 0, 0, 0);

//     return allScans.filter((scan) => {
//       try {
//         const [datePart, timePart, period] = scan.timestamp.split(/\s+/);
//         const [month, day, year] = datePart.split("/");
//         const [hours, minutes] = timePart.split(":");
//         let hour24 = parseInt(hours);
//         if (period === "PM" && hour24 !== 12) hour24 += 12;
//         if (period === "AM" && hour24 === 12) hour24 = 0;
//         const scanDate = new Date(year, month - 1, day, hour24, minutes);
//         return scanDate >= startDate && scanDate <= now;
//       } catch {
//         return false;
//       }
//     });
//   }, []);

//   // Calculate disease distribution for pie chart
//   const calculateDiseaseDistribution = useCallback((scans) => {
//     const allDiseases = [
//       "Healthy",
//       "Ring Spot Virus",
//       "Anthracnose",
//       "Powdery Mildew",
//     ];
//     const counts = {};

//     // Initialize all diseases with 0
//     allDiseases.forEach((disease) => {
//       counts[disease] = 0;
//     });

//     // Count occurrences
//     scans.forEach((scan) => {
//       if (counts.hasOwnProperty(scan.prediction)) {
//         counts[scan.prediction]++;
//       }
//     });

//     // Convert to array format for pie chart, filter out zero values for chart
//     const chartData = allDiseases
//       .filter((disease) => counts[disease] > 0)
//       .map((disease) => ({
//         name: disease,
//         value: counts[disease],
//         color: diseaseColors[disease],
//       }));

//     // Create list of diseases with zero cases
//     const zeroCases = allDiseases
//       .filter((disease) => counts[disease] === 0)
//       .map((disease) => disease);

//     return { chartData, zeroCases, counts };
//   }, []);

//   // Get most common disease(s)
//   const getMostCommonDiseases = useCallback((counts) => {
//     // Filter out Healthy and diseases with 0 count
//     const diseaseEntries = Object.entries(counts)
//       .filter(([disease, count]) => disease !== "Healthy" && count > 0)
//       .sort((a, b) => b[1] - a[1]);

//     if (diseaseEntries.length === 0) return [];

//     const maxCount = diseaseEntries[0][1];
//     return diseaseEntries
//       .filter(([, count]) => count === maxCount)
//       .map(([disease]) => disease);
//   }, []);

//   // Track when user manually changes date range (skip initial load)
//   useEffect(() => {
//     if (initialLoadRef.current) {
//       initialLoadRef.current = false;
//       return;
//     }
//     setFilterActive(true);
//   }, [dateRange]);

//   useEffect(() => {
//     if (!farmId) return;

//     // Cancel previous request
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     const fetchData = async () => {
//       setLoading(true);
//       // Trigger animation when filters change
//       setAnimationKey((prev) => prev + 1);

//       try {
//         const response = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             signal: controller.signal,
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch scans");
//         }

//         const scansData = await response.json();
//         const allScans = Array.isArray(scansData) ? scansData : [];

//         // Only filter by date range if user has actively selected a range
//         const filteredScans = filterActive
//           ? filterScansByDateRange(allScans, timeFilter, dateRange)
//           : allScans;

//         setRecentScans(filteredScans);
//       } catch (error) {
//         if (error.name !== "AbortError") {
//           console.error("Error fetching data:", error);
//           setRecentScans([]);
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
//   }, [farmId, timeFilter, dateRange, filterScansByDateRange, filterActive]);

//   const FIXED_HEIGHT = "580px";

//   const { chartData, zeroCases, counts } =
//     calculateDiseaseDistribution(recentScans);
//   const totalScans = recentScans.length;
//   const mostCommonDiseases = getMostCommonDiseases(counts);

//   if (loading && !recentScans.length) {
//     return (
//       <div
//         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//         style={{ height: FIXED_HEIGHT }}
//       >
//         <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//           Scan Breakdown{filterActive ? ` (${dateRange})` : ""}
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
//         Scan Breakdown{filterActive ? ` (${dateRange})` : ""}
//       </h2>

//       {recentScans.length === 0 ? (
//         <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
//           <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
//           <p className="text-sm sm:text-base text-gray-500">
//             No scans in selected range
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             {filterActive
//               ? `Scans from ${dateRange.toLowerCase()} will appear here`
//               : "Scans from assigned farmers will appear here"}
//           </p>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Scrollable Container */}
//           <div
//             className="flex-1 overflow-y-auto pr-2 space-y-4"
//             style={{ scrollbarWidth: "thin" }}
//           >
//             {/* Pie Chart Section */}
//             <div className="border-b border-gray-200 pb-2">
//               {chartData.length > 0 ? (
//                 <>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart key={animationKey}>
//                       <Pie
//                         data={chartData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         label={({
//                           name,
//                           percent,
//                           value,
//                           cx,
//                           cy,
//                           midAngle,
//                           innerRadius,
//                           outerRadius,
//                         }) => {
//                           const RADIAN = Math.PI / 180;
//                           const radius =
//                             innerRadius + (outerRadius - innerRadius) * 0.5;
//                           const x = cx + radius * Math.cos(-midAngle * RADIAN);
//                           const y = cy + radius * Math.sin(-midAngle * RADIAN);

//                           return (
//                             <text
//                               x={x}
//                               y={y}
//                               fill="white"
//                               textAnchor="middle"
//                               dominantBaseline="central"
//                               className="text-xs"
//                             >
//                               <tspan
//                                 x={x}
//                                 dy="-0.6em"
//                                 style={{ fontSize: "15px" }}
//                               >
//                                 {name}
//                               </tspan>
//                               <tspan
//                                 x={x}
//                                 dy="1.2em"
//                                 style={{
//                                   fontSize: "15px",
//                                   fontWeight: "bold",
//                                 }}
//                               >{`${(percent * 100).toFixed(0)}%`}</tspan>
//                               <tspan
//                                 x={x}
//                                 dy="1.2em"
//                                 style={{ fontSize: "14px" }}
//                               >{`${value} ${
//                                 value === 1 ? "case" : "cases"
//                               }`}</tspan>
//                             </text>
//                           );
//                         }}
//                         outerRadius={150}
//                         innerRadius={0}
//                         fill="#8884d8"
//                         dataKey="value"
//                         animationBegin={0}
//                         animationDuration={800}
//                         animationEasing="ease-out"
//                       >
//                         {chartData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         formatter={(value, name, props) => [
//                           `${value} cases (${(
//                             (value / totalScans) *
//                             100
//                           ).toFixed(1)}%)`,
//                           props.payload.name,
//                         ]}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>

//                   {zeroCases.length > 0 && (
//                     <p className="text-xs text-black mb-3 mt-3 italic font-medium text-center">
//                       No cases: {zeroCases.join(", ")}
//                     </p>
//                   )}
//                 </>
//               ) : (
//                 <p className="text-xs text-gray-500 text-center py-4 mt-3">
//                   No data to display
//                 </p>
//               )}
//             </div>

//             {/* Disease Statistics List */}
//             {/* Disease Statistics List */}
//             <div className="space-y-3">
//               {/* Most Common Disease */}
//               {mostCommonDiseases.length > 0 && (
//                 <div className="bg-amber-50/50 border-l-4 border-amber-500 rounded-lg p-4">
//                   <div className="flex items-start gap-3">
//                     <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                     <div className="flex-1">
//                       <p className="text-sm font-bold text-amber-800 mb-1">
//                         Most Common Disease
//                       </p>
//                       <p className="text-sm text-amber-700">
//                         {mostCommonDiseases.join(", ")}
//                       </p>
//                       <p className="text-xs text-amber-600 mt-1">
//                         {counts[mostCommonDiseases[0]]}{" "}
//                         {counts[mostCommonDiseases[0]] === 1 ? "case" : "cases"}{" "}
//                         (
//                         {(
//                           (counts[mostCommonDiseases[0]] / totalScans) *
//                           100
//                         ).toFixed(1)}
//                         %)
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* All Diseases List */}
//               {Object.entries(counts).map(([disease, count]) => {
//                 const color = diseaseColors[disease] || "#64748b";

//                 return (
//                   <div key={disease} className="flex items-center gap-2 py-2">
//                     <div
//                       className="w-2 h-2 rounded-sm flex-shrink-0"
//                       style={{ backgroundColor: color }}
//                     />
//                     <div className="flex-1 flex justify-between items-center">
//                       <p className="text-sm text-gray-700">{disease}</p>
//                       <p className="text-sm font-semibold text-gray-900">
//                         {count === 0
//                           ? "No cases"
//                           : `${count} ${count === 1 ? "case" : "cases"}`}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
