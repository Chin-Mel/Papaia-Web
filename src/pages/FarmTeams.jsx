import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import UserAvatar from "../components/UserAvatar";

function StatusDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["All Status", "Active", "Inactive", "Archived"];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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
        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-sm sm:text-base hover:bg-gray-50 bg-white transition-all"
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
              className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-sm sm:text-base transition-colors"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FarmTeams({
  farmId,
  onAddFarmer,
  onViewFarmer,
  refreshTrigger,
}) {
  const [allFarmersData, setAllFarmersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 5;
  const abortControllerRef = useRef(null);

  const fetchAllFarmers = useCallback(
    async (silent = false) => {
      if (!farmId) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!silent && isInitialLoad) {
        setLoading(true);
      }

      try {
        // Fetch active farmers with full details
        const activeFarmersResponse = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const activeFarmersData = await activeFarmersResponse.json();

        // Fetch archived farmers
        const archivedFarmersResponse = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farmers_backup/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const archivedFarmersData = await archivedFarmersResponse.json();

        // Get full details for active farmers in parallel
        const activeFarmersList = activeFarmersData.farmers || [];
        const farmersWithDetails = await Promise.all(
          activeFarmersList.map(async (farmer) => {
            try {
              const detailResponse = await fetch(
                `https://papaiaapi.onrender.com/api/owner/farmer/${farmer.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              const detailData = await detailResponse.json();

              if (detailData.status === "success" && detailData.farmer) {
                return { ...detailData.farmer, isArchived: false };
              }

              return { ...farmer, isArchived: false };
            } catch {
              return { ...farmer, isArchived: false };
            }
          })
        );

        // Format archived farmers
        const archivedFarmersFormatted =
          archivedFarmersData.status === "success" &&
          archivedFarmersData.removedFarmers
            ? archivedFarmersData.removedFarmers.map((farmer) => ({
                ...farmer,
                isArchived: true,
                status: "archived",
              }))
            : [];

        // Combine all farmers
        setAllFarmersData([...farmersWithDetails, ...archivedFarmersFormatted]);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching farmers:", error);
        }
      } finally {
        if (!silent && isInitialLoad) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    },
    [farmId, isInitialLoad]
  );

  // Initial fetch and polling
  useEffect(() => {
    fetchAllFarmers();

    // Poll every 2 seconds
    const interval = setInterval(() => fetchAllFarmers(true), 2000);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAllFarmers]);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchAllFarmers(true);
    }
  }, [refreshTrigger, fetchAllFarmers]);

  const formatName = useCallback((farmer) => {
    if (!farmer) return "N/A";
    const nameParts = [
      farmer.firstname || farmer.firstName || "",
      farmer.middlename || farmer.middleName || "",
      farmer.lastname || farmer.lastName || "",
      farmer.suffix || "",
    ].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(" ") : "N/A";
  }, []);

  const formatAddress = useCallback((farmer) => {
    if (!farmer) return "No address";
    const addressParts = [
      farmer.street,
      farmer.barangay,
      farmer.municipality,
      farmer.province,
    ].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(", ") : "No address";
  }, []);

  const filteredFarmers = allFarmersData.filter((farmer) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const farmerStatus = (farmer.status || "active").toLowerCase();
    const matchesStatus =
      statusFilter === "All Status" ||
      farmerStatus === statusFilter.toLowerCase();

    if (!searchLower) return matchesStatus;

    const searchFields = [
      farmer.firstname,
      farmer.firstName,
      farmer.middlename,
      farmer.middleName,
      farmer.lastname,
      farmer.lastName,
      farmer.suffix,
      farmer.idNumber,
      farmer.street,
      farmer.barangay,
      farmer.municipality,
      farmer.province,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchFields.includes(searchLower) && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);
  const startIndex = (currentPage - 1) * farmersPerPage;
  const currentFarmers = filteredFarmers.slice(
    startIndex,
    startIndex + farmersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusColor = useCallback((status) => {
    if (!status) return "text-gray-600 bg-gray-50 border-gray-200";
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "active":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "inactive":
      case "deactivate":
        return "text-slate-700 bg-slate-50 border-slate-200";
      case "archived":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  }, []);

  const formatStatus = useCallback((status) => {
    if (!status) return "Active";
    if (status.toLowerCase() === "deactivate") return "Inactive";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }, []);

  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  // Handle view farmer - pass complete data immediately
  const handleViewFarmer = useCallback(
    (farmer) => {
      onViewFarmer(farmer);
    },
    [onViewFarmer]
  );

  const activeFarmers = allFarmersData.filter((f) => !f.isArchived);
  const archivedFarmers = allFarmersData.filter((f) => f.isArchived);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Users className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Farm Team
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {allFarmersData.length}{" "}
              {allFarmersData.length === 1 ? "member" : "members"} (
              {activeFarmers.length} active, {archivedFarmers.length} archived)
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 min-w-[120px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
            <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
          </div>

          <button
            onClick={onAddFarmer}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-sm flex items-center gap-2 text-xs sm:text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Farmer
          </button>
        </div>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 mb-3 text-gray-600 text-xs font-semibold uppercase bg-gray-50 px-4 py-3 rounded-lg">
        <div className="col-span-3">Farmer</div>
        <div className="col-span-2">Farmer ID</div>
        <div className="col-span-4">Address</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* Farmers List */}
      {currentFarmers.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-500 mb-1">
            {allFarmersData.length === 0
              ? "No farmers added yet"
              : "No farmers match your search"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-green-600 hover:text-green-700 text-sm font-medium mt-2"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentFarmers.map((farmer) => {
            const farmerName = formatName(farmer);
            const farmerAddress = formatAddress(farmer);
            const farmerStatus = farmer.status || "active";
            const isArchived =
              farmer.isArchived || farmerStatus.toLowerCase() === "archived";
            const isInactive =
              farmerStatus.toLowerCase() === "deactivate" ||
              farmerStatus.toLowerCase() === "inactive";

            return (
              <div
                key={farmer.id}
                className={`bg-white border rounded-lg p-4 transition-all ${
                  isArchived
                    ? "opacity-60 bg-gray-50 border-gray-300"
                    : isInactive
                    ? "opacity-70 border-gray-200"
                    : "border-gray-200 hover:border-green-300 hover:shadow-md"
                }`}
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={farmer.profilePicture || defaultUserPic}
                        alt={farmerName}
                        className={`w-12 h-12 rounded-full object-cover border-2 ${
                          isArchived || isInactive
                            ? "grayscale border-gray-300"
                            : "border-gray-200"
                        }`}
                        onError={(e) => (e.target.src = defaultUserPic)}
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          isArchived
                            ? "bg-red-500"
                            : farmerStatus === "active"
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-sm ${
                          isArchived ? "text-gray-500" : "text-gray-900"
                        }`}
                      >
                        {farmerName}
                      </h3>
                      <p
                        className={`text-xs font-mono mt-1 ${
                          isArchived ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {farmer.idNumber || "N/A"}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                          farmerStatus
                        )}`}
                      >
                        {formatStatus(farmerStatus)}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-3 ${
                      isArchived ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {farmerAddress}
                  </p>
                  <button
                    onClick={() => handleViewFarmer(farmer)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    View Details →
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 ${
                          isArchived || isInactive ? "grayscale" : ""
                        }`}
                      >
                        <UserAvatar
                          name={farmerName}
                          profileImageUrl={farmer.profilePicture}
                          className="w-full h-full"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          isArchived
                            ? "bg-red-500"
                            : farmerStatus === "active"
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <p
                      className={`font-medium text-sm ${
                        isArchived ? "text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {farmerName}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p
                      className={`text-sm font-mono px-2 py-1 rounded inline-block ${
                        isArchived
                          ? "bg-gray-100 text-gray-500"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {farmer.idNumber || "N/A"}
                    </p>
                  </div>

                  <div className="col-span-4">
                    <p
                      className={`text-sm truncate ${
                        isArchived ? "text-gray-500" : "text-gray-700"
                      }`}
                      title={farmerAddress}
                    >
                      {farmerAddress}
                    </p>
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                        farmerStatus
                      )}`}
                    >
                      {formatStatus(farmerStatus)}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() => handleViewFarmer(farmer)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-green-700 text-white"
                          : "hover:bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
