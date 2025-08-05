import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/WelcomePage/Welcome';
import Dashboard from './pages/DashboardPage/Dashboard';
import AboutPage from './pages/AboutPage/About';
import ScanHistoryDetailsPage from './pages/ScanHistoryPage/ScanHistoryDetailsPage';
import ScanHistory from './pages/ScanHistoryPage/ScanHistory';
import EditProfilePage from './pages/ProfilePage/EditProfilePage';


   function App() {
     return (
       <Routes>
         <Route path="/" element={<Welcome />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/about" element={<AboutPage />} />
         <Route path="/scan-history-details" element={<ScanHistoryDetailsPage />} />
         <Route path="/scan-history" element={<ScanHistory />} />
         <Route path="/edit-profile" element={<EditProfilePage />} />
       </Routes>
     );
   }

export default App;
