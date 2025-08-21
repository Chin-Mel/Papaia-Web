import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Leaf, ScanLine, TrendingUp, MapPin } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import AddFarmModal from "../components/Popups/AddFarmModal";

export default function DashboardPage() {
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [farms, setFarms] = useState([]);

  // Example data for activities
  const activities = [
    {
      type: "New Farm Registered",
      icon: "➕",
      iconBg: "bg-green-100",
      title: "New farm registered",
      description: "Green Valley Farm added to system",
      time: "2 hours ago",
      bgColor: "bg-green-50",
    },
    {
      type: "Crop Scan Completed",
      icon: "📊",
      iconBg: "bg-blue-100",
      title: "Crop scan completed",
      description: "Sunrise Orchards - Health check",
      time: "4 hours ago",
      bgColor: "bg-blue-50",
    },
    {
      type: "Disease Detected",
      icon: "⚠️",
      iconBg: "bg-yellow-100",
      title: "Disease Detected",
      description: "Green Valley Farm - Check",
      time: "8 hours ago",
      bgColor: "bg-yellow-50",
    },
    {
      type: "New Farmer Onboarded",
      icon: "👤",
      iconBg: "bg-green-100",
      title: "New farmer onboarded",
      description: "John Smith joined the platform",
      time: "1 day ago",
      bgColor: "bg-green-50",
    },
    {
      type: "Monthly Report Generated",
      icon: "📋",
      iconBg: "bg-purple-100",
      title: "Monthly report generated",
      description: "Productivity analytics ready",
      time: "2 days ago",
      bgColor: "bg-purple-50",
    },
  ];

  // Fetch farms from backend
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await fetch(
          "https://papaiaapi.onrender.com/api/owner/farms",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === "success" && data.farms) {
          // Map API fields to UI
          const mappedFarms = data.farms.map((f) => ({
            id: f.id,
            name: f.farmName,
            desc: "", // default
            location: f.location,
            health: 100, // default
            status: "Active", // default
            img: "https://source.unsplash.com/400x300/?farm",
          }));
          setFarms(mappedFarms);
        }
      } catch (err) {
        console.error("Failed to fetch farms:", err);
      }
    };
    fetchFarms();
  }, []);

  // Handle adding a new farm
  const handleAddFarm = async (farmData) => {
    try {
      const res = await fetch("https://papaiaapi.onrender.com/api/owner/farm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          farmName: farmData.name,
          location: farmData.location,
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        const newFarm = {
          id: data.farmId,
          name: farmData.name,
          desc: farmData.desc || "",
          location: farmData.location,
          health: 100,
          status: "Active",
          img: farmData.img || "https://source.unsplash.com/400x300/?farm",
        };
        setFarms((prev) => [newFarm, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add farm:", err);
    } finally {
      setShowAddFarmModal(false);
    }
  };

  const handleCloseModal = () => setShowAddFarmModal(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

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

          {/* Right Column - My Farms */}
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

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">My Farms</h2>
                <button
                  onClick={() => setShowAddFarmModal(true)}
                  className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Plus size={16} />
                  Add Farm
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {farms.map((farm) => (
                  <Link
                    key={farm.id}
                    to={`/farmdashboard/${farm.id}`}
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
                        <MapPin size={12} /> {farm.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf size={12} className="text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {farm.health}% Health
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAddFarmModal && (
        <AddFarmModal onClose={handleCloseModal} onSubmit={handleAddFarm} />
      )}
      <Footer />
    </div>
  );
}
