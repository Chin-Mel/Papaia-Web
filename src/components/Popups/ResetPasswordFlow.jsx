import { useState } from "react";
import NewPasswordModal from "./components/Popups/NewPasswordModal";

export default function ResetPasswordFlow({ userId }) {
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (password) => {
    if (!userId) {
      alert("Missing user ID");
      return;
    }

    setLoading(true);
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
        // ✅ Directly redirect to login page
        window.location.href = "/signin";
      } else {
        const data = await res.json();
        alert(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewPasswordModal
      userId={userId}
      onSubmit={handlePasswordSubmit}
      loading={loading}
    />
  );
}
