import { useState } from "react";
import {
  Plus,
  Users,
  Leaf,
  ScanLine,
  CheckCircle,
  MapPin,
  TrendingUp,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import AddFarmModal from "../components/AddFarmModal";

export default function DashboardPage() {
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);

  // Example data for activities
  const activities = [
    {
      type: "New Farm Registered",
      icon: "➕",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "New farm registered",
      description: "Green Valley Farm added to system",
      time: "2 hours ago",
      bgColor: "bg-green-50",
    },
    {
      type: "Crop Scan Completed",
      icon: "📊",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Crop scan completed",
      description: "Sunrise Orchards - Health check",
      time: "4 hours ago",
      bgColor: "bg-blue-50",
    },
    {
      type: "Disease Detected",
      icon: "⚠️",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Disease Detected",
      description: "Green Valley Farm - Check",
      time: "8 hours ago",
      bgColor: "bg-yellow-50",
    },
    {
      type: "New Farmer Onboarded",
      icon: "👤",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "New farmer onboarded",
      description: "John Smith joined the platform",
      time: "1 day ago",
      bgColor: "bg-green-50",
    },
    {
      type: "Monthly Report Generated",
      icon: "📋",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Monthly report generated",
      description: "Productivity analytics ready",
      time: "2 days ago",
      bgColor: "bg-purple-50",
    },
  ];

  const farms = [
    {
      name: "Green Valley Farm",
      desc: "Organic vegetables and herbs production",
      location: "California, USA",
      health: 98,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?vegetables,farm",
    },
    {
      name: "Sunrise Orchards",
      desc: "Apple and citrus fruit cultivation",
      location: "Oregon, USA",
      health: 95,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?wheat,field",
    },
    {
      name: "Tech Greenhouse",
      desc: "Hydroponic lettuce and tomatoes",
      location: "Texas, USA",
      health: 87,
      status: "Monitoring",
      img: "https://source.unsplash.com/400x300/?greenhouse,hydroponic",
    },
    {
      name: "Lavender Fields",
      desc: "Essential oils and aromatherapy herbs",
      location: "Washington, USA",
      health: 82,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?lavender,flowers",
    },
    {
      name: "Golden Corn Fields",
      desc: "Sweet corn and grain production",
      location: "Iowa, USA",
      health: 96,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?corn,plants",
    },
    {
      name: "Heritage Vineyard",
      desc: "Premium wine grapes cultivation",
      location: "Napa Valley, CA",
      health: 94,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?vineyard,grapes",
    },
  ];

  const handleAddFarm = () => {
    setShowAddFarmModal(true);
  };

  const handleCloseModal = () => {
    setShowAddFarmModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Left Column - Recent Activities */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Recent Activities
              </h2>
              <div className="space-y-3">
                {activities.map((act, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${act.bgColor} border border-gray-100`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${act.iconBg} flex items-center justify-center text-sm`}
                      >
                        {act.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">
                          {act.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {act.description}
                        </p>
                        <span className="text-xs text-gray-500 mt-1">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Overview & My Farms */}
          <div className="flex-1">
            {/* Dashboard Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">1,247</h3>
                  <p className="text-sm text-gray-600 mb-1">All Farmers</p>
                  <span className="text-xs text-green-600 font-medium">
                    +12% from last month
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-yellow-600" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">892</h3>
                  <p className="text-sm text-gray-600 mb-1">All Farms</p>
                  <span className="text-xs text-green-600 font-medium">
                    +8% from last month
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ScanLine className="w-5 h-5 text-blue-600" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">156</h3>
                  <p className="text-sm text-gray-600 mb-1">Today's Scans</p>
                  <span className="text-xs text-green-600 font-medium">
                    +24% from yesterday
                  </span>
                </div>
              </div>
            </div>

            {/* My Farms */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">My Farms</h2>
                <button
                  onClick={handleAddFarm}
                  className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Plus size={16} />
                  Add Farm
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {farms.map((farm, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={farm.img}
                        alt={farm.name}
                        className="w-full h-40 object-cover"
                      />
                      <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-medium ${
                          farm.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {farm.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {farm.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{farm.desc}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin size={12} />
                        {farm.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf size={12} className="text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {farm.health}% Health
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Farm Modal */}
      {showAddFarmModal && <AddFarmModal onClose={handleCloseModal} />}

      <Footer />
    </div>
  );
}
