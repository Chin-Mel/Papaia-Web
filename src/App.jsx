import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/WelcomePage/Welcome';
import Dashboard from './pages/DashboardPage/Dashboard';
import AboutPage from './pages/AboutPage/About';


   function App() {
     return (
       <Routes>
         <Route path="/" element={<Welcome />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/about" element={<AboutPage />} />
       </Routes>
     );
   }

export default App;
