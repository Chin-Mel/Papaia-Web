//new
import { useState, useEffect } from "react";

export default function RecentActivities({ limit = 5 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setError("Authentication token not found");
        setActivities([]);
        return;
      }

      console.log("Fetching activities...");

      const res = await fetch(
        "https://papaiaapi.onrender.com/api/owner/activities",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Activities API response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (
          res.status === 404 ||
          errorData.message?.includes("No activities found")
        ) {
          console.log("No activities found");
          setActivities([]);
          return;
        }

        console.error("Activities API error:", res.status, errorData);
        setError(errorData.message || `API Error: ${res.status}`);
        setActivities([]);
        return;
      }

      const data = await res.json();
      console.log("Activities response:", data);

      if (data.status === "success" && Array.isArray(data.activities)) {
        const mapped = data.activities.slice(0, limit).map((act) => {
          let style = {
            icon: "ℹ️",
            iconBg: "bg-gray-100",
            bgColor: "bg-gray-50",
            title: "Activity",
            description: act.action,
          };

          // Helper function to get farm name
          const getFarmName = () => {
            return (
              act.details?.farmName || act.details?.farmId || "Unknown Farm"
            );
          };

          // Helper function to get farmer name
          const getFarmerName = () => {
            if (act.details?.farmerName) return act.details.farmerName;
            if (act.details?.idNumber) return act.details.idNumber;
            if (act.details?.farmerId) return act.details.farmerId;
            return "Unknown Farmer";
          };

          // Map action types to display styles with actual names
          switch (act.action) {
            case "ADD_FARM":
              style = {
                icon: "🌱",
                iconBg: "bg-green-100",
                bgColor: "bg-green-50",
                title: "Farm Added",
                description: `Added farm "${getFarmName()}"`,
              };
              break;
            case "REMOVE_FARMER":
              const farmerName = getFarmerName();
              const farmNameForRemove = act.details?.farmName;
              style = {
                icon: "👤",
                iconBg: "bg-red-100",
                bgColor: "bg-red-50",
                title: "Farmer Removed",
                description: farmNameForRemove
                  ? `Removed farmer "${farmerName}" from "${farmNameForRemove}"`
                  : `Removed farmer "${farmerName}"`,
              };
              break;
            case "DEACTIVATE_FARM":
              style = {
                icon: "🚫",
                iconBg: "bg-orange-100",
                bgColor: "bg-orange-50",
                title: "Farm Deactivated",
                description: `Deactivated farm "${getFarmName()}"`,
              };
              break;
            case "ACTIVATE_FARM":
              style = {
                icon: "✅",
                iconBg: "bg-blue-100",
                bgColor: "bg-blue-50",
                title: "Farm Activated",
                description: `Activated farm "${getFarmName()}"`,
              };
              break;
            case "ADD_FARMER":
              const addedFarmerName = getFarmerName();
              const farmNameForAdd = act.details?.farmName;
              style = {
                icon: "👨‍🌾",
                iconBg: "bg-green-100",
                bgColor: "bg-green-50",
                title: "Farmer Added",
                description: farmNameForAdd
                  ? `Added farmer "${addedFarmerName}" to "${farmNameForAdd}"`
                  : `Added farmer "${addedFarmerName}"`,
              };
              break;
            case "UPDATE_FARM":
              style = {
                icon: "🔄",
                iconBg: "bg-blue-100",
                bgColor: "bg-blue-50",
                title: "Farm Updated",
                description: `Updated farm "${getFarmName()}"`,
              };
              break;
            case "UPDATE_PROFILE":
            case "UPDATE_USER":
              style = {
                icon: "✏️",
                iconBg: "bg-purple-100",
                bgColor: "bg-purple-50",
                title: "Profile Updated",
                description:
                  act.details?.description || "Updated profile information",
              };
              break;
            case "DEACTIVATE_ACCOUNT":
              style = {
                icon: "⏸️",
                iconBg: "bg-gray-100",
                bgColor: "bg-gray-50",
                title: "Account Deactivated",
                description: "Account has been temporarily deactivated",
              };
              break;
            case "REACTIVATE_ACCOUNT":
              style = {
                icon: "▶️",
                iconBg: "bg-green-100",
                bgColor: "bg-green-50",
                title: "Account Reactivated",
                description: "Account has been reactivated",
              };
              break;
            case "DELETE_FARM":
              style = {
                icon: "🗑️",
                iconBg: "bg-red-100",
                bgColor: "bg-red-50",
                title: "Farm Deleted",
                description: `Deleted farm "${getFarmName()}"`,
              };
              break;
            case "CHANGE_PASSWORD":
              style = {
                icon: "🔐",
                iconBg: "bg-yellow-100",
                bgColor: "bg-yellow-50",
                title: "Password Changed",
                description: "Account password was updated",
              };
              break;
            default:
              style.description = act.action.replace(/_/g, " ").toLowerCase();
          }

          // Format the time from MM/DD/YYYY hh:mm AM/PM format
          const formatTime = (timeString) => {
            try {
              if (!timeString) return "Unknown time";

              const parts = timeString.split(/\s+/);
              if (parts.length < 3) return timeString;

              const [datePart, timePart, period] = parts;
              const [month, day, year] = datePart.split("/");
              const [hours, minutes] = timePart.split(":");

              let hour24 = parseInt(hours);
              if (period === "PM" && hour24 !== 12) hour24 += 12;
              if (period === "AM" && hour24 === 12) hour24 = 0;

              const parsedDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                hour24,
                parseInt(minutes)
              );

              if (isNaN(parsedDate.getTime())) {
                return timeString;
              }

              const now = new Date();
              const diffMs = now - parsedDate;
              const diffMins = Math.floor(diffMs / (1000 * 60));
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

              if (diffMins < 1) return "Just now";
              if (diffMins < 60)
                return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
              if (diffHours < 24)
                return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
              if (diffDays < 7)
                return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

              return parsedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year:
                  parsedDate.getFullYear() !== now.getFullYear()
                    ? "numeric"
                    : undefined,
              });
            } catch (error) {
              console.error("Error parsing time:", error, timeString);
              return timeString || "Unknown time";
            }
          };

          return {
            ...style,
            time: formatTime(act.createdAt),
            id: act.id,
          };
        });

        console.log("Mapped activities:", mapped);
        setActivities(mapped);
      } else {
        console.log("No activities data in response");
        setActivities([]);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      setError(`Network error: ${err.message}`);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  const fallbackActivities = [
    {
      icon: "ℹ️",
      iconBg: "bg-purple-100",
      bgColor: "bg-purple-50",
      title: "System Ready",
      description: "No activities yet. Start by adding a farm!",
      time: "Now",
      id: "fallback-1",
    },
  ];

  const activitiesToShow =
    activities.length > 0 ? activities : fallbackActivities;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Recent Activities
        </h2>
        {error && (
          <button
            onClick={fetchActivities}
            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-sm text-gray-500">Loading activities...</div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-sm text-red-500 mb-2">
            Failed to load activities: {error}
          </p>
          <button
            onClick={fetchActivities}
            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activitiesToShow.map((act, idx) => (
            <div
              key={act.id || idx}
              className={`p-4 rounded-xl ${act.bgColor} border border-gray-100`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${act.iconBg} flex items-center justify-center text-xs sm:text-sm flex-shrink-0`}
                >
                  {act.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-gray-800">
                    {act.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 break-words">
                    {act.description}
                  </p>
                  <span className="text-[10px] sm:text-xs text-gray-500 mt-1 block">
                    {act.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            No recent activities found. Activities will appear here when you
            perform actions like adding farms or managing farmers.
          </p>
        </div>
      )}
    </div>
  );
}

//old
// import { useState, useEffect } from "react";

// export default function RecentActivities({ limit = 5 }) {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchActivities = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         setError("Authentication token not found");
//         setActivities([]);
//         return;
//       }

//       console.log("Fetching activities...");

//       const res = await fetch(
//         "https://papaiaapi.onrender.com/api/owner/activities",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Activities API response status:", res.status);

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         if (
//           res.status === 404 ||
//           errorData.message?.includes("No activities found")
//         ) {
//           console.log("No activities found");
//           setActivities([]);
//           return;
//         }

//         console.error("Activities API error:", res.status, errorData);
//         setError(errorData.message || `API Error: ${res.status}`);
//         setActivities([]);
//         return;
//       }

//       const data = await res.json();
//       console.log("Activities response:", data);

//       // Handle the updated API response format
//       if (data.status === "success" && Array.isArray(data.activities)) {
//         const mapped = data.activities.slice(0, limit).map((act) => {
//           let style = {
//             icon: "ℹ️",
//             iconBg: "bg-gray-100",
//             bgColor: "bg-gray-50",
//             title: "Activity",
//             description: act.action,
//           };

//           // Map action types to display styles
//           switch (act.action) {
//             case "ADD_FARM":
//               style = {
//                 icon: "🌱",
//                 iconBg: "bg-green-100",
//                 bgColor: "bg-green-50",
//                 title: "Farm Added",
//                 description: `Added farm "${
//                   act.details?.farmName || "Unknown Farm"
//                 }"`,
//               };
//               break;
//             case "REMOVE_FARMER":
//               style = {
//                 icon: "👤",
//                 iconBg: "bg-red-100",
//                 bgColor: "bg-red-50",
//                 title: "Farmer Removed",
//                 description: `Removed farmer "${
//                   act.details?.farmerName ||
//                   act.details?.farmerId ||
//                   "Unknown Farmer"
//                 }"${
//                   act.details?.farmName
//                     ? ` from farm "${act.details.farmName}"`
//                     : ""
//                 }`,
//               };
//               break;
//             case "DEACTIVATE_FARM":
//               style = {
//                 icon: "🚫",
//                 iconBg: "bg-orange-100",
//                 bgColor: "bg-orange-50",
//                 title: "Farm Deactivated",
//                 description: `Deactivated farm "${
//                   act.details?.farmName || "Unknown Farm"
//                 }"`,
//               };
//               break;
//             case "ACTIVATE_FARM":
//               style = {
//                 icon: "✅",
//                 iconBg: "bg-blue-100",
//                 bgColor: "bg-blue-50",
//                 title: "Farm Activated",
//                 description: `Activated farm "${
//                   act.details?.farmName || "Unknown Farm"
//                 }"`,
//               };
//               break;
//             case "ADD_FARMER":
//               style = {
//                 icon: "👨‍🌾",
//                 iconBg: "bg-green-100",
//                 bgColor: "bg-green-50",
//                 title: "Farmer Added",
//                 description: `Added farmer "${
//                   act.details?.farmerName ||
//                   act.details?.idNumber ||
//                   "Unknown Farmer"
//                 }"${
//                   act.details?.farmName
//                     ? ` to farm "${act.details.farmName}"`
//                     : ""
//                 }`,
//               };
//               break;
//             case "UPDATE_FARM":
//               style = {
//                 icon: "🔄",
//                 iconBg: "bg-blue-100",
//                 bgColor: "bg-blue-50",
//                 title: "Farm Updated",
//                 description: `Updated farm "${
//                   act.details?.farmName || "Unknown Farm"
//                 }"`,
//               };
//               break;
//             case "UPDATE_PROFILE":
//             case "UPDATE_USER":
//               style = {
//                 icon: "✏️",
//                 iconBg: "bg-purple-100",
//                 bgColor: "bg-purple-50",
//                 title: "Profile Updated",
//                 description:
//                   act.details?.description || "Updated profile information",
//               };
//               break;
//             case "DEACTIVATE_ACCOUNT":
//               style = {
//                 icon: "⏸️",
//                 iconBg: "bg-gray-100",
//                 bgColor: "bg-gray-50",
//                 title: "Account Deactivated",
//                 description: "Account has been temporarily deactivated",
//               };
//               break;
//             case "REACTIVATE_ACCOUNT":
//               style = {
//                 icon: "▶️",
//                 iconBg: "bg-green-100",
//                 bgColor: "bg-green-50",
//                 title: "Account Reactivated",
//                 description: "Account has been reactivated",
//               };
//               break;
//             case "DELETE_FARM":
//               style = {
//                 icon: "🗑️",
//                 iconBg: "bg-red-100",
//                 bgColor: "bg-red-50",
//                 title: "Farm Deleted",
//                 description: `Deleted farm "${
//                   act.details?.farmName || "Unknown Farm"
//                 }"`,
//               };
//               break;
//             case "CHANGE_PASSWORD":
//               style = {
//                 icon: "🔐",
//                 iconBg: "bg-yellow-100",
//                 bgColor: "bg-yellow-50",
//                 title: "Password Changed",
//                 description: "Account password was updated",
//               };
//               break;
//             default:
//               style.description = act.action.replace(/_/g, " ").toLowerCase();
//           }

//           // Format the time from MM/DD/YYYY hh:mm AM/PM format
//           const formatTime = (timeString) => {
//             try {
//               if (!timeString) return "Unknown time";

//               // Parse MM/DD/YYYY hh:mm AM/PM format
//               const parts = timeString.split(/\s+/);
//               if (parts.length < 3) return timeString; // Invalid format

//               const [datePart, timePart, period] = parts;
//               const [month, day, year] = datePart.split("/");
//               const [hours, minutes] = timePart.split(":");

//               let hour24 = parseInt(hours);
//               if (period === "PM" && hour24 !== 12) hour24 += 12;
//               if (period === "AM" && hour24 === 12) hour24 = 0;

//               const parsedDate = new Date(
//                 parseInt(year),
//                 parseInt(month) - 1,
//                 parseInt(day),
//                 hour24,
//                 parseInt(minutes)
//               );

//               if (isNaN(parsedDate.getTime())) {
//                 return timeString; // Return original if parsing fails
//               }

//               const now = new Date();
//               const diffMs = now - parsedDate;
//               const diffMins = Math.floor(diffMs / (1000 * 60));
//               const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//               const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//               if (diffMins < 1) return "Just now";
//               if (diffMins < 60)
//                 return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
//               if (diffHours < 24)
//                 return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//               if (diffDays < 7)
//                 return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

//               return parsedDate.toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year:
//                   parsedDate.getFullYear() !== now.getFullYear()
//                     ? "numeric"
//                     : undefined,
//               });
//             } catch (error) {
//               console.error("Error parsing time:", error, timeString);
//               return timeString || "Unknown time";
//             }
//           };

//           return {
//             ...style,
//             time: formatTime(act.createdAt),
//             id: act.id,
//           };
//         });

//         console.log("Mapped activities:", mapped);
//         setActivities(mapped);
//       } else {
//         // Handle case where no activities exist yet
//         console.log("No activities data in response");
//         setActivities([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch activities:", err);
//       setError(`Network error: ${err.message}`);
//       setActivities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, [limit]);

//   const fallbackActivities = [
//     {
//       icon: "ℹ️",
//       iconBg: "bg-purple-100",
//       bgColor: "bg-purple-50",
//       title: "System Ready",
//       description: "No activities yet. Start by adding a farm!",
//       time: "Now",
//       id: "fallback-1",
//     },
//   ];

//   const activitiesToShow =
//     activities.length > 0 ? activities : fallbackActivities;

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
//       <div className="flex justify-between items-center mb-3 sm:mb-4">
//         <h2 className="text-base sm:text-lg font-bold text-gray-800">
//           Recent Activities
//         </h2>
//         {error && (
//           <button
//             onClick={fetchActivities}
//             className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
//           >
//             Retry
//           </button>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-8">
//           <div className="text-sm text-gray-500">Loading activities...</div>
//         </div>
//       ) : error ? (
//         <div className="text-center py-4">
//           <p className="text-sm text-red-500 mb-2">
//             Failed to load activities: {error}
//           </p>
//           <button
//             onClick={fetchActivities}
//             className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {activitiesToShow.map((act, idx) => (
//             <div
//               key={act.id || idx}
//               className={`p-4 rounded-xl ${act.bgColor} border border-gray-100`}
//             >
//               <div className="flex items-start gap-3">
//                 <div
//                   className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${act.iconBg} flex items-center justify-center text-xs sm:text-sm flex-shrink-0`}
//                 >
//                   {act.icon}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-xs sm:text-sm text-gray-800">
//                     {act.title}
//                   </p>
//                   <p className="text-xs text-gray-600 mt-1 break-words">
//                     {act.description}
//                   </p>
//                   <span className="text-[10px] sm:text-xs text-gray-500 mt-1 block">
//                     {act.time}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!loading && !error && activities.length === 0 && (
//         <div className="text-center py-4">
//           <p className="text-sm text-gray-500">
//             No recent activities found. Activities will appear here when you
//             perform actions like adding farms or managing farmers.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
