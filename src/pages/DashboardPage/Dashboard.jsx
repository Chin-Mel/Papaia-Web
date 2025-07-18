import "./Dashboard.css";
import HeaderMain from "../../components/Header/HeaderMain";
import farmerIcon from '../../assets/farmer-count.png';
import farmIcon from '../../assets/farm-count.png';
import scanIcon from '../../assets/scan-count.png';
import locationIcon from '../../assets/location.png';

function Dashboard() {
    return (
        <>
            <HeaderMain />
            <main className="dashboard-content-wrapper">
                <h1>Dashboard</h1>

                {/* Summary Tiles */}
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
                            <p className="tile-number">25</p>
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

                {/* My Farms Dashboard Section */}
                <section className="my-farms-section">
                    <div className="my-farms-header">
                        <h2>My Farms</h2>
                        <button className="add-farm-button">+ Add a farm</button>
                    </div>
                    <div className="farm-cards">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div className="farm-card" key={i}>
                                <p className="farm-user">👤 KD</p>
                                <p className="farm-name">Farm 1</p>
                                <p className="farm-location">
                                    <img src={locationIcon} alt="Location" className="location-icon" />
                                    Cogon, Guinsay, Danao
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Activities Dashboard Section */}
                <aside className="recent-activities">
                    <h2>Recent Activities</h2>
                    <ul>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <li key={i} className="activity-item">
                                <img src="/default-avatar.png" alt="Avatar" className="avatar" />
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
