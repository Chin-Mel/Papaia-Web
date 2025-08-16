import {
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";

export default function ScanDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="text-sm text-gray-600">
              <span className="hover:text-gray-800 cursor-pointer">
                Scan History
              </span>
              <span className="mx-2">></span>
              <span className="text-gray-800">Scan Results</span>
            </nav>
          </div>

          {/* Page Title and Action Buttons */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Scan Results
              </h1>
              <p className="text-gray-600">
                Detailed analysis of your crop health assessment
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Results
              </button>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Scanned Image */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Scanned Image
                </h2>
                <div className="relative">
                  <img
                    src="https://source.unsplash.com/600x400/?leaf,disease,yellow-spots"
                    alt="Diseased leaf with yellow spots"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
                <div className="flex justify-end mt-4 space-x-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Scan Date: March 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Scan Time: 2:34 PM</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Scan Information */}
              <div className="space-y-6">
                {/* Scan Status Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Scan Status
                    </h2>
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Disease Detected
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Disease Identified
                      </label>
                      <p className="text-red-600 font-bold text-lg">
                        PRSV (Papaya ringspot virus)
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Confidence Level
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full"
                            style={{ width: "89%" }}
                          ></div>
                        </div>
                        <span className="text-gray-800 font-medium">89%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farm Information Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Farm Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://source.unsplash.com/40x40/?man,portrait"
                        alt="John Martinez"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          John Martinez
                        </p>
                        <p className="text-gray-600 text-sm">Farmer</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">
                        Farm Name
                      </label>
                      <p className="font-bold text-gray-800">
                        Green Valley Organic Farm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Suggested Treatment Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Suggested Treatment
                  </h2>
                  <div className="space-y-4">
                    {/* Immediate Action Required */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-bold text-gray-800 mb-3">
                        Immediate Action Required
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            Apply copper-based fungicide (Copper sulfate)
                            immediately
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            Remove and destroy all infected plant parts
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            Improve air circulation between plants
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            Reduce overhead watering to minimize moisture
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Treatment Timeline */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="text-gray-800 font-medium">
                          Treatment should begin within 24 hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
