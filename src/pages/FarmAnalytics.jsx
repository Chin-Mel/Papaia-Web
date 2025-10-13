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

export default function FarmAnalytics({ farmId, timeFilter, dateRange }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        if (timeFilter === "Daily" && data.dailyStats) {
          processedData = data.dailyStats.map((stat) => ({
            period: stat.day,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions,
          }));
        } else if (timeFilter === "Weekly" && data.weeklyStats) {
          processedData = data.weeklyStats.map((stat) => ({
            period: stat.week,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions,
          }));
        } else if (timeFilter === "Monthly" && data.monthlyStats) {
          processedData = data.monthlyStats.map((stat) => ({
            period: stat.month,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions,
          }));
        } else if (timeFilter === "Yearly" && data.yearlyStats) {
          processedData = data.yearlyStats.map((stat) => ({
            period: stat.year,
            ...stat.predictions,
            totalPredictions: Object.values(stat.predictions).reduce(
              (a, b) => a + b,
              0
            ),
            predictions: stat.predictions,
          }));
        }

        // Apply date range filter if needed
        if (dateRange !== "All Time") {
          processedData = filterByDateRange(processedData, dateRange);
        }

        console.log("✅ Processed chart data:", processedData);
        setChartData(processedData);
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
      // Handle different period formats
      if (period.includes("-")) {
        // Weekly format: "Sep 21 - Sep 27, 2025"
        const parts = period.split("-")[0].trim();
        return new Date(parts + ", " + new Date().getFullYear());
      } else if (period.includes(",")) {
        // Daily or Monthly format with comma
        return new Date(period);
      } else {
        // Yearly format: "2025"
        return new Date(parseInt(period), 0, 1);
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
      Object.keys(item).forEach((key) => {
        if (
          key !== "period" &&
          key !== "totalPredictions" &&
          key !== "predictions"
        ) {
          diseases.add(key);
        }
      });
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
  const healthyScans = chartData.reduce(
    (sum, item) => sum + (item.Healthy || 0),
    0
  );
  const healthScore =
    totalScans > 0 ? ((healthyScans / totalScans) * 100).toFixed(1) : "0";
  const diseaseScans = totalScans - healthyScans;
  const diseaseScore =
    totalScans > 0 ? ((diseaseScans / totalScans) * 100).toFixed(1) : "0";

  const FIXED_HEIGHT = "580px";

  if (loading) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <div className="flex items-center justify-center h-full text-red-500 text-sm">
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
    <div
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
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
      </div>

      <div
        className="grid grid-cols-3 gap-2 sm:gap-4"
        style={{ minHeight: "60px" }}
      >
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
  );
}
