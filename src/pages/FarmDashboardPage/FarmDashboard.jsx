import React, { useState } from "react";
import "./FarmDashboard.css";

const FarmDashboard = () => {
  const [farmers, setFarmers] = useState([]);

  const handleAddFarmer = async () => {
    const payload = {
      userId: "user123",
      farmId: "farm456",
    };

    try {
      const response = await fetch("/owner/farmer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add farmer");

      const newFarmer = await response.json();
      setFarmers([...farmers, newFarmer]);
    } catch (error) {
      console.error("Error adding farmer:", error);
    }
  };

  return (
    <div className="dashboard">
      <a href="#" className="back-button">
        &larr; Back
      </a>
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
            onClick={handleAddFarmer}
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
    </div>
  );
};

export default FarmDashboard;
