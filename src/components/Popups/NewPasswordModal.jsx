import { CheckCircle, Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function NewPassword({ onSubmit, loading, asModal = true }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSubmit(password); // delegate API call to parent
  };

  const content = (
    <motion.div
      initial={{ scale: asModal ? 0.8 : 1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: asModal ? 0.8 : 1, opacity: 0 }}
      className={`bg-white rounded-2xl shadow-lg w-[400px] p-6 relative ${
        asModal ? "" : "mx-auto mt-10"
      }`}
    >
      {/* Header Section */}
      <div className="text-center">
        <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">Congratulations</h2>
        <div className="flex items-center justify-center text-green-600 font-medium mt-1">
          <Shield className="w-4 h-4 mr-1" />
          Security Verified
        </div>
        <p className="text-gray-600 mt-2">
          Your OTP has been verified successfully. Set a new password below.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mt-6">
        <label className="text-gray-800 font-semibold flex items-center mb-1">
          <Lock className="w-4 h-4 mr-2 text-gray-600" /> New Password
        </label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl p-2 mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />

        <label className="text-gray-800 font-semibold flex items-center mb-1">
          <Lock className="w-4 h-4 mr-2 text-gray-600" /> Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-xl p-2 mb-6 focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "→ Save New Password"}
        </button>
      </form>
    </motion.div>
  );

  // If modal → center with backdrop, else render as page block
  return asModal ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {content}
    </div>
  ) : (
    content
  );
}
