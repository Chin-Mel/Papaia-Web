import "./FarmDashboard.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderMain from "../../components/Header/HeaderMain";

function FarmDashboard() {
  const { farmId } = useParams();
  const [farm, setFarm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`https://papaiaapi.onrender.com/api/owner/farm/${farmId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFarm(data.farm);
        } else {
          console.error("Error loading farm data", data.message);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [farmId, navigate]);

  if (!farm) return <div>Loading farm...</div>;

  return (
    <>
      <HeaderMain />
      <div className="farm-dashboard-wrapper">
        <h1>{farm.farmName} Dashboard</h1>
        <p>📍 {farm.location}</p>
        {/* You can add charts, farmer lists, sensor data, etc., here */}
      </div>
    </>
  );
}

export default FarmDashboard;
