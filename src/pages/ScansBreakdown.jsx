import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

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

  const pieData = useMemo(() => {
    // If no time filter is selected, show all-time data from farm health
    if (!timeFilter || !dateRange) {
      if (!farmHealthData || !farmHealthData.diseaseCounts) return [];

      const totals = farmHealthData.diseaseCounts;
      const totalScans = Object.values(totals).reduce(
        (sum, count) => sum + count,
        0
      );

      if (totalScans === 0) return [];

      const data = Object.entries(totals)
        .map(([name, value]) => ({
          name,
          value,
          percentage: ((value / totalScans) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value);

      return data;
    }

    // If time filter is selected, use analytics data with date range
    if (!analyticsData) return [];

    const statsKey = `${timeFilter.toLowerCase()}Stats`;
    const stats = analyticsData?.[statsKey];

    if (!stats || !Array.isArray(stats)) return [];

    const periodsToShow = getPeriodsToShow(dateRange, timeFilter);
    const relevantStats = stats.slice(-periodsToShow);

    const totals = {};
    relevantStats.forEach((item) => {
      const predictions = item.predictions || {};
      Object.entries(predictions).forEach(([disease, count]) => {
        totals[disease] = (totals[disease] || 0) + count;
      });
    });

    const totalScans = Object.values(totals).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalScans === 0) return [];

    const data = Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalScans) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);

    return data;
  }, [analyticsData, farmHealthData, timeFilter, dateRange, getPeriodsToShow]);

  const mostCommonDisease = useMemo(() => {
    if (pieData.length === 0) return "None";
    return pieData[0].name;
  }, [pieData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-gray-600">Cases: {data.value}</p>
          <p className="text-gray-600">
            Percentage: {data.payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (parseFloat(percentage) < 5) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${percentage}%`}
      </text>
    );
  };

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
      ) : pieData.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-gray-500 text-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              📊
            </div>
            <p className="font-medium">No scan data available</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => <CustomLabel {...props} />}
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={600}
                  animationBegin={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        diseaseColors[entry.name] ||
                        `hsl(${(index * 137.5) % 360}, 70%, 50%)`
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingTop: "10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pieData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          diseaseColors[item.name] ||
                          `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-500">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
