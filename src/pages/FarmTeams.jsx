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
              className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-50 hover:text-green-700 text-sm sm:text-base transition-colors"
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
    const searchLower = searchQuery.toLowerCase();

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
    const idNumber = (farmer.idNumber || "").toLowerCase();

    const matchesSearch =
      firstName.includes(searchLower) ||
      middleName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      idNumber.includes(searchLower);

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
        return "text-rose-700 bg-rose-50 border-rose-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Active";
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
            className="transition-all duration-150 active:scale-95 cursor-pointer px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md flex items-center gap-2 text-xs sm:text-sm font-medium w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Farmer
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">
        <p>
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {currentFarmers.length > 0 ? startIndex + 1 : 0}-
            {Math.min(endIndex, filteredFarmers.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {filteredFarmers.length}
          </span>
        </p>
        {filteredFarmers.length !== farmers.length && (
          <p className="text-xs">(Filtered from {farmers.length} total)</p>
        )}
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

            return (
              <div
                key={farmer.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
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
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-green-300 transition-colors"
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

                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onViewFarmer(farmer.id)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-150 active:scale-95 hover:underline"
                    >
                      View Details →
                    </button>
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
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-green-300 transition-colors"
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
                    <button
                      onClick={() => onViewFarmer(farmer.id)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-150 active:scale-95 hover:underline"
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

// //new
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Search,
//   ChevronDown,
//   Plus,
//   User,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// // StatusDropdown Component
// function StatusDropdown({ value, onChange }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const options = ["All Status", "Active", "Pending", "Inactive"];
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative min-w-[160px] sm:min-w-[180px]" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-sm sm:text-base hover:bg-gray-100 bg-white transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
//       >
//         {value}
//         <ChevronDown className="w-4 h-4 text-gray-400" />
//       </button>
//       {isOpen && (
//         <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//           {options.map((option) => (
//             <li
//               key={option}
//               onClick={() => {
//                 onChange(option);
//                 setIsOpen(false);
//               }}
//               className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-sm sm:text-base"
//             >
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default function FarmTeams({ farmId, onAddFarmer, onViewFarmer }) {
//   const [farmers, setFarmers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const farmersPerPage = 5;

//   // Fetch farmers with FULL details (same approach as modal)
//   useEffect(() => {
//     if (!farmId) return;

//     let isMounted = true;

//     const fetchFarmers = async () => {
//       setLoading(true);
//       try {
//         console.log("🔍 Fetching farmers for farm:", farmId);

//         // Step 1: Get the list of farmer IDs
//         const listResponse = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         const listData = await listResponse.json();
//         console.log("📥 Farmer list response:", listData);

//         if (listData.status === "success" && isMounted) {
//           const farmersList = listData.farmers || [];
//           console.log("👥 Raw farmers list:", farmersList);

//           // Step 2: Fetch FULL details for each farmer (same as modal does)
//           const farmersWithFullDetails = await Promise.all(
//             farmersList.map(async (farmer) => {
//               try {
//                 console.log(`🔍 Fetching details for farmer ${farmer.id}...`);

//                 const detailResponse = await fetch(
//                   `https://papaiaapi.onrender.com/api/owner/farmer/${farmer.id}`,
//                   {
//                     headers: {
//                       Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                   }
//                 );

//                 const detailData = await detailResponse.json();
//                 console.log(`✅ Farmer ${farmer.id} details:`, detailData);

//                 if (detailData.status === "success" && detailData.farmer) {
//                   // Return the FULL farmer data from detail endpoint
//                   return detailData.farmer;
//                 }

//                 // Fallback to list data if detail fetch fails
//                 console.warn(`⚠️ Using list data for farmer ${farmer.id}`);
//                 return farmer;
//               } catch (error) {
//                 console.error(
//                   `❌ Error fetching details for farmer ${farmer.id}:`,
//                   error
//                 );
//                 return farmer; // Fallback to list data
//               }
//             })
//           );

//           console.log(
//             "✅ All farmers with FULL details:",
//             farmersWithFullDetails
//           );
//           setFarmers(farmersWithFullDetails);
//         } else {
//           console.warn("⚠️ Unexpected response format:", listData);
//           setFarmers([]);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching farmers:", error);
//         if (isMounted) {
//           setFarmers([]);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchFarmers();

//     return () => {
//       isMounted = false;
//     };
//   }, [farmId]);

//   // Helper function to format name - SAME AS MODAL
//   const formatName = (farmer) => {
//     if (!farmer) {
//       console.warn("⚠️ formatName called with no farmer data");
//       return "N/A";
//     }

//     // Try all possible field name variations (same as modal)
//     const firstName = farmer.firstname || farmer.firstName || "";
//     const middleName = farmer.middlename || farmer.middleName || "";
//     const lastName = farmer.lastname || farmer.lastName || "";
//     const suffix = farmer.suffix || "";

//     const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
//     const fullName = nameParts.length > 0 ? nameParts.join(" ") : "N/A";

//     console.log(`📛 Formatted name for ${farmer.idNumber}:`, {
//       firstName,
//       middleName,
//       lastName,
//       suffix,
//       fullName,
//     });

//     return fullName;
//   };

//   const formatAddress = (farmer) => {
//     if (!farmer) return "No address";

//     const addressParts = [
//       farmer.street,
//       farmer.barangay,
//       farmer.municipality,
//       farmer.province,
//     ].filter(Boolean);

//     return addressParts.length > 0 ? addressParts.join(", ") : "No address";
//   };

//   // Filter farmers
//   const filteredFarmers = farmers.filter((farmer) => {
//     const searchLower = searchQuery.toLowerCase();

//     // Handle all field name variations
//     const firstName = (
//       farmer.firstname ||
//       farmer.firstName ||
//       ""
//     ).toLowerCase();
//     const middleName = (
//       farmer.middlename ||
//       farmer.middleName ||
//       ""
//     ).toLowerCase();
//     const lastName = (farmer.lastname || farmer.lastName || "").toLowerCase();
//     const idNumber = (farmer.idNumber || "").toLowerCase();

//     const matchesSearch =
//       firstName.includes(searchLower) ||
//       middleName.includes(searchLower) ||
//       lastName.includes(searchLower) ||
//       idNumber.includes(searchLower);

//     const farmerStatus = (farmer.status || "active").toLowerCase();
//     const matchesStatus =
//       statusFilter === "All Status" ||
//       farmerStatus === statusFilter.toLowerCase();

//     return matchesSearch && matchesStatus;
//   });

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);
//   const startIndex = (currentPage - 1) * farmersPerPage;
//   const endIndex = startIndex + farmersPerPage;
//   const currentFarmers = filteredFarmers.slice(startIndex, endIndex);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, statusFilter]);

//   const getStatusColor = (status) => {
//     if (!status) return "text-gray-600 bg-gray-100";

//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case "active":
//         return "text-green-600 bg-green-100";
//       case "pending":
//         return "text-orange-600 bg-orange-100";
//       case "inactive":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   const formatStatus = (status) => {
//     if (!status) return "Active";
//     return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
//   };

//   // Pagination controls
//   const goToPage = (page) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-20">
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//           <p className="ml-3 text-gray-600">Loading farmer details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-20">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
//         <div>
//           <h2 className="text-base sm:text-lg font-bold text-gray-800">
//             Farm Team
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage and track all registered farmers
//           </p>
//         </div>

//         {/* Search + Filter + Add Button */}
//         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto items-start sm:items-center">
//           <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full sm:w-auto">
//             <div className="relative flex-1 min-w-[120px]">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search farmers..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
//               />
//             </div>

//             <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
//           </div>

//           <button
//             onClick={onAddFarmer}
//             className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto"
//           >
//             <Plus className="w-4 h-4" />
//             Add Farmer
//           </button>
//         </div>
//       </div>

//       {/* Results Summary */}
//       <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
//         <p>
//           Showing {currentFarmers.length > 0 ? startIndex + 1 : 0}-
//           {Math.min(endIndex, filteredFarmers.length)} of{" "}
//           {filteredFarmers.length} farmers
//         </p>
//         {filteredFarmers.length !== farmers.length && (
//           <p>(Filtered from {farmers.length} total)</p>
//         )}
//       </div>

//       {/* Table Header - Hidden on mobile */}
//       <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-gray-200 pb-2 mb-4 text-gray-600 text-sm font-medium bg-gray-50 px-4 py-2 rounded-t-lg">
//         <div className="col-span-3 text-left">Farmer</div>
//         <div className="col-span-2 text-left">Farmer ID</div>
//         <div className="col-span-4 text-left">Address</div>
//         <div className="col-span-1 text-left">Status</div>
//         <div className="col-span-2 text-left">Actions</div>
//       </div>

//       {/* Farmers List */}
//       {currentFarmers.length === 0 ? (
//         <div className="text-center py-6 sm:py-8">
//           <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
//           <p className="text-sm sm:text-base text-gray-500">
//             {farmers.length === 0
//               ? "No farmers added yet."
//               : "No farmers match your search criteria."}
//           </p>
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="text-blue-500 hover:underline text-sm mt-1"
//             >
//               Clear search
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {currentFarmers.map((farmer) => {
//             const farmerName = formatName(farmer);
//             const farmerAddress = formatAddress(farmer);
//             const farmerStatus = farmer.status || "active";

//             return (
//               <div
//                 key={farmer.id}
//                 className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
//               >
//                 {/* Mobile Layout */}
//                 <div className="sm:hidden">
//                   <div className="flex items-start gap-3 mb-3">
//                     <img
//                       src={farmer.profilePicture || "/assets/default-user.png"}
//                       alt={farmerName}
//                       className="w-12 h-12 rounded-full object-cover border border-gray-200"
//                       onError={(e) => {
//                         e.target.src = "/assets/default-user.png";
//                       }}
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900 text-sm">
//                         {farmerName}
//                       </h3>
//                       <p className="text-xs text-gray-600 font-mono mt-1">
//                         ID: {farmer.idNumber || "N/A"}
//                       </p>
//                       <div className="mt-2">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                             farmerStatus
//                           )}`}
//                         >
//                           {formatStatus(farmerStatus)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <p className="text-xs text-gray-600 mb-1">Address:</p>
//                     <p className="text-sm text-gray-800">{farmerAddress}</p>
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       onClick={() => onViewFarmer(farmer.id)}
//                       className="text-green-500 hover:underline text-sm transition-all duration-150 active:scale-95"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>

//                 {/* Desktop Layout */}
//                 <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
//                   {/* Farmer Info with Profile Picture */}
//                   <div className="col-span-3 flex items-center gap-3">
//                     <img
//                       src={farmer.profilePicture || "/assets/default-user.png"}
//                       alt={farmerName}
//                       className="w-10 h-10 rounded-full object-cover border border-gray-200"
//                       onError={(e) => {
//                         e.target.src = "/assets/default-user.png";
//                       }}
//                     />
//                     <div>
//                       <p className="font-medium text-gray-800 text-sm">
//                         {farmerName}
//                       </p>
//                       <p className="text-xs text-gray-600">
//                         {farmer.role || "Farmer"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Farmer ID */}
//                   <div className="col-span-2">
//                     <p className="text-sm text-gray-700 font-mono">
//                       {farmer.idNumber || "N/A"}
//                     </p>
//                   </div>

//                   {/* Address */}
//                   <div className="col-span-4">
//                     <p
//                       className="text-sm text-gray-700 truncate"
//                       title={farmerAddress}
//                     >
//                       {farmerAddress}
//                     </p>
//                   </div>

//                   {/* Status */}
//                   <div className="col-span-1">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                         farmerStatus
//                       )}`}
//                     >
//                       {formatStatus(farmerStatus)}
//                     </span>
//                   </div>

//                   {/* Actions */}
//                   <div className="col-span-2">
//                     <button
//                       onClick={() => onViewFarmer(farmer.id)}
//                       className="text-green-500 hover:underline text-sm transition-all duration-150 active:scale-95"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
//           <div className="text-sm text-gray-600">
//             Page {currentPage} of {totalPages}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>

//             {/* Page Numbers */}
//             <div className="flex items-center gap-1">
//               {[...Array(totalPages)].map((_, index) => {
//                 const page = index + 1;
//                 const isVisible =
//                   page === 1 ||
//                   page === totalPages ||
//                   Math.abs(page - currentPage) <= 1;

//                 if (!isVisible) {
//                   if (page === currentPage - 2 || page === currentPage + 2) {
//                     return (
//                       <span key={page} className="px-2 text-gray-400">
//                         ...
//                       </span>
//                     );
//                   }
//                   return null;
//                 }

//                 return (
//                   <button
//                     key={page}
//                     onClick={() => goToPage(page)}
//                     className={`px-3 py-1 rounded-lg text-sm transition-colors ${
//                       currentPage === page
//                         ? "bg-green-700 text-white"
//                         : "hover:bg-gray-100 text-gray-700"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//old
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Search,
//   ChevronDown,
//   Plus,
//   User,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// // StatusDropdown Component
// function StatusDropdown({ value, onChange }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const options = ["All Status", "Active", "Pending", "Inactive"];
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative min-w-[160px] sm:min-w-[180px]" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-sm sm:text-base hover:bg-gray-100 bg-white transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
//       >
//         {value}
//         <ChevronDown className="w-4 h-4 text-gray-400" />
//       </button>
//       {isOpen && (
//         <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//           {options.map((option) => (
//             <li
//               key={option}
//               onClick={() => {
//                 onChange(option);
//                 setIsOpen(false);
//               }}
//               className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-sm sm:text-base"
//             >
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default function FarmTeams({ farmId, onAddFarmer, onViewFarmer }) {
//   const [farmers, setFarmers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const farmersPerPage = 5;

//   // Fetch farmers with full details
//   useEffect(() => {
//     if (!farmId) return;

//     let isMounted = true;

//     const fetchFarmers = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         const data = await response.json();
//         if (data.status === "success" && isMounted) {
//           // The API already returns full farmer details including user information
//           console.log("Fetched farmers:", data.farmers); // For debugging
//           setFarmers(data.farmers || []);
//         }
//       } catch (error) {
//         console.error("Error fetching farmers:", error);
//         if (isMounted) {
//           setFarmers([]);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchFarmers();

//     return () => {
//       isMounted = false;
//     };
//   }, [farmId]);

//   // Filter farmers
//   const filteredFarmers = farmers.filter((farmer) => {
//     const searchLower = searchQuery.toLowerCase();
//     const matchesSearch =
//       (farmer.firstname || "").toLowerCase().includes(searchLower) ||
//       (farmer.middlename || "").toLowerCase().includes(searchLower) ||
//       (farmer.lastname || "").toLowerCase().includes(searchLower) ||
//       (farmer.idNumber || "").toLowerCase().includes(searchLower);

//     const matchesStatus =
//       statusFilter === "All Status" ||
//       farmer.status === statusFilter.toLowerCase();

//     return matchesSearch && matchesStatus;
//   });

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);
//   const startIndex = (currentPage - 1) * farmersPerPage;
//   const endIndex = startIndex + farmersPerPage;
//   const currentFarmers = filteredFarmers.slice(startIndex, endIndex);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, statusFilter]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "text-green-600 bg-green-100";
//       case "pending":
//         return "text-orange-600 bg-orange-100";
//       case "inactive":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   const formatName = (farmer) => {
//     const firstName = farmer.firstname || "";
//     const middleName = farmer.middlename || "";
//     const lastName = farmer.lastname || "";
//     const suffix = farmer.suffix || "";

//     const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
//     return nameParts.length > 0 ? nameParts.join(" ") : "N/A";
//   };

//   const formatAddress = (farmer) => {
//     const addressParts = [
//       farmer.street,
//       farmer.barangay,
//       farmer.municipality,
//       farmer.province,
//     ].filter(Boolean);

//     return addressParts.length > 0 ? addressParts.join(", ") : "No address";
//   };

//   // Pagination controls
//   const goToPage = (page) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-20">
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-20">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
//         <div>
//           <h2 className="text-base sm:text-lg font-bold text-gray-800">
//             Farm Team
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage and track all registered farmers
//           </p>
//         </div>

//         {/* Search + Filter + Add Button */}
//         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto items-start sm:items-center">
//           <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full sm:w-auto">
//             <div className="relative flex-1 min-w-[120px]">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search farmers..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
//               />
//             </div>

//             {/* Status Dropdown */}
//             <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
//           </div>

//           <button
//             onClick={onAddFarmer}
//             className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto"
//           >
//             <Plus className="w-4 h-4" />
//             Add Farmer
//           </button>
//         </div>
//       </div>

//       {/* Results Summary */}
//       <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
//         <p>
//           Showing {currentFarmers.length > 0 ? startIndex + 1 : 0}-
//           {Math.min(endIndex, filteredFarmers.length)} of{" "}
//           {filteredFarmers.length} farmers
//         </p>
//         {filteredFarmers.length !== farmers.length && (
//           <p>(Filtered from {farmers.length} total)</p>
//         )}
//       </div>

//       {/* Table Header - Hidden on mobile */}
//       <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-gray-200 pb-2 mb-4 text-gray-600 text-sm font-medium bg-gray-50 px-4 py-2 rounded-t-lg">
//         <div className="col-span-3 text-left">Farmer</div>
//         <div className="col-span-2 text-left">Farmer ID</div>
//         <div className="col-span-4 text-left">Address</div>
//         <div className="col-span-1 text-left">Status</div>
//         <div className="col-span-2 text-left">Actions</div>
//       </div>

//       {/* Farmers List */}
//       {currentFarmers.length === 0 ? (
//         <div className="text-center py-6 sm:py-8">
//           <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
//           <p className="text-sm sm:text-base text-gray-500">
//             {farmers.length === 0
//               ? "No farmers added yet."
//               : "No farmers match your search criteria."}
//           </p>
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="text-blue-500 hover:underline text-sm mt-1"
//             >
//               Clear search
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {currentFarmers.map((farmer) => (
//             <div
//               key={farmer.id}
//               className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
//             >
//               {/* Mobile Layout */}
//               <div className="sm:hidden">
//                 <div className="flex items-start gap-3 mb-3">
//                   <img
//                     src={farmer.profilePicture || "/assets/default-user.png"}
//                     alt={formatName(farmer)}
//                     className="w-12 h-12 rounded-full object-cover border border-gray-200"
//                     onError={(e) => {
//                       e.target.src = "/assets/default-user.png";
//                     }}
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 text-sm">
//                       {formatName(farmer)}
//                     </h3>
//                     <p className="text-xs text-gray-600 font-mono mt-1">
//                       ID: {farmer.idNumber || "N/A"}
//                     </p>
//                     <div className="mt-2">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           farmer.status
//                         )}`}
//                       >
//                         {farmer.status.charAt(0).toUpperCase() +
//                           farmer.status.slice(1)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <p className="text-xs text-gray-600 mb-1">Address:</p>
//                   <p className="text-sm text-gray-800">
//                     {formatAddress(farmer)}
//                   </p>
//                 </div>

//                 <div className="flex justify-end">
//                   <button
//                     onClick={() => onViewFarmer(farmer.id)}
//                     className="text-green-500 hover:underline text-sm transition-all duration-150 active:scale-95"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>

//               {/* Desktop Layout */}
//               <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
//                 {/* Farmer Info with Profile Picture */}
//                 <div className="col-span-3 flex items-center gap-3">
//                   <img
//                     src={farmer.profilePicture || "/assets/default-user.png"}
//                     alt={formatName(farmer)}
//                     className="w-10 h-10 rounded-full object-cover border border-gray-200"
//                     onError={(e) => {
//                       e.target.src = "/assets/default-user.png";
//                     }}
//                   />
//                   <div>
//                     <p className="font-medium text-gray-800 text-sm">
//                       {formatName(farmer)}
//                     </p>
//                     <p className="text-xs text-gray-600">
//                       {farmer.role || "Farmer"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Farmer ID */}
//                 <div className="col-span-2">
//                   <p className="text-sm text-gray-700 font-mono">
//                     {farmer.idNumber || "N/A"}
//                   </p>
//                 </div>

//                 {/* Address */}
//                 <div className="col-span-4">
//                   <p
//                     className="text-sm text-gray-700 truncate"
//                     title={formatAddress(farmer)}
//                   >
//                     {formatAddress(farmer)}
//                   </p>
//                 </div>

//                 {/* Status */}
//                 <div className="col-span-1">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                       farmer.status
//                     )}`}
//                   >
//                     {farmer.status.charAt(0).toUpperCase() +
//                       farmer.status.slice(1)}
//                   </span>
//                 </div>

//                 {/* Actions */}
//                 <div className="col-span-2">
//                   <button
//                     onClick={() => onViewFarmer(farmer.id)}
//                     className="text-green-500 hover:underline text-sm transition-all duration-150 active:scale-95"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
//           <div className="text-sm text-gray-600">
//             Page {currentPage} of {totalPages}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>

//             {/* Page Numbers */}
//             <div className="flex items-center gap-1">
//               {[...Array(totalPages)].map((_, index) => {
//                 const page = index + 1;
//                 const isVisible =
//                   page === 1 ||
//                   page === totalPages ||
//                   Math.abs(page - currentPage) <= 1;

//                 if (!isVisible) {
//                   if (page === currentPage - 2 || page === currentPage + 2) {
//                     return (
//                       <span key={page} className="px-2 text-gray-400">
//                         ...
//                       </span>
//                     );
//                   }
//                   return null;
//                 }

//                 return (
//                   <button
//                     key={page}
//                     onClick={() => goToPage(page)}
//                     className={`px-3 py-1 rounded-lg text-sm transition-colors ${
//                       currentPage === page
//                         ? "bg-green-700 text-white"
//                         : "hover:bg-gray-100 text-gray-700"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
