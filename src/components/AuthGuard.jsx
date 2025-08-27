import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />; // redirect to landing

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
    return children;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
};

export default AuthGuard;
