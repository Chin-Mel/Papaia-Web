import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCamera } from "react-icons/fa";
import "./Profile.css";
import HeaderMain from "../../components/Header/HeaderMain";
import defaultUser from "../../assets/default-user.png";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(defaultUser);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    username: "",
    email: "",
    address: {
      street: "",
      barangay: "",
      municipality: "",
      province: "",
      zipCode: "",
    },
  });

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/login");
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/profile-picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to upload");

      const data = await res.json();
      setProfileImage(data.imageUrl);
      localStorage.setItem("profileImage", data.imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("User not found");

        const user = await res.json();
        setUserData(user);

        const profilePic = user.profilePicture || defaultUser;
        setProfileImage(profilePic);
        localStorage.setItem("profileImage", profilePic);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }

    fetchProfile();
  }, []);

  const { firstName, lastName, middleName, suffix, username, email, address } =
    userData;

  const fullAddress = `${address.street || ""}, ${address.barangay || ""}, ${
    address.municipality || ""
  }, ${address.province || ""}, ${address.zipCode || ""}`;

  return (
    <>
      <HeaderMain />
      <div className="profile-container">
        <h2 className="profile-heading">Profile</h2>

        <div className="profile-card">
          <button className="deactivate-button" onClick={handleDeactivate}>
            Deactivate Account
          </button>

          <div className="profile-header">
            <div
              className="profile-image-container"
              onClick={handleProfileImageClick}
            >
              <img src={profileImage} alt="Profile" className="profile-image" />
              <div className="camera-icon">
                <FaCamera />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
            <div>
              <h3 className="profile-name">
                {firstName} {lastName}
              </h3>
              <p className="profile-username">@{username}</p>
            </div>
          </div>

          <div className="profile-form">
            <InputField
              icon={<FaUser />}
              value={lastName}
              label="Last Name"
              name="lastName"
            />
            <InputField value={firstName} label="First Name" name="firstName" />
            <InputField
              value={middleName}
              label="Middle Name"
              name="middleName"
            />
            <InputField value={suffix} label="Suffix" name="suffix" />
            <InputField
              icon={<FaUser />}
              value={username}
              label="Username"
              name="username"
            />
            <InputField
              icon={<FaEnvelope />}
              value={email}
              label="Email"
              name="email"
            />
            <InputField
              icon={<FaMapMarkerAlt />}
              value={fullAddress}
              label="Full Address"
              name="address"
            />
          </div>

          <div className="profile-buttons">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <button className="password-button" onClick={handleChangePassword}>
              Change Password
            </button>
            <button className="edit-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InputField({ icon, value, label, name }) {
  return (
    <div className="input-field">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        type="text"
        value={value}
        readOnly
        id={name}
        name={name}
        placeholder={label}
        className={`input ${icon ? "input-with-icon" : ""}`}
      />
    </div>
  );
}

export default Profile;
