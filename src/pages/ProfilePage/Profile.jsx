import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCamera } from "react-icons/fa";
import "./Profile.css";
import HeaderMain from "../../components/Header/HeaderMain";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/80"
  );
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

      const data = await res.json(); // { imageUrl: "..." }
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
        if (user.profilePicture) {
          setProfileImage(user.profilePicture);
          localStorage.setItem("profileImage", user.profilePicture);
        }
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

  const fullAddress = `${userData.street || ""}, ${userData.barangay || ""}, ${
    userData.municipality || ""
  }, ${userData.province || ""}, ${userData.zipCode || ""}`;

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
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="profile-username">@{userData.username}</p>
            </div>
          </div>

          <div className="profile-form">
            <InputField icon={<FaUser />} value={userData.lastName} />
            <InputField value={userData.firstName} />
            <InputField value={userData.middleName} />
            <InputField value={userData.suffix} />
            <InputField icon={<FaUser />} value={userData.username} />
            <InputField icon={<FaEnvelope />} value={userData.email} />
            <InputField
              icon={<FaMapMarkerAlt />}
              value={`${userData.address?.street}, ${userData.address?.barangay}, ${userData.address?.municipality}, ${userData.address?.province}, ${userData.address?.zipCode}`}
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

function InputField({ icon, value }) {
  return (
    <div className="input-field">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        type="text"
        value={value}
        readOnly
        className={`input ${icon ? "input-with-icon" : ""}`}
      />
    </div>
  );
}

export default Profile;
