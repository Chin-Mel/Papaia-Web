//new
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Leaf, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";
import AddFarmModal from "../components/Popups/AddFarmModal";
import RecentActivities from "../pages/RecentActivities";
import ScansCount from "../assets/ic_todays_scan.png";
import FarmersCount from "../assets/ic_all_farmers.png";
import FarmsCount from "../assets/ic_all_farms.png";
import FarmAddedSuccessModal from "../components/Popups/FarmAddedSuccessModal";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedFarmData, setAddedFarmData] = useState(null);

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
      cache.clear("owner_farms");
      cache.clear("farm_count");
      fetchFarms();
      fetchDashboardStats();
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

        if (window.refreshActivities) {
          window.refreshActivities();
        }

        setAddedFarmData(farmData);
        setShowAddFarmModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => setShowAddFarmModal(false);

  // Add these handlers
  const handleViewDashboard = () => {
    setShowSuccessModal(false);
    // Optionally navigate to the new farm's dashboard if you have the farm ID
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    setAddedFarmData(null);
    setShowAddFarmModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAddedFarmData(null);
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "increase":
        return "text-emerald-600";
      case "decrease":
        return "text-rose-600";
      default:
        return "text-slate-600";
    }
  };

  const getTrendPrefix = (trend) => {
    if (trend === "increase") return "+";
    if (trend === "decrease") return "-";
    return "";
  };

  const getHealthColor = (healthPercentage) => {
    if (healthPercentage >= 80) return "text-emerald-600";
    else if (healthPercentage >= 60) return "text-amber-600";
    else if (healthPercentage >= 40) return "text-orange-600";
    else if (healthPercentage >= 20) return "text-rose-600";
    else return "text-slate-600";
  };

  const formatHealthDisplay = (health) => {
    if (health === 0 || health === "0.00") return "0.00%";
    return `${health}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="w-full max-w-8xl mx-auto">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                {/* All Farmers */}
                <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                  <div>
                    <p className="text-sm sm:text-base text-slate-600 mb-2 font-medium">
                      All Farmers
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {dashboardStats.totalFarmers.toLocaleString()}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${getTrendColor(
                        dashboardStats.farmersTrend
                      )}`}
                    >
                      {getTrendPrefix(dashboardStats.farmersTrend)}
                      {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                    <img
                      src={FarmersCount}
                      alt="Farmers"
                      className="w-8 h-8 object-contain"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* All Farms */}
                <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                  <div>
                    <p className="text-sm sm:text-base text-slate-600 mb-2 font-medium">
                      All Farms
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {dashboardStats.totalFarms.toLocaleString()}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${getTrendColor(
                        dashboardStats.farmsTrend
                      )}`}
                    >
                      {getTrendPrefix(dashboardStats.farmsTrend)}
                      {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#FEF9C3] flex items-center justify-center">
                    <img
                      src={FarmsCount}
                      alt="Farms"
                      className="w-8 h-8 object-contain"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Today's Scans */}
                <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 sm:col-span-2">
                  <div>
                    <p className="text-sm sm:text-base text-slate-600 mb-2 font-medium">
                      Today's Scans
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {dashboardStats.todayScans.toLocaleString()}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${getTrendColor(
                        dashboardStats.scansTrend
                      )}`}
                    >
                      {getTrendPrefix(dashboardStats.scansTrend)}
                      {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                      yesterday
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                    <img
                      src={ScansCount}
                      alt="Scans"
                      className="w-8 h-8 object-contain"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <RecentActivities limit={5} />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  My Farms
                </h2>
                <button
                  onClick={() => setShowAddFarmModal(true)}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  {loading ? "Loading..." : "Add Farm"}
                </button>
              </div>

              {loading && farms.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-slate-200 border-t-slate-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {farms.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-medium">
                        No farms added yet
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        Click "Add Farm" to get started!
                      </p>
                    </div>
                  ) : (
                    farms.map((farm) => (
                      <Link
                        key={farm.id}
                        to={`/farm-dashboard/${farm.id}`}
                        className={`border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
                          farm.status === "Active"
                            ? "bg-white/80 backdrop-blur-sm"
                            : "bg-slate-200/50"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={farm.img}
                            alt={farm.name}
                            className={`w-full h-32 sm:h-40 object-cover ${
                              farm.status === "Inactive"
                                ? "opacity-50 grayscale"
                                : ""
                            }`}
                            loading="eager"
                          />
                          <span
                            className={`absolute top-3 right-3 px-3 py-1.5 text-[10px] sm:text-xs rounded-full font-semibold shadow-lg ${
                              farm.status === "Active"
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-500 text-white"
                            }`}
                          >
                            {farm.status}
                          </span>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-bold text-xs sm:text-base text-slate-900 mb-1">
                            {farm.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2">
                            {farm.desc}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 flex-1 min-w-0">
                              <MapPin
                                size={12}
                                className="flex-shrink-0 fill-slate-500"
                                fill="currentColor"
                              />
                              <span className="truncate">{farm.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Leaf size={12} className="text-emerald-500" />
                              <span
                                className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${getHealthColor(
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
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-3 gap-5 mb-8">
                <div className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                  <div>
                    <p className="text-base text-slate-600 mb-2 font-medium">
                      All Farmers
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900">
                      {dashboardStats.totalFarmers.toLocaleString()}
                    </h3>
                    <span
                      className={`text-sm font-semibold ${getTrendColor(
                        dashboardStats.farmersTrend
                      )}`}
                    >
                      {getTrendPrefix(dashboardStats.farmersTrend)}
                      {Math.abs(dashboardStats.farmersChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                    <img
                      src={FarmersCount}
                      alt="Farmers"
                      className="w-9 h-9 object-contain"
                      loading="eager"
                    />
                  </div>
                </div>

                <div className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                  <div>
                    <p className="text-base text-slate-600 mb-2 font-medium">
                      All Farms
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900">
                      {dashboardStats.totalFarms.toLocaleString()}
                    </h3>
                    <span
                      className={`text-sm font-semibold ${getTrendColor(
                        dashboardStats.farmsTrend
                      )}`}
                    >
                      {getTrendPrefix(dashboardStats.farmsTrend)}
                      {Math.abs(dashboardStats.farmsChange).toFixed(1)}% from
                      last month
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#FEF9C3] flex items-center justify-center">
                    <img
                      src={FarmsCount}
                      alt="Farms"
                      className="w-9 h-9 object-contain"
                      loading="eager"
                    />
                  </div>
                </div>

                <div className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                  <div>
                    <p className="text-base text-slate-600 mb-2 font-medium">
                      Today's Scans
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900">
                      {dashboardStats.todayScans.toLocaleString()}
                    </h3>
                    <span
                      className={`text-sm font-semibold ${getTrendColor(
                        dashboardStats.scansTrend
                      )}`}
                    >
                      {getTrendPrefix(dashboardStats.scansTrend)}
                      {Math.abs(dashboardStats.scansChange).toFixed(1)}% from
                      yesterday
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                    <img
                      src={ScansCount}
                      alt="Scans"
                      className="w-9 h-9 object-contain"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800">My Farms</h2>
                  <button
                    onClick={() => setShowAddFarmModal(true)}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-base font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                    {loading ? "Loading..." : "Add Farm"}
                  </button>
                </div>

                {loading && farms.length === 0 ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-slate-200 border-t-slate-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {farms.length === 0 ? (
                      <div className="col-span-3 bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <Leaf className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-lg text-slate-600 font-medium">
                          No farms added yet
                        </p>
                        <p className="text-slate-500 mt-2">
                          Click "Add Farm" to get started!
                        </p>
                      </div>
                    ) : (
                      farms.map((farm) => (
                        <Link
                          key={farm.id}
                          to={`/farm-dashboard/${farm.id}`}
                          className={`border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
                            farm.status === "Active"
                              ? "bg-white/80 backdrop-blur-sm"
                              : "bg-slate-200/50"
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={farm.img}
                              alt={farm.name}
                              className={`w-full h-48 object-cover ${
                                farm.status === "Inactive"
                                  ? "opacity-50 grayscale"
                                  : ""
                              }`}
                              loading="eager"
                            />
                            <span
                              className={`absolute top-3 right-3 px-3 py-1.5 text-xs rounded-full font-semibold shadow-lg ${
                                farm.status === "Active"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-500 text-white"
                              }`}
                            >
                              {farm.status}
                            </span>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-slate-900 mb-1">
                              {farm.name}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {farm.desc}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-1 min-w-0">
                                <MapPin
                                  size={12}
                                  className="flex-shrink-0 fill-slate-500"
                                  fill="currentColor"
                                />
                                <span className="truncate">
                                  {farm.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <Leaf size={12} className="text-emerald-500" />
                                <span
                                  className={`text-xs font-semibold whitespace-nowrap ${getHealthColor(
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

      {showSuccessModal && (
        <FarmAddedSuccessModal
          onClose={handleCloseSuccessModal}
          onViewDashboard={handleViewDashboard}
          onAddAnother={handleAddAnother}
          farmData={addedFarmData}
        />
      )}
      <Footer />
    </div>
  );
}
