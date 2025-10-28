// Finished fixing footer main
import papaiaLogo from "../../assets/papaia-logo.png";

export default function FooterMain() {
  return (
    <footer className="bg-[#2D5016] text-white py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        {/* Logo */}
        <img
          src={papaiaLogo}
          alt="Papaia Logo"
          className="w-6 h-6 object-contain"
        />

        {/* All rights reserved */}
        <p className="text-gray-300 text-xs sm:text-sm">
          © 2025 Papaia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
