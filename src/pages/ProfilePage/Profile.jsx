import React, { useEffect, useState } from "react";
import "./Profile.css";
import HeaderMain from "../../components/Header/HeaderMain";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      const userId = decoded.id || decoded.user?.id || decoded._id; // adjust based on your token structure
      if (!userId) {
        throw new Error("User ID not found in token");
      }

      fetch(`https://papaiaapi.onrender.com/api/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              console.error("API Error:", err);
              throw new Error(err.message || "User not found");
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log("User fetched:", data);
          setUser(data);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  if (!user) return <p>Loading user profile...</p>;

  return (
    <>
      <HeaderMain />
      <div className="container">
        <h1>Profile</h1>
        <div className="profile-card">
          <div className="top-section">
            <img
              src={user.profilePicture || "/images/default-user.png"}
              alt="Profile"
              className="avatar"
            />
            <div className="user-info">
              <h2>{`${user.firstName} ${user.lastName}`}</h2>
              <p>@{user.username}</p>
            </div>
            <button className="deactivate">Deactivate Account</button>
          </div>

          <form className="profile-form">
            <div className="form-row">
              <input type="text" value={user.lastName} readOnly />
              <input type="text" value={user.firstName} readOnly />
            </div>
            <div className="form-row">
              <input type="text" value={user.middleName || ""} readOnly />
              <input type="text" value={user.suffix || ""} readOnly />
            </div>
            <div className="form-row">
              <input type="text" value={`@${user.username}`} readOnly />
              <input type="email" value={user.email} disabled />
            </div>
            <div className="form-row full">
              <input type="text" value={user.address || ""} readOnly />
            </div>
          </form>

          <div className="button-group">
            <button className="logout">Logout</button>
            <div className="right-buttons">
              <button className="change">Change Password</button>
              <button className="edit">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
