import React from "react";

const UserAvatar = ({ name, profileImageUrl, className = "" }) => {
  // Rainbow colors excluding red/maroon
  const rainbowColors = [
    "#FF7F00", // orange
    "#FFFF00", // yellow
    "#00FF00", // green
    "#00FFFF", // cyan
    "#0000FF", // blue
    "#8A2BE2", // purple
    "#FF69B4", // pink
    "#FFD700", // gold
    "#40E0D0", // turquoise
    "#7FFF00", // chartreuse
  ];

  // Generate consistent color based on name (same name = same color)
  const getColorFromName = (name) => {
    if (!name) return rainbowColors[0];

    // Simple hash function to convert name to number
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use absolute value and modulo to get array index
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
    />
  ) : (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold select-none w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        aspectRatio: "1/1",
        fontSize: "inherit", // Allows parent to control text size
      }}
    >
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
