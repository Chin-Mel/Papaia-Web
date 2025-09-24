import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Leaf, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import AddFarmModal from "../components/Popups/AddFarmModal";
import RecentActivities from "../pages/RecentActivities";
import ScansCount from "../assets/scans.png";
import FarmersCount from "../assets/farmers.png";
import FarmsCount from "../assets/farms.png";

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

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log("Fetching dashboard stats...");

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

      // Log response statuses
      console.log("API Response statuses:", {
        farmCount: farmCountRes.status,
        farmerCount: farmerCountRes.status,
        scansComparison: scansComparisonRes.status,
        farmersComparison: farmersComparisonRes.status,
        farmsComparison: farmsComparisonRes.status,
      });

      // Parse all responses with error handling
      const [
        farmCountData,
        farmerCountData,
        scansComparisonData,
        farmersComparisonData,
        farmsComparisonData,
      ] = await Promise.all([
        farmCountRes.ok ? farmCountRes.json().catch(() => ({})) : {},
        farmerCountRes.ok ? farmerCountRes.json().catch(() => ({})) : {},
        scansComparisonRes.ok
          ? scansComparisonRes.json().catch(() => ({}))
          : {},
        farmersComparisonRes.ok
          ? farmersComparisonRes.json().catch(() => ({}))
          : {},
        farmsComparisonRes.ok
          ? farmsComparisonRes.json().catch(() => ({}))
          : {},
      ]);

      console.log("Dashboard stats data:", {
        farmCountData,
        farmerCountData,
        scansComparisonData,
        farmersComparisonData,
        farmsComparisonData,
      });

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
      const token = localStorage.getItem("token");

      console.log(
        "Fetching farms with token:",
        token ? "Token exists" : "No token"
      );

      const res = await fetch(
        "https://papaiaapi.onrender.com/api/owner/farms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Farms API response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Farms API error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("Farms API response data:", data);

      if (data.status === "success" && data.farms) {
        const mappedFarms = data.farms.map((f) => {
          console.log("Processing farm:", f);

          // Handle potentially malformed image URLs
          let farmImage = `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format`;
          if (f.farmImage && f.farmImage.startsWith("http")) {
            farmImage = f.farmImage;
          }

          return {
            id: f.id,
            name: f.farmName,
            desc: f.description || `Farm located in ${f.location}`,
            location: f.location,
            health: 95, // You might want to calculate this from farm health endpoint
            status: f.status === "active" ? "Active" : "Inactive",
            img: farmImage,
          };
        });

        // Sort farms: Active first, Inactive last
        const sortedFarms = mappedFarms.sort((a, b) => {
          if (a.status === "Active" && b.status === "Inactive") return -1;
          if (a.status === "Inactive" && b.status === "Active") return 1;
          return 0;
        });

        console.log("Mapped and sorted farms:", sortedFarms);
        setFarms(sortedFarms);
      } else {
        console.warn("Unexpected farms response format:", data);
        setFarms([]);
      }
    } catch (err) {
      console.error("Failed to fetch farms:", err);
      setFarms([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchFarms();
    fetchDashboardStats();
  }, []);

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
        formData.append("farmImage", farmData.farmImage);
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

  const handleCloseModal = () => setShowAddFarmModal(false);

  const getTrendColor = (trend) => {
    switch (trend) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendPrefix = (trend, value) => {
    if (trend === "increase") return "+";
    if (trend === "decrease") return "-";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Scrollable main content */}
      <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="w-full max-w-8xl mx-auto">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            {/* Dashboard Overview - Mobile */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                {/* Farmers */}
                <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">
                      All Farmers
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {dashboardStats.totalFarmers.toLocaleString()}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-medium ${getTrendColor(
                        dashboardStats.farmersTrend
                      )}`}
                    >
                      {getTrendPrefix(
                        dashboardStats.farmersTrend,
                        dashboardStats.farmersChange
                      )}
                      {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmersCount}
                    alt="Farmers"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                </div>

                {/* Farms */}
                <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">
                      All Farms
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {dashboardStats.totalFarms.toLocaleString()}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-medium ${getTrendColor(
                        dashboardStats.farmsTrend
                      )}`}
                    >
                      {getTrendPrefix(
                        dashboardStats.farmsTrend,
                        dashboardStats.farmsChange
                      )}
                      {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmsCount}
                    alt="Farms"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                </div>

                {/* Scans */}
                <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md sm:col-span-2">
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">
                      Today's Scans
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {dashboardStats.todayScans.toLocaleString()}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-medium ${getTrendColor(
                        dashboardStats.scansTrend
                      )}`}
                    >
                      {getTrendPrefix(
                        dashboardStats.scansTrend,
                        dashboardStats.scansChange
                      )}
                      {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                      yesterday
                    </span>
                  </div>
                  <img
                    src={ScansCount}
                    alt="Scans"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Recent Activities - Mobile */}
            <div className="mb-6">
              <RecentActivities limit={5} />
            </div>

            {/* My Farms Section - Mobile */}
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

              {/* Farms Grid - Mobile */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-500">Loading farms...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {farms.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 text-center py-12 text-gray-500">
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
                            className="w-full h-32 sm:h-40 object-cover"
                          />
                          <span
                            className={`absolute top-3 right-3 px-2.5 py-1.5 text-[10px] sm:text-xs rounded-full font-medium ${
                              farm.status === "Active"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {farm.status}
                          </span>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-bold text-xs sm:text-base text-gray-800 mb-1">
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

          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-6">
            {/* Left Column - Recent Activities */}
            <div className="w-[330px] flex-shrink-0">
              <RecentActivities limit={5} />
            </div>

            {/* Right Column - Dashboard Content */}
            <div className="flex-1">
              {/* Dashboard Overview - Desktop */}
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-3 gap-5 mb-8">
                {/* Farmers */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-base text-gray-600 mb-2">All Farmers</p>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {dashboardStats.totalFarmers.toLocaleString()}
                    </h3>
                    <span
                      className={`text-sm font-medium ${getTrendColor(
                        dashboardStats.farmersTrend
                      )}`}
                    >
                      {getTrendPrefix(
                        dashboardStats.farmersTrend,
                        dashboardStats.farmersChange
                      )}
                      {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmersCount}
                    alt="Farmers"
                    className="w-14 h-14 object-contain"
                  />
                </div>

                {/* Farms */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-base text-gray-600 mb-2">All Farms</p>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {dashboardStats.totalFarms.toLocaleString()}
                    </h3>
                    <span
                      className={`text-sm font-medium ${getTrendColor(
                        dashboardStats.farmsTrend
                      )}`}
                    >
                      {getTrendPrefix(
                        dashboardStats.farmsTrend,
                        dashboardStats.farmsChange
                      )}
                      {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmsCount}
                    alt="Farms"
                    className="w-14 h-14 object-contain"
                  />
                </div>

                {/* Scans */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-base text-gray-600 mb-2">
                      Today's Scans
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {dashboardStats.todayScans.toLocaleString()}
                    </h3>
                    <span
                      className={`text-sm font-medium ${getTrendColor(
                        dashboardStats.scansTrend
                      )}`}
                    >
                      {getTrendPrefix(
                        dashboardStats.scansTrend,
                        dashboardStats.scansChange
                      )}
                      {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                      yesterday
                    </span>
                  </div>
                  <img
                    src={ScansCount}
                    alt="Scans"
                    className="w-14 h-14 object-contain"
                  />
                </div>
              </div>

              {/* My Farms Section - Desktop */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">My Farms</h2>
                  <button
                    onClick={() => setShowAddFarmModal(true)}
                    disabled={loading}
                    className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-base transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                    {loading ? "Loading..." : "Add Farm"}
                  </button>
                </div>

                {/* Farms Grid - Desktop */}
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
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
                        >
                          <div className="relative">
                            <img
                              src={farm.img}
                              alt={farm.name}
                              className="w-full h-48 object-cover"
                            />
                            <span
                              className={`absolute top-3 right-3 px-2.5 py-1.5 text-xs rounded-full font-medium ${
                                farm.status === "Active"
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {farm.status}
                            </span>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-1">
                              {farm.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {farm.desc}
                            </p>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin size={12} /> {farm.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Leaf size={12} className="text-green-500" />
                                <span className="text-xs font-medium text-green-600">
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
        </div>
      </main>

      {showAddFarmModal && (
        <AddFarmModal onClose={handleCloseModal} onSubmit={handleAddFarm} />
      )}
      <Footer />
    </div>
  );
}
