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

export default function FarmAnalytics({ analyticsData, timeFilter }) {
  const [chartType, setChartType] = useState("line");

  // Create placeholder data based on time filter
  const getPlaceholderData = () => {
    switch (timeFilter) {
      case "Daily":
        return Array.from({ length: 7 }, (_, i) => ({
          period: `Day ${i + 1}`,
          totalPredictions: 0,
          diseaseTypes: 0,
        }));
      case "Weekly":
        return Array.from({ length: 4 }, (_, i) => ({
          period: `Week ${i + 1}`,
          totalPredictions: 0,
          diseaseTypes: 0,
        }));
      case "Monthly":
        return Array.from({ length: 6 }, (_, i) => ({
          period: `Month ${i + 1}`,
          totalPredictions: 0,
          diseaseTypes: 0,
        }));
      case "Yearly":
        return Array.from({ length: 3 }, (_, i) => ({
          period: `${2023 + i}`,
          totalPredictions: 0,
          diseaseTypes: 0,
        }));
      default:
        return [];
    }
  };

  // Process analytics data based on the new API structure
  const processAnalyticsData = () => {
    if (!analyticsData || analyticsData.error) {
      return getPlaceholderData();
    }

    const statsKey = `${timeFilter.toLowerCase()}Stats`;
    const stats = analyticsData[statsKey];

    if (!stats || !Array.isArray(stats)) {
      return getPlaceholderData();
    }

    return stats.map((item) => {
      const predictions = item.predictions || {};
      const totalPredictions = Object.values(predictions).reduce(
        (sum, count) => sum + count,
        0
      );
      const diseaseTypes = Object.keys(predictions).length;

      // Get the period label based on time filter
      let period = "";
      if (item.day) period = item.day;
      else if (item.week) period = item.week;
      else if (item.month) period = item.month;
      else if (item.year) period = item.year;

      return {
        period,
        totalPredictions,
        diseaseTypes,
        predictions, // Keep original predictions for tooltip
      };
    });
  };

  const chartData = processAnalyticsData();

  // Custom tooltip to show disease breakdown
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-blue-600 mb-1">
            Total Predictions: {data.totalPredictions}
          </p>
          <p className="text-green-600 mb-2">
            Disease Types: {data.diseaseTypes}
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

  return (
    <div className="flex-1 flex flex-col">
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

      {/* Chart Container */}
      <div className="flex-1 w-full" style={{ minHeight: "250px" }}>
        {!hasData ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                📊
              </div>
              <p>No prediction data available</p>
              <p className="text-xs mt-1">
                Data will appear when farmers make predictions
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
                <Line
                  type="monotone"
                  dataKey="totalPredictions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Total Predictions"
                />
                <Line
                  type="monotone"
                  dataKey="diseaseTypes"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Disease Types"
                />
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
                <Bar
                  dataKey="totalPredictions"
                  fill="#3b82f6"
                  name="Total Predictions"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="diseaseTypes"
                  fill="#f59e0b"
                  name="Disease Types"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Stats */}
      {hasData && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-lg font-semibold text-blue-600">
              {chartData.reduce((sum, item) => sum + item.totalPredictions, 0)}
            </p>
            <p className="text-xs text-blue-600">Total Predictions</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-lg font-semibold text-amber-600">
              {
                [
                  ...new Set(
                    chartData.flatMap((item) =>
                      Object.keys(item.predictions || {})
                    )
                  ),
                ].length
              }
            </p>
            <p className="text-xs text-amber-600">Unique Diseases</p>
          </div>
        </div>
      )}
    </div>
  );
}
