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
  BarChart,
  Bar,
} from "recharts";

export default function FarmAnalytics({ farmId, timeFilter }) {
  const [chartType, setChartType] = useState("line");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch analytics data
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

    const fetchAnalytics = async () => {
      setLoading(true);
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
          if (isMounted) {
            setAnalyticsData(data);
          }
        } else {
          console.error("Analytics API error:", response.status);
          if (isMounted) {
            setAnalyticsData(null);
          }
        }
      } catch (error) {
        console.error("Analytics fetch error:", error);
        if (isMounted) {
          setAnalyticsData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();
    const interval = setInterval(() => {
      if (isMounted) {
        fetchAnalytics();
      }
    }, 30000); // Refresh every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [farmId, timeFilter]);

  // Process analytics data
  const processAnalyticsData = () => {
    if (!analyticsData || analyticsData.error) {
      return [];
    }

    const statsKey = `${timeFilter.toLowerCase()}Stats`;
    const stats = analyticsData[statsKey];

    if (!stats || !Array.isArray(stats)) {
      return [];
    }

    return stats.map((item) => {
      const predictions = item.predictions || {};
      const totalPredictions = Object.values(predictions).reduce(
        (sum, count) => sum + count,
        0
      );

      let period = "";
      if (item.day) period = item.day;
      else if (item.week) period = item.week;
      else if (item.month) period = item.month;
      else if (item.year) period = item.year;

      // Create individual disease count entries for the chart
      const diseaseEntries = {};
      Object.entries(predictions).forEach(([disease, count]) => {
        diseaseEntries[disease] = count;
      });

      return {
        period,
        totalPredictions,
        ...diseaseEntries,
        predictions,
      };
    });
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
    return Array.from(diseases);
  };

  const diseaseTypes = getAllDiseaseTypes();

  // Color mapping for different diseases
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-blue-600 mb-2">
            Total Scans: {data.totalPredictions}
          </p>
          {data.predictions && Object.keys(data.predictions).length > 0 && (
            <div className="border-t pt-2 mt-2">
              <p className="font-medium text-gray-700 mb-1">
                Disease Breakdown:
              </p>
              {Object.entries(data.predictions).map(([disease, count]) => (
                <p key={disease} className="text-xs text-gray-600">
                  {disease}: {count}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const hasData = chartData.some((item) => item.totalPredictions > 0);

  // Calculate total scans for the current time period
  const totalScans = chartData.reduce(
    (sum, item) => sum + item.totalPredictions,
    0
  );

  // Calculate health score (percentage of healthy predictions)
  const healthyScans = chartData.reduce((sum, item) => {
    return sum + (item.predictions?.Healthy || 0);
  }, 0);
  const healthScore =
    totalScans > 0 ? ((healthyScans / totalScans) * 100).toFixed(1) : "0";

  // Calculate disease score (percentage of disease predictions)
  const diseaseScans = totalScans - healthyScans;
  const diseaseScore =
    totalScans > 0 ? ((diseaseScans / totalScans) * 100).toFixed(1) : "0";

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[450px]">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
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

        {/* Chart Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              chartType === "line"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Line Chart
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              chartType === "bar"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Bar Chart
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full" style={{ minHeight: "200px" }}>
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
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {diseaseTypes.map((disease, index) => (
                  <Line
                    key={disease}
                    type="monotone"
                    dataKey={disease}
                    stroke={getDiseaseColor(disease, index)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={disease}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {diseaseTypes.map((disease, index) => (
                  <Bar
                    key={disease}
                    dataKey={disease}
                    fill={getDiseaseColor(disease, index)}
                    name={disease}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-green-600 font-semibold text-lg sm:text-xl">
            {totalScans}
          </p>
          <p className="text-sm sm:text-base text-gray-600">Total Scans</p>
        </div>
        <div className="text-center">
          <p className="text-blue-600 font-semibold text-lg sm:text-xl">
            {healthScore}%
          </p>
          <p className="text-sm sm:text-base text-gray-600">Healthy</p>
        </div>
        <div className="text-center">
          <p className="text-orange-600 font-semibold text-lg sm:text-xl">
            {diseaseScore}%
          </p>
          <p className="text-sm sm:text-base text-gray-600">Diseases</p>
        </div>
      </div>
    </div>
  );
}
