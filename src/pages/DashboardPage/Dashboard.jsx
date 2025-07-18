import './Dashboard.css';
import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";

const Dashboard = () => {
  const farmData = [
    {
      id: 1,
      name: "KD Farm 1",
      userCount: 5,
      location: "Cogon, Guinsay, Danao"
    },
    {
      id: 2,
      name: "KD Farm 1",
      userCount: 5,
      location: "Cogon, Guinsay, Danao"
    },
    {
      id: 3,
      name: "KD Farm 1",
      userCount: 5,
      location: "Cogon, Guinsay, Danao"
    },
    {
      id: 4,
      name: "KD Farm 1",
      userCount: 5,
      location: "Cogon, Guinsay, Danao"
    },
    {
      id: 5,
      name: "KD Farm 1",
      userCount: 5,
      location: "Cogon, Guinsay, Danao"
    },
    {
      id: 6,
      name: "KD Farm 1",
      userCount: 5,
      location: "Cogon, Guinsay, Danao"
    }
  ];

  const recentActivities = Array(10).fill({
    status: "Healthy",
    date: "6/9/25"
  });

  const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    type = 'button',
    fullWidth = false,
    className = '',
    ...props 
  }) => {
    const baseClasses = 'font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

    const variants = {
      primary: 'bg-button-1 text-button-1 hover:bg-[#005a24] disabled:bg-gray-400',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400',
    };

    const sizes = {
      small: 'px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
      medium: 'px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base',
      large: 'px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg',
    };

    const buttonClasses = `
      ${baseClasses} 
      ${variants[variant]} 
      ${sizes[size]} 
      ${fullWidth ? 'w-full' : ''} 
      ${disabled ? 'cursor-not-allowed opacity-50' : ''} 
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={buttonClasses}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
        <>
    <div className="dashboard-container">
      <div className="dashboard-inner">
        <div className="dashboard-content">
          <HeaderDashboard />

          <div className="dashboard-main">
            <div className="dashboard-title">Dashboard</div>

            <div className="stats-cards">
              <div className="stats-card bg-global-5">
                <div className="stats-card-content">
                  <div className="stats-top">
                    <img src="/images/img_icons8_farmer_64.png" alt="Farmers" className="icon" />
                    <span className="stats-number">25</span>
                  </div>
                  <h2 className="stats-label">All Farmers</h2>
                </div>
              </div>

              <div className="stats-card bg-global-2">
                <div className="stats-card-content">
                  <div className="stats-top">
                    <img src="/images/img_icons8_farm_2_50.png" alt="Farms" className="icon" />
                    <span className="stats-number">25</span>
                  </div>
                  <h2 className="stats-label">All Farms</h2>
                </div>
              </div>

              <div className="stats-card bg-global-4">
                <div className="stats-card-content">
                  <div className="stats-top">
                    <img src="/images/img_icons8_scan_64_1.png" alt="Scan" className="icon" />
                    <span className="stats-number">25</span>
                  </div>
                  <h2 className="stats-label">Today's Scan</h2>
                </div>
              </div>
            </div>

            <div className="main-sections">
              <div className="my-farms-section">
                <div className="section-header">
                  <h2 className="section-title">My Farms</h2>
                  <div className="section-divider"></div>
                  <Button variant="primary" size="small" className="add-farm-button">
                    + Add a farm
                  </Button>
                </div>

                <div className="farms-grid">
                  {farmData.map((farm) => (
                    <div key={farm.id} className="farm-card bg-global-6">
                      <div className="farm-card-content">
                        <div className="farm-header">
                          <div className="farm-users">
                            <img src="/images/img_user.svg" alt="Users" className="user-icon" />
                            <span className="user-count">{farm.userCount}</span>
                          </div>
                          <img src="/images/img_group_224.svg" alt="Menu" className="menu-icon" />
                        </div>

                        <h3 className="farm-name">{farm.name}</h3>
                        <div className="farm-divider"></div>
                        <div className="farm-location">
                          <img src="/images/img_location_on.svg" alt="Location" className="location-icon" />
                          <span className="location-text">{farm.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recent-activities">
                <div className="activities-box bg-global-7">
                  <h2 className="activities-title">Recent Activities</h2>

                  <div className="activities-list">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="activity-item bg-global-7">
                        <div className="activity-left">
                          <img src="/images/img_ellipse_2.png" alt="Activity" className="activity-icon" />
                          <span className="activity-status">{activity.status}</span>
                        </div>
                        <span className="activity-date">{activity.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterMain />
    </>
  );
};

export default Dashboard;
