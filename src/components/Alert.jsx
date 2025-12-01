// components/Alert.jsx
import React, { useEffect } from "react";

export default function Alert({
  type = "info",
  message,
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const colors = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`fixed top-5 right-5 max-w-xs w-full border-l-4 p-4 rounded shadow-md ${colors[type]} flex items-start justify-between gap-3 z-50`}
    >
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className="font-bold text-lg leading-none hover:text-opacity-80 transition"
      >
        ×
      </button>
    </div>
  );
}
