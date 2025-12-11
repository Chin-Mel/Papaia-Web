import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import FooterMain from "../components/Footer/Footer";
import HeaderMain from "../components/Header/HeaderMain";
import { ArrowLeft } from "lucide-react";
import UserAvatar from "../components/UserAvatar";

const API_BASE = "https://papaiaapi.onrender.com/api/owner";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

export default function ScanDetailsPage() {
  const { farmId, scanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get pre-fetched data from navigation state
  const preFetchedData = location.state?.scanData;
  const preFetchedFarm = location.state?.farmData;
  const preFetchedFarmer = location.state?.farmerData;

  const [scanDetails, setScanDetails] = useState(preFetchedData || null);
  const [farmDetails, setFarmDetails] = useState(preFetchedFarm || null);
  const [farmerDetails, setFarmerDetails] = useState(preFetchedFarmer || null);
  const [isLoading, setIsLoading] = useState(!preFetchedData);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in", { replace: true });
      return;
    }

    // Use pre-fetched data from navigation state
    if (preFetchedData && preFetchedFarm) {
      const normalizedScan = {
        ...preFetchedData,
        prediction:
          preFetchedData.result || preFetchedData.prediction || "Unknown",
        confidence: preFetchedData.confidence || 0,
        imageUrl: preFetchedData.imageUrl || "",
        timestamp: preFetchedData.timestamp || new Date().toISOString(),
        suggestions: preFetchedData.suggestions || "",
        farmId: preFetchedData.farmId || farmId,
        idNumber: preFetchedData.idNumber || "Unknown",
        profilePicture: preFetchedData.profilePicture || null,
        farmerName: preFetchedData.farmerName || null,
      };

      setScanDetails(normalizedScan);
      setFarmDetails(preFetchedFarm);
      setIsLoading(false);
      return;
    }

    // Fallback: redirect to scan history if no data provided
    navigate("/scan-history", { replace: true });
  }, [scanId, farmId, navigate, preFetchedData, preFetchedFarm]);

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

        const monthIndex = parseInt(month) - 1;
        const monthName = monthNames[monthIndex] || month;

        return {
          date: `${monthName} ${parseInt(day)}, ${year}`,
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
    } catch {
      return { date: "Unknown Date", time: "Unknown Time" };
    }
  };

  const getFarmerFullName = (farmer) => {
    if (!farmer) return null;

    let fullName = "";
    if (farmer.firstname) fullName += farmer.firstname;
    if (farmer.middlename) fullName += ` ${farmer.middlename}`;
    if (farmer.lastname) fullName += ` ${farmer.lastname}`;
    if (farmer.suffix) fullName += ` ${farmer.suffix}`;

    return fullName.trim() || farmer.fullName || farmer.name || null;
  };

  const parseSuggestions = (suggestions) => {
    if (!suggestions) return [];
    return suggestions
      .split("\n")
      .map((line) => line.replace(/^\*\s*/, "").trim())
      .filter((line) => line.length > 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <FooterMain />
      </div>
    );
  }

  if (!scanDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderMain />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="text-gray-500 text-lg">Scan not found</div>
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
  const apiSuggestions = parseSuggestions(scanDetails.suggestions);
  const confidencePercentage = Math.min(
    100,
    Math.max(0, Math.round(scanDetails.confidence * 100 || 0))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8">
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
                  loading="lazy"
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

          <div className="lg:col-span-2 space-y-6">
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

                  <div className="flex-1">
                    <div className="text-sm text-blue-600 font-semibold mb-2">
                      AI Verified
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {confidencePercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {farmDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-white border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">
                    Farm Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 flex-shrink-0">
                        <UserAvatar
                          name={
                            scanDetails.farmerName ||
                            scanDetails.idNumber ||
                            "Farmer"
                          }
                          profileImageUrl={scanDetails.profilePicture}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {scanDetails.farmerName || scanDetails.idNumber}
                        </div>
                        <div className="text-sm text-gray-600">Farmer</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Farm Name
                      </div>
                      <div className="font-semibold text-gray-900">
                        {farmDetails.farmName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-white border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  Suggested Treatment
                </h2>
              </div>
              <div className="p-6">
                <div className="bg-green-50 rounded-lg p-5">
                  <ul className="space-y-2 list-disc list-inside">
                    {(apiSuggestions.length > 0
                      ? apiSuggestions
                      : ["No treatment suggestions available."]
                    ).map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterMain />
    </div>
  );
}
