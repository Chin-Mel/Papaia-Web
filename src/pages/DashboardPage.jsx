//old with faster data fetching
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Leaf, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import AddFarmModal from "../components/Popups/AddFarmModal";
import RecentActivities from "../pages/RecentActivities";
import ScansCount from "../assets/scans.png";
import FarmersCount from "../assets/farmers.png";
import FarmsCount from "../assets/farms.png";

// ============ IN-MEMORY CACHE ============
const cache = {
  data: {},
  timestamps: {},

  set(key, value, ttl = 180000) {
    this.data[key] = value;
    this.timestamps[key] = Date.now() + ttl;
  },

  get(key) {
    if (this.data[key] && Date.now() < this.timestamps[key]) {
      return this.data[key];
    }
    delete this.data[key];
    delete this.timestamps[key];
    return null;
  },

  clear(key) {
    if (key) {
      delete this.data[key];
      delete this.timestamps[key];
    } else {
      this.data = {};
      this.timestamps = {};
    }
  },
};

// Expose cache clearing function to window for cross-component access
window.clearFarmCache = () => {
  cache.clear("owner_farms");
  cache.clear("farm_count");
};

// ============ CACHED FETCH FUNCTION ============
const cachedFetch = async (
  url,
  options = {},
  cacheKey = null,
  ttl = 180000
) => {
  const key = cacheKey || url;
  const cached = cache.get(key);
  if (cached) return cached;

  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  cache.set(key, data, ttl);
  return data;
};

