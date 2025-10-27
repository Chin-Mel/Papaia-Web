// // import { useState, useEffect } from "react";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";

// // export default function FarmAnalytics({ farmId, timeFilter }) {
// //   const [analyticsData, setAnalyticsData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [farmCreatedYear, setFarmCreatedYear] = useState(null);

// //   // Fetch analytics data
// //   useEffect(() => {
// //     if (!farmId) return;

// //     let isMounted = true;

// //     const fetchAnalytics = async () => {
// //       setLoading(true);
// //       setError(null);

// //       try {
// //         const endpointMap = {
// //           Daily: "daily-analytics",
// //           Weekly: "weekly-analytics",
// //           Monthly: "monthly-analytics",
// //           Yearly: "yearly-analytics",
// //         };

// //         const response = await fetch(
// //           `https://papaiaapi.onrender.com/api/owner/${endpointMap[timeFilter]}/${farmId}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${localStorage.getItem("token")}`,
// //             },
// //           }
// //         );

// //         if (response.ok) {
// //           const data = await response.json();
// //           console.log(`${timeFilter} Analytics Response:`, data);
// //           if (isMounted) {
// //             setAnalyticsData(data);
// //           }
// //         } else {
// //           const errorData = await response.json().catch(() => ({}));
// //           console.error("Analytics API error:", response.status, errorData);
// //           if (isMounted) {
// //             setError(errorData.error || `HTTP ${response.status} error`);
// //             setAnalyticsData(null);
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Analytics fetch error:", error);
// //         if (isMounted) {
// //           setError("Failed to load analytics data");
// //           setAnalyticsData(null);
// //         }
// //       } finally {
// //         if (isMounted) {
// //           setLoading(false);
// //         }
// //       }
// //     };

// //     fetchAnalytics();

// //     return () => {
// //       isMounted = false;
// //     };
// //   }, [farmId, timeFilter]);

// //   // Generate default time periods
// //   const generateDefaultData = () => {
// //     const now = new Date();
// //     let data = [];

// //     switch (timeFilter) {
// //       case "Daily":
// //         // Generate last 11 days
// //         for (let i = 10; i >= 0; i--) {
// //           const date = new Date(now);
// //           date.setDate(date.getDate() - i);
// //           data.push({
// //             period: date.toLocaleDateString("en-US", {
// //               month: "short",
// //               day: "numeric",
// //             }),
// //             totalPredictions: 0,
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //             predictions: {},
// //           });
// //         }
// //         break;

// //       case "Weekly":
// //         for (let i = 8; i >= 0; i--) {
// //           const startDate = new Date(now);
// //           const dayOfWeek = startDate.getDay();
// //           const startOfWeek = new Date(startDate);
// //           startOfWeek.setDate(startDate.getDate() - dayOfWeek - i * 7);

// //           const endOfWeek = new Date(startOfWeek);
// //           endOfWeek.setDate(startOfWeek.getDate() + 6);

// //           const weekLabel = `${startOfWeek.toLocaleDateString("en-US", {
// //             month: "short",
// //             day: "numeric",
// //           })} - ${endOfWeek.toLocaleDateString("en-US", {
// //             month: "short",
// //             day: "numeric",
// //           })}`;

// //           data.push({
// //             period: weekLabel,
// //             totalPredictions: 0,
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //             predictions: {},
// //           });
// //         }
// //         break;

// //       case "Monthly":
// //         const months = [
// //           "Jan",
// //           "Feb",
// //           "Mar",
// //           "Apr",
// //           "May",
// //           "Jun",
// //           "Jul",
// //           "Aug",
// //           "Sep",
// //           "Oct",
// //           "Nov",
// //           "Dec",
// //         ];
// //         months.forEach((month) => {
// //           data.push({
// //             period: `${month} ${now.getFullYear()}`,
// //             totalPredictions: 0,
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //             predictions: {},
// //           });
// //         });
// //         break;

// //       case "Yearly":
// //         const currentYear = now.getFullYear();
// //         const startYear = farmCreatedYear || currentYear - 6;
// //         for (let year = startYear; year <= startYear + 6; year++) {
// //           data.push({
// //             period: year.toString(),
// //             totalPredictions: 0,
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //             predictions: {},
// //           });
// //         }
// //         break;
// //     }

// //     return data;
// //   };

// //   const processAnalyticsData = () => {
// //     console.log("Processing analytics data:", analyticsData);

// //     let defaultData = generateDefaultData();

// //     if (!analyticsData) {
// //       console.log("No analytics data available, returning default data");
// //       return defaultData;
// //     }

// //     if (analyticsData.error) {
// //       console.log("Analytics data contains error:", analyticsData.error);
// //       return defaultData;
// //     }

// //     const statsKey = `${timeFilter.toLowerCase()}Stats`;
// //     const stats = analyticsData[statsKey];

// //     console.log(`Looking for ${statsKey}:`, stats);

// //     if (!stats || !Array.isArray(stats)) {
// //       console.log("Stats not found or not an array:", stats);
// //       return defaultData;
// //     }

// //     stats.forEach((apiItem) => {
// //       const predictions = apiItem.predictions || {};

// //       let period = "";
// //       if (apiItem.day) period = apiItem.day;
// //       else if (apiItem.week) period = apiItem.week;
// //       else if (apiItem.month) period = apiItem.month;
// //       else if (apiItem.year) period = apiItem.year;

