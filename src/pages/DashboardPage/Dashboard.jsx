import "./Dashboard.css";
import HeaderMain from "../../components/Header/HeaderMain";
import farmerIcon from "../../assets/farmer-count.png";
import farmIcon from "../../assets/farm-count.png";
import scanIcon from "../../assets/scan-count.png";
import { useState } from "react";
import { MoreVertical } from "lucide-react";

function Dashboard() {
  const [farms, setFarms] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");

  const handleAddFarm = async () => {
    if (!farmName.trim() || !farmLocation.trim()) return;

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/owner/farm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            farmName: farmName.trim(),
            location: farmLocation.trim(),
          }),
        }
      );

      // Read response as text first for debugging
      const rawResponse = await response.text();
      console.log("Raw Response:", rawResponse);

      // Parse JSON only if it's not an HTML error page
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (jsonError) {
        throw new Error(
          "Response was not valid JSON. Possibly an HTML error page."
        );
      }

      if (response.ok && data.status === "success") {
        const newFarm = {
          name: farmName,
          location: farmLocation,
          id: data.farmId,
        };
        setFarms([...farms, newFarm]);
        setFarmName("");
        setFarmLocation("");
        setShowPopup(false);
      } else {
        alert(data.message || "Failed to add farm.");
      }
    } catch (error) {
      console.error("Error adding farm:", error);
      alert("Something went wrong while adding the farm.");
    }
  };

  return (
    <>
      <HeaderMain />
      <main className="dashboard-content-wrapper">
        <h1>Dashboard</h1>

        <div className="update-tiles">
          <div className="tile farmer-count">
            <div className="tile-icon">
              <img src={farmerIcon} alt="Farmer Icon" />
            </div>
            <div className="tile-text">
              <p className="tile-label">All Farmers</p>
              <p className="tile-number">25</p>
            </div>
          </div>

          <div className="tile farm-count">
            <div className="tile-icon">
              <img src={farmIcon} alt="Farm Icon" />
            </div>
            <div className="tile-text">
              <p className="tile-label">All Farms</p>
              <p className="tile-number">{farms.length}</p>
            </div>
          </div>

          <div className="tile scan-count">
            <div className="tile-icon">
              <img src={scanIcon} alt="Scan Icon" />
            </div>
            <div className="tile-text">
              <p className="tile-label">Today's Scan</p>
              <p className="tile-number">25</p>
            </div>
          </div>
        </div>

        <section className="my-farms-section">
          <div className="my-farms-header">
            <h2>My Farms</h2>
            <button
              className="add-farm-button"
              onClick={() => setShowPopup(true)}
            >
              + Add a farm
            </button>
          </div>
          <div className="farm-cards">
            {farms.map((farm, i) => (
              <div className="farm-card" key={farm.id || i}>
                <div className="farm-card-header">
                  <p className="farm-name">{farm.name}</p>
                  <div className="farm-menu-icon">
                    <MoreVertical size={16} />
                  </div>
                </div>
                <p className="farm-location">📍{farm.location}</p>
              </div>
            ))}
          </div>
        </section>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <span className="popup-close" onClick={() => setShowPopup(false)}>
                &times;
              </span>
              <h3>Add a farm</h3>
              <input
                type="text"
                placeholder="Enter Farm Name"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Farm Location"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                required
              />
              <button className="popup-add-button" onClick={handleAddFarm}>
                Add Farm
              </button>
            </div>
          </div>
        )}

        <aside className="recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="activity-item">
                <img
                  src="/path-to-avatar.jpg"
                  alt="Avatar"
                  className="avatar"
                />
                <span className="activity-status">Healthy</span>
                <span className="activity-date">7/15</span>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </>
  );
}

export default Dashboard;
