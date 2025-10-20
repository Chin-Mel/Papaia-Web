//new
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FooterMain from "../components/Footer/FooterMain";
import HeaderMain from "../components/Header/HeaderMain";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

        // Fetch all data in parallel for better performance
        const [historyRes, farmsRes] = await Promise.all([
          fetch(
            "https://papaiaapi.onrender.com/api/owner/identification-history",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
          fetch("https://papaiaapi.onrender.com/api/owner/farms", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!historyRes.ok) throw new Error("Failed to fetch scan history");

        const [allScans, farmsData] = await Promise.all([
          historyRes.json(),
          farmsRes.json(),
        ]);

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

        // Set farm details
        if (farmsData.status === "success") {
          const farm = farmsData.farms.find(
            (f) => f.id === specificScan.farmId
          );
          setFarmDetails(farm);
        }

        // Try to get detailed prediction data (non-blocking)
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

        // Fetch farmer details if available (non-blocking)
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
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: "🟢",
        badgeBg: "bg-green-100",
      };

    const predLower = prediction.toLowerCase();
    if (predLower === "healthy") {
      return {
        status: "healthy",
        label: "Healthy",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: "🟢",
        badgeBg: "bg-green-100",
      };
    }
    if (predLower.includes("ring spot") || predLower.includes("virus")) {
      return {
        status: "disease-detected",
        label: "Disease Detected",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: "🔴",
        badgeBg: "bg-red-100",
      };
    }
    if (predLower.includes("anthracnose")) {
      return {
        status: "disease-detected",
        label: "Disease Detected",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: "🔴",
        badgeBg: "bg-red-100",
      };
    }
    if (predLower.includes("powdery mildew")) {
      return {
        status: "disease-detected",
        label: "Disease Detected",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: "🔵",
        badgeBg: "bg-blue-100",
      };
    }
    return {
      status: "needs-attention",
      label: "Needs Attention",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: "⚠️",
      badgeBg: "bg-yellow-100",
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

  const handleExport = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`scan-report-${scanId}.pdf`);
    });
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

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/scan-history")}
              className="text-sm text-gray-600 hover:text-orange-500 flex items-center gap-1 mb-4"
            >
              <span>Scan History</span>
              <span>/</span>
              <span className="font-medium text-gray-900">Scan Results</span>
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Scan Results
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Detailed analysis of your crop health assessment
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleExport}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export Report
              </button>
            </div>
          </div>

          <div ref={reportRef} className="space-y-6">
            {/* Top Row - Image, Status, and Farm Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Scanned Image */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Scanned Image
                    </h2>
                  </div>
                  <div className="p-4">
                    <img
                      src={
                        scanDetails.imageUrl ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt="Scan"
                      className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <div className="font-medium text-gray-900">
                          Scan Date:
                        </div>
                        <div>{dateTime.date}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Scan Time:
                        </div>
                        <div>{dateTime.time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Scan Status and Farm Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Scan Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Scan Status
                    </h2>
                  </div>
                  <div className="p-4">
                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusInfo.badgeBg} border ${statusInfo.borderColor} mb-4`}
                    >
                      <span className="text-xl">{statusInfo.icon}</span>
                      <span className={`font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Disease Info */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Disease Identified:
                      </div>
                      <div className={`text-lg font-bold ${statusInfo.color}`}>
                        {scanDetails.prediction}
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Confidence Level</span>
                        <span className="font-semibold text-gray-900">
                          {confidencePercentage}%
                        </span>
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

                {/* Farm Information */}
                {farmDetails && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Farm Information
                      </h2>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">Farm Name</div>
                          <div className="font-medium text-gray-900">
                            {farmDetails.farmName}
                          </div>
                        </div>
                      </div>
                      {farmerDetails && (
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-gray-600"
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
                          <div className="flex-1">
                            <div className="text-xs text-gray-500">Farmer</div>
                            <div className="font-medium text-gray-900">
                              {farmerDetails.name || scanDetails.idNumber}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row - Treatment (Full Width) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Suggested Treatment
                  </h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Immediate Action Required:
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {apiSuggestions.length > 0
                      ? apiSuggestions[0]
                      : treatmentSuggestions[0]}
                  </p>
                </div>

                <ul className="space-y-3">
                  {(apiSuggestions.length > 0
                    ? apiSuggestions.slice(1)
                    : treatmentSuggestions.slice(1)
                  ).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 flex-1">{suggestion}</span>
                    </li>
                  ))}
                </ul>

                {statusInfo.status === "disease-detected" && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex gap-2">
                      <svg
                        className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">
                          Treatment should begin within 24 hours
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Early intervention is crucial for preventing further
                          spread
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterMain />
    </div>
  );
}

//old
// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import FooterMain from "../components/Footer/FooterMain";
// import HeaderMain from "../components/Header/HeaderMain";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export default function ScanDetailsPage() {
//   const { scanId } = useParams();
//   const navigate = useNavigate();

//   const [scanDetails, setScanDetails] = useState(null);
//   const [farmDetails, setFarmDetails] = useState(null);
//   const [farmerDetails, setFarmerDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const reportRef = useRef(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/sign-in", { replace: true });
//       return;
//     }

//     if (!scanId) {
//       setError("Scan ID is required");
//       setLoading(false);
//       return;
//     }

//     const fetchScanDetails = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all data in parallel for better performance
//         const [historyRes, farmsRes] = await Promise.all([
//           fetch(
//             "https://papaiaapi.onrender.com/api/owner/identification-history",
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           ),
//           fetch("https://papaiaapi.onrender.com/api/owner/farms", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }),
//         ]);

//         if (!historyRes.ok) throw new Error("Failed to fetch scan history");

//         const [allScans, farmsData] = await Promise.all([
//           historyRes.json(),
//           farmsRes.json(),
//         ]);

//         // Find the specific scan
//         const specificScan = Array.isArray(allScans)
//           ? allScans.find((scan) => scan.id === scanId)
//           : null;

//         if (!specificScan) {
//           setError("Scan not found");
//           setLoading(false);
//           return;
//         }

//         if (!specificScan.farmId) {
//           setError("Missing farm information");
//           setLoading(false);
//           return;
//         }

//         // Set farm details
//         if (farmsData.status === "success") {
//           const farm = farmsData.farms.find(
//             (f) => f.id === specificScan.farmId
//           );
//           setFarmDetails(farm);
//         }

//         // Try to get detailed prediction data (non-blocking)
//         const predictionId = specificScan.predictionId || specificScan.id;
//         let detailedScanData = null;

//         try {
//           const detailsRes = await fetch(
//             `https://papaiaapi.onrender.com/api/owner/predictions-history/${specificScan.farmId}/${predictionId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           if (detailsRes.ok) {
//             const detailsData = await detailsRes.json();
//             detailedScanData =
//               Array.isArray(detailsData) && detailsData.length > 0
//                 ? detailsData[0]
//                 : null;
//           }
//         } catch (detailsError) {
//           console.warn("Could not fetch detailed prediction:", detailsError);
//         }

//         // Use detailed data if available, otherwise use basic scan data
//         const finalScanData = detailedScanData || {
//           ...specificScan,
//           prediction: specificScan.prediction || "Unknown",
//           confidence: specificScan.confidence || 0,
//           imageUrl: specificScan.imageUrl || "",
//           timestamp: specificScan.timestamp || new Date().toISOString(),
//           suggestions: specificScan.suggestions || "",
//           farmId: specificScan.farmId,
//           idNumber: specificScan.idNumber || "Unknown",
//         };

//         setScanDetails(finalScanData);

//         // Fetch farmer details if available (non-blocking)
//         if (specificScan.idNumber && specificScan.farmId) {
//           try {
//             const farmersRes = await fetch(
//               `https://papaiaapi.onrender.com/api/owner/farmers/${specificScan.farmId}`,
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "application/json",
//                 },
//               }
//             );

//             if (farmersRes.ok) {
//               const farmersData = await farmersRes.json();
//               if (farmersData.status === "success") {
//                 const farmer = farmersData.farmers.find(
//                   (f) => f.idNumber === specificScan.idNumber
//                 );
//                 setFarmerDetails(farmer);
//               }
//             }
//           } catch (farmerError) {
//             console.warn("Could not fetch farmer details:", farmerError);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching scan details:", err);
//         setError(err.message || "Failed to load scan details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScanDetails();
//   }, [scanId, navigate]);

//   const getStatusInfo = (prediction) => {
//     if (!prediction)
//       return {
//         status: "healthy",
//         label: "Healthy",
//         color: "text-green-600",
//         bgColor: "bg-green-50",
//         borderColor: "border-green-200",
//         icon: "🟢",
//         badgeBg: "bg-green-100",
//       };

//     const predLower = prediction.toLowerCase();
//     if (predLower === "healthy") {
//       return {
//         status: "healthy",
//         label: "Healthy",
//         color: "text-green-600",
//         bgColor: "bg-green-50",
//         borderColor: "border-green-200",
//         icon: "🟢",
//         badgeBg: "bg-green-100",
//       };
//     }
//     if (predLower.includes("ring spot") || predLower.includes("virus")) {
//       return {
//         status: "disease-detected",
//         label: "Disease Detected",
//         color: "text-red-600",
//         bgColor: "bg-red-50",
//         borderColor: "border-red-200",
//         icon: "🔴",
//         badgeBg: "bg-red-100",
//       };
//     }
//     if (predLower.includes("anthracnose")) {
//       return {
//         status: "disease-detected",
//         label: "Disease Detected",
//         color: "text-red-600",
//         bgColor: "bg-red-50",
//         borderColor: "border-red-200",
//         icon: "🔴",
//         badgeBg: "bg-red-100",
//       };
//     }
//     if (predLower.includes("powdery mildew")) {
//       return {
//         status: "disease-detected",
//         label: "Disease Detected",
//         color: "text-blue-600",
//         bgColor: "bg-blue-50",
//         borderColor: "border-blue-200",
//         icon: "🔵",
//         badgeBg: "bg-blue-100",
//       };
//     }
//     return {
//       status: "needs-attention",
//       label: "Needs Attention",
//       color: "text-yellow-600",
//       bgColor: "bg-yellow-50",
//       borderColor: "border-yellow-200",
//       icon: "⚠️",
//       badgeBg: "bg-yellow-100",
//     };
//   };

//   const formatDateTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) {
//         return { date: "Unknown Date", time: "Unknown Time" };
//       }

//       return {
//         date: date.toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         }),
//         time: date.toLocaleTimeString("en-US", {
//           hour: "numeric",
//           minute: "2-digit",
//           hour12: true,
//         }),
//       };
//     } catch (error) {
//       return { date: "Unknown Date", time: "Unknown Time" };
//     }
//   };

//   const getTreatmentSuggestions = (prediction) => {
//     if (!prediction) return [];

//     const predLower = prediction.toLowerCase();

//     if (predLower === "healthy") {
//       return [
//         "Continue regular monitoring of plant health",
//         "Maintain proper watering schedule",
//         "Ensure adequate sunlight and air circulation",
//         "Apply balanced fertilizer as needed",
//       ];
//     }

//     if (predLower.includes("ring spot") || predLower.includes("virus")) {
//       return [
//         "Immediately pull out and burn or deeply bury any papaya plants showing signs of the virus",
//         "Regularly inspect all your papaya plants for early signs of the disease",
//         "Control aphids using appropriate insecticides or natural methods",
//         "Choose locations far from old or infected papaya fields for new plantings",
//         "Use healthy, virus-free seedlings or seeds for new plantings",
//         "Plant papaya varieties resistant or tolerant to the Ring Spot Virus if available",
//         "Keep farm tools clean and wash them after working with infected plants",
//         "Remove weeds that can harbor the virus or aphids",
//       ];
//     }

//     if (predLower.includes("anthracnose")) {
//       return [
//         "Apply copper-based fungicide immediately",
//         "Remove and destroy all infected plant parts",
//         "Improve air circulation between plants",
//         "Reduce overhead watering to minimize moisture",
//         "Apply preventive fungicide sprays during wet seasons",
//       ];
//     }

//     if (predLower.includes("powdery mildew")) {
//       return [
//         "Apply sulfur-based or potassium bicarbonate fungicide",
//         "Improve air circulation around plants",
//         "Avoid overhead watering",
//         "Remove infected leaves and dispose properly",
//         "Apply preventive treatments during favorable conditions",
//       ];
//     }

//     return [
//       "Consult with agricultural extension officer for specific treatment",
//       "Remove and destroy infected plant parts",
//       "Apply appropriate fungicide or treatment",
//       "Monitor plant health closely",
//       "Improve growing conditions",
//     ];
//   };

//   const parseSuggestions = (suggestions) => {
//     if (!suggestions) return [];
//     return suggestions
//       .split("\n")
//       .map((line) => line.replace(/^\*\s*/, "").trim())
//       .filter((line) => line.length > 0);
//   };

//   const handleExport = () => {
//     if (!reportRef.current) return;
//     html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "pt", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`scan-report-${scanId}.pdf`);
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <HeaderMain />
//         <div className="flex-1 flex items-center justify-center p-4">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//             <div className="text-gray-500">Loading scan details...</div>
//           </div>
//         </div>
//         <FooterMain />
//       </div>
//     );
//   }

//   if (error || !scanDetails) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <HeaderMain />
//         <div className="flex-1 flex items-center justify-center p-4">
//           <div className="text-center space-y-4">
//             <div className="text-red-500 text-lg font-semibold">
//               {error || "Scan not found"}
//             </div>
//             <button
//               onClick={() => navigate("/scan-history")}
//               className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//             >
//               Back to Scan History
//             </button>
//           </div>
//         </div>
//         <FooterMain />
//       </div>
//     );
//   }

//   const statusInfo = getStatusInfo(scanDetails.prediction);
//   const dateTime = formatDateTime(scanDetails.timestamp);
//   const treatmentSuggestions = getTreatmentSuggestions(scanDetails.prediction);
//   const apiSuggestions = parseSuggestions(scanDetails.suggestions);
//   const confidencePercentage = Math.min(
//     100,
//     Math.max(0, Math.round(scanDetails.confidence * 100 || 0))
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <HeaderMain />

//       <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Breadcrumb */}
//           <div className="mb-6">
//             <button
//               onClick={() => navigate("/scan-history")}
//               className="text-sm text-gray-600 hover:text-orange-500 flex items-center gap-1 mb-4"
//             >
//               <span>Scan History</span>
//               <span>/</span>
//               <span className="font-medium text-gray-900">Scan Results</span>
//             </button>
//           </div>

//           {/* Header */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 Scan Results
//               </h1>
//               <p className="text-sm sm:text-base text-gray-600 mt-1">
//                 Detailed analysis of your crop health assessment
//               </p>
//             </div>
//             <div className="flex gap-2 w-full sm:w-auto">
//               <button
//                 onClick={handleExport}
//                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 Export Report
//               </button>
//             </div>
//           </div>

//           <div
//             ref={reportRef}
//             className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//           >
//             {/* Left Column - Image and Status */}
//             <div className="lg:col-span-1 space-y-6">
//               {/* Scanned Image */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 border-b border-gray-200">
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     Scanned Image
//                   </h2>
//                 </div>
//                 <div className="p-4">
//                   <img
//                     src={
//                       scanDetails.imageUrl ||
//                       "https://via.placeholder.com/400x300?text=No+Image"
//                     }
//                     alt="Scan"
//                     className="w-full h-48 sm:h-64 object-cover rounded-lg"
//                     onError={(e) => {
//                       e.target.src =
//                         "https://via.placeholder.com/400x300?text=No+Image";
//                     }}
//                   />
//                   <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
//                     <div>
//                       <div className="font-medium text-gray-900">
//                         Scan Date:
//                       </div>
//                       <div>{dateTime.date}</div>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">
//                         Scan Time:
//                       </div>
//                       <div>{dateTime.time}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Scan Status */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 border-b border-gray-200">
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     Scan Status
//                   </h2>
//                 </div>
//                 <div className="p-4">
//                   {/* Status Badge */}
//                   <div
//                     className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusInfo.badgeBg} border ${statusInfo.borderColor} mb-4`}
//                   >
//                     <span className="text-xl">{statusInfo.icon}</span>
//                     <span className={`font-semibold ${statusInfo.color}`}>
//                       {statusInfo.label}
//                     </span>
//                   </div>

//                   {/* Disease Info */}
//                   <div className="mb-4">
//                     <div className="text-sm text-gray-600 mb-1">
//                       Disease Identified:
//                     </div>
//                     <div className={`text-lg font-bold ${statusInfo.color}`}>
//                       {scanDetails.prediction}
//                     </div>
//                   </div>

//                   {/* Confidence Level */}
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">Confidence Level</span>
//                       <span className="font-semibold text-gray-900">
//                         {confidencePercentage}%
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-orange-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${confidencePercentage}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Farm Information */}
//               {farmDetails && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                   <div className="p-4 border-b border-gray-200">
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       Farm Information
//                     </h2>
//                   </div>
//                   <div className="p-4 space-y-3">
//                     <div className="flex items-start gap-3">
//                       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
//                         <svg
//                           className="w-5 h-5 text-gray-600"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//                           />
//                         </svg>
//                       </div>
//                       <div className="flex-1">
//                         <div className="text-xs text-gray-500">Farm Name</div>
//                         <div className="font-medium text-gray-900">
//                           {farmDetails.farmName}
//                         </div>
//                       </div>
//                     </div>
//                     {farmerDetails && (
//                       <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
//                         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
//                           <svg
//                             className="w-5 h-5 text-gray-600"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                             />
//                           </svg>
//                         </div>
//                         <div className="flex-1">
//                           <div className="text-xs text-gray-500">Farmer</div>
//                           <div className="font-medium text-gray-900">
//                             {farmerDetails.name || scanDetails.idNumber}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Column - Treatment */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
//                 <div className="p-4 border-b border-gray-200 bg-green-50">
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="w-5 h-5 text-green-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       Suggested Treatment
//                     </h2>
//                   </div>
//                 </div>
//                 <div className="p-4 sm:p-6">
//                   <div className="mb-4">
//                     <h3 className="font-semibold text-gray-900 mb-2">
//                       Immediate Action Required:
//                     </h3>
//                     <p className="text-sm text-gray-700 mb-4">
//                       {apiSuggestions.length > 0
//                         ? apiSuggestions[0]
//                         : treatmentSuggestions[0]}
//                     </p>
//                   </div>

//                   <ul className="space-y-3">
//                     {(apiSuggestions.length > 0
//                       ? apiSuggestions.slice(1)
//                       : treatmentSuggestions.slice(1)
//                     ).map((suggestion, idx) => (
//                       <li key={idx} className="flex items-start gap-3 text-sm">
//                         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
//                           <svg
//                             className="w-4 h-4 text-green-600"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         </div>
//                         <span className="text-gray-700 flex-1">
//                           {suggestion}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>

//                   {statusInfo.status === "disease-detected" && (
//                     <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                       <div className="flex gap-2">
//                         <svg
//                           className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-yellow-800">
//                             Treatment should begin within 24 hours
//                           </p>
//                           <p className="text-xs text-yellow-700 mt-1">
//                             Early intervention is crucial for preventing further
//                             spread
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <FooterMain />
//     </div>
//   );
// }
