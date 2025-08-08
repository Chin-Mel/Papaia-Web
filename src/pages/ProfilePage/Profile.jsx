import React from "react";
import "./Profile.css";
import HeaderMain from "../../components/Header/HeaderMain";

const Profile = () => {
  return (
    <HeaderMain>
      <div className="profile-container">
        <h1 className="profile-heading">Profile</h1>
        <div className="profile-card">
          <button className="deactivate-button">Deactivate Account</button>
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src="/assets/default-user.png"
                alt="Profile"
                className="profile-image"
              />
              <span className="camera-icon">📷</span>
            </div>
            <div>
              <div className="profile-name">Juan Dela Cruz</div>
              <div className="profile-username">@juandelacruz</div>
            </div>
          </div>

          <form className="profile-form">
            <input type="text" placeholder="Dela Cruz" className="input" />
            <input type="text" placeholder="Juan" className="input" />
            <input type="text" placeholder="Middle Name" className="input" />
            <input type="text" placeholder="Suffix" className="input" />
            <input type="text" placeholder="@juandelacruz" className="input" />
            <input
              type="email"
              placeholder="juandelacruz@gmail.com"
              className="input"
              disabled
            />
            <input type="text" placeholder="Full Address" className="input" />
          </form>

          <div className="profile-buttons">
            <button className="logout-button">Logout</button>
            <button className="password-button">Change Password</button>
            <button className="edit-button">Edit Profile</button>
          </div>
        </div>
      </div>
    </HeaderMain>
  );
};

export default Profile;
