// import { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ChevronDown } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// import FooterMain from "../components/Footer/FooterMain";
// import HeaderMain from "../components/Header/HeaderMain";

// // PNG ICON IMPORTS
// import DownloadIcon from "../assets/download-icon.png";
// import EyeIcon from "../assets/eye-icon.png";
// import UserIcon from "../assets/sh-user-icon.png";
// import CalendarIcon from "../assets/sh-calendar-icon.png";
// import ClockIcon from "../assets/sh-clock-icon.png";

// // Constants
// const RESULTS_PER_PAGE = 5;

// const DISEASE_CONFIG = {
//   Healthy: { color: "#00FF00", icon: "🟢" },
//   "Ring Spot Virus": { color: "#FF8C00", icon: "🟠" },
//   Anthracnose: { color: "#FF0000", icon: "🔴" },
//   "Powdery Mildew": { color: "#0066FF", icon: "🔵" },
// };

// const STATUS_CONFIG = {
//   healthy: {
//     label: "Healthy",
//     className: "bg-green-100 text-green-700 border-green-200",
//     color: "text-[#22C55E] hover:text-green-600",
//   },
//   "disease-detected": {
//     label: "Disease Detected",
//     className: "bg-red-100 text-red-700 border-red-200",
//     color: "text-[#EF4444] hover:text-red-600",
//   },
//   "needs-attention": {
//     label: "Needs Attention",
//     className: "bg-yellow-100 text-yellow-700 border-yellow-200",
//     color: "text-[#F59E0B] hover:text-yellow-600",
//   },
// };

// // Optimized helper function
// const getStatus = (prediction) => {
//   if (!prediction) return "healthy";
//   const p = prediction.toLowerCase();
//   if (p === "healthy") return "healthy";
//   if (p.includes("virus") || p.includes("disease")) return "disease-detected";
//   return "needs-attention";
// };

// // Memoized Dropdown Component
// const FilterDropdown = ({ label, value, onChange, options }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="flex flex-col space-y-2" ref={dropdownRef}>
//       <label className="text-xs sm:text-sm font-medium text-gray-700">
//         {label}
//       </label>
//       <div className="relative">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-xs sm:text-sm hover:bg-gray-100 bg-white transition-all"
//         >
//           <span className="truncate">{value}</span>
//           <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
//         </button>
//         {isOpen && (
//           <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//             {options.map((option) => (
//               <li
//                 key={option}
//                 onClick={() => {
//                   onChange(option);
//                   setIsOpen(false);
//                 }}
//                 className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-xs sm:text-sm"
//               >
//                 {option}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// // Optimized Status Badge
// const StatusBadge = ({ status, prediction }) => {
//   const actualStatus = status || getStatus(prediction);
//   const config = STATUS_CONFIG[actualStatus] || STATUS_CONFIG.healthy;
//   const icon = DISEASE_CONFIG[prediction]?.icon || DISEASE_CONFIG.Healthy.icon;

//   return (
//     <div
//       className={`${config.className} flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium`}
//     >
//       <span className="text-xs">{icon}</span>
//       <span className="hidden sm:inline">{config.label}</span>
//       <span className="sm:hidden">{config.label.split(" ")[0]}</span>
//     </div>
//   );
// };

// // Optimized View Button
// const ViewDetailsButton = ({ status, prediction, scanId }) => {
//   const actualStatus = status || getStatus(prediction);
//   const config = STATUS_CONFIG[actualStatus] || STATUS_CONFIG.healthy;

//   return (
//     <Link
//       to={`/scan-history-details/${scanId}`}
//       className={`flex items-center gap-1 sm:gap-2 ${config.color} p-0 h-auto text-xs sm:text-sm font-medium transition-colors`}
//     >
//       <img src={EyeIcon} alt="View" className="h-3 w-3 sm:h-4 sm:w-4" />
//       <span className="hidden sm:inline">View Details</span>
//       <span className="sm:hidden">View</span>
//     </Link>
//   );
// };

