import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
      className={`${config.className} flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium`}
    >
      <span style={{ fontSize: "12px" }}>{icon}</span>
      {config.label}
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
      className={`flex items-center gap-2 ${colorMap[actualStatus]} p-0 h-auto text-sm font-medium transition-colors`}
    >
      <img src={EyeIcon} alt="View Details" className="h-4 w-4" />
      View Details
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
    dateRange: "all",
    status: "all",
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
      if (currentFilters.dateRange !== "all") {
        const scanDate = new Date(scan.createdAt);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        switch (currentFilters.dateRange) {
          case "today":
            if (scanDate < today) return false;
            break;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (scanDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            if (scanDate < monthAgo) return false;
            break;
        }
      }

      // Status filter
      if (currentFilters.status !== "all") {
        const scanStatus = getStatusFromPrediction(scan.prediction);
        if (scanStatus !== currentFilters.status) return false;
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
        className={`min-w-[30px] h-[30px] px-2 rounded-md text-sm font-medium transition-colors ${
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
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Scan History
              </h1>
              <p className="text-base text-gray-600">
                Track all crop health scans and analysis results of all farms
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 h-10 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              <img src={DownloadIcon} alt="Download" className="h-4 w-4" />
              Export
            </button>
          </div>

          {/* Filters */}
          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    handleFilterChange("dateRange", e.target.value)
                  }
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="healthy">Healthy</option>
                  <option value="disease-detected">Disease Detected</option>
                  <option value="needs-attention">Needs Attention</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Farmer ID
                </label>
                <input
                  type="text"
                  placeholder="Search farmer ID..."
                  value={filters.farmerName}
                  onChange={(e) =>
                    handleFilterChange("farmerName", e.target.value)
                  }
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Farm
                </label>
                <select
                  value={filters.farmId}
                  onChange={(e) => handleFilterChange("farmId", e.target.value)}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Farms</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.farmName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Scan History List */}
          <div
            ref={reportRef}
            className="bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="space-y-4 p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading scans...</div>
                </div>
              ) : scanData.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">No scans found</div>
                </div>
              ) : (
                scanData.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={
                            record.imageUrl ||
                            "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={record.farmName}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {record.farmName}
                            </h3>
                            <StatusBadge
                              status={record.status}
                              prediction={record.prediction}
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={UserIcon}
                                alt="User"
                                className="h-3 w-3"
                              />
                              <span>{record.idNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img
                                src={CalendarIcon}
                                alt="Calendar"
                                className="h-3 w-3"
                              />
                              <span>{formatDate(record.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img
                                src={ClockIcon}
                                alt="Time"
                                className="h-3.5 w-3.5"
                              />
                              <span>{formatTime(record.createdAt)}</span>
                            </div>
                            {record.confidence && (
                              <div className="flex items-center gap-2">
                                <span>
                                  Confidence:{" "}
                                  {Math.round(record.confidence * 100)}%
                                </span>
                              </div>
                            )}
                          </div>

                          {record.description && (
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: "14px" }}>
                                {diseaseIcons[record.prediction] ||
                                  diseaseIcons["Healthy"]}
                              </span>
                              <p
                                className="text-sm font-medium"
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
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-4">
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
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {startResult} to {endResult} of{" "}
                  {totalScans.toLocaleString()} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-[30px] px-3 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      renderPageButton
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-[30px] px-3 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
