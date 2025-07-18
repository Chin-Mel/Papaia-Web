import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/WelcomePage/Welcome';
import Dashboard from './pages/DashboardPage/Dashboard';


   function App() {
     return (
       <Routes>
         <Route path="/" element={<Welcome />} />
         <Route path="/dashboard" element={<Dashboard />} />
       </Routes>
     );
   }

export default App;
