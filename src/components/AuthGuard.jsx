import { Navigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function AuthGuard({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}
