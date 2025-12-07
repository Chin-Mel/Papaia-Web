import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";

const API_BASE = "https://papaiaapi.onrender.com/api/owner";

export default function ScansBreakdown({ farmId, timeFilter, dateRange }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const lastHashRef = useRef(null);

  const diseaseColors = {
    Healthy: "#10b981",
    "Ring Spot Virus": "#ea580c",
    Anthracnose: "#f43f5e",
    "Powdery Mildew": "#3b82f6",
  };

  // Hash function to detect data changes
  const hashData = useCallback((data) => {
    if (!data) return null;
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
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

  const filterPredictionsByDateRange = useCallback(
    (allPredictions, filter, range) => {
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

      return allPredictions.filter((pred) => {
        try {
          const [datePart, timePart, period] = pred.timestamp.split(/\s+/);
          const [month, day, year] = datePart.split("/");
          const [hours, minutes] = timePart.split(":");
          let hour24 = parseInt(hours);
          if (period === "PM" && hour24 !== 12) hour24 += 12;
          if (period === "AM" && hour24 === 12) hour24 = 0;
          const predDate = new Date(year, month - 1, day, hour24, minutes);
          return predDate >= startDate && predDate <= now;
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
        if (!silent && !analyticsData) {
          setLoading(true);
        }

        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${API_BASE}/identification-history/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const newHash = hashData(data);

        // Only update if data changed
        if (newHash !== lastHashRef.current) {
          lastHashRef.current = newHash;
          const allPredictions = Array.isArray(data) ? data : [];
          const filteredPredictions = filterPredictionsByDateRange(
            allPredictions,
            timeFilter,
            dateRange
          );
          setAnalyticsData(filteredPredictions);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Scans breakdown fetch error:", error);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [
      farmId,
      timeFilter,
      dateRange,
      filterPredictionsByDateRange,
      analyticsData,
      hashData,
    ]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [farmId, timeFilter, dateRange]);

  // Poll for changes silently
  useEffect(() => {
    if (!farmId) return;

    const checkForUpdates = async () => {
      if (document.hidden) return;
      await fetchData(true);
    };

    pollIntervalRef.current = setInterval(checkForUpdates, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [farmId, timeFilter, dateRange, fetchData]);

  const breakdown = useMemo(() => {
    if (!analyticsData || analyticsData.length === 0) {
      return {
        chartData: [],
        zeroCases: [
          "Healthy",
          "Ring Spot Virus",
          "Anthracnose",
          "Powdery Mildew",
        ],
        counts: {
          Healthy: 0,
          "Ring Spot Virus": 0,
          Anthracnose: 0,
          "Powdery Mildew": 0,
        },
        total: 0,
      };
    }

    const allDiseases = [
      "Healthy",
      "Ring Spot Virus",
      "Anthracnose",
      "Powdery Mildew",
    ];
    const counts = {
      Healthy: 0,
      "Ring Spot Virus": 0,
      Anthracnose: 0,
      "Powdery Mildew": 0,
    };

    analyticsData.forEach((pred) => {
      if (counts.hasOwnProperty(pred.prediction)) {
        counts[pred.prediction]++;
      }
    });

    const chartData = allDiseases
      .filter((disease) => counts[disease] > 0)
      .map((disease) => ({
        name: disease,
        value: counts[disease],
        color: diseaseColors[disease],
      }));

    const zeroCases = allDiseases.filter((disease) => counts[disease] === 0);
    const total = analyticsData.length;

    return { chartData, zeroCases, counts, total };
  }, [analyticsData, diseaseColors]);

  const mostCommonDisease = useMemo(() => {
    return Object.entries(breakdown.counts)
      .filter(([disease]) => disease !== "Healthy")
      .sort(([, a], [, b]) => b - a)[0];
  }, [breakdown.counts]);

  // Custom label renderer for pie chart
  const renderCustomLabel = useCallback(
    ({ name, percent, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontWeight: 600, fontSize: "11px" }}
        >
          <tspan x={x} dy="-0.8em">
            {name}
          </tspan>
          <tspan
            x={x}
            dy="1.3em"
            style={{ fontSize: "15px", fontWeight: "bold" }}
          >
            {`${(percent * 100).toFixed(0)}%`}
          </tspan>
          <tspan x={x} dy="1.3em" style={{ fontSize: "11px" }}>
            {`${value} ${value === 1 ? "case" : "cases"}`}
          </tspan>
        </text>
      );
    },
    []
  );

  const FIXED_HEIGHT = "580px";

  if (loading && !analyticsData) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Scans Breakdown ({dateRange})
        </h2>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-700" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Scans Breakdown ({dateRange})
        </h2>
      </div>

      {breakdown.total === 0 ? (
        <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
          <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
          <p className="text-sm sm:text-base text-gray-500">No scans yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Scans from {dateRange.toLowerCase()} will appear here
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {mostCommonDisease && mostCommonDisease[1] > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-amber-900 mb-1">
                Most Common Disease
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-800">
                  {mostCommonDisease[0]}
                </span>
                <span className="text-xs font-semibold text-amber-700">
                  {mostCommonDisease[1]} cases (
                  {((mostCommonDisease[1] / breakdown.total) * 100).toFixed(1)}
                  %)
                </span>
              </div>
            </div>
          )}

          <div className="mb-3">
            {breakdown.chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={breakdown.chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={110}
                      innerRadius={0}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {breakdown.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} cases (${(
                          (value / breakdown.total) *
                          100
                        ).toFixed(1)}%)`,
                        props.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {breakdown.zeroCases.length > 0 && (
                  <p className="text-xs text-gray-600 italic font-medium text-center mt-2">
                    No cases: {breakdown.zeroCases.join(", ")}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">
                No data to display
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Disease Distribution
            </p>
            {Object.entries(breakdown.counts).map(([disease, count]) => (
              <div
                key={disease}
                className="flex items-center justify-between mb-1.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: diseaseColors[disease] }}
                  />
                  <span className="text-xs text-gray-700">{disease}</span>
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {count} (
                  {breakdown.total > 0
                    ? ((count / breakdown.total) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
