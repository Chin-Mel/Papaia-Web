// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FileText,
//   MapPin,
//   Edit3,
//   ArrowLeft,
//   ToggleLeft,
//   ToggleRight,
// } from "lucide-react";
// import HeaderMain from "../components/Header/HeaderMain";
// import Footer from "../components/Footer/FooterMain";
// import AddFarmerModal from "../components/Popups/AddFarmerModal";
// import FarmerDetailModal from "../components/Popups/FarmerDetailModal";
// import RemoveFarmerModal from "../components/Popups/RemoveFarmerModal";
// import FarmerAddedSuccessModal from "../components/Popups/FarmerAddedSuccessModal";
// import FarmerRemovedSuccessModal from "../components/Popups/FarmerRemovedSuccessModal";
// import EditFarmModal from "../components/Popups/EditFarmModal";
// import ToggleFarmStatusModal from "../components/Popups/ToggleFarmStatusModal";

// // Import our separate components
// import FarmAnalytics from "./FarmAnalytics";
// import RecentScans from "./RecentScans";
// import FarmTeams from "./FarmTeams";
// import FarmAnalyticsSummary from "./FarmAnalyticsSummary";

// export default function FarmDashboardPage() {
//   const { id: farmId } = useParams();
//   const navigate = useNavigate();

//   // Farm data state
//   const [farmData, setFarmData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Time filter for analytics
//   const [timeFilter, setTimeFilter] = useState("Daily");

//   // Modal states
//   const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
//   const [isFarmerAddedSuccessModalOpen, setIsFarmerAddedSuccessModalOpen] =
//     useState(false);
//   const [isFarmerRemovedSuccessModalOpen, setIsFarmerRemovedSuccessModalOpen] =
//     useState(false);
//   const [isFarmerDetailModalOpen, setIsFarmerDetailModalOpen] = useState(false);
//   const [isRemoveFarmerModalOpen, setIsRemoveFarmerModalOpen] = useState(false);
//   const [isToggleFarmStatusModalOpen, setIsToggleFarmStatusModalOpen] =
//     useState(false);
//   const [isEditFarmModalOpen, setIsEditFarmModalOpen] = useState(false);

//   // Selected farmer states
//   const [selectedFarmer, setSelectedFarmer] = useState(null);
//   const [newlyAddedFarmer, setNewlyAddedFarmer] = useState(null);

//   const timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"];

//   // Fetch farm data
//   const fetchFarmData = async () => {
//     if (!farmId) return;
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://papaiaapi.onrender.com/api/owner/farms",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const data = await response.json();
//       const farm = data.farms?.find((f) => f.id === farmId);
//       setFarmData(farm || null);
//     } catch (error) {
//       console.error("Failed to fetch farm data:", error);
//       setFarmData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFarmData();
//   }, [farmId]);

//   // Handlers
//   const handleAddFarmer = () => setIsAddFarmerModalOpen(true);

//   const handleFarmerAdded = async (farmerData) => {
//     try {
//       setIsAddFarmerModalOpen(false);
//       setNewlyAddedFarmer(farmerData);
//       setIsFarmerAddedSuccessModalOpen(true);

//       // Refresh activities immediately
//       if (window.refreshActivities) {
//         window.refreshActivities();
//       }
//     } catch (error) {
//       console.error("Error handling farmer addition:", error);
//     }
//   };

//   const handleViewFarmer = async (farmerId) => {
//     try {
//       const response = await fetch(
//         `https://papaiaapi.onrender.com/api/owner/farmer/${farmerId}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       const data = await response.json();
//       if (data.status === "success") {
//         setSelectedFarmer(data.farmer);
//         setIsFarmerDetailModalOpen(true);
//       }
//     } catch (error) {
//       console.error("Error fetching farmer details:", error);
//     }
//   };

//   const handleRemoveFarmerFromDetail = () => {
//     setIsFarmerDetailModalOpen(false);
//     setIsRemoveFarmerModalOpen(true);
//   };

//   const handleConfirmRemoveFarmer = async () => {
//     try {
//       const response = await fetch(
//         `https://papaiaapi.onrender.com/api/owner/farmer/${selectedFarmer.id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       if (!response.ok) throw new Error("Failed to remove farmer");

//       setIsRemoveFarmerModalOpen(false);
//       setIsFarmerRemovedSuccessModalOpen(true);

