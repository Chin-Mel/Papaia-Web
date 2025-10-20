import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ScanDetailsPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const [scanDetails, setScanDetails] = useState(null);
  const [farmDetails, setFarmDetails] = useState(null);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reportRef = useRef(null);

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

    const fetchScanDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all scans to find the specific one
        const historyRes = await fetch(
          "https://papaiaapi.onrender.com/api/owner/identification-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!historyRes.ok) throw new Error("Failed to fetch scan history");
        const allScans = await historyRes.json();

        // Find the specific scan
        const specificScan = Array.isArray(allScans)
          ? allScans.find((scan) => scan.id === scanId)
          : null;

        if (!specificScan) {
          setError("Scan not found");
          setLoading(false);
          return;
        }

        if (!specificScan.farmId) {
          setError("Missing farm information");
          setLoading(false);
          return;
        }

        // Try to get detailed prediction data
        const predictionId = specificScan.predictionId || specificScan.id;
        let detailedScanData = null;

        try {
          const detailsRes = await fetch(
            `https://papaiaapi.onrender.com/api/owner/predictions-history/${specificScan.farmId}/${predictionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (detailsRes.ok) {
            const detailsData = await detailsRes.json();
            detailedScanData =
              Array.isArray(detailsData) && detailsData.length > 0
                ? detailsData[0]
                : null;
          }
        } catch (detailsError) {
          console.warn("Could not fetch detailed prediction:", detailsError);
        }

        // Use detailed data if available, otherwise use basic scan data
        const finalScanData = detailedScanData || {
          ...specificScan,
          prediction: specificScan.prediction || "Unknown",
          confidence: specificScan.confidence || 0,
          imageUrl: specificScan.imageUrl || "",
          timestamp: specificScan.timestamp || new Date().toISOString(),
          suggestions: specificScan.suggestions || "",
          farmId: specificScan.farmId,
          idNumber: specificScan.idNumber || "Unknown",
        };

        setScanDetails(finalScanData);

        // Fetch farm details using the farmId from specificScan
        const farmsRes = await fetch(
          "https://papaiaapi.onrender.com/api/owner/farms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (farmsRes.ok) {
          const farmsData = await farmsRes.json();
          if (farmsData.status === "success") {
            const farm = farmsData.farms.find(
              (f) => f.id === specificScan.farmId
            );
            setFarmDetails(farm);
          }
        }

        // Fetch farmer details if available
        if (specificScan.idNumber && specificScan.farmId) {
          try {
            const farmersRes = await fetch(
              `https://papaiaapi.onrender.com/api/owner/farmers/${specificScan.farmId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (farmersRes.ok) {
              const farmersData = await farmersRes.json();
              if (farmersData.status === "success") {
                const farmer = farmersData.farmers.find(
                  (f) => f.idNumber === specificScan.idNumber
                );
                setFarmerDetails(farmer);
              }
            }
          } catch (farmerError) {
            console.warn("Could not fetch farmer details:", farmerError);
          }
        }
      } catch (err) {
        console.error("Error fetching scan details:", err);
        setError(err.message || "Failed to load scan details");
      } finally {
        setLoading(false);
      }
    };

    fetchScanDetails();
  }, [scanId, navigate]);

  const getStatusInfo = (prediction) => {
    if (!prediction)
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: "🟢",
      };

    const predLower = prediction.toLowerCase();
    if (predLower === "healthy") {
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: "🟢",
      };
    }
    if (predLower.includes("ring spot") || predLower.includes("virus")) {
      return {
        status: "disease-detected",
        label: "Ring Spot Virus Detected",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        icon: "🟠",
      };
    }
    if (predLower.includes("anthracnose")) {
      return {
        status: "disease-detected",
        label: "Anthracnose Detected",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: "🔴",
      };
    }
    if (predLower.includes("powdery mildew")) {
      return {
        status: "disease-detected",
        label: "Powdery Mildew Detected",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        icon: "🔵",
      };
    }
    return {
      status: "needs-attention",
      label: "Needs Attention",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: "⚠️",
    };
  };

  const formatDateTime = (timestamp) => {
    try {
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
        "Immediately pull out and burn or deeply bury any papaya plants showing signs of the virus",
        "Regularly inspect all your papaya plants for early signs of the disease",
        "Control aphids using appropriate insecticides or natural methods",
        "Choose locations far from old or infected papaya fields for new plantings",
        "Use healthy, virus-free seedlings or seeds for new plantings",
        "Plant papaya varieties resistant or tolerant to the Ring Spot Virus if available",
        "Keep farm tools clean and wash them after working with infected plants",
        "Remove weeds that can harbor the virus or aphids",
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
      "Improve growing conditions",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading scan details...</div>
        </div>
      </div>
    );
  }

  if (error || !scanDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg font-semibold">
            {error || "Scan not found"}
          </div>
          <button
            onClick={() => navigate("/scan-history-log")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Scan History
          </button>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/scan-history-log")}
            className="text-orange-500 hover:text-orange-600 mb-4 flex items-center gap-2"
          >
            ← Back to Scan History
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Scan Details</h1>
          <p className="text-gray-600 mt-2">
            Detailed analysis and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image and Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={
                  scanDetails.imageUrl ||
                  "https://via.placeholder.com/800x400?text=No+Image"
                }
                alt="Scan"
                className="w-full h-64 sm:h-96 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=No+Image";
                }}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{statusInfo.icon}</span>
                    <div>
                      <div
                        className={`text-xl font-semibold ${statusInfo.color}`}
                      >
                        {scanDetails.prediction}
                      </div>
                      <div className="text-sm text-gray-500">
                        Confidence: {confidencePercentage}%
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.color} font-medium`}
                  >
                    {statusInfo.label}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Confidence Level</span>
                    <span>{confidencePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${confidencePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment Suggestions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                💊 Treatment Suggestions
              </h2>
              <ul className="space-y-3">
                {(apiSuggestions.length > 0
                  ? apiSuggestions
                  : treatmentSuggestions
                ).map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Scan Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Scan Information
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="text-gray-900 font-medium">
                    {dateTime.date}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="text-gray-900 font-medium">
                    {dateTime.time}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Scan ID</div>
                  <div className="text-gray-900 font-mono text-sm">
                    {scanId}
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Information */}
            {farmDetails && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Farm Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Farm Name</div>
                    <div className="text-gray-900 font-medium">
                      {farmDetails.farmName}
                    </div>
                  </div>
                  {farmDetails.location && (
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="text-gray-900">
                        {farmDetails.location}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Farmer Information */}
            {(farmerDetails || scanDetails.idNumber) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Farmer Information
                </h3>
                <div className="space-y-3">
                  {farmerDetails?.name && (
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="text-gray-900 font-medium">
                        {farmerDetails.name}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Farmer ID</div>
                    <div className="text-gray-900 font-mono text-sm">
                      {farmerDetails?.idNumber || scanDetails.idNumber}
                    </div>
                  </div>
                  {farmerDetails?.contactNumber && (
                    <div>
                      <div className="text-sm text-gray-500">Contact</div>
                      <div className="text-gray-900">
                        {farmerDetails.contactNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
