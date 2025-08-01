import React, { useState, useEffect } from "react";
import "./FarmDashboard.css";
import { useParams, useNavigate } from "react-router-dom";

import HeaderMain from "../../components/Header/HeaderMain";

const FarmDashboard = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState(null);

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);

  const { farmId } = useParams();
  const navigate = useNavigate();

  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [farmerId, setFarmerId] = useState("");

  // Fetch farms and farmers on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    const fetchFarmDetails = async () => {
      try {
        const response = await fetch(
          "https://papaiaapi.onrender.com/api/owner/farms",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (!response.ok || !data.farms) {
          throw new Error(data.message || "Failed to fetch farms.");
        }

        const selectedFarm = data.farms.find((f) => f.id === farmId);
        if (!selectedFarm) {
          alert("Farm not found.");
          navigate("/dashboard");
          return;
        }

        setFarmName(selectedFarm.farmName);
        setFarmLocation(selectedFarm.location);
      } catch (error) {
        console.error("❌ Error fetching farm details:", error);
        alert(error.message);
      }
    };

    const fetchFarmers = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/owner/farmers/${farmId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok || !data.farmers) {
          throw new Error(data.message || "Failed to fetch farmers.");
        }

        const formattedFarmers = data.farmers.map((f) => {
          const fullName = `${f.firstname} ${
            f.middlename ? f.middlename + " " : ""
          }${f.lastname} ${f.suffix || ""}`;
          const address = `${f.street}, ${f.barangay}, ${f.municipality}`;
          return {
            id: f.id, // userId
            name: fullName.trim(),
            contact: f.contact || "N/A",
            age: f.age || "N/A",
            address,
          };
        });

        setFarmers(formattedFarmers);
      } catch (error) {
        console.error("❌ Error fetching farmers:", error);
        alert(error.message);
      }
    };

    fetchFarmDetails();
    fetchFarmers();
  }, [farmId, navigate]);

  const handleDeleteFarmer = async () => {
    const token = localStorage.getItem("token");
    if (!token || !farmerToDelete) return;

    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${farmerToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete farmer.");

      setFarmers((prev) => prev.filter((f) => f.id !== farmerToDelete));
      setShowDeleteConfirm(false);
      setFarmerToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddFarmer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    if (!farmId) {
      alert("Farm ID is missing.");
      return;
    }

    // Prevent adding the same farmer to the same farm
    const alreadyAdded = farmers.some((f) => f.id === farmerId);
    if (alreadyAdded) {
      alert("This farmer is already added to this farm.");
      return;
    }

    const payload = {
      userId: farmerId,
      farmId: farmId,
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

      const createdFarmerId = addData.farmerId || addData.id;

      const detailsResponse = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${createdFarmerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
        id: f.id, // store userId
        name: fullName.trim(),
        contact: f.contact || "N/A",
        age: f.age || "N/A",
        address,
      };

      setFarmers((prev) => [...prev, newFarmer]);
      setShowModal(false);
      setFarmerId("");
    } catch (error) {
      console.error("❌ Error adding farmer:", error);
      alert(error.message || "An error occurred while adding the farmer.");
    }
  };

  const handleViewFarmer = async (farmerId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farmer/${farmerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch farmer.");

      const f = data.farmer;
      setSelectedFarmer({
        id: f.id,
        username: f.userId,
        name: `${f.firstname} ${f.middlename ? f.middlename + " " : ""}${
          f.lastname
        } ${f.suffix || ""}`.trim(),
        address: `${f.street}, ${f.barangay}, ${f.municipality}, ${f.province}, ${f.zipcode}`,
      });
      setShowFarmerDetails(true);
    } catch (err) {
      alert(err.message);
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
          {farmName} <span className="location">{farmLocation}</span>
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
                      <button
                        className="edit"
                        title="View Details"
                        onClick={() => handleViewFarmer(farmer.id)}
                      >
                        👁
                      </button>
                      <button
                        className="delete"
                        title="Delete Farmer"
                        onClick={() => {
                          setFarmerToDelete(farmer.id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        🗑
                      </button>
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
                id="farmer-id"
                name="farmerId"
                placeholder="Enter Farmer ID"
                autoComplete="off"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
              />
              <button className="submit-button" onClick={handleAddFarmer}>
                Add Farmer
              </button>
            </div>
          </div>
        )}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>
                Are you sure you want to delete this farmer from the farm?
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button onClick={handleDeleteFarmer} className="confirm-button">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {showFarmerDetails && selectedFarmer && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="modal-close"
                onClick={() => setShowFarmerDetails(false)}
              >
                ×
              </button>
              <h2>Farmer Profile</h2>
              <p>
                <strong>Full Name:</strong> {selectedFarmer.name}
              </p>
              <p>
                <strong>Farmer ID:</strong> {selectedFarmer.id}
              </p>
              <p>
                <strong>Username:</strong> {selectedFarmer.username}
              </p>
              <p>
                <strong>Address:</strong> {selectedFarmer.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FarmDashboard;
