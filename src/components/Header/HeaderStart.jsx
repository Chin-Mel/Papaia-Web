import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import papaiaLogo from "../../assets/papaia-logo.png";

export default function HeaderStart() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about-home" },
    { id: "signin", label: "Sign In", href: "/sign-in" },
    { id: "signup", label: "Sign Up", href: "/sign-up" },
  ];

  const location = useLocation();

  // Only set activeNav if the path is in navItems
  const getInitialActiveNav = () => {
    const currentNav = navItems.find((item) => item.href === location.pathname);
    return currentNav ? currentNav.id : ""; // empty string = no active nav
  };

  const [activeNav, setActiveNav] = useState(getInitialActiveNav);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const navRefs = useRef({});

  useEffect(() => {
    const currentPath = location.pathname;
    const currentNav = navItems.find((item) => item.href === currentPath);
    if (currentNav) setActiveNav(currentNav.id);
    else setActiveNav(""); // no highlight for unknown paths like /forgot-password
  }, [location.pathname]);

  useEffect(() => {
    const updateIndicator = () => {
      const el = navRefs.current[activeNav];
      if (el) {
        setIndicatorStyle({
          width: el.offsetWidth,
          left: el.offsetLeft,
        });
      } else {
        setIndicatorStyle({ width: 0, left: 0 }); // hide indicator if no active nav
      }
    };

    updateIndicator();
    requestAnimationFrame(updateIndicator);

    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeNav]);

  const handleNavClick = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="w-full h-14 sm:h-16 backdrop-blur-lg shadow-sm"
        style={{
          background: "rgba(255, 255, 255, 0.16)",
          border: "1px solid rgba(255, 255, 255, 0.01)",
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-papaia-orange-400 to-papaia-orange-500 flex items-center justify-center">
              <img
                src={papaiaLogo}
                alt="Papaia Logo"
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </div>
            <span className="text-base sm:text-lg font-bold text-papaia-green-500">
              Papaia
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 relative">
            {/* Active indicator */}
            <div
              className="absolute top-0 h-full bg-gradient-to-r from-[#4A7C59] to-[#2D5016] rounded-full"
              style={{
                width: indicatorStyle.width,
                left: indicatorStyle.left,
              }}
            />
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                ref={(el) => (navRefs.current[item.id] = el)}
                onClick={handleNavClick}
                className={`relative z-10 px-3 py-1.5 rounded-full 
                  transition-colors text-sm sm:text-base
                  ${
                    activeNav === item.id
                      ? "text-white font-medium"
                      : "text-papaia-green-400 hover:text-papaia-green-500"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-papaia-green-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-14 sm:top-16 left-0 w-full bg-white shadow-lg border-t border-gray-200">
          <nav className="flex flex-col items-center py-4 gap-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleNavClick}
                className={`w-full text-center px-4 py-2 rounded-md transition ${
                  activeNav === item.id
                    ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white"
                    : "text-papaia-green-500 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
