import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    // For now, redirect all users to landing page
    // In the future, you can add proper authentication logic here
    navigate("/", { replace: true });
  }, [navigate]);

  // Don't render anything while redirecting
  return null;
}
