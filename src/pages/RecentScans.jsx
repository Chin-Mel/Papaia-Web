import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";

export default function RecentScans({ farmId }) {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [farmers, setFarmers] = useState([]);

  // First fetch farmers for this farm to get their names
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
          console.log("Farmers data:", data);
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

  // Fetch recent scans for the farm - only scans by assigned farmers
  useEffect(() => {
    if (!farmId || farmers.length === 0) return;

    let isMounted = true;

    const fetchRecentScans = async () => {
      setLoading(true);
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
              const isAssignedFarmer = farmerIdNumbers.includes(scan.idNumber);
              if (!isAssignedFarmer) {
                console.log(
                  `Scan by ${scan.idNumber} filtered out - not assigned to this farm`
                );
              }
              return isAssignedFarmer;
            });

            console.log("Filtered scans:", filteredScans);

            // Sort by timestamp (most recent first) and take only 4 scans
            const sortedScans = filteredScans
              .sort((a, b) => {
                // Handle MM/DD/YYYY HH:MM AM/PM format
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

                return (
                  parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp)
                );
              })
              .slice(0, 4); // Show only 4 recent scans

            console.log("Final sorted scans:", sortedScans);
            setRecentScans(sortedScans);
          }
        } else {
          console.error("Failed to fetch recent scans");
          if (isMounted) {
            setRecentScans([]);
          }
        }
      } catch (error) {
        console.error("Error fetching recent scans:", error);
        if (isMounted) {
          setRecentScans([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentScans();

    return () => {
      isMounted = false;
    };
  }, [farmId, farmers]);

  // Get disease icon based on prediction
  const getDiseaseIcon = (prediction) => {
    const diseaseIcons = {
      Healthy: "🟢",
      "Ring Spot Virus": "🟠",
      Anthracnose: "🔴",
      "Powdery Mildew": "🔵",
    };
    return diseaseIcons[prediction] || "📊";
  };

  // Get status color based on prediction
  const getStatusColor = (prediction) => {
    if (prediction === "Healthy") {
      return "text-green-600";
    }
    return "text-red-600";
  };

  // Format date and time properly with 12-hour format
  const formatDateTime = (timestamp) => {
    try {
      if (!timestamp) return "";

      // Handle MM/DD/YYYY HH:MM AM/PM format
      const [datePart, timePart, period] = timestamp.split(/\s+/);

      if (!datePart || !timePart || !period) {
        return timestamp;
      }

      const [month, day, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");

      // Validate parsed values
      if (!month || !day || !year || !hours || !minutes) {
        return timestamp;
      }

      // Format as MM/DD/YY HH:MM AM/PM
      const shortYear = year.slice(-2);
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      const formattedHours = hours.padStart(2, "0");
      const formattedMinutes = minutes.padStart(2, "0");

      return `${formattedMonth}/${formattedDay}/${shortYear} ${formattedHours}:${formattedMinutes} ${period}`;
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return timestamp;
    }
  };

  // Handle image error by setting a fallback
  const handleImageError = (e) => {
    e.target.style.display = "none";
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = "flex";
    }
  };

  // Get farmer name by idNumber
  const getFarmerName = (idNumber) => {
    const farmer = farmers.find((f) => f.idNumber === idNumber);
    return farmer
      ? farmer.fullName || farmer.firstname || `Farmer ${idNumber}`
      : `ID: ${idNumber}`;
  };

  // Calculate fixed height to match FarmAnalytics
  const FIXED_HEIGHT = "590px";

  if (loading) {
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
        <div className="flex-1 flex flex-col">
          {/* Scan items container - fixed size for 4 items */}
          <div className="space-y-4" style={{ minHeight: "400px" }}>
            {recentScans.map((scan, index) => (
              <div
                key={`${scan.id || scan.timestamp}-${index}`}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ minHeight: "80px" }}
              >
                {/* Scan Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={scan.imageUrl}
                    alt="Scan"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    onError={handleImageError}
                  />
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-200 items-center justify-center text-gray-400 text-xs hidden"
                    style={{ display: "none" }}
                  >
                    No Image
                  </div>
                  <div className="absolute -top-1 -right-1 text-lg">
                    {getDiseaseIcon(scan.prediction)}
                  </div>
                </div>

                {/* Scan Details */}
                <div className="flex-1 min-w-0">
                  {/* Disease Name */}
                  <p
                    className={`font-semibold text-sm mb-1 ${getStatusColor(
                      scan.prediction
                    )}`}
                  >
                    {scan.prediction}
                  </p>

                  {/* Date and Time */}
                  <p className="text-xs text-gray-600 mb-1">
                    {formatDateTime(scan.timestamp)}
                  </p>

                  {/* Farmer Name */}
                  <p className="text-xs text-gray-500">
                    By: {getFarmerName(scan.idNumber)}
                  </p>

                  {/* Scan ID if available */}
                  {scan.id && (
                    <p className="text-xs text-gray-400 mt-1">
                      Scan: #{scan.id.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Add placeholder items if less than 4 scans to maintain consistent height */}
            {Array.from({ length: Math.max(0, 4 - recentScans.length) }).map(
              (_, index) => (
                <div
                  key={`placeholder-${index}`}
                  style={{ minHeight: "80px" }}
                  className="opacity-0"
                >
                  {/* Invisible placeholder to maintain layout */}
                </div>
              )
            )}
          </div>

          {/* Footer info - fixed at bottom */}
          <div
            className="mt-4 pt-3 border-t border-gray-200 text-center"
            style={{ minHeight: "40px" }}
          >
            <p className="text-xs text-gray-500">
              {recentScans.length > 0
                ? `Showing ${recentScans.length} most recent scans`
                : "No scans from assigned farmers yet"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { Leaf } from "lucide-react";

// export default function RecentScans({ farmId }) {
//   const [recentScans, setRecentScans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [farmers, setFarmers] = useState([]);

//   // First fetch farmers for this farm to get their names
//   useEffect(() => {
//     if (!farmId) return;

//     let isMounted = true;

//     const fetchFarmers = async () => {
//       try {
//         const response = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log("Farmers data:", data);
//           if (isMounted && data.status === "success") {
//             setFarmers(data.farmers || []);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching farmers:", error);
//       }
//     };

//     fetchFarmers();

//     return () => {
//       isMounted = false;
//     };
//   }, [farmId]);

//   // Fetch recent scans for the farm - only scans by assigned farmers
//   useEffect(() => {
//     if (!farmId || farmers.length === 0) return;

//     let isMounted = true;

//     const fetchRecentScans = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/identification-history/${farmId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log("All scans data:", data);

//           if (isMounted) {
//             // Get list of farmer idNumbers for this farm
//             const farmerIdNumbers = farmers.map((farmer) => farmer.idNumber);
//             console.log("Farmer ID numbers:", farmerIdNumbers);

//             // Filter scans to only include those made by assigned farmers
//             const filteredScans = (data || []).filter((scan) => {
//               const isAssignedFarmer = farmerIdNumbers.includes(scan.idNumber);
//               if (!isAssignedFarmer) {
//                 console.log(
//                   `Scan by ${scan.idNumber} filtered out - not assigned to this farm`
//                 );
//               }
//               return isAssignedFarmer;
//             });

//             console.log("Filtered scans:", filteredScans);

//             // Sort by timestamp (most recent first) and take only 5 scans
//             const sortedScans = filteredScans
//               .sort((a, b) => {
//                 // Handle MM/DD/YYYY HH:MM AM/PM format
//                 const parseTimestamp = (timestamp) => {
//                   if (!timestamp) return new Date(0);

//                   try {
//                     const [datePart, timePart, period] = timestamp.split(/\s+/);
//                     const [month, day, year] = datePart.split("/");
//                     const [hours, minutes] = timePart.split(":");

//                     let hour24 = parseInt(hours);
//                     if (period === "PM" && hour24 !== 12) hour24 += 12;
//                     if (period === "AM" && hour24 === 12) hour24 = 0;

//                     return new Date(year, month - 1, day, hour24, minutes);
//                   } catch (error) {
//                     return new Date(timestamp);
//                   }
//                 };

//                 return (
//                   parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp)
//                 );
//               })
//               .slice(0, 4); // Show only 5 recent scans

//             console.log("Final sorted scans:", sortedScans);
//             setRecentScans(sortedScans);
//           }
//         } else {
//           console.error("Failed to fetch recent scans");
//           if (isMounted) {
//             setRecentScans([]);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching recent scans:", error);
//         if (isMounted) {
//           setRecentScans([]);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchRecentScans();

//     return () => {
//       isMounted = false;
//     };
//   }, [farmId, farmers]);

//   // Get disease icon based on prediction
//   const getDiseaseIcon = (prediction) => {
//     const diseaseIcons = {
//       Healthy: "🟢",
//       "Ring Spot Virus": "🟠",
//       Anthracnose: "🔴",
//       "Powdery Mildew": "🔵",
//     };
//     return diseaseIcons[prediction] || "📊";
//   };

//   // Get status color based on prediction
//   const getStatusColor = (prediction) => {
//     if (prediction === "Healthy") {
//       return "text-green-600";
//     }
//     return "text-red-600";
//   };

//   // Format date/time to be more compact
//   const formatDateTime = (timestamp) => {
//     try {
//       // Handle different timestamp formats
//       let date;
//       if (timestamp.includes("/")) {
//         // MM/DD/YYYY format from API
//         const [datePart, timePart] = timestamp.split(" ");
//         const [month, day, year] = datePart.split("/");
//         const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
//           2,
//           "0"
//         )}`;

//         if (timePart) {
//           const [time, period] = timePart.split(/\s+/);
//           let [hours, minutes] = time.split(":");
//           if (period === "PM" && hours !== "12") {
//             hours = parseInt(hours) + 12;
//           } else if (period === "AM" && hours === "12") {
//             hours = "00";
//           }
//           date = new Date(`${dateStr}T${hours.padStart(2, "0")}:${minutes}:00`);
//         } else {
//           date = new Date(dateStr);
//         }
//       } else {
//         date = new Date(timestamp);
//       }

//       if (isNaN(date.getTime())) {
//         return timestamp; // Return original if parsing fails
//       }

//       // Format as MM/DD/YY
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       const year = String(date.getFullYear()).slice(-2);

//       return `${month}/${day}/${year}`;
//     } catch (error) {
//       return timestamp;
//     }
//   };

//   // Handle image error by setting a fallback
//   const handleImageError = (e) => {
//     e.target.style.display = "none";
//     e.target.nextSibling.style.display = "flex";
//   };

//   // Get farmer name by idNumber
//   const getFarmerName = (idNumber) => {
//     const farmer = farmers.find((f) => f.idNumber === idNumber);
//     return farmer
//       ? farmer.fullName || farmer.name || `Farmer ${idNumber}`
//       : `ID: ${idNumber}`;
//   };

//   // Calculate fixed height to match FarmAnalytics
//   const FIXED_HEIGHT = "590px";

//   if (loading) {
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
//         <div className="flex-1 flex flex-col">
//           {/* Scan items container - fixed size for 5 items */}
//           <div className="space-y-4" style={{ minHeight: "400px" }}>
//             {recentScans.map((scan, index) => (
//               <div
//                 key={`${scan.id || scan.timestamp}-${index}`}
//                 className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                 style={{ minHeight: "80px" }}
//               >
//                 {/* Scan Image */}
//                 <div className="relative flex-shrink-0">
//                   <img
//                     src={scan.imageUrl}
//                     alt="Scan"
//                     className="w-16 h-16 rounded-lg object-cover border border-gray-200"
//                     onError={handleImageError}
//                   />
//                   <div
//                     className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-200 items-center justify-center text-gray-400 text-xs hidden"
//                     style={{ display: "none" }}
//                   >
//                     No Image
//                   </div>
//                   <div className="absolute -top-1 -right-1 text-lg">
//                     {getDiseaseIcon(scan.prediction)}
//                   </div>
//                 </div>

//                 {/* Scan Details */}
//                 <div className="flex-1 min-w-0">
//                   {/* Disease Name */}
//                   <p
//                     className={`font-semibold text-sm mb-1 ${getStatusColor(
//                       scan.prediction
//                     )}`}
//                   >
//                     {scan.prediction}
//                   </p>

//                   {/* Date */}
//                   <p className="text-xs text-gray-600 mb-1">
//                     {formatDateTime(scan.timestamp)}
//                   </p>

//                   {/* Farmer Name */}
//                   <p className="text-xs text-gray-500">
//                     By: {getFarmerName(scan.idNumber)}
//                   </p>

//                   {/* Scan ID if available */}
//                   {scan.id && (
//                     <p className="text-xs text-gray-400 mt-1">
//                       Scan: #{scan.id.slice(-8)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {/* Add placeholder items if less than 5 scans to maintain consistent height */}
//             {Array.from({ length: Math.max(0, 4 - recentScans.length) }).map(
//               (_, index) => (
//                 <div
//                   key={`placeholder-${index}`}
//                   style={{ minHeight: "80px" }}
//                   className="opacity-0"
//                 >
//                   {/* Invisible placeholder to maintain layout */}
//                 </div>
//               )
//             )}
//           </div>

//           {/* Footer info - fixed at bottom */}
//           <div
//             className="mt-4 pt-3 border-t border-gray-200 text-center"
//             style={{ minHeight: "40px" }}
//           >
//             <p className="text-xs text-gray-500">
//               {recentScans.length > 0
//                 ? `Showing ${recentScans.length} most recent scans`
//                 : "No scans from assigned farmers yet"}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
