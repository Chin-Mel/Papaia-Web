import React from "react";
import "./Profile.css";
import HeaderMain from "../../components/Header/HeaderMain";

function Profile() {
  return (
    <>
      <HeaderMain />
      <div className="container">
        <h1>Profile</h1>
        <div className="profile-card">
          <div className="top-section">
            <img
              src="/images/default-user.png"
              alt="Profile"
              className="avatar"
            />
            <div className="user-info">
              <h2>Juan Dela Cruz</h2>
              <p>@juandelacruz</p>
            </div>
            <button className="deactivate">Deactivate Account</button>
          </div>

          <form className="profile-form">
            <div className="form-row">
              <input type="text" placeholder="Dela Cruz" />
              <input type="text" placeholder="Juan" />
            </div>
            <div className="form-row">
              <input type="text" placeholder="Middle Name" />
              <input type="text" placeholder="Suffix" />
            </div>
            <div className="form-row">
              <input type="text" placeholder="@juandelacruz" />
              <input
                type="email"
                placeholder="juandelacruz@gmail.com"
                disabled
              />
            </div>
            <div className="form-row full">
              <input type="text" placeholder="Full Address" />
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
