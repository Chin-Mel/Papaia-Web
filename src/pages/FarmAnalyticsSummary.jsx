import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

export default function FarmAnalytics({
  farmId,
  timeFilter = "Daily",
  onTimeFilterChange,
  onDateRangeChange,
  timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"],
}) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("Last 11 days");
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const dateRangeRef = useRef(null);

  // Separate state for farm health data
  const [farmHealthData, setFarmHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Dynamic date range options based on timeFilter
  const dateRangeOptions = useMemo(() => {
    switch (timeFilter) {
      case "Daily":
        return ["Last 7 days", "Last 11 days", "Last 14 days"];
      case "Weekly":
        return ["Last 4 weeks", "Last 9 weeks", "Last 12 weeks"];
      case "Monthly":
        return ["Last 3 months", "Last 6 months", "Last 12 months"];
      case "Yearly":
        return ["Last 3 years", "Last 5 years", "Last 7 years"];
      default:
        return ["Last 11 days"];
    }
  }, [timeFilter]);

  // Reset date range when timeFilter changes to appropriate default
  useEffect(() => {
    let newRange;
    switch (timeFilter) {
      case "Daily":
        newRange = "Last 11 days";
        break;
      case "Weekly":
        newRange = "Last 9 weeks";
        break;
      case "Monthly":
        newRange = "Last 12 months";
        break;
      case "Yearly":
        newRange = "Last 7 years";
        break;
      default:
        newRange = "Last 11 days";
    }
    setDateRange(newRange);
    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    }
  }, [timeFilter, onDateRangeChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target)) {
        setIsDateRangeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch farm health data (independent of date range changes)
  useEffect(() => {
    if (!farmId) return;

    const fetchFarmHealth = async () => {
      setHealthLoading(true);
      try {
        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farm-health/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFarmHealthData(data);
        } else {
          setFarmHealthData(null);
        }
      } catch (error) {
        console.error("Failed to fetch farm health:", error);
        setFarmHealthData(null);
      } finally {
        setHealthLoading(false);
      }
    };

    fetchFarmHealth();
  }, [farmId]); // Only depends on farmId, not dateRange

  // Fetch analytics data with AbortController for cleanup
  useEffect(() => {
    if (!farmId) return;

    const controller = new AbortController();

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpointMap = {
          Daily: "daily-analytics",
          Weekly: "weekly-analytics",
          Monthly: "monthly-analytics",
          Yearly: "yearly-analytics",
        };

        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/${endpointMap[timeFilter]}/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || `HTTP ${response.status} error`);
          setAnalyticsData(null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("Failed to load analytics data");
          setAnalyticsData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    return () => controller.abort();
  }, [farmId, timeFilter]);

  // Helper function to get number of periods to show based on date range
  const getPeriodsToShow = useCallback((range, filter) => {
    switch (filter) {
      case "Daily":
        if (range === "Last 7 days") return 7;
        if (range === "Last 11 days") return 11;
        if (range === "Last 14 days") return 14;
        if (range === "Last 30 days") return 30;
        if (range === "Last 60 days") return 60;
        if (range === "Last 90 days") return 90;
        return 11;

      case "Weekly":
        if (range === "Last 4 weeks") return 4;
        if (range === "Last 9 weeks") return 9;
        if (range === "Last 12 weeks") return 12;
        if (range === "Last 26 weeks") return 26;
        if (range === "Last 52 weeks") return 52;
        return 9;

      case "Monthly":
        if (range === "Last 3 months") return 3;
        if (range === "Last 6 months") return 6;
        if (range === "Last 12 months") return 12;
        if (range === "Last 24 months") return 24;
        if (range === "Last 36 months") return 36;
        return 12;

      case "Yearly":
        if (range === "Last 3 years") return 3;
        if (range === "Last 5 years") return 5;
        if (range === "Last 7 years") return 7;
        if (range === "Last 10 years") return 10;
        if (range === "Last 15 years") return 15;
        return 7;

      default:
        return 11;
    }
  }, []);

  // Memoize default data generation - now based on date range
  const generateDefaultData = useCallback(() => {
    const now = new Date();
    let data = [];
    const periodsToShow = getPeriodsToShow(dateRange, timeFilter);

    switch (timeFilter) {
      case "Daily":
        for (let i = periodsToShow - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          data.push({
            period: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            totalPredictions: 0,
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
            predictions: {},
          });
        }
        break;

      case "Weekly":
        for (let i = periodsToShow - 1; i >= 0; i--) {
          const startDate = new Date(now);
          const dayOfWeek = startDate.getDay();
          const startOfWeek = new Date(startDate);
          startOfWeek.setDate(startDate.getDate() - dayOfWeek - i * 7);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          data.push({
            period: `${startOfWeek.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })} - ${endOfWeek.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}`,
            totalPredictions: 0,
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
            predictions: {},
          });
        }
        break;

      case "Monthly":
        for (let i = periodsToShow - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthName = date.toLocaleDateString("en-US", {
            month: "short",
          });
          const year = date.getFullYear();

          data.push({
            period: `${monthName} ${year}`,
            totalPredictions: 0,
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
            predictions: {},
          });
        }
        break;

      case "Yearly":
        const currentYear = now.getFullYear();
        for (let i = periodsToShow - 1; i >= 0; i--) {
          const year = currentYear - i;
          data.push({
            period: year.toString(),
            totalPredictions: 0,
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
            predictions: {},
          });
        }
        break;
    }

    return data;
  }, [timeFilter, dateRange, getPeriodsToShow]);

  // Memoize processed chart data
  const chartData = useMemo(() => {
    let defaultData = generateDefaultData();

    if (!analyticsData?.error) {
      const statsKey = `${timeFilter.toLowerCase()}Stats`;
      const stats = analyticsData?.[statsKey];

      if (stats && Array.isArray(stats)) {
        stats.forEach((apiItem) => {
          const predictions = apiItem.predictions || {};
          let period =
            apiItem.day || apiItem.week || apiItem.month || apiItem.year;

          const defaultIndex = defaultData.findIndex(
            (item) =>
              item.period === period ||
              item.period.includes(period) ||
              period.includes(item.period)
          );

          if (defaultIndex !== -1) {
            const totalPredictions = Object.values(predictions).reduce(
              (sum, count) => sum + count,
              0
            );

            defaultData[defaultIndex] = {
              ...defaultData[defaultIndex],
              totalPredictions,
              predictions,
              ...predictions,
            };
          }
        });
      }
    }

    return defaultData;
  }, [analyticsData, timeFilter, generateDefaultData]);

  // Memoize disease types
  const diseaseTypes = useMemo(() => {
    const diseases = new Set([
      "Healthy",
      "Ring Spot Virus",
      "Anthracnose",
      "Powdery Mildew",
    ]);

    chartData.forEach((item) => {
      if (item.predictions) {
        Object.keys(item.predictions).forEach((disease) =>
          diseases.add(disease)
        );
      }
    });

    return Array.from(diseases);
  }, [chartData]);

  const diseaseColors = {
    Healthy: "#22c55e",
    "Ring Spot Virus": "#f97316",
    Anthracnose: "#ef4444",
    "Powdery Mildew": "#0046FF",
  };

  const getDiseaseColor = useCallback((disease, index) => {
    return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
  }, []);

  // Memoize CustomTooltip
  const CustomTooltip = useCallback(
    ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
            <p className="font-semibold text-gray-800 mb-2">{label}</p>
            <p className="text-blue-600 mb-2">
              Total Scans: {data.totalPredictions}
            </p>
            {data.predictions && Object.keys(data.predictions).length > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="font-medium text-gray-700 mb-1">
                  Disease Breakdown:
                </p>
                {Object.entries(data.predictions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([disease, count]) => (
                    <div
                      key={disease}
                      className="flex justify-between items-center text-xs text-gray-600 mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getDiseaseColor(disease) }}
                        ></div>
                        {disease}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      }
      return null;
    },
    [getDiseaseColor]
  );

  // Calculate summary stats from farm health API
  const summaryStats = useMemo(() => {
    if (farmHealthData) {
      const totalScans = farmHealthData.totalPredictions || 0;
      const healthyCount = farmHealthData.healthyCount || 0;
      const healthScore = farmHealthData.healthPercentage
        ? parseFloat(farmHealthData.healthPercentage.replace("%", ""))
        : 0;
      const diseaseScore =
        totalScans > 0 ? (100 - healthScore).toFixed(1) : "0";

      return {
        totalScans,
        healthScore: healthScore.toFixed(1),
        diseaseScore,
      };
    }

    // Fallback to 0 if no data
    return { totalScans: 0, healthScore: "0", diseaseScore: "0" };
  }, [farmHealthData]);

  const FIXED_HEIGHT = "580px";

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
      {/* Header with inline filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Farm Analytics ({timeFilter})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Time Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => onTimeFilterChange(filter)}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer ${
                  timeFilter === filter
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Date Range Dropdown */}
          <div className="relative min-w-[150px]" ref={dateRangeRef}>
            <button
              onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
              className="w-full px-3 sm:px-4 py-1.5 border border-gray-300 rounded-lg flex justify-between items-center text-xs sm:text-sm hover:bg-gray-50 bg-white transition-all"
            >
              <span className="truncate">{dateRange}</span>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
            </button>
            {isDateRangeOpen && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {dateRangeOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setDateRange(option);
                      setIsDateRangeOpen(false);
                      if (onDateRangeChange) {
                        onDateRangeChange(option);
                      }
                    }}
                    className={`px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-50 hover:text-green-700 text-xs sm:text-sm transition-colors ${
                      dateRange === option
                        ? "bg-green-50 text-green-700 font-medium"
                        : ""
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-1 text-red-500 text-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
              ⚠️
            </div>
            <p className="font-medium">Error loading analytics</p>
            <p className="text-xs mt-1 text-gray-500">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 w-full mb-4">
            <div style={{ width: "100%", height: "100%" }}>
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    label={{
                      value:
                        timeFilter === "Daily"
                          ? "Days"
                          : timeFilter === "Weekly"
                          ? "Weeks"
                          : timeFilter === "Monthly"
                          ? "Months"
                          : "Years",
                      position: "insideBottom",
                      offset: -50,
                      style: { fontSize: 12, fontWeight: 600 },
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                    label={{
                      value: "Number of Scans",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12, fontWeight: 600 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="rect"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: "10px",
                      paddingBottom: "10px",
                      lineHeight: "14px",
                    }}
                  />
                  {diseaseTypes.map((disease, index) => (
                    <Line
                      key={disease}
                      type="monotone"
                      dataKey={disease}
                      stroke={getDiseaseColor(disease, index)}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name={disease}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="grid grid-cols-3 gap-2 sm:gap-4"
            style={{ minHeight: "60px" }}
          >
            {healthLoading ? (
              <div className="col-span-3 flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-green-600 font-semibold text-base sm:text-xl">
                    {summaryStats.totalScans}
                  </p>
                  <p className="text-xs sm:text-base text-gray-600">
                    Total Scans
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-blue-600 font-semibold text-base sm:text-xl">
                    {summaryStats.healthScore}%
                  </p>
                  <p className="text-xs sm:text-base text-gray-600">Healthy</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-600 font-semibold text-base sm:text-xl">
                    {summaryStats.diseaseScore}%
                  </p>
                  <p className="text-xs sm:text-base text-gray-600">Diseases</p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import { BarChart3, AlertCircle, CheckCircle } from "lucide-react";

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
//   const [commonDiseaseData, setCommonDiseaseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const abortControllerRef = useRef(null);

//   // Map timeFilter and dateRange to API endpoints
//   const getApiEndpoints = (filter, range) => {
//     const endpoints = {
//       Daily: {
//         "Last 7 days": {
//           summary: "seven-days-summary",
//           disease: "seven-days-common-diseases",
//         },
//         "Last 11 days": {
//           summary: "eleven-days-summary",
//           disease: "eleven-days-common-diseases",
//         },
//         "Last 14 days": {
//           summary: "fourteen-days-summary",
//           disease: "fourteen-days-common-diseases",
//         },
//       },
//       Weekly: {
//         "Last 4 weeks": {
//           summary: "four-week-summary",
//           disease: "three-weeks-common-diseases",
//         },
//         "Last 9 weeks": {
//           summary: "nine-week-summary",
//           disease: "nine-weeks-common-diseases",
//         },
//         "Last 12 weeks": {
//           summary: "twelve-week-summary",
//           disease: "twelve-weeks-common-diseases",
//         },
//       },
//       Monthly: {
//         "Last 3 months": {
//           summary: "three-month-summary",
//           disease: "three-month-common-diseases",
//         },
//         "Last 6 months": {
//           summary: "six-month-summary",
//           disease: "six-month-common-diseases",
//         },
//         "Last 12 months": {
//           summary: "twelve-month-summary",
//           disease: "twelve-month-common-diseases",
//         },
//       },
//       Yearly: {
//         "Last 3 years": {
//           summary: "three-year-summary",
//           disease: "three-year-common-diseases",
//         },
//         "Last 5 years": {
//           summary: "five-year-summary",
//           disease: "five-year-common-diseases",
//         },
//         "Last 7 years": {
//           summary: "seven-year-summary",
//           disease: "seven-year-common-diseases",
//         },
//       },
//     };

//     return endpoints[filter]?.[range] || endpoints.Daily["Last 11 days"];
//   };

//   useEffect(() => {
//     const fetchData = async () => {
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
//       const diseaseCacheKey = `disease-${farmId}-${endpoints.disease}`;

//       const cachedSummary = cache.get(summaryCacheKey);
//       const cachedDisease = cache.get(diseaseCacheKey);

//       if (cachedSummary) {
//         setSummaryData(cachedSummary);
//       }
//       if (cachedDisease) {
//         setCommonDiseaseData(cachedDisease);
//       }

//       if (cachedSummary && cachedDisease) {
//         setLoading(false);
//       } else {
//         setLoading(true);
//       }

//       try {
//         // Fetch summary and disease data in parallel
//         const [summaryResponse, diseaseResponse] = await Promise.all([
//           fetch(
//             `https://papaiaapi.onrender.com/api/owner/${endpoints.summary}/${farmId}`,
//             { headers, signal: abortController.signal }
//           ),
//           fetch(
//             `https://papaiaapi.onrender.com/api/owner/${endpoints.disease}/${farmId}`,
//             { headers, signal: abortController.signal }
//           ),
//         ]);

//         const [summaryResult, diseaseResult] = await Promise.all([
//           summaryResponse.ok ? summaryResponse.json() : null,
//           diseaseResponse.ok ? diseaseResponse.json() : null,
//         ]);

//         if (summaryResult) {
//           setSummaryData(summaryResult);
//           cache.set(summaryCacheKey, summaryResult, 30000);
//         }

//         if (diseaseResult) {
//           diseaseResult._fetchedAt = Date.now();
//           setCommonDiseaseData(diseaseResult);
//           cache.set(diseaseCacheKey, diseaseResult, 120000);
//         }
//       } catch (error) {
//         if (error.name === "AbortError") return;

//         if (!cachedSummary) setSummaryData(null);
//         if (!cachedDisease) setCommonDiseaseData(null);
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
//   }, [farmId, timeFilter, dateRange]);

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
//         <BarChart3 className="w-5 h-5 text-green-700" />
//         <h2 className="text-lg sm:text-xl font-bold text-gray-800">
//           Summary ({dateRange})
//         </h2>
//       </div>

//       {/* Summary Content */}
//       <div className="space-y-4">
//         {/* AI-Generated Summary */}
//         {summaryData?.summary && (
//           <div className="border-b border-gray-100 pb-4">
//             <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
//               {cleanText(summaryData.summary)}
//             </p>
//           </div>
//         )}

//         {/* Most Common Disease Section */}
//         {commonDiseaseData && (
//           <div className="pb-4">
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
//       </div>
//     </div>
//   );
// }
