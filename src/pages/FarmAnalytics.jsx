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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch analytics data based on timeFilter
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Map timeFilter to the correct endpoint
        const endpointMap = {
          Daily: "daily-analytics",
          Weekly: "weekly-analytics",
          Monthly: "monthly-analytics",
          Yearly: "yearly-analytics",
        };

        const endpoint = endpointMap[timeFilter];
        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/${endpoint}/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Analytics data:", data);

          if (isMounted) {
            const processedData = processAnalyticsData(data, timeFilter);
            setChartData(processedData);
          }
        } else {
          console.error("Failed to fetch analytics");
          if (isMounted) {
            setError("Failed to load analytics data");
            setChartData(generateDefaultData(timeFilter));
          }
        }
      } catch (error) {
        console.error("Analytics fetch error:", error);
        if (isMounted) {
          setError("Failed to load analytics data");
          setChartData(generateDefaultData(timeFilter));
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

  // Process API response into chart format
  const processAnalyticsData = (data, filter) => {
    const defaultData = generateDefaultData(filter);

    // Get the stats array based on the filter
    let statsArray = [];
    let periodKey = "";

    switch (filter) {
      case "Daily":
        statsArray = data.dailyStats || [];
        periodKey = "day";
        break;
      case "Weekly":
        statsArray = data.weeklyStats || [];
        periodKey = "week";
        break;
      case "Monthly":
        statsArray = data.monthlyStats || [];
        periodKey = "month";
        break;
      case "Yearly":
        statsArray = data.yearlyStats || [];
        periodKey = "year";
        break;
    }

    // Merge API data into default data
    console.log("Stats array from API:", statsArray);
    console.log("Period key:", periodKey);
    console.log(
      "Default data periods:",
      defaultData.map((d) => d.period)
    );

    statsArray.forEach((stat) => {
      const period = stat[periodKey];
      console.log("Looking for period:", period);

      const matchingIndex = defaultData.findIndex(
        (item) => item.period === period
      );

      console.log("Matching index found:", matchingIndex);

      if (matchingIndex !== -1) {
        const predictions = stat.predictions || {};
        const totalPredictions = Object.values(predictions).reduce(
          (sum, count) => sum + count,
          0
        );

        defaultData[matchingIndex] = {
          ...defaultData[matchingIndex],
          predictions,
          totalPredictions,
          ...predictions,
        };
        console.log(
          "Updated data at index",
          matchingIndex,
          ":",
          defaultData[matchingIndex]
        );
      } else {
        console.warn("No matching period found for:", period);
      }
    });

    console.log("Final processed chart data:", defaultData);
    return defaultData;
  };

  // Generate default time periods with zero values
  const generateDefaultData = (filter) => {
    const now = new Date();
    let data = [];

    switch (filter) {
      case "Daily":
        for (let i = 10; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          data.push({
            period: date
              .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              .replace(",", ""),
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
              year: "numeric",
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
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          data.push({
            period: date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
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

  // Get all unique disease types
  const getAllDiseaseTypes = () => {
    const diseases = new Set();
    chartData.forEach((item) => {
      if (item.predictions) {
        Object.keys(item.predictions).forEach((disease) =>
          diseases.add(disease)
        );
      }
    });

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
    "Powdery Mildew": "#0046FF",
  };

  const getDiseaseColor = (disease, index) => {
    return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
  };

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
