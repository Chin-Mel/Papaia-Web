import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("jwt");
    if (!token) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return null; // or a spinner

  return children;
}
