import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Leaf, ScanLine, TrendingUp, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import AddFarmModal from "../components/Popups/AddFarmModal";

export default function DashboardPage() {
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Example data for activities
  const activities = [
    {
      type: "New Farm Registered",
      icon: "➕",
      iconBg: "bg-green-100",
      title: "New farm registered",
      description: "Green Valley Farm added to system",
      time: "2 hours ago",
      bgColor: "bg-green-50",
    },
    {
      type: "Crop Scan Completed",
      icon: "📊",
      iconBg: "bg-blue-100",
      title: "Crop scan completed",
      description: "Sunrise Orchards - Health check",
      time: "4 hours ago",
      bgColor: "bg-blue-50",
    },
    {
      type: "Disease Detected",
      icon: "⚠️",
      iconBg: "bg-yellow-100",
      title: "Disease Detected",
      description: "Green Valley Farm - Check",
      time: "8 hours ago",
      bgColor: "bg-yellow-50",
    },
    {
      type: "New Farmer Onboarded",
      icon: "👤",
      iconBg: "bg-green-100",
      title: "New farmer onboarded",
      description: "John Smith joined the platform",
      time: "1 day ago",
      bgColor: "bg-green-50",
    },
    {
      type: "Monthly Report Generated",
      icon: "📋",
      iconBg: "bg-purple-100",
      title: "Monthly report generated",
      description: "Productivity analytics ready",
      time: "2 days ago",
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

  // Fetch farms from backend - moved outside useEffect so it can be reused
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
          desc: "", // You can add description field to your API response if needed
          location: f.location,
          health: 100, // You can add health field to your API response if needed
          status: "Active", // You can add status field to your API response if needed
          img: "https://source.unsplash.com/400x300/?farm",
        }));
        setFarms(mappedFarms);
      }
    } catch (err) {
      console.error("Failed to fetch farms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch farms and stats on component mount
  useEffect(() => {
    fetchFarms();
    fetchDashboardStats();
  }, []);

  // Handle adding a new farm
  const handleAddFarm = async (farmData) => {
    try {
      setLoading(true);
      const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          farmName: farmData.name,
          location: farmData.location,
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        // Refresh farms list and stats from backend to avoid duplicates
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

  const handleCloseModal = () => setShowAddFarmModal(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 mt-16 p-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Left Column - Recent Activities */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Recent Activities
              </h2>
              <div className="space-y-3">
                {activities.map((act, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${act.bgColor} border border-gray-100`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${act.iconBg} flex items-center justify-center text-sm`}
                      >
                        {act.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">
                          {act.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {act.description}
                        </p>
                        <span className="text-xs text-gray-500 mt-1">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - My Farms */}
          <div className="flex-1">
            {/* Dashboard Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <TrendingUp
                      className={`w-4 h-4 ${
                        dashboardStats.farmersTrend === "increase"
                          ? "text-green-500"
                          : dashboardStats.farmersTrend === "decrease"
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dashboardStats.totalFarmers.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">All Farmers</p>
                  <span
                    className={`text-xs font-medium ${
                      dashboardStats.farmersTrend === "increase"
                        ? "text-green-600"
                        : dashboardStats.farmersTrend === "decrease"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {dashboardStats.farmersTrend === "increase"
                      ? "+"
                      : dashboardStats.farmersTrend === "decrease"
                      ? "-"
                      : ""}
                    {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                    last month
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-yellow-600" />
                    </div>
                    <TrendingUp
                      className={`w-4 h-4 ${
                        dashboardStats.farmsTrend === "increase"
                          ? "text-green-500"
                          : dashboardStats.farmsTrend === "decrease"
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dashboardStats.totalFarms.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">All Farms</p>
                  <span
                    className={`text-xs font-medium ${
                      dashboardStats.farmsTrend === "increase"
                        ? "text-green-600"
                        : dashboardStats.farmsTrend === "decrease"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {dashboardStats.farmsTrend === "increase"
                      ? "+"
                      : dashboardStats.farmsTrend === "decrease"
                      ? "-"
                      : ""}
                    {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from last
                    month
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ScanLine className="w-5 h-5 text-blue-600" />
                    </div>
                    <TrendingUp
                      className={`w-4 h-4 ${
                        dashboardStats.scansTrend === "increase"
                          ? "text-green-500"
                          : dashboardStats.scansTrend === "decrease"
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dashboardStats.todayScans.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">Today's Scans</p>
                  <span
                    className={`text-xs font-medium ${
                      dashboardStats.scansTrend === "increase"
                        ? "text-green-600"
                        : dashboardStats.scansTrend === "decrease"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {dashboardStats.scansTrend === "increase"
                      ? "+"
                      : dashboardStats.scansTrend === "decrease"
                      ? "-"
                      : ""}
                    {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                    yesterday
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">My Farms</h2>
                <button
                  onClick={() => setShowAddFarmModal(true)}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  {loading ? "Loading..." : "Add Farm"}
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-500">Loading farms...</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {farms.length === 0 ? (
                    <div className="col-span-3 text-center py-12 text-gray-500">
                      No farms added yet. Click "Add Farm" to get started!
                    </div>
                  ) : (
                    farms.map((farm) => (
                      <Link
                        key={farm.id}
                        to={`/farm-dashboard/${farm.id}`}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={farm.img}
                            alt={farm.name}
                            className="w-full h-40 object-cover"
                          />
                          <span
                            className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-medium ${
                              farm.status === "Active"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}
                          >
                            {farm.status}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-1">
                            {farm.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {farm.desc}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <MapPin size={12} /> {farm.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Leaf size={12} className="text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              {farm.health}% Health
                            </span>
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
