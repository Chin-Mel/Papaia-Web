import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import FooterMain from "../components/Footer/FooterMain";
import HeaderMain from "../components/Header/HeaderMain";

import ChevronRightIcon from "../assets/chevron-right-icon.png";
import DownloadIcon from "../assets/download-icon.png";
import ShareIcon from "../assets/share-icon.png";
import AlertIcon from "../assets/alert-icon.png";
import TreatmentIcon from "../assets/treatment-icon.png";
import CheckCircleIcon from "../assets/check-circle-icon.png";
import ClockIcon from "../assets/clock-icon.png";

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

        // Find the specific scan to get farmId
        const specificScan = Array.isArray(allScans)
          ? allScans.find((scan) => scan.id === scanId)
          : null;

        if (!specificScan || !specificScan.farmId) {
          setError("Scan not found");
          setLoading(false);
          return;
        }

        // Now fetch the detailed prediction using the new API
        const detailsRes = await fetch(
          `https://papaiaapi.onrender.com/api/owner/predictions-history/${specificScan.farmId}/${scanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!detailsRes.ok) {
          if (detailsRes.status === 404) {
            throw new Error("Prediction not found");
          }
          throw new Error("Failed to fetch prediction details");
        }

        const detailsData = await detailsRes.json();

        // The API returns an array with one item
        const detailedScan =
          Array.isArray(detailsData) && detailsData.length > 0
            ? detailsData[0]
            : null;

        if (!detailedScan) {
          setError("Prediction details not found");
          setLoading(false);
          return;
        }

        setScanDetails(detailedScan);

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
              (f) => f.id === detailedScan.farmId
            );
            setFarmDetails(farm);
          }
        }

        // Fetch farmer details if we have idNumber
        if (detailedScan.idNumber && detailedScan.farmId) {
          try {
            const farmersRes = await fetch(
              `https://papaiaapi.onrender.com/api/owner/farmers/${detailedScan.farmId}`,
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
                  (f) => f.idNumber === detailedScan.idNumber
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
  }, [scanId, token, navigate]);

  // Helper functions
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
      const date = new Date(timestamp);
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

    // Default suggestions for healthy plants
    if (predLower === "healthy") {
      return [
        "Continue regular monitoring of plant health",
        "Maintain proper watering schedule",
        "Ensure adequate sunlight and air circulation",
        "Apply balanced fertilizer as needed",
      ];
    }

    // Specific suggestions based on disease type
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

    // Generic disease treatment
    return [
      "Consult with agricultural extension officer for specific treatment",
      "Remove and destroy infected plant parts",
      "Apply appropriate fungicide or treatment",
      "Monitor plant health closely",
      "Improve growing conditions",
    ];
  };

  const handleExportReport = () => {
    const input = reportRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const pdfHeight = canvasHeight / ratio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("papaia-scan-report.pdf");
    });
  };

  const handleShareResults = async () => {
    const shareData = {
      title: "Papaia Scan Results",
      text: `Check out the disease scan results: ${
        scanDetails?.prediction || "Scan Analysis"
      }`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderMain />
        <main className="px-[39px] mt-16 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading scan details...</div>
          </div>
        </main>
        <FooterMain />
      </div>
    );
  }

  if (error || !scanDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderMain />
        <main className="px-[39px] mt-16 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">{error || "Scan not found"}</div>
          </div>
        </main>
        <FooterMain />
      </div>
    );
  }

  const statusInfo = getStatusInfo(scanDetails.prediction);
  const dateTime = formatDateTime(scanDetails.timestamp);
  const treatmentSuggestions = getTreatmentSuggestions(scanDetails.prediction);
  // Confidence is already a percentage (0-100) from the new API
  const confidencePercentage = Math.round(scanDetails.confidence || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderMain />

      <main className="px-[39px] mt-16 py-8">
        <nav className="flex items-center space-x-2 text-sm mb-6 pl-[63px]">
          <Link
            to="/scan-history-log"
            className="text-[#6B7280] font-poppins text-[14px] leading-[20px] hover:underline"
          >
            Scan History
          </Link>
          <img src={ChevronRightIcon} alt=">" className="w-2 h-3" />
          <Link
            to={`/scan-history-details/${scanId}`}
            className="text-[#1F2937] font-poppins text-[14px] font-medium leading-[20px] hover:underline"
          >
            Scan Results
          </Link>
        </nav>

        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[25px] mb-6 ml-[32px] mr-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-poppins font-bold text-[#1F2937] leading-[32px] mb-[7px]">
                Scan Results
              </h1>
              <p className="text-[#4B5563] font-poppins text-[16px] leading-[24px]">
                Detailed analysis of your crop health assessment
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExportReport}
                className="flex items-center space-x-2 px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-[8px] hover:bg-gray-200 h-10"
              >
                <img src={DownloadIcon} alt="Export" className="w-4 h-4" />
                <span className="font-poppins text-[16px]">Export Report</span>
              </button>
              <button
                onClick={handleShareResults}
                className="flex items-center space-x-2 px-4 py-2 bg-[#FF8C42] text-white rounded-[8px] hover:bg-orange-600 h-10"
              >
                <img src={ShareIcon} alt="Share" className="w-4 h-4" />
                <span className="font-poppins text-[16px]">Share Results</span>
              </button>
            </div>
          </div>
        </div>

        <div ref={reportRef} className="flex gap-[24px] ml-[32px] mr-[32px]">
          {/* Left Column - Scanned Image */}
          <div className="w-[389px]">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[25px]">
              <h3 className="text-[18px] font-poppins font-semibold text-[#1F2937] mb-4">
                Scanned Image
              </h3>
              <div className="bg-[#F3F4F6] rounded-[8px] overflow-hidden mb-4 w-[339px] h-[339px] relative">
                <img
                  src={
                    scanDetails.imageUrl ||
                    "https://via.placeholder.com/339x339?text=No+Image"
                  }
                  alt="Scanned crop leaf"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/339x339?text=No+Image";
                  }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#4B5563] font-poppins leading-[20px]">
                    Scan Date:
                  </span>
                  <span className="text-[14px] font-medium text-[#1F2937] font-poppins leading-[20px]">
                    {dateTime.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#4B5563] font-poppins leading-[20px]">
                    Scan Time:
                  </span>
                  <span className="text-[14px] font-medium text-[#1F2937] font-poppins leading-[20px]">
                    {dateTime.time}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="flex-1 space-y-6 w-[973px]">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[25px] h-[146px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-poppins font-semibold text-[#1F2937] leading-[28px]">
                  Scan Status
                </h3>
                <div
                  className={`flex items-center space-x-1 ${statusInfo.bgColor} ${statusInfo.color} px-4 py-1 rounded-full h-7`}
                >
                  <img src={AlertIcon} alt="Status" className="w-4 h-4" />
                  <span className="text-[14px] font-medium font-poppins">
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[197px]">
                <div>
                  <label className="text-[14px] text-[#4B5563] font-poppins block mb-1">
                    Disease Identified
                  </label>
                  <div
                    className={`text-[18px] font-semibold font-poppins leading-[28px] ${statusInfo.color}`}
                  >
                    {scanDetails.prediction || "Unknown"}
                  </div>
                </div>
                <div>
                  <label className="text-[14px] text-[#4B5563] font-poppins block mb-1">
                    Confidence Level
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 w-[323px]">
                      <div
                        className={`h-2 rounded-full ${
                          statusInfo.status === "healthy"
                            ? "bg-green-500"
                            : statusInfo.status === "disease-detected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                        style={{
                          width: `${Math.min(100, confidencePercentage)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-[14px] font-medium text-[#1F2937] font-poppins leading-[20px]">
                      {confidencePercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[25px] h-[162px]">
              <h3 className="text-[18px] font-poppins font-semibold text-[#1F2937] mb-4">
                Farm Information
              </h3>
              <div className="grid grid-cols-2 gap-[207px]">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      farmerDetails?.profilePicture ||
                      "https://via.placeholder.com/48x48?text=User"
                    }
                    alt={
                      farmerDetails
                        ? `${farmerDetails.firstname} ${farmerDetails.lastname}`
                        : "Farmer"
                    }
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/48x48?text=User";
                    }}
                  />
                  <div>
                    <div className="font-semibold text-[#1F2937] font-poppins text-[16px] leading-[24px]">
                      {farmerDetails
                        ? `${farmerDetails.firstname} ${farmerDetails.lastname}`
                        : scanDetails.idNumber || "Unknown Farmer"}
                    </div>
                    <div className="text-[14px] text-[#4B5563] font-poppins leading-[20px]">
                      Farmer
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[14px] text-[#4B5563] font-poppins block mb-1">
                    Farm Name
                  </label>
                  <div className="font-semibold text-[#1F2937] font-poppins text-[16px] leading-[24px]">
                    {farmDetails?.farmName || "Unknown Farm"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[25px]">
              <div className="flex items-center space-x-2 mb-4">
                <img src={TreatmentIcon} alt="Treatment" className="w-4 h-4" />
                <h3 className="text-[18px] font-poppins font-semibold text-[#1F2937]">
                  Suggested Treatment
                </h3>
              </div>

              <div className="space-y-4">
                <div
                  className={`rounded-[8px] p-4 w-[922px] ${
                    statusInfo.status === "healthy"
                      ? "bg-[#F0FDF4]"
                      : statusInfo.status === "disease-detected"
                      ? "bg-[#FEF2F2]"
                      : "bg-[#FFFBEB]"
                  }`}
                >
                  <h4 className="font-semibold text-[#1F2937] font-poppins text-[16px] mb-3">
                    {statusInfo.status === "healthy"
                      ? "Maintenance Recommendations"
                      : "Immediate Action Required"}
                  </h4>
                  <ul className="space-y-2">
                    {treatmentSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <img
                          src={CheckCircleIcon}
                          alt="Check"
                          className="w-3 h-3 mt-1.5 flex-shrink-0"
                        />
                        <span className="text-[14px] text-[#374151] font-poppins">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`rounded-[8px] p-4 w-[922px] ${
                    statusInfo.status === "healthy"
                      ? "bg-[#ECFDF5]"
                      : "bg-[#FEFCE8]"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <img src={ClockIcon} alt="Timeline" className="w-4 h-4" />
                    <span
                      className="text-[14px] font-medium font-poppins leading-[20px]"
                      style={{
                        color:
                          statusInfo.status === "healthy"
                            ? "#065F46"
                            : "#854D0E",
                      }}
                    >
                      {statusInfo.status === "healthy"
                        ? "Continue regular monitoring and maintenance"
                        : "Treatment should begin within 24 hours"}
                    </span>
                  </div>
                </div>

                {/* Show API suggestions if available */}
                {scanDetails.suggestions && (
                  <div className="bg-[#F8FAFC] rounded-[8px] p-4 w-[922px]">
                    <h4 className="font-semibold text-[#1F2937] font-poppins text-[16px] mb-3">
                      Additional Recommendations from Analysis
                    </h4>
                    <div className="text-[14px] text-[#374151] font-poppins">
                      <ul className="space-y-2">
                        {scanDetails.suggestions
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, index) => {
                            // Remove leading asterisks and trim
                            const cleanLine = line.replace(/^\*\s*/, "").trim();
                            if (!cleanLine) return null;
                            return (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <img
                                  src={CheckCircleIcon}
                                  alt="Check"
                                  className="w-3 h-3 mt-1.5 flex-shrink-0"
                                />
                                <span>{cleanLine}</span>
                              </li>
                            );
                          })}
                      </ul>
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
