import { useState, useEffect } from "react";

export default function RecentActivities({ limit = 5 }) {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/owner/activities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.activities)) {
        const mapped = data.activities.slice(0, limit).map((act) => {
          let style = {
            icon: "ℹ️",
            iconBg: "bg-gray-100",
            bgColor: "bg-gray-50",
            title: "Activity",
            description: act.action,
          };

          switch (act.action) {
            case "ADD_FARM":
              style = {
                icon: "🌱",
                iconBg: "bg-green-100",
                bgColor: "bg-green-50",
                title: "Farm Added",
                description: `Added farm "${act.details.farmName}"`,
              };
              break;
            case "REMOVE_FARMER":
              style = {
                icon: "👤",
                iconBg: "bg-red-100",
                bgColor: "bg-red-50",
                title: "Farmer Removed",
                description: `Removed farmer "${act.details.farmerName}"`,
              };
              break;
          }

          return {
            ...style,
            time: act.createdAt,
          };
        });

        setActivities(mapped);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      setActivities([]);
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
    },
  ];

  const activitiesToShow =
    activities.length > 0 ? activities : fallbackActivities;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
        Recent Activities
      </h2>
      <div className="space-y-3">
        {activitiesToShow.map((act, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl ${act.bgColor} border border-gray-100`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${act.iconBg} flex items-center justify-center text-xs sm:text-sm`}
              >
                {act.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs sm:text-sm text-gray-800">
                  {act.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">{act.description}</p>
                <span className="text-[10px] sm:text-xs text-gray-500 mt-1 block">
                  {act.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