// export default function ScanHistoryPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [scanData, setScanData] = useState([]);
//   const [farms, setFarms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [allScans, setAllScans] = useState([]);
//   const [filters, setFilters] = useState({
//     dateRange: "All Time",
//     status: "All Status",
//     farmId: "all",
//     farmerName: "",
//   });

//   const reportRef = useRef(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Auth check
//   useEffect(() => {
//     if (!token) navigate("/sign-in", { replace: true });
//   }, [token, navigate]);

//   // Fetch farms once
//   useEffect(() => {
//     if (!token) return;

//     const fetchFarms = async () => {
//       try {
//         const res = await fetch(
//           "https://papaiaapi.onrender.com/api/owner/farms",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (res.ok) {
//           const data = await res.json();
//           if (data.status === "success") setFarms(data.farms || []);
//         }
//       } catch (err) {
//         setFarms([]);
//       }
//     };

//     fetchFarms();
//   }, [token]);

//   // Fetch scans once
//   useEffect(() => {
//     if (!token || farms.length === 0) return;

//     const fetchScans = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           "https://papaiaapi.onrender.com/api/owner/identification-history",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (res.ok) {
//           const scansArray = await res.json();

//           if (Array.isArray(scansArray)) {
//             // Create farm lookup map
//             const farmMap = Object.fromEntries(
//               farms.map((f) => [f.id, f.farmName])
//             );

//             // Process all scans at once
//             const processed = scansArray
//               .map((scan) => ({
//                 ...scan,
//                 farmName: farmMap[scan.farmId] || "Unknown Farm",
//                 createdAt: scan.timestamp?.includes("/")
//                   ? new Date(scan.timestamp).toISOString()
//                   : scan.timestamp,
//                 status: getStatus(scan.prediction),
//                 description: scan.prediction || "Unknown",
//                 idNumber: scan.idNumber || "Unknown Farmer",
//               }))
//               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//             setAllScans(processed);
//           }
//         }
//       } catch (err) {
//         setAllScans([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScans();
//   }, [token, farms]);

//   // Memoized filter logic
//   const filteredScans = useMemo(() => {
//     let filtered = allScans;

//     // Date filter
//     if (filters.dateRange !== "All Time") {
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//       const cutoff =
//         filters.dateRange === "Today"
//           ? today
//           : filters.dateRange === "Last 7 days"
//           ? new Date(today - 7 * 86400000)
//           : new Date(today - 30 * 86400000);

//       filtered = filtered.filter((s) => new Date(s.createdAt) >= cutoff);
//     }

//     // Status filter
//     if (filters.status !== "All Status") {
//       const statusMap = {
//         Healthy: "healthy",
//         "Disease Detected": "disease-detected",
//         "Needs Attention": "needs-attention",
//       };
//       const targetStatus = statusMap[filters.status];
//       filtered = filtered.filter((s) => s.status === targetStatus);
//     }

//     // Farm filter
//     if (filters.farmId !== "all") {
//       filtered = filtered.filter((s) => s.farmId === filters.farmId);
//     }

//     // Farmer filter
//     if (filters.farmerName) {
//       const query = filters.farmerName.toLowerCase();
//       filtered = filtered.filter((s) =>
//         s.idNumber?.toLowerCase().includes(query)
//       );
//     }

//     return filtered;
//   }, [allScans, filters]);

//   // Paginated data
//   const paginatedScans = useMemo(() => {
//     const start = (currentPage - 1) * RESULTS_PER_PAGE;
//     return filteredScans.slice(start, start + RESULTS_PER_PAGE);
//   }, [filteredScans, currentPage]);

//   const totalPages = Math.ceil(filteredScans.length / RESULTS_PER_PAGE);

//   // Optimized filter handler
//   const handleFilterChange = useCallback((type, value) => {
//     setFilters((prev) => ({ ...prev, [type]: value }));
//     setCurrentPage(1);
//   }, []);

