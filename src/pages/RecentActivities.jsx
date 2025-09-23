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

      // Handle different response statuses
      if (res.status === 404) {
        // API returns 404 when no activities found
        console.log("No activities found (404)");
        setActivities([]);
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Activities API error:", res.status, errorText);
        setError(`API Error: ${res.status}`);
        setActivities([]);
        return;
      }

      const data = await res.json();
      console.log("Activities response:", data);

      // Handle successful response
      if (data.status === "success" && Array.isArray(data.activities)) {
        const mapped = data.activities.slice(0, limit).map((act) => {
          let style = {
            icon: "ℹ️",
            iconBg: "bg-gray-100",
            bgColor: "bg-gray-50",
            title: "Activity",
            description: act.action,
          };

          // Map action types to display styles
          switch (act.action) {
            case "ADD_FARM":
              style = {
                icon: "🌱",
                iconBg: "bg-green-100",
                bgColor: "bg-green-50",
                title: "Farm Added",
                description: `Added farm "${
                  act.details?.farmName || "Unknown Farm"
                }"`,
              };
              break;
            case "REMOVE_FARMER":
              style = {
                icon: "👤",
                iconBg: "bg-red-100",
                bgColor: "bg-red-50",
                title: "Farmer Removed",
                description: `Removed farmer "${
                  act.details?.farmerName || "Unknown Farmer"
                }"`,
              };
              break;
            case "DEACTIVATE_FARM":
              style = {
                icon: "🚫",
                iconBg: "bg-orange-100",
                bgColor: "bg-orange-50",
                title: "Farm Deactivated",
                description: `Deactivated farm "${
                  act.details?.farmName || "Unknown Farm"
                }"`,
              };
              break;
            case "ACTIVATE_FARM":
              style = {
                icon: "✅",
                iconBg: "bg-blue-100",
                bgColor: "bg-blue-50",
                title: "Farm Activated",
                description: `Activated farm "${
                  act.details?.farmName || "Unknown Farm"
                }"`,
              };
              break;
            case "ADD_FARMER":
              style = {
                icon: "👨‍🌾",
                iconBg: "bg-green-100",
                bgColor: "bg-green-50",
                title: "Farmer Added",
                description: `Added farmer "${
                  act.details?.farmerName ||
                  act.details?.idNumber ||
                  "Unknown Farmer"
                }"`,
              };
              break;
            case "UPDATE_FARM":
              style = {
                icon: "🔄",
                iconBg: "bg-blue-100",
                bgColor: "bg-blue-50",
                title: "Farm Updated",
                description: `Updated farm "${
                  act.details?.farmName || "Unknown Farm"
                }"`,
              };
              break;
            default:
              style.description = act.action.replace(/_/g, " ").toLowerCase();
          }

          return {
            ...style,
            time: act.createdAt || "Unknown time",
            id: act.id,
          };
        });

        console.log("Mapped activities:", mapped);
        setActivities(mapped);
      } else if (data.message && data.message.includes("No activities found")) {
        // Handle the case where API returns success but with "No activities found" message
        console.log("No activities found in response");
        setActivities([]);
      } else {
        console.warn("Unexpected response format:", data);
        setError("Unexpected response format");
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