// //       // Find matching period in default data
// //       const defaultIndex = defaultData.findIndex(
// //         (item) =>
// //           item.period === period ||
// //           item.period.includes(period) ||
// //           period.includes(item.period)
// //       );

// //       if (defaultIndex !== -1) {
// //         // Calculate total predictions
// //         const totalPredictions = Object.values(predictions).reduce(
// //           (sum, count) => sum + count,
// //           0
// //         );

// //         defaultData[defaultIndex] = {
// //           ...defaultData[defaultIndex],
// //           totalPredictions,
// //           predictions,
// //           ...predictions,
// //         };
// //       }
// //     });

// //     console.log("Final processed data:", defaultData);
// //     return defaultData;
// //   };

// //   const chartData = processAnalyticsData();

// //   // Get all unique disease types from the data
// //   const getAllDiseaseTypes = () => {
// //     const diseases = new Set();
// //     chartData.forEach((item) => {
// //       if (item.predictions) {
// //         Object.keys(item.predictions).forEach((disease) =>
// //           diseases.add(disease)
// //         );
// //       }
// //     });

// //     // Always include these disease types for consistency
// //     const defaultDiseases = [
// //       "Healthy",
// //       "Ring Spot Virus",
// //       "Anthracnose",
// //       "Powdery Mildew",
// //     ];
// //     defaultDiseases.forEach((disease) => diseases.add(disease));

// //     return Array.from(diseases);
// //   };

// //   const diseaseTypes = getAllDiseaseTypes();

// //   const diseaseColors = {
// //     Healthy: "#22c55e",
// //     "Ring Spot Virus": "#ef4444",
// //     Anthracnose: "#f97316",
// //     "Powdery Mildew": "#0046FF",
// //   };

// //   // Get color for disease type
// //   const getDiseaseColor = (disease, index) => {
// //     return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
// //   };

// //   // Enhanced custom tooltip
// //   const CustomTooltip = ({ active, payload, label }) => {
// //     if (active && payload && payload.length) {
// //       const data = payload[0].payload;
// //       return (
// //         <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
// //           <p className="font-semibold text-gray-800 mb-2">{label}</p>
// //           <p className="text-blue-600 mb-2">
// //             Total Scans: {data.totalPredictions}
// //           </p>
// //           {data.predictions && Object.keys(data.predictions).length > 0 && (
// //             <div className="border-t pt-2 mt-2">
// //               <p className="font-medium text-gray-700 mb-1">
// //                 Disease Breakdown:
// //               </p>
// //               {Object.entries(data.predictions)
// //                 .sort(([, a], [, b]) => b - a)
// //                 .map(([disease, count]) => (
// //                   <div
// //                     key={disease}
// //                     className="flex justify-between items-center text-xs text-gray-600 mb-1"
// //                   >
// //                     <span className="flex items-center gap-2">
// //                       <div
// //                         className="w-2 h-2 rounded-full"
// //                         style={{ backgroundColor: getDiseaseColor(disease) }}
// //                       ></div>
// //                       {disease}
// //                     </span>
// //                     <span className="font-medium">{count}</span>
// //                   </div>
// //                 ))}
// //             </div>
// //           )}
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   const hasData =
// //     chartData &&
// //     chartData.length > 0 &&
// //     chartData.some((item) => item.totalPredictions > 0);

// //   console.log("Chart data:", chartData);
// //   console.log("Has data:", hasData);
// //   console.log("Disease types:", diseaseTypes);

// //   const totalScans = chartData.reduce(
// //     (sum, item) => sum + item.totalPredictions,
// //     0
// //   );

// //   const healthyScans = chartData.reduce((sum, item) => {
// //     return sum + (item.predictions?.Healthy || 0);
// //   }, 0);
// //   const healthScore =
// //     totalScans > 0 ? ((healthyScans / totalScans) * 100).toFixed(1) : "0";

// //   const diseaseScans = totalScans - healthyScans;
// //   const diseaseScore =
// //     totalScans > 0 ? ((diseaseScans / totalScans) * 100).toFixed(1) : "0";

// //   const FIXED_HEIGHT = "580px";

// //   if (loading) {
// //     return (
// //       <div
// //         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
// //         style={{ height: FIXED_HEIGHT }}
// //       >
// //         <div className="flex justify-center items-center h-full">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div
// //         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
// //         style={{ height: FIXED_HEIGHT }}
// //       >
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
// //           <h2 className="text-base sm:text-lg font-bold text-gray-800">
// //             Farm Analytics ({timeFilter})
// //           </h2>
// //         </div>
// //         <div className="flex items-center justify-center h-full text-red-500 text-sm">
// //           <div className="text-center">
// //             <div className="w-16 h-16 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
// //               ⚠️
// //             </div>
// //             <p className="font-medium">Error loading analytics</p>
// //             <p className="text-xs mt-1 text-gray-500">{error}</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div
// //       className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
// //       style={{ height: FIXED_HEIGHT }}
// //     >
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
// //         <h2 className="text-base sm:text-lg font-bold text-gray-800">
// //           Farm Analytics ({timeFilter})
// //         </h2>
// //       </div>

