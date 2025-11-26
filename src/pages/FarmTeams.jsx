//new siya
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

// StatusDropdown Component
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
        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-sm sm:text-base hover:bg-gray-50 bg-white transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
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

export default function FarmTeams({ farmId, onAddFarmer, onViewFarmer }) {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 5;

  // Fetch farmers with FULL details
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const listResponse = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const listData = await listResponse.json();

        if (listData.status === "success" && isMounted) {
          const farmersList = listData.farmers || [];

          const farmersWithFullDetails = await Promise.all(
            farmersList.map(async (farmer) => {
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
                  return detailData.farmer;
                }

                return farmer;
              } catch (error) {
                return farmer;
              }
            })
          );

          setFarmers(farmersWithFullDetails);
        } else {
          setFarmers([]);
        }
      } catch (error) {
        if (isMounted) {
          setFarmers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFarmers();

    return () => {
      isMounted = false;
    };
  }, [farmId]);

  const formatName = (farmer) => {
    if (!farmer) return "N/A";

    const firstName = farmer.firstname || farmer.firstName || "";
    const middleName = farmer.middlename || farmer.middleName || "";
    const lastName = farmer.lastname || farmer.lastName || "";
    const suffix = farmer.suffix || "";

    const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(" ") : "N/A";
  };

  const formatAddress = (farmer) => {
    if (!farmer) return "No address";

    const addressParts = [
      farmer.street,
      farmer.barangay,
      farmer.municipality,
      farmer.province,
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(", ") : "No address";
  };

  // Filter farmers
  const filteredFarmers = farmers.filter((farmer) => {
    const searchLower = searchQuery.toLowerCase().trim();

    // If search is empty, show all (only filter by status)
    if (!searchLower) {
      const farmerStatus = (farmer.status || "active").toLowerCase();
      const matchesStatus =
        statusFilter === "All Status" ||
        farmerStatus === statusFilter.toLowerCase();
      return matchesStatus;
    }

    // Get all name fields
    const firstName = (
      farmer.firstname ||
      farmer.firstName ||
      ""
    ).toLowerCase();
    const middleName = (
      farmer.middlename ||
      farmer.middleName ||
      ""
    ).toLowerCase();
    const lastName = (farmer.lastname || farmer.lastName || "").toLowerCase();
    const suffix = (farmer.suffix || "").toLowerCase();
    const idNumber = (farmer.idNumber || "").toLowerCase();

    // Get all address fields
    const street = (farmer.street || "").toLowerCase();
    const barangay = (farmer.barangay || "").toLowerCase();
    const municipality = (farmer.municipality || "").toLowerCase();
    const province = (farmer.province || "").toLowerCase();

    // Create full name and full address for searching
    const fullName = `${firstName} ${middleName} ${lastName} ${suffix}`.trim();
    const fullAddress =
      `${street} ${barangay} ${municipality} ${province}`.trim();

    // Check if search matches any field
    const matchesSearch =
      firstName.includes(searchLower) ||
      middleName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      suffix.includes(searchLower) ||
      fullName.includes(searchLower) ||
      idNumber.includes(searchLower) ||
      street.includes(searchLower) ||
      barangay.includes(searchLower) ||
      municipality.includes(searchLower) ||
      province.includes(searchLower) ||
      fullAddress.includes(searchLower);

    const farmerStatus = (farmer.status || "active").toLowerCase();
    const matchesStatus =
      statusFilter === "All Status" ||
      farmerStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);
  const startIndex = (currentPage - 1) * farmersPerPage;
  const endIndex = startIndex + farmersPerPage;
  const currentFarmers = filteredFarmers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status) => {
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
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Active";
    if (status.toLowerCase() === "deactivate") return "Inactive";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="ml-3 text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Users className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Farm Team
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {farmers.length} {farmers.length === 1 ? "member" : "members"}{" "}
              registered
            </p>
          </div>
        </div>

        {/* Search + Filter + Add Button */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto items-start sm:items-center">
          <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[120px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
          </div>

          <button
            onClick={onAddFarmer}
            className="transition-all duration-150 active:scale-95 cursor-pointer px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md flex items-center gap-2 text-xs sm:text-sm font-medium w-full sm:w-auto h-[42px]"
          >
            <Plus className="w-4 h-4" />
            Add Farmer
          </button>
        </div>
      </div>

      {/* Table Header - Hidden on mobile */}
      <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 mb-3 text-gray-600 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 rounded-lg border border-gray-200">
        <div className="col-span-3 text-left">Farmer</div>
        <div className="col-span-2 text-left">Farmer ID</div>
        <div className="col-span-4 text-left">Address</div>
        <div className="col-span-1 text-left">Status</div>
        <div className="col-span-2 text-left">Actions</div>
      </div>

      {/* Farmers List */}
      {currentFarmers.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-500 mb-1">
            {farmers.length === 0
              ? "No farmers added yet"
              : "No farmers match your search"}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {farmers.length === 0
              ? "Start building your team by adding farmers"
              : "Try adjusting your filters"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
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
            const isInactive =
              farmerStatus.toLowerCase() === "deactivate" ||
              farmerStatus.toLowerCase() === "inactive";

            return (
              <div
                key={farmer.id}
                className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 group ${
                  isInactive
                    ? "opacity-60"
                    : "hover:border-green-300 hover:shadow-md"
                }`}
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={
                          farmer.profilePicture || "/assets/default-user.png"
                        }
                        alt={farmerName}
                        className={`w-12 h-12 rounded-full object-cover border-2 border-gray-200 ${
                          isInactive
                            ? "grayscale"
                            : "group-hover:border-green-300"
                        } transition-colors`}
                        onError={(e) => {
                          e.target.src = "/assets/default-user.png";
                        }}
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          farmerStatus === "active"
                            ? "bg-emerald-500"
                            : farmerStatus === "pending"
                            ? "bg-amber-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {farmerName}
                      </h3>
                      <p className="text-xs text-gray-600 font-mono mt-1">
                        {farmer.idNumber || "N/A"}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                            farmerStatus
                          )}`}
                        >
                          {formatStatus(farmerStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 pl-15">
                    <p className="text-xs text-gray-500 mb-1 font-medium">
                      Address
                    </p>
                    <p className="text-sm text-gray-700">{farmerAddress}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    {isInactive ? (
                      <button
                        onClick={() =>
                          onReactivateFarmer && onReactivateFarmer(farmer.id)
                        }
                        className="text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-150 active:scale-95 hover:underline"
                      >
                        Reactivate →
                      </button>
                    ) : (
                      <button
                        onClick={() => onViewFarmer(farmer.id)}
                        className="text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-150 active:scale-95 hover:underline"
                      >
                        View Details →
                      </button>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                  {/* Farmer Info with Profile Picture */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          farmer.profilePicture || "/assets/default-user.png"
                        }
                        alt={farmerName}
                        className={`w-10 h-10 rounded-full object-cover border-2 border-gray-200 ${
                          isInactive
                            ? "grayscale"
                            : "group-hover:border-green-300"
                        } transition-colors`}
                        onError={(e) => {
                          e.target.src = "/assets/default-user.png";
                        }}
                      />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          farmerStatus === "active"
                            ? "bg-emerald-500"
                            : farmerStatus === "pending"
                            ? "bg-amber-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {farmerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {farmer.role || "Farmer"}
                      </p>
                    </div>
                  </div>

                  {/* Farmer ID */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                      {farmer.idNumber || "N/A"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="col-span-4">
                    <p
                      className="text-sm text-gray-700 truncate"
                      title={farmerAddress}
                    >
                      {farmerAddress}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                        farmerStatus
                      )}`}
                    >
                      {formatStatus(farmerStatus)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    {isInactive ? (
                      <button
                        onClick={() =>
                          onReactivateFarmer && onReactivateFarmer(farmer.id)
                        }
                        className="text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-150 active:scale-95 hover:underline"
                      >
                        Reactivate →
                      </button>
                    ) : (
                      <button
                        onClick={() => onViewFarmer(farmer.id)}
                        className="text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-150 active:scale-95 hover:underline"
                      >
                        View Details →
                      </button>
                    )}
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
            Page <span className="text-gray-800">{currentPage}</span> of{" "}
            <span className="text-gray-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isVisible =
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1;

                if (!isVisible) {
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-green-700 text-white shadow-sm"
                        : "hover:bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
