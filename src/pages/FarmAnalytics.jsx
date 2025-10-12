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
  const [allScans, setAllScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [farmers, setFarmers] = useState([]);

  // Fetch farmers assigned to this farm
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

  // Fetch all identification history (like RecentScans does)
  useEffect(() => {
    if (!farmId || farmers.length === 0) return;

    let isMounted = true;

    const fetchScans = async () => {
      setLoading(true);
      setError(null);

      try {
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
          console.log("All scans data:", data);

          if (isMounted) {
            // Get list of farmer idNumbers for this farm
            const farmerIdNumbers = farmers.map((farmer) => farmer.idNumber);
            console.log("Farmer ID numbers:", farmerIdNumbers);

            // Filter scans to only include those made by assigned farmers
            const filteredScans = (data || []).filter((scan) => {
              return farmerIdNumbers.includes(scan.idNumber);
            });

            console.log(
              "Filtered scans by assigned farmers:",
              filteredScans.length
            );
            setAllScans(filteredScans);
          }
        } else {
          console.error("Failed to fetch scans");
          if (isMounted) {
            setError("Failed to load analytics data");
            setAllScans([]);
          }
        }
      } catch (error) {
        console.error("Analytics fetch error:", error);
        if (isMounted) {
          setError("Failed to load analytics data");
          setAllScans([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchScans();

    return () => {
      isMounted = false;
    };
  }, [farmId, farmers]);

  // Parse timestamp to Date object
  const parseTimestamp = (timestamp) => {
    if (!timestamp) return new Date(0);

    try {
      const [datePart, timePart, period] = timestamp.split(/\s+/);
      if (!datePart || !timePart) return new Date(0);

      const [month, day, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");

      let hour24 = parseInt(hours);
      if (period === "PM" && hour24 !== 12) hour24 += 12;
      if (period === "AM" && hour24 === 12) hour24 = 0;

      return new Date(year, month - 1, day, hour24, minutes);
    } catch (error) {
      return new Date(0);
    }
  };

  // Group scans by period based on timeFilter
  const groupScansByPeriod = () => {
    const grouped = {};

    allScans.forEach((scan) => {
      const date = parseTimestamp(scan.timestamp);
      let periodKey = "";

      switch (timeFilter) {
        case "Daily":
          periodKey = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          break;

        case "Weekly":
          const dayOfWeek = date.getDay();
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - dayOfWeek);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          periodKey = `${startOfWeek.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${endOfWeek.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`;
          break;

        case "Monthly":
          periodKey = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          break;

        case "Yearly":
          periodKey = date.getFullYear().toString();
          break;

        default:
          periodKey = date.toLocaleDateString();
      }

      if (!grouped[periodKey]) {
        grouped[periodKey] = {
          period: periodKey,
          predictions: {},
          totalPredictions: 0,
        };
      }

      const disease = scan.prediction || "Unknown";
      grouped[periodKey].predictions[disease] =
        (grouped[periodKey].predictions[disease] || 0) + 1;
      grouped[periodKey].totalPredictions += 1;
    });

    return Object.values(grouped);
  };

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

  // Process scans into chart data
  const processChartData = () => {
    let defaultData = generateDefaultData();
    const groupedData = groupScansByPeriod();

    console.log("Grouped data:", groupedData);
    console.log("Total scans being processed:", allScans.length);

    // Merge grouped data into default data
    groupedData.forEach((groupItem) => {
      const matchingIndex = defaultData.findIndex(
        (item) => item.period === groupItem.period
      );

      if (matchingIndex !== -1) {
        defaultData[matchingIndex] = {
          ...defaultData[matchingIndex],
          predictions: groupItem.predictions,
          totalPredictions: groupItem.totalPredictions,
          ...groupItem.predictions,
        };
      }
    });

    console.log("Final chart data:", defaultData);
    return defaultData;
  };

  const chartData = processChartData();

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