//   // Memoized date formatters
//   const formatDate = useCallback((dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   }, []);

//   const formatTime = useCallback((dateString) => {
//     return new Date(dateString).toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   }, []);

//   const handleExport = useCallback(() => {
//     if (!reportRef.current) return;
//     html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
//       const pdf = new jsPDF("p", "pt", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(
//         canvas.toDataURL("image/png"),
//         "PNG",
//         0,
//         0,
//         pdfWidth,
//         pdfHeight
//       );
//       pdf.save("scan-history-report.pdf");
//     });
//   }, []);

//   const startResult = Math.min(
//     (currentPage - 1) * RESULTS_PER_PAGE + 1,
//     filteredScans.length
//   );
//   const endResult = Math.min(
//     currentPage * RESULTS_PER_PAGE,
//     filteredScans.length
//   );

//   useEffect(() => {
//     setScanData(paginatedScans);
//   }, [paginatedScans]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <HeaderMain />
//       <main className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
//                 Scan History
//               </h1>
//               <p className="text-xs sm:text-base text-gray-600">
//                 Track all crop health scans and analysis results
//               </p>
//             </div>
//             <button
//               onClick={handleExport}
//               className="flex items-center justify-center gap-2 h-9 sm:h-10 px-3 sm:px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-700 transition-colors w-full sm:w-auto"
//             >
//               <img src={DownloadIcon} alt="Download" className="h-4 w-4" />
//               <span>Export</span>
//             </button>
//           </div>

//           {/* Filters */}
//           <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 mb-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
//               <FilterDropdown
//                 label="Date Range"
//                 value={filters.dateRange}
//                 onChange={(v) => handleFilterChange("dateRange", v)}
//                 options={["All Time", "Today", "Last 7 days", "Last 30 days"]}
//               />

//               <FilterDropdown
//                 label="Status"
//                 value={filters.status}
//                 onChange={(v) => handleFilterChange("status", v)}
//                 options={[
//                   "All Status",
//                   "Healthy",
//                   "Disease Detected",
//                   "Needs Attention",
//                 ]}
//               />

//               <div className="flex flex-col space-y-2">
//                 <label className="text-xs sm:text-sm font-medium text-gray-700">
//                   Farmer ID
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search farmer ID..."
//                   value={filters.farmerName}
//                   onChange={(e) =>
//                     handleFilterChange("farmerName", e.target.value)
//                   }
//                   className="h-9 sm:h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               <FilterDropdown
//                 label="Farm"
//                 value={
//                   filters.farmId === "all"
//                     ? "All Farms"
//                     : farms.find((f) => f.id === filters.farmId)?.farmName ||
//                       "All Farms"
//                 }
//                 onChange={(v) => {
//                   const farm = farms.find((f) => f.farmName === v);
//                   handleFilterChange("farmId", farm?.id || "all");
//                 }}
//                 options={["All Farms", ...farms.map((f) => f.farmName)]}
//               />
//             </div>
//           </div>

//           {/* Scan History List */}
//           <div
//             ref={reportRef}
//             className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
//           >
//             <div className="divide-y divide-gray-200">
//               {loading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-2"></div>
//                   <div className="text-gray-500 text-sm">Loading scans...</div>
//                 </div>
//               ) : scanData.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-gray-500 text-sm">No scans found</div>
//                 </div>
//               ) : (
//                 scanData.map((record) => (
//                   <div
//                     key={record.id}
//                     className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//                       <img
//                         src={
//                           record.imageUrl ||
//                           "https://via.placeholder.com/80x80?text=No+Image"
//                         }
//                         alt={record.farmName}
//                         className="w-full sm:w-20 h-40 sm:h-20 rounded-lg object-cover flex-shrink-0"
//                         loading="lazy"
//                         onError={(e) => {
//                           e.target.src =
//                             "https://via.placeholder.com/80x80?text=No+Image";
//                         }}
//                       />

