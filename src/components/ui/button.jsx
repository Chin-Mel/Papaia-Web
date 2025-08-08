// src/components/ui/button.jsx
import React from "react";

function Button({ children, className = "", variant = "default", ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition duration-200 focus:outline-none";

  const variants = {
    default: "bg-teal-600 hover:bg-teal-700 text-white",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
