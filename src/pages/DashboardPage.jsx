import { useState } from "react";
import { Plus, Users, Leaf, ScanLine, CheckCircle } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";

export default function DashboardPage() {
  // Example data for activities
  const activities = [
    {
      iconColor: "from-green-700 to-teal-500",
      title: "New farm registered",
      description: "Green Valley Farm added to system",
      time: "2 hours ago",
    },
    {
      iconColor: "from-blue-500 to-blue-400",
      title: "Crop scan completed",
      description: "Sunrise Orchards - Health check",
      time: "4 hours ago",
    },
    {
      iconColor: "from-yellow-500 to-orange-500",
      title: "Disease Detected",
      description: "Green Valley Farm - Check",
      time: "6 hours ago",
    },
    {
      iconColor: "from-green-500 to-teal-500",
      title: "New farmer onboarded",
      description: "John Smith joined the platform",
      time: "1 day ago",
    },
    {
      iconColor: "from-purple-500 to-pink-500",
      title: "Monthly report generated",
      description: "Productivity analytics ready",
      time: "2 days ago",
    },
  ];

  const farms = [
    {
      name: "Green Valley Farm",
      desc: "Organic vegetables and herbs production",
      location: "California, USA",
      health: 98,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?farm,green",
    },
    {
      name: "Sunrise Orchards",
      desc: "Apple and citrus fruit cultivation",
      location: "Oregon, USA",
      health: 95,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?farm,field",
    },
    {
      name: "Tech Greenhouse",
      desc: "Hydroponic lettuce and tomatoes",
      location: "Texas, USA",
      health: 87,
      status: "Monitoring",
      img: "https://source.unsplash.com/400x300/?greenhouse",
    },
    {
      name: "Lavender Fields",
      desc: "Essential oils and aromatherapy herbs",
      location: "Washington, USA",
      health: 82,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?lavender",
    },
    {
      name: "Golden Corn Fields",
      desc: "Sweet corn and grain production",
      location: "Iowa, USA",
      health: 95,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?corn",
    },
    {
      name: "Heritage Vineyard",
      desc: "Premium wine grapes cultivation",
      location: "Napa Valley, CA",
      health: 94,
      status: "Active",
      img: "https://source.unsplash.com/400x300/?vineyard",
    },
  ];

  return (
    <>
      <HeaderMain />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-72 p-4 bg-white shadow rounded-lg m-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Recent Activities
          </h2>
          <div className="space-y-3">
            {activities.map((act, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg shadow-sm"
              >
                <div
                  className={`rounded-full p-2 bg-gradient-to-r ${act.iconColor}`}
                >
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{act.title}</p>
                  <p className="text-xs text-gray-500">{act.description}</p>
                  <span className="text-xs text-gray-400">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Dashboard Overview */}
          <h2 className="text-lg font-bold mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
              <Users className="text-green-500" />
              <h3 className="text-xl font-bold">1,247</h3>
              <p className="text-sm text-gray-500">All Farmers</p>
              <span className="text-green-500 text-xs">
                +12% from last month
              </span>
            </div>
            <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
              <Leaf className="text-green-500" />
              <h3 className="text-xl font-bold">892</h3>
              <p className="text-sm text-gray-500">All Farms</p>
              <span className="text-green-500 text-xs">
                +8% from last month
              </span>
            </div>
            <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
              <ScanLine className="text-green-500" />
              <h3 className="text-xl font-bold">156</h3>
              <p className="text-sm text-gray-500">Today’s Scans</p>
              <span className="text-green-500 text-xs">
                +2.4% from yesterday
              </span>
            </div>
          </div>

          {/* My Farms */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">My Farms</h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={16} /> Add Farm
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {farms.map((farm, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={farm.img}
                    alt={farm.name}
                    className="w-full h-40 object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full ${
                      farm.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {farm.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{farm.name}</h3>
                  <p className="text-sm text-gray-500">{farm.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{farm.location}</p>
                  <span className="text-green-500 text-xs font-semibold">
                    {farm.health}% Health
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
