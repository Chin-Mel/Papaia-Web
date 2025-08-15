import papaiaLogo from "../../assets/papaia-logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#2D5016] text-white px-4 sm:px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* MODIFIED: Removed background and resized the logo */}
              <img
                src={papaiaLogo}
                alt="Papaia Logo"
                className="w-[50px] h-[50px] object-contain"
              />
              <span className="text-white text-xl font-bold">Papaia</span>
            </div>
            <p className="text-gray-300 text-base leading-6 max-w-xs">
              Cultivating the future of agriculture with smart technology
              solutions.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white text-base font-semibold">Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/demo"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  Demo
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden lg:block"></div>
        </div>

        <div className="pt-8 border-t border-[#16A34A] text-center">
          <p className="text-gray-300 text-base">
            © 2025 Papaia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
