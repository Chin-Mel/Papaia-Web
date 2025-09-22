import React from "react";

// Temporary component to debug authentication issues
const AuthDebugComponent = () => {
  const debugAuth = () => {
    console.log("=== AUTH DEBUG INFO ===");

    // Check localStorage contents
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    console.log("Raw user string from localStorage:", userStr);
    console.log("Token exists:", !!token);
    console.log("Token length:", token ? token.length : 0);

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("Parsed user object:", user);
        console.log("User ID (id field):", user.id);
        console.log("User ID (_id field):", user._id);
        console.log("User keys:", Object.keys(user));
      } catch (error) {
        console.error("Error parsing user JSON:", error);
      }
    }

    // Test API call with current token
    if (token && userStr) {
      const user = JSON.parse(userStr);
      const userId = user.id || user._id;

      if (userId) {
        console.log(
          `Testing API call to: https://papaiaapi.onrender.com/api/user/${userId}`
        );

        fetch(`https://papaiaapi.onrender.com/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            console.log("API Response status:", response.status);
            console.log("API Response headers:", response.headers);
            return response.text();
          })
          .then((text) => {
            console.log("API Response body:", text);
            try {
              const json = JSON.parse(text);
              console.log("Parsed API Response:", json);
            } catch (e) {
              console.log("Response is not JSON");
            }
          })
          .catch((error) => {
            console.error("API call error:", error);
          });
      }
    }

    console.log("=== END DEBUG INFO ===");
  };

  const clearAuth = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("Cleared authentication data");
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "red",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 9999,
        fontSize: "12px",
      }}
    >
      <div>Auth Debug Tools</div>
      <button
        onClick={debugAuth}
        style={{
          margin: "5px",
          padding: "5px 10px",
          background: "white",
          color: "red",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Debug Auth
      </button>
      <button
        onClick={clearAuth}
        style={{
          margin: "5px",
          padding: "5px 10px",
          background: "white",
          color: "red",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Clear Auth
      </button>
    </div>
  );
};

export default AuthDebugComponent;
