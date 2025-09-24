import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  User,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
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

export default function Farmteam({ farmId, onAddFarmer, onViewFarmer }) {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 5;

  // Fetch farmers with full details
  useEffect(() => {
    if (!farmId) return;

    let isMounted = true;

    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.status === "success" && isMounted) {
          // The API already returns full farmer details including user information
          setFarmers(data.farmers || []);
        }
      } catch (error) {
        console.error("Error fetching farmers:", error);
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

  // Filter farmers
  const filteredFarmers = farmers.filter((farmer) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (farmer.firstname || "").toLowerCase().includes(searchLower) ||
      (farmer.middlename || "").toLowerCase().includes(searchLower) ||
      (farmer.lastname || "").toLowerCase().includes(searchLower) ||
      (farmer.idNumber || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "All Status" ||
      farmer.status === statusFilter.toLowerCase();

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
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "inactive":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatName = (farmer) => {
    const firstName = farmer.firstname || "";
    const middleName = farmer.middlename || "";
    const lastName = farmer.lastname || "";
    const suffix = farmer.suffix || "";

    const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(" ") : "N/A";
  };

  const formatAddress = (farmer) => {
    const addressParts = [
      farmer.street,
      farmer.barangay,
      farmer.municipality,
      farmer.province,
      farmer.zipcode,
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(", ") : "N/A";
  };

  // Get phone number - check multiple possible field names
  const getPhoneNumber = (farmer) => {
    return farmer.contactNumber || farmer.phone || farmer.phoneNumber || "N/A";
  };

  // Get email - check multiple possible field names
  const getEmail = (farmer) => {
    return farmer.email || farmer.emailAddress || "N/A";
  };

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
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
            <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
          </div>

          <button
            onClick={onAddFarmer}
            className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Farmer
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredFarmers.length)}{" "}
          of {filteredFarmers.length} farmers
        </p>
        {filteredFarmers.length !== farmers.length && (
          <p>(Filtered from {farmers.length} total)</p>
        )}
      </div>

      {/* Table Header */}
      <div
        className="grid gap-2 sm:gap-4 border-b border-gray-200 pb-2 mb-4 text-gray-600 text-xs sm:text-sm font-medium bg-[#F9FAFB] items-center"
        style={{
          gridTemplateColumns: "3fr 2fr 2.5fr 4fr 2fr 2fr",
        }}
      >
        <div className="text-left pl-2 sm:pl-4 pt-2">Farmer</div>
        <div className="text-left pl-2 sm:pl-4 pt-2">Farmer ID</div>
        <div className="text-left pl-2 sm:pl-4 pt-2">Contact</div>
        <div className="text-left pl-2 sm:pl-4 pt-2 truncate">Address</div>
        <div className="text-left pl-2 sm:pl-4 pt-2">Status</div>
        <div className="text-left pl-2 sm:pl-4 pt-2">Actions</div>
      </div>

      {/* Farmers List */}
      {currentFarmers.length === 0 ? (
        <div className="text-center py-6 sm:py-8 col-span-6">
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm sm:text-base text-gray-500">
            {farmers.length === 0
              ? "No farmers added yet."
              : "No farmers match your search criteria."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-500 hover:underline text-sm mt-1"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        currentFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="grid gap-2 sm:gap-4 py-3 border-b border-gray-100 text-xs sm:text-sm sm:items-center items-start hover:bg-gray-50 transition-colors"
            style={{
              gridTemplateColumns: "3fr 2fr 2.5fr 4fr 2fr 2fr",
            }}
          >
            {/* Farmer Info with Profile Picture */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4">
              <img
                src={farmer.profilePicture || "/assets/default-user.png"}
                alt={formatName(farmer)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.target.src = "/assets/default-user.png";
                }}
              />
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">
                  {formatName(farmer)}
                </p>
                <p className="text-xs text-gray-600">
                  {farmer.role || "Farmer"}
                </p>
              </div>
            </div>

            {/* Farmer ID */}
            <div className="pl-2 sm:pl-4 text-gray-700 font-mono">
              {farmer.idNumber || "N/A"}
            </div>

            {/* Contact */}
            <div className="pl-2 sm:pl-4">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {getPhoneNumber(farmer)}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {getEmail(farmer)}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="pl-2 sm:pl-4 text-xs sm:text-sm text-gray-700">
              <p className="truncate" title={formatAddress(farmer)}>
                {formatAddress(farmer)}
              </p>
            </div>

            {/* Status */}
            <div className="pl-2 sm:pl-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  farmer.status
                )}`}
              >
                {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
              </span>
            </div>

            {/* Actions */}
            <div className="pl-2 sm:pl-4">
              <button
                onClick={() => onViewFarmer(farmer.id)}
                className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer text-green-500 hover:underline text-xs sm:text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? "bg-green-700 text-white"
                        : "hover:bg-gray-100 text-gray-700"
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
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
