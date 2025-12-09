import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Edit3,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Lock,
} from "lucide-react";
import { useAlert } from "../AlertContext";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";
import AddFarmerModal from "../components/Popups/AddFarmerModal";
import FarmerDetailModal from "../components/Popups/FarmerDetailModal";
import RemoveFarmerModal from "../components/Popups/RemoveFarmerModal";
import EditFarmModal from "../components/Popups/EditFarmModal";
import ToggleFarmStatusModal from "../components/Popups/ToggleFarmStatusModal";
import RestoreFarmerModal from "../components/Popups/RestoreFarmerModal";
import FarmAnalytics from "./FarmAnalytics";
import RecentScans from "./RecentScans";
import FarmTeams from "./FarmTeams";
import FarmAnalyticsSummary from "./FarmAnalyticsSummary";
import ScansBreakdown from "./ScansBreakdown";
import { nav } from "framer-motion/client";

export default function FarmDashboardPage() {
  const { id: farmId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [farmData, setFarmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("Daily");
  const [dateRange, setDateRange] = useState("Last 11 days");
  const [teamsRefreshTrigger, setTeamsRefreshTrigger] = useState(0);

  // Modal states
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [isFarmerDetailModalOpen, setIsFarmerDetailModalOpen] = useState(false);
  const [isRemoveFarmerModalOpen, setIsRemoveFarmerModalOpen] = useState(false);
  const [isToggleFarmStatusModalOpen, setIsToggleFarmStatusModalOpen] =
    useState(false);
  const [isEditFarmModalOpen, setIsEditFarmModalOpen] = useState(false);
  const [isRestoreFarmerModalOpen, setIsRestoreFarmerModalOpen] =
    useState(false);

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"];

  // Refresh farm data function
  const refreshFarmData = useCallback(async () => {
    if (!farmId) return;

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/owner/farms",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      const farm = data.farms?.find((f) => f.id === farmId);
      if (farm) {
        setFarmData(farm);
      }
    } catch (error) {
      console.error("Failed to refresh farm data:", error);
    }
  }, [farmId]);

  // Fetch farm data on mount
  useEffect(() => {
    if (!farmId) return;

    const fetchFarmData = async () => {
      try {
        const response = await fetch(
          "https://papaiaapi.onrender.com/api/owner/farms",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        const farm = data.farms?.find((f) => f.id === farmId);
        setFarmData(farm || null);
      } catch {
        setFarmData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmData();
  }, [farmId]);

  const isActive = farmData?.status === "active";

  // Handlers
  const handleAddFarmer = () => {
    if (!isActive) return;
    setIsAddFarmerModalOpen(true);
  };

  const handleFarmerAdded = async () => {
    setIsAddFarmerModalOpen(false);
    showAlert("success", "Farmer Added Successfully!");
    setTeamsRefreshTrigger((prev) => prev + 1);
  };

  const handleViewFarmer = (farmerData) => {
    // Data is already complete, just set it and open modal
    setSelectedFarmer(farmerData);
    setIsFarmerDetailModalOpen(true);
  };

  const handleRemoveFarmerFromDetail = () => {
    if (!isActive) return;
    setIsFarmerDetailModalOpen(false);
    setIsRemoveFarmerModalOpen(true);
  };

  const handleConfirmRemoveFarmer = async () => {
    if (!isActive || !selectedFarmer) return;

    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${selectedFarmer.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove farmer");
      }

      setIsRemoveFarmerModalOpen(false);
      showAlert("success", "Farmer Removed Successfully!");
      setTeamsRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  const handleBackToDetailModal = () => {
    setIsRemoveFarmerModalOpen(false);
    setIsFarmerDetailModalOpen(true);
  };

  const handleRestoreFarmerFromDetail = () => {
    setIsFarmerDetailModalOpen(false);
    setIsRestoreFarmerModalOpen(true);
  };

  const handleFarmUpdated = async () => {
    await refreshFarmData();
    setIsEditFarmModalOpen(false);
    showAlert("success", "Farm Updated Successfully!");
  };

  const handleStatusToggled = async (newStatus, errorMessage) => {
    if (errorMessage) {
      // Show error alert
      showAlert("error", errorMessage);
      return;
    }

    if (newStatus) {
      // Update local state immediately
      setFarmData((prev) => ({ ...prev, status: newStatus }));

      // Show success alert
      showAlert(
        "success",
        newStatus === "active"
          ? "Farm Activated Successfully!"
          : "Farm Deactivated Successfully!"
      );

      // Navigate to dashboard only if deactivated
      if (newStatus === "inactive") {
        navigate("/dashboard");
      } else {
        // Stay on page and refresh data
        await refreshFarmData();
      }
    }
  };

  const handleRestore = async () => {
    if (!selectedFarmer) return;

    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/restore-farmer/${selectedFarmer.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message?.includes("already added") ||
          data.message?.includes("another farm")
        ) {
          throw new Error("This farmer is already added to another farm.");
        }
        throw new Error(data.message || "Failed to restore farmer");
      }

      showAlert("success", "Farmer Restored Successfully!");
      setIsRestoreFarmerModalOpen(false);
      setTeamsRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      showAlert("error", err.message);
      throw err;
    }
  };

  const goBack = () =>
    navigate("/dashboard", { state: { refreshFarms: false } });

  // Not found state
  if (!loading && !farmData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Farm Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The requested farm could not be found.
            </p>
            <button
              onClick={goBack}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 overflow-x-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="w-full max-w-8xl mx-auto">
          {/* Header Section */}
          {farmData && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <button
                      onClick={goBack}
                      className="transition-all duration-150 active:scale-95 flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {farmData.farmName}
                    </h1>
                    <span
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full flex items-center gap-1.5 ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-gray-600 flex items-center gap-1 sm:gap-2 ml-7 text-sm sm:text-base">
                    <MapPin
                      size={12}
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 fill-slate-500"
                      fill="currentColor"
                    />
                    {farmData.location || "No location specified"}
                  </p>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => isActive && setIsEditFarmModalOpen(true)}
                    disabled={!isActive}
                    className={`group transition-all duration-200 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      !isActive
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer hover:from-amber-600 hover:to-yellow-700"
                    }`}
                    title={!isActive ? "Farm must be active to edit" : ""}
                  >
                    <Edit3 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    <span className="hidden sm:inline">Edit Farm</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => setIsToggleFarmStatusModalOpen(true)}
                    className={`group transition-all duration-200 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      isActive
                        ? "bg-white border-2 border-red-500 text-red-600 hover:bg-red-50"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                    }`}
                  >
                    {isActive ? (
                      <ToggleLeft className="w-4 h-4 transition-transform group-hover:scale-110" />
                    ) : (
                      <ToggleRight className="w-4 h-4 transition-transform group-hover:scale-110" />
                    )}
                    <span className="hidden sm:inline">
                      {isActive ? "Deactivate" : "Activate"}
                    </span>
                    <span className="sm:hidden">{isActive ? "Off" : "On"}</span>
                  </button>
                </div>
              </div>

              {/* Inactive Farm Banner */}
              {!isActive && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4 sm:p-5 rounded-xl mb-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Lock className="w-5 h-5 text-red-600 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-red-900 font-bold text-sm sm:text-base mb-1">
                        Farm Currently Inactive
                      </h3>
                      <p className="text-red-800 text-xs sm:text-sm leading-relaxed">
                        This farm is in view-only mode. All management features
                        are temporarily disabled. Activate the farm above to
                        restore full functionality and team management
                        capabilities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {farmData.description || "No description available"}
                </p>
              </div>
            </>
          )}

          {/* Analytics & Breakdown */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 ${
              !isActive ? "pointer-events-none" : ""
            }`}
          >
            <div className="lg:col-span-2 pb-4">
              <FarmAnalytics
                farmId={farmId}
                timeFilter={timeFilter}
                onTimeFilterChange={isActive ? setTimeFilter : () => {}}
                onDateRangeChange={setDateRange}
                timeFilters={timeFilters}
              />
            </div>
            <div className="lg:col-span-1 pb-4">
              <ScansBreakdown
                farmId={farmId}
                timeFilter={timeFilter}
                dateRange={dateRange}
              />
            </div>
          </div>

          {/* Summary & Recent Scans */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 pb-4 ${
              !isActive ? "pointer-events-none" : ""
            }`}
          >
            <div className="lg:col-span-2">
              <FarmAnalyticsSummary
                farmId={farmId}
                timeFilter={timeFilter}
                dateRange={dateRange}
              />
            </div>
            <div className="lg:col-span-1">
              <RecentScans
                farmId={farmId}
                timeFilter={timeFilter}
                dateRange={dateRange}
              />
            </div>
          </div>

          {/* Farm Teams */}
          <div className={`pb-4 ${!isActive ? "pointer-events-none" : ""}`}>
            <FarmTeams
              farmId={farmId}
              onAddFarmer={handleAddFarmer}
              onViewFarmer={handleViewFarmer}
              refreshTrigger={teamsRefreshTrigger}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {farmData && isActive && (
        <>
          <AddFarmerModal
            isOpen={isAddFarmerModalOpen}
            onClose={() => setIsAddFarmerModalOpen(false)}
            onFarmerAdded={handleFarmerAdded}
            farmId={farmId}
          />

          <EditFarmModal
            isOpen={isEditFarmModalOpen}
            onClose={() => setIsEditFarmModalOpen(false)}
            farmData={farmData}
            onFarmUpdated={handleFarmUpdated}
          />

          <FarmerDetailModal
            isOpen={isFarmerDetailModalOpen}
            onClose={() => setIsFarmerDetailModalOpen(false)}
            onRemoveFarmer={handleRemoveFarmerFromDetail}
            onRestoreFarmer={handleRestoreFarmerFromDetail}
            farmer={selectedFarmer}
          />

          <RemoveFarmerModal
            isOpen={isRemoveFarmerModalOpen}
            onClose={handleBackToDetailModal}
            onConfirmRemove={handleConfirmRemoveFarmer}
            farmer={selectedFarmer}
          />

          <RestoreFarmerModal
            isOpen={isRestoreFarmerModalOpen}
            onClose={() => setIsRestoreFarmerModalOpen(false)}
            onConfirm={handleRestore}
            farmer={selectedFarmer}
          />
        </>
      )}

      {farmData && (
        <ToggleFarmStatusModal
          isOpen={isToggleFarmStatusModalOpen}
          onClose={() => setIsToggleFarmStatusModalOpen(false)}
          farmData={farmData}
          onStatusToggled={handleStatusToggled}
        />
      )}
    </div>
  );
}
