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
  const pollIntervalRef = useRef(null);
  const analyticsHashRef = useRef(null);
  const healthHashRef = useRef(null);
  const initialLoadRef = useRef(true);

  const diseaseColors = {
    Healthy: "#22c55e",
    "Ring Spot Virus": "#f97316",
    Anthracnose: "#ef4444",
    "Powdery Mildew": "#0046FF",
  };

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
        if (!silent && initialLoadRef.current) {
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
        if (!silent && initialLoadRef.current) {
          setLoading(false);
          initialLoadRef.current = false;
        }
      }
    },
    [farmId, timeFilter]
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
    if (farmId && timeFilter) {
      fetchAnalytics(false);
    }
  }, [farmId, timeFilter, fetchAnalytics]);

  // Polling for updates
  useEffect(() => {
    const checkForUpdates = async () => {
      if (!document.hidden && farmId) {
        await fetchFarmHealth(true);
        if (timeFilter) {
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
  }, [farmId, timeFilter, fetchFarmHealth, fetchAnalytics]);

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
      let totals = {};

      // If no time filter is selected, show all-time data from farm health
      if (!timeFilter || !dateRange) {
        if (!farmHealthData || !farmHealthData.diseaseCounts) {
          return {
            chartData: [],
            totalScans: 0,
            zeroCases: [],
            mostCommonDisease: "None",
          };
        }
        totals = farmHealthData.diseaseCounts;
      } else {
        // If time filter is selected, use analytics data with date range
        if (!analyticsData) {
          return {
            chartData: [],
            totalScans: 0,
            zeroCases: [],
            mostCommonDisease: "None",
          };
        }

        const statsKey = `${timeFilter.toLowerCase()}Stats`;
        const stats = analyticsData?.[statsKey];

        if (!stats || !Array.isArray(stats)) {
          return {
            chartData: [],
            totalScans: 0,
            zeroCases: [],
            mostCommonDisease: "None",
          };
        }

        const periodsToShow = getPeriodsToShow(dateRange, timeFilter);
        const relevantStats = stats.slice(-periodsToShow);

        relevantStats.forEach((item) => {
          const predictions = item.predictions || {};
          Object.entries(predictions).forEach(([disease, count]) => {
            totals[disease] = (totals[disease] || 0) + count;
          });
        });
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
            color:
              diseaseColors[name] ||
              `hsl(${(withCases.length * 137.5) % 360}, 70%, 50%)`,
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
      getPeriodsToShow,
      diseaseColors,
    ]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 h-[580px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Scan Breakdown
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

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      ) : (
        <div className="border-b border-gray-200 pb-4 flex-1 flex flex-col">
          {chartData.length > 0 ? (
            <>
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
            </>
          ) : (
            <p className="text-xs text-gray-500 text-center py-4 mt-3">
              No data to display
            </p>
          )}
        </div>
      )}
    </div>
  );
}
