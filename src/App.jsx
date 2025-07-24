import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/WelcomePage/Welcome';
import Dashboard from './pages/DashboardPage/Dashboard';
import AboutPage from './pages/AboutPage/About';
import ScanHistoryDetailsPage from './pages/ScanHistoryPage/ScanHistoryDetailsPage';


   function App() {
     return (
       <Routes>
         <Route path="/" element={<Welcome />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/about" element={<AboutPage />} />
         <Route path="/scan-history" element={<ScanHistoryDetailsPage />} />
       </Routes>
     );
   }

export default App;
