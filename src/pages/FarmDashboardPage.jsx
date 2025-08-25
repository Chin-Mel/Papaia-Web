import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Add this import
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

export default function FarmDashboardPage() {
  const { id: farmId } = useParams(); // Extract farmId from URL parameters

  const [timeFilter, setTimeFilter] = useState("Daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [farmData, setFarmData] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [isFarmerDetailModalOpen, setIsFarmerDetailModalOpen] = useState(false);
  const [isRemoveFarmerModalOpen, setIsRemoveFarmerModalOpen] = useState(false);
  const [isFarmerAddedSuccessModalOpen, setIsFarmerAddedSuccessModalOpen] =
    useState(false);
  const [isFarmerRemovedSuccessModalOpen, setIsFarmerRemovedSuccessModalOpen] =
    useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [newlyAddedFarmer, setNewlyAddedFarmer] = useState(null);

  const timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"];

  // Fetch farm data
  useEffect(() => {
    const fetchFarmData = async () => {
      if (!farmId) {
        setError("No farm ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch all farms and find the specific one
        const response = await fetch("/api/owner/farms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch farm data");
        }

        const data = await response.json();
        const farm = data.farms.find((f) => f.id === farmId);

        if (farm) {
          setFarmData(farm);
        } else {
          setError("Farm not found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFarmData();
  }, [farmId]);

  // Fetch farmers for this farm
  useEffect(() => {
    const fetchFarmers = async () => {
      if (!farmId) return;

      try {
        const response = await fetch(`/api/owner/farmers/${farmId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch farmers");
        }

        const data = await response.json();
        setFarmers(data.farmers || []);
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setFarmers([]);
      }
    };

    fetchFarmers();
  }, [farmId]);

  // Fetch recent scans (this would need to be implemented in your backend)
  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        // This endpoint would need to be implemented in your backend
        // For now, we'll set it to empty array
        setRecentScans([]);
      } catch (err) {
        console.error("Error fetching recent scans:", err);
        setRecentScans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScans();
  }, [farmId]);

  // Determine farm status based on recent scans
  const getFarmStatus = () => {
    if (recentScans.length === 0) return "Inactive";

    // Check if there are scans within the last 5 days
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const recentScanExists = recentScans.some((scan) => {
      const scanDate = new Date(scan.createdAt || scan.time);
      return scanDate >= fiveDaysAgo;
    });

    return recentScanExists ? "Active" : "Inactive";
  };

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

  const handleDeleteFarm = async () => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        const response = await fetch(`/api/owner/farm/${farmId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete farm");
        }

        // Redirect back to dashboard
        window.history.back();
      } catch (err) {
        alert("Error deleting farm: " + err.message);
      }
    }
  };

  const handleAddFarmer = () => {
    setIsAddFarmerModalOpen(true);
  };

  const handleFarmerAdded = async (farmerData) => {
    try {
      // Add farmer via API
      const response = await fetch("/api/owner/farmer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "temp_user_id", // This should be handled by backend
          farmId: farmId,
          ...farmerData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add farmer");
      }

      setNewlyAddedFarmer(farmerData);
      setIsAddFarmerModalOpen(false);
      setIsFarmerAddedSuccessModalOpen(true);

      // Refresh farmers list
      const farmersResponse = await fetch(`/api/owner/farmers/${farmId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (farmersResponse.ok) {
        const data = await farmersResponse.json();
        setFarmers(data.farmers || []);
      }
    } catch (err) {
      console.error("Error adding farmer:", err);
      alert("Error adding farmer: " + err.message);
    }
  };

  const handleViewFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setIsFarmerDetailModalOpen(true);
  };

  const handleRemoveFarmerFromDetail = () => {
    setIsFarmerDetailModalOpen(false);
    setIsRemoveFarmerModalOpen(true);
  };

  const handleConfirmRemoveFarmer = async () => {
    try {
      const response = await fetch(`/api/owner/farmer/${selectedFarmer.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove farmer");
      }

      // Remove farmer from state
      setFarmers(farmers.filter((f) => f.id !== selectedFarmer.id));
      setIsRemoveFarmerModalOpen(false);
      setIsFarmerRemovedSuccessModalOpen(true);
    } catch (err) {
      console.error("Error removing farmer:", err);
      alert("Error removing farmer: " + err.message);
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

  const goBack = () => {
    window.history.back();
  };

  // Early return if no farmId
  if (!farmId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center mt-16 ">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: No farm ID provided</p>
            <button
              onClick={goBack}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading farm data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center mt-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={goBack}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const farmStatus = getFarmStatus();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 mt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Top Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {farmData?.farmName || "Loading..."}
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      farmStatus === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {farmStatus}
                  </span>
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {farmData?.location || "No location specified"}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition-colors">
                  <FileText className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={handleDeleteFarm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Top Row - Analytics and Recent Scans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Farm Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Farm Analytics
              </h2>

              {/* Time Filters */}
              <div className="flex gap-2 mb-6">
                {timeFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeFilter === filter
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Graph Placeholder */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Weekly Plant Condition (Scan History Log)
                </h3>
                <div className="h-48 bg-white rounded border flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Line Graph Visualization
                    </p>
                    <p className="text-xs text-gray-400">
                      Y-axis: Leaf Health Score (0-100)
                    </p>
                    <p className="text-xs text-gray-400">
                      X-axis: Week (7 weeks ago - This Week)
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-green-600 font-semibold">
                    {recentScans.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Scans</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-600 font-semibold">--</p>
                  <p className="text-sm text-gray-600">Health Score</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-600 font-semibold">--</p>
                  <p className="text-sm text-gray-600">Disease Score</p>
                </div>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Recent Scans
              </h2>
              <div className="space-y-3">
                {recentScans.length > 0 ? (
                  recentScans.map((scan, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No recent scans available</p>
                    <p className="text-sm text-gray-400">
                      Scans will appear here once farmers start using the app
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Farm Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Farm Description
              </h2>
              <button className="px-3 py-1 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Description
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {farmData?.farmName || "This farm"} is dedicated to sustainable
              agriculture practices. Our farm specializes in crop rotation,
              integrated pest management, and water conservation techniques. We
              supply fresh produce to local markets and restaurants, maintaining
              the highest standards of quality and environmental stewardship.
              Our commitment to sustainable agriculture ensures long-term soil
              health and biodiversity while providing nutritious food for our
              community.
            </p>
          </div>

          {/* Farm Team */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Farm Team</h2>
                <p className="text-gray-600">
                  Manage and track all registered farmers
                </p>
              </div>
              <button
                onClick={handleAddFarmer}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Farmer
              </button>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent appearance-none pr-10"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Farmer Table */}
            <div className="overflow-x-auto">
              {farmers.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Farmer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Farmer ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Address
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers
                      .filter(
                        (farmer) =>
                          farmer.firstname
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          farmer.lastname
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          farmer.id
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .filter(
                        (farmer) =>
                          statusFilter === "All Status" ||
                          farmer.status === statusFilter.toLowerCase()
                      )
                      .map((farmer) => (
                        <tr
                          key={farmer.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  farmer.profilePicture &&
                                  farmer.profilePicture.trim() !== ""
                                    ? farmer.profilePicture
                                    : "/assets/default-user.png"
                                }
                                alt={`${farmer.firstname} ${farmer.lastname}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />

                              <div>
                                <p className="font-medium text-gray-800">
                                  {`${farmer.firstname || ""} ${
                                    farmer.middlename || ""
                                  } ${farmer.lastname || ""} ${
                                    farmer.suffix || ""
                                  }`.trim()}
                                </p>
                                <p className="text-sm text-gray-600">Farmer</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {farmer.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-700 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                N/A
                              </p>
                              <p className="text-sm text-gray-700 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                N/A
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {`${farmer.street || ""}, ${
                              farmer.barangay || ""
                            }, ${farmer.municipality || ""}, ${
                              farmer.province || ""
                            } ${farmer.zipcode || ""}`
                              .replace(/^,\s*|,\s*$/g, "")
                              .replace(/,\s*,/g, ",")}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                farmer.status.charAt(0).toUpperCase() +
                                  farmer.status.slice(1)
                              )}`}
                            >
                              {farmer.status.charAt(0).toUpperCase() +
                                farmer.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewFarmer(farmer)}
                                className="text-green-600 hover:text-green-700 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedFarmer(farmer);
                                  setIsRemoveFarmerModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No farmers added yet</p>
                  <p className="text-sm text-gray-400">
                    Click "Add Farmer" to start building your team
                  </p>
                </div>
              )}
            </div>

            {farmers.length > 0 && (
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">
                  Showing {farmers.length} farmer
                  {farmers.length !== 1 ? "s" : ""}
                </p>
              </div>
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
    </div>
  );
}
