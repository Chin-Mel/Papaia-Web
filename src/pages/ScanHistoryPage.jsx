import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import FooterMain from "../components/Footer/Footer";
import HeaderMain from "../components/Header/HeaderMain";

const RESULTS_PER_PAGE = 5;
const API_BASE = "https://papaiaapi.onrender.com/api/owner";
const POLL_INTERVAL = 5000;
const DEBOUNCE_DELAY = 500;

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

const getStatus = (prediction) => {
  if (!prediction) return "healthy";
  const p = prediction.toLowerCase();
  if (p === "healthy") return "healthy";
  return "disease-detected";
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

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

const StatusDropdown = ({
  value,
  onChange,
  selectedDiseases,
  onDiseaseChange,
}) => {
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

  const toggleDisease = (disease) => {
    const newSelected = selectedDiseases.includes(disease)
      ? selectedDiseases.filter((d) => d !== disease)
      : [...selectedDiseases, disease];
    onDiseaseChange(newSelected);
  };

  const handleAllDiseases = () => {
    if (selectedDiseases.length === 3) {
      onDiseaseChange([]);
    } else {
      onDiseaseChange(["Anthracnose", "Powdery Mildew", "Ring Spot Virus"]);
    }
  };

  return (
    <div className="flex flex-col space-y-2" ref={dropdownRef}>
      <label className="text-xs sm:text-sm font-medium text-gray-700">
        Status
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
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {["All Status", "Healthy", "Disease Detected"].map((status) => (
              <div
                key={status}
                className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-xs sm:text-sm"
                onClick={() => {
                  onChange(status);
                  if (status !== "Disease Detected") onDiseaseChange([]);
                }}
              >
                {status}
              </div>
            ))}

            {value === "Disease Detected" && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedDiseases.length === 3}
                    onChange={handleAllDiseases}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">
                    All Diseases
                  </span>
                </label>
                {["Anthracnose", "Powdery Mildew", "Ring Spot Virus"].map(
                  (disease) => (
                    <label
                      key={disease}
                      className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDiseases.includes(disease)}
                        onChange={() => toggleDisease(disease)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        {disease}
                      </span>
                    </label>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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

const ViewDetailsButton = ({
  status,
  prediction,
  scanId,
  farmId,
  scanData,
  farmData,
}) => {
  const actualStatus = status || getStatus(prediction);
  const config = STATUS_CONFIG[actualStatus] || STATUS_CONFIG.healthy;

  return (
    <Link
      to={`/scan-history-details/${farmId}/${scanId}`}
      state={{
        scanData: scanData,
        farmData: farmData,
      }}
      className={`${config.color} text-xs sm:text-sm font-medium transition-colors hover:underline`}
    >
      View Details
    </Link>
  );
};

export default function ScanHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [scanData, setScanData] = useState([]);
  const [farms, setFarms] = useState([]);
  const [allScans, setAllScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: "All Time",
    status: "All Status",
    selectedDiseases: [],
    farmId: "all",
    farmerSearch: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const abortControllerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const hasInitialLoad = useRef(false);
  const lastFetchTime = useRef(0);
  const dataHashRef = useRef("");

  useEffect(() => {
    if (!token) navigate("/sign-in", { replace: true });
  }, [token, navigate]);

  const generateDataHash = useCallback((data) => {
    return JSON.stringify({
      scanCount: data.scans?.length || 0,
      farmCount: data.farms?.length || 0,
      latestScan: data.scans?.[0]?.id || null,
    });
  }, []);

  const fetchData = useCallback(
    async (silent = false) => {
      const now = Date.now();
      if (now - lastFetchTime.current < DEBOUNCE_DELAY) {
        return;
      }
      lastFetchTime.current = now;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!silent && !hasInitialLoad.current) {
        setIsLoading(true);
      }

      try {
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const [farmsRes, scansRes] = await Promise.all([
          fetch(`${API_BASE}/farms`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }),
          fetch(`${API_BASE}/identification-history`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }),
        ]);

        clearTimeout(timeoutId);

        const [farmsData, scansArray] = await Promise.all([
          farmsRes.ok ? farmsRes.json() : { status: "error", farms: [] },
          scansRes.ok ? scansRes.json() : [],
        ]);

        const farmsList =
          farmsData.status === "success" ? farmsData.farms || [] : [];

        if (Array.isArray(scansArray) && farmsList.length > 0) {
          const farmMap = Object.fromEntries(
            farmsList.map((f) => [f.id, f.farmName])
          );
          const farmersData = {};

          const farmersPromises = farmsList.map(async (farm) => {
            try {
              const farmersRes = await fetch(`${API_BASE}/farmers/${farm.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                signal: controller.signal,
              });

              if (farmersRes.ok) {
                const data = await farmersRes.json();
                if (data.status === "success" && data.farmers) {
                  data.farmers.forEach((farmer) => {
                    let fullName = "";
                    if (farmer.firstname) fullName += farmer.firstname;
                    if (farmer.middlename) fullName += ` ${farmer.middlename}`;
                    if (farmer.lastname) fullName += ` ${farmer.lastname}`;
                    if (farmer.suffix) fullName += ` ${farmer.suffix}`;
                    const name = fullName.trim() || farmer.idNumber;
                    farmersData[farmer.idNumber] = {
                      name: name,
                      profilePicture: farmer.profilePicture || "",
                    };
                  });
                }
              }
            } catch {}
          });

          await Promise.all(farmersPromises);

          const processed = scansArray
            .map((scan) => {
              const predictionValue = scan.result || scan.prediction;
              const status = getStatus(predictionValue);
              const farmerData = farmersData[scan.idNumber];

              return {
                ...scan,
                prediction: predictionValue,
                farmName: farmMap[scan.farmId] || "Unknown Farm",
                status,
                description: predictionValue || "Unknown",
                idNumber: scan.idNumber || "Unknown Farmer",
                farmerName:
                  scan.farmerName ||
                  farmerData?.name ||
                  scan.idNumber ||
                  "Unknown Farmer",
                profilePicture:
                  scan.profilePicture || farmerData?.profilePicture || "",
              };
            })
            .sort((a, b) => {
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

          const newHash = generateDataHash({
            farms: farmsList,
            scans: processed,
          });

          if (newHash !== dataHashRef.current || !silent) {
            dataHashRef.current = newHash;
            setFarms(farmsList);
            setAllScans(processed);
          }
        } else if (farmsList.length > 0) {
          setFarms(farmsList);
          setAllScans([]);
        } else {
          setFarms([]);
          setAllScans([]);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !silent) {
          setFarms([]);
          setAllScans([]);
        }
      } finally {
        if (!silent && !hasInitialLoad.current) {
          setIsLoading(false);
          hasInitialLoad.current = true;
        }
      }
    },
    [token, generateDataHash]
  );

  useEffect(() => {
    const isSilent = hasInitialLoad.current;
    fetchData(isSilent);

    pollIntervalRef.current = setInterval(() => {
      if (!document.hidden) {
        fetchData(true);
      }
    }, POLL_INTERVAL);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchData]);

  const filteredScans = useMemo(() => {
    return allScans.filter((scan) => {
      const { timestamp, prediction, farmId, farmerName } = scan;

      if (filters.dateRange !== "All Time") {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const cutoff =
          filters.dateRange === "Today"
            ? today
            : filters.dateRange === "Last 7 days"
            ? new Date(today.getTime() - 7 * 86400000)
            : new Date(today.getTime() - 30 * 86400000);

        try {
          const [datePart, timePart, period] = timestamp.split(/\s+/);
          const [month, day, year] = datePart.split("/");
          const [hours, minutes] = timePart.split(":");
          let hour24 = parseInt(hours, 10);
          if (period === "PM" && hour24 !== 12) hour24 += 12;
          if (period === "AM" && hour24 === 12) hour24 = 0;
          const scanDate = new Date(year, month - 1, day, hour24, minutes);
          if (scanDate < cutoff) return false;
        } catch {
          return false;
        }
      }

      const predictionLower = prediction?.toLowerCase() || "";
      if (filters.status !== "All Status") {
        if (filters.status === "Healthy" && predictionLower !== "healthy") {
          return false;
        }
        if (
          filters.status === "Disease Detected" &&
          predictionLower === "healthy"
        ) {
          return false;
        }
      }

      if (
        filters.selectedDiseases.length > 0 &&
        predictionLower !== "healthy"
      ) {
        const selectedLower = filters.selectedDiseases.map((d) =>
          d.toLowerCase()
        );
        if (!selectedLower.includes(predictionLower)) return false;
      }

      if (filters.farmId !== "all" && scan.farmId !== filters.farmId) {
        return false;
      }

      if (
        filters.farmerSearch.trim() &&
        !farmerName
          ?.toLowerCase()
          .includes(filters.farmerSearch.toLowerCase().trim())
      ) {
        return false;
      }

      return true;
    });
  }, [allScans, filters]);

  const paginatedScans = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    return filteredScans.slice(start, start + RESULTS_PER_PAGE);
  }, [filteredScans, currentPage]);

  const totalPages = Math.ceil(filteredScans.length / RESULTS_PER_PAGE);

  const handleFilterChange = useCallback((type, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [type]: value };
      if (type === "status" && value !== "Disease Detected") {
        newFilters.selectedDiseases = [];
      }
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const formatDate = useCallback((timestamp) => {
    try {
      if (!timestamp) return "";
      const parts = timestamp.trim().split(/\s+/);
      if (parts.length !== 3) return timestamp;
      const datePart = parts[0];
      const [month, day, year] = datePart.split("/");
      if (!month || !day || !year) return timestamp;

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const monthIndex = parseInt(month) - 1;
      const monthName = monthNames[monthIndex] || month;
      return `${monthName} ${parseInt(day)}, ${year}`;
    } catch {
      return timestamp;
    }
  }, []);

  const formatTime = useCallback((timestamp) => {
    try {
      if (!timestamp) return "";
      const parts = timestamp.trim().split(/\s+/);
      if (parts.length !== 3) return timestamp;
      return `${parts[1]} ${parts[2]}`;
    } catch {
      return timestamp;
    }
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Scan History
              </h1>
              <p className="text-xs sm:text-base text-gray-600">
                Track all crop health scans and analysis results
              </p>
            </div>
          </div>

          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 items-start">
              <FilterDropdown
                label="Date Range"
                value={filters.dateRange}
                onChange={(v) => handleFilterChange("dateRange", v)}
                options={["All Time", "Today", "Last 7 days", "Last 30 days"]}
              />

              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <StatusDropdown
                    value={filters.status}
                    onChange={(v) => handleFilterChange("status", v)}
                    selectedDiseases={filters.selectedDiseases}
                    onDiseaseChange={(d) =>
                      handleFilterChange("selectedDiseases", d)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={filters.farmerSearch}
                  onChange={(e) =>
                    handleFilterChange("farmerSearch", e.target.value)
                  }
                  placeholder="Search farmer name..."
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="min-h-[400px]">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {scanData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-sm">
                      {allScans.length === 0
                        ? "No scans yet"
                        : "No results found"}
                    </div>
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
                          loading="eager"
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
                                      DISEASE_CONFIG[record.prediction]
                                        ?.color || DISEASE_CONFIG.Healthy.color,
                                  }}
                                >
                                  {record.description}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-600">
                              <span>👤</span>
                              <span className="truncate">
                                {record.farmerName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <span>📅</span>
                              <span>{formatDate(record.timestamp)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <span>🕒</span>
                              <span>{formatTime(record.timestamp)}</span>
                            </div>
                            <ViewDetailsButton
                              status={record.status}
                              prediction={record.prediction}
                              scanId={record.id}
                              farmId={record.farmId}
                              scanData={record}
                              farmData={farms.find(
                                (f) => f.id === record.farmId
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!isLoading && filteredScans.length > RESULTS_PER_PAGE && (
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