//       // Refresh activities immediately
//       if (window.refreshActivities) {
//         window.refreshActivities();
//       }
//     } catch (error) {
//       console.error("Error removing farmer:", error);
//       alert(error.message);
//     }
//   };

//   const handleBackToDetailModal = () => {
//     setIsRemoveFarmerModalOpen(false);
//     setIsFarmerDetailModalOpen(true);
//   };

//   const handleSuccessModalClose = () => {
//     setIsFarmerAddedSuccessModalOpen(false);
//     setIsFarmerRemovedSuccessModalOpen(false);
//     setSelectedFarmer(null);
//     setNewlyAddedFarmer(null);
//   };

//   const handleCloseEditFarmModal = () => setIsEditFarmModalOpen(false);

//   const handleFarmUpdated = () => {
//     fetchFarmData(); // Refresh farm data after successful update

//     // Refresh activities immediately
//     if (window.refreshActivities) {
//       window.refreshActivities();
//     }
//   };

//   const handleStatusToggled = (newStatus) => {
//     // Update local farm data
//     setFarmData((prev) => ({ ...prev, status: newStatus }));

//     // Navigate to dashboard with refresh flag
//     navigate("/dashboard", { state: { refreshFarms: true } });
//   };

//   const goBack = () =>
//     navigate("/dashboard", { state: { refreshFarms: false } });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <HeaderMain />
//         <main className="flex-1 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (!farmData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <HeaderMain />
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-xl font-bold text-gray-800 mb-2">
//               Farm Not Found
//             </h1>
//             <p className="text-gray-600 mb-4">
//               The requested farm could not be found.
//             </p>
//             <button
//               onClick={goBack}
//               className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
//             >
//               Go Back
//             </button>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   const isActive = farmData.status === "active";

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <HeaderMain />

//       <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
//         <div className="space-y-6">
//           {/* Top Header Section */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 sm:gap-3 mb-2">
//                 <button
//                   onClick={goBack}
//                   className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
//                 >
//                   <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </button>
//                 <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//                   {farmData.farmName}
//                 </h1>
//                 <span
//                   className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full ${
//                     isActive
//                       ? "bg-green-100 text-green-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {isActive ? "Active" : "Inactive"}
//                 </span>
//               </div>
//               <p className="text-gray-600 flex items-center gap-1 sm:gap-2 ml-7 text-sm sm:text-base">
//                 <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
//                 {farmData.location || "No location specified"}
//               </p>
//             </div>
//             <div className="flex gap-2 sm:gap-3">
//               <button
//                 onClick={() => setIsEditFarmModalOpen(true)}
//                 className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 bg-[#CA8A04] text-white rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-yellow-700"
//               >
//                 <Edit3 className="w-4 h-4" />
//                 Edit Farm
//               </button>
//               <button
//                 onClick={() => setIsToggleFarmStatusModalOpen(true)}
//                 className={`transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 border rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
//                   isActive
//                     ? "border-red-500 text-red-500 hover:bg-red-600 hover:text-white"
//                     : "border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
//                 }`}
//               >
//                 {isActive ? (
//                   <ToggleLeft className="w-4 h-4" />
//                 ) : (
//                   <ToggleRight className="w-4 h-4" />
//                 )}
//                 {isActive ? "Deactivate" : "Activate"}
//               </button>
//             </div>
//           </div>

//           {/* Farm Description - Now at the top without background */}
//           <div className="mb-4">
//             <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
//               {farmData.description || "No description available"}
//             </p>
//           </div>

//           {/* Analytics + Recent Scans */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//             {/* Farm Analytics - 2/3 width */}
//             <div className="lg:col-span-2">
//               <FarmAnalytics
//                 farmId={farmId}
//                 timeFilter={timeFilter}
//                 onTimeFilterChange={setTimeFilter}
//                 timeFilters={timeFilters}
//               />
//             </div>

//             {/* Recent Scans - 1/3 width */}
//             <div className="lg:col-span-1">
//               <RecentScans farmId={farmId} />
//             </div>
//           </div>

//           {/* Farm Analytics Summary - Above Farm Team */}
//           <FarmAnalyticsSummary farmId={farmId} timeFilter={timeFilter} />

//           {/* Farm Team */}
//           <FarmTeams
//             farmId={farmId}
//             onAddFarmer={handleAddFarmer}
//             onViewFarmer={handleViewFarmer}
//           />
//         </div>
//       </main>

//       <Footer />

