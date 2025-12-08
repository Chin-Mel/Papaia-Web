import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

export default function ScansBreakdown({ farmId, timeFilter, dateRange }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [farmHealthData, setFarmHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const pollIntervalRef = useRef(null);
  const analyticsHashRef = useRef(null);
  const healthHashRef = useRef(null);
  const initialLoadRef = useRef(true);

  const diseaseColors = {
    Healthy: "#10b981",
    "Ring Spot Virus": "#ea580c",
    Anthracnose: "#f43f5e",
    "Powdery Mildew": "#3b82f6",
  };

  // Track when user manually changes date range (skip initial load)
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    setFilterActive(true);
  }, [dateRange]);

  // Fetch farm health data (all-time data)
  const fetchFarmHealth = useCallback(
    async (silent = false) => {
      if (!farmId) return;

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
          const newHash = generateHash(data);

          if (silent && healthHashRef.current === newHash) {
            return;
          }

          healthHashRef.current = newHash;
          setFarmHealthData(data);
        }
      } catch (error) {
        if (!silent) {
          console.error("Failed to fetch farm health:", error);
        }
      }
    },
    [farmId]
  );

  // Fetch analytics data (filtered data)
  const fetchAnalytics = useCallback(
    async (silent = false) => {
      if (!farmId || !timeFilter) return;

      try {
        if (!silent && !analyticsData) {
          setLoading(true);
        }

        const endpointMap = {
          Daily: "daily-analytics",
          Weekly: "weekly-analytics",
          Monthly: "monthly-analytics",
          Yearly: "yearly-analytics",
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/${endpointMap[timeFilter]}/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const statsKey = `${timeFilter.toLowerCase()}Stats`;
          const stats = data?.[statsKey];
          const newHash = generateHash(stats);

          if (silent && analyticsHashRef.current === newHash) {
            return;
          }

          analyticsHashRef.current = newHash;
          setAnalyticsData(data);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !silent) {
          console.error("Failed to fetch analytics:", error);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [farmId, timeFilter, analyticsData]
  );

  // Initial load - fetch farm health (all-time data)
  useEffect(() => {
    if (farmId) {
      setLoading(true);
      fetchFarmHealth(false).finally(() => setLoading(false));
    }
  }, [farmId, fetchFarmHealth]);

  // Fetch analytics when filter is applied
  useEffect(() => {
    if (farmId && filterActive && timeFilter) {
      fetchAnalytics(false);
    }
  }, [farmId, timeFilter, filterActive, fetchAnalytics]);

  // Polling for updates every 15 seconds
  useEffect(() => {
    const checkForUpdates = async () => {
      if (!document.hidden && farmId) {
        await fetchFarmHealth(true);
        if (filterActive && timeFilter) {
          await fetchAnalytics(true);
        }
      }
    };

    pollIntervalRef.current = setInterval(checkForUpdates, 15000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [farmId, timeFilter, filterActive, fetchFarmHealth, fetchAnalytics]);

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

  const { chartData, totalScans, zeroCases, mostCommonDisease } =
    useMemo(() => {
      const allDiseases = [
        "Healthy",
        "Ring Spot Virus",
        "Anthracnose",
        "Powdery Mildew",
      ];
      let totals = {};

      // Initialize all diseases with 0
      allDiseases.forEach((disease) => {
        totals[disease] = 0;
      });

      // If filter is not active, show all-time data from farm health
      if (!filterActive || !timeFilter || !dateRange) {
        if (farmHealthData && farmHealthData.diseaseCounts) {
          totals = { ...totals, ...farmHealthData.diseaseCounts };
        }
      } else {
        // If filter is active, use analytics data with date range
        if (analyticsData) {
          const statsKey = `${timeFilter.toLowerCase()}Stats`;
          const stats = analyticsData?.[statsKey];

          if (stats && Array.isArray(stats)) {
            const periodsToShow = getPeriodsToShow(dateRange, timeFilter);
            const relevantStats = stats.slice(-periodsToShow);

            relevantStats.forEach((item) => {
              const predictions = item.predictions || {};
              Object.entries(predictions).forEach(([disease, count]) => {
                if (totals.hasOwnProperty(disease)) {
                  totals[disease] += count;
                }
              });
            });
          }
        }
      }

      const total = Object.values(totals).reduce(
        (sum, count) => sum + count,
        0
      );

      if (total === 0) {
        return {
          chartData: [],
          totalScans: 0,
          zeroCases: [],
          mostCommonDisease: "None",
        };
      }

      // Separate diseases with cases and without cases
      const withCases = [];
      const noCases = [];

      Object.entries(totals).forEach(([name, value]) => {
        if (value > 0) {
          withCases.push({
            name,
            value,
            color: diseaseColors[name],
          });
        } else {
          noCases.push(name);
        }
      });

      // Sort by value descending
      withCases.sort((a, b) => b.value - a.value);

      const topDisease = withCases.length > 0 ? withCases[0].name : "None";

      return {
        chartData: withCases,
        totalScans: total,
        zeroCases: noCases,
        mostCommonDisease: topDisease,
      };
    }, [
      analyticsData,
      farmHealthData,
      timeFilter,
      dateRange,
      filterActive,
      getPeriodsToShow,
      diseaseColors,
    ]);

  const FIXED_HEIGHT = "580px";

  if (loading && chartData.length === 0) {
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Scan Breakdown{filterActive ? ` (${dateRange})` : ""}
        </h2>
        {mostCommonDisease !== "None" && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Most Common</p>
            <p className="text-sm font-semibold text-gray-800">
              {mostCommonDisease}
            </p>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            📊
          </div>
          <p className="text-sm sm:text-base text-gray-500">
            No scan data available
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {filterActive
              ? `Data from ${dateRange.toLowerCase()} will appear here`
              : "Scan data will appear here"}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="border-b border-gray-200 pb-4">
              <ResponsiveContainer width="100%" height={330}>
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
                          <tspan x={x} dy="-0.6em" style={{ fontSize: "15px" }}>
                            {name}
                          </tspan>
                          <tspan
                            x={x}
                            dy="1.2em"
                            style={{
                              fontSize: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </tspan>
                          <tspan x={x} dy="1.2em" style={{ fontSize: "14px" }}>
                            {`${value} ${value === 1 ? "case" : "cases"}`}
                          </tspan>
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
                      `${value} cases (${((value / totalScans) * 100).toFixed(
                        1
                      )}%)`,
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
            </div>

            {/* Disease List */}
            <div className="mt-4 space-y-2">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.value} {item.value === 1 ? "case" : "cases"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((item.value / totalScans) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 text-center flex-shrink-0">
            <p className="text-xs text-gray-500">
              {totalScans > 0
                ? filterActive
                  ? `Showing ${totalScans} ${
                      totalScans === 1 ? "scan" : "scans"
                    } from ${dateRange.toLowerCase()}`
                  : `Showing all ${totalScans} ${
                      totalScans === 1 ? "scan" : "scans"
                    }`
                : "No scans available"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