// //       <div className="flex-1 w-full mb-4">
// //         <div style={{ width: "100%", height: "100%" }}>
// //           <ResponsiveContainer>
// //             <LineChart
// //               data={chartData}
// //               margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
// //             >
// //               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //               <XAxis
// //                 dataKey="period"
// //                 tick={{ fontSize: 11 }}
// //                 angle={-45}
// //                 textAnchor="end"
// //                 height={60}
// //               />
// //               <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
// //               <Tooltip content={<CustomTooltip />} />
// //               <Legend
// //                 verticalAlign="top"
// //                 align="right"
// //                 iconType="rect"
// //                 iconSize={8}
// //                 wrapperStyle={{
// //                   fontSize: "10px",
// //                   paddingBottom: "10px",
// //                   lineHeight: "14px",
// //                 }}
// //               />
// //               {diseaseTypes.map((disease, index) => (
// //                 <Line
// //                   key={disease}
// //                   type="monotone"
// //                   dataKey={disease}
// //                   stroke={getDiseaseColor(disease, index)}
// //                   strokeWidth={2}
// //                   dot={{ r: 4 }}
// //                   name={disease}
// //                   connectNulls={false}
// //                 />
// //               ))}
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>

// //       {/* Fixed height summary stats - Always side by side */}
// //       <div
// //         className="grid grid-cols-3 gap-2 sm:gap-4"
// //         style={{ minHeight: "60px" }}
// //       >
// //         <div className="text-center">
// //           <p className="text-green-600 font-semibold text-base sm:text-xl">
// //             {totalScans}
// //           </p>
// //           <p className="text-xs sm:text-base text-gray-600">Total Scans</p>
// //         </div>
// //         <div className="text-center">
// //           <p className="text-blue-600 font-semibold text-base sm:text-xl">
// //             {healthScore}%
// //           </p>
// //           <p className="text-xs sm:text-base text-gray-600">Healthy</p>
// //         </div>
// //         <div className="text-center">
// //           <p className="text-orange-600 font-semibold text-base sm:text-xl">
// //             {diseaseScore}%
// //           </p>
// //           <p className="text-xs sm:text-base text-gray-600">Diseases</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // import { useState, useEffect } from "react";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";

// // export default function FarmAnalytics({ farmId, timeFilter }) {
// //   const [chartData, setChartData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   // Fetch analytics data based on timeFilter
// //   useEffect(() => {
// //     if (!farmId) return;

// //     let isMounted = true;

// //     const fetchAnalytics = async () => {
// //       setLoading(true);
// //       setError(null);

// //       try {
// //         // Map timeFilter to the correct endpoint
// //         const endpointMap = {
// //           Daily: "daily-analytics",
// //           Weekly: "weekly-analytics",
// //           Monthly: "monthly-analytics",
// //           Yearly: "yearly-analytics",
// //         };

// //         const endpoint = endpointMap[timeFilter];
// //         const response = await fetch(
// //           `https://papaiaapi.onrender.com/api/owner/${endpoint}/${farmId}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${localStorage.getItem("token")}`,
// //             },
// //           }
// //         );

// //         if (response.ok) {
// //           const data = await response.json();
// //           console.log("Analytics data:", data);

// //           if (isMounted) {
// //             const processedData = processAnalyticsData(data, timeFilter);
// //             setChartData(processedData);
// //           }
// //         } else {
// //           console.error("Failed to fetch analytics");
// //           if (isMounted) {
// //             setError("Failed to load analytics data");
// //             setChartData(generateDefaultData(timeFilter));
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Analytics fetch error:", error);
// //         if (isMounted) {
// //           setError("Failed to load analytics data");
// //           setChartData(generateDefaultData(timeFilter));
// //         }
// //       } finally {
// //         if (isMounted) {
// //           setLoading(false);
// //         }
// //       }
// //     };

// //     fetchAnalytics();

// //     return () => {
// //       isMounted = false;
// //     };
// //   }, [farmId, timeFilter]);

// //   // Process API response into chart format
// //   const processAnalyticsData = (data, filter) => {
// //     const defaultData = generateDefaultData(filter);

// //     // Get the stats array based on the filter
// //     let statsArray = [];
// //     let periodKey = "";

// //     switch (filter) {
// //       case "Daily":
// //         statsArray = data.dailyStats || [];
// //         periodKey = "day";
// //         break;
// //       case "Weekly":
// //         statsArray = data.weeklyStats || [];
// //         periodKey = "week";
// //         break;
// //       case "Monthly":
// //         statsArray = data.monthlyStats || [];
// //         periodKey = "month";
// //         break;
// //       case "Yearly":
// //         statsArray = data.yearlyStats || [];
// //         periodKey = "year";
// //         break;
// //     }

// //     // Merge API data into default data
// //     console.log("Stats array from API:", statsArray);
// //     console.log("Period key:", periodKey);
// //     console.log(
// //       "Default data periods:",
// //       defaultData.map((d) => d.period)
// //     );

// //     statsArray.forEach((stat) => {
// //       const period = stat[periodKey];
// //       console.log("Looking for period:", period);

// //       const matchingIndex = defaultData.findIndex(
// //         (item) => item.period === period
// //       );

// //       console.log("Matching index found:", matchingIndex);

// //       if (matchingIndex !== -1) {
// //         const predictions = stat.predictions || {};
// //         const totalPredictions = Object.values(predictions).reduce(
// //           (sum, count) => sum + count,
// //           0
// //         );

// //         defaultData[matchingIndex] = {
// //           ...defaultData[matchingIndex],
// //           predictions,
// //           totalPredictions,
// //           ...predictions,
// //         };
// //         console.log(
// //           "Updated data at index",
// //           matchingIndex,
// //           ":",
// //           defaultData[matchingIndex]
// //         );
// //       } else {
// //         console.warn("No matching period found for:", period);
// //       }
// //     });

// //     console.log("Final processed chart data:", defaultData);
// //     return defaultData;
// //   };