//       {/* Modals */}
//       <AddFarmerModal
//         isOpen={isAddFarmerModalOpen}
//         onClose={() => setIsAddFarmerModalOpen(false)}
//         onFarmerAdded={handleFarmerAdded}
//         farmId={farmId}
//       />

//       <EditFarmModal
//         isOpen={isEditFarmModalOpen}
//         onClose={handleCloseEditFarmModal}
//         farmData={farmData}
//         onFarmUpdated={handleFarmUpdated}
//       />

//       <FarmerDetailModal
//         isOpen={isFarmerDetailModalOpen}
//         onClose={() => setIsFarmerDetailModalOpen(false)}
//         onRemoveFarmer={handleRemoveFarmerFromDetail}
//         farmer={selectedFarmer}
//       />

//       <RemoveFarmerModal
//         isOpen={isRemoveFarmerModalOpen}
//         onClose={handleBackToDetailModal}
//         onConfirmRemove={handleConfirmRemoveFarmer}
//         farmer={selectedFarmer}
//       />

//       <FarmerAddedSuccessModal
//         isOpen={isFarmerAddedSuccessModalOpen}
//         onClose={handleSuccessModalClose}
//         farmer={newlyAddedFarmer}
//       />

//       <FarmerRemovedSuccessModal
//         isOpen={isFarmerRemovedSuccessModalOpen}
//         onClose={handleSuccessModalClose}
//         farmer={selectedFarmer}
//       />

//       <ToggleFarmStatusModal
//         isOpen={isToggleFarmStatusModalOpen}
//         onClose={() => setIsToggleFarmStatusModalOpen(false)}
//         farmData={farmData}
//         onStatusToggled={handleStatusToggled}
//       />
//     </div>
//   );
// }

//new
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  MapPin,
  Edit3,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Lock,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";
import AddFarmerModal from "../components/Popups/AddFarmerModal";
import FarmerDetailModal from "../components/Popups/FarmerDetailModal";
import RemoveFarmerModal from "../components/Popups/RemoveFarmerModal";
import FarmerAddedSuccessModal from "../components/Popups/FarmerAddedSuccessModal";
import FarmerRemovedSuccessModal from "../components/Popups/FarmerRemovedSuccessModal";
import EditFarmModal from "../components/Popups/EditFarmModal";
import ToggleFarmStatusModal from "../components/Popups/ToggleFarmStatusModal";

// Import our separate components
import FarmAnalytics from "./FarmAnalytics";
import RecentScans from "./RecentScans";
import FarmTeams from "./FarmTeams";
import FarmAnalyticsSummary from "./FarmAnalyticsSummary";

