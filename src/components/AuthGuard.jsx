import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { secureApiCall } from "../utils/securityUtils";

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    secureApiCall("https://papaiaapi.onrender.com/api/verify", {
      method: "GET",
      credentials: "include", // sends HttpOnly cookie
    })
      .then((res) => {
        if (res.ok) {
          setChecking(false); // user is logged in, allow rendering
        } else {
          navigate("/sign-in", { replace: true });
        }
      })
      .catch(() => {
        navigate("/sign-in", { replace: true });
      });
  }, [navigate]);

  if (checking) return null; // or a loading spinner

  return children; // render protected content
}