// //   // Generate default time periods with zero values
// //   const generateDefaultData = (filter) => {
// //     const now = new Date();
// //     let data = [];

// //     switch (filter) {
// //       case "Daily":
// //         for (let i = 10; i >= 0; i--) {
// //           const date = new Date(now);
// //           date.setDate(date.getDate() - i);
// //           data.push({
// //             period: date
// //               .toLocaleDateString("en-US", {
// //                 month: "short",
// //                 day: "numeric",
// //                 year: "numeric",
// //               })
// //               .replace(",", ""),
// //             totalPredictions: 0,
// //             predictions: {},
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //           });
// //         }
// //         break;

// //       case "Weekly":
// //         for (let i = 8; i >= 0; i--) {
// //           const startDate = new Date(now);
// //           const dayOfWeek = startDate.getDay();
// //           const startOfWeek = new Date(startDate);
// //           startOfWeek.setDate(startDate.getDate() - dayOfWeek - i * 7);

// //           const endOfWeek = new Date(startOfWeek);
// //           endOfWeek.setDate(startOfWeek.getDate() + 6);

// //           data.push({
// //             period: `${startOfWeek.toLocaleDateString("en-US", {
// //               month: "short",
// //               day: "numeric",
// //             })} - ${endOfWeek.toLocaleDateString("en-US", {
// //               month: "short",
// //               day: "numeric",
// //               year: "numeric",
// //             })}`,
// //             totalPredictions: 0,
// //             predictions: {},
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //           });
// //         }
// //         break;

// //       case "Monthly":
// //         for (let i = 11; i >= 0; i--) {
// //           const date = new Date(now);
// //           date.setMonth(date.getMonth() - i);
// //           data.push({
// //             period: date.toLocaleDateString("en-US", {
// //               month: "short",
// //               year: "numeric",
// //             }),
// //             totalPredictions: 0,
// //             predictions: {},
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //           });
// //         }
// //         break;

// //       case "Yearly":
// //         const currentYear = now.getFullYear();
// //         for (let year = currentYear - 6; year <= currentYear; year++) {
// //           data.push({
// //             period: year.toString(),
// //             totalPredictions: 0,
// //             predictions: {},
// //             Healthy: 0,
// //             "Ring Spot Virus": 0,
// //             Anthracnose: 0,
// //             "Powdery Mildew": 0,
// //           });
// //         }
// //         break;
// //     }

// //     return data;
// //   };

// //   // Get all unique disease types
// //   const getAllDiseaseTypes = () => {
// //     const diseases = new Set();
// //     chartData.forEach((item) => {
// //       if (item.predictions) {
// //         Object.keys(item.predictions).forEach((disease) =>
// //           diseases.add(disease)
// //         );
// //       }
// //     });

// //     const defaultDiseases = [
// //       "Healthy",
// //       "Ring Spot Virus",
// //       "Anthracnose",
// //       "Powdery Mildew",
// //     ];
// //     defaultDiseases.forEach((disease) => diseases.add(disease));

// //     return Array.from(diseases);
// //   };

// //   const diseaseTypes = getAllDiseaseTypes();

// //   const diseaseColors = {
// //     Healthy: "#22c55e",
// //     "Ring Spot Virus": "#ef4444",
// //     Anthracnose: "#f97316",
// //     "Powdery Mildew": "#0046FF",
// //   };

// //   const getDiseaseColor = (disease, index) => {
// //     return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
// //   };

