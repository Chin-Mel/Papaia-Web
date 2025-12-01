import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PapaiaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function HeaderStart() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about-home" },
    { id: "signin", label: "Sign In", href: "/sign-in" },
    { id: "signup", label: "Sign Up", href: "/sign-up" },
  ];

  const location = useLocation();

  const getInitialActiveNav = () => {
    const currentNav = navItems.find((item) => item.href === location.pathname);
    return currentNav ? currentNav.id : "";
  };

  const [activeNav, setActiveNav] = useState(getInitialActiveNav);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const navRefs = useRef({});
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentNav = navItems.find((item) => item.href === currentPath);
    if (currentNav) setActiveNav(currentNav.id);
    else setActiveNav("");
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
        setIndicatorStyle({ width: 0, left: 0 });
      }
    };

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateIndicator();

    requestAnimationFrame(updateIndicator);

    updateTimeoutRef.current = setTimeout(updateIndicator, 100);

    const handleLoad = () => {
      updateIndicator();
    };

    window.addEventListener("load", handleLoad);
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", updateIndicator);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
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
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-16 flex items-center justify-center">
              <Link to="/">
                <img
                  src={PapaiaLogo}
                  alt="Papaia Logo"
                  className="w-5 h-7 sm:w-6 sm:h-8 md:w-7 md:h-9"
                />
              </Link>
            </div>
            <span className="text-base sm:text-lg font-bold text-green-900">
              Papaia
            </span>
          </div>
          <nav className="hidden lg:flex items-center gap-5 relative">
            <div
              className="absolute top-0 h-full bg-gradient-to-r from-[#4A7C59] to-[#2D5016] rounded-full transition-all duration-300 ease-out"
              style={{
                width: indicatorStyle.width,
                left: indicatorStyle.left,
                opacity: indicatorStyle.width > 0 ? 1 : 0,
              }}
            />
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                ref={(el) => (navRefs.current[item.id] = el)}
                onClick={handleNavClick}
                className={`relative z-10 px-3 py-1.5 rounded-full 
                  transition-colors text-sm sm:text-base whitespace-nowrap
                  ${
                    activeNav === item.id
                      ? "text-white font-medium"
                      : "text-green-600 hover:text-green-700"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="lg:hidden text-green-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
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
                    : "text-green-600 hover:bg-gray-100"
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
