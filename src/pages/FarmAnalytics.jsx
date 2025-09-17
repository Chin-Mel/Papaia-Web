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

export default function FarmAnalytics({ analyticsData, timeFilter }) {
  const placeholderData = [
    { label: "Day 1", healthy: 0, diseased: 0 },
    { label: "Day 2", healthy: 0, diseased: 0 },
    { label: "Day 3", healthy: 0, diseased: 0 },
    { label: "Day 4", healthy: 0, diseased: 0 },
    { label: "Day 5", healthy: 0, diseased: 0 },
  ];

  const chartData =
    analyticsData && Object.keys(analyticsData).length > 0
      ? analyticsData[`${timeFilter.toLowerCase()}Stats`] || placeholderData
      : placeholderData;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 min-h-[300px] sm:min-h-[350px]">
      <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
        {timeFilter} Farm Condition
      </h3>
      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="healthy"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="diseased"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
