import { useState, useEffect, useCallback, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

export default function ScansBreakdown({ farmId, timeFilter, dateRange }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const [filterActive, setFilterActive] = useState(false);
  const initialLoadRef = useRef(true);

  const diseaseColors = {
    Healthy: "#10b981",
    "Ring Spot Virus": "#ea580c",
    Anthracnose: "#f43f5e",
    "Powdery Mildew": "#3b82f6",
  };

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

  const filterPredictionsByDateRange = useCallback(
    (allPredictions, filter, range) => {
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
    []
  );

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    setFilterActive(true);
  }, [dateRange]);

  useEffect(() => {
    if (!farmId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      setLoading(true);

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

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const allPredictions = Array.isArray(data) ? data : [];

        const filteredPredictions = filterActive
          ? filterPredictionsByDateRange(allPredictions, timeFilter, dateRange)
          : allPredictions;

        setAnalyticsData(filteredPredictions);
      } catch (error) {
        if (error.name !== "AbortError") {
          setAnalyticsData([]);
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
  }, [
    farmId,
    timeFilter,
    dateRange,
    filterPredictionsByDateRange,
    filterActive,
  ]);

  const calculateBreakdown = useCallback(() => {
    if (!analyticsData || analyticsData.length === 0) {
      return {
        chartData: [],
        zeroCases: [
          "Healthy",
          "Ring Spot Virus",
          "Anthracnose",
          "Powdery Mildew",
        ],
        counts: {},
        total: 0,
      };
    }

    const allDiseases = [
      "Healthy",
      "Ring Spot Virus",
      "Anthracnose",
      "Powdery Mildew",
    ];
    const counts = {};

    allDiseases.forEach((disease) => {
      counts[disease] = 0;
    });

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
  }, [analyticsData]);

  const { chartData, zeroCases, counts, total } = calculateBreakdown();

  const mostCommonDisease = Object.entries(counts)
    .filter(([disease]) => disease !== "Healthy")
    .sort(([, a], [, b]) => b - a)[0];

  const FIXED_HEIGHT = "580px";

  if (loading && !analyticsData) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Scans Breakdown{filterActive ? ` (${dateRange})` : ""}
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
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-700" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Scans Breakdown{filterActive ? ` (${dateRange})` : ""}
        </h2>
      </div>

      {total === 0 ? (
        <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
          <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
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
          <div
            className="flex-1 overflow-y-auto pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="mb-4">
              {chartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={280}>
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
                                style={{ fontSize: "14px" }}
                              >
                                {name}
                              </tspan>
                              <tspan
                                x={x}
                                dy="1.2em"
                                style={{ fontSize: "15px", fontWeight: "bold" }}
                              >{`${(percent * 100).toFixed(0)}%`}</tspan>
                              <tspan
                                x={x}
                                dy="1.2em"
                                style={{ fontSize: "13px" }}
                              >{`${value} ${
                                value === 1 ? "case" : "cases"
                              }`}</tspan>
                            </text>
                          );
                        }}
                        outerRadius={130}
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
                          `${value} cases (${((value / total) * 100).toFixed(
                            1
                          )}%)`,
                          props.payload.name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {zeroCases.length > 0 && (
                    <p className="text-xs text-black mb-3 italic font-medium text-center">
                      No cases: {zeroCases.join(", ")}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  No data to display
                </p>
              )}
            </div>

            <div className="space-y-3 mt-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Disease Distribution
                </p>
                {Object.entries(counts).map(([disease, count]) => (
                  <div
                    key={disease}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: diseaseColors[disease] }}
                      ></div>
                      <span className="text-xs text-gray-700">{disease}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">
                      {count} (
                      {total > 0 ? ((count / total) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                ))}
              </div>

              {mostCommonDisease && mostCommonDisease[1] > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-900 mb-1">
                    Most Common Disease
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-800">
                      {mostCommonDisease[0]}
                    </span>
                    <span className="text-xs font-semibold text-amber-700">
                      {mostCommonDisease[1]} cases (
                      {((mostCommonDisease[1] / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 text-center flex-shrink-0">
            <p className="text-xs text-gray-500">
              {total > 0
                ? filterActive
                  ? `Showing ${total} ${
                      total === 1 ? "scan" : "scans"
                    } from ${dateRange.toLowerCase()}`
                  : `Showing all ${total} ${total === 1 ? "scan" : "scans"}`
                : "No scans in selected range"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
