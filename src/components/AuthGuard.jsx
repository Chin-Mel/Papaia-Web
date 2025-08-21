import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ Check token in localStorage

    if (token) {
      setChecking(false); // user is logged in, allow rendering
    } else {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  if (checking) return null; // or a spinner

  return children; // render protected content
}
