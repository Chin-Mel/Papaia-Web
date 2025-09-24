import { useState, useEffect } from "react";
import { Leaf, Eye } from "lucide-react";

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

            // Sort by timestamp (most recent first) and take more scans (10 instead of 5)
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
              .slice(0, 10); // Show 10 recent scans instead of 5

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

  // Get farmer name by idNumber
  const getFarmerName = (idNumber) => {
    const farmer = farmers.find((f) => f.idNumber === idNumber);
    if (!farmer) return "Unknown Farmer";

    const nameParts = [
      farmer.firstname,
      farmer.middlename,
      farmer.lastname,
      farmer.suffix,
    ].filter(Boolean);

    return nameParts.length > 0 ? nameParts.join(" ") : "Unknown Farmer";
  };

  // Get disease icon based on prediction
  const getDiseaseIcon = (prediction) => {
    const diseaseIcons = {
      Healthy: "🟢",
      "Ring Spot Virus": "🔴",
      Anthracnose: "🟠",
      "Powdery Mildew": "🟡",
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

  // Format date/time
  const formatDateTime = (timestamp) => {
    try {
      // Handle different timestamp formats
      let date;
      if (timestamp.includes("/")) {
        // MM/DD/YYYY format from API
        const [datePart, timePart] = timestamp.split(" ");
        const [month, day, year] = datePart.split("/");
        const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;

        if (timePart) {
          const [time, period] = timePart.split(/\s+/);
          let [hours, minutes] = time.split(":");
          if (period === "PM" && hours !== "12") {
            hours = parseInt(hours) + 12;
          } else if (period === "AM" && hours === "12") {
            hours = "00";
          }
          date = new Date(`${dateStr}T${hours.padStart(2, "0")}:${minutes}:00`);
        } else {
          date = new Date(dateStr);
        }
      } else {
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) {
        return timestamp; // Return original if parsing fails
      }

      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes < 1 ? "Just now" : `${diffMinutes}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[400px]">
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
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[400px]">
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
        <div className="space-y-3 flex-1 overflow-y-auto">
          {recentScans.map((scan, index) => (
            <div
              key={`${scan.id || scan.timestamp}-${index}`} // Better key handling
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Scan Image */}
              <div className="relative">
                <img
                  src={scan.imageUrl || "/assets/default-scan.png"}
                  alt="Scan"
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.src = "/assets/default-scan.png";
                  }}
                />
                <div className="absolute -top-1 -right-1 text-lg">
                  {getDiseaseIcon(scan.prediction)}
                </div>
              </div>

              {/* Scan Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className={`font-medium text-sm ${getStatusColor(
                      scan.prediction
                    )}`}
                  >
                    {scan.prediction}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(scan.timestamp)}
                  </p>
                </div>

                <p className="text-xs text-gray-600 truncate">
                  ID: {scan.idNumber}
                </p>

                <p className="text-xs text-gray-600 truncate">
                  {getFarmerName(scan.idNumber)}
                </p>

                {/* Show scan ID or unique identifier if available */}
                {scan.id && (
                  <p className="text-xs text-gray-400 truncate">
                    Scan: #{scan.id}
                  </p>
                )}
              </div>

              {/* View Details Button */}
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                title="View scan details"
                onClick={() => {
                  // You can add a modal or navigation to scan details here
                  console.log("View scan details for:", scan);
                }}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Show total count if there are scans */}
      {recentScans.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Showing {Math.min(7, recentScans.length)} most recent scans by
            assigned farmers
          </p>
        </div>
      )}
    </div>
  );
}
