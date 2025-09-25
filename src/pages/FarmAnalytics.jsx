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

export default function FarmAnalytics({ farmId, timeFilter }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [farmCreatedYear, setFarmCreatedYear] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

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
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`${timeFilter} Analytics Response:`, data);
          if (isMounted) {
            setAnalyticsData(data);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Analytics API error:", response.status, errorData);
          if (isMounted) {
            setError(errorData.error || `HTTP ${response.status} error`);
            setAnalyticsData(null);
          }
        }
      } catch (error) {
        console.error("Analytics fetch error:", error);
        if (isMounted) {
          setError("Failed to load analytics data");
          setAnalyticsData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [farmId, timeFilter]);

  // Generate default time periods
  const generateDefaultData = () => {
    const now = new Date();
    let data = [];

    switch (timeFilter) {
      case "Daily":
        // Generate last 11 days
        for (let i = 10; i >= 0; i--) {
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
        for (let i = 8; i >= 0; i--) {
          const startDate = new Date(now);
          const dayOfWeek = startDate.getDay();
          const startOfWeek = new Date(startDate);
          startOfWeek.setDate(startDate.getDate() - dayOfWeek - i * 7);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          const weekLabel = `${startOfWeek.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${endOfWeek.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`;

          data.push({
            period: weekLabel,
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
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
            predictions: {},
          });
        });
        break;

      case "Yearly":
        const currentYear = now.getFullYear();
        const startYear = farmCreatedYear || currentYear - 6;
        for (let year = startYear; year <= startYear + 6; year++) {
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
  };

  const processAnalyticsData = () => {
    console.log("Processing analytics data:", analyticsData);

    let defaultData = generateDefaultData();

    if (!analyticsData) {
      console.log("No analytics data available, returning default data");
      return defaultData;
    }

    if (analyticsData.error) {
      console.log("Analytics data contains error:", analyticsData.error);
      return defaultData;
    }

    const statsKey = `${timeFilter.toLowerCase()}Stats`;
    const stats = analyticsData[statsKey];

    console.log(`Looking for ${statsKey}:`, stats);

    if (!stats || !Array.isArray(stats)) {
      console.log("Stats not found or not an array:", stats);
      return defaultData;
    }

    stats.forEach((apiItem) => {
      const predictions = apiItem.predictions || {};

      let period = "";
      if (apiItem.day) period = apiItem.day;
      else if (apiItem.week) period = apiItem.week;
      else if (apiItem.month) period = apiItem.month;
      else if (apiItem.year) period = apiItem.year;

      // Find matching period in default data
      const defaultIndex = defaultData.findIndex(
        (item) =>
          item.period === period ||
          item.period.includes(period) ||
          period.includes(item.period)
      );

      if (defaultIndex !== -1) {
        // Calculate total predictions
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

    console.log("Final processed data:", defaultData);
    return defaultData;
  };

  const chartData = processAnalyticsData();

  // Get all unique disease types from the data
  const getAllDiseaseTypes = () => {
    const diseases = new Set();
    chartData.forEach((item) => {
      if (item.predictions) {
        Object.keys(item.predictions).forEach((disease) =>
          diseases.add(disease)
        );
      }
    });

    // Always include these disease types for consistency
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

  const diseaseColors = {
    Healthy: "#22c55e",
    "Ring Spot Virus": "#ef4444",
    Anthracnose: "#f97316",
    "Powdery Mildew": "#eab308",
  };

  // Get color for disease type
  const getDiseaseColor = (disease, index) => {
    return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
  };

  // Enhanced custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
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
  };

  const hasData =
    chartData &&
    chartData.length > 0 &&
    chartData.some((item) => item.totalPredictions > 0);

  console.log("Chart data:", chartData);
  console.log("Has data:", hasData);
  console.log("Disease types:", diseaseTypes);

  const totalScans = chartData.reduce(
    (sum, item) => sum + item.totalPredictions,
    0
  );

  const healthyScans = chartData.reduce((sum, item) => {
    return sum + (item.predictions?.Healthy || 0);
  }, 0);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Farm Analytics ({timeFilter})
          </h2>
        </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Farm Analytics ({timeFilter})
        </h2>
      </div>

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

      {/* Fixed height summary stats - Always side by side */}
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
