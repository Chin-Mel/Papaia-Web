// Finished fixing the Landing page
import { Link } from "react-router-dom";
import HeaderStart from "../components/Header/HeaderStart";
import FooterStart from "../components/Footer/FooterStart";
import AnalyticsIconPNG from "../assets/analytics-icon.png";
import DiseaseIconPNG from "../assets/disease-icon.png";
import MobileIconPNG from "../assets/mobile-icon.png";
import ArrowIconPNG from "../assets/arrow-icon.png";
import HeroBackgroundPNG from "../assets/hero-background.png";

// Icon wrappers
const AnalyticsIcon = () => (
  <img
    src={AnalyticsIconPNG}
    alt="Crop analytics icon"
    className="w-6 h-6 sm:w-8 sm:h-8"
  />
);
const DiseaseIcon = () => (
  <img
    src={DiseaseIconPNG}
    alt="Disease identification icon"
    className="w-6 h-6 sm:w-8 sm:h-8"
  />
);
const MobileIcon = () => (
  <img
    src={MobileIconPNG}
    alt="Mobile control icon"
    className="w-5 h-8 sm:w-7 sm:h-10"
  />
);
const ArrowIcon = () => (
  <img src={ArrowIconPNG} alt="Arrow icon" className="w-5 h-5 sm:w-6 sm:h-6" />
);

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] overflow-x-hidden overflow-y-auto">
      <HeaderStart />

      {/* Hero Section */}
      <section className="relative h-[90vh] sm:h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HeroBackgroundPNG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(12,32,29,0.2)] to-transparent" />

        {/* Glassmorphism Box */}
        <div
          className=" relative z-10 w-full max-w-5xl mx-4 sm:mx-6 lg:mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 text-center mt-8 sm:mt-16 lg:mt-24 rounded-2xl sm:rounded-3xl lg:rounded-[40px] "
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#2D5016]">Welcome to </span>
            <span className="text-[#FF8C42]">Papaia</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Revolutionizing agriculture through smart technology. Grow better,
            harvest smarter, and cultivate the future of sustainable farming.
          </p>

          <Link to="/sign-up">
            <button className="transition-all duration-200 bg-[#e6782e] hover:bg-orange-500 active:scale-95 cursor-pointer bg-gradient-to-r text-white px-6 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold inline-flex items-center gap-3">
              Get Started
              <ArrowIcon />
            </button>
          </Link>
        </div>
      </section>

      {/* Smart Farming Solutions Section */}
      <section className="bg-[#F0FDF4] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D5016] mb-4">
              Smart Farming Solutions
            </h2>
            <p className="text-lg sm:text-xl text-[#2D5016] max-w-md mx-auto">
              Empowering farmers with cutting-edge technology
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center">
            {/* Crop Analytics */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#A7D399] to-[#8BC34A] rounded-full flex items-center justify-center">
                <AnalyticsIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2D5016]">
                Crop Analytics
              </h3>
              <p className="text-sm sm:text-base text-[#2D5016] max-w-xs">
                Real-time monitoring and data-driven insights for optimal crop
                management
              </p>
            </div>

            {/* Disease Identification */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#4A7C59] to-[#2D5016] rounded-full flex items-center justify-center">
                <DiseaseIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2D5016]">
                Disease Identification
              </h3>
              <p className="text-sm sm:text-base text-[#2D5016] max-w-xs">
                Real-time disease identification with suggested treatments for
                disease control and maximize yield
              </p>
            </div>

            {/* Mobile Control */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-full flex items-center justify-center">
                <MobileIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2D5016]">
                Mobile Control
              </h3>
              <p className="text-sm sm:text-base text-[#2D5016] max-w-xs">
                Manage your entire farm from anywhere with our intuitive web app
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="p-6 sm:p-10 lg:p-16 text-center rounded-3xl bg-white shadow-lg">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A7C59] mb-4 sm:mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#4A7C59] mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join thousands of farmers who are already using Papaia to increase
              their productivity and sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="transition-all duration-200 active:scale-95 cursor-pointer bg-gradient-to-r bg-[#FF8C42] hover:bg-orange-500 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold">
                Start Free Trial
              </button>
              <button className="transition-all duration-200 active:scale-95 cursor-pointer border-2 border-[#4A7C59] text-[#4A7C59] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-[#4A7C59] hover:text-white">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterStart />
    </div>
  );
}
