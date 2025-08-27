import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

import FooterMain from "../components/Footer/FooterMain";
import HeaderMain from "../components/Header/HeaderMain";

// --- PNG ICON IMPORTS ---
import DownloadIcon from "../assets/download-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import UserIcon from "../assets/sh-user-icon.png";
import CalendarIcon from "../assets/sh-calendar-icon.png";
import ClockIcon from "../assets/sh-clock-icon.png";
import CheckCircleIcon from "../assets/check-circle-icon.png";
import AlertIcon from "../assets/alert-icon.png";

// --- Helper Components defined within the file ---
function StatusBadge({ status }) {
  const statusConfig = {
    healthy: {
      label: "Healthy",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: <img src={CheckCircleIcon} alt="Healthy" className="w-3 h-3" />,
    },
    "disease-detected": {
      label: "Disease Detected",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: <img src={AlertIcon} alt="Alert" className="w-3 h-4" />,
    },
    "needs-attention": {
      label: "Needs Attention",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <img src={AlertIcon} alt="Attention" className="w-3 h-4" />,
    },
  };
  const config = statusConfig[status] || statusConfig.healthy;
  return (
    <div
      className={`${config.className} flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium`}
    >
      {config.icon}
      {config.label}
    </div>
  );
}

function ViewDetailsButton({ status, scanId }) {
  const colorMap = {
    healthy: "text-[#22C55E] hover:text-green-600",
    "disease-detected": "text-[#EF4444] hover:text-red-600",
    "needs-attention": "text-[#F59E0B] hover:text-yellow-600",
  };
  return (
    <Link
      to={`/scan-history-details/${scanId}`}
      className={`flex items-center gap-2 ${colorMap[status]} p-0 h-auto text-sm font-medium transition-colors`}
    >
      <img src={EyeIcon} alt="View Details" className="h-4 w-4" />
      View Details
    </Link>
  );
}

// --- Main Page Component ---
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
  const { isAuthenticated, user, logout } = useAuth(); // Use auth context

  const resultsPerPage = 5;
  const totalPages = Math.ceil(totalScans / resultsPerPage);
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalScans);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    fetchFarms();
  }, [isAuthenticated, navigate]);

  // Fetch scans when page or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchScans();
    }
  }, [currentPage, filters, isAuthenticated]);

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      if (!token) {
        // Redirect to login if token is missing
        navigate("/login");
        return;
      }
      const response = await fetch(
        "https://papaia.onrender.com/api/owner/farms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch farms");

      const data = await response.json();
      if (data.status === "success") {
        setFarms(data.farms || []);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
      setFarms([]);
    }
  };

  const fetchScans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Build query parameters for filtering and pagination
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: resultsPerPage.toString(),
        ...(filters.dateRange !== "all" && { dateRange: filters.dateRange }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.farmId !== "all" && { farmId: filters.farmId }),
        ...(filters.farmerName && { farmerName: filters.farmerName }),
      });

      // Note: This endpoint would need to be created in your backend
      // It should return all scans from farms owned by the authenticated owner
      const response = await fetch(`/api/owner/scans?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch scans");

      const data = await response.json();
      if (data.status === "success") {
        setScanData(data.scans || []);
        setTotalScans(data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching scans:", error);
      setScanData([]);
      setTotalScans(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
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
    const input = reportRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("scan-history-report.pdf");
      });
    }
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
                  Farmer
                </label>
                <input
                  type="text"
                  placeholder="Search farmer name..."
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
                          src={record.imageUrl || record.image}
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
                            <StatusBadge status={record.status} />
                          </div>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={UserIcon}
                                alt="User"
                                className="h-3 w-3"
                              />
                              <span>{record.farmerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img
                                src={CalendarIcon}
                                alt="Calendar"
                                className="h-3 w-3"
                              />
                              <span>
                                {formatDate(record.createdAt || record.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img
                                src={ClockIcon}
                                alt="Time"
                                className="h-3.5 w-3.5"
                              />
                              <span>
                                {formatTime(record.createdAt || record.time)}
                              </span>
                            </div>
                          </div>
                          {record.description && (
                            <p
                              className={`text-sm font-medium ${
                                record.status === "disease-detected"
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {record.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <ViewDetailsButton
                          status={record.status}
                          scanId={record.id}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination - only show if there are more than 5 scans */}
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
