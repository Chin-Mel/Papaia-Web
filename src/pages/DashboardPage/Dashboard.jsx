import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderMain from "../../components/Header/HeaderMain";
import farmerIcon from "../../assets/farmer-count.png";
import farmIcon from "../../assets/farm-count.png";
import scanIcon from "../../assets/scan-count.png";
import { MoreVertical } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [farms, setFarms] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const navigate = useNavigate();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime || decoded.role !== "owner") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch farms
  useEffect(() => {
    const fetchFarms = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          "https://papaiaapi.onrender.com/api/owner/farms",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.status === "success") {
          setFarms(data.farms);
        } else {
          console.error("Failed to fetch farms:", data.message);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".farm-menu-icon")) {
        setActiveMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Add a farm
  const handleAddFarm = async () => {
    if (!farmName.trim() || !farmLocation.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/owner/farm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            farmName: farmName.trim(),
            location: farmLocation.trim(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        const newFarm = {
          id: data.farmId || Date.now(), // fallback ID
          farmName,
          location: farmLocation,
        };
        setFarms((prev) => [...prev, newFarm]);
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

  const handleUpdateFarm = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedFarm) return;

    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farm/${selectedFarm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            farmName: farmName.trim(),
            location: farmLocation.trim(),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFarms((prev) =>
        prev.map((f) =>
          f.id === selectedFarm.id
            ? { ...f, farmName, location: farmLocation }
            : f
        )
      );
      setEditPopupVisible(false);
      setSelectedFarm(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFarm = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedFarm) return;

    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farm/${selectedFarm.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFarms((prev) => prev.filter((f) => f.id !== selectedFarm.id));
      setDeletePopupVisible(false);
      setSelectedFarm(null);
    } catch (err) {
      alert(err.message);
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
              <div
                className="farm-card"
                key={farm.id || i}
                onClick={() => navigate(`/farmdashboard/${farm.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="farm-card"
                  key={farm.id || i}
                  style={{ cursor: "default", position: "relative" }}
                >
                  <div className="farm-card-header">
                    <p className="farm-name">{farm.farmName}</p>
                    <button
                      className="farm-menu-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card navigation
                        setActiveMenuIndex(activeMenuIndex === i ? null : i);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenuIndex === i && (
                      <div className="farm-menu-dropdown">
                        <button
                          onClick={() => {
                            setSelectedFarm(farm);
                            setFarmName(farm.farmName);
                            setFarmLocation(farm.location);
                            setEditPopupVisible(true);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFarm(farm);
                            setDeletePopupVisible(true);
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => navigate(`/farmdashboard/${farm.id}`)}
                    style={{ marginTop: "0.5rem" }}
                  ></div>
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
              />
              <input
                type="text"
                placeholder="Enter Farm Location"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
              />
              <button className="popup-add-button" onClick={handleAddFarm}>
                Add Farm
              </button>
            </div>
          </div>
        )}

        {editPopupVisible && (
          <div className="popup-overlay">
            <div className="popup-box">
              <span
                className="popup-close"
                onClick={() => setEditPopupVisible(false)}
              >
                &times;
              </span>
              <h3>Edit Farm</h3>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Farm Name"
              />
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="Farm Location"
              />
              <button className="popup-add-button" onClick={handleUpdateFarm}>
                Update Farm
              </button>
            </div>
          </div>
        )}

        {deletePopupVisible && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Are you sure you want to delete this farm?</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <button
                  className="cancel-button"
                  onClick={() => setDeletePopupVisible(false)}
                >
                  Cancel
                </button>
                <button className="confirm-button" onClick={handleDeleteFarm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <aside className="recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="activity-item">
                <img
                  src="https://i.pravatar.cc/40?img=1"
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
