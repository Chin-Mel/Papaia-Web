import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";

const API_BASE = "https://papaiaapi.onrender.com/api/owner";

export default function ScansBreakdown({ farmId, timeFilter, dateRange }) {
  const [diseaseData, setDiseaseData] = useState(null);
  const [allScansData, setAllScansData] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef({});

  const diseaseColors = {
    Healthy: "#10b981",
    "Ring Spot Virus": "#ea580c",
    Anthracnose: "#f43f5e",
    "Powdery Mildew": "#3b82f6",
  };

  // Map filters to API endpoints
  const getEndpoint = useCallback((filter, range) => {
    const endpointMap = {
      Daily: {
        "Last 7 days": "seven-days-common-diseases",
        "Last 11 days": "eleven-days-common-diseases",
        "Last 14 days": "fourteen-days-common-diseases",
      },
      Weekly: {
        "Last 4 weeks": "three-weeks-common-diseases",
        "Last 9 weeks": "nine-weeks-common-diseases",
        "Last 12 weeks": "twelve-weeks-common-diseases",
      },
      Monthly: {
        "Last 3 months": "three-month-common-diseases",
        "Last 6 months": "six-month-common-diseases",
        "Last 12 months": "twelve-month-common-diseases",
      },
      Yearly: {
        "Last 3 years": "three-year-common-diseases",
        "Last 5 years": "five-year-common-diseases",
        "Last 7 years": "seven-year-common-diseases",
      },
    };
    return endpointMap[filter]?.[range];
  }, []);

  // Fetch all scans (default view)
  const fetchAllScans = useCallback(async () => {
    if (!farmId) return null;

    const cacheKey = `all-${farmId}`;
    if (cacheRef.current[cacheKey]) {
      return cacheRef.current[cacheKey];
    }

    try {
      const response = await fetch(
        `${API_BASE}/identification-history/${farmId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch all scans");
      const data = await response.json();
      cacheRef.current[cacheKey] = data;
      return data;
    } catch (error) {
      console.error("All scans fetch error:", error);
      return null;
    }
  }, [farmId]);

  // Fetch disease data from API
  const fetchDiseaseData = useCallback(async () => {
    if (!farmId) return;

    const endpoint = getEndpoint(timeFilter, dateRange);

    // If no specific endpoint (means "All time" or default), fetch all scans
    if (!endpoint) {
      setLoading(true);
      const allData = await fetchAllScans();
      setAllScansData(allData);
      setDiseaseData(null);
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const cacheKey = `${endpoint}-${farmId}`;
    if (cacheRef.current[cacheKey]) {
      setDiseaseData(cacheRef.current[cacheKey]);
      setAllScansData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/${endpoint}/${farmId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Failed to fetch disease data");

      const data = await response.json();
      cacheRef.current[cacheKey] = data;
      setDiseaseData(data);
      setAllScansData(null);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Disease data fetch error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [farmId, timeFilter, dateRange, getEndpoint, fetchAllScans]);

  useEffect(() => {
    fetchDiseaseData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDiseaseData]);

  const breakdown = useMemo(() => {
    const allDiseases = [
      "Healthy",
      "Ring Spot Virus",
      "Anthracnose",
      "Powdery Mildew",
    ];
    const counts = {
      Healthy: 0,
      "Ring Spot Virus": 0,
      Anthracnose: 0,
      "Powdery Mildew": 0,
    };

    let total = 0;

    // Process data from disease API
    if (diseaseData && diseaseData.allDiseases) {
      diseaseData.allDiseases.forEach((item) => {
        if (counts.hasOwnProperty(item.disease)) {
          counts[item.disease] = item.count;
          total += item.count;
        }
      });

      // Calculate healthy from total scans minus diseased
      if (diseaseData.totalDiseased) {
        counts.Healthy = Math.max(0, total - diseaseData.totalDiseased);
        total = total + counts.Healthy;
      }
    }
    // Process data from all scans
    else if (allScansData && Array.isArray(allScansData)) {
      allScansData.forEach((pred) => {
        if (counts.hasOwnProperty(pred.prediction)) {
          counts[pred.prediction]++;
        }
      });
      total = allScansData.length;
    }

    const chartData = allDiseases
      .filter((disease) => counts[disease] > 0)
      .map((disease) => ({
        name: disease,
        value: counts[disease],
        color: diseaseColors[disease],
      }));

    const zeroCases = allDiseases.filter((disease) => counts[disease] === 0);

    return { chartData, zeroCases, counts, total };
  }, [diseaseData, allScansData, diseaseColors]);

  const mostCommonDisease = useMemo(() => {
    if (
      diseaseData &&
      diseaseData.mostCommonDiseases &&
      diseaseData.mostCommonDiseases.length > 0
    ) {
      const diseaseName = diseaseData.mostCommonDiseases[0];
      return [diseaseName, diseaseData.count];
    }

    return Object.entries(breakdown.counts)
      .filter(([disease]) => disease !== "Healthy")
      .sort(([, a], [, b]) => b - a)[0];
  }, [diseaseData, breakdown.counts]);

  const renderCustomLabel = useCallback(
    ({ name, percent, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontWeight: 600, fontSize: "11px" }}
        >
          <tspan x={x} dy="-0.8em">
            {name}
          </tspan>
          <tspan
            x={x}
            dy="1.3em"
            style={{ fontSize: "15px", fontWeight: "bold" }}
          >
            {`${(percent * 100).toFixed(0)}%`}
          </tspan>
          <tspan x={x} dy="1.3em" style={{ fontSize: "11px" }}>
            {`${value} ${value === 1 ? "case" : "cases"}`}
          </tspan>
        </text>
      );
    },
    []
  );

  const FIXED_HEIGHT = "580px";

  if (loading) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Scans Breakdown ({dateRange})
        </h2>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-700" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Scans Breakdown ({dateRange})
        </h2>
      </div>

      {breakdown.total === 0 ? (
        <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
          <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
          <p className="text-sm sm:text-base text-gray-500">No scans yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Scans from {dateRange.toLowerCase()} will appear here
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {mostCommonDisease && mostCommonDisease[1] > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-amber-900 mb-1">
                Most Common Disease
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-800">
                  {mostCommonDisease[0]}
                </span>
                <span className="text-xs font-semibold text-amber-700">
                  {mostCommonDisease[1]} cases (
                  {((mostCommonDisease[1] / breakdown.total) * 100).toFixed(1)}
                  %)
                </span>
              </div>
            </div>
          )}

          <div className="mb-3">
            {breakdown.chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={breakdown.chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={110}
                      innerRadius={0}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {breakdown.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} cases (${(
                          (value / breakdown.total) *
                          100
                        ).toFixed(1)}%)`,
                        props.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {breakdown.zeroCases.length > 0 && (
                  <p className="text-xs text-gray-600 italic font-medium text-center mt-2">
                    No cases: {breakdown.zeroCases.join(", ")}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">
                No data to display
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Disease Distribution
            </p>
            {Object.entries(breakdown.counts).map(([disease, count]) => (
              <div
                key={disease}
                className="flex items-center justify-between mb-1.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: diseaseColors[disease] }}
                  />
                  <span className="text-xs text-gray-700">{disease}</span>
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {count} (
                  {breakdown.total > 0
                    ? ((count / breakdown.total) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
