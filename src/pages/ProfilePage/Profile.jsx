import React, { useState, useRef } from "react";
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

  // Handlers for popups
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

      const data = await res.json(); // assuming your backend returns: { imageUrl: "..." }
      setProfileImage(data.imageUrl);
      localStorage.setItem("profileImage", data.imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("profileImage");
    if (saved) {
      setProfilePic(saved);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // make sure you store this on login

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
        setProfileImage(user.profilePicture); // image URL returned from API
        localStorage.setItem("profileImage", user.profilePicture);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    } else {
      fetchProfile(); // only fetch if nothing stored
    }
  }, []);

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <HeaderMain />
      <div className="profile-container">
        <h2 className="profile-heading">Profile</h2>

        <div className="profile-card">
          {/* Deactivate Button */}
          <button className="deactivate-button" onClick={handleDeactivate}>
            Deactivate Account
          </button>

          {/* Profile Header */}
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
              <h3 className="profile-name">Juan Dela Cruz</h3>
              <p className="profile-username">@juandelacruz</p>
            </div>
          </div>

          {/* Form */}
          <div className="profile-form">
            <InputField icon={<FaUser />} placeholder="Dela Cruz" />
            <InputField placeholder="Juan" />
            <InputField placeholder="Middle Name" />
            <InputField placeholder="Suffix" />

            <InputField icon={<FaUser />} placeholder="@juandelacruz" />
            <InputField
              icon={<FaEnvelope />}
              placeholder="juandelacruz@gmail.com"
            />

            <InputField icon={<FaMapMarkerAlt />} placeholder="Street" />
            <InputField placeholder="Barangay" />
            <InputField placeholder="Municipality" />
            <InputField placeholder="Province" />
            <InputField placeholder="Zip Code" />
          </div>

          {/* Buttons */}
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

function InputField({ icon, placeholder }) {
  return (
    <div className="input-field">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        type="text"
        placeholder={placeholder}
        className={`input ${icon ? "input-with-icon" : ""}`}
      />
    </div>
  );
}

export default Profile;
