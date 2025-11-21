// Finished fixing footer start
import papaiaLogo from "../../assets/ic_papaia_logo_no_word.png";
import { Link } from "react-router-dom";

export default function FooterStart() {
  return (
    <footer className="bg-[#2D5016] text-white px-4 sm:px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Logo + Description */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <img
                src={papaiaLogo}
                alt="Papaia Logo"
                className="w-5 h-7 sm:w-6 sm:h-8 md:w-7 md:h-9"
              />
              <span className="text-white text-xl font-bold">Papaia</span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-6 max-w-xs mx-auto sm:mx-0">
              Cultivating the future of agriculture with smart technology
              solutions.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-white text-base font-semibold">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/pricing-home"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#16A34A] text-center">
          <p className="text-gray-300 text-sm sm:text-base">
            © 2025 Papaia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
