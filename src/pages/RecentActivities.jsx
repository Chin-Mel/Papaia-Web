//new
// import { useState, useEffect, useMemo } from "react";

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
//         setError("Authentication required");
//         setActivities([]);
//         setLoading(false);
//         return;
//       }

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

//       if (!res.ok) {
//         if (res.status === 404) {
//           setActivities([]);
//           setLoading(false);
//           return;
//         }
//         throw new Error(`API Error: ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.status === "success" && Array.isArray(data.activities)) {
//         setActivities(data.activities.slice(0, limit));
//       } else {
//         setActivities([]);
//       }
//     } catch (err) {
//       setError(err.message);
//       setActivities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, [limit]);

//   // Memoized time formatter for better performance
//   const formatTime = useMemo(() => {
//     return (timeString) => {
//       if (!timeString) return "Unknown time";

//       try {
//         const parts = timeString.split(/\s+/);
//         if (parts.length < 3) return timeString;

//         const [datePart, timePart, period] = parts;
//         const [month, day, year] = datePart.split("/");
//         const [hours, minutes] = timePart.split(":");

//         let hour24 = parseInt(hours);
//         if (period === "PM" && hour24 !== 12) hour24 += 12;
//         if (period === "AM" && hour24 === 12) hour24 = 0;

//         const date = new Date(
//           parseInt(year),
//           parseInt(month) - 1,
//           parseInt(day),
//           hour24,
//           parseInt(minutes)
//         );

//         if (isNaN(date.getTime())) return timeString;

//         const now = new Date();
//         const diffMs = now - date;
//         const diffMins = Math.floor(diffMs / 60000);
//         const diffHours = Math.floor(diffMs / 3600000);
//         const diffDays = Math.floor(diffMs / 86400000);

//         if (diffMins < 1) return "Just now";
//         if (diffMins < 60) return `${diffMins}m ago`;
//         if (diffHours < 24) return `${diffHours}h ago`;
//         if (diffDays < 7) return `${diffDays}d ago`;

//         return date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         });
//       } catch {
//         return timeString;
//       }
//     };
//   }, []);

//   // Memoized activity style mapper
//   const getActivityStyle = (action, details) => {
//     const farmName = details?.farmName || "Unknown Farm";
//     const farmerName =
//       details?.farmerName || details?.idNumber || "Unknown Farmer";

//     const styles = {
//       ADD_FARM: {
//         icon: "🌱",
//         iconBg: "bg-green-100",
//         bgColor: "bg-green-50",
//         title: "Farm Added",
//         mainText: farmName,
//         subText: "",
//       },
//       DELETE_FARM: {
//         icon: "🗑️",
//         iconBg: "bg-red-100",
//         bgColor: "bg-red-50",
//         title: "Farm Deleted",
//         mainText: farmName,
//         subText: "",
//       },
//       UPDATE_FARM: {
//         icon: "🔄",
//         iconBg: "bg-blue-100",
//         bgColor: "bg-blue-50",
//         title: "Farm Updated",
//         mainText: farmName,
//         subText: "",
//       },
//       ACTIVE_FARM: {
//         icon: "✅",
//         iconBg: "bg-green-100",
//         bgColor: "bg-green-50",
//         title: "Farm Activated",
//         mainText: farmName,
//         subText: details?.previousStatus
//           ? `from ${details.previousStatus}`
//           : "",
//       },
//       INACTIVE_FARM: {
//         icon: "⏸️",
//         iconBg: "bg-orange-100",
//         bgColor: "bg-orange-50",
//         title: "Farm Deactivated",
//         mainText: farmName,
//         subText: details?.previousStatus
//           ? `from ${details.previousStatus}`
//           : "",
//       },
//       ADD_FARMER: {
//         icon: "👨‍🌾",
//         iconBg: "bg-green-100",
//         bgColor: "bg-green-50",
//         title: "Farmer Added",
//         mainText: farmerName,
//         subText: farmName ? `to ${farmName}` : "",
//       },
//       REMOVE_FARMER: {
//         icon: "👤",
//         iconBg: "bg-red-100",
//         bgColor: "bg-red-50",
//         title: "Farmer Removed",
//         mainText: farmerName,
//         subText: farmName ? `from ${farmName}` : "",
//       },
//       UPDATE_PROFILE: {
//         icon: "✏️",
//         iconBg: "bg-purple-100",
//         bgColor: "bg-purple-50",
//         title: "Profile Updated",
//         mainText: details?.description || "Profile information updated",
//         subText: "",
//       },
//       CHANGE_PASSWORD: {
//         icon: "🔐",
//         iconBg: "bg-yellow-100",
//         bgColor: "bg-yellow-50",
//         title: "Password Changed",
//         mainText: "Account security updated",
//         subText: "",
//       },
//       DEACTIVATE_ACCOUNT: {
//         icon: "⏸️",
//         iconBg: "bg-gray-100",
//         bgColor: "bg-gray-50",
//         title: "Account Deactivated",
//         mainText: "Account temporarily deactivated",
//         subText: "",
//       },
//       REACTIVATE_ACCOUNT: {
//         icon: "▶️",
//         iconBg: "bg-green-100",
//         bgColor: "bg-green-50",
//         title: "Account Reactivated",
//         mainText: "Account is now active",
//         subText: "",
//       },
//     };

