import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Leaf, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";
import AddFarmModal from "../components/Popups/AddFarmModal";
import RecentActivities from "../pages/RecentActivities";
import Alert from "../components/Alert";
import ScansCount from "../assets/ic_todays_scan.png";
import FarmersCount from "../assets/ic_all_farmers.png";
import FarmsCount from "../assets/ic_all_farms.png";
import MainBackground from "../assets/MainBackground.png";

// ============ CACHE & FETCH ============
const cache = {
  data: {},
  timestamps: {},
  set(key, value, ttl = 180000) {
    this.data[key] = value;
    this.timestamps[key] = Date.now() + ttl;
  },
  get(key) {
    if (this.data[key] && Date.now() < this.timestamps[key])
      return this.data[key];
    delete this.data[key];
    delete this.timestamps[key];
    return null;
  },
  clear(key) {
    key
      ? (delete this.data[key], delete this.timestamps[key])
      : ((this.data = {}), (this.timestamps = {}));
  },
};

window.clearFarmCache = () => {
  cache.clear("owner_farms");
  cache.clear("farm_count");
};

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

  // Add timeout for slow connections
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    cache.set(key, data, ttl);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// ============ UTILITY FUNCTIONS ============
const isToday = (timestampStr) => {
  try {
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return timestampStr.includes(today);
  } catch {
    return false;
  }
};

const getHealthStatus = (healthPercentage, hasScans) => {
  // If no scans yet, return null to hide the status badge
  if (!hasScans) {
    return null;
  }

  const health = parseFloat(healthPercentage);
  if (isNaN(health)) {
    return null;
  }

  // Three status levels only
  if (health >= 60) {
    return {
      status: "Healthy",
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-600",
    };
  }
  if (health >= 30) {
    return {
      status: "Moderate",
      bgColor: "bg-amber-500",
      textColor: "text-amber-600",
    };
  }
  return {
    status: "Unhealthy",
    bgColor: "bg-rose-500",
    textColor: "text-rose-600",
  };
};

const formatHealthDisplay = (health, hasScans) => {
  if (!health || health === 0 || health === "0.00") return "0.00%";
  return `${health}`;
};

