import { useState, useEffect, useCallback, useRef } from "react";
import { Leaf } from "lucide-react";
import ScanDetailModal from "./ScanDetailModal";

// Simple cache for faster subsequent loads
const scanCache = {
  data: {},

  getUserId() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || payload.id || payload.sub;
    } catch {
      return null;
    }
  },

  set(key, value, ttl = 30000) {
    const userId = this.getUserId();
    if (!userId) return;
    const userKey = `${userId}:${key}`;
    this.data[userKey] = { value, expires: Date.now() + ttl };
  },

  get(key) {
    const userId = this.getUserId();
    if (!userId) return null;
    const userKey = `${userId}:${key}`;
    const item = this.data[userKey];
    if (!item || Date.now() > item.expires) {
      delete this.data[userKey];
      return null;
    }
    return item.value;
  },
};

export default function RecentScans({ farmId }) {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!farmId) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      const cacheKey = `scans-${farmId}`;
      const cached = scanCache.get(cacheKey);

      // Show cached data immediately
      if (cached) {
        setFarmers(cached.farmers);
        setRecentScans(cached.scans);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        // Fetch both in parallel
        const [farmersResponse, scansResponse] = await Promise.all([
          fetch(`https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }),
          fetch(
            `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              signal: controller.signal,
            }
          ),
        ]);

        const [farmersData, scansData] = await Promise.all([
          farmersResponse.ok ? farmersResponse.json() : { status: "error" },
          scansResponse.ok ? scansResponse.json() : [],
        ]);

        if (farmersData.status === "success") {
          const farmersList = farmersData.farmers || [];
          setFarmers(farmersList);

          // Get farmer ID numbers
          const farmerIdNumbers = farmersList.map((f) => f.idNumber);

          // Filter scans from active farmers only and sort by most recent first
          const filteredScans = (scansData || [])
            .filter((scan) => {
              const farmer = farmersList.find(
                (f) => f.idNumber === scan.idNumber
              );
              const isActive =
                farmer &&
                farmer.status !== "deactivate" &&
                farmer.status !== "inactive";
              return farmerIdNumbers.includes(scan.idNumber) && isActive;
            })
            .sort((a, b) => {
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
                } catch {
                  return new Date(timestamp);
                }
              };
              // Sort descending (most recent first)
              return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
            });

          setRecentScans(filteredScans);

          // Cache the results
          scanCache.set(cacheKey, {
            farmers: farmersList,
            scans: filteredScans,
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          if (!cached) {
            setRecentScans([]);
            setFarmers([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [farmId]);

  // Get card styling based on disease type
  const getCardStyle = useCallback((prediction) => {
    const styles = {
      Healthy: {
        bg: "bg-emerald-50/50",
        border: "border-l-2 border-emerald-700",
        textColor: "text-emerald-700",
      },
      "Ring Spot Virus": {
        bg: "bg-orange-50/50",
        border: "border-l-2 border-orange-600",
        textColor: "text-orange-600",
      },
      Anthracnose: {
        bg: "bg-rose-50/50",
        border: "border-l-2 border-rose-600",
        textColor: "text-rose-600",
      },
      "Powdery Mildew": {
        bg: "bg-blue-50/50",
        border: "border-l-2 border-blue-600",
        textColor: "text-blue-600",
      },
    };

    return (
      styles[prediction] || {
        bg: "bg-slate-50/50",
        border: "border-l-2 border-slate-600",
        textColor: "text-slate-600",
      }
    );
  }, []);

  const formatDateTime = useCallback((timestamp) => {
    try {
      if (!timestamp) return "";

      const parts = timestamp.trim().split(/\s+/);
      if (parts.length !== 3) return timestamp;

      const datePart = parts[0];
      const [month, day, year] = datePart.split("/");
      if (!month || !day || !year) return timestamp;

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const monthIndex = parseInt(month) - 1;
      const monthName = monthNames[monthIndex] || month;

      return `${monthName} ${parseInt(day)}, ${year}`;
    } catch (error) {
      return timestamp;
    }
  }, []);

  const getFarmerName = useCallback(
    (idNumber) => {
      const farmer = farmers.find((f) => f.idNumber === idNumber);
      if (!farmer) return `Farmer ${idNumber}`;

      // Build full name
      let fullName = "";
      if (farmer.firstname) fullName += farmer.firstname;
      if (farmer.middlename) fullName += ` ${farmer.middlename}`;
      if (farmer.lastname) fullName += ` ${farmer.lastname}`;
      if (farmer.suffix) fullName += ` ${farmer.suffix}`;

      return fullName.trim() || farmer.fullName || `Farmer ${idNumber}`;
    },
    [farmers]
  );

  const handleImageError = useCallback((e) => {
    e.target.style.display = "none";
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = "flex";
    }
  }, []);

  const handleScanClick = useCallback((scan) => {
    setSelectedScan(scan);
    setShowDetailModal(true);
  }, []);

  // Updated to match FarmAnalytics height
  const FIXED_HEIGHT = "580px";

  if (loading && !recentScans.length) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Recent Scans
        </h2>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Recent Scans
        </h2>

        {recentScans.length === 0 ? (
          <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
            <p className="text-sm sm:text-base text-gray-500">
              No recent scans available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Scans will appear when assigned farmers make predictions
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable container */}
            <div
              className="flex-1 overflow-y-auto pr-2 space-y-3"
              style={{ scrollbarWidth: "thin" }}
            >
              {recentScans.map((scan, index) => {
                const cardStyle = getCardStyle(scan.prediction);
                return (
                  <div
                    key={`${scan.id || scan.timestamp}-${index}`}
                    onClick={() => handleScanClick(scan)}
                    className={`${cardStyle.bg} ${cardStyle.border} rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02]`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={scan.imageUrl}
                          alt="Scan"
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                          onError={handleImageError}
                        />
                        <div
                          className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-200 items-center justify-center text-gray-400 text-xs hidden"
                          style={{ display: "none" }}
                        >
                          No Image
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-bold text-sm mb-0.5 ${cardStyle.textColor}`}
                        >
                          {scan.prediction}
                        </p>
                        <p className="text-xs text-slate-700 font-medium mb-0.5 break-words">
                          {formatDateTime(scan.timestamp)}
                        </p>
                        <p className="text-xs text-slate-500">
                          By: {getFarmerName(scan.idNumber)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 text-center flex-shrink-0">
              <p className="text-xs text-gray-500">
                {recentScans.length > 0
                  ? `Showing ${recentScans.length} ${
                      recentScans.length === 1 ? "scan" : "scans"
                    }`
                  : "No scans from assigned farmers yet"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scan Detail Modal */}
      <ScanDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        scan={selectedScan}
        farmerName={selectedScan ? getFarmerName(selectedScan.idNumber) : ""}
      />
    </>
  );
}

// import { useState, useEffect, useCallback, useRef } from "react";
// import { Leaf } from "lucide-react";

// // Simple cache for faster subsequent loads
// const scanCache = {
//   data: {},

//   getUserId() {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return null;
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const payload = JSON.parse(window.atob(base64));
//       return payload.userId || payload.id || payload.sub;
//     } catch {
//       return null;
//     }
//   },

//   set(key, value, ttl = 30000) {
//     const userId = this.getUserId();
//     if (!userId) return;
//     const userKey = `${userId}:${key}`;
//     this.data[userKey] = { value, expires: Date.now() + ttl };
//   },

//   get(key) {
//     const userId = this.getUserId();
//     if (!userId) return null;
//     const userKey = `${userId}:${key}`;
//     const item = this.data[userKey];
//     if (!item || Date.now() > item.expires) {
//       delete this.data[userKey];
//       return null;
//     }
//     return item.value;
//   },
// };

// export default function RecentScans({ farmId }) {
//   const [recentScans, setRecentScans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [farmers, setFarmers] = useState([]);
//   const abortControllerRef = useRef(null);

//   useEffect(() => {
//     if (!farmId) return;

//     // Cancel previous request
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     const fetchData = async () => {
//       const cacheKey = `scans-${farmId}`;
//       const cached = scanCache.get(cacheKey);

//       // Show cached data immediately
//       if (cached) {
//         setFarmers(cached.farmers);
//         setRecentScans(cached.scans);
//         setLoading(false);
//       } else {
//         setLoading(true);
//       }

//       try {
//         // Fetch both in parallel
//         const [farmersResponse, scansResponse] = await Promise.all([
//           fetch(`https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             signal: controller.signal,
//           }),
//           fetch(
//             `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//               signal: controller.signal,
//             }
//           ),
//         ]);

//         const [farmersData, scansData] = await Promise.all([
//           farmersResponse.ok ? farmersResponse.json() : { status: "error" },
//           scansResponse.ok ? scansResponse.json() : [],
//         ]);

//         if (farmersData.status === "success") {
//           const farmersList = farmersData.farmers || [];
//           setFarmers(farmersList);

//           // Get farmer ID numbers
//           const farmerIdNumbers = farmersList.map((f) => f.idNumber);

//           // Filter and sort scans - now showing ALL scans
//           const filteredScans = (scansData || [])
//             .filter((scan) => {
//               const farmer = farmersList.find(
//                 (f) => f.idNumber === scan.idNumber
//               );
//               const isActive =
//                 farmer &&
//                 farmer.status !== "deactivate" &&
//                 farmer.status !== "inactive";
//               return farmerIdNumbers.includes(scan.idNumber) && isActive;
//             })
//             .sort((a, b) => {
//               const parseTimestamp = (timestamp) => {
//                 if (!timestamp) return new Date(0);
//                 try {
//                   const [datePart, timePart, period] = timestamp.split(/\s+/);
//                   const [month, day, year] = datePart.split("/");
//                   const [hours, minutes] = timePart.split(":");
//                   let hour24 = parseInt(hours);
//                   if (period === "PM" && hour24 !== 12) hour24 += 12;
//                   if (period === "AM" && hour24 === 12) hour24 = 0;
//                   return new Date(year, month - 1, day, hour24, minutes);
//                 } catch {
//                   return new Date(timestamp);
//                 }
//               };
//               return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
//             });

//           setRecentScans(filteredScans);

//           // Cache the results
//           scanCache.set(cacheKey, {
//             farmers: farmersList,
//             scans: filteredScans,
//           });
//         }
//       } catch (error) {
//         if (error.name !== "AbortError") {
//           if (!cached) {
//             setRecentScans([]);
//             setFarmers([]);
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [farmId]);

//   // Get card styling based on disease type
//   const getCardStyle = useCallback((prediction) => {
//     const styles = {
//       Healthy: {
//         bg: "bg-emerald-50/50",
//         border: "border-l-2 border-emerald-700",
//         textColor: "text-emerald-700",
//       },
//       "Ring Spot Virus": {
//         bg: "bg-orange-50/50",
//         border: "border-l-2 border-orange-600",
//         textColor: "text-orange-600",
//       },
//       Anthracnose: {
//         bg: "bg-rose-50/50",
//         border: "border-l-2 border-rose-600",
//         textColor: "text-rose-600",
//       },
//       "Powdery Mildew": {
//         bg: "bg-blue-50/50",
//         border: "border-l-2 border-blue-600",
//         textColor: "text-blue-600",
//       },
//     };

//     return (
//       styles[prediction] || {
//         bg: "bg-slate-50/50",
//         border: "border-l-2 border-slate-600",
//         textColor: "text-slate-600",
//       }
//     );
//   }, []);

//   const formatDateTime = useCallback((timestamp) => {
//     try {
//       if (!timestamp) return "";

//       const parts = timestamp.trim().split(/\s+/);
//       if (parts.length !== 3) return timestamp;

//       const datePart = parts[0];
//       const [month, day, year] = datePart.split("/");
//       if (!month || !day || !year) return timestamp;

//       const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ];

//       const monthIndex = parseInt(month) - 1;
//       const monthName = monthNames[monthIndex] || month;

//       return `${monthName} ${parseInt(day)}, ${year}`;
//     } catch (error) {
//       return timestamp;
//     }
//   }, []);

//   const getFarmerName = useCallback(
//     (idNumber) => {
//       const farmer = farmers.find((f) => f.idNumber === idNumber);
//       return farmer
//         ? farmer.fullName || farmer.firstname || `Farmer ${idNumber}`
//         : `ID: ${idNumber}`;
//     },
//     [farmers]
//   );

//   const handleImageError = useCallback((e) => {
//     e.target.style.display = "none";
//     if (e.target.nextSibling) {
//       e.target.nextSibling.style.display = "flex";
//     }
//   }, []);

//   // Updated to match FarmAnalytics height
//   const FIXED_HEIGHT = "580px";

//   if (loading && !recentScans.length) {
//     return (
//       <div
//         className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//         style={{ height: FIXED_HEIGHT }}
//       >
//         <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//           Recent Scans
//         </h2>
//         <div className="flex justify-center items-center flex-1">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col"
//       style={{ height: FIXED_HEIGHT }}
//     >
//       <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//         Recent Scans
//       </h2>

//       {recentScans.length === 0 ? (
//         <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
//           <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
//           <p className="text-sm sm:text-base text-gray-500">
//             No recent scans available
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             Scans will appear when assigned farmers make predictions
//           </p>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Scrollable container */}
//           <div
//             className="flex-1 overflow-y-auto pr-2 space-y-3"
//             style={{ scrollbarWidth: "thin" }}
//           >
//             {recentScans.map((scan, index) => {
//               const cardStyle = getCardStyle(scan.prediction);
//               return (
//                 <div
//                   key={`${scan.id || scan.timestamp}-${index}`}
//                   className={`${cardStyle.bg} ${cardStyle.border} rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="relative flex-shrink-0">
//                       <img
//                         src={scan.imageUrl}
//                         alt="Scan"
//                         className="w-14 h-14 rounded-lg object-cover border border-gray-200"
//                         onError={handleImageError}
//                       />
//                       <div
//                         className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-200 items-center justify-center text-gray-400 text-xs hidden"
//                         style={{ display: "none" }}
//                       >
//                         No Image
//                       </div>
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <p
//                         className={`font-bold text-sm mb-0.5 ${cardStyle.textColor}`}
//                       >
//                         {scan.prediction}
//                       </p>
//                       <p className="text-xs text-slate-700 font-medium mb-0.5 break-words">
//                         {formatDateTime(scan.timestamp)}
//                       </p>
//                       <p className="text-xs text-slate-500">
//                         {getFarmerName(scan.idNumber)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-3 pt-3 border-t border-gray-200 text-center flex-shrink-0">
//             <p className="text-xs text-gray-500">
//               {recentScans.length > 0
//                 ? `Showing ${recentScans.length} ${
//                     recentScans.length === 1 ? "scan" : "scans"
//                   }`
//                 : "No scans from assigned farmers yet"}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
