import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";
import "./ScanHistory.css";

const scanResults = [
  {
    id: 1,
    image: "/src/assets/leaf.jpg",
    status: "Healthy",
    disease: "No Disease",
    date: "6/24/24",
    time: "7:00 am",
    farmer: "Farmer #1"
  },
  {
    id: 2,
    image: "/src/assets/leaf.jpg",
    status: "Healthy",
    disease: "No Disease",
    date: "6/24/24",
    time: "7:00 am",
    farmer: "Farmer #1"
  },
  {
    id: 3,
    image: "/src/assets/leaf.jpg",
    status: "Healthy",
    disease: "No Disease",
    date: "6/24/24",
    time: "7:00 am",
    farmer: "Farmer #1"
  },
  {
    id: 4,
    image: "/src/assets/leaf.jpg",
    status: "Healthy",
    disease: "No Disease",
    date: "6/24/24",
    time: "7:00 am",
    farmer: "Farmer #1"
  },
  {
    id: 5,
    image: "/src/assets/leaf.jpg",
    status: "Healthy",
    disease: "No Disease",
    date: "6/24/24",
    time: "7:00 am",
    farmer: "Farmer #1"
  }
];

export default function ScanHistory() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />

      {/* Main Content */}
      <main className="flex-1">
        <div className="scan-history-container">
          <h1 className="scan-history-title">Scan History</h1>
          
          <div className="scan-results-list">
            {scanResults.map((result) => (
              <div key={result.id} className="scan-result-card">
                {/* Left side - Image and Status */}
                <div className="scan-result-left">
                  {/* Plant Image */}
                  <div className="plant-image-container">
                    <img
                      src="/placeholder.svg"
                      alt="Plant leaf scan"
                      className="plant-image"
                    />
                  </div>

                  {/* Status and Disease Info */}
                  <div className="status-info">
                    <h3 className="status-title">
                      {result.status}
                    </h3>
                    <div>
                      <span className="disease-badge">
                  <img src="/src/assets/circle.png" alt="Badge" className="badge-icon" />
        
                        {result.disease}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Date, Time, Farmer */}
                <div className="scan-result-right">
                  <div className="date-time-info">
                    <div className="info-label">{result.date}</div>
                    <div>{result.time}</div>
                  </div>
                  <div className="farmer-info">
                    <div className="info-label">{result.farmer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterMain />
    </div>
  );
}