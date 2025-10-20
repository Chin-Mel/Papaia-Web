import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

// Note: These imports won't work in this demo environment
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import FooterMain from "../components/Footer/FooterMain";
// import HeaderMain from "../components/Header/HeaderMain";

export default function ScanDetailsPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [scanDetails, setScanDetails] = useState(null);
  const [farmDetails, setFarmDetails] = useState(null);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reportRef = useRef(null);

  useEffect(() => {
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

        console.log("🔍 Fetching scan details for scanId:", scanId);

        // First, get all identification history to find the farmId for this scan
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

        console.log("📊 All scans:", allScans);

        // Find the specific scan to get farmId
        const specificScan = Array.isArray(allScans)
          ? allScans.find((scan) => scan.id === scanId)
          : null;

        console.log("🎯 Specific scan found:", specificScan);

        if (!specificScan) {
          console.error("❌ Scan not found");
          setError("Scan not found");
          setLoading(false);
          return;
        }

        // Check if we have the necessary IDs
        if (!specificScan.farmId) {
          console.error("❌ Missing farmId");
          setError("Missing farm information");
          setLoading(false);
          return;
        }

        // IMPORTANT FIX: The identification history might have a different ID structure
        // Try to get the actual prediction ID from the scan data
        const predictionId = specificScan.predictionId || specificScan.id;

        console.log("🏠 Farm ID:", specificScan.farmId);
        console.log("🆔 Using Prediction ID:", predictionId);
        console.log(
          "📍 Calling API:",
          `predictions-history/${specificScan.farmId}/${predictionId}`
        );

        // Now fetch the detailed prediction using the new API
        const detailsRes = await fetch(
          `https://papaiaapi.onrender.com/api/owner/predictions-history/${specificScan.farmId}/${predictionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📡 Details response status:", detailsRes.status);

        if (!detailsRes.ok) {
          const errorText = await detailsRes.text();
          console.error("❌ API Error:", errorText);

          if (detailsRes.status === 404) {
            // If prediction not found with this ID, use the scan data we already have
            console.log("⚠️ Falling back to scan data from history");
            setScanDetails({
              ...specificScan,
              prediction: specificScan.prediction || "Unknown",
              confidence: specificScan.confidence || 0,
              imageUrl: specificScan.imageUrl || "",
              timestamp: specificScan.timestamp || new Date().toISOString(),
              suggestions: specificScan.suggestions || "",
              farmId: specificScan.farmId,
              idNumber: specificScan.idNumber || "Unknown",
            });
          } else if (detailsRes.status === 403) {
            throw new Error("Access denied. You do not own this farm.");
          } else {
            throw new Error(`Failed to fetch prediction details: ${errorText}`);
          }
        } else {
          const detailsData = await detailsRes.json();
          console.log("✅ Details data received:", detailsData);

          // The API returns an array with one item
          const detailedScan =
            Array.isArray(detailsData) && detailsData.length > 0
              ? detailsData[0]
              : null;

          console.log("📝 Detailed scan:", detailedScan);

          if (!detailedScan) {
            console.error("❌ No detailed scan in response");
            // Fall back to basic scan data
            setScanDetails({
              ...specificScan,
              prediction: specificScan.prediction || "Unknown",
              confidence: specificScan.confidence || 0,
              imageUrl: specificScan.imageUrl || "",
              timestamp: specificScan.timestamp || new Date().toISOString(),
              suggestions: specificScan.suggestions || "",
              farmId: specificScan.farmId,
              idNumber: specificScan.idNumber || "Unknown",
            });
          } else {
            setScanDetails(detailedScan);
          }
        }

        // Fetch farm details
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
              (f) => f.id === (scanDetails?.farmId || specificScan.farmId)
            );
            setFarmDetails(farm);
          }
        }

        // Fetch farmer details if we have idNumber
        const currentIdNumber = scanDetails?.idNumber || specificScan.idNumber;
        const currentFarmId = scanDetails?.farmId || specificScan.farmId;

        if (currentIdNumber && currentFarmId) {
          try {
            const farmersRes = await fetch(
              `https://papaiaapi.onrender.com/api/owner/farmers/${currentFarmId}`,
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
                  (f) => f.idNumber === currentIdNumber
                );
                setFarmerDetails(farmer);
              }
            }
          } catch (farmerError) {
            console.warn("Could not fetch farmer details:", farmerError);
          }
        }
      } catch (err) {
        console.error("💥 Error fetching scan details:", err);
        setError(err.message || "Failed to load scan details");
      } finally {
        setLoading(false);
      }
    };

    fetchScanDetails();
  }, [scanId, token, navigate]);

  // Helper functions remain the same...
  const getStatusInfo = (prediction) => {
    if (!prediction)
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };

    const predLower = prediction.toLowerCase();
    if (predLower === "healthy") {
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    }
    if (predLower.includes("virus") || predLower.includes("disease")) {
      return {
        status: "disease-detected",
        label: "Disease Detected",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    }
    return {
      status: "needs-attention",
      label: "Needs Attention",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    };
  };

  const formatDateTime = (timestamp) => {
    try {
      let date;
      if (typeof timestamp === "string" && timestamp.includes("/")) {
        date = new Date(timestamp);
      } else {
        date = new Date(timestamp);
      }

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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading scan details...</div>
        </div>
      </div>
    );
  }

  if (error || !scanDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="text-red-500 text-lg font-semibold">
            {error || "Scan not found"}
          </div>
          <button
            onClick={() => navigate("/scan-history-log")}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Scan Results</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Scan Status</h2>
          <div
            className={`inline-block px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}
          >
            {statusInfo.label}
          </div>
          <div className="mt-4">
            <p className="text-gray-600">
              Disease:{" "}
              <span className="font-semibold">{scanDetails.prediction}</span>
            </p>
            <p className="text-gray-600">
              Confidence:{" "}
              <span className="font-semibold">{confidencePercentage}%</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Treatment Suggestions</h2>
          <ul className="space-y-2">
            {(apiSuggestions.length > 0
              ? apiSuggestions
              : treatmentSuggestions
            ).map((suggestion, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
