import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  Search,
  ChevronDown,
  Plus,
  Eye,
  Leaf,
  TrendingUp,
  MapPin,
  Edit3,
  User,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import AddFarmerModal from "../components/Popups/AddFarmerModal";
import FarmerDetailModal from "../components/Popups/FarmerDetailModal";
import RemoveFarmerModal from "../components/Popups/RemoveFarmerModal";
import FarmerAddedSuccessModal from "../components/Popups/FarmerAddedSuccessModal";
import FarmerRemovedSuccessModal from "../components/Popups/FarmerRemovedSuccessModal";
import DeactivateFarmModal from "../components/Popups/DeactivateFarmModal";
import EditFarmModal from "../components/Popups/EditFarmModal";
import FarmAnalytics from "./FarmAnalytics";

// --- StatusDropdown Component ---
function StatusDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["All Status", "Active", "Pending", "Inactive"];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[160px] sm:min-w-[180px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-sm sm:text-base hover:bg-gray-100 bg-white transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
      >
        {value}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-sm sm:text-base"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FarmDashboardPage() {
  const { id: farmId } = useParams();
  const navigate = useNavigate();

  const [farmData, setFarmData] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  const [timeFilter, setTimeFilter] = useState("Daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [isFarmerAddedSuccessModalOpen, setIsFarmerAddedSuccessModalOpen] =
    useState(false);
  const [isFarmerRemovedSuccessModalOpen, setIsFarmerRemovedSuccessModalOpen] =
    useState(false);
  const [isFarmerDetailModalOpen, setIsFarmerDetailModalOpen] = useState(false);
  const [isRemoveFarmerModalOpen, setIsRemoveFarmerModalOpen] = useState(false);
  const [isDeactivateFarmModalOpen, setIsDeactivateFarmModalOpen] =
    useState(false);
  const [isEditFarmModalOpen, setIsEditFarmModalOpen] = useState(false);

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [newlyAddedFarmer, setNewlyAddedFarmer] = useState(null);

  const timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"];

  // Fetch farm data
  const fetchFarmData = async () => {
    if (!farmId) return;
    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/owner/farms",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      const farm = data.farms.find((f) => f.id === farmId);
      setFarmData(farm || null);
    } catch (err) {
      console.error("Failed to fetch farm data:", err);
    }
  };

  // Then in the first useEffect, just call it:
  useEffect(() => {
    fetchFarmData();
  }, [farmId]);

  // Fetch farmers
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

    const fetchFarmers = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === "success" && isMounted) {
          setFarmers(data.farmers || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFarmers();

    return () => {
      isMounted = false;
    };
  }, [farmId]);

  // Fetch analytics
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true; // Add cleanup flag

    const fetchAnalytics = async () => {
      try {
        const endpointMap = {
          Daily: "daily-analytics",
          Weekly: "weekly-analytics",
          Monthly: "monthly-analytics",
          Yearly: "yearly-analytics",
        };
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/owner/${endpointMap[timeFilter]}/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();

        // Only update state if component is still mounted
        if (isMounted) {
          setAnalyticsData(data);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        if (isMounted) {
          setAnalyticsData(null);
        }
      }
    };

    fetchAnalytics();
    const interval = setInterval(() => {
      if (isMounted) {
        fetchAnalytics();
      }
    }, 5000);

    return () => {
      isMounted = false; // Mark as unmounted
      clearInterval(interval);
    };
  }, [farmId, timeFilter]);

  // Handlers
  const handleAddFarmer = () => setIsAddFarmerModalOpen(true);

  const handleFarmerAdded = (farmerData, refreshedFarmers) => {
    setIsAddFarmerModalOpen(false);
    setNewlyAddedFarmer(farmerData);
    setIsFarmerAddedSuccessModalOpen(true);

    if (refreshedFarmers && refreshedFarmers.length >= 0) {
      setFarmers(refreshedFarmers);
    }
  };

  const handleViewFarmer = async (farmerId) => {
    try {
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${farmerId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setSelectedFarmer(data.farmer);
        setIsFarmerDetailModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFarmerFromDetail = () => {
    setIsFarmerDetailModalOpen(false);
    setIsRemoveFarmerModalOpen(true);
  };

  const handleConfirmRemoveFarmer = async () => {
    try {
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${selectedFarmer.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error("Failed to remove farmer");
      setFarmers(farmers.filter((f) => f.id !== selectedFarmer.id));
      setIsRemoveFarmerModalOpen(false);
      setIsFarmerRemovedSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleBackToDetailModal = () => {
    setIsRemoveFarmerModalOpen(false);
    setIsFarmerDetailModalOpen(true);
  };

  const handleSuccessModalClose = () => {
    setIsFarmerAddedSuccessModalOpen(false);
    setIsFarmerRemovedSuccessModalOpen(false);
    setSelectedFarmer(null);
    setNewlyAddedFarmer(null);
  };

  const handleCloseEditFarmModal = () => setIsEditFarmModalOpen(false);

  const handleFarmUpdated = () => {
    fetchFarmData(); // Refresh farm data after successful update
  };

  const handleDeactivateFarm = async (farmId) => {
    try {
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farm/${farmId}`, // Added /api/
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (!res.ok || data.status !== "success")
        throw new Error(data.message || "Failed");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const goBack = () => window.history.back();

  // Farm status
  const farmStatus = recentScans.length
    ? new Date(
        Math.max(...recentScans.map((s) => new Date(s.createdAt || s.time)))
      ) > new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      ? "Active"
      : "Inactive"
    : "Inactive";

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-orange-600 bg-orange-100";
      case "Inactive":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="space-y-6">
          {/* Top Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <button
                  onClick={goBack}
                  className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800 mt-7 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {farmData?.farmName || "Farm Name"}
                </h1>
                <span
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full ${
                    farmStatus === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {farmStatus}
                </span>
              </div>
              <p className="text-gray-600 flex items-center gap-1 sm:gap-2 ml-7 -mt-3 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                {farmData?.location || "No location specified"}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 bg-[#CA8A04] text-white rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-yellow-700">
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => setIsDeactivateFarmModalOpen(true)}
                className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-red-500 text-red-500 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
                Deactivate
              </button>
            </div>
          </div>

          {/* Analytics + Scans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Farm Analytics */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[400px] sm:min-h-[450px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">
                  Farm Analytics
                </h2>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer ${
                        timeFilter === filter
                          ? "bg-green-700 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <FarmAnalytics
                analyticsData={analyticsData}
                timeFilter={timeFilter}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div className="text-center">
                  <p className="text-green-600 font-semibold text-lg sm:text-xl">
                    {recentScans.length}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    Total Scans
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-blue-600 font-semibold text-lg sm:text-xl">
                    --
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    Health Score
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-orange-600 font-semibold text-lg sm:text-xl">
                    --
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    Disease Score
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-h-[400px] sm:min-h-[450px]">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
                Recent Scans
              </h2>
              {recentScans.length === 0 ? (
                <div className="text-center py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
                  <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
                  <p className="text-sm sm:text-base text-gray-500">
                    No recent scans available
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={
                          scan.user?.avatar && scan.user?.avatar.trim() !== ""
                            ? scan.user.avatar
                            : "/assets/default-user.png"
                        }
                        alt={scan.user?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {scan.status || "Scan Result"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {scan.user?.name || "Unknown User"} •{" "}
                          {scan.time || "Recently"}
                        </p>
                      </div>
                      <div className="text-2xl">{scan.icon || "📊"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Farm Description */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">
                Farm Description
              </h2>
              <button
                onClick={() => setIsEditFarmModalOpen(true)}
                className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit Description
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {farmData?.description || "No description available"}
            </p>
          </div>

          {/* Farm Team */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-800">
                  Farm Team
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage and track all registered farmers
                </p>
              </div>

              {/* Search + Filter + Add Button */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto items-start sm:items-center">
                <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 min-w-[120px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search farmers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <StatusDropdown
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                </div>

                <button
                  onClick={handleAddFarmer}
                  className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Farmer
                </button>
              </div>
            </div>

            <div
              className="grid gap-2 sm:gap-4 border-b border-gray-200 pb-2 mb-4 text-gray-600 text-xs sm:text-sm font-medium bg-[#F9FAFB] items-center"
              style={{
                gridTemplateColumns: "3fr 2fr 2.5fr 4fr 2fr 2fr",
              }}
            >
              <div className="text-left pl-2 sm:pl-4 pt-2">Farmer</div>
              <div className="text-left pl-2 sm:pl-4 pt-2">Farmer ID</div>
              <div className="text-left pl-2 sm:pl-4 pt-2">Contact</div>
              <div className="text-left pl-2 sm:pl-4 pt-2 truncate">
                Address
              </div>
              <div className="text-left pl-2 sm:pl-4 pt-2">Status</div>
              <div className="text-left pl-2 sm:pl-4 pt-2">See Details</div>
            </div>

            {/* Farmers List */}
            {farmers.length === 0 ? (
              <div className="text-center py-6 sm:py-8 col-span-6">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm sm:text-base">No farmers added yet.</p>
              </div>
            ) : (
              farmers
                .filter(
                  (farmer) =>
                    farmer.firstname
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    farmer.lastname
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    String(farmer.id || "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .filter(
                  (farmer) =>
                    statusFilter === "All Status" ||
                    farmer.status === statusFilter.toLowerCase()
                )
                .map((farmer) => (
                  <div
                    key={farmer.id}
                    className="grid gap-2 sm:gap-4 py-2 border-b border-gray-100 text-xs sm:text-sm sm:items-center items-start"
                    style={{
                      gridTemplateColumns: "3fr 2fr 2.5fr 4fr 2fr 2fr",
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4">
                      <img
                        src={
                          farmer.profilePicture &&
                          farmer.profilePicture.trim() !== ""
                            ? farmer.profilePicture
                            : "/assets/default-user.png"
                        }
                        alt={`${farmer.firstname || farmer.firstName} ${
                          farmer.lastname || farmer.lastName
                        }`}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-xs sm:text-sm">
                          {(() => {
                            // Handle both API field name formats
                            const firstName =
                              farmer.firstname || farmer.firstName || "";
                            const middleName =
                              farmer.middlename || farmer.middleName || "";
                            const lastName =
                              farmer.lastname || farmer.lastName || "";
                            const suffix = farmer.suffix || "";

                            const nameParts = [
                              firstName,
                              middleName,
                              lastName,
                              suffix,
                            ].filter(Boolean);
                            return nameParts.length > 0
                              ? nameParts.join(" ")
                              : "N/A";
                          })()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {farmer.role || "Farmer"}
                        </p>
                      </div>
                    </div>

                    <div className="pl-2 sm:pl-4 text-gray-700">
                      {farmer.idNumber}
                    </div>

                    <div className="pl-2 sm:pl-4">
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {farmer.contactNumber || farmer.phone || "N/A"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {farmer.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="pl-2 sm:pl-4 text-xs sm:text-sm text-gray-700 truncate">
                      {(() => {
                        const addressParts = [
                          farmer.street,
                          farmer.barangay,
                          farmer.municipality,
                          farmer.province,
                          farmer.zipcode || farmer.zipCode, // Handle both field names
                        ].filter(Boolean);

                        return addressParts.length > 0
                          ? addressParts.join(", ")
                          : "N/A";
                      })()}
                    </div>

                    <div className="pl-2 sm:pl-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          farmer.status.charAt(0).toUpperCase() +
                            farmer.status.slice(1)
                        )}`}
                      >
                        {farmer.status.charAt(0).toUpperCase() +
                          farmer.status.slice(1)}
                      </span>
                    </div>

                    <div className="pl-2 sm:pl-4">
                      <button
                        onClick={() => handleViewFarmer(farmer.id)}
                        className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer text-green-500 hover:underline text-xs sm:text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <AddFarmerModal
        isOpen={isAddFarmerModalOpen}
        onClose={() => setIsAddFarmerModalOpen(false)}
        onFarmerAdded={handleFarmerAdded}
        farmId={farmId}
      />

      <EditFarmModal
        isOpen={isEditFarmModalOpen}
        onClose={handleCloseEditFarmModal}
        farmData={farmData}
        onFarmUpdated={handleFarmUpdated} // Add this prop
      />

      <FarmerDetailModal
        isOpen={isFarmerDetailModalOpen}
        onClose={() => setIsFarmerDetailModalOpen(false)}
        onRemoveFarmer={handleRemoveFarmerFromDetail}
        farmer={selectedFarmer}
      />

      <RemoveFarmerModal
        isOpen={isRemoveFarmerModalOpen}
        onClose={handleBackToDetailModal}
        onConfirmRemove={handleConfirmRemoveFarmer}
        farmer={selectedFarmer}
      />

      <FarmerAddedSuccessModal
        isOpen={isFarmerAddedSuccessModalOpen}
        onClose={handleSuccessModalClose}
        farmer={newlyAddedFarmer}
      />

      <FarmerRemovedSuccessModal
        isOpen={isFarmerRemovedSuccessModalOpen}
        onClose={handleSuccessModalClose}
        farmer={selectedFarmer}
      />

      <DeactivateFarmModal
        isOpen={isDeactivateFarmModalOpen}
        onClose={() => setIsDeactivateFarmModalOpen(false)}
        farmData={farmData}
        onConfirmDeactivate={handleDeactivateFarm}
      />
    </div>
  );
}
