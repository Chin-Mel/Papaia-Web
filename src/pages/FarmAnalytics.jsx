import { useState, useEffect } from "react";
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

export default function FarmAnalytics({
  farmId,
  timeFilter,
  dateRange,
  onTimeFilterChange,
  onDateRangeChange,
}) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"];
  const dateRangeOptions = [
    "All Time",
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "Last 3 Months",
    "Last 6 Months",
    "This Year",
  ];

  useEffect(() => {
    if (!farmId) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        let endpoint = "";

        // Select endpoint based on time filter
        switch (timeFilter) {
          case "Daily":
            endpoint = `https://papaiaapi.onrender.com/api/owner/daily-analytics/${farmId}`;
            break;
          case "Weekly":
            endpoint = `https://papaiaapi.onrender.com/api/owner/weekly-analytics/${farmId}`;
            break;
          case "Monthly":
            endpoint = `https://papaiaapi.onrender.com/api/owner/monthly-analytics/${farmId}`;
            break;
          case "Yearly":
            endpoint = `https://papaiaapi.onrender.com/api/owner/yearly-analytics/${farmId}`;
            break;
          default:
            endpoint = `https://papaiaapi.onrender.com/api/owner/daily-analytics/${farmId}`;
        }

        console.log("📊 Fetching analytics from:", endpoint);

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        console.log("📥 Analytics data received:", data);

        // Process data based on time filter
        let processedData = [];

        if (
          timeFilter === "Daily" &&
          data.dailyStats &&
          Array.isArray(data.dailyStats)
        ) {
          processedData = data.dailyStats.map((stat) => ({
            period: stat.day,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions || {}).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions || {},
          }));
        } else if (
          timeFilter === "Weekly" &&
          data.weeklyStats &&
          Array.isArray(data.weeklyStats)
        ) {
          processedData = data.weeklyStats.map((stat) => ({
            period: stat.week,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions || {}).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions || {},
          }));
        } else if (
          timeFilter === "Monthly" &&
          data.monthlyStats &&
          Array.isArray(data.monthlyStats)
        ) {
          processedData = data.monthlyStats.map((stat) => ({
            period: stat.month,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions || {}).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions || {},
          }));
        } else if (
          timeFilter === "Yearly" &&
          data.yearlyStats &&
          Array.isArray(data.yearlyStats)
        ) {
          processedData = data.yearlyStats.map((stat) => ({
            period: stat.year,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions || {}).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions || {},
          }));
        }

        // Generate default periods and merge with real data
        const defaultData = generateDefaultData();
        const mergedData = mergeDataWithDefaults(defaultData, processedData);

        // Apply date range filter if needed
        let finalData = mergedData;
        if (dateRange !== "All Time") {
          finalData = filterByDateRange(mergedData, dateRange);
        }

        console.log("✅ Final chart data:", finalData);
        setChartData(finalData);
      } catch (err) {
        console.error("❌ Analytics fetch error:", err);
        setError(err.message);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [farmId, timeFilter, dateRange]);

  // Generate default time periods
  const generateDefaultData = () => {
    const now = new Date();
    let data = [];

    switch (timeFilter) {
      case "Daily":
        for (let i = 10; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          data.push({
            period: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            totalPredictions: 0,
            predictions: {},
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
          });
        }
        break;

      case "Weekly":
        for (let i = 8; i >= 0; i--) {
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
            predictions: {},
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
          });
        }
        break;

      case "Monthly":
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        months.forEach((month) => {
          data.push({
            period: `${month} ${now.getFullYear()}`,
            totalPredictions: 0,
            predictions: {},
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
          });
        });
        break;

      case "Yearly":
        const currentYear = now.getFullYear();
        for (let year = currentYear - 6; year <= currentYear; year++) {
          data.push({
            period: year.toString(),
            totalPredictions: 0,
            predictions: {},
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
          });
        }
        break;
    }

    return data;
  };

  // Merge API data with default periods
  const mergeDataWithDefaults = (defaultData, apiData) => {
    const merged = [...defaultData];

    apiData.forEach((apiItem) => {
      const matchingIndex = merged.findIndex(
        (item) => item.period === apiItem.period
      );

      if (matchingIndex !== -1) {
        merged[matchingIndex] = {
          ...merged[matchingIndex],
          ...apiItem,
        };
      }
    });

    return merged;
  };

  const filterByDateRange = (data, range) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return data.filter((item) => {
      const itemDate = parsePeriodDate(item.period);

      switch (range) {
        case "Today":
          return itemDate >= today;
        case "Last 7 Days":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case "Last 30 Days":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        case "Last 3 Months":
          const threeMonthsAgo = new Date(
            today.getTime() - 90 * 24 * 60 * 60 * 1000
          );
          return itemDate >= threeMonthsAgo;
        case "Last 6 Months":
          const sixMonthsAgo = new Date(
            today.getTime() - 180 * 24 * 60 * 60 * 1000
          );
          return itemDate >= sixMonthsAgo;
        case "This Year":
          return itemDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const parsePeriodDate = (period) => {
    try {
      const now = new Date();

      // Handle different period formats
      if (period.includes("-")) {
        // Weekly format: "Sep 21 - Sep 27, 2025" or "Sep 21 - Sep 27"
        const parts = period.split("-")[0].trim();
        const yearMatch = period.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : now.getFullYear();
        return new Date(`${parts}, ${year}`);
      } else if (period.includes(",")) {
        // Daily or Monthly format with comma: "Sep 21, 2025"
        return new Date(period);
      } else if (period.match(/^[A-Za-z]{3}\s\d{4}$/)) {
        // Monthly format without comma: "Sep 2025"
        return new Date(period + " 1");
      } else if (period.match(/^\d{4}$/)) {
        // Yearly format: "2025"
        return new Date(parseInt(period), 0, 1);
      } else {
        // Fallback for other formats
        return new Date(period + ", " + now.getFullYear());
      }
    } catch {
      return new Date();
    }
  };

  const diseaseColors = {
    Healthy: "#22c55e",
    "Ring Spot Virus": "#ef4444",
    Anthracnose: "#f97316",
    "Powdery Mildew": "#0046FF",
  };

  const getDiseaseColor = (disease, index) => {
    return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
  };

  const getAllDiseaseTypes = () => {
    const diseases = new Set();
    chartData.forEach((item) => {
      if (item.predictions) {
        Object.keys(item.predictions).forEach((disease) =>
          diseases.add(disease)
        );
      }
    });

    // Ensure default diseases are included
    const defaultDiseases = [
      "Healthy",
      "Ring Spot Virus",
      "Anthracnose",
      "Powdery Mildew",
    ];
    defaultDiseases.forEach((disease) => diseases.add(disease));

    return Array.from(diseases);
  };

  const diseaseTypes = getAllDiseaseTypes();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-blue-600 mb-2">
            Total Scans: {data.totalPredictions || 0}
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
  };

  const totalScans = chartData.reduce(
    (sum, item) => sum + (item.totalPredictions || 0),
    0
  );

  const healthyScans = chartData.reduce((sum, item) => {
    return sum + (item.predictions?.Healthy || item.Healthy || 0);
  }, 0);

  const healthScore =
    totalScans > 0 ? ((healthyScans / totalScans) * 100).toFixed(1) : "0";

  const diseaseScans = totalScans - healthyScans;
  const diseaseScore =
    totalScans > 0 ? ((diseaseScans / totalScans) * 100).toFixed(1) : "0";

  const FIXED_HEIGHT = "580px";

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header with filters */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Farm Analytics ({timeFilter})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
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
              <DateRangeDropdown
                value={dateRange}
                onChange={onDateRangeChange}
                options={dateRangeOptions}
              />
            </div>
          </div>
        </div>

        {/* Loading state */}
        <div
          className="flex justify-center items-center"
          style={{ height: FIXED_HEIGHT }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header with filters */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Farm Analytics ({timeFilter})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
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
              <DateRangeDropdown
                value={dateRange}
                onChange={onDateRangeChange}
                options={dateRangeOptions}
              />
            </div>
          </div>
        </div>

        {/* Error state */}
        <div
          className="flex items-center justify-center text-red-500 text-sm"
          style={{ height: FIXED_HEIGHT }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
              ⚠️
            </div>
            <p className="font-medium">Error loading analytics</p>
            <p className="text-xs mt-1 text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header with filters */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Farm Analytics ({timeFilter})
          </h2>
          <div className="flex flex-wrap items-center gap-2">
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
            <DateRangeDropdown
              value={dateRange}
              onChange={onDateRangeChange}
              options={dateRangeOptions}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div style={{ width: "100%", height: "450px" }}>
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
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
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

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
          <div className="text-center">
            <p className="text-green-600 font-semibold text-base sm:text-xl">
              {totalScans}
            </p>
            <p className="text-xs sm:text-base text-gray-600">Total Scans</p>
          </div>
          <div className="text-center">
            <p className="text-blue-600 font-semibold text-base sm:text-xl">
              {healthScore}%
            </p>
            <p className="text-xs sm:text-base text-gray-600">Healthy</p>
          </div>
          <div className="text-center">
            <p className="text-orange-600 font-semibold text-base sm:text-xl">
              {diseaseScore}%
            </p>
            <p className="text-xs sm:text-base text-gray-600">Diseases</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Date Range Dropdown Component
function DateRangeDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer flex items-center gap-1"
      >
        {value}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors ${
                  value === option
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
