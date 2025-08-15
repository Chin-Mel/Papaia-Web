import { useState } from "react";
import papaiaLogo from "../../assets/papaia-logo.png"; // Make sure this path is correct

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div
        className="w-full h-20 backdrop-blur-lg"
        style={{
          background: "rgba(255, 255, 255, 0.16)",
          border: "1px solid rgba(255, 255, 255, 0.01)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-papaia-orange-400 to-papaia-orange-500 flex items-center justify-center">
              <img
                src={papaiaLogo}
                alt="Papaia Logo"
                className="w-[50px] h-[50px]"
              />
            </div>
            <span className="text-2xl font-bold text-papaia-green-500">
              Papaia
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <a
              href="/"
              className="text-papaia-green-400 hover:text-papaia-green-500 transition-colors"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-papaia-green-400 hover:text-papaia-green-500 transition-colors"
            >
              About
            </a>
            <a
              href="/sign-in"
              className="text-papaia-green-400 hover:text-papaia-green-500 transition-colors"
            >
              Sign In
            </a>
            {/* --- MODIFIED SIGN UP BUTTON (Desktop) --- */}
            <button className="bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-shadow">
              Sign Up
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-papaia-green-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 p-4">
            <div className="flex flex-col gap-4">
              <a href="/" className="text-papaia-green-400 py-2">
                Home
              </a>
              <a href="/about" className="text-papaia-green-400 py-2">
                About
              </a>
              <a href="/sign-in" className="text-papaia-green-400 py-2">
                Sign In
              </a>
              {/* --- MODIFIED SIGN UP BUTTON (Mobile) --- */}
              <button className="bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white px-6 py-2.5 rounded-full mt-2">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