export default function DashboardPage() {
  const location = useLocation();
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalFarmers: 0,
    totalFarms: 0,
    todayScans: 0,
    yesterdayScans: 0,
    farmersChange: 0,
    farmsChange: 0,
    scansChange: 0,
    farmersTrend: "no change",
    farmsTrend: "no change",
    scansTrend: "no change",
  });
  const mountedRef = useRef(false);

  // Preload images
  useEffect(() => {
    const images = [ScansCount, FarmersCount, FarmsCount];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Listen for navigation state to refresh farms
  useEffect(() => {
    if (location.state?.refreshFarms) {
      // Clear cache and refresh
      cache.clear("owner_farms");
      cache.clear("farm_count");
      fetchFarms();
      fetchDashboardStats();

      // Clear the state to prevent refresh on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const isToday = (timestampStr) => {
    const today = new Date();
    const todayStr = today.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return timestampStr.includes(todayStr);
  };

  const isYesterday = (timestampStr) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return timestampStr.includes(yesterdayStr);
  };

  // ============ OPTIMIZED FETCH WITH CACHING ============
  const fetchDashboardStats = async () => {
    try {
      const API_BASE = "https://papaiaapi.onrender.com/api/owner";

      const [
        farmCountData,
        farmerCountData,
        identificationData,
        farmersComparisonData,
        farmsComparisonData,
      ] = await Promise.all([
        cachedFetch(`${API_BASE}/count-farms`, {}, "farm_count", 60000),
        cachedFetch(`${API_BASE}/count-farmers`, {}, "farmer_count", 60000),
        cachedFetch(
          `${API_BASE}/identification-history`,
          {},
          "id_history",
          120000
        ),
        cachedFetch(
          `${API_BASE}/farmers-comparison`,
          {},
          "farmers_comp",
          60000
        ),
        cachedFetch(`${API_BASE}/farms-comparison`, {}, "farms_comp", 60000),
      ]).catch(() => [{}, {}, [], {}, {}]);

      const todayScansCount = Array.isArray(identificationData)
        ? identificationData.filter((pred) => isToday(pred.timestamp)).length
        : 0;

      const yesterdayScansCount = Array.isArray(identificationData)
        ? identificationData.filter((pred) => isYesterday(pred.timestamp))
            .length
        : 0;

      let scansChangePercent = 0;
      let scansTrendType = "no change";

      if (yesterdayScansCount > 0) {
        scansChangePercent = (
          ((todayScansCount - yesterdayScansCount) / yesterdayScansCount) *
          100
        ).toFixed(2);
        if (todayScansCount > yesterdayScansCount) {
          scansTrendType = "increase";
        } else if (todayScansCount < yesterdayScansCount) {
          scansTrendType = "decrease";
        }
      } else if (todayScansCount > 0) {
        scansChangePercent = 100;
        scansTrendType = "increase";
      }

      setDashboardStats({
        totalFarmers: farmerCountData.totalFarmers || 0,
        totalFarms: farmCountData.farmCount || 0,
        todayScans: todayScansCount,
        yesterdayScans: yesterdayScansCount,
        farmersChange: farmersComparisonData.percentageChange || 0,
        farmsChange: farmsComparisonData.percentageChange || 0,
        scansChange: parseFloat(scansChangePercent) || 0,
        farmersTrend: farmersComparisonData.trend || "no change",
        farmsTrend: farmsComparisonData.trend || "no change",
        scansTrend: scansTrendType,
      });
    } catch (err) {
      // Silent error handling
    }
  };

  const fetchFarmHealth = async (farmId) => {
    try {
      const data = await cachedFetch(
        `https://papaiaapi.onrender.com/api/owner/farm-health/${farmId}`,
        {},
        `farm_health_${farmId}`,
        120000
      ).catch(() => ({ healthPercentage: "0.00" }));

      return data.healthPercentage || "0.00";
    } catch {
      return "0.00";
    }
  };

  const fetchFarms = async () => {
    try {
      setLoading(true);

      const data = await cachedFetch(
        "https://papaiaapi.onrender.com/api/owner/farms",
        {},
        "owner_farms",
        180000
      );

      if (data.status === "success" && data.farms) {
        // Map farms first with default health
        const mappedFarms = data.farms.map((f) => {
          let farmImage = `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format`;
          if (f.farmImage && f.farmImage.startsWith("http")) {
            farmImage = f.farmImage;
            const img = new Image();
            img.src = farmImage;
          }

          return {
            id: f.id,
            name: f.farmName,
            desc: f.description || `Farm located in ${f.location}`,
            location: f.location,
            health: "0.00",
            status: f.status === "active" ? "Active" : "Inactive",
            img: farmImage,
          };
        });

        const sortedFarms = mappedFarms.sort((a, b) => {
          if (a.status === "Active" && b.status === "Inactive") return -1;
          if (a.status === "Inactive" && b.status === "Active") return 1;
          return 0;
        });

        setFarms(sortedFarms);
        setLoading(false);

        // Fetch health in background
        sortedFarms.forEach(async (farm, idx) => {
          const health = await fetchFarmHealth(farm.id);
          setFarms((prev) => {
            const updated = [...prev];
            if (updated[idx]) {
              updated[idx] = { ...updated[idx], health };
            }
            return updated;
          });
        });
      } else {
        setFarms([]);
        setLoading(false);
      }
    } catch (err) {
      setFarms([]);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchFarms();
      fetchDashboardStats();
    }
  }, []);

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

      const token = localStorage.getItem("token");
      const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        cache.clear("owner_farms");
        cache.clear("farm_count");
        await Promise.all([fetchFarms(), fetchDashboardStats()]);
        setShowAddFarmModal(false);
      }
    } catch (err) {
      // Silent error handling
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

  const getTrendPrefix = (trend) => {
    if (trend === "increase") return "+";
    if (trend === "decrease") return "-";
    return "";
  };

  const getHealthColor = (healthPercentage) => {
    if (healthPercentage >= 80) return "text-green-600";
    else if (healthPercentage >= 60) return "text-yellow-600";
    else if (healthPercentage >= 40) return "text-orange-600";
    else if (healthPercentage >= 20) return "text-red-600";
    else return "text-gray-600";
  };

  const formatHealthDisplay = (health) => {
    if (health === 0 || health === "0.00") return "N/A";
    return `${health}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="w-full max-w-8xl mx-auto">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
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
                      {getTrendPrefix(dashboardStats.farmersTrend)}
                      {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmersCount}
                    alt="Farmers"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    loading="eager"
                  />
                </div>

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
                      {getTrendPrefix(dashboardStats.farmsTrend)}
                      {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmsCount}
                    alt="Farms"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    loading="eager"
                  />
                </div>

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
                      {getTrendPrefix(dashboardStats.scansTrend)}
                      {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                      yesterday
                    </span>
                  </div>
                  <img
                    src={ScansCount}
                    alt="Scans"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <RecentActivities limit={5} />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">
                  My Farms
                </h2>
                <button
                  onClick={() => setShowAddFarmModal(true)}
                  disabled={loading}
                  className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={16} />
                  {loading ? "Loading..." : "Add Farm"}
                </button>
              </div>

              {loading && farms.length === 0 ? (
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
                        className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer ${
                          farm.status === "Active" ? "bg-white" : "bg-gray-300"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={farm.img}
                            alt={farm.name}
                            className={`w-full h-32 sm:h-40 object-cover ${
                              farm.status === "Inactive" ? "opacity-50" : ""
                            }`}
                            loading="eager"
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
                              <span
                                className={`text-[10px] sm:text-xs font-medium ${getHealthColor(
                                  farm.health
                                )}`}
                              >
                                {formatHealthDisplay(farm.health)} Health
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
            <div className="w-[330px] flex-shrink-0">
              <RecentActivities limit={5} />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-3 gap-5 mb-8">
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
                      {getTrendPrefix(dashboardStats.farmersTrend)}
                      {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmersCount}
                    alt="Farmers"
                    className="w-14 h-14 object-contain"
                    loading="eager"
                  />
                </div>

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
                      {getTrendPrefix(dashboardStats.farmsTrend)}
                      {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <img
                    src={FarmsCount}
                    alt="Farms"
                    className="w-14 h-14 object-contain"
                    loading="eager"
                  />
                </div>

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
                      {getTrendPrefix(dashboardStats.scansTrend)}
                      {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                      yesterday
                    </span>
                  </div>
                  <img
                    src={ScansCount}
                    alt="Scans"
                    className="w-14 h-14 object-contain"
                    loading="eager"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">My Farms</h2>
                  <button
                    onClick={() => setShowAddFarmModal(true)}
                    disabled={loading}
                    className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-base transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Plus size={16} />
                    {loading ? "Loading..." : "Add Farm"}
                  </button>
                </div>

                {loading && farms.length === 0 ? (
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
                          className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer ${
                            farm.status === "Active"
                              ? "bg-white"
                              : "bg-gray-300"
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={farm.img}
                              alt={farm.name}
                              className={`w-full h-48 object-cover ${
                                farm.status === "Inactive" ? "opacity-50" : ""
                              }`}
                              loading="eager"
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
                                <span
                                  className={`text-xs font-medium ${getHealthColor(
                                    farm.health
                                  )}`}
                                >
                                  {formatHealthDisplay(farm.health)} Health
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

//new
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Plus, Leaf, MapPin } from "lucide-react";
// import HeaderMain from "../components/Header/HeaderMain";
// import Footer from "../components/Footer/FooterMain";
// import AddFarmModal from "../components/Popups/AddFarmModal";
// import RecentActivities from "../pages/RecentActivities";
// import ScansCount from "../assets/scans.png";
// import FarmersCount from "../assets/farmers.png";
// import FarmsCount from "../assets/farms.png";

// export default function DashboardPage() {
//   const [showAddFarmModal, setShowAddFarmModal] = useState(false);
//   const [farms, setFarms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dashboardStats, setDashboardStats] = useState({
//     totalFarmers: 0,
//     totalFarms: 0,
//     todayScans: 0,
//     yesterdayScans: 0,
//     farmersChange: 0,
//     farmsChange: 0,
//     scansChange: 0,
//     farmersTrend: "no change",
//     farmsTrend: "no change",
//     scansTrend: "no change",
//   });

//   // Helper function to parse timestamp and check if it's today or yesterday
//   const isToday = (timestampStr) => {
//     const today = new Date();
//     const todayStr = today.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     });
//     return timestampStr.includes(todayStr);
//   };

//   const isYesterday = (timestampStr) => {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const yesterdayStr = yesterday.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     });
//     return timestampStr.includes(yesterdayStr);
//   };

//   // Fetch dashboard statistics
//   const fetchDashboardStats = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       // Fetch all statistics in parallel
//       const [
//         farmCountRes,
//         farmerCountRes,
//         identificationHistoryRes,
//         farmersComparisonRes,
//         farmsComparisonRes,
//       ] = await Promise.all([
//         fetch("https://papaiaapi.onrender.com/api/owner/count-farms", {
//           headers,
//         }),
//         fetch("https://papaiaapi.onrender.com/api/owner/count-farmers", {
//           headers,
//         }),
//         fetch(
//           "https://papaiaapi.onrender.com/api/owner/identification-history",
//           {
//             headers,
//           }
//         ),
//         fetch("https://papaiaapi.onrender.com/api/owner/farmers-comparison", {
//           headers,
//         }),
//         fetch("https://papaiaapi.onrender.com/api/owner/farms-comparison", {
//           headers,
//         }),
//       ]);

//       // Parse all responses with error handling
//       const [
//         farmCountData,
//         farmerCountData,
//         identificationData,
//         farmersComparisonData,
//         farmsComparisonData,
//       ] = await Promise.all([
//         farmCountRes.ok ? farmCountRes.json().catch(() => ({})) : {},
//         farmerCountRes.ok ? farmerCountRes.json().catch(() => ({})) : {},
//         identificationHistoryRes.ok
//           ? identificationHistoryRes.json().catch(() => [])
//           : [],
//         farmersComparisonRes.ok
//           ? farmersComparisonRes.json().catch(() => ({}))
//           : {},
//         farmsComparisonRes.ok
//           ? farmsComparisonRes.json().catch(() => ({}))
//           : {},
//       ]);

//       // Calculate today's and yesterday's scans from identification history
//       const todayScansCount = Array.isArray(identificationData)
//         ? identificationData.filter((pred) => isToday(pred.timestamp)).length
//         : 0;

//       const yesterdayScansCount = Array.isArray(identificationData)
//         ? identificationData.filter((pred) => isYesterday(pred.timestamp))
//             .length
//         : 0;

//       // Calculate percentage change
//       let scansChangePercent = 0;
//       let scansTrendType = "no change";

//       if (yesterdayScansCount > 0) {
//         scansChangePercent = (
//           ((todayScansCount - yesterdayScansCount) / yesterdayScansCount) *
//           100
//         ).toFixed(2);
//         if (todayScansCount > yesterdayScansCount) {
//           scansTrendType = "increase";
//         } else if (todayScansCount < yesterdayScansCount) {
//           scansTrendType = "decrease";
//         }
//       } else if (todayScansCount > 0) {
//         scansChangePercent = 100;
//         scansTrendType = "increase";
//       }

//       setDashboardStats({
//         totalFarmers: farmerCountData.totalFarmers || 0,
//         totalFarms: farmCountData.farmCount || 0,
//         todayScans: todayScansCount,
//         yesterdayScans: yesterdayScansCount,
//         farmersChange: farmersComparisonData.percentageChange || 0,
//         farmsChange: farmsComparisonData.percentageChange || 0,
//         scansChange: parseFloat(scansChangePercent) || 0,
//         farmersTrend: farmersComparisonData.trend || "no change",
//         farmsTrend: farmsComparisonData.trend || "no change",
//         scansTrend: scansTrendType,
//       });
//     } catch (err) {
//       // Silent error handling
//     }
//   };

//   // Fetch farm health data with improved error handling
//   const fetchFarmHealth = async (farmId) => {
//     try {
//       const token = localStorage.getItem("token");

//       // Add timeout to prevent long waits
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

//       const response = await fetch(
//         `https://papaiaapi.onrender.com/api/owner/farm-health/${farmId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           signal: controller.signal,
//         }
//       ).catch(() => null); // Suppress network errors in console

//       clearTimeout(timeoutId);

//       if (response && response.ok) {
//         const data = await response.json();
//         // API returns healthPercentage as string with % (e.g., "75.00%")
//         // Return as-is since it already includes the % symbol
//         return data.healthPercentage || "0.00";
//       }

//       // If response is not ok or null, return default
//       return "0.00";
//     } catch (error) {
//       // Return default for any error (network, timeout, etc.)
//       return "0.00";
//     }
//   };

//   // Fetch farms from backend
//   const fetchFarms = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         "https://papaiaapi.onrender.com/api/owner/farms",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.status === "success" && data.farms) {
//         // Fetch farms with health data
//         const mappedFarmsWithHealth = await Promise.all(
//           data.farms.map(async (f) => {
//             // Handle potentially malformed image URLs
//             let farmImage = `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format`;
//             if (f.farmImage && f.farmImage.startsWith("http")) {
//               farmImage = f.farmImage;
//             }

//             // Fetch health data for each farm (with error handling built-in)
//             const health = await fetchFarmHealth(f.id);

//             return {
//               id: f.id,
//               name: f.farmName,
//               desc: f.description || `Farm located in ${f.location}`,
//               location: f.location,
//               health: health,
//               status: f.status === "active" ? "Active" : "Inactive",
//               img: farmImage,
//             };
//           })
//         );

//         // Sort farms: Active first, Inactive last
//         const sortedFarms = mappedFarmsWithHealth.sort((a, b) => {
//           if (a.status === "Active" && b.status === "Inactive") return -1;
//           if (a.status === "Inactive" && b.status === "Active") return 1;
//           return 0;
//         });

//         setFarms(sortedFarms);
//       } else {
//         setFarms([]);
//       }
//     } catch (err) {
//       setFarms([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all data on component mount
//   useEffect(() => {
//     fetchFarms();
//     fetchDashboardStats();
//   }, []);

//   // Handle adding a new farm
//   const handleAddFarm = async (farmData) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("farmName", farmData.name);
//       formData.append("location", farmData.location);
//       formData.append(
//         "description",
//         farmData.description || "No description provided"
//       );

//       if (farmData.farmImage) {
//         formData.append("farmImage", farmData.farmImage);
//       }

//       const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.status === "success") {
//         // Refresh farms list and stats from backend
//         await fetchFarms();
//         await fetchDashboardStats();
//         setShowAddFarmModal(false);
//       }
//     } catch (err) {
//       // Silent error handling
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => setShowAddFarmModal(false);

//   const getTrendColor = (trend) => {
//     switch (trend) {
//       case "increase":
//         return "text-green-600";
//       case "decrease":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const getTrendPrefix = (trend, value) => {
//     if (trend === "increase") return "+";
//     if (trend === "decrease") return "-";
//     return "";
//   };

//   // Get health color based on percentage
//   const getHealthColor = (healthPercentage) => {
//     if (healthPercentage >= 80) {
//       return "text-green-600"; // Excellent health
//     } else if (healthPercentage >= 60) {
//       return "text-yellow-600"; // Good health
//     } else if (healthPercentage >= 40) {
//       return "text-orange-600"; // Fair health
//     } else if (healthPercentage >= 20) {
//       return "text-red-600"; // Poor health
//     } else {
//       return "text-gray-600"; // No data or very poor health
//     }
//   };

//   // Format health display - show "N/A" if health is 0
//   const formatHealthDisplay = (health) => {
//     if (health === 0) {
//       return "N/A";
//     }
//     return `${health}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <HeaderMain />

//       {/* Scrollable main content */}
//       <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
//         <div className="w-full max-w-8xl mx-auto">
//           {/* Mobile Layout */}
//           <div className="block lg:hidden">
//             {/* Dashboard Overview - Mobile */}
//             <div className="mb-6">
//               <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//                 Dashboard Overview
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
//                 {/* Farmers */}
//                 <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">
//                       All Farmers
//                     </p>
//                     <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
//                       {dashboardStats.totalFarmers.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-xs sm:text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmersTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmersTrend,
//                         dashboardStats.farmersChange
//                       )}
//                       {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmersCount}
//                     alt="Farmers"
//                     className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
//                   />
//                 </div>

//                 {/* Farms */}
//                 <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">
//                       All Farms
//                     </p>
//                     <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
//                       {dashboardStats.totalFarms.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-xs sm:text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmsTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmsTrend,
//                         dashboardStats.farmsChange
//                       )}
//                       {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmsCount}
//                     alt="Farms"
//                     className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
//                   />
//                 </div>

//                 {/* Scans */}
//                 <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md sm:col-span-2">
//                   <div>
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">
//                       Today's Scans
//                     </p>
//                     <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
//                       {dashboardStats.todayScans.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-xs sm:text-sm font-medium ${getTrendColor(
//                         dashboardStats.scansTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.scansTrend,
//                         dashboardStats.scansChange
//                       )}
//                       {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
//                       yesterday
//                     </span>
//                   </div>
//                   <img
//                     src={ScansCount}
//                     alt="Scans"
//                     className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activities - Mobile */}
//             <div className="mb-6">
//               <RecentActivities limit={5} />
//             </div>

//             {/* My Farms Section - Mobile */}
//             <div>
//               <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
//                 <h2 className="text-base sm:text-lg font-bold text-gray-800">
//                   My Farms
//                 </h2>
//                 <button
//                   onClick={() => setShowAddFarmModal(true)}
//                   disabled={loading}
//                   className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Plus size={16} />
//                   {loading ? "Loading..." : "Add Farm"}
//                 </button>
//               </div>

//               {/* Farms Grid - Mobile */}
//               {loading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="text-gray-500">Loading farms...</div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   {farms.length === 0 ? (
//                     <div className="col-span-1 sm:col-span-2 text-center py-12 text-gray-500">
//                       No farms added yet. Click "Add Farm" to get started!
//                     </div>
//                   ) : (
//                     farms.map((farm) => (
//                       <Link
//                         key={farm.id}
//                         to={`/farm-dashboard/${farm.id}`}
//                         className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer ${
//                           farm.status === "Active" ? "bg-white" : "bg-gray-300"
//                         }`}
//                       >
//                         <div className="relative">
//                           <img
//                             src={farm.img}
//                             alt={farm.name}
//                             className={`w-full h-32 sm:h-40 object-cover ${
//                               farm.status === "Inactive" ? "opacity-50" : ""
//                             }`}
//                           />
//                           <span
//                             className={`absolute top-3 right-3 px-2.5 py-1.5 text-[10px] sm:text-xs rounded-full font-medium ${
//                               farm.status === "Active"
//                                 ? "bg-green-500 text-white"
//                                 : "bg-red-500 text-white"
//                             }`}
//                           >
//                             {farm.status}
//                           </span>
//                         </div>
//                         <div className="p-3 sm:p-4">
//                           <h3 className="font-bold text-xs sm:text-base text-gray-800 mb-1">
//                             {farm.name}
//                           </h3>
//                           <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
//                             {farm.desc}
//                           </p>
//                           <div className="flex flex-col gap-1">
//                             <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
//                               <MapPin size={12} /> {farm.location}
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <Leaf size={12} className="text-green-500" />
//                               <span
//                                 className={`text-[10px] sm:text-xs font-medium ${getHealthColor(
//                                   farm.health
//                                 )}`}
//                               >
//                                 {formatHealthDisplay(farm.health)} Health
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Desktop Layout */}
//           <div className="hidden lg:flex gap-6">
//             {/* Left Column - Recent Activities */}
//             <div className="w-[330px] flex-shrink-0">
//               <RecentActivities limit={5} />
//             </div>

//             {/* Right Column - Dashboard Content */}
//             <div className="flex-1">
//               {/* Dashboard Overview - Desktop */}
//               <h2 className="text-lg font-bold text-gray-800 mb-4">
//                 Dashboard Overview
//               </h2>
//               <div className="grid grid-cols-3 gap-5 mb-8">
//                 {/* Farmers */}
//                 <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-base text-gray-600 mb-2">All Farmers</p>
//                     <h3 className="text-3xl font-bold text-gray-800">
//                       {dashboardStats.totalFarmers.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmersTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmersTrend,
//                         dashboardStats.farmersChange
//                       )}
//                       {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmersCount}
//                     alt="Farmers"
//                     className="w-14 h-14 object-contain"
//                   />
//                 </div>

//                 {/* Farms */}
//                 <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-base text-gray-600 mb-2">All Farms</p>
//                     <h3 className="text-3xl font-bold text-gray-800">
//                       {dashboardStats.totalFarms.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmsTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmsTrend,
//                         dashboardStats.farmsChange
//                       )}
//                       {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmsCount}
//                     alt="Farms"
//                     className="w-14 h-14 object-contain"
//                   />
//                 </div>

//                 {/* Scans */}
//                 <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-base text-gray-600 mb-2">
//                       Today's Scans
//                     </p>
//                     <h3 className="text-3xl font-bold text-gray-800">
//                       {dashboardStats.todayScans.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-sm font-medium ${getTrendColor(
//                         dashboardStats.scansTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.scansTrend,
//                         dashboardStats.scansChange
//                       )}
//                       {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
//                       yesterday
//                     </span>
//                   </div>
//                   <img
//                     src={ScansCount}
//                     alt="Scans"
//                     className="w-14 h-14 object-contain"
//                   />
//                 </div>
//               </div>

//               {/* My Farms Section - Desktop */}
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-bold text-gray-800">My Farms</h2>
//                   <button
//                     onClick={() => setShowAddFarmModal(true)}
//                     disabled={loading}
//                     className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-base transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Plus size={16} />
//                     {loading ? "Loading..." : "Add Farm"}
//                   </button>
//                 </div>

//                 {/* Farms Grid - Desktop */}
//                 {loading ? (
//                   <div className="flex justify-center items-center py-12">
//                     <div className="text-gray-500">Loading farms...</div>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-3 gap-4">
//                     {farms.length === 0 ? (
//                       <div className="col-span-3 text-center py-12 text-gray-500">
//                         No farms added yet. Click "Add Farm" to get started!
//                       </div>
//                     ) : (
//                       farms.map((farm) => (
//                         <Link
//                           key={farm.id}
//                           to={`/farm-dashboard/${farm.id}`}
//                           className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer ${
//                             farm.status === "Active"
//                               ? "bg-white"
//                               : "bg-gray-300"
//                           }`}
//                         >
//                           <div className="relative">
//                             <img
//                               src={farm.img}
//                               alt={farm.name}
//                               className={`w-full h-48 object-cover ${
//                                 farm.status === "Inactive" ? "opacity-50" : ""
//                               }`}
//                             />
//                             <span
//                               className={`absolute top-3 right-3 px-2.5 py-1.5 text-xs rounded-full font-medium ${
//                                 farm.status === "Active"
//                                   ? "bg-green-500 text-white"
//                                   : "bg-red-500 text-white"
//                               }`}
//                             >
//                               {farm.status}
//                             </span>
//                           </div>
//                           <div className="p-4">
//                             <h3 className="font-bold text-lg text-gray-800 mb-1">
//                               {farm.name}
//                             </h3>
//                             <p className="text-sm text-gray-600 mb-2 line-clamp-2">
//                               {farm.desc}
//                             </p>
//                             <div className="flex flex-col gap-1">
//                               <div className="flex items-center gap-1 text-xs text-gray-500">
//                                 <MapPin size={12} /> {farm.location}
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Leaf size={12} className="text-green-500" />
//                                 <span
//                                   className={`text-xs font-medium ${getHealthColor(
//                                     farm.health
//                                   )}`}
//                                 >
//                                   {formatHealthDisplay(farm.health)} Health
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </Link>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {showAddFarmModal && (
//         <AddFarmModal onClose={handleCloseModal} onSubmit={handleAddFarm} />
//       )}
//       <Footer />
//     </div>
//   );
// }

//old
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Plus, Leaf, MapPin } from "lucide-react";
// import HeaderMain from "../components/Header/HeaderMain";
// import Footer from "../components/Footer/FooterMain";
// import AddFarmModal from "../components/Popups/AddFarmModal";
// import RecentActivities from "../pages/RecentActivities";
// import ScansCount from "../assets/scans.png";
// import FarmersCount from "../assets/farmers.png";
// import FarmsCount from "../assets/farms.png";

// export default function DashboardPage() {
//   const [showAddFarmModal, setShowAddFarmModal] = useState(false);
//   const [farms, setFarms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dashboardStats, setDashboardStats] = useState({
//     totalFarmers: 0,
//     totalFarms: 0,
//     todayScans: 0,
//     yesterdayScans: 0,
//     farmersChange: 0,
//     farmsChange: 0,
//     scansChange: 0,
//     farmersTrend: "no change",
//     farmsTrend: "no change",
//     scansTrend: "no change",
//   });

//   // Helper function to parse timestamp and check if it's today or yesterday
//   const isToday = (timestampStr) => {
//     const today = new Date();
//     const todayStr = today.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     });
//     return timestampStr.includes(todayStr);
//   };

//   const isYesterday = (timestampStr) => {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const yesterdayStr = yesterday.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     });
//     return timestampStr.includes(yesterdayStr);
//   };

//   // Fetch dashboard statistics
//   const fetchDashboardStats = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       console.log("Fetching dashboard stats...");

//       // Fetch all statistics in parallel
//       const [
//         farmCountRes,
//         farmerCountRes,
//         identificationHistoryRes,
//         farmersComparisonRes,
//         farmsComparisonRes,
//       ] = await Promise.all([
//         fetch("https://papaiaapi.onrender.com/api/owner/count-farms", {
//           headers,
//         }),
//         fetch("https://papaiaapi.onrender.com/api/owner/count-farmers", {
//           headers,
//         }),
//         fetch(
//           "https://papaiaapi.onrender.com/api/owner/identification-history",
//           {
//             headers,
//           }
//         ),
//         fetch("https://papaiaapi.onrender.com/api/owner/farmers-comparison", {
//           headers,
//         }),
//         fetch("https://papaiaapi.onrender.com/api/owner/farms-comparison", {
//           headers,
//         }),
//       ]);

//       // Log response statuses
//       console.log("API Response statuses:", {
//         farmCount: farmCountRes.status,
//         farmerCount: farmerCountRes.status,
//         identificationHistory: identificationHistoryRes.status,
//         farmersComparison: farmersComparisonRes.status,
//         farmsComparison: farmsComparisonRes.status,
//       });

//       // Parse all responses with error handling
//       const [
//         farmCountData,
//         farmerCountData,
//         identificationData,
//         farmersComparisonData,
//         farmsComparisonData,
//       ] = await Promise.all([
//         farmCountRes.ok ? farmCountRes.json().catch(() => ({})) : {},
//         farmerCountRes.ok ? farmerCountRes.json().catch(() => ({})) : {},
//         identificationHistoryRes.ok
//           ? identificationHistoryRes.json().catch(() => [])
//           : [],
//         farmersComparisonRes.ok
//           ? farmersComparisonRes.json().catch(() => ({}))
//           : {},
//         farmsComparisonRes.ok
//           ? farmsComparisonRes.json().catch(() => ({}))
//           : {},
//       ]);

//       // Calculate today's and yesterday's scans from identification history
//       const todayScansCount = Array.isArray(identificationData)
//         ? identificationData.filter((pred) => isToday(pred.timestamp)).length
//         : 0;

//       const yesterdayScansCount = Array.isArray(identificationData)
//         ? identificationData.filter((pred) => isYesterday(pred.timestamp))
//             .length
//         : 0;

//       // Calculate percentage change
//       let scansChangePercent = 0;
//       let scansTrendType = "no change";

//       if (yesterdayScansCount > 0) {
//         scansChangePercent = (
//           ((todayScansCount - yesterdayScansCount) / yesterdayScansCount) *
//           100
//         ).toFixed(2);
//         if (todayScansCount > yesterdayScansCount) {
//           scansTrendType = "increase";
//         } else if (todayScansCount < yesterdayScansCount) {
//           scansTrendType = "decrease";
//         }
//       } else if (todayScansCount > 0) {
//         scansChangePercent = 100;
//         scansTrendType = "increase";
//       }

//       console.log("Dashboard stats data:", {
//         farmCountData,
//         farmerCountData,
//         todayScans: todayScansCount,
//         yesterdayScans: yesterdayScansCount,
//         scansChangePercent,
//         scansTrendType,
//         farmersComparisonData,
//         farmsComparisonData,
//       });

//       setDashboardStats({
//         totalFarmers: farmerCountData.totalFarmers || 0,
//         totalFarms: farmCountData.farmCount || 0,
//         todayScans: todayScansCount,
//         yesterdayScans: yesterdayScansCount,
//         farmersChange: farmersComparisonData.percentageChange || 0,
//         farmsChange: farmsComparisonData.percentageChange || 0,
//         scansChange: parseFloat(scansChangePercent) || 0,
//         farmersTrend: farmersComparisonData.trend || "no change",
//         farmsTrend: farmsComparisonData.trend || "no change",
//         scansTrend: scansTrendType,
//       });
//     } catch (err) {
//       console.error("Failed to fetch dashboard stats:", err);
//     }
//   };

//   // Fetch farm health data
//   const fetchFarmHealth = async (farmId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `https://papaiaapi.onrender.com/api/owner/farm-health/${farmId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         return data.healthPercentage || 0;
//       }
//       return 0;
//     } catch (error) {
//       console.error(`Error fetching health for farm ${farmId}:`, error);
//       return 0;
//     }
//   };

//   // Fetch farms from backend
//   const fetchFarms = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       console.log(
//         "Fetching farms with token:",
//         token ? "Token exists" : "No token"
//       );

//       const res = await fetch(
//         "https://papaiaapi.onrender.com/api/owner/farms",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Farms API response status:", res.status);

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error("Farms API error response:", errorText);
//         throw new Error(`HTTP ${res.status}: ${errorText}`);
//       }

//       const data = await res.json();
//       console.log("Farms API response data:", data);

//       if (data.status === "success" && data.farms) {
//         // Fetch farms with health data
//         const mappedFarmsWithHealth = await Promise.all(
//           data.farms.map(async (f) => {
//             console.log("Processing farm:", f);

//             // Handle potentially malformed image URLs
//             let farmImage = `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format`;
//             if (f.farmImage && f.farmImage.startsWith("http")) {
//               farmImage = f.farmImage;
//             }

//             // Fetch health data for each farm
//             const health = await fetchFarmHealth(f.id);

//             return {
//               id: f.id,
//               name: f.farmName,
//               desc: f.description || `Farm located in ${f.location}`,
//               location: f.location,
//               health: health,
//               status: f.status === "active" ? "Active" : "Inactive",
//               img: farmImage,
//             };
//           })
//         );

//         // Sort farms: Active first, Inactive last
//         const sortedFarms = mappedFarmsWithHealth.sort((a, b) => {
//           if (a.status === "Active" && b.status === "Inactive") return -1;
//           if (a.status === "Inactive" && b.status === "Active") return 1;
//           return 0;
//         });

//         console.log("Mapped and sorted farms with health:", sortedFarms);
//         setFarms(sortedFarms);
//       } else {
//         console.warn("Unexpected farms response format:", data);
//         setFarms([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch farms:", err);
//       setFarms([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all data on component mount
//   useEffect(() => {
//     fetchFarms();
//     fetchDashboardStats();
//   }, []);

//   // Handle adding a new farm
//   const handleAddFarm = async (farmData) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("farmName", farmData.name);
//       formData.append("location", farmData.location);
//       formData.append(
//         "description",
//         farmData.description || "No description provided"
//       );

//       if (farmData.farmImage) {
//         formData.append("farmImage", farmData.farmImage);
//       }

//       const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.status === "success") {
//         // Refresh farms list and stats from backend
//         await fetchFarms();
//         await fetchDashboardStats();
//         setShowAddFarmModal(false);
//       } else {
//         console.error("Failed to add farm:", data.message);
//       }
//     } catch (err) {
//       console.error("Failed to add farm:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => setShowAddFarmModal(false);

//   const getTrendColor = (trend) => {
//     switch (trend) {
//       case "increase":
//         return "text-green-600";
//       case "decrease":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const getTrendPrefix = (trend, value) => {
//     if (trend === "increase") return "+";
//     if (trend === "decrease") return "-";
//     return "";
//   };

//   // Get health color based on percentage
//   const getHealthColor = (healthPercentage) => {
//     if (healthPercentage >= 80) {
//       return "text-green-600"; // Excellent health
//     } else if (healthPercentage >= 60) {
//       return "text-yellow-600"; // Good health
//     } else if (healthPercentage >= 40) {
//       return "text-orange-600"; // Fair health
//     } else if (healthPercentage >= 20) {
//       return "text-red-600"; // Poor health
//     } else {
//       return "text-gray-600"; // No data or very poor health
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <HeaderMain />

//       {/* Scrollable main content */}
//       <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
//         <div className="w-full max-w-8xl mx-auto">
//           {/* Mobile Layout */}
//           <div className="block lg:hidden">
//             {/* Dashboard Overview - Mobile */}
//             <div className="mb-6">
//               <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
//                 Dashboard Overview
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
//                 {/* Farmers */}
//                 <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">
//                       All Farmers
//                     </p>
//                     <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
//                       {dashboardStats.totalFarmers.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-xs sm:text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmersTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmersTrend,
//                         dashboardStats.farmersChange
//                       )}
//                       {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmersCount}
//                     alt="Farmers"
//                     className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
//                   />
//                 </div>

//                 {/* Farms */}
//                 <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">
//                       All Farms
//                     </p>
//                     <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
//                       {dashboardStats.totalFarms.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-xs sm:text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmsTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmsTrend,
//                         dashboardStats.farmsChange
//                       )}
//                       {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmsCount}
//                     alt="Farms"
//                     className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
//                   />
//                 </div>

//                 {/* Scans */}
//                 <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md sm:col-span-2">
//                   <div>
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">
//                       Today's Scans
//                     </p>
//                     <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
//                       {dashboardStats.todayScans.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-xs sm:text-sm font-medium ${getTrendColor(
//                         dashboardStats.scansTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.scansTrend,
//                         dashboardStats.scansChange
//                       )}
//                       {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
//                       yesterday
//                     </span>
//                   </div>
//                   <img
//                     src={ScansCount}
//                     alt="Scans"
//                     className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activities - Mobile */}
//             <div className="mb-6">
//               <RecentActivities limit={5} />
//             </div>

//             {/* My Farms Section - Mobile */}
//             <div>
//               <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
//                 <h2 className="text-base sm:text-lg font-bold text-gray-800">
//                   My Farms
//                 </h2>
//                 <button
//                   onClick={() => setShowAddFarmModal(true)}
//                   disabled={loading}
//                   className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Plus size={16} />
//                   {loading ? "Loading..." : "Add Farm"}
//                 </button>
//               </div>

//               {/* Farms Grid - Mobile */}
//               {loading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="text-gray-500">Loading farms...</div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   {farms.length === 0 ? (
//                     <div className="col-span-1 sm:col-span-2 text-center py-12 text-gray-500">
//                       No farms added yet. Click "Add Farm" to get started!
//                     </div>
//                   ) : (
//                     farms.map((farm) => (
//                       <Link
//                         key={farm.id}
//                         to={`/farm-dashboard/${farm.id}`}
//                         className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer ${
//                           farm.status === "Active" ? "bg-white" : "bg-gray-300"
//                         }`}
//                       >
//                         <div className="relative">
//                           <img
//                             src={farm.img}
//                             alt={farm.name}
//                             className={`w-full h-32 sm:h-40 object-cover ${
//                               farm.status === "Inactive" ? "opacity-50" : ""
//                             }`}
//                           />
//                           <span
//                             className={`absolute top-3 right-3 px-2.5 py-1.5 text-[10px] sm:text-xs rounded-full font-medium ${
//                               farm.status === "Active"
//                                 ? "bg-green-500 text-white"
//                                 : "bg-red-500 text-white"
//                             }`}
//                           >
//                             {farm.status}
//                           </span>
//                         </div>
//                         <div className="p-3 sm:p-4">
//                           <h3 className="font-bold text-xs sm:text-base text-gray-800 mb-1">
//                             {farm.name}
//                           </h3>
//                           <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
//                             {farm.desc}
//                           </p>
//                           <div className="flex flex-col gap-1">
//                             <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
//                               <MapPin size={12} /> {farm.location}
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <Leaf size={12} className="text-green-500" />
//                               <span
//                                 className={`text-[10px] sm:text-xs font-medium ${getHealthColor(
//                                   farm.health
//                                 )}`}
//                               >
//                                 {farm.health} Health
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Desktop Layout */}
//           <div className="hidden lg:flex gap-6">
//             {/* Left Column - Recent Activities */}
//             <div className="w-[330px] flex-shrink-0">
//               <RecentActivities limit={5} />
//             </div>

//             {/* Right Column - Dashboard Content */}
//             <div className="flex-1">
//               {/* Dashboard Overview - Desktop */}
//               <h2 className="text-lg font-bold text-gray-800 mb-4">
//                 Dashboard Overview
//               </h2>
//               <div className="grid grid-cols-3 gap-5 mb-8">
//                 {/* Farmers */}
//                 <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-base text-gray-600 mb-2">All Farmers</p>
//                     <h3 className="text-3xl font-bold text-gray-800">
//                       {dashboardStats.totalFarmers.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmersTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmersTrend,
//                         dashboardStats.farmersChange
//                       )}
//                       {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmersCount}
//                     alt="Farmers"
//                     className="w-14 h-14 object-contain"
//                   />
//                 </div>

//                 {/* Farms */}
//                 <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-base text-gray-600 mb-2">All Farms</p>
//                     <h3 className="text-3xl font-bold text-gray-800">
//                       {dashboardStats.totalFarms.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-sm font-medium ${getTrendColor(
//                         dashboardStats.farmsTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.farmsTrend,
//                         dashboardStats.farmsChange
//                       )}
//                       {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
//                       last month
//                     </span>
//                   </div>
//                   <img
//                     src={FarmsCount}
//                     alt="Farms"
//                     className="w-14 h-14 object-contain"
//                   />
//                 </div>

//                 {/* Scans */}
//                 <div className="p-6 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-md">
//                   <div>
//                     <p className="text-base text-gray-600 mb-2">
//                       Today's Scans
//                     </p>
//                     <h3 className="text-3xl font-bold text-gray-800">
//                       {dashboardStats.todayScans.toLocaleString()}
//                     </h3>
//                     <span
//                       className={`text-sm font-medium ${getTrendColor(
//                         dashboardStats.scansTrend
//                       )}`}
//                     >
//                       {getTrendPrefix(
//                         dashboardStats.scansTrend,
//                         dashboardStats.scansChange
//                       )}
//                       {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
//                       yesterday
//                     </span>
//                   </div>
//                   <img
//                     src={ScansCount}
//                     alt="Scans"
//                     className="w-14 h-14 object-contain"
//                   />
//                 </div>
//               </div>

//               {/* My Farms Section - Desktop */}
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-bold text-gray-800">My Farms</h2>
//                   <button
//                     onClick={() => setShowAddFarmModal(true)}
//                     disabled={loading}
//                     className="bg-gradient-to-r bg-[#FF8C42] hover:bg-[#F97316] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-base transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Plus size={16} />
//                     {loading ? "Loading..." : "Add Farm"}
//                   </button>
//                 </div>

//                 {/* Farms Grid - Desktop */}
//                 {loading ? (
//                   <div className="flex justify-center items-center py-12">
//                     <div className="text-gray-500">Loading farms...</div>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-3 gap-4">
//                     {farms.length === 0 ? (
//                       <div className="col-span-3 text-center py-12 text-gray-500">
//                         No farms added yet. Click "Add Farm" to get started!
//                       </div>
//                     ) : (
//                       farms.map((farm) => (
//                         <Link
//                           key={farm.id}
//                           to={`/farm-dashboard/${farm.id}`}
//                           className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer ${
//                             farm.status === "Active"
//                               ? "bg-white"
//                               : "bg-gray-300"
//                           }`}
//                         >
//                           <div className="relative">
//                             <img
//                               src={farm.img}
//                               alt={farm.name}
//                               className={`w-full h-48 object-cover ${
//                                 farm.status === "Inactive" ? "opacity-50" : ""
//                               }`}
//                             />
//                             <span
//                               className={`absolute top-3 right-3 px-2.5 py-1.5 text-xs rounded-full font-medium ${
//                                 farm.status === "Active"
//                                   ? "bg-green-500 text-white"
//                                   : "bg-red-500 text-white"
//                               }`}
//                             >
//                               {farm.status}
//                             </span>
//                           </div>
//                           <div className="p-4">
//                             <h3 className="font-bold text-lg text-gray-800 mb-1">
//                               {farm.name}
//                             </h3>
//                             <p className="text-sm text-gray-600 mb-2 line-clamp-2">
//                               {farm.desc}
//                             </p>
//                             <div className="flex flex-col gap-1">
//                               <div className="flex items-center gap-1 text-xs text-gray-500">
//                                 <MapPin size={12} /> {farm.location}
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Leaf size={12} className="text-green-500" />
//                                 <span
//                                   className={`text-xs font-medium ${getHealthColor(
//                                     farm.health
//                                   )}`}
//                                 >
//                                   {farm.health}% Health
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </Link>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {showAddFarmModal && (
//         <AddFarmModal onClose={handleCloseModal} onSubmit={handleAddFarm} />
//       )}
//       <Footer />
//     </div>
//   );
// }