// //   const CustomTooltip = ({ active, payload, label }) => {
// //     if (active && payload && payload.length) {
// //       const data = payload[0].payload;
// //       return (
// //         <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
// //           <p className="font-semibold text-gray-800 mb-2">{label}</p>
// //           <p className="text-blue-600 mb-2">
// //             Total Scans: {data.totalPredictions}
// //           </p>
// //           {data.predictions && Object.keys(data.predictions).length > 0 && (
// //             <div className="border-t pt-2 mt-2">
// //               <p className="font-medium text-gray-700 mb-1">
// //                 Disease Breakdown:
// //               </p>
// //               {Object.entries(data.predictions)
// //                 .sort(([, a], [, b]) => b - a)
// //                 .map(([disease, count]) => (
// //                   <div
// //                     key={disease}
// //                     className="flex justify-between items-center text-xs text-gray-600 mb-1"
// //                   >
// //                     <span className="flex items-center gap-2">
// //                       <div
// //                         className="w-2 h-2 rounded-full"
// //                         style={{ backgroundColor: getDiseaseColor(disease) }}
// //                       ></div>
// //                       {disease}
// //                     </span>
// //                     <span className="font-medium">{count}</span>
// //                   </div>
// //                 ))}
// //             </div>
// //           )}
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   const totalScans = chartData.reduce(
// //     (sum, item) => sum + item.totalPredictions,
// //     0
// //   );

// //   const healthyScans = chartData.reduce((sum, item) => {
// //     return sum + (item.predictions?.Healthy || 0);
// //   }, 0);

// //   const healthScore =
// //     totalScans > 0 ? ((healthyScans / totalScans) * 100).toFixed(1) : "0";

// //   const diseaseScans = totalScans - healthyScans;
// //   const diseaseScore =
// //     totalScans > 0 ? ((diseaseScans / totalScans) * 100).toFixed(1) : "0";

// //   const FIXED_HEIGHT = "580px";

// //   if (loading) {
// //     return (
// //       <div
// //         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
// //         style={{ height: FIXED_HEIGHT }}
// //       >
// //         <div className="flex justify-center items-center h-full">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div
// //         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
// //         style={{ height: FIXED_HEIGHT }}
// //       >
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
// //           <h2 className="text-base sm:text-lg font-bold text-gray-800">
// //             Farm Analytics ({timeFilter})
// //           </h2>
// //         </div>
// //         <div className="flex items-center justify-center h-full text-red-500 text-sm">
// //           <div className="text-center">
// //             <div className="w-16 h-16 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
// //               ⚠️
// //             </div>
// //             <p className="font-medium">Error loading analytics</p>
// //             <p className="text-xs mt-1 text-gray-500">{error}</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div
// //       className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
// //       style={{ height: FIXED_HEIGHT }}
// //     >
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
// //         <h2 className="text-base sm:text-lg font-bold text-gray-800">
// //           Farm Analytics ({timeFilter})
// //         </h2>
// //       </div>

// //       <div className="flex-1 w-full mb-4">
// //         <div style={{ width: "100%", height: "100%" }}>
// //           <ResponsiveContainer>
// //             <LineChart
// //               data={chartData}
// //               margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
// //             >
// //               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //               <XAxis
// //                 dataKey="period"
// //                 tick={{ fontSize: 11 }}
// //                 angle={-45}
// //                 textAnchor="end"
// //                 height={60}
// //               />
// //               <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
// //               <Tooltip content={<CustomTooltip />} />
// //               <Legend
// //                 verticalAlign="top"
// //                 align="right"
// //                 iconType="rect"
// //                 iconSize={8}
// //                 wrapperStyle={{
// //                   fontSize: "10px",
// //                   paddingBottom: "10px",
// //                   lineHeight: "14px",
// //                 }}
// //               />
// //               {diseaseTypes.map((disease, index) => (
// //                 <Line
// //                   key={disease}
// //                   type="monotone"
// //                   dataKey={disease}
// //                   stroke={getDiseaseColor(disease, index)}
// //                   strokeWidth={2}
// //                   dot={{ r: 4 }}
// //                   name={disease}
// //                   connectNulls={false}
// //                 />
// //               ))}
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>

// //       <div
// //         className="grid grid-cols-3 gap-2 sm:gap-4"
// //         style={{ minHeight: "60px" }}
// //       >
// //         <div className="text-center">
// //           <p className="text-green-600 font-semibold text-base sm:text-xl">
// //             {totalScans}
// //           </p>
// //           <p className="text-xs sm:text-base text-gray-600">Total Scans</p>
// //         </div>
// //         <div className="text-center">
// //           <p className="text-blue-600 font-semibold text-base sm:text-xl">
// //             {healthScore}%
// //           </p>
// //           <p className="text-xs sm:text-base text-gray-600">Healthy</p>
// //         </div>
// //         <div className="text-center">
// //           <p className="text-orange-600 font-semibold text-base sm:text-xl">
// //             {diseaseScore}%
// //           </p>
// //           <p className="text-xs sm:text-base text-gray-600">Diseases</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function FarmAnalytics({ farmId, timeFilter }) {
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch analytics data with AbortController for cleanup
//   useEffect(() => {
//     if (!farmId) return;

//     const controller = new AbortController();

//     const fetchAnalytics = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const endpointMap = {
//           Daily: "daily-analytics",
//           Weekly: "weekly-analytics",
//           Monthly: "monthly-analytics",
//           Yearly: "yearly-analytics",
//         };

//         const response = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/${endpointMap[timeFilter]}/${farmId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             signal: controller.signal,
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setAnalyticsData(data);
//         } else {
//           const errorData = await response.json().catch(() => ({}));
//           setError(errorData.error || `HTTP ${response.status} error`);
//           setAnalyticsData(null);
//         }
//       } catch (error) {
//         if (error.name !== "AbortError") {
//           setError("Failed to load analytics data");
//           setAnalyticsData(null);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();

//     return () => controller.abort();
//   }, [farmId, timeFilter]);

//   // Memoize default data generation
//   const generateDefaultData = useCallback(() => {
//     const now = new Date();
//     let data = [];

//     switch (timeFilter) {
//       case "Daily":
//         for (let i = 10; i >= 0; i--) {
//           const date = new Date(now);
//           date.setDate(date.getDate() - i);
//           data.push({
//             period: date.toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//             }),
//             totalPredictions: 0,
//             Healthy: 0,
//             "Ring Spot Virus": 0,
//             Anthracnose: 0,
//             "Powdery Mildew": 0,
//             predictions: {},
//           });
//         }
//         break;

//       case "Weekly":
//         for (let i = 8; i >= 0; i--) {
//           const startDate = new Date(now);
//           const dayOfWeek = startDate.getDay();
//           const startOfWeek = new Date(startDate);
//           startOfWeek.setDate(startDate.getDate() - dayOfWeek - i * 7);
//           const endOfWeek = new Date(startOfWeek);
//           endOfWeek.setDate(startOfWeek.getDate() + 6);

//           data.push({
//             period: `${startOfWeek.toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//             })} - ${endOfWeek.toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//             })}`,
//             totalPredictions: 0,
//             Healthy: 0,
//             "Ring Spot Virus": 0,
//             Anthracnose: 0,
//             "Powdery Mildew": 0,
//             predictions: {},
//           });
//         }
//         break;

//       case "Monthly":
//         const months = [
//           "Jan",
//           "Feb",
//           "Mar",
//           "Apr",
//           "May",
//           "Jun",
//           "Jul",
//           "Aug",
//           "Sep",
//           "Oct",
//           "Nov",
//           "Dec",
//         ];
//         months.forEach((month) => {
//           data.push({
//             period: `${month} ${now.getFullYear()}`,
//             totalPredictions: 0,
//             Healthy: 0,
//             "Ring Spot Virus": 0,
//             Anthracnose: 0,
//             "Powdery Mildew": 0,
//             predictions: {},
//           });
//         });
//         break;

//       case "Yearly":
//         const currentYear = now.getFullYear();
//         const startYear = currentYear - 6;
//         for (let year = startYear; year <= startYear + 6; year++) {
//           data.push({
//             period: year.toString(),
//             totalPredictions: 0,
//             Healthy: 0,
//             "Ring Spot Virus": 0,
//             Anthracnose: 0,
//             "Powdery Mildew": 0,
//             predictions: {},
//           });
//         }
//         break;
//     }

//     return data;
//   }, [timeFilter]);

//   // Memoize processed chart data
//   const chartData = useMemo(() => {
//     let defaultData = generateDefaultData();

//     if (!analyticsData?.error) {
//       const statsKey = `${timeFilter.toLowerCase()}Stats`;
//       const stats = analyticsData?.[statsKey];

//       if (stats && Array.isArray(stats)) {
//         stats.forEach((apiItem) => {
//           const predictions = apiItem.predictions || {};
//           let period =
//             apiItem.day || apiItem.week || apiItem.month || apiItem.year;

//           const defaultIndex = defaultData.findIndex(
//             (item) =>
//               item.period === period ||
//               item.period.includes(period) ||
//               period.includes(item.period)
//           );

//           if (defaultIndex !== -1) {
//             const totalPredictions = Object.values(predictions).reduce(
//               (sum, count) => sum + count,
//               0
//             );

//             defaultData[defaultIndex] = {
//               ...defaultData[defaultIndex],
//               totalPredictions,
//               predictions,
//               ...predictions,
//             };
//           }
//         });
//       }
//     }

//     return defaultData;
//   }, [analyticsData, timeFilter, generateDefaultData]);

//   // Memoize disease types
//   const diseaseTypes = useMemo(() => {
//     const diseases = new Set([
//       "Healthy",
//       "Ring Spot Virus",
//       "Anthracnose",
//       "Powdery Mildew",
//     ]);

//     chartData.forEach((item) => {
//       if (item.predictions) {
//         Object.keys(item.predictions).forEach((disease) =>
//           diseases.add(disease)
//         );
//       }
//     });

//     return Array.from(diseases);
//   }, [chartData]);

//   const diseaseColors = {
//     Healthy: "#22c55e",
//     "Ring Spot Virus": "#ef4444",
//     Anthracnose: "#f97316",
//     "Powdery Mildew": "#0046FF",
//   };

//   const getDiseaseColor = useCallback((disease, index) => {
//     return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
//   }, []);

//   // Memoize CustomTooltip
//   const CustomTooltip = useCallback(
//     ({ active, payload, label }) => {
//       if (active && payload && payload.length) {
//         const data = payload[0].payload;
//         return (
//           <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
//             <p className="font-semibold text-gray-800 mb-2">{label}</p>
//             <p className="text-blue-600 mb-2">
//               Total Scans: {data.totalPredictions}
//             </p>
//             {data.predictions && Object.keys(data.predictions).length > 0 && (
//               <div className="border-t pt-2 mt-2">
//                 <p className="font-medium text-gray-700 mb-1">
//                   Disease Breakdown:
//                 </p>
//                 {Object.entries(data.predictions)
//                   .sort(([, a], [, b]) => b - a)
//                   .map(([disease, count]) => (
//                     <div
//                       key={disease}
//                       className="flex justify-between items-center text-xs text-gray-600 mb-1"
//                     >
//                       <span className="flex items-center gap-2">
//                         <div
//                           className="w-2 h-2 rounded-full"
//                           style={{ backgroundColor: getDiseaseColor(disease) }}
//                         ></div>
//                         {disease}
//                       </span>
//                       <span className="font-medium">{count}</span>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         );
//       }
//       return null;
//     },
//     [getDiseaseColor]
//   );

//   // Memoize summary stats
//   const summaryStats = useMemo(() => {
//     const totalScans = chartData.reduce(
//       (sum, item) => sum + item.totalPredictions,
//       0
//     );
//     const healthyScans = chartData.reduce(
//       (sum, item) => sum + (item.predictions?.Healthy || 0),
//       0
//     );
//     const healthScore =
//       totalScans > 0 ? ((healthyScans / totalScans) * 100).toFixed(1) : "0";
//     const diseaseScans = totalScans - healthyScans;
//     const diseaseScore =
//       totalScans > 0 ? ((diseaseScans / totalScans) * 100).toFixed(1) : "0";

//     return { totalScans, healthScore, diseaseScore };
//   }, [chartData]);

//   const FIXED_HEIGHT = "580px";

//   if (loading) {
//     return (
//       <div
//         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//         style={{ height: FIXED_HEIGHT }}
//       >
//         <div className="flex justify-center items-center h-full">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//         style={{ height: FIXED_HEIGHT }}
//       >
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
//           <h2 className="text-base sm:text-lg font-bold text-gray-800">
//             Farm Analytics ({timeFilter})
//           </h2>
//         </div>
//         <div className="flex items-center justify-center h-full text-red-500 text-sm">
//           <div className="text-center">
//             <div className="w-16 h-16 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
//               ⚠️
//             </div>
//             <p className="font-medium">Error loading analytics</p>
//             <p className="text-xs mt-1 text-gray-500">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//       style={{ height: FIXED_HEIGHT }}
//     >
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
//         <h2 className="text-base sm:text-lg font-bold text-gray-800">
//           Farm Analytics ({timeFilter})
//         </h2>
//       </div>

//       <div className="flex-1 w-full mb-4">
//         <div style={{ width: "100%", height: "100%" }}>
//           <ResponsiveContainer>
//             <LineChart
//               data={chartData}
//               margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis
//                 dataKey="period"
//                 tick={{ fontSize: 11 }}
//                 angle={-45}
//                 textAnchor="end"
//                 height={60}
//               />
//               <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend
//                 verticalAlign="top"
//                 align="right"
//                 iconType="rect"
//                 iconSize={8}
//                 wrapperStyle={{
//                   fontSize: "10px",
//                   paddingBottom: "10px",
//                   lineHeight: "14px",
//                 }}
//               />
//               {diseaseTypes.map((disease, index) => (
//                 <Line
//                   key={disease}
//                   type="monotone"
//                   dataKey={disease}
//                   stroke={getDiseaseColor(disease, index)}
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   name={disease}
//                   connectNulls={false}
//                 />
//               ))}
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div
//         className="grid grid-cols-3 gap-2 sm:gap-4"
//         style={{ minHeight: "60px" }}
//       >
//         <div className="text-center">
//           <p className="text-green-600 font-semibold text-base sm:text-xl">
//             {summaryStats.totalScans}
//           </p>
//           <p className="text-xs sm:text-base text-gray-600">Total Scans</p>
//         </div>
//         <div className="text-center">
//           <p className="text-blue-600 font-semibold text-base sm:text-xl">
//             {summaryStats.healthScore}%
//           </p>
//           <p className="text-xs sm:text-base text-gray-600">Healthy</p>
//         </div>
//         <div className="text-center">
//           <p className="text-orange-600 font-semibold text-base sm:text-xl">
//             {summaryStats.diseaseScore}%
//           </p>
//           <p className="text-xs sm:text-base text-gray-600">Diseases</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { ChevronDown } from "lucide-react";

export default function FarmAnalytics({
  farmId,
  timeFilter = "Daily",
  onTimeFilterChange,
  timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"],
}) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("Last 11 days");
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const dateRangeRef = useRef(null);

  // Dynamic date range options based on timeFilter
  const dateRangeOptions = useMemo(() => {
    switch (timeFilter) {
      case "Daily":
        return ["Last 7 days", "Last 11 days", "Last 14 days"];
      case "Weekly":
        return ["Last 4 weeks", "Last 9 weeks", "Last 12 weeks"];
      case "Monthly":
        return ["Last 3 months", "Last 6 months", "Last 12 months"];
      case "Yearly":
        return ["Last 3 years", "Last 5 years", "Last 7 years"];
      default:
        return ["Last 11 days"];
    }
  }, [timeFilter]);

  // Reset date range when timeFilter changes to appropriate default
  useEffect(() => {
    switch (timeFilter) {
      case "Daily":
        setDateRange("Last 11 days");
        break;
      case "Weekly":
        setDateRange("Last 9 weeks");
        break;
      case "Monthly":
        setDateRange("Last 12 months");
        break;
      case "Yearly":
        setDateRange("Last 7 years");
        break;
      default:
        setDateRange("Last 11 days");
    }
  }, [timeFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target)) {
        setIsDateRangeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch analytics data with AbortController for cleanup
  useEffect(() => {
    if (!farmId) return;

    const controller = new AbortController();

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
            signal: controller.signal,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || `HTTP ${response.status} error`);
          setAnalyticsData(null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("Failed to load analytics data");
          setAnalyticsData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    return () => controller.abort();
  }, [farmId, timeFilter]);

  // Helper function to get number of periods to show based on date range
  const getPeriodsToShow = useCallback((range, filter) => {
    switch (filter) {
      case "Daily":
        if (range === "Last 7 days") return 7;
        if (range === "Last 11 days") return 11;
        if (range === "Last 14 days") return 14;
        if (range === "Last 30 days") return 30;
        if (range === "Last 60 days") return 60;
        if (range === "Last 90 days") return 90;
        return 11;

      case "Weekly":
        if (range === "Last 4 weeks") return 4;
        if (range === "Last 9 weeks") return 9;
        if (range === "Last 12 weeks") return 12;
        if (range === "Last 26 weeks") return 26;
        if (range === "Last 52 weeks") return 52;
        return 9;

      case "Monthly":
        if (range === "Last 3 months") return 3;
        if (range === "Last 6 months") return 6;
        if (range === "Last 12 months") return 12;
        if (range === "Last 24 months") return 24;
        if (range === "Last 36 months") return 36;
        return 12;

      case "Yearly":
        if (range === "Last 3 years") return 3;
        if (range === "Last 5 years") return 5;
        if (range === "Last 7 years") return 7;
        if (range === "Last 10 years") return 10;
        if (range === "Last 15 years") return 15;
        return 7;

      default:
        return 11;
    }
  }, []);

  // Memoize default data generation - now based on date range
  const generateDefaultData = useCallback(() => {
    const now = new Date();
    let data = [];
    const periodsToShow = getPeriodsToShow(dateRange, timeFilter);

    switch (timeFilter) {
      case "Daily":
        for (let i = periodsToShow - 1; i >= 0; i--) {
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
        for (let i = periodsToShow - 1; i >= 0; i--) {
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
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
            predictions: {},
          });
        }
        break;

      case "Monthly":
        for (let i = periodsToShow - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthName = date.toLocaleDateString("en-US", {
            month: "short",
          });
          const year = date.getFullYear();

          data.push({
            period: `${monthName} ${year}`,
            totalPredictions: 0,
            Healthy: 0,
            "Ring Spot Virus": 0,
            Anthracnose: 0,
            "Powdery Mildew": 0,
            predictions: {},
          });
        }
        break;

      case "Yearly":
        const currentYear = now.getFullYear();
        for (let i = periodsToShow - 1; i >= 0; i--) {
          const year = currentYear - i;
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
  }, [timeFilter, dateRange, getPeriodsToShow]);

  // Memoize processed chart data
  const chartData = useMemo(() => {
    let defaultData = generateDefaultData();

    if (!analyticsData?.error) {
      const statsKey = `${timeFilter.toLowerCase()}Stats`;
      const stats = analyticsData?.[statsKey];

      if (stats && Array.isArray(stats)) {
        stats.forEach((apiItem) => {
          const predictions = apiItem.predictions || {};
          let period =
            apiItem.day || apiItem.week || apiItem.month || apiItem.year;

          const defaultIndex = defaultData.findIndex(
            (item) =>
              item.period === period ||
              item.period.includes(period) ||
              period.includes(item.period)
          );

          if (defaultIndex !== -1) {
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
      }
    }

    return defaultData;
  }, [analyticsData, timeFilter, generateDefaultData]);

  // Memoize disease types
  const diseaseTypes = useMemo(() => {
    const diseases = new Set([
      "Healthy",
      "Ring Spot Virus",
      "Anthracnose",
      "Powdery Mildew",
    ]);

    chartData.forEach((item) => {
      if (item.predictions) {
        Object.keys(item.predictions).forEach((disease) =>
          diseases.add(disease)
        );
      }
    });

    return Array.from(diseases);
  }, [chartData]);

  const diseaseColors = {
    Healthy: "#22c55e",
    "Ring Spot Virus": "#f97316",
    Anthracnose: "#ef4444",
    "Powdery Mildew": "#0046FF",
  };

  const getDiseaseColor = useCallback((disease, index) => {
    return diseaseColors[disease] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
  }, []);

  // Memoize CustomTooltip
  const CustomTooltip = useCallback(
    ({ active, payload, label }) => {
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
    },
    [getDiseaseColor]
  );

  // Memoize summary stats
  const summaryStats = useMemo(() => {
    const totalScans = chartData.reduce(
      (sum, item) => sum + item.totalPredictions,
      0
    );
    const healthyScans = chartData.reduce(
      (sum, item) => sum + (item.predictions?.Healthy || 0),
      0
    );
    const healthScore =
      totalScans > 0 ? ((healthyScans / totalScans) * 100).toFixed(1) : "0";
    const diseaseScans = totalScans - healthyScans;
    const diseaseScore =
      totalScans > 0 ? ((diseaseScans / totalScans) * 100).toFixed(1) : "0";

    return { totalScans, healthScore, diseaseScore };
  }, [chartData]);

  const FIXED_HEIGHT = "580px";

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
      {/* Header with inline filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Farm Analytics ({timeFilter})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Time Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => onTimeFilterChange(filter)}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer ${
                  timeFilter === filter
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Date Range Dropdown */}
          <div className="relative min-w-[150px]" ref={dateRangeRef}>
            <button
              onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
              className="w-full px-3 sm:px-4 py-1.5 border border-gray-300 rounded-lg flex justify-between items-center text-xs sm:text-sm hover:bg-gray-50 bg-white transition-all"
            >
              <span className="truncate">{dateRange}</span>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
            </button>
            {isDateRangeOpen && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {dateRangeOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setDateRange(option);
                      setIsDateRangeOpen(false);
                    }}
                    className={`px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-50 hover:text-green-700 text-xs sm:text-sm transition-colors ${
                      dateRange === option
                        ? "bg-green-50 text-green-700 font-medium"
                        : ""
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-1 text-red-500 text-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
              ⚠️
            </div>
            <p className="font-medium">Error loading analytics</p>
            <p className="text-xs mt-1 text-gray-500">{error}</p>
          </div>
        </div>
      ) : (
        <>
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
                    label={{
                      value:
                        timeFilter === "Daily"
                          ? "Days"
                          : timeFilter === "Weekly"
                          ? "Weeks"
                          : timeFilter === "Monthly"
                          ? "Months"
                          : "Years",
                      position: "insideBottom",
                      offset: -50,
                      style: { fontSize: 12, fontWeight: 600 },
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                    label={{
                      value: "Number of Scans",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12, fontWeight: 600 },
                    }}
                  />
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
                {summaryStats.totalScans}
              </p>
              <p className="text-xs sm:text-base text-gray-600">Total Scans</p>
            </div>
            <div className="text-center">
              <p className="text-blue-600 font-semibold text-base sm:text-xl">
                {summaryStats.healthScore}%
              </p>
              <p className="text-xs sm:text-base text-gray-600">Healthy</p>
            </div>
            <div className="text-center">
              <p className="text-orange-600 font-semibold text-base sm:text-xl">
                {summaryStats.diseaseScore}%
              </p>
              <p className="text-xs sm:text-base text-gray-600">Diseases</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
