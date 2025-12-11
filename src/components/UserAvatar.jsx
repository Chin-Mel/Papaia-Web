import React from "react";

const UserAvatar = ({ name, profileImageUrl, className = "" }) => {
  const rainbowColors = [
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#00FFFF",
    "#0000FF",
    "#8A2BE2",
    "#FF69B4",
    "#FFD700",
    "#40E0D0",
    "#7FFF00",
  ];

  const getColorFromName = (name) => {
    if (!name) return rainbowColors[0];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % rainbowColors.length;
    return rainbowColors[index];
  };

  const bgColor = getColorFromName(name);
  const firstLetter = name?.charAt(0).toUpperCase() || "?";

  return profileImageUrl ? (
    <img
      src={profileImageUrl}
      alt={name || "User"}
      className={`rounded-full object-cover w-full h-full ${className}`}
      style={{ aspectRatio: "1/1" }}
      loading="eager"
    />
  ) : (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold select-none w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        aspectRatio: "1/1",
        fontSize: "inherit",
      }}
    >
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
