import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PapaiaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function HeaderStart() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about-home" },
    { id: "signin", label: "Sign In", href: "/sign-in" },
    { id: "signup", label: "Sign Up", href: "/sign-up" },
  ];

  const getActiveNav = (pathname) => {
    const currentNav = navItems.find((item) => item.href === pathname);
    return currentNav ? currentNav.id : "";
  };

  const [activeNav, setActiveNav] = useState(() =>
    getActiveNav(location.pathname)
  );

  useEffect(() => {
    setActiveNav(getActiveNav(location.pathname));
  }, [location.pathname]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="w-full h-14 sm:h-16 backdrop-blur-lg shadow-sm"
        style={{
          background: "rgba(255, 255, 255, 0.16)",
          border: "1px solid rgba(255, 255, 255, 0.01)",
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
              <img
                src={PapaiaLogo}
                alt="Papaia Logo"
                className="w-5 h-7 sm:w-6 sm:h-8 md:w-7 md:h-9 object-contain"
                loading="eager"
              />
            </div>
            <span className="text-base sm:text-lg font-bold text-green-900">
              Papaia
            </span>
          </Link>

          <nav className="hidden lg:flex gap-5" role="navigation">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`px-3 py-1.5 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-200 ${
                  activeNav === item.id
                    ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white"
                    : "text-black hover:text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="lg:hidden text-black hover:text-white hover:bg-gradient-to-r hover:from-[#4A7C59] hover:to-[#2D5016] rounded-md p-1.5 transition-all duration-200"
            onClick={handleMenuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-14 sm:top-16 left-0 w-full bg-white shadow-lg border-t border-gray-200">
          <nav
            className="flex flex-col items-center py-4 gap-3"
            role="navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleNavClick}
                className={`w-full max-w-xs text-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeNav === item.id
                    ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016] text-white"
                    : "text-black hover:text-white hover:bg-gradient-to-r hover:from-[#4A7C59] hover:to-[#2D5016]"
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
