import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

import FooterMain from "../components/Footer/FooterMain";
import HeaderMain from "../components/Header/HeaderMain";

// --- PNG ICON IMPORTS ---
import DownloadIcon from "../assets/download-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import UserIcon from "../assets/sh-user-icon.png";
import CalendarIcon from "../assets/sh-calendar-icon.png";
import ClockIcon from "../assets/sh-clock-icon.png";

// Disease colors and icons mapping
const diseaseColors = {
  Healthy: "#00FF00",
  "Ring Spot Virus": "#FF8C00",
  Anthracnose: "#FF0000",
  "Powdery Mildew": "#0066FF",
};

const diseaseIcons = {
  Healthy: "🟢",
  "Ring Spot Virus": "🟠",
  Anthracnose: "🔴",
  "Powdery Mildew": "🔵",
};

// Helper function to get status from prediction
function getStatusFromPrediction(prediction) {
  if (!prediction) return "healthy";
  const predLower = prediction.toLowerCase();
  if (predLower === "healthy") return "healthy";
  if (predLower.includes("virus") || predLower.includes("disease"))
    return "disease-detected";
  return "needs-attention";
}

// Dropdown Component
function FilterDropdown({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="flex flex-col space-y-2" ref={dropdownRef}>
      <label className="text-xs sm:text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-xs sm:text-sm hover:bg-gray-100 bg-white transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
        >
          <span className="truncate">{value}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
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
                className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-xs sm:text-sm whitespace-nowrap"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status, prediction }) {
  const actualStatus = status || getStatusFromPrediction(prediction);
  const predictionKey = prediction || "Healthy";
  const icon = diseaseIcons[predictionKey] || diseaseIcons["Healthy"];

  const statusConfig = {
    healthy: {
      label: "Healthy",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    "disease-detected": {
      label: "Disease Detected",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    "needs-attention": {
      label: "Needs Attention",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
  };

  const config = statusConfig[actualStatus] || statusConfig.healthy;

  return (
    <div
      className={`${config.className} flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium whitespace-nowrap`}
    >
      <span style={{ fontSize: "12px" }}>{icon}</span>
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">{config.label.split(" ")[0]}</span>
    </div>
  );
}

// View Details Button Component
function ViewDetailsButton({ status, prediction, scanId }) {
  const actualStatus = status || getStatusFromPrediction(prediction);

  const colorMap = {
    healthy: "text-[#22C55E] hover:text-green-600",
    "disease-detected": "text-[#EF4444] hover:text-red-600",
    "needs-attention": "text-[#F59E0B] hover:text-yellow-600",
  };

  return (
    <Link
      to={`/scan-history-details/${scanId}`}
      className={`flex items-center gap-1 sm:gap-2 ${colorMap[actualStatus]} p-0 h-auto text-xs sm:text-sm font-medium transition-colors`}
    >
      <img src={EyeIcon} alt="View Details" className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">View Details</span>
      <span className="sm:hidden">View</span>
    </Link>
  );
}

export default function ScanHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [scanData, setScanData] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScans, setTotalScans] = useState(0);
  const [filters, setFilters] = useState({
    dateRange: "All Time",
    status: "All Status",
    farmId: "all",
    farmerName: "",
  });

  const reportRef = useRef(null);
  const navigate = useNavigate();
  const resultsPerPage = 5;
  const totalPages = Math.ceil(totalScans / resultsPerPage);
  const token = localStorage.getItem("token");

  // Auth check
  useEffect(() => {
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [token, navigate]);

  // Fetch farms
  useEffect(() => {
    if (!token) return;

    const fetchFarms = async () => {
      try {
        const res = await fetch(
          "https://papaiaapi.onrender.com/api/owner/farms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch farms");
        const data = await res.json();
        if (data.status === "success") {
          setFarms(data.farms || []);
        }
      } catch (err) {
        console.error("Farm fetch error:", err);
        setFarms([]);
      }
    };

    fetchFarms();
  }, [token]);

  // Helper function to parse timestamp
  const parseTimestamp = (timestamp) => {
    try {
      if (typeof timestamp === "string" && timestamp.includes("/")) {
        return new Date(timestamp).toISOString();
      }
      return timestamp;
    } catch (error) {
      return new Date().toISOString();
    }
  };

  // Helper function to apply filters
  const applyFilters = (scans, currentFilters) => {
    return scans.filter((scan) => {
      // Date range filter
      if (currentFilters.dateRange !== "All Time") {
        const scanDate = new Date(scan.createdAt);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        switch (currentFilters.dateRange) {
          case "Today":
            if (scanDate < today) return false;
            break;
          case "Last 7 days":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (scanDate < weekAgo) return false;
            break;
          case "Last 30 days":
            const monthAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            if (scanDate < monthAgo) return false;
            break;
        }
      }

      // Status filter
      if (currentFilters.status !== "All Status") {
        const scanStatus = getStatusFromPrediction(scan.prediction);
        const filterMap = {
          Healthy: "healthy",
          "Disease Detected": "disease-detected",
          "Needs Attention": "needs-attention",
        };
        if (scanStatus !== filterMap[currentFilters.status]) return false;
      }

      // Farm filter
      if (
        currentFilters.farmId !== "all" &&
        scan.farmId !== currentFilters.farmId
      ) {
        return false;
      }

      // Farmer name filter
      if (currentFilters.farmerName && scan.idNumber) {
        const farmerQuery = currentFilters.farmerName.toLowerCase();
        const farmerId = scan.idNumber.toLowerCase();
        if (!farmerId.includes(farmerQuery)) return false;
      }

      return true;
    });
  };

  // Fetch scan history
  useEffect(() => {
    if (!token || farms.length === 0) return;

    const fetchScans = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://papaiaapi.onrender.com/api/owner/identification-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch scan history");
        const scansArray = await res.json();

        if (Array.isArray(scansArray)) {
          // Create farm mapping
          const farmsMap = {};
          farms.forEach((farm) => {
            farmsMap[farm.id] = farm;
          });

          // Process scans
          let processedScans = scansArray.map((scan) => {
            const farmInfo = farmsMap[scan.farmId] || {};
            return {
              ...scan,
              farmName: farmInfo.farmName || "Unknown Farm",
              createdAt: parseTimestamp(scan.timestamp),
              status: getStatusFromPrediction(scan.prediction),
              description: scan.prediction || "Unknown",
              idNumber: scan.idNumber || "Unknown Farmer",
            };
          });

          // Apply filters
          processedScans = applyFilters(processedScans, filters);

          // Sort by date (newest first)
          processedScans.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Apply pagination
          const startIndex = (currentPage - 1) * resultsPerPage;
          const endIndex = startIndex + resultsPerPage;
          const paginatedScans = processedScans.slice(startIndex, endIndex);

          setScanData(paginatedScans);
          setTotalScans(processedScans.length);
        } else {
          setScanData([]);
          setTotalScans(0);
        }
      } catch (err) {
        console.error("Scan fetch error:", err);
        setScanData([]);
        setTotalScans(0);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [currentPage, filters, token, farms]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleExport = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("scan-history-report.pdf");
    });
  };

  const renderPageButton = (page) => {
    const isActive = page === currentPage;
    return (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`min-w-[30px] h-[30px] px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          isActive
            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            : "border border-gray-300 text-black hover:bg-gray-50"
        }`}
      >
        {page}
      </button>
    );
  };

  // Calculate pagination display values
  const startResult = Math.min(
    (currentPage - 1) * resultsPerPage + 1,
    totalScans
  );
  const endResult = Math.min(currentPage * resultsPerPage, totalScans);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />
      <main className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Scan History
              </h1>
              <p className="text-xs sm:text-base text-gray-600">
                Track all crop health scans and analysis results
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 h-9 sm:h-10 px-3 sm:px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-700 transition-colors w-full sm:w-auto"
            >
              <img src={DownloadIcon} alt="Download" className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Filters */}
          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <FilterDropdown
                label="Date Range"
                value={filters.dateRange}
                onChange={(value) => handleFilterChange("dateRange", value)}
                options={["All Time", "Today", "Last 7 days", "Last 30 days"]}
              />

              <FilterDropdown
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                options={[
                  "All Status",
                  "Healthy",
                  "Disease Detected",
                  "Needs Attention",
                ]}
              />

              <div className="flex flex-col space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Farmer ID
                </label>
                <input
                  type="text"
                  placeholder="Search farmer ID..."
                  value={filters.farmerName}
                  onChange={(e) =>
                    handleFilterChange("farmerName", e.target.value)
                  }
                  className="h-9 sm:h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <FilterDropdown
                label="Farm"
                value={
                  filters.farmId === "all"
                    ? "All Farms"
                    : farms.find((f) => f.id === filters.farmId)?.farmName ||
                      "All Farms"
                }
                onChange={(value) => {
                  const farm = farms.find((f) => f.farmName === value);
                  handleFilterChange("farmId", farm?.id || "all");
                }}
                options={["All Farms", ...farms.map((farm) => farm.farmName)]}
              />
            </div>
          </div>

          {/* Scan History List */}
          <div
            ref={reportRef}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-gray-500 text-sm sm:text-base">
                    Loading scans...
                  </div>
                </div>
              ) : scanData.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-gray-500 text-sm sm:text-base">
                    No scans found
                  </div>
                </div>
              ) : (
                scanData.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {/* Image */}
                      <img
                        src={
                          record.imageUrl ||
                          "https://via.placeholder.com/80x80?text=No+Image"
                        }
                        alt={record.farmName}
                        className="w-full sm:w-20 h-40 sm:h-20 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {record.farmName}
                          </h3>
                          <StatusBadge
                            status={record.status}
                            prediction={record.prediction}
                          />
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <img
                              src={UserIcon}
                              alt="User"
                              className="h-3 w-3"
                            />
                            <span className="truncate">{record.idNumber}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img
                              src={CalendarIcon}
                              alt="Calendar"
                              className="h-3 w-3"
                            />
                            <span>{formatDate(record.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img
                              src={ClockIcon}
                              alt="Time"
                              className="h-3 w-3"
                            />
                            <span>{formatTime(record.createdAt)}</span>
                          </div>
                          {record.confidence && (
                            <div className="text-xs sm:text-sm">
                              <span>
                                Confidence:{" "}
                                {Math.round(record.confidence * 100)}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Disease Info */}
                        {record.description && (
                          <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: "14px" }}>
                              {diseaseIcons[record.prediction] ||
                                diseaseIcons["Healthy"]}
                            </span>
                            <p
                              className="text-xs sm:text-sm font-medium"
                              style={{
                                color:
                                  diseaseColors[record.prediction] ||
                                  diseaseColors["Healthy"],
                              }}
                            >
                              {record.description}
                            </p>
                          </div>
                        )}

                        {/* View Details Button */}
                        <ViewDetailsButton
                          status={record.status}
                          prediction={record.prediction}
                          scanId={record.id}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalScans > resultsPerPage && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 border-t border-gray-200">
                <div className="text-xs sm:text-sm text-gray-700">
                  Showing {startResult} to {endResult} of{" "}
                  {totalScans.toLocaleString()} results
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-[30px] px-2 sm:px-3 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      renderPageButton
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-[30px] px-2 sm:px-3 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <FooterMain />
    </div>
  );
}