// ============ STAT CARD COMPONENT ============
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="p-4 sm:p-5 lg:p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
    <div>
      <p className="text-sm sm:text-base text-slate-600 mb-2 font-medium">
        {title}
      </p>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
        {value.toLocaleString()}
      </h3>
    </div>
    <div
      className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full ${bgColor} flex items-center justify-center`}
    >
      <img
        src={icon}
        alt={title}
        className="w-8 h-8 lg:w-9 lg:h-9 object-contain"
        loading="lazy"
      />
    </div>
  </div>
);

// ============ FARM CARD COMPONENT ============
const FarmCard = ({ farm, isMobile }) => {
  const healthStatus = getHealthStatus(farm.health, farm.hasScans);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/farm-dashboard/${farm.id}`}
      className={`backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
        farm.isActive ? "bg-white/80" : "bg-slate-200/50"
      }`}
    >
      <div className="relative">
        <img
          src={imageError ? MainBackground : farm.img}
          alt={farm.name}
          className={`w-full ${
            isMobile ? "h-32 sm:h-40" : "h-48"
          } object-cover ${!farm.isActive ? "opacity-50 grayscale" : ""}`}
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {healthStatus && (
          <span
            className={`absolute top-3 right-3 px-3 py-1.5 text-[10px] sm:text-xs rounded-full font-semibold shadow-lg ${healthStatus.bgColor} text-white`}
          >
            {healthStatus.status}
          </span>
        )}
      </div>
      <div className={`${isMobile ? "p-3 sm:p-4" : "p-4"}`}>
        <h3
          className={`font-bold ${
            isMobile ? "text-xs sm:text-base" : "text-lg"
          } text-slate-900 mb-1`}
        >
          {farm.name}
        </h3>
        <p
          className={`${
            isMobile ? "text-xs sm:text-sm" : "text-sm"
          } text-slate-600 mb-2 line-clamp-2`}
        >
          {farm.desc}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex items-center gap-1.5 ${
              isMobile ? "text-[10px] sm:text-xs" : "text-xs"
            } text-slate-500 flex-1 min-w-0`}
          >
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
              className={`${
                isMobile ? "text-[10px] sm:text-xs" : "text-xs"
              } font-semibold whitespace-nowrap ${
                healthStatus ? healthStatus.textColor : "text-slate-600"
              }`}
            >
              {formatHealthDisplay(farm.health, farm.hasScans)} Health
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ============ MAIN COMPONENT ============
export default function DashboardPage() {
  const location = useLocation();
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [dashboardStats, setDashboardStats] = useState({
    totalFarmers: 0,
    totalFarms: 0,
    todayScans: 0,
  });
  const mountedRef = useRef(false);

  useEffect(() => {
    [ScansCount, FarmersCount, FarmsCount].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (location.state?.refreshFarms) {
      cache.clear("owner_farms");
      cache.clear("farm_count");
      fetchFarms();
      fetchDashboardStats();
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchDashboardStats = async () => {
    try {
      const API_BASE = "https://papaiaapi.onrender.com/api/owner";
      const [farmCountData, farmerCountData, identificationData] =
        await Promise.all([
          cachedFetch(`${API_BASE}/count-farms`, {}, "farm_count", 60000).catch(
            () => ({})
          ),
          cachedFetch(
            `${API_BASE}/count-farmers`,
            {},
            "farmer_count",
            60000
          ).catch(() => ({})),
          cachedFetch(
            `${API_BASE}/identification-history`,
            {},
            "id_history",
            120000
          ).catch(() => []),
        ]);

      const todayScansCount = Array.isArray(identificationData)
        ? identificationData.filter((pred) => isToday(pred.timestamp)).length
        : 0;

      setDashboardStats({
        totalFarmers: farmerCountData.totalFarmers || 0,
        totalFarms: farmCountData.farmCount || 0,
        todayScans: todayScansCount,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const fetchFarmHealth = async (farmId) => {
    try {
      const data = await cachedFetch(
        `https://papaiaapi.onrender.com/api/owner/farm-health/${farmId}`,
        {},
        `farm_health_${farmId}`,
        120000
      );

      // Check if farm has predictions
      const hasScans = data.totalPredictions > 0;

      return {
        health: data.healthPercentage || "0.00%",
        hasScans: hasScans,
      };
    } catch {
      return {
        health: "0.00%",
        hasScans: false,
      };
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

      if (data.status === "success" && Array.isArray(data.farms)) {
        const mappedFarms = data.farms.map((f) => {
          let farmImage = MainBackground;
          if (f.farmImage && f.farmImage.startsWith("http")) {
            farmImage = f.farmImage;
            const img = new Image();
            img.src = farmImage;
          }
          return {
            id: f.id,
            name: f.farmName || "Unnamed Farm",
            desc:
              f.description ||
              `Farm located in ${f.location || "Unknown location"}`,
            location: f.location || "Unknown",
            health: "0.00%",
            hasScans: false,
            img: farmImage,
            isActive: f.status === "active",
          };
        });

        const sortedFarms = mappedFarms.sort((a, b) => {
          if (a.isActive && !b.isActive) return -1;
          if (!a.isActive && b.isActive) return 1;
          return parseFloat(b.health) - parseFloat(a.health);
        });

        setFarms(sortedFarms);
        setLoading(false);

        // Fetch health for each farm
        sortedFarms.forEach(async (farm) => {
          const healthData = await fetchFarmHealth(farm.id);
          setFarms((prev) =>
            prev.map((f) =>
              f.id === farm.id
                ? {
                    ...f,
                    health: healthData.health,
                    hasScans: healthData.hasScans,
                  }
                : f
            )
          );
        });
      } else {
        setFarms([]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching farms:", err);
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
      if (farmData.farmImage) formData.append("farmImage", farmData.farmImage);

      const token = localStorage.getItem("token");
      const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success") {
        cache.clear("owner_farms");
        cache.clear("farm_count");
        await Promise.all([fetchFarms(), fetchDashboardStats()]);
        if (window.refreshActivities) window.refreshActivities();
        setShowAddFarmModal(false);
        setAlert({ type: "success", message: "Farm added successfully!" });
      }
    } catch (err) {
      console.error("Error adding farm:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "All Farmers",
      value: dashboardStats.totalFarmers,
      icon: FarmersCount,
      bgColor: "bg-[#DCFCE7]",
    },
    {
      title: "All Farms",
      value: dashboardStats.totalFarms,
      icon: FarmsCount,
      bgColor: "bg-[#FEF9C3]",
    },
    {
      title: "Today's Scans",
      value: dashboardStats.todayScans,
      icon: ScansCount,
      bgColor: "bg-[#DBEAFE]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <HeaderMain />
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="w-full max-w-8xl mx-auto">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                {stats.map((stat, idx) => (
                  <div
                    key={stat.title}
                    className={idx === 2 ? "sm:col-span-2" : ""}
                  >
                    <StatCard {...stat} />
                  </div>
                ))}
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
                      <FarmCard key={farm.id} farm={farm} isMobile />
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
                {stats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
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
                        <FarmCard key={farm.id} farm={farm} isMobile={false} />
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
        <AddFarmModal
          isOpen={showAddFarmModal}
          onClose={() => setShowAddFarmModal(false)}
          onSubmit={handleAddFarm}
        />
      )}
      <Footer />
    </div>
  );
}
