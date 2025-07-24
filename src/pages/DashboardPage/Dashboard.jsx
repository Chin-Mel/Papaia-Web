import './Dashboard.css';
import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";

const Dashboard = () => {
  const farmData = [
    { id: 1, name: "KD Farm 1", userCount: 5, location: "Cogon, Guinsay, Danao" },
    { id: 2, name: "KD Farm 1", userCount: 5, location: "Cogon, Guinsay, Danao" },
    { id: 3, name: "KD Farm 1", userCount: 5, location: "Cogon, Guinsay, Danao" },
    { id: 4, name: "KD Farm 1", userCount: 5, location: "Cogon, Guinsay, Danao" },
    { id: 5, name: "KD Farm 1", userCount: 5, location: "Cogon, Guinsay, Danao" },
    { id: 6, name: "KD Farm 1", userCount: 5, location: "Cogon, Guinsay, Danao" }
  ];

  const recentActivities = Array(10).fill({ status: "Healthy", date: "6/9/25" });

  return (
    <div className="dashboard">
       <HeaderDashboard />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-box">
           

            <div className="dashboard-main">
              <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>

                <div className="stats-row">
                  <div className="stat-card farmers">
                    <div className="stat-content">
                      <div className="stat-top">
                        <img src="/src/assets/img_icons8_farmer_64.png" alt="Farmers" />
                        <span className="stat-number">25</span>
                      </div>
                      <h2 className="stat-label">All Farmers</h2>
                    </div>
                  </div>

                  <div className="stat-card farms">
                    <div className="stat-content">
                      <div className="stat-top">
                        <img src="/src/assets/img_icons8_farm_2_50.png" alt="Farms" />
                        <span className="stat-number">25</span>
                      </div>
                      <h2 className="stat-label">All Farms</h2>
                    </div>
                  </div>

                  <div className="stat-card scans">
                    <div className="stat-content">
                      <div className="stat-top">
                        <img src="/src/assets/img_icons8_scan_64_1.png" alt="Scan" />
                        <span className="stat-number">25</span>
                      </div>
                      <h2 className="stat-label">Today's Scan</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-body">
                <div className="my-farms">
                  <div className="section-header">
                    <h2>My Farms</h2>
                    <div className="divider"></div>
                    <button className="add-farm-btn">+ Add a farm</button>
                  </div>

                  <div className="farms-grid">
                    {farmData.map((farm) => (
                      <div key={farm.id} className="farm-card">
                        <div className="farm-content">
                          <div className="farm-header">
                            <div className="farm-users">
                              <img src="/src/assets/user.png" alt="Users" className="user-activity"/>
                              <span>{farm.userCount}</span>
                            </div>
                            <img src="/src/assets/dots.png" alt="Menu" className="dot-menu" />
                          </div>
                          <h3>{farm.name}</h3>
                          <div className="divider"></div>
                          <div className="farm-location">
                            <img src="/src/assets/location.png" alt="Location" />
                            <span>{farm.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recent-activities">
                  <div className="activities-box">
                    <h2>Recent Activities</h2>
                    <div className="activities-list">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="activity">
                          <div className="activity-status">
                            <img src="src/assets/profile-user (1).png" alt="Activity" />
                            <span>{activity.status}</span>
                          </div>
                          <span className="activity-date">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FooterMain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
