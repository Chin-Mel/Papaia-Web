import { useState } from "react";
import {
  Download,
  ChevronDown,
  User,
  Calendar,
  Clock,
  Eye,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";

export default function ScanHistoryPage() {
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [farmerFilter, setFarmerFilter] = useState("All Farmers");
  const [farmFilter, setFarmFilter] = useState("All Farms");

  // Mock data for scan entries
  const scanEntries = [
    {
      id: 1,
      farmName: "Green Field Farm",
      status: "Healthy",
      statusColor: "green",
      cropImage: "https://source.unsplash.com/80x80/?tomatoes,green",
      farmer: "John Smith",
      date: "Dec 15, 2024",
      time: "2:30 PM",
      details: null,
    },
    {
      id: 2,
      farmName: "North Willow Farms",
      status: "Disease Detected",
      statusColor: "red",
      cropImage: "https://source.unsplash.com/80x80/?corn,cob",
      farmer: "Maria Garcia",
      date: "Dec 14, 2024",
      time: "10:15 AM",
      details: "Ringspot virus detected - immediate treatment recommended",
    },
    {
      id: 3,
      farmName: "West Lagoon Farm",
      status: "Needs Attention",
      statusColor: "orange",
      cropImage: "https://source.unsplash.com/80x80/?wheat,field",
      farmer: "David Chen",
      date: "Dec 13, 2024",
      time: "4:45 PM",
      details: "Powdery Mildew - Monitor closely",
    },
    {
      id: 4,
      farmName: "Coast Farm",
      status: "Healthy",
      statusColor: "green",
      cropImage: "https://source.unsplash.com/80x80/?succulent,green",
      farmer: "John Smith",
      date: "Dec 12, 2024",
      time: "9:20 AM",
      details: null,
    },
    {
      id: 5,
      farmName: "Coast Farm",
      status: "Healthy",
      statusColor: "green",
      cropImage: "https://source.unsplash.com/80x80/?succulent,green",
      farmer: "John Smith",
      date: "Dec 12, 2024",
      time: "9:20 AM",
      details: null,
    },
  ];

  const getStatusBadgeColor = (status, statusColor) => {
    switch (statusColor) {
      case "green":
        return "bg-green-100 text-green-700";
      case "red":
        return "bg-red-100 text-red-700";
      case "orange":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getViewDetailsButtonColor = (statusColor) => {
    switch (statusColor) {
      case "green":
        return "text-green-600 hover:text-green-700";
      case "red":
        return "text-red-600 hover:text-red-700";
      case "orange":
        return "text-orange-600 hover:text-orange-700";
      default:
        return "text-gray-600 hover:text-gray-700";
    }
  };

  const getDetailsTextColor = (statusColor) => {
    switch (statusColor) {
      case "red":
        return "text-red-600";
      case "orange":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Page Title and Description */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Scan History
              </h1>
              <p className="text-gray-600">
                Track all crop health scans and analysis results of all farms
              </p>
            </div>

            {/* Filter and Export Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Date Range Filter */}
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent appearance-none pr-10 bg-white"
                  >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent appearance-none pr-10 bg-white"
                  >
                    <option>All Status</option>
                    <option>Healthy</option>
                    <option>Disease Detected</option>
                    <option>Needs Attention</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Farmer Filter */}
                <div className="relative">
                  <select
                    value={farmerFilter}
                    onChange={(e) => setFarmerFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent appearance-none pr-10 bg-white"
                  >
                    <option>All Farmers</option>
                    <option>John Smith</option>
                    <option>Maria Garcia</option>
                    <option>David Chen</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Farm Filter */}
                <div className="relative">
                  <select
                    value={farmFilter}
                    onChange={(e) => setFarmFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent appearance-none pr-10 bg-white"
                  >
                    <option>All Farms</option>
                    <option>Green Field Farm</option>
                    <option>North Willow Farms</option>
                    <option>West Lagoon Farm</option>
                    <option>Coast Farm</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Export Button */}
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Scan Entries List */}
            <div className="space-y-4">
              {scanEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Crop Image */}
                    <img
                      src={entry.cropImage}
                      alt={`${entry.farmName} crop`}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Farm Name and Status */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {entry.farmName}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            entry.status,
                            entry.statusColor
                          )}`}
                        >
                          {entry.status}
                        </span>
                      </div>

                      {/* Farmer and Date/Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entry.farmer}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {entry.time}
                        </div>
                      </div>

                      {/* Additional Details */}
                      {entry.details && (
                        <p
                          className={`text-sm ${getDetailsTextColor(
                            entry.statusColor
                          )}`}
                        >
                          {entry.details}
                        </p>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button
                      className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${getViewDetailsButtonColor(
                        entry.statusColor
                      )} border-current hover:bg-opacity-10`}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing 1 to 5 of 1,247 results
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-orange-500 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                  3
                </button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
