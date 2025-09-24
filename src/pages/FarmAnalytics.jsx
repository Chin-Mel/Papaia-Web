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
  const [farmers, setFarmers] = useState([]);

  // Fetch farmers for this farm
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

    const fetchFarmers = async () => {
      try {
        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.status === "success") {
            setFarmers(data.farmers || []);
          }
        }
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };

    fetchFarmers();

    return () => {
      isMounted = false;
    };
  }, [farmId]);

  // Fetch analytics data
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        // First get all scans for this farm
        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
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
  }, [farmId]);

  // Process analytics data
  const processAnalyticsData = () => {
    if (
      !analyticsData ||
      !Array.isArray(analyticsData) ||
      farmers.length === 0
    ) {
      return [];
    }

    // Get farmer ID numbers for filtering
    const farmerIdNumbers = farmers.map((farmer) => farmer.idNumber);

    // Filter scans to only include those by assigned farmers
    const farmerScans = analyticsData.filter((scan) =>
      farmerIdNumbers.includes(scan.idNumber)
    );

    // Parse timestamp helper
    const parseTimestamp = (timestamp) => {
      if (!timestamp) return new Date(0);

      try {
        const [datePart, timePart, period] = timestamp.split(/\s+/);
        const [month, day, year] = datePart.split("/");
        const [hours, minutes] = timePart.split(":");

        let hour24 = parseInt(hours);
        if (period === "PM" && hour24 !== 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;

        return new Date(year, month - 1, day, hour24, minutes);
      } catch (error) {
        return new Date(timestamp);
      }
    };

    // Generate complete time periods based on filter
    const generateTimePeriods = () => {
      const now = new Date();
      const periods = [];

      if (timeFilter === "Daily") {
        // Show 7 days of the week
        const weekDays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          periods.push({
            key: date.toISOString().split("T")[0],
            label: weekDays[i],
            date: date,
          });
        }
      } else if (timeFilter === "Weekly") {
        // Show 4-5 weeks of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let weekCount = 1;
        let currentWeekStart = new Date(startOfMonth);

        while (currentWeekStart <= endOfMonth) {
          const weekEnd = new Date(currentWeekStart);
          weekEnd.setDate(currentWeekStart.getDate() + 6);

          periods.push({
            key: `week-${weekCount}`,
            label: `Week ${weekCount}`,
            start: new Date(currentWeekStart),
            end: weekEnd,
          });

          currentWeekStart.setDate(currentWeekStart.getDate() + 7);
          weekCount++;
        }
      } else if (timeFilter === "Monthly") {
        // Show all 12 months
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
        for (let i = 0; i < 12; i++) {
          periods.push({
            key: `month-${i}`,
            label: months[i],
            month: i,
            year: now.getFullYear(),
          });
        }
      } else if (timeFilter === "Yearly") {
        // Show 5-7 years (adjust based on farm creation or current year)
        const currentYear = now.getFullYear();
        for (let i = currentYear - 4; i <= currentYear + 2; i++) {
          periods.push({
            key: `year-${i}`,
            label: i.toString(),
            year: i,
          });
        }
      }

      return periods;
    };

    const timePeriods = generateTimePeriods();

    // Group scans by time period
    const groupedData = timePeriods.map((period) => {
      const periodScans = farmerScans.filter((scan) => {
        const scanDate = parseTimestamp(scan.timestamp);

        if (timeFilter === "Daily") {
          return scanDate.toISOString().split("T")[0] === period.key;
        } else if (timeFilter === "Weekly") {
          return scanDate >= period.start && scanDate <= period.end;
        } else if (timeFilter === "Monthly") {
          return (
            scanDate.getMonth() === period.month &&
            scanDate.getFullYear() === period.year
          );
        } else if (timeFilter === "Yearly") {
          return scanDate.getFullYear() === period.year;
        }
        return false;
      });

      // Count predictions by disease type
      const diseaseCounts = {
        Healthy: 0,
        "Ring Spot Virus": 0,
        Anthracnose: 0,
        "Powdery Mildew": 0,
      };

      periodScans.forEach((scan) => {
        if (diseaseCounts.hasOwnProperty(scan.prediction)) {
          diseaseCounts[scan.prediction]++;
        }
      });

      return {
        period: period.label,
        ...diseaseCounts,
      };
    });

    return groupedData;
  };

  const chartData = processAnalyticsData();

  // Get diseases that have been scanned (have at least one count > 0)
  const getScannedDiseases = () => {
    const scannedDiseases = new Set();
    chartData.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "period" && value > 0) {
          scannedDiseases.add(key);
        }
      });
    });
    return Array.from(scannedDiseases);
  };

  const scannedDiseases = getScannedDiseases();

  // Fixed color mapping
  const diseaseColors = {
    Healthy: "#22c55e", // Green
    "Ring Spot Virus": "#f97316", // Orange
    Anthracnose: "#ef4444", // Red
    "Powdery Mildew": "#3b82f6", // Blue
  };

  // Custom tooltip
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
                .sort(([, a], [, b]) => b - a) // Sort by count descending
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

  // Custom Legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-end gap-4 mb-4 text-xs">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const hasData = chartData && chartData.length > 0;

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
        {!hasData || scannedDiseases.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                📊
              </div>
              <p>No scan data available</p>
              <p className="text-xs mt-1">
                Data will appear when assigned farmers make scans
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
                    value: "Time Period",
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
                <Legend content={<CustomLegend />} />

                {scannedDiseases.map((disease) => (
                  <Line
                    key={disease}
                    type="monotone"
                    dataKey={disease}
                    stroke={diseaseColors[disease]}
                    strokeWidth={2}
                    dot={{ r: 4, fill: diseaseColors[disease] }}
                    name={disease}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
