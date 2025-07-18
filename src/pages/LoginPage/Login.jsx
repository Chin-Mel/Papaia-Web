import "./Login.css";
import HeaderStart from "../../components/Header/HeaderStart";
import sidePic from "../../assets/sidepic.jpg";
import logo from "../../assets/papaia-logo.png";
import emailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/password.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://papaiaapi.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        try {
          const decoded = jwtDecode(data.token); // ✅ correct
          // ⬅️ this was missing!
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            setError("Your session has expired. Please log in again.");
            return;
          }

          if (decoded.role !== "farm-owner") {
            setError("You are not authorized to access the web platform.");
            return;
          }

          localStorage.setItem("token", data.token);
          setError("");
          navigate("/dashboard");
        } catch (decodeError) {
          setError("Invalid token. Please log in again.");
        }
      } else if (response.status === 401) {
        setError("Invalid username or password.");
      } else if (response.status === 403) {
        setError("Please verify your email first.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent logged-in users from accessing login page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ correct
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime && decoded.role === "farm-owner") {
          navigate("/dashboard");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  return (
    <>
      <HeaderStart />

      <main className="login-content-wrapper">
        <div className="login-page-container">
          <div className="login-side-container">
            <img
              src={sidePic}
              alt="Papaia Side Picture"
              className="login-sidepic"
            />
          </div>

          <div className="login-side-form">
            <div className="login-form-container">
              <img src={logo} alt="papaia-logo" className="login-logo" />
              <h2 className="login-heading">Login</h2>

              <form onSubmit={handleSubmit}>
                <div className="login-input-wrapper login-full">
                  <img
                    src={emailIcon}
                    alt="Email Icon"
                    className="login-input-icon"
                  />
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className={`login-input ${emailError ? "input-error" : ""}`}
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                      validateEmail(value.trim());
                    }}
                    required
                    autoComplete="email"
                  />
                </div>
                {emailError && <p className="error-text">{emailError}</p>}

                <div className="login-input-wrapper login-full">
                  <img
                    src={lockIcon}
                    alt="Lock Icon"
                    className="login-input-icon"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <span
                    className="login-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>

                <div className="login-helper-links">
                  <Link to="/forgot-password" className="login-forgot-password">
                    Forgot Password?
                  </Link>
                  <Link to="/register" className="login-register-link">
                    Register
                  </Link>
                </div>

                <button
                  type="submit"
                  className="login-submit-button"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <div className="login-error-container">
                  <p
                    className={`login-error-message ${error ? "visible" : ""}`}
                  >
                    {error}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
