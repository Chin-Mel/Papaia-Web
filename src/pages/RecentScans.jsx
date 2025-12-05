import { useState, useEffect, useCallback, useRef } from "react";
import { Leaf } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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

export default function RecentScans({ farmId, timeFilter, dateRange }) {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const abortControllerRef = useRef(null);
  const initialLoadRef = useRef(true);

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

  // Track when user manually changes date range (skip initial load)
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    setFilterActive(true);
  }, [dateRange]);

  useEffect(() => {
    if (!farmId) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      const cacheKey = filterActive
        ? `scans-${farmId}-${timeFilter}-${dateRange}`
        : `scans-${farmId}-all`;
      const cached = scanCache.get(cacheKey);

      // Show cached data immediately
      if (cached) {
        setFarmers(cached.farmers);
        setRecentScans(cached.scans);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        // Fetch both in parallel
        const [farmersResponse, scansResponse] = await Promise.all([
          fetch(`https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }),
          fetch(
            `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
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

          // Filter scans from active farmers only
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
              // Sort descending (most recent first)
              return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
            });

          // Only filter by date range if user has actively selected a range
          const filteredScans = filterActive
            ? filterScansByDateRange(activeFarmerScans, timeFilter, dateRange)
            : activeFarmerScans;

          setRecentScans(filteredScans);

          // Cache the results
          scanCache.set(cacheKey, {
            farmers: farmersList,
            scans: filteredScans,
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          if (!cached) {
            setRecentScans([]);
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
  }, [farmId, timeFilter, dateRange, filterScansByDateRange, filterActive]);

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

  const getFarmerName = useCallback(
    (scan) => {
      // Use farmerName from scan API first, then fall back to lookup
      if (scan.farmerName) {
        return scan.farmerName;
      }

      const farmer = farmers.find((f) => f.idNumber === scan.idNumber);
      if (!farmer) return `Farmer ${scan.idNumber}`;

      // Build full name
      let fullName = "";
      if (farmer.firstname) fullName += farmer.firstname;
      if (farmer.middlename) fullName += ` ${farmer.middlename}`;
      if (farmer.lastname) fullName += ` ${farmer.lastname}`;
      if (farmer.suffix) fullName += ` ${farmer.suffix}`;

      return fullName.trim() || farmer.fullName || `Farmer ${scan.idNumber}`;
    },
    [farmers]
  );

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

  // Updated to match FarmAnalytics height
  const FIXED_HEIGHT = "580px";

  const { chartData, zeroCases, counts } =
    calculateDiseaseDistribution(recentScans);
  const totalScans = recentScans.length;

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
    <>
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
            {/* Scrollable Container for Both Pie Chart and Scans */}
            <div
              className="flex-1 overflow-y-auto pr-2 space-y-4"
              style={{ scrollbarWidth: "thin" }}
            >
              {/* Pie Chart Section */}
              <div className="border-b border-gray-200 style={{ paddingTop: 0, paddingBottom: 0 }}">
                {chartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={380}>
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
                            const x =
                              cx + radius * Math.cos(-midAngle * RADIAN);
                            const y =
                              cy + radius * Math.sin(-midAngle * RADIAN);

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
                          outerRadius={170}
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

              {/* Scans List */}
              <div className="space-y-3">
                {recentScans.map((scan, index) => {
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
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 text-center flex-shrink-0">
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
      </div>

      {/* Scan Detail Modal */}
      <ScanDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        scan={selectedScan}
        farmerName={selectedScan ? getFarmerName(selectedScan) : ""}
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

//           // Filter and sort scans - now showing ALL scans
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
//             });

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
//       const [month, day, year] = datePart.split("/");
//       if (!month || !day || !year) return timestamp;

//       const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ];

//       const monthIndex = parseInt(month) - 1;
//       const monthName = monthNames[monthIndex] || month;

//       return `${monthName} ${parseInt(day)}, ${year}`;
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
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Scrollable container */}
//           <div
//             className="flex-1 overflow-y-auto pr-2 space-y-3"
//             style={{ scrollbarWidth: "thin" }}
//           >
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

//           <div className="mt-3 pt-3 border-t border-gray-200 text-center flex-shrink-0">
//             <p className="text-xs text-gray-500">
//               {recentScans.length > 0
//                 ? `Showing ${recentScans.length} ${
//                     recentScans.length === 1 ? "scan" : "scans"
//                   }`
//                 : "No scans from assigned farmers yet"}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