//     return (
//       styles[action] || {
//         icon: "ℹ️",
//         iconBg: "bg-gray-100",
//         bgColor: "bg-gray-50",
//         title: "Activity",
//         mainText: action.replace(/_/g, " ").toLowerCase(),
//         subText: "",
//       }
//     );
//   };

//   // Memoized processed activities
//   const processedActivities = useMemo(() => {
//     if (activities.length === 0) {
//       return [
//         {
//           icon: "ℹ️",
//           iconBg: "bg-purple-100",
//           bgColor: "bg-purple-50",
//           title: "System Ready",
//           mainText: "No activities yet. Start by adding a farm!",
//           subText: "",
//           time: "Now",
//           id: "fallback",
//         },
//       ];
//     }

//     return activities.map((act) => ({
//       ...getActivityStyle(act.action, act.details),
//       time: formatTime(act.createdAt),
//       id: act.id || act.createdAt,
//     }));
//   }, [activities, formatTime]);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
//         <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//           Recent Activities
//         </h2>
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
//       <div className="flex justify-between items-center mb-3 sm:mb-4">
//         <h2 className="text-base sm:text-lg font-bold text-gray-800">
//           Recent Activities
//         </h2>
//         {error && (
//           <button
//             onClick={fetchActivities}
//             className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             Retry
//           </button>
//         )}
//       </div>

//       {error ? (
//         <div className="text-center py-6">
//           <p className="text-sm text-red-500 mb-2">Failed to load activities</p>
//           <button
//             onClick={fetchActivities}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {processedActivities.map((act) => (
//             <div
//               key={act.id}
//               className={`${act.bgColor} rounded-xl p-4 border border-gray-100 transition-shadow hover:shadow-md`}
//             >
//               <div className="flex items-start gap-3">
//                 <div
//                   className={`${act.iconBg} w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0`}
//                 >
//                   {act.icon}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-sm text-gray-800">
//                     {act.title}
//                   </p>
//                   <p className="text-xs text-gray-600 mt-1 break-words">
//                     {act.mainText}
//                   </p>
//                   {act.subText && (
//                     <p className="text-xs text-gray-500 mt-0.5">
//                       {act.subText}
//                     </p>
//                   )}
//                   <span className="text-xs text-gray-400 mt-1 block">
//                     {act.time}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

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

import { useState, useEffect, useRef, useCallback } from "react";

// Activity cache with in-memory storage
const activityCache = {
  data: null,
  timestamp: 0,
  ttl: 300000, // 5 minutes

  set(value) {
    this.data = value;
    this.timestamp = Date.now();
  },

  get() {
    if (this.data && Date.now() - this.timestamp < this.ttl) {
      return this.data;
    }
    return null;
  },

  clear() {
    this.data = null;
    this.timestamp = 0;
  },
};

