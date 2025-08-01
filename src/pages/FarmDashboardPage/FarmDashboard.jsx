import React, { useState, useEffect } from "react";
import "./FarmDashboard.css";
import HeaderMain from "../../components/Header/HeaderMain";
import { useNavigate } from "react-router-dom";

const FarmDashboard = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [farmerId, setFarmerId] = useState("");
  const [farmId, setFarmId] = useState(null); // fetched dynamically

  // Fetch farms on component mount
  useEffect(() => {
    const fetchFarmId = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://papaiaapi.onrender.com/api/owner/farms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch farms.");
        }

        if (data.farms.length === 0) {
          alert("No farms found. Please add one first.");
          return;
        }

        // Default to first farm
        setFarmId(data.farms[0].id);
      } catch (error) {
        console.error("❌ Error fetching farm ID:", error);
        alert(error.message);
      }
    };

    fetchFarmId();
  }, [navigate]);

  const handleAddFarmer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    if (!farmId) {
      alert("Farm not loaded. Please try again.");
      return;
    }

    const payload = {
      userId: farmerId,
      farmId,
    };

    try {
      console.log("🚀 Adding farmer:", farmerId, "to farm:", farmId);

      const addResponse = await fetch(
        "https://papaiaapi.onrender.com/api/owner/farmer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const addData = await addResponse.json();
      console.log("📨 Add farmer response:", addResponse.status, addData);

      if (!addResponse.ok) {
        throw new Error(addData.message || "Failed to add farmer.");
      }

      const detailsResponse = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${farmerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const detailsData = await detailsResponse.json();
      if (!detailsResponse.ok) {
        throw new Error(detailsData.message || "Failed to get farmer details.");
      }

      const f = detailsData.farmer;
      const fullName = `${f.firstname} ${
        f.middlename ? f.middlename + " " : ""
      }${f.lastname} ${f.suffix || ""}`;
      const address = `${f.street}, ${f.barangay}, ${f.municipality}`;

      const newFarmer = {
        name: fullName.trim(),
        contact: f.contact || "N/A",
        age: f.age || "N/A",
        address,
      };

      setFarmers([...farmers, newFarmer]);
      setShowModal(false);
      setFarmerId("");
    } catch (error) {
      console.error("❌ Error adding farmer:", error);
      alert(error.message || "An error occurred while adding the farmer.");
    }
  };

  return (
    <>
      <HeaderMain />
      <div className="dashboard">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          &larr; Back
        </button>

        <h1 className="title">
          KD Farm 1 <span className="location">Cogon, Gamuay, Danao</span>
        </h1>

        <div className="timeframe-buttons">
          <button className="active">Weekly</button>
          <button>Monthly</button>
          <button>Daily</button>
        </div>

        <div className="main-content">
          <div className="graph-section">
            <h2>Weekly Plant Condition Scan History Log</h2>
            <div className="graph-placeholder">[Graph Placeholder]</div>
          </div>

          <div className="recent-scans">
            <h3>Recent Scans</h3>
            <ul>
              <li className="healthy">Healthy</li>
              <li className="healthy">Healthy</li>
              <li className="healthy">Healthy</li>
              <li className="healthy">Healthy</li>
              <li className="healthy">Healthy</li>
              <li className="seed">Seed</li>
            </ul>
            <a href="#" className="see-all">
              See all
            </a>
          </div>
        </div>

        <div className="summary">
          <h2>Summary</h2>
          <p>Lorem ipsum dolor sit amet... (truncated for brevity)</p>
        </div>

        <div className="farmers-section">
          <div className="farmers-header">
            <h2>Farmers</h2>
            <button
              className="add-farmer"
              title="Add Farmer"
              onClick={() => setShowModal(true)}
            >
              ➕
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact no.</th>
                <th>Age</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      color: "#aaa",
                    }}
                  >
                    No farmers added yet.
                  </td>
                </tr>
              ) : (
                farmers.map((farmer, i) => (
                  <tr key={i}>
                    <td>{farmer.name}</td>
                    <td>{farmer.contact}</td>
                    <td>{farmer.age}</td>
                    <td>{farmer.address}</td>
                    <td className="actions">
                      <button className="edit">✎</button>
                      <button className="delete">🗑</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2>Add a farmer</h2>
              <input
                type="text"
                placeholder="Enter Farmer ID"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
              />
              <button className="submit-button" onClick={handleAddFarmer}>
                Add Farmer
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FarmDashboard;