//                       <div className="flex-1 min-w-0">
//                         <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
//                           <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
//                             {record.farmName}
//                           </h3>
//                           <StatusBadge
//                             status={record.status}
//                             prediction={record.prediction}
//                           />
//                         </div>

//                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
//                           <div className="flex items-center gap-1">
//                             <img
//                               src={UserIcon}
//                               alt="User"
//                               className="h-3 w-3"
//                             />
//                             <span className="truncate">{record.idNumber}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <img
//                               src={CalendarIcon}
//                               alt="Date"
//                               className="h-3 w-3"
//                             />
//                             <span>{formatDate(record.createdAt)}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <img
//                               src={ClockIcon}
//                               alt="Time"
//                               className="h-3 w-3"
//                             />
//                             <span>{formatTime(record.createdAt)}</span>
//                           </div>
//                           {record.confidence && (
//                             <div className="text-xs sm:text-sm">
//                               <span>
//                                 Confidence:{" "}
//                                 {Math.round(record.confidence * 100)}%
//                               </span>
//                             </div>
//                           )}
//                         </div>

//                         {record.description && (
//                           <div className="flex items-center gap-2 mb-3">
//                             <span className="text-sm">
//                               {DISEASE_CONFIG[record.prediction]?.icon ||
//                                 DISEASE_CONFIG.Healthy.icon}
//                             </span>
//                             <p
//                               className="text-xs sm:text-sm font-medium"
//                               style={{
//                                 color:
//                                   DISEASE_CONFIG[record.prediction]?.color ||
//                                   DISEASE_CONFIG.Healthy.color,
//                               }}
//                             >
//                               {record.description}
//                             </p>
//                           </div>
//                         )}

//                         <ViewDetailsButton
//                           status={record.status}
//                           prediction={record.prediction}
//                           scanId={record.id}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Pagination */}
//             {filteredScans.length > RESULTS_PER_PAGE && (
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 border-t border-gray-200">
//                 <div className="text-xs sm:text-sm text-gray-700">
//                   Showing {startResult} to {endResult} of {filteredScans.length}{" "}
//                   results
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className="h-[30px] px-2 sm:px-3 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <button
//                           key={page}
//                           onClick={() => setCurrentPage(page)}
//                           className={`min-w-[30px] h-[30px] px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
//                             page === currentPage
//                               ? "bg-orange-500 text-white border-orange-500"
//                               : "border border-gray-300 text-black hover:bg-gray-50"
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       )
//                     )}
//                   </div>
//                   <button
//                     onClick={() =>
//                       setCurrentPage(Math.min(totalPages, currentPage + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="h-[30px] px-2 sm:px-3 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//       <FooterMain />
//     </div>
//   );
// }
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import FooterMain from "../components/Footer/Footer";
import HeaderMain from "../components/Header/HeaderMain";

// PNG ICON IMPORTS
import DownloadIcon from "../assets/download-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import UserIcon from "../assets/sh-user-icon.png";
import CalendarIcon from "../assets/sh-calendar-icon.png";
import ClockIcon from "../assets/sh-clock-icon.png";

// Constants
const RESULTS_PER_PAGE = 5;

const DISEASE_CONFIG = {
  Healthy: { color: "#22C55E", bgColor: "#22C55E" },
  "Ring Spot Virus": { color: "#EA580C", bgColor: "#EA580C" },
  Anthracnose: { color: "#DC2626", bgColor: "#DC2626" },
  "Powdery Mildew": { color: "#2563EB", bgColor: "#2563EB" },
};

const STATUS_CONFIG = {
  healthy: {
    label: "Healthy",
    className: "bg-green-100 text-green-700 border-green-200",
    color: "text-[#22C55E] hover:text-green-600",
  },
  "disease-detected": {
    label: "Disease Detected",
    className: "bg-red-100 text-red-700 border-red-200",
    color: "text-[#EF4444] hover:text-red-600",
  },
};