export default function RecentActivities({ limit = 5 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  // Format timestamp to relative time
  const formatTime = useCallback((timeString) => {
    if (!timeString) return "Now";
    try {
      const parts = timeString.split(/\s+/);
      if (parts.length < 3) return timeString;

      const [datePart, timePart, period] = parts;
      const [month, day, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");

      let hour24 = parseInt(hours);
      if (period === "PM" && hour24 !== 12) hour24 += 12;
      if (period === "AM" && hour24 === 12) hour24 = 0;

      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hour24,
        parseInt(minutes)
      );

      if (isNaN(date.getTime())) return timeString;

      const diffMins = Math.floor((Date.now() - date) / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return `${Math.floor(diffMins / 1440)}d ago`;
    } catch {
      return timeString;
    }
  }, []);

  // Get activity display style based on action type
  const getActivityStyle = useCallback((action, details) => {
    const farmName = details?.farmName || "Unknown Farm";
    const farmerName =
      details?.farmerName || details?.idNumber || "Unknown Farmer";

    const styles = {
      ADD_FARM: {
        icon: "🌱",
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        title: "Farm Added",
        text: farmName,
        subText: "",
      },
      DELETE_FARM: {
        icon: "🗑️",
        bg: "bg-red-50",
        iconBg: "bg-red-100",
        title: "Farm Deleted",
        text: farmName,
        subText: "",
      },
      UPDATE_FARM: {
        icon: "🔄",
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        title: "Farm Updated",
        text: farmName,
        subText: "",
      },
      ACTIVE_FARM: {
        icon: "✅",
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        title: "Farm Activated",
        text: farmName,
        subText: details?.previousStatus
          ? `from ${details.previousStatus}`
          : "",
      },
      INACTIVE_FARM: {
        icon: "⏸️",
        bg: "bg-orange-50",
        iconBg: "bg-orange-100",
        title: "Farm Deactivated",
        text: farmName,
        subText: details?.previousStatus
          ? `from ${details.previousStatus}`
          : "",
      },
      ADD_FARMER: {
        icon: "👨‍🌾",
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        title: "Farmer Added",
        text: farmerName,
        subText: farmName ? `to ${farmName}` : "",
      },
      REMOVE_FARMER: {
        icon: "👤",
        bg: "bg-red-50",
        iconBg: "bg-red-100",
        title: "Farmer Removed",
        text: farmerName,
        subText: farmName ? `from ${farmName}` : "",
      },
      UPDATE_PROFILE: {
        icon: "✏️",
        bg: "bg-purple-50",
        iconBg: "bg-purple-100",
        title: "Profile Updated",
        text: details?.description || "Profile information updated",
        subText: "",
      },
      CHANGE_PASSWORD: {
        icon: "🔐",
        bg: "bg-yellow-50",
        iconBg: "bg-yellow-100",
        title: "Password Changed",
        text: "Account security updated",
        subText: "",
      },
      DEACTIVATE_ACCOUNT: {
        icon: "⏸️",
        bg: "bg-gray-50",
        iconBg: "bg-gray-100",
        title: "Account Deactivated",
        text: "Account temporarily deactivated",
        subText: "",
      },
      REACTIVATE_ACCOUNT: {
        icon: "▶️",
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        title: "Account Reactivated",
        text: "Account is now active",
        subText: "",
      },
    };

    return (
      styles[action] || {
        icon: "ℹ️",
        bg: "bg-gray-50",
        iconBg: "bg-gray-100",
        title: "Activity",
        text: action.replace(/_/g, " ").toLowerCase(),
        subText: "",
      }
    );
  }, []);

  // Fetch activities from API
  const fetchActivities = useCallback(
    async (forceRefresh = false) => {
      try {
        // Check cache first
        if (!forceRefresh) {
          const cached = activityCache.get();
          if (cached) {
            const processed = cached.slice(0, limit).map((act) => ({
              ...getActivityStyle(act.action, act.details),
              time: formatTime(act.createdAt),
              id: act.id,
            }));
            setActivities(processed.length ? processed : getFallbackActivity());
            setLoading(false);
            return;
          }
        }

        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setActivities(getFallbackActivity());
          setLoading(false);
          return;
        }

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

        if (!res.ok) {
          if (res.status === 404) {
            setActivities(getFallbackActivity());
            setLoading(false);
            return;
          }
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        if (data.status === "success" && Array.isArray(data.activities)) {
          activityCache.set(data.activities);

          const processed = data.activities.slice(0, limit).map((act) => ({
            ...getActivityStyle(act.action, act.details),
            time: formatTime(act.createdAt),
            id: act.id,
          }));

          setActivities(processed.length ? processed : getFallbackActivity());
        } else {
          setActivities(getFallbackActivity());
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError(err.message);
        setActivities(getErrorActivity());
      } finally {
        setLoading(false);
      }
    },
    [limit, formatTime, getActivityStyle]
  );

  // Get fallback activity when no data
  const getFallbackActivity = () => [
    {
      icon: "ℹ️",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      title: "System Ready",
      text: "No activities yet. Start by adding a farm!",
      subText: "",
      time: "Now",
      id: "fallback",
    },
  ];

  // Get error activity
  const getErrorActivity = () => [
    {
      icon: "⚠️",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      title: "Error",
      text: "Failed to load activities",
      subText: "",
      time: "Now",
      id: "error",
    },
  ];

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchActivities(false);
    }
  }, [fetchActivities]);

  // Loading state
  if (loading && activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
          Recent Activities
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Recent Activities
        </h2>
        {error && (
          <button
            onClick={() => fetchActivities(true)}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            Retry
          </button>
        )}
      </div>

      {error ? (
        <div className="text-center py-6">
          <p className="text-sm text-red-500 mb-2">Failed to load activities</p>
          <button
            onClick={() => fetchActivities(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className={`${act.bg} rounded-xl p-4 border border-gray-100 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`${act.iconBg} w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0`}
                >
                  {act.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">
                    {act.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 break-words">
                    {act.text}
                  </p>
                  {act.subText && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {act.subText}
                    </p>
                  )}
                  <span className="text-xs text-gray-400 mt-1 block">
                    {act.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
