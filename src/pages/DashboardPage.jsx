import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Leaf, ScanLine, TrendingUp, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import AddFarmModal from "../components/Popups/AddFarmModal";
import ScansCount from "../assets/scans.png";
import FarmersCount from "../assets/farmers.png";
import FarmsCount from "../assets/farms.png";

export default function DashboardPage() {
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentIdentifications, setRecentIdentifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalFarmers: 0,
    totalFarms: 0,
    todayScans: 0,
    farmersChange: 0,
    farmsChange: 0,
    scansChange: 0,
    farmersTrend: "no change",
    farmsTrend: "no change",
    scansTrend: "no change",
  });

  // Fetch recent identification history for activities
  const fetchRecentActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/owner/identification-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        // Take only the latest 5 identifications for recent activities
        const recent = data.slice(0, 5).map((identification) => ({
          type:
            identification.result === "Healthy"
              ? "Crop Scan Completed"
              : "Disease Detected",
          icon: identification.result === "Healthy" ? "📊" : "⚠️",
          iconBg:
            identification.result === "Healthy"
              ? "bg-blue-100"
              : "bg-yellow-100",
          title:
            identification.result === "Healthy"
              ? "Crop scan completed"
              : "Disease detected",
          description: `Farm scan - ${identification.result} (${Math.round(
            identification.confidence * 100
          )}% confidence)`,
          time: identification.timestamp,
          bgColor:
            identification.result === "Healthy" ? "bg-blue-50" : "bg-yellow-50",
        }));
        setRecentIdentifications(recent);
      }
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
      // Keep empty array if no activities found
      setRecentIdentifications([]);
    }
  };

  // Fallback activities if no API data available
  const fallbackActivities = [
    {
      type: "New Farm Registered",
      icon: "➕",
      iconBg: "bg-green-100",
      title: "New farm registered",
      description: "Farm added to system",
      time: "Recently",
      bgColor: "bg-green-50",
    },
    {
      type: "System Ready",
      icon: "📋",
      iconBg: "bg-purple-100",
      title: "Dashboard ready",
      description: "System initialized successfully",
      time: "Now",
      bgColor: "bg-purple-50",
    },
  ];

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch all statistics in parallel
      const [
        farmCountRes,
        farmerCountRes,
        scansComparisonRes,
        farmersComparisonRes,
        farmsComparisonRes,
      ] = await Promise.all([
        fetch("https://papaiaapi.onrender.com/api/owner/count-farms", {
          headers,
        }),
        fetch("https://papaiaapi.onrender.com/api/owner/count-farmers", {
          headers,
        }),
        fetch(
          "https://papaiaapi.onrender.com/api/owner/identification-comparison",
          { headers }
        ),
        fetch("https://papaiaapi.onrender.com/api/owner/farmers-comparison", {
          headers,
        }),
        fetch("https://papaiaapi.onrender.com/api/owner/farms-comparison", {
          headers,
        }),
      ]);

      // Parse all responses
      const farmCountData = await farmCountRes.json();
      const farmerCountData = await farmerCountRes.json();
      const scansComparisonData = await scansComparisonRes.json();
      const farmersComparisonData = await farmersComparisonRes.json();
      const farmsComparisonData = await farmsComparisonRes.json();

      setDashboardStats({
        totalFarmers: farmerCountData.totalFarmers || 0,
        totalFarms: farmCountData.farmCount || 0,
        todayScans: scansComparisonData.today || 0,
        farmersChange: farmersComparisonData.percentageChange || 0,
        farmsChange: farmsComparisonData.percentageChange || 0,
        scansChange: scansComparisonData.changePercent || 0,
        farmersTrend: farmersComparisonData.trend || "no change",
        farmsTrend: farmsComparisonData.trend || "no change",
        scansTrend: scansComparisonData.trend || "no change",
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  // Fetch farms from backend
  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/owner/farms",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.status === "success" && data.farms) {
        const mappedFarms = data.farms.map((f) => ({
          id: f.id,
          name: f.farmName,
          desc: f.description || `Farm located in ${f.location}`, // use API description if available
          location: f.location,
          health: 95, // Default good health status
          status: "Active", // Default to active
          img:
            f.farmImage ||
            `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format`, // fallback image
        }));
        setFarms(mappedFarms);
      }
    } catch (err) {
      console.error("Failed to fetch farms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchFarms();
    fetchDashboardStats();
    fetchRecentActivities();
  }, []);

  // Handle adding a new farm
  // Handle adding a new farm
  const handleAddFarm = async (farmData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("farmName", farmData.name);
      formData.append("location", farmData.location);
      formData.append(
        "description",
        farmData.description || "No description provided"
      );

      if (farmData.farmImage) {
        formData.append("farmImage", farmData.farmImage); // append actual file
      }

      const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        // Refresh farms list and stats from backend
        await fetchFarms();
        await fetchDashboardStats();
        setShowAddFarmModal(false);
      } else {
        console.error("Failed to add farm:", data.message);
      }
    } catch (err) {
      console.error("Failed to add farm:", err);
    } finally {
      setLoading(false);
    }
  };

  const activitiesToShow =
    recentIdentifications.length > 0
      ? recentIdentifications
      : fallbackActivities;

  const handleCloseModal = () => setShowAddFarmModal(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Scrollable main content */}
      <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="w-full max-w-8xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Left Column - Recent Activities */}
          <div className="w-full lg:w-50 xl:w-[330px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
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
                        <p className="text-xs text-gray-600 mt-1">
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
            </div>
          </div>

          {/* Right Column - Dashboard Content */}
          <div className="flex-1">
            {/* Dashboard Overview */}
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-8">
              {/* Farmers */}
              <div className="p-4 sm:p-5 lg:p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                <div>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    All Farmers
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {dashboardStats.totalFarmers.toLocaleString()}
                  </h3>
                  <span className="text-xs sm:text-sm font-medium text-green-600">
                    {dashboardStats.farmersTrend === "increase"
                      ? "+"
                      : dashboardStats.farmersTrend === "decrease"
                      ? "-"
                      : ""}
                    {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                    last month
                  </span>
                </div>
                <img
                  src={FarmersCount}
                  alt="Farmers"
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain"
                />
              </div>

              {/* Farms */}
              <div className="p-4 sm:p-5 lg:p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                <div>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    All Farms
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {dashboardStats.totalFarms.toLocaleString()}
                  </h3>
                  <span className="text-xs sm:text-sm font-medium text-yellow-500">
                    {dashboardStats.farmsTrend === "increase"
                      ? "+"
                      : dashboardStats.farmsTrend === "decrease"
                      ? "-"
                      : ""}
                    {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from last
                    month
                  </span>
                </div>
                <img
                  src={FarmsCount}
                  alt="Farms"
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain"
                />
              </div>

              {/* Scans */}
              <div className="p-4 sm:p-5 lg:p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                <div>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    Today's Scans
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {dashboardStats.todayScans.toLocaleString()}
                  </h3>
                  <span className="text-xs sm:text-sm font-medium text-sky-500">
                    {dashboardStats.scansTrend === "increase"
                      ? "+"
                      : dashboardStats.scansTrend === "decrease"
                      ? "-"
                      : ""}
                    {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                    yesterday
                  </span>
                </div>
                <img
                  src={ScansCount}
                  alt="Scans"
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain"
                />
              </div>
            </div>

            {/* My Farms Section */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">
                  My Farms
                </h2>
                <button
                  onClick={() => setShowAddFarmModal(true)}
                  disabled={loading}
                  className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  {loading ? "Loading..." : "Add Farm"}
                </button>
              </div>

              {/* Farms Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-500">Loading farms...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {farms.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
                      No farms added yet. Click "Add Farm" to get started!
                    </div>
                  ) : (
                    farms.map((farm) => (
                      <Link
                        key={farm.id}
                        to={`/farm-dashboard/${farm.id}`}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={farm.img}
                            alt={farm.name}
                            className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                          />
                          <span
                            className={`absolute top-3 right-3 px-2.5 py-1.5 text-[10px] sm:text-xs rounded-full font-medium ${
                              farm.status === "Active"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}
                          >
                            {farm.status}
                          </span>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-bold text-xs sm:text-base lg:text-lg text-gray-800 mb-1">
                            {farm.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                            {farm.desc}
                          </p>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                              <MapPin size={12} /> {farm.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Leaf size={12} className="text-green-500" />
                              <span className="text-[10px] sm:text-xs font-medium text-green-600">
                                {farm.health}% Health
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showAddFarmModal && (
        <AddFarmModal onClose={handleCloseModal} onSubmit={handleAddFarm} />
      )}
      <Footer />
    </div>
  );
}
