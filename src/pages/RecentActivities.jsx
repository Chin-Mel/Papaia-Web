import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  CheckCheck,
  Ban,
  UserRoundPlus,
  UserRoundMinus,
  UserRoundPen,
  Lock,
  ShieldMinus,
  ShieldCheck,
  Info,
  Sprout,
  ClockFading,
} from "lucide-react";

const activityCache = {
  data: null,
  timestamp: 0,
  ttl: 30000,

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

const activityEmitter = {
  listeners: new Set(),

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },

  emit() {
    this.listeners.forEach((callback) => callback());
  },
};

window.refreshActivities = () => {
  activityCache.clear();
  activityEmitter.emit();
};

export default function RecentActivities({ limit = 5 }) {
  const [activities, setActivities] = useState([]);
  const fetchedRef = useRef(false);
  const mountedRef = useRef(true);

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
      if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return timeString;
    }
  }, []);

  const getActivityStyle = useCallback((action, details) => {
    const farmName = details?.farmName || "Unknown Farm";
    const farmerName =
      details?.farmerName || details?.idNumber || "Unknown Farmer";

    const styles = {
      ADD_FARM: {
        icon: Plus,
        iconColor: "text-emerald-700",
        bg: "bg-emerald-50/50",
        leftBorder: "border-l-2 border-emerald-700",
        title: "New farm registered",
        text: farmName,
        subText: "was added to system",
      },
      DELETE_FARM: {
        icon: Trash2,
        iconColor: "text-rose-600",
        bg: "bg-rose-50/50",
        leftBorder: "border-l-2 border-rose-600",
        title: "Farm removed",
        text: farmName,
        subText: "deleted from system",
      },
      UPDATE_FARM: {
        icon: Pencil,
        iconColor: "text-blue-600",
        bg: "bg-blue-50/50",
        leftBorder: "border-l-2 border-blue-600",
        title: "Farm updated",
        text: farmName,
        subText: "information modified",
      },
      ACTIVE_FARM: {
        icon: CheckCheck,
        iconColor: "text-emerald-600",
        bg: "bg-emerald-50/50",
        leftBorder: "border-l-2 border-emerald-600",
        title: "Farm activated",
        text: farmName,
        subText: "is now operational",
      },
      INACTIVE_FARM: {
        icon: Ban,
        iconColor: "text-amber-600",
        bg: "bg-amber-50/50",
        leftBorder: "border-l-2 border-amber-600",
        title: "Farm deactivated",
        text: farmName,
        subText: "temporarily paused",
      },
      ADD_FARMER: {
        icon: UserRoundPlus,
        iconColor: "text-emerald-600",
        bg: "bg-emerald-50/50",
        leftBorder: "border-l-2 border-emerald-600",
        title: "New farmer onboarded",
        text: farmerName,
        subText: farmName ? `joined ${farmName}` : "joined the platform",
      },
      REMOVE_FARMER: {
        icon: UserRoundMinus,
        iconColor: "text-rose-600",
        bg: "bg-rose-50/50",
        leftBorder: "border-l-2 border-rose-600",
        title: "Farmer removed",
        text: farmerName,
        subText: farmName ? `from ${farmName}` : "from system",
      },
      UPDATE_PROFILE: {
        icon: UserRoundPen,
        iconColor: "text-violet-600",
        bg: "bg-violet-50/50",
        leftBorder: "border-l-2 border-violet-600",
        title: "Profile updated",
        text: details?.description || "Account information",
        subText: "successfully modified",
      },
      CHANGE_PASSWORD: {
        icon: Lock,
        iconColor: "text-amber-600",
        bg: "bg-amber-50/50",
        leftBorder: "border-l-2 border-amber-600",
        title: "Security updated",
        text: "Password changed",
        subText: "account secured",
      },
      DEACTIVATE_ACCOUNT: {
        icon: ShieldMinus,
        iconColor: "text-slate-600",
        bg: "bg-slate-50/50",
        leftBorder: "border-l-2 border-slate-600",
        title: "Account paused",
        text: "Account deactivated",
        subText: "temporarily inactive",
      },
      REACTIVATE_ACCOUNT: {
        icon: ShieldCheck,
        iconColor: "text-emerald-600",
        bg: "bg-emerald-50/50",
        leftBorder: "border-l-2 border-emerald-600",
        title: "Account restored",
        text: "Account reactivated",
        subText: "now operational",
      },
    };

    return (
      styles[action] || {
        icon: Info,
        iconColor: "text-slate-600",
        bg: "bg-slate-50/50",
        leftBorder: "border-l-2 border-slate-600",
        title: "System activity",
        text: action.replace(/_/g, " ").toLowerCase(),
        subText: "recorded",
      }
    );
  }, []);

  const getFallbackActivity = useCallback(
    () => [
      {
        icon: Sprout,
        iconColor: "text-violet-600",
        bg: "bg-violet-50/50",
        leftBorder: "border-l-2 border-violet-600",
        title: "Welcome aboard!",
        text: "Start by adding your first farm",
        subText: "Your journey begins here",
        time: "Now",
        id: "fallback",
      },
    ],
    []
  );

  const fetchActivities = useCallback(
    async (forceRefresh = false) => {
      if (!mountedRef.current) return;

      try {
        if (!forceRefresh) {
          const cached = activityCache.get();
          if (cached) {
            const processed = cached.slice(0, limit).map((act) => ({
              ...getActivityStyle(act.action, act.details),
              time: formatTime(act.createdAt),
              id: act.id,
            }));
            if (mountedRef.current) {
              const fallback = getFallbackActivity();
              setActivities(
                processed.length ? [...processed, ...fallback] : fallback
              );
            }
            return;
          }
        }

        const token = localStorage.getItem("token");
        if (!token) {
          if (mountedRef.current) {
            setActivities(getFallbackActivity());
          }
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
          if (mountedRef.current) {
            setActivities(getFallbackActivity());
          }
          return;
        }

        const data = await res.json();

        if (data.status === "success" && Array.isArray(data.activities)) {
          const sortedActivities = [...data.activities].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });

          activityCache.set(sortedActivities);

          const processed = sortedActivities.slice(0, limit).map((act) => ({
            ...getActivityStyle(act.action, act.details),
            time: formatTime(act.createdAt),
            id: act.id,
          }));
          if (mountedRef.current) {
            const fallback = getFallbackActivity();
            setActivities(
              processed.length ? [...processed, ...fallback] : fallback
            );
          }
        } else {
          if (mountedRef.current) {
            setActivities(getFallbackActivity());
          }
        }
      } catch {
        if (mountedRef.current) {
          setActivities(getFallbackActivity());
        }
      }
    },
    [limit, formatTime, getActivityStyle, getFallbackActivity]
  );

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchActivities(false);
    }
  }, [fetchActivities]);

  useEffect(() => {
    const unsubscribe = activityEmitter.subscribe(() => {
      fetchActivities(true);
    });
    return unsubscribe;
  }, [fetchActivities]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 p-4 sm:p-6 w-full border border-slate-200/60">
      <div className="flex items-center gap-2 mb-4">
        <ClockFading className="w-5 h-5 text-orange-600" />
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          Recent Activities
        </h2>
      </div>

      <div className="space-y-3">
        {activities.map((act) => {
          const IconComponent = act.icon;
          return (
            <div
              key={act.id}
              className={`${act.bg} ${act.leftBorder} rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <IconComponent
                  className={`w-5 h-5 ${act.iconColor} flex-shrink-0 mt-0.5`}
                  strokeWidth={2.5}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 mb-0.5">
                    {act.title}
                  </p>
                  <p className="text-xs text-slate-700 font-medium break-words">
                    {act.text}
                  </p>
                  {act.subText && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {act.subText}
                    </p>
                  )}
                  <span className="text-xs text-slate-400 mt-1.5 block font-medium">
                    {act.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// //new
// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   Plus,
//   Trash2,
//   Pencil,
//   CheckCheck,
//   Ban,
//   UserRoundPlus,
//   UserRoundMinus,
//   UserRoundPen,
//   Lock,
//   ShieldMinus,
//   ShieldCheck,
//   Info,
//   Sprout,
//   ClockFading,
// } from "lucide-react";

// // Activity cache with in-memory storage
// const activityCache = {
//   data: null,
//   timestamp: 0,
//   ttl: 300000, // 5 minutes

//   set(value) {
//     this.data = value;
//     this.timestamp = Date.now();
//   },

//   get() {
//     if (this.data && Date.now() - this.timestamp < this.ttl) {
//       return this.data;
//     }
//     return null;
//   },

//   clear() {
//     this.data = null;
//     this.timestamp = 0;
//   },
// };

// // Event emitter for activity updates
// const activityEmitter = {
//   listeners: new Set(),

//   subscribe(callback) {
//     this.listeners.add(callback);
//     return () => this.listeners.delete(callback);
//   },

//   emit() {
//     this.listeners.forEach((callback) => callback());
//   },
// };

// // Global function to trigger activity refresh
// window.refreshActivities = () => {
//   activityCache.clear();
//   activityEmitter.emit();
// };

// export default function RecentActivities({ limit = 5 }) {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const fetchedRef = useRef(false);
//   const mountedRef = useRef(true);

//   // Format timestamp to relative time
//   const formatTime = useCallback((timeString) => {
//     if (!timeString) return "Now";
//     try {
//       const parts = timeString.split(/\s+/);
//       if (parts.length < 3) return timeString;

//       const [datePart, timePart, period] = parts;
//       const [month, day, year] = datePart.split("/");
//       const [hours, minutes] = timePart.split(":");

//       let hour24 = parseInt(hours);
//       if (period === "PM" && hour24 !== 12) hour24 += 12;
//       if (period === "AM" && hour24 === 12) hour24 = 0;

//       const date = new Date(
//         parseInt(year),
//         parseInt(month) - 1,
//         parseInt(day),
//         hour24,
//         parseInt(minutes)
//       );

//       if (isNaN(date.getTime())) return timeString;

//       const diffMins = Math.floor((Date.now() - date) / 60000);
//       if (diffMins < 1) return "Just now";
//       if (diffMins < 60) return `${diffMins}m ago`;
//       if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
//       if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;

//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return timeString;
//     }
//   }, []);

//   // Get activity display style based on action type
//   const getActivityStyle = useCallback((action, details) => {
//     const farmName = details?.farmName || "Unknown Farm";
//     const farmerName =
//       details?.farmerName || details?.idNumber || "Unknown Farmer";

//     const styles = {
//       ADD_FARM: {
//         icon: Plus,
//         iconColor: "text-emerald-700",
//         bg: "bg-emerald-50/50",
//         leftBorder: "border-l-2 border-emerald-700",
//         title: "New farm registered",
//         text: farmName,
//         subText: "was added to system",
//       },

//       DELETE_FARM: {
//         icon: Trash2,
//         iconColor: "text-rose-600",
//         bg: "bg-rose-50/50",
//         leftBorder: "border-l-2 border-rose-600",
//         title: "Farm removed",
//         text: farmName,
//         subText: "deleted from system",
//       },

//       UPDATE_FARM: {
//         icon: Pencil,
//         iconColor: "text-blue-600",
//         bg: "bg-blue-50/50",
//         leftBorder: "border-l-2 border-blue-600",
//         title: "Farm updated",
//         text: farmName,
//         subText: "information modified",
//       },

//       ACTIVE_FARM: {
//         icon: CheckCheck,
//         iconColor: "text-emerald-600",
//         bg: "bg-emerald-50/50",
//         leftBorder: "border-l-2 border-emerald-600",
//         title: "Farm activated",
//         text: farmName,
//         subText: "is now operational",
//       },

//       INACTIVE_FARM: {
//         icon: Ban,
//         iconColor: "text-amber-600",
//         bg: "bg-amber-50/50",
//         leftBorder: "border-l-2 border-amber-600",
//         title: "Farm deactivated",
//         text: farmName,
//         subText: "temporarily paused",
//       },

//       ADD_FARMER: {
//         icon: UserRoundPlus,
//         iconColor: "text-emerald-600",
//         bg: "bg-emerald-50/50",
//         leftBorder: "border-l-2 border-emerald-600",
//         title: "New farmer onboarded",
//         text: farmerName,
//         subText: farmName ? `joined ${farmName}` : "joined the platform",
//       },

//       REMOVE_FARMER: {
//         icon: UserRoundMinus,
//         iconColor: "text-rose-600",
//         bg: "bg-rose-50/50",
//         leftBorder: "border-l-2 border-rose-600",
//         title: "Farmer removed",
//         text: farmerName,
//         subText: farmName ? `from ${farmName}` : "from system",
//       },

//       UPDATE_PROFILE: {
//         icon: UserRoundPen,
//         iconColor: "text-violet-600",
//         bg: "bg-violet-50/50",
//         leftBorder: "border-l-2 border-violet-600",
//         title: "Profile updated",
//         text: details?.description || "Account information",
//         subText: "successfully modified",
//       },

//       CHANGE_PASSWORD: {
//         icon: Lock,
//         iconColor: "text-amber-600",
//         bg: "bg-amber-50/50",
//         leftBorder: "border-l-2 border-amber-600",
//         title: "Security updated",
//         text: "Password changed",
//         subText: "account secured",
//       },

//       DEACTIVATE_ACCOUNT: {
//         icon: ShieldMinus,
//         iconColor: "text-slate-600",
//         bg: "bg-slate-50/50",
//         leftBorder: "border-l-2 border-slate-600",
//         title: "Account paused",
//         text: "Account deactivated",
//         subText: "temporarily inactive",
//       },

//       REACTIVATE_ACCOUNT: {
//         icon: ShieldCheck,
//         iconColor: "text-emerald-600",
//         bg: "bg-emerald-50/50",
//         leftBorder: "border-l-2 border-emerald-600",
//         title: "Account restored",
//         text: "Account reactivated",
//         subText: "now operational",
//       },
//     };

//     return (
//       styles[action] || {
//         icon: Info,
//         iconColor: "text-slate-600",
//         bg: "bg-slate-50/50",
//         leftBorder: "border-l-2 border-slate-600",
//         title: "System activity",
//         text: action.replace(/_/g, " ").toLowerCase(),
//         subText: "recorded",
//       }
//     );
//   }, []);

//   // Get fallback activity when no data
//   const getFallbackActivity = useCallback(
//     () => [
//       {
//         icon: Sprout,
//         iconColor: "text-violet-600",
//         bg: "bg-violet-50/50",
//         leftBorder: "border-l-2 border-violet-600",
//         title: "Welcome aboard!",
//         text: "Start by adding your first farm",
//         subText: "Your journey begins here",
//         time: "Now",
//         id: "fallback",
//       },
//     ],
//     []
//   );

//   const getErrorActivity = useCallback(
//     () => [
//       {
//         icon: Info,
//         iconColor: "text-amber-600",
//         bg: "bg-amber-50/50",
//         leftBorder: "border-l-2 border-amber-600",
//         title: "Connection issue",
//         text: "Unable to load activities",
//         subText: "Tap retry to refresh",
//         time: "Now",
//         id: "error",
//       },
//     ],
//     []
//   );

//   // Fetch activities from API
//   const fetchActivities = useCallback(
//     async (forceRefresh = false) => {
//       if (!mountedRef.current) return;

//       try {
//         // Check cache first
//         if (!forceRefresh) {
//           const cached = activityCache.get();
//           if (cached) {
//             const processed = cached.slice(0, limit).map((act) => ({
//               ...getActivityStyle(act.action, act.details),
//               time: formatTime(act.createdAt),
//               id: act.id,
//             }));
//             if (mountedRef.current) {
//               setActivities(
//                 processed.length ? processed : getFallbackActivity()
//               );
//               setLoading(false);
//             }
//             return;
//           }
//         }

//         if (mountedRef.current) {
//           setLoading(true);
//           setError(null);
//         }

//         const token = localStorage.getItem("token");
//         if (!token) {
//           if (mountedRef.current) {
//             setActivities(getFallbackActivity());
//             setLoading(false);
//           }
//           return;
//         }

//         const res = await fetch(
//           "https://papaiaapi.onrender.com/api/owner/activities",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!res.ok) {
//           if (res.status === 404) {
//             if (mountedRef.current) {
//               setActivities(getFallbackActivity());
//               setLoading(false);
//             }
//             return;
//           }
//           throw new Error(`API Error: ${res.status}`);
//         }

//         const data = await res.json();

//         if (data.status === "success" && Array.isArray(data.activities)) {
//           // Sort activities by createdAt timestamp (most recent first)
//           const sortedActivities = [...data.activities].sort((a, b) => {
//             const dateA = new Date(a.createdAt);
//             const dateB = new Date(b.createdAt);
//             return dateB - dateA; // Descending order (newest first)
//           });

//           activityCache.set(sortedActivities);

//           const processed = sortedActivities.slice(0, limit).map((act) => ({
//             ...getActivityStyle(act.action, act.details),
//             time: formatTime(act.createdAt),
//             id: act.id,
//             createdAt: act.createdAt, // Keep original timestamp for debugging
//           }));
//           if (mountedRef.current) {
//             setActivities(processed.length ? processed : getFallbackActivity());
//           }
//         } else {
//           if (mountedRef.current) {
//             setActivities(getFallbackActivity());
//           }
//         }
//       } catch (err) {
//         if (mountedRef.current) {
//           setError(err.message);
//           setActivities(getErrorActivity());
//         }
//       } finally {
//         if (mountedRef.current) {
//           setLoading(false);
//         }
//       }
//     },
//     [limit, formatTime, getActivityStyle, getFallbackActivity, getErrorActivity]
//   );

//   // Initial fetch
//   useEffect(() => {
//     if (!fetchedRef.current) {
//       fetchedRef.current = true;
//       fetchActivities(false);
//     }
//   }, [fetchActivities]);

//   // Subscribe to activity updates
//   useEffect(() => {
//     const unsubscribe = activityEmitter.subscribe(() => {
//       fetchActivities(true);
//     });

//     return unsubscribe;
//   }, [fetchActivities]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   // Loading state
//   if (loading && activities.length === 0) {
//     return (
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 p-4 sm:p-6 w-full border border-slate-200/60">
//         <div className="flex items-center gap-2 mb-4">
//           <ClockFading className="w-5 h-5 text-orange-600" />
//           <h2 className="text-base sm:text-lg font-bold text-slate-800">
//             Recent Activities
//           </h2>
//         </div>
//         <div className="flex justify-center py-12">
//           <div className="animate-spin rounded-full h-10 w-10 border-3 border-slate-200 border-t-slate-600"></div>
//         </div>
//       </div>
//     );
//   }

//   // Main render
//   return (
//     <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 p-4 sm:p-6 w-full border border-slate-200/60">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center gap-2">
//           <ClockFading className="w-5 h-5 text-orange-600" />
//           <h2 className="text-base sm:text-lg font-bold text-slate-800">
//             Recent Activities
//           </h2>
//         </div>
//         {error && (
//           <button
//             onClick={() => fetchActivities(true)}
//             className="text-xs text-orange-600 hover:text-orange-800 font-semibold transition-colors"
//           >
//             Retry
//           </button>
//         )}
//       </div>

//       {error ? (
//         <div className="text-center py-8">
//           <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
//             <Info className="w-6 h-6 text-amber-600" />
//           </div>
//           <p className="text-sm text-slate-600 font-medium mb-2">
//             Connection issue
//           </p>
//           <p className="text-xs text-slate-500 mb-3">
//             Failed to load activities
//           </p>
//           <button
//             onClick={() => fetchActivities(true)}
//             className="text-sm text-orange-600 hover:text-orange-800 font-semibold"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {activities.map((act) => {
//             const IconComponent = act.icon;
//             return (
//               <div
//                 key={act.id}
//                 className={`${act.bg} ${act.leftBorder} rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer`}
//               >
//                 <div className="flex items-start gap-3">
//                   <IconComponent
//                     className={`w-5 h-5 ${act.iconColor} flex-shrink-0 mt-0.5`}
//                     strokeWidth={2.5}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="font-bold text-sm text-slate-800 mb-0.5">
//                       {act.title}
//                     </p>
//                     <p className="text-xs text-slate-700 font-medium break-words">
//                       {act.text}
//                     </p>
//                     {act.subText && (
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         {act.subText}
//                       </p>
//                     )}
//                     <span className="text-xs text-slate-400 mt-1.5 block font-medium">
//                       {act.time}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
