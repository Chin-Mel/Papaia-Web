import "./NewPassword.css";
import HeaderStart from "../../components/Header/HeaderStart";
import sidePic from "../../assets/sidepic.jpg";
import logo from "../../assets/papaia-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NewPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordLengthValid, setPasswordLengthValid] = useState(true);
  const [isPasswordUnique, setIsPasswordUnique] = useState(true);

  // Validation effects
  useEffect(() => {
    if (newPassword) {
      setPasswordLengthValid(newPassword.length >= 8);
      checkPasswordUniqueness(newPassword);
    }
    if (confirmPassword) {
      setPasswordMatch(confirmPassword === newPassword);
    }
  }, [newPassword, confirmPassword]);

  // Check if password already exists in backend
  const checkPasswordUniqueness = async (password) => {
    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/check-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      const data = await response.json();
      setIsPasswordUnique(data?.isUnique ?? true);
    } catch (err) {
      console.error("Password uniqueness check failed:", err);
      setIsPasswordUnique(true); // Assume unique if check fails
    }
  };

  const isFormValid = () => {
    return (
      newPassword &&
      confirmPassword &&
      passwordMatch &&
      passwordLengthValid &&
      isPasswordUnique
    );
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!isFormValid()) {
      setError("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ Password updated successfully. Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderStart />
      <main className="newpassword-content-wrapper">
        <div className="newpassword-page-container">
          <div className="newpassword-side-container">
            <img src={sidePic} alt="Side" className="newpassword-sidepic" />
          </div>

          <div className="newpassword-side-form">
            <div className="newpassword-form-container">
              <img src={logo} alt="Papaia Logo" className="newpassword-logo" />
              <h2 className="newpassword-heading">Create New Password</h2>

              {/* New Password Input */}
              <div className="newpassword-input-wrapper">
                <label className="newpassword-label">Enter New Password</label>
                <div className="newpassword-password-field">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="newpassword-input"
                  />
                  <span
                    className="newpassword-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {newPassword && !passwordLengthValid && (
                  <p className="newpassword-error">
                    Must be at least 8 characters.
                  </p>
                )}
                {newPassword && !isPasswordUnique && (
                  <p className="newpassword-error">
                    Password is already used by another user.
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="newpassword-input-wrapper">
                <label className="newpassword-label">
                  Confirm New Password
                </label>
                <div className="newpassword-password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="newpassword-input"
                  />
                  <span
                    className="newpassword-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {confirmPassword && !passwordMatch && (
                  <p className="newpassword-error">Passwords do not match.</p>
                )}
              </div>

              {/* Error / Success */}
              {error && <p className="newpassword-error">{error}</p>}
              {success && <p className="newpassword-success">{success}</p>}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="newpassword-submit-button"
                disabled={!isFormValid() || loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default NewPassword;
