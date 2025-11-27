import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FooterMain from "../components/Footer/Footer";
import HeaderMain from "../components/Header/HeaderMain";
import { ArrowLeft } from "lucide-react";

// Simple cache for faster subsequent loads
const detailsCache = {
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

export default function ScanDetailsPage() {
  const { farmId, scanId } = useParams();
  const navigate = useNavigate();

  const [scanDetails, setScanDetails] = useState(null);
  const [farmDetails, setFarmDetails] = useState(null);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reportRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in", { replace: true });
      return;
    }

    if (!scanId) {
      setError("Scan ID is required");
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchScanDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `scan-${scanId}`;
        const cached = detailsCache.get(cacheKey);

        if (cached) {
          setScanDetails(cached.scan);
          setFarmDetails(cached.farm);
          setFarmerDetails(cached.farmer);
          setLoading(false);
          return;
        }

        const historyRes = await fetch(
          `https://papaiaapi.onrender.com/api/owner/predictions-history/${farmId}/${scanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!historyRes.ok) throw new Error("Failed to fetch scan history");

        const scanData = await historyRes.json();
        const specificScan = Array.isArray(scanData)
          ? scanData.find((scan) => scan.id === scanId)
          : scanData;

        if (!specificScan) {
          setError("Scan not found");
          setLoading(false);
          return;
        }

        const normalizedScan = {
          ...specificScan,
          prediction:
            specificScan.result || specificScan.prediction || "Unknown",
          confidence: specificScan.confidence || 0,
          imageUrl: specificScan.imageUrl || "",
          timestamp: specificScan.timestamp || new Date().toISOString(),
          suggestions: specificScan.suggestions || "",
          farmId: specificScan.farmId || farmId,
          idNumber: specificScan.idNumber || "Unknown",
        };

        setScanDetails(normalizedScan);

        let farm = null;
        if (farmId) {
          try {
            const farmsRes = await fetch(
              "https://papaiaapi.onrender.com/api/owner/farms",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                signal: controller.signal,
              }
            );

            if (farmsRes.ok) {
              const farmsData = await farmsRes.json();
              if (farmsData.status === "success") {
                farm = farmsData.farms.find((f) => f.id === farmId);
                setFarmDetails(farm);
              }
            }
          } catch (farmError) {
            if (farmError.name !== "AbortError") {
              //console.warn("Could not fetch farm details:", farmError);
            }
          }
        }

        let farmer = null;
        if (normalizedScan.idNumber && farmId) {
          try {
            const farmersRes = await fetch(
              `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                signal: controller.signal,
              }
            );

            if (farmersRes.ok) {
              const farmersData = await farmersRes.json();
              if (farmersData.status === "success") {
                farmer = farmersData.farmers.find(
                  (f) => f.idNumber === normalizedScan.idNumber
                );
                setFarmerDetails(farmer);
              }
            }
          } catch (farmerError) {
            if (farmerError.name !== "AbortError") {
              //console.warn("Could not fetch farmer details:", farmerError);
            }
          }
        }

        detailsCache.set(cacheKey, {
          scan: normalizedScan,
          farm,
          farmer,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load scan details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScanDetails();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [scanId, farmId, navigate]);

  const getStatusInfo = (prediction) => {
    if (!prediction) {
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        badgeBg: "bg-green-50",
        badgeText: "text-green-700",
      };
    }

    const predLower = prediction.toLowerCase();
    if (predLower === "healthy") {
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        badgeBg: "bg-green-50",
        badgeText: "text-green-700",
      };
    }

    return {
      status: "disease-detected",
      label: "Disease Detected",
      color: "text-red-600",
      badgeBg: "bg-red-50",
      badgeText: "text-red-700",
    };
  };

  const formatDateTime = (timestamp) => {
    try {
      if (!timestamp) return { date: "Unknown Date", time: "Unknown Time" };

      const [datePart, timePart, period] = timestamp.split(/\s+/);
      if (datePart && timePart && period) {
        const [month, day, year] = datePart.split("/");
        const [hours, minutes] = timePart.split(":");

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

        const monthName = monthNames[parseInt(month) - 1] || month;

        return {
          date: `${monthName} ${day}, ${year}`,
          time: `${hours}:${minutes} ${period}`,
        };
      }

      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return { date: "Unknown Date", time: "Unknown Time" };
      }

      return {
        date: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch (error) {
      return { date: "Unknown Date", time: "Unknown Time" };
    }
  };

  const getTreatmentSuggestions = (prediction) => {
    if (!prediction) return [];

    const predLower = prediction.toLowerCase();

    if (predLower === "healthy") {
      return [
        "Continue regular monitoring of plant health",
        "Maintain proper watering schedule",
        "Ensure adequate sunlight and air circulation",
        "Apply balanced fertilizer as needed",
      ];
    }

    if (predLower.includes("ring spot") || predLower.includes("virus")) {
      return [
        "Apply copper-based fungicide (Copper sulfate) immediately",
        "Remove and destroy all infected plant parts",
        "Improve air circulation between plants",
        "Reduce overhead watering to minimize moisture",
      ];
    }

    if (predLower.includes("anthracnose")) {
      return [
        "Apply copper-based fungicide immediately",
        "Remove and destroy all infected plant parts",
        "Improve air circulation between plants",
        "Reduce overhead watering to minimize moisture",
        "Apply preventive fungicide sprays during wet seasons",
      ];
    }

    if (predLower.includes("powdery mildew")) {
      return [
        "Apply sulfur-based or potassium bicarbonate fungicide",
        "Improve air circulation around plants",
        "Avoid overhead watering",
        "Remove infected leaves and dispose properly",
        "Apply preventive treatments during favorable conditions",
      ];
    }

    return [
      "Consult with agricultural extension officer for specific treatment",
      "Remove and destroy infected plant parts",
      "Apply appropriate fungicide or treatment",
      "Monitor plant health closely",
    ];
  };

  const parseSuggestions = (suggestions) => {
    if (!suggestions) return [];
    return suggestions
      .split("\n")
      .map((line) => line.replace(/^\*\s*/, "").trim())
      .filter((line) => line.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading scan details...</div>
          </div>
        </div>
        <FooterMain />
      </div>
    );
  }

  if (error || !scanDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg font-semibold">
              {error || "Scan not found"}
            </div>
            <button
              onClick={() => navigate("/scan-history")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Scan History
            </button>
          </div>
        </div>
        <FooterMain />
      </div>
    );
  }

  const statusInfo = getStatusInfo(scanDetails.prediction);
  const dateTime = formatDateTime(scanDetails.timestamp);
  const treatmentSuggestions = getTreatmentSuggestions(scanDetails.prediction);
  const apiSuggestions = parseSuggestions(scanDetails.suggestions);
  const confidencePercentage = Math.min(
    100,
    Math.max(0, Math.round(scanDetails.confidence * 100 || 0))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/scan-history")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-xl">Scan Results</span>
          </button>
          <p className="text-sm text-gray-500 ml-7">
            Detailed analysis of your crop health assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Scanned Image */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-white border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  Scanned Image
                </h2>
              </div>
              <div className="p-6">
                <img
                  src={
                    scanDetails.imageUrl ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt="Scan"
                  className="w-full h-80 object-cover rounded-lg mb-4 border border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scan Date:</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {dateTime.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scan Time:</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {dateTime.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - All other cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Scan Status
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-50">
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-red-600">
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-8">
                  {/* Left side - Disease Identified */}
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">
                      Disease Identified
                    </div>
                    <div
                      className={`text-xl font-semibold ${statusInfo.color}`}
                    >
                      {scanDetails.prediction}
                    </div>
                  </div>

                  {/* Right side - Confidence Level */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-500">Confidence Level</span>
                      <span className="font-semibold text-gray-900">
                        {confidencePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500 bg-red-500"
                        style={{ width: `${confidencePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Information Card */}
            {farmDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-white border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">
                    Farm Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Farmer Info - Left Side */}
                    {(farmerDetails || scanDetails.idNumber) && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">
                            {farmerDetails?.fullName ||
                              farmerDetails?.name ||
                              scanDetails.idNumber}
                          </div>
                          <div className="text-sm text-gray-500">Farmer</div>
                        </div>
                      </div>
                    )}

                    {/* Farm Name - Right Side */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        Farm Name
                      </div>
                      <div className="text-base font-semibold text-gray-900">
                        {farmDetails.farmName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Treatment Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Suggested Treatment
                  </h2>
                </div>
              </div>
              <div className="p-6 bg-green-50/30">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                  Immediate Action Required
                </h3>
                <ul className="space-y-3">
                  {(apiSuggestions.length > 0
                    ? apiSuggestions
                    : treatmentSuggestions
                  ).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 leading-relaxed flex-1">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterMain />
    </div>
  );
}
