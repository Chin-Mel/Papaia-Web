import { useState, useEffect } from "react";

export default function Alert({
  type = "info",
  message,
  onClose,
  duration = 3000,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!message) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    setTimeout(() => setIsVisible(true), 10);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message || !shouldRender) return null;

  const colors = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`fixed top-20 right-5 max-w-xs w-full border-l-4 p-4 rounded shadow-md ${colors[type]} z-50 transition-all duration-300 ease-out`}
      style={{
        transform: isVisible
          ? "translateX(0)"
          : "translateX(calc(100% + 1.25rem))",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <span className="flex-1 text-sm">{message}</span>
    </div>
  );
}
