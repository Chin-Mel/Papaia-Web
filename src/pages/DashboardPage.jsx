import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Leaf, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";
import AddFarmModal from "../components/Popups/AddFarmModal";
import RecentActivities from "../pages/RecentActivities";
import { useAlert } from "../AlertContext";
import ScansCount from "../assets/ic_todays_scan.png";
import FarmersCount from "../assets/ic_all_farmers.png";
import FarmsCount from "../assets/ic_all_farms.png";
import DefaultFarmImage from "../assets/MainBackground.png";

const API_BASE = "https://papaiaapi.onrender.com/api/owner";
const POLL_INTERVAL = 5000;
const DEBOUNCE_DELAY = 500;

const persistentCache = new Map();
const MAX_CACHE_SIZE = 50;

const cachedFetch = async (
  url,
  cacheKey,
  ttl = 300000,
  bypassCache = false
) => {
  if (!bypassCache) {
    const cached = persistentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
  }

  const token = localStorage.getItem("token");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (persistentCache.size >= MAX_CACHE_SIZE) {
      const firstKey = persistentCache.keys().next().value;
      persistentCache.delete(firstKey);
    }

    persistentCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const isToday = (timestampStr) => {
  if (!timestampStr) return false;
  try {
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return String(timestampStr).includes(today);
  } catch {
    return false;
  }
};

const getHealthStatus = (healthPercentage, hasScans) => {
  if (!hasScans) return null;
  const health = parseFloat(healthPercentage);
  if (isNaN(health)) return null;
  if (health >= 70)
    return {
      status: "Healthy",
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-600",
    };
  if (health >= 30)
    return {
      status: "At Risk",
      bgColor: "bg-amber-500",
      textColor: "text-amber-600",
    };
  return {
    status: "Critical",
    bgColor: "bg-red-500",
    textColor: "text-red-600",
  };
};

const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="p-3 sm:p-4 lg:p-5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl flex justify-between items-center shadow-md hover:shadow-lg transition-all duration-300">
    <div>
      <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">
        {title}
      </p>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </h3>
    </div>
    <div
      className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full ${bgColor} flex items-center justify-center`}
    >
      <img
        src={icon}
        alt={title}
        className="w-6 h-6 lg:w-7 lg:h-7 object-contain"
        loading="eager"
      />
    </div>
  </div>
);

const FarmCard = ({ farm, isMobile }) => {
  const healthStatus = useMemo(
    () => getHealthStatus(farm.health, farm.hasScans),
    [farm.health, farm.hasScans]
  );
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/farm-dashboard/${farm.id}`}
      state={{ farmData: farm }}
      className={`backdrop-blur-sm border border-slate-200/60 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
        farm.isActive ? "bg-white/80" : "bg-slate-200/50"
      }`}
    >
      <div className="relative">
        <img
          src={imageError ? DefaultFarmImage : farm.img}
          alt={farm.name}
          className={`w-full ${
            isMobile ? "h-28 sm:h-36" : "h-40"
          } object-cover ${!farm.isActive ? "opacity-50 grayscale" : ""}`}
          loading="eager"
          onError={() => setImageError(true)}
        />
        {healthStatus && (
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-semibold shadow-lg ${healthStatus.bgColor} text-white`}
          >
            {healthStatus.status}
          </span>
        )}
      </div>
      <div className={`${isMobile ? "p-2 sm:p-3" : "p-3"}`}>
        <h3
          className={`font-bold ${
            isMobile ? "text-xs sm:text-sm" : "text-base"
          } text-slate-900 mb-1 truncate`}
        >
          {farm.name}
        </h3>
        <p
          className={`${
            isMobile ? "text-xs" : "text-sm"
          } text-slate-600 mb-2 line-clamp-2`}
        >
          {farm.desc}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex items-center gap-1 ${
              isMobile ? "text-xs" : "text-xs"
            } text-slate-500 flex-1 min-w-0`}
          >
            <MapPin
              size={12}
              className="flex-shrink-0 fill-slate-500"
              fill="currentColor"
            />
            <span className="truncate">{farm.location}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Leaf size={12} className="text-emerald-500" />
            <span
              className={`${
                isMobile ? "text-xs" : "text-xs"
              } font-semibold whitespace-nowrap ${
                healthStatus ? healthStatus.textColor : "text-slate-600"
              }`}
            >
              {farm.health || "0.00%"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

export default function DashboardPage() {
  const location = useLocation();
  const { showAlert } = useAlert();
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [farms, setFarms] = useState([]);
  const [isAddingFarm, setIsAddingFarm] = useState(false);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalFarmers: 0,
    totalFarms: 0,
    todayScans: 0,
  });

  const hasInitialLoad = useRef(false);
  const abortControllerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const lastFetchTime = useRef(0);

  const fetchDashboardStats = useCallback(async (silent = false) => {
    const now = Date.now();
    if (now - lastFetchTime.current < DEBOUNCE_DELAY && silent) {
      return;
    }
    lastFetchTime.current = now;

    try {
      const [farmCountData, farmerCountData, identificationData] =
        await Promise.all([
          cachedFetch(
            `${API_BASE}/count-farms`,
            "farm_count",
            10000,
            !silent
          ).catch(() => ({})),
          cachedFetch(
            `${API_BASE}/count-farmers`,
            "farmer_count",
            10000,
            !silent
          ).catch(() => ({})),
          cachedFetch(
            `${API_BASE}/identification-history`,
            "id_history",
            10000,
            !silent
          ).catch(() => []),
        ]);

      const todayScansCount = Array.isArray(identificationData)
        ? identificationData.filter((pred) => isToday(pred.timestamp)).length
        : 0;

      setDashboardStats((prev) => {
        const newStats = {
          totalFarmers: farmerCountData.totalFarmers || 0,
          totalFarms: farmCountData.farmCount || 0,
          todayScans: todayScansCount,
        };

        if (JSON.stringify(prev) !== JSON.stringify(newStats)) {
          return newStats;
        }
        return prev;
      });
    } catch {}
  }, []);

  const fetchFarmHealth = useCallback(async (farmId, silent = false) => {
    try {
      const data = await cachedFetch(
        `${API_BASE}/farm-health/${farmId}`,
        `farm_health_${farmId}`,
        10000,
        !silent
      );
      return {
        health: data.healthPercentage || "0.00%",
        hasScans: data.totalPredictions > 0,
      };
    } catch {
      return { health: "0.00%", hasScans: false };
    }
  }, []);

  const fetchFarms = useCallback(
    async (silent = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!silent && !hasInitialLoad.current) {
        setLoadingFarms(true);
      }

      try {
        const data = await cachedFetch(
          `${API_BASE}/farms`,
          "owner_farms",
          10000,
          !silent
        );

        if (data.status === "success" && Array.isArray(data.farms)) {
          const mappedFarms = data.farms.map((f) => ({
            id: f.id,
            name: f.farmName || "Unnamed Farm",
            desc: f.description || "No farm description",
            location: f.location || "Unknown",
            health: "0.00%",
            hasScans: false,
            img:
              f.farmImage && f.farmImage.startsWith("http")
                ? f.farmImage
                : DefaultFarmImage,
            isActive: f.status === "active",
            createdAt: f.createdAt || new Date().toISOString(),
          }));

          const sortedFarms = mappedFarms.sort((a, b) => {
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          setFarms((prev) => {
            if (
              JSON.stringify(prev.map((f) => f.id)) !==
              JSON.stringify(sortedFarms.map((f) => f.id))
            ) {
              return sortedFarms;
            }
            return prev;
          });

          Promise.all(
            sortedFarms.map((farm) => fetchFarmHealth(farm.id, silent))
          )
            .then((healthResults) => {
              setFarms((prev) =>
                prev.map((f, index) => ({
                  ...f,
                  health: healthResults[index].health,
                  hasScans: healthResults[index].hasScans,
                }))
              );
            })
            .catch(() => {});
        } else {
          setFarms([]);
        }
      } catch {
        if (!silent) {
          setFarms([]);
        }
      } finally {
        if (!silent && !hasInitialLoad.current) {
          setLoadingFarms(false);
          hasInitialLoad.current = true;
        }
      }
    },
    [fetchFarmHealth]
  );

  useEffect(() => {
    const isSilent = hasInitialLoad.current;

    fetchFarms(isSilent);
    fetchDashboardStats(isSilent);

    pollIntervalRef.current = setInterval(() => {
      if (!document.hidden) {
        fetchFarms(true);
        fetchDashboardStats(true);
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchFarms, fetchDashboardStats]);

  useEffect(() => {
    if (location.state?.refreshFarms) {
      persistentCache.delete("owner_farms");
      persistentCache.delete("farm_count");
      persistentCache.delete("farmer_count");
      persistentCache.delete("id_history");
      fetchFarms(false);
      fetchDashboardStats(false);
      window.history.replaceState({}, document.title);
    }
  }, [location, fetchFarms, fetchDashboardStats]);

  useEffect(() => {
    const handleFarmUpdate = () => {
      persistentCache.delete("owner_farms");
      fetchFarms(true);
      fetchDashboardStats(true);
    };

    window.addEventListener("farmUpdated", handleFarmUpdate);
    return () => window.removeEventListener("farmUpdated", handleFarmUpdate);
  }, [fetchFarms, fetchDashboardStats]);

  const handleAddFarm = async (farmData) => {
    try {
      setIsAddingFarm(true);
      const formData = new FormData();
      formData.append("farmName", farmData.name);
      formData.append("location", farmData.location);
      formData.append(
        "description",
        farmData.description || "No farm description"
      );
      if (farmData.farmImage) {
        formData.append("farmImage", farmData.farmImage);
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/farm`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success") {
        persistentCache.delete("owner_farms");
        persistentCache.delete("farm_count");
        await Promise.all([fetchFarms(false), fetchDashboardStats(false)]);
        if (window.refreshActivities) window.refreshActivities();
        setShowAddFarmModal(false);
        showAlert("success", "Farm added successfully!");
      } else {
        throw new Error(data.message || "Failed to add farm");
      }
    } catch (error) {
      showAlert("error", error.message || "Failed to add farm");
    } finally {
      setIsAddingFarm(false);
    }
  };

  const stats = useMemo(
    () => [
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
    ],
    [dashboardStats]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <HeaderMain />
      <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="w-full max-w-8xl mx-auto">
          <div className="block lg:hidden">
            <div className="mb-4">
              <RecentActivities limit={5} />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  My Farms
                </h2>
                <button
                  onClick={() => setShowAddFarmModal(true)}
                  disabled={isAddingFarm}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add Farm
                </button>
              </div>

              {loadingFarms ? (
                <div className="min-h-[300px]">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {farms.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                      <Leaf className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">
                        Add your first farm to get started
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

          <div className="hidden lg:flex gap-6">
            <div className="w-[330px] flex-shrink-0">
              <RecentActivities limit={5} />
            </div>
            <div className="flex-1">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800">My Farms</h2>
                  <button
                    onClick={() => setShowAddFarmModal(true)}
                    disabled={isAddingFarm}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Plus size={16} />
                    Add Farm
                  </button>
                </div>

                {loadingFarms ? (
                  <div className="min-h-[400px]">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {farms.length === 0 ? (
                      <div className="col-span-3 bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                        <Leaf className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-lg text-slate-600 font-medium">
                          Add your first farm to get started
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
