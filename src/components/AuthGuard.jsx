import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect immediately if not logged in
    return <Navigate to="/sign-in" replace />;
  }

  // User is authenticated, render protected content
  return children;
}
