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

  // Process analytics data
  const processAnalyticsData = () => {
    console.log("Processing analytics data:", analyticsData);

    if (!analyticsData) {
      console.log("No analytics data available");
      return [];
    }

    if (analyticsData.error) {
      console.log("Analytics data contains error:", analyticsData.error);
      return [];
    }

    // Get the correct stats key based on time filter
    const statsKey = `${timeFilter.toLowerCase()}Stats`;
    const stats = analyticsData[statsKey];

    console.log(`Looking for ${statsKey}:`, stats);

    if (!stats || !Array.isArray(stats)) {
      console.log("Stats not found or not an array:", stats);
      return [];
    }

    const processedData = stats.map((item, index) => {
      console.log(`Processing item ${index}:`, item);

      const predictions = item.predictions || {};

      // Get the period based on the time filter
      let period = "";
      if (item.day) period = item.day;
      else if (item.week) period = item.week;
      else if (item.month) period = item.month;
      else if (item.year) period = item.year;

      // Create individual disease count entries for the chart
      const result = {
        period,
        Healthy: predictions.Healthy || 0,
        "Ring Spot Virus": predictions["Ring Spot Virus"] || 0,
        Anthracnose: predictions.Anthracnose || 0,
        "Powdery Mildew": predictions["Powdery Mildew"] || 0,
      };

      console.log(`Processed item ${index}:`, result);
      return result;
    });

    console.log("Final processed data:", processedData);
    return processedData;
  };

  const chartData = processAnalyticsData();

  // Fixed color mapping as requested
  const diseaseColors = {
    Healthy: "#22c55e", // Green
    "Ring Spot Virus": "#f97316", // Orange
    Anthracnose: "#ef4444", // Red
    "Powdery Mildew": "#3b82f6", // Blue
  };

  // Enhanced custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload
            .filter((item) => item.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-xs text-gray-600 mb-1"
              >
                <span className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  {item.dataKey}
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
        </div>
      );
    }
    return null;
  };

  const hasData = chartData && chartData.length > 0;

  console.log("Chart data:", chartData);
  console.log("Has data:", hasData);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[450px]">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[450px]">
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
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[450px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Farm Analytics ({timeFilter})
        </h2>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full" style={{ minHeight: "350px" }}>
        {!hasData ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                📊
              </div>
              <p>No scan data available</p>
              <p className="text-xs mt-1">
                Data will appear when farmers make scans
              </p>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%", height: "350px" }}>
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 40, right: 30, left: 60, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -10,
                    style: { textAnchor: "middle" },
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                  label={{
                    value: "Scan Count",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="line"
                  wrapperStyle={{ paddingBottom: "20px" }}
                />

                <Line
                  type="monotone"
                  dataKey="Healthy"
                  stroke={diseaseColors.Healthy}
                  strokeWidth={2}
                  dot={{ r: 4, fill: diseaseColors.Healthy }}
                  name="Healthy"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="Ring Spot Virus"
                  stroke={diseaseColors["Ring Spot Virus"]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: diseaseColors["Ring Spot Virus"] }}
                  name="Ring Spot Virus"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="Anthracnose"
                  stroke={diseaseColors.Anthracnose}
                  strokeWidth={2}
                  dot={{ r: 4, fill: diseaseColors.Anthracnose }}
                  name="Anthracnose"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="Powdery Mildew"
                  stroke={diseaseColors["Powdery Mildew"]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: diseaseColors["Powdery Mildew"] }}
                  name="Powdery Mildew"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