// Simple cache for faster subsequent loads
const dataCache = {
  data: {},
  set(key, value, ttl = 60000) {
    this.data[key] = { value, expires: Date.now() + ttl };
  },
  get(key) {
    const item = this.data[key];
    if (!item || Date.now() > item.expires) {
      delete this.data[key];
      return null;
    }
    return item.value;
  },
};

// Updated helper function - only healthy or disease-detected
const getStatus = (prediction) => {
  if (!prediction) return "healthy";
  const p = prediction.toLowerCase();
  if (p === "healthy") return "healthy";
  return "disease-detected";
};

// Memoized Dropdown Component
const FilterDropdown = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="flex flex-col space-y-2" ref={dropdownRef}>
      <label className="text-xs sm:text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center text-xs sm:text-sm hover:bg-gray-100 bg-white transition-all"
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
                className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-xs sm:text-sm"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Optimized Status Badge
const StatusBadge = ({ status, prediction }) => {
  const actualStatus = status || getStatus(prediction);
  const config = STATUS_CONFIG[actualStatus] || STATUS_CONFIG.healthy;

  return (
    <div
      className={`${config.className} flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium`}
    >
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">{config.label.split(" ")[0]}</span>
    </div>
  );
};

// Optimized View Button
const ViewDetailsButton = ({ status, prediction, scanId }) => {
  const actualStatus = status || getStatus(prediction);
  const config = STATUS_CONFIG[actualStatus] || STATUS_CONFIG.healthy;

  return (
    <Link
      to={`/scan-history-details/${scanId}`}
      className={`flex items-center gap-1 sm:gap-2 ${config.color} p-0 h-auto text-xs sm:text-sm font-medium transition-colors`}
    >
      <img src={EyeIcon} alt="View" className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">View Details</span>
      <span className="sm:hidden">View</span>
    </Link>
  );
};

