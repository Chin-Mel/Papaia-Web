import { useState, useEffect, useRef } from "react"; // 1. Import useRef to target the content for export
import { Link } from "react-router-dom";
import jsPDF from "jspdf"; // 2. Import jsPDF for creating the PDF
import html2canvas from "html2canvas"; // 3. Import html2canvas to capture the content as an image
import { jwtDecode } from "jwt-decode";

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
  // 4. Create a ref that will be attached to the report's main container

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id || decoded._id || decoded.userId; // depends on your backend payload
  }

  const [scanDetails, setScanDetails] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchScanDetails = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/scan/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch scan details");

        const data = await res.json();
        setScanDetails(data); // store real scan data
      } catch (err) {
        console.error("Error fetching scan details:", err);
      }
    };

    fetchScanDetails();
  }, [userId, token]);

  const reportRef = useRef(null);

  // 5. Function to handle the PDF export
  const handleExportReport = () => {
    const input = reportRef.current;
    if (!input) return;

    // Use html2canvas to take a "screenshot" of the report content
    html2canvas(input, { scale: 2 }) // Using a higher scale for better quality
      .then((canvas) => {
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
        pdf.save("papaia-scan-report.pdf"); // Triggers the download
      });
  };

  // 6. Function to handle sharing results using the Web Share API
  const handleShareResults = async () => {
    const shareData = {
      title: "Papaia Scan Results",
      text: "Check out the disease scan results for my papaya crop!",
      url: window.location.href, // This will share the link to the current page
    };

    // Check if the browser supports the Web Share API
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for desktop browsers or those that don't support the API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

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
            to="/scan-history-details"
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
              {/* UPDATED: Added onClick handler to the button */}
              <button
                onClick={handleExportReport}
                className="flex items-center space-x-2 px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-[8px] hover:bg-gray-200 h-10"
              >
                <img src={DownloadIcon} alt="Export" className="w-4 h-4" />
                <span className="font-poppins text-[16px]">Export Report</span>
              </button>
              {/* UPDATED: Added onClick handler to the button */}
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

        {/* 7. UPDATED: Added the 'ref' to this container to target it for PDF export */}
        <div ref={reportRef} className="flex gap-[24px] ml-[32px] mr-[32px]">
          {/* Left Column - Scanned Image */}
          <div className="w-[389px]">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[25px]">
              <h3 className="text-[18px] font-poppins font-semibold text-[#1F2937] mb-4">
                Scanned Image
              </h3>
              <div className="bg-[#F3F4F6] rounded-[8px] overflow-hidden mb-4 w-[339px] h-[339px] relative">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/429835794a24a5a5283ec63a12ba52cff82154ab?width=960"
                  alt="Scanned crop leaf"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#4B5563] font-poppins leading-[20px]">
                    Scan Date:
                  </span>
                  <span className="text-[14px] font-medium text-[#1F2937] font-poppins leading-[20px]">
                    March 15, 2024
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#4B5563] font-poppins leading-[20px]">
                    Scan Time:
                  </span>
                  <span className="text-[14px] font-medium text-[#1F2937] font-poppins leading-[20px]">
                    2:34 PM
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
                <div className="flex items-center space-x-1 bg-[#FEE2E2] text-[#991B1B] px-4 py-1 rounded-full h-7">
                  <img src={AlertIcon} alt="Alert" className="w-4 h-4" />
                  <span className="text-[14px] font-medium font-poppins">
                    Disease Detected
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[197px]">
                <div>
                  <label className="text-[14px] text-[#4B5563] font-poppins block mb-1">
                    Disease Identified
                  </label>
                  <div className="text-[18px] font-semibold text-[#DC2626] font-poppins leading-[28px]">
                    PRSV (Papaya ringspot virus)
                  </div>
                </div>
                <div>
                  <label className="text-[14px] text-[#4B5563] font-poppins block mb-1">
                    Confidence Level
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 w-[323px]">
                      <div className="bg-[#EF4444] h-2 rounded-full w-[288px]"></div>
                    </div>
                    <span className="text-[14px] font-medium text-[#1F2937] font-poppins leading-[20px]">
                      89%
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
                    src="https://api.builder.io/api/v1/image/assets/TEMP/1c4cec69a5441a427f347e086908c5cade1a08fe?width=96"
                    alt="John Martinez"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-[#1F2937] font-poppins text-[16px] leading-[24px]">
                      John Martinez
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
                    Green Valley Organic Farm
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[25px] h-[334px]">
              <div className="flex items-center space-x-2 mb-4">
                <img src={TreatmentIcon} alt="Treatment" className="w-4 h-4" />
                <h3 className="text-[18px] font-poppins font-semibold text-[#1F2937]">
                  Suggested Treatment
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-[#F0FDF4] rounded-[8px] p-4 w-[922px] h-[168px]">
                  <h4 className="font-semibold text-[#1F2937] font-poppins text-[16px] mb-3">
                    Immediate Action Required
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <img
                        src={CheckCircleIcon}
                        alt="Check"
                        className="w-3 h-3 mt-1.5 flex-shrink-0"
                      />
                      <span className="text-[14px] text-[#374151] font-poppins">
                        Apply copper-based fungicide (Copper sulfate)
                        immediately
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <img
                        src={CheckCircleIcon}
                        alt="Check"
                        className="w-3 h-3 mt-1.5 flex-shrink-0"
                      />
                      <span className="text-[14px] text-[#374151] font-poppins">
                        Remove and destroy all infected plant parts
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <img
                        src={CheckCircleIcon}
                        alt="Check"
                        className="w-3 h-3 mt-1.5 flex-shrink-0"
                      />
                      <span className="text-[14px] text-[#374151] font-poppins">
                        Improve air circulation between plants
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <img
                        src={CheckCircleIcon}
                        alt="Check"
                        className="w-3 h-3 mt-1.5 flex-shrink-0"
                      />
                      <span className="text-[14px] text-[#374151] font-poppins">
                        Reduce overhead watering to minimize moisture
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#FEFCE8] rounded-[8px] p-4 w-[922px] h-[56px]">
                  <div className="flex items-center space-x-2">
                    <img src={ClockIcon} alt="Timeline" className="w-4 h-4" />
                    <span className="text-[14px] font-medium text-[#854D0E] font-poppins leading-[20px]">
                      Treatment should begin within 24 hours
                    </span>
                  </div>
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
