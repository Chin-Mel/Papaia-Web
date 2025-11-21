import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserRoleModal({ isOpen, onSelect }) {
  const navigate = useNavigate(); // <-- add this

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 animate-fadeIn relative">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)} // <-- navigate back
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-center">
            Choose Your Role
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center mt-1">
            Tell us who you are so we can set up your Papaia experience.
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 mt-4">
          <button
            onClick={() => onSelect("farmer")}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md"
          >
            I am a Farmer
          </button>

          <button
            onClick={() => onSelect("owner")}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-md"
          >
            I am a Farm Owner
          </button>
        </div>
      </div>
    </div>
  );
}
