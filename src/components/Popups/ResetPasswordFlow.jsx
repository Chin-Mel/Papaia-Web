import { useState } from "react";
import NewPasswordPage from "./NewPasswordPage";
import PasswordUpdatedModal from "./components/Popups/PasswordUpdatedModal";

export default function ResetPasswordFlow({ userId }) {
  const [step, setStep] = useState("newPassword"); // "newPassword" | "success"

  // This will be passed to NewPasswordPage and triggered after successful password reset
  const handlePasswordSubmit = async (password) => {
    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, newPassword: password }),
        }
      );

      if (res.ok) {
        setStep("success"); // ✅ show success modal
      } else {
        const data = await res.json();
        alert(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (step === "newPassword") {
    return <NewPasswordPage userId={userId} onSubmit={handlePasswordSubmit} />;
  }

  if (step === "success") {
    return (
      <PasswordUpdatedModal
        onClose={(action) => {
          if (action === "signin") {
            window.location.href = "/signin";
          } else if (action === "home") {
            window.location.href = "/";
          }
        }}
      />
    );
  }

  return null;
}