export default function ScanHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [scanData, setScanData] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allScans, setAllScans] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: "All Time",
    status: "All Status",
    farmId: "all",
    farmerName: "",
  });

  const reportRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const abortControllerRef = useRef(null);

  // Auth check
  useEffect(() => {
    if (!token) navigate("/sign-in", { replace: true });
  }, [token, navigate]);

  // Optimized: Fetch farms and scans in parallel with caching
  useEffect(() => {
    if (!token) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      // Check cache first
      const cachedFarms = dataCache.get("farms");
      const cachedScans = dataCache.get("scans");

      if (cachedFarms && cachedScans) {
        setFarms(cachedFarms);
        setAllScans(cachedScans);
        setLoading(false);
        return;
      }

      // Show cached data immediately while fetching fresh data
      if (cachedFarms) setFarms(cachedFarms);
      if (cachedScans) {
        setAllScans(cachedScans);
        setLoading(false);
      }

      try {
        // Fetch both in parallel for faster loading
        const [farmsRes, scansRes] = await Promise.all([
          fetch("https://papaiaapi.onrender.com/api/owner/farms", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }),
          fetch(
            "https://papaiaapi.onrender.com/api/owner/identification-history",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            }
          ),
        ]);

        const [farmsData, scansArray] = await Promise.all([
          farmsRes.ok ? farmsRes.json() : { status: "error", farms: [] },
          scansRes.ok ? scansRes.json() : [],
        ]);

        const farmsList =
          farmsData.status === "success" ? farmsData.farms || [] : [];

        if (Array.isArray(scansArray) && farmsList.length > 0) {
          // Create farm lookup map for O(1) access
          const farmMap = Object.fromEntries(
            farmsList.map((f) => [f.id, f.farmName])
          );

          // Process all scans at once with optimized operations
          const processed = scansArray
            .map((scan) => {
              // Use 'result' field for scan history API, fallback to 'prediction'
              const predictionValue = scan.result || scan.prediction;
              const status = getStatus(predictionValue);
              return {
                ...scan,
                prediction: predictionValue, // Normalize to 'prediction'
                farmName: farmMap[scan.farmId] || "Unknown Farm",
                status,
                description: predictionValue || "Unknown",
                idNumber: scan.idNumber || "Unknown Farmer",
              };
            })
            .sort((a, b) => {
              // Parse timestamps for sorting
              const parseTimestamp = (timestamp) => {
                if (!timestamp) return new Date(0);
                try {
                  const [datePart, timePart, period] = timestamp.split(/\s+/);
                  const [month, day, year] = datePart.split("/");
                  const [hours, minutes] = timePart.split(":");
                  let hour24 = parseInt(hours);
                  if (period === "PM" && hour24 !== 12) hour24 += 12;
                  if (period === "AM" && hour24 === 12) hour24 = 0;
                  return new Date(year, month - 1, day, hour24, minutes);
                } catch {
                  return new Date(timestamp);
                }
              };
              return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
            });

          setFarms(farmsList);
          setAllScans(processed);

          // Cache the results
          dataCache.set("farms", farmsList);
          dataCache.set("scans", processed);
        } else if (farmsList.length > 0) {
          setFarms(farmsList);
          dataCache.set("farms", farmsList);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching data:", err);
          if (!cachedFarms) setFarms([]);
          if (!cachedScans) setAllScans([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [token, navigate]);

  // Memoized filter logic
  const filteredScans = useMemo(() => {
    let filtered = allScans;

    // Date filter
    if (filters.dateRange !== "All Time") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const cutoff =
        filters.dateRange === "Today"
          ? today
          : filters.dateRange === "Last 7 days"
          ? new Date(today - 7 * 86400000)
          : new Date(today - 30 * 86400000);

      filtered = filtered.filter((s) => {
        // Parse timestamp for date filtering
        try {
          const timestamp = s.timestamp;
          if (!timestamp) return false;
          const [datePart, timePart, period] = timestamp.split(/\s+/);
          const [month, day, year] = datePart.split("/");
          const [hours, minutes] = timePart.split(":");
          let hour24 = parseInt(hours);
          if (period === "PM" && hour24 !== 12) hour24 += 12;
          if (period === "AM" && hour24 === 12) hour24 = 0;
          const scanDate = new Date(year, month - 1, day, hour24, minutes);
          return scanDate >= cutoff;
        } catch {
          return false;
        }
      });
    }

    // Status filter - updated to only use healthy or disease-detected
    if (filters.status !== "All Status") {
      const statusMap = {
        Healthy: "healthy",
        "Disease Detected": "disease-detected",
      };
      const targetStatus = statusMap[filters.status];
      filtered = filtered.filter((s) => s.status === targetStatus);
    }

    // Farm filter
    if (filters.farmId !== "all") {
      filtered = filtered.filter((s) => s.farmId === filters.farmId);
    }

    // Farmer filter
    if (filters.farmerName) {
      const query = filters.farmerName.toLowerCase();
      filtered = filtered.filter((s) =>
        s.idNumber?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allScans, filters]);

  // Paginated data
  const paginatedScans = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    return filteredScans.slice(start, start + RESULTS_PER_PAGE);
  }, [filteredScans, currentPage]);

  const totalPages = Math.ceil(filteredScans.length / RESULTS_PER_PAGE);

  // Optimized filter handler
  const handleFilterChange = useCallback((type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  }, []);

  // Helper to format full date/time
  const formatDateTime = useCallback((timestamp) => {
    try {
      if (!timestamp) return "";

      const parts = timestamp.trim().split(/\s+/);
      if (parts.length !== 3) return timestamp;

      const datePart = parts[0];
      const timePart = parts[1];
      const period = parts[2];

      const [month, day, year] = datePart.split("/");
      if (!month || !day || !year) return timestamp;

      const [hours, minutes] = timePart.split(":");
      if (!hours || !minutes) return timestamp;

      const shortYear = year.slice(-2);
      return `${month.padStart(2, "0")}/${day.padStart(
        2,
        "0"
      )}/${shortYear} ${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )} ${period}`;
    } catch (error) {
      console.error("Error formatting timestamp:", error, timestamp);
      return timestamp;
    }
  }, []);

  // Helper to extract just the date
  const formatDate = useCallback(
    (timestamp) => {
      const formatted = formatDateTime(timestamp);
      return formatted.split(" ")[0];
    },
    [formatDateTime]
  );

  // Helper to extract just the time
  const formatTime = useCallback(
    (timestamp) => {
      const formatted = formatDateTime(timestamp);
      const parts = formatted.split(" ");
      return `${parts[1]} ${parts[2]}`;
    },
    [formatDateTime]
  );

  const handleExport = useCallback(() => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );
      pdf.save("scan-history-report.pdf");
    });
  }, []);

  const startResult = Math.min(
    (currentPage - 1) * RESULTS_PER_PAGE + 1,
    filteredScans.length
  );
  const endResult = Math.min(
    currentPage * RESULTS_PER_PAGE,
    filteredScans.length
  );

  useEffect(() => {
    setScanData(paginatedScans);
  }, [paginatedScans]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />
      <main className="flex-1 px-3 sm:px-6 lg:px-12 xl:px-16 py-4 sm:py-6 lg:py-8">
        <div className="max-w-[1800px] mx-auto">
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
                onChange={(v) => handleFilterChange("dateRange", v)}
                options={["All Time", "Today", "Last 7 days", "Last 30 days"]}
              />

              <FilterDropdown
                label="Status"
                value={filters.status}
                onChange={(v) => handleFilterChange("status", v)}
                options={["All Status", "Healthy", "Disease Detected"]}
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
                onChange={(v) => {
                  const farm = farms.find((f) => f.farmName === v);
                  handleFilterChange("farmId", farm?.id || "all");
                }}
                options={["All Farms", ...farms.map((f) => f.farmName)]}
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
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-2"></div>
                  <div className="text-gray-500 text-sm">Loading scans...</div>
                </div>
              ) : scanData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-sm">No scans found</div>
                </div>
              ) : (
                scanData.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <img
                        src={
                          record.imageUrl ||
                          "https://via.placeholder.com/80x80?text=No+Image"
                        }
                        alt={record.farmName}
                        className="w-full sm:w-20 h-40 sm:h-20 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />

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

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-sm mb-2 items-center">
                          {record.description && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    DISEASE_CONFIG[record.prediction]
                                      ?.bgColor ||
                                    DISEASE_CONFIG.Healthy.bgColor,
                                }}
                              />
                              <p
                                className="font-medium truncate"
                                style={{
                                  color:
                                    DISEASE_CONFIG[record.prediction]?.color ||
                                    DISEASE_CONFIG.Healthy.color,
                                }}
                              >
                                {record.description}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-600">
                            <img
                              src={UserIcon}
                              alt="User"
                              className="h-3 w-3"
                            />
                            <span className="truncate">{record.idNumber}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <img
                              src={CalendarIcon}
                              alt="Date"
                              className="h-3 w-3"
                            />
                            <span>{formatDate(record.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <img
                              src={ClockIcon}
                              alt="Time"
                              className="h-3 w-3"
                            />
                            <span>{formatTime(record.timestamp)}</span>
                          </div>
                          <ViewDetailsButton
                            status={record.status}
                            prediction={record.prediction}
                            scanId={record.id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredScans.length > RESULTS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 border-t border-gray-200">
                <div className="text-xs sm:text-sm text-gray-700">
                  Showing {startResult} to {endResult} of {filteredScans.length}{" "}
                  results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-[30px] px-2 sm:px-3 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[30px] h-[30px] px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "bg-orange-500 text-white border-orange-500"
                              : "border border-gray-300 text-black hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-[30px] px-2 sm:px-3 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
