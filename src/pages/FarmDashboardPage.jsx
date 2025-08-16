import { useState } from "react";
import {
  FileText,
  Trash2,
  Search,
  ChevronDown,
  Plus,
  Eye,
  Leaf,
  TrendingUp,
  MapPin,
  Edit3,
  User,
  Phone,
  Mail,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";

export default function FarmDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("Daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Mock data for recent scans
  const recentScans = [
    {
      id: 1,
      user: {
        name: "Regine Velasquez",
        avatar: "https://source.unsplash.com/40x40/?woman,1",
      },
      status: "Healthy",
      time: "2 hours ago",
      icon: "🟢",
    },
    {
      id: 2,
      user: {
        name: "Ann Curtis",
        avatar: "https://source.unsplash.com/40x40/?woman,2",
      },
      status: "Anthracnose Identified",
      time: "4 hours ago",
      icon: "🟠",
    },
    {
      id: 3,
      user: {
        name: "John Smith",
        avatar: "https://source.unsplash.com/40x40/?man,1",
      },
      status: "Healthy",
      time: "6 hours ago",
      icon: "🟢",
    },
    {
      id: 4,
      user: {
        name: "Maria Garcia",
        avatar: "https://source.unsplash.com/40x40/?woman,3",
      },
      status: "Anthracnose Identified",
      time: "1 day ago",
      icon: "🟠",
    },
  ];

  // Mock data for farm team
  const farmTeam = [
    {
      id: 1,
      name: "Jhong Hilario",
      avatar: "https://source.unsplash.com/40x40/?man,2",
      role: "Senior Farmer",
      farmerId: "FM-001",
      contact: {
        phone: "+63 912 345 6789",
        email: "jhong.hilario@email.com",
      },
      address: "Purok Saging, Garing, Consolacion, Cebu",
      status: "Active",
    },
    {
      id: 2,
      name: "Catriona Gray",
      avatar: "https://source.unsplash.com/40x40/?woman,4",
      role: "Aura Farmer",
      farmerId: "FM-002",
      contact: {
        phone: "+63 923 456 7890",
        email: "catriona.gray@email.com",
      },
      address: "Purok Mangga, Garing, Consolacion, Cebu",
      status: "Active",
    },
    {
      id: 3,
      name: "Pia Wurtzbach",
      avatar: "https://source.unsplash.com/40x40/?woman,5",
      role: "Junior Farmer",
      farmerId: "FM-003",
      contact: {
        phone: "+63 934 567 8901",
        email: "pia.wurtzbach@email.com",
      },
      address: "Purok Santol, Garing, Consolacion, Cebu",
      status: "Pending",
    },
    {
      id: 4,
      name: "Manny Pacquiao",
      avatar: "https://source.unsplash.com/40x40/?man,3",
      role: "Senior Farmer",
      farmerId: "FM-004",
      contact: {
        phone: "+63 945 678 9012",
        email: "manny.pacquiao@email.com",
      },
      address: "Purok Lansones, Garing, Consolacion, Cebu",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Lea Salonga",
      avatar: "https://source.unsplash.com/40x40/?woman,6",
      role: "Aura Farmer",
      farmerId: "FM-005",
      contact: {
        phone: "+63 956 789 0123",
        email: "lea.salonga@email.com",
      },
      address: "Purok Rambutan, Garing, Consolacion, Cebu",
      status: "Active",
    },
  ];

  const timeFilters = ["Daily", "Weekly", "Monthly", "Yearly"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-orange-600 bg-orange-100";
      case "Inactive":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Green Valley Farm
                  </h1>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Purok Saging, Garing, Consolacion, Cebu
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition-colors">
                  <FileText className="w-4 h-4" />
                  Export PDF
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Top Row - Analytics and Recent Scans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Farm Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Farm Analytics
              </h2>

              {/* Time Filters */}
              <div className="flex gap-2 mb-6">
                {timeFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeFilter === filter
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Graph Placeholder */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Weekly Plant Condition (Scan History Log)
                </h3>
                <div className="h-48 bg-white rounded border flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Line Graph Visualization
                    </p>
                    <p className="text-xs text-gray-400">
                      Y-axis: Leaf Health Score (0-100)
                    </p>
                    <p className="text-xs text-gray-400">
                      X-axis: Week (7 weeks ago - This Week)
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-green-600 font-semibold">156</p>
                  <p className="text-sm text-gray-600">Total Scans</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-600 font-semibold">89%</p>
                  <p className="text-sm text-gray-600">Health Score</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-600 font-semibold">12.5</p>
                  <p className="text-sm text-gray-600">Disease Score</p>
                </div>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Recent Scans
              </h2>
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={scan.user.avatar}
                      alt={scan.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{scan.status}</p>
                      <p className="text-sm text-gray-600">
                        {scan.user.name} • {scan.time}
                      </p>
                    </div>
                    <div className="text-2xl">{scan.icon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Farm Description
              </h2>
              <button className="px-3 py-1 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Description
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Green Valley Farm is a 500-acre sustainable agriculture operation
              dedicated to organic farming practices. Our farm specializes in
              crop rotation, integrated pest management, and water conservation
              techniques. We supply fresh, organic produce to local markets and
              restaurants, maintaining the highest standards of quality and
              environmental stewardship. Our commitment to sustainable
              agriculture ensures long-term soil health and biodiversity while
              providing nutritious food for our community.
            </p>
          </div>

          {/* Farm Team */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Farm Team</h2>
                <p className="text-gray-600">
                  Manage and track all registered farmers
                </p>
              </div>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Farmer
              </button>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent appearance-none pr-10"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Farmer Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Farmer
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Farmer ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Address
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      See Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {farmTeam.map((farmer) => (
                    <tr
                      key={farmer.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={farmer.avatar}
                            alt={farmer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {farmer.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {farmer.role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {farmer.farmerId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {farmer.contact.phone}
                          </p>
                          <p className="text-sm text-gray-700 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {farmer.contact.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {farmer.address}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            farmer.status
                          )}`}
                        >
                          {farmer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-green-600 hover:text-green-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
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
