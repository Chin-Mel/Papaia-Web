import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import Welcome from './pages/WelcomePage/Welcome';
import Dashboard from './pages/DashboardPage/Dashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;