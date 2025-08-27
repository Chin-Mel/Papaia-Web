import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check for JWT

  if (!token) {
    return <Navigate to="/" replace />; // redirect if not logged in
  }

  return children; // render protected page
};

export default ProtectedRoute;
