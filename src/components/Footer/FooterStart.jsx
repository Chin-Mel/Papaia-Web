// FooterStart.jsx
import { Link } from "react-router-dom";
import papaiaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function FooterStart() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D5016] text-white px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-10">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <Link
              to="/"
              className="inline-flex items-center justify-center sm:justify-start gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={papaiaLogo}
                alt="Papaia Logo"
                className="w-5 h-7 sm:w-6 sm:h-8"
                loading="lazy"
              />
              <span className="text-white text-lg sm:text-xl font-bold">
                Papaia
              </span>
            </Link>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xs mx-auto sm:mx-0">
              Cultivating the future of agriculture with smart technology
              solutions.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h3 className="text-white text-base font-semibold">Product</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  to="/pricing-home"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h3 className="text-white text-base font-semibold">
              Contact Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="mailto:support@papaia.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  support@papaia.com
                </a>
              </li>
            </ul>
          </div>

          {/* Empty column for 4-column grid balance on desktop */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Copyright Section */}
        <div className="pt-6 border-t border-[#16A34A] text-center">
          <p className="text-gray-300 text-sm sm:text-base">
            © {currentYear} Papaia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