export default function FarmDashboardPage() {
  const { id: farmId } = useParams();
  const navigate = useNavigate();

  // Farm data state
  const [farmData, setFarmData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Time filter for analytics
  const [timeFilter, setTimeFilter] = useState("Daily");

  // Modal states
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [isFarmerAddedSuccessModalOpen, setIsFarmerAddedSuccessModalOpen] =
    useState(false);
  const [isFarmerRemovedSuccessModalOpen, setIsFarmerRemovedSuccessModalOpen] =
    useState(false);
  const [isFarmerDetailModalOpen, setIsFarmerDetailModalOpen] = useState(false);
  const [isRemoveFarmerModalOpen, setIsRemoveFarmerModalOpen] = useState(false);
  const [isToggleFarmStatusModalOpen, setIsToggleFarmStatusModalOpen] =
    useState(false);
  const [isEditFarmModalOpen, setIsEditFarmModalOpen] = useState(false);

  // Selected farmer states
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [newlyAddedFarmer, setNewlyAddedFarmer] = useState(null);

  const timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"];

  // Fetch farm data
  const fetchFarmData = async () => {
    if (!farmId) return;
    setLoading(true);
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
    } catch (error) {
      console.error("Failed to fetch farm data:", error);
      setFarmData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, [farmId]);

  // Check if farm is active
  const isActive = farmData?.status === "active";

  // Handlers - with inactive farm checks
  const handleAddFarmer = () => {
    if (!isActive) return;
    setIsAddFarmerModalOpen(true);
  };

  const handleFarmerAdded = async (farmerData) => {
    if (!isActive) return;
    try {
      setIsAddFarmerModalOpen(false);
      setNewlyAddedFarmer(farmerData);
      setIsFarmerAddedSuccessModalOpen(true);

      // Refresh activities immediately
      if (window.refreshActivities) {
        window.refreshActivities();
      }
    } catch (error) {
      console.error("Error handling farmer addition:", error);
    }
  };

  const handleViewFarmer = async (farmerId) => {
    if (!isActive) return;
    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${farmerId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setSelectedFarmer(data.farmer);
        setIsFarmerDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching farmer details:", error);
    }
  };

  const handleRemoveFarmerFromDetail = () => {
    if (!isActive) return;
    setIsFarmerDetailModalOpen(false);
    setIsRemoveFarmerModalOpen(true);
  };

  const handleConfirmRemoveFarmer = async () => {
    if (!isActive) return;
    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${selectedFarmer.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) throw new Error("Failed to remove farmer");

      setIsRemoveFarmerModalOpen(false);
      setIsFarmerRemovedSuccessModalOpen(true);

      // Refresh activities immediately
      if (window.refreshActivities) {
        window.refreshActivities();
      }
    } catch (error) {
      console.error("Error removing farmer:", error);
      alert(error.message);
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

    // Refresh activities immediately
    if (window.refreshActivities) {
      window.refreshActivities();
    }
  };

  const handleStatusToggled = (newStatus) => {
    // Update local farm data
    setFarmData((prev) => ({ ...prev, status: newStatus }));

    // Navigate to dashboard with refresh flag
    navigate("/dashboard", { state: { refreshFarms: true } });
  };

  const goBack = () =>
    navigate("/dashboard", { state: { refreshFarms: false } });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!farmData) {
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
          {/* Top Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <button
                  onClick={goBack}
                  className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {farmData.farmName}
                </h1>
                <span
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-gray-600 flex items-center gap-1 sm:gap-2 ml-7 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
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

          {/* Inactive Farm Warning Banner */}
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
                    This farm is in view-only mode. All management features are
                    temporarily disabled. Activate the farm above to restore
                    full functionality and team management capabilities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Farm Description */}
          <div className={`mb-4 ${!isActive ? "opacity-50" : ""}`}>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {farmData.description || "No description available"}
            </p>
          </div>

          {/* Analytics + Recent Scans - Disabled overlay when inactive */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative ${
              !isActive ? "opacity-40 pointer-events-none select-none" : ""
            }`}
          >
            {!isActive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <div className="bg-white/98 backdrop-blur-md px-8 py-5 rounded-2xl shadow-2xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      <Lock className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base mb-0.5">
                        Farm Inactive
                      </p>
                      <p className="text-sm text-gray-600">
                        Activate to view analytics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Farm Analytics - 2/3 width */}
            <div className="lg:col-span-2">
              <FarmAnalytics
                farmId={farmId}
                timeFilter={timeFilter}
                onTimeFilterChange={isActive ? setTimeFilter : () => {}}
                timeFilters={timeFilters}
              />
            </div>

            {/* Recent Scans - 1/3 width */}
            <div className="lg:col-span-1">
              <RecentScans farmId={farmId} />
            </div>
          </div>

          {/* Farm Analytics Summary - Disabled when inactive */}
          <div
            className={`relative ${
              !isActive ? "opacity-40 pointer-events-none select-none" : ""
            }`}
          >
            {!isActive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <p className="font-medium text-gray-700 text-sm">
                      Summary Locked
                    </p>
                  </div>
                </div>
              </div>
            )}
            <FarmAnalyticsSummary farmId={farmId} timeFilter={timeFilter} />
          </div>

          {/* Farm Team - Disabled when inactive */}
          <div
            className={`relative ${
              !isActive ? "opacity-40 pointer-events-none select-none" : ""
            }`}
          >
            {!isActive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <p className="font-medium text-gray-700 text-sm">
                      Team Management Locked
                    </p>
                  </div>
                </div>
              </div>
            )}
            <FarmTeams
              farmId={farmId}
              onAddFarmer={isActive ? handleAddFarmer : () => {}}
              onViewFarmer={isActive ? handleViewFarmer : () => {}}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals - Only work when farm is active */}
      {isActive && (
        <>
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
            onFarmUpdated={handleFarmUpdated}
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
        </>
      )}

      {/* Toggle Status Modal - Always available */}
      <ToggleFarmStatusModal
        isOpen={isToggleFarmStatusModalOpen}
        onClose={() => setIsToggleFarmStatusModalOpen(false)}
        farmData={farmData}
        onStatusToggled={handleStatusToggled}
      />
    </div>
  );
}
