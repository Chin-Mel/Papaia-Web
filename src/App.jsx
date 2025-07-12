// App.jsx
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/WelcomePage/Welcome';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />           
      <Route path="/login" element={<Login />} />        
      <Route path="/register" element={<Register />} />  
      <Route path="/forgot-password" element={<ForgotPassword />} />

    </Routes>
  );
}

export default App;
