import { useState } from "react";
import PasswordUpdatedPopup from "./PasswordUpdatedPopup";

function ChangePasswordPage() {
  const [showPopup, setShowPopup] = useState(false);

  const handlePasswordChange = async () => {
    // ...your API call to change password
    const success = true; // replace with actual response
    if (success) setShowPopup(true);
  };

  return (
    <div>
      {/* Your password form */}
      <button onClick={handlePasswordChange}>Change Password</button>

      {showPopup && (
        <PasswordUpdatedPopup
          onClose={(action) => {
            if (action === "signin") {
              window.location.href = "/login";
            } else {
              window.location.href = "/";
            }
          }}
        />
      )}
    </div>
  );
}
