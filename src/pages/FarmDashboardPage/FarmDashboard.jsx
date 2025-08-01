import React from "react";
import "./FarmDashboard.css";

const FarmDashboard = () => {
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
        <h2>Farmers</h2>
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
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <tr key={i}>
                  <td>Juan Dela Cruz</td>
                  <td>09283485038</td>
                  <td>45</td>
                  <td>Cogon, Quinoy, Danao</td>
                  <td className="actions">
                    <button className="edit">✎</button>
                    <button className="delete">🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmDashboard;
