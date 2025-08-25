import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import papaiaLogo from "../../assets/papaia-logo.png";

export default function HeaderStart() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const location = useLocation();
  const navRefs = useRef({});

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about-home" },
    { id: "signin", label: "Sign In", href: "/sign-in" },
    { id: "signup", label: "Sign Up", href: "/sign-up" },
  ];

  // Sync active nav with current route
  // Sync active nav with current route
  useEffect(() => {
    const currentPath = location.pathname;
    const currentNav = navItems.find((item) => item.href === currentPath);

    if (currentNav) {
      setActiveNav(currentNav.id);
    }
    // ❌ don't reset to "home" if no match
  }, [location.pathname]);

  // Update indicator position and size when activeNav changes
  useEffect(() => {
    const el = navRefs.current[activeNav];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeNav]);

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
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
          <nav className="hidden lg:flex items-center gap-7 relative">
            {/* Sliding indicator */}
            <div
              className="absolute top-0 h-full bg-gradient-to-r from-[#4A7C59] to-[#2D5016] rounded-full transition-all duration-300 ease-in-out"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />

            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                ref={(el) => (navRefs.current[item.id] = el)}
                onClick={() => handleNavClick(item.id)}
                className={`relative z-10 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeNav === item.id
                    ? "text-white font-medium"
                    : "text-papaia-green-400 hover:text-papaia-green-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
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
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                    activeNav === item.id
                      ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white"
                      : "text-papaia-green-400"
                  }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
