import { useNavigate } from "react-router-dom";
import HeaderStart from "../components/Header/HeaderStart";
import FooterStart from "../components/Footer/FooterStart";
import AnalyticsIconPNG from "../assets/analytics-icon.png";
import DiseaseIconPNG from "../assets/disease-icon.png";
import MobileIconPNG from "../assets/mobile-icon.png";
import ArrowIconPNG from "../assets/arrow-icon.png";
import MainBackground from "../assets/MainBackground.png";

const AnalyticsIcon = () => (
  <img
    src={AnalyticsIconPNG}
    alt="Crop analytics"
    className="w-6 h-6 sm:w-8 sm:h-8"
    loading="eager"
  />
);

const DiseaseIcon = () => (
  <img
    src={DiseaseIconPNG}
    alt="Disease identification"
    className="w-6 h-6 sm:w-8 sm:h-8"
    loading="eager"
  />
);

const MobileIcon = () => (
  <img
    src={MobileIconPNG}
    alt="Mobile control"
    className="w-5 h-8 sm:w-7 sm:h-10"
    loading="eager"
  />
);

const ArrowIcon = () => (
  <img
    src={ArrowIconPNG}
    alt=""
    className="w-5 h-5 sm:w-6 sm:h-6"
    aria-hidden="true"
    loading="eager"
  />
);

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: AnalyticsIcon,
      title: "Crop Analytics",
      description:
        "Real-time monitoring and data-driven insights for optimal crop management",
    },
    {
      icon: DiseaseIcon,
      title: "Disease Identification",
      description:
        "Real-time disease identification with suggested treatments for disease control and maximize yield",
    },
    {
      icon: MobileIcon,
      title: "Mobile Control",
      description:
        "Manage your entire farm from anywhere with our intuitive web app",
    },
  ];

  const handleGetStarted = () => {
    navigate("/sign-up");
  };

  const handleWatchDemo = () => {
    navigate("/demo");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <HeaderStart />

      <main>
        <section className="relative h-[90vh] sm:h-[100vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 brightness-110"
            style={{ backgroundImage: `url(${MainBackground})` }}
            role="img"
            aria-label="Agricultural background"
          />

          <div className="relative z-10 w-full max-w-5xl mx-4 sm:mx-6 lg:mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 text-center mt-8 sm:mt-16 lg:mt-20 rounded-2xl sm:rounded-3xl lg:rounded-[40px] backdrop-blur-sm bg-white/20 border border-white/10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-[#2D5016]">Welcome to </span>
              <span className="text-[#FF8C42]">Papaia</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Revolutionizing agriculture through smart technology. Grow better,
              harvest smarter, and cultivate the future of sustainable farming.
            </p>

            <button
              onClick={handleGetStarted}
              className="transition-all duration-200 bg-[#FF8C42] hover:bg-[#e6782e] active:scale-95 text-white px-6 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold inline-flex items-center gap-3"
              aria-label="Get started with Papaia"
            >
              Get Started
              <ArrowIcon />
            </button>
          </div>
        </section>

        <section className="bg-[#F0FDF4] py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D5016] mb-3 sm:mb-4">
                Smart Farming Solutions
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#2D5016] max-w-2xl mx-auto">
                Empowering farmers with cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center space-y-4"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-gradient-to-r from-[#A7D399] to-[#8BC34A]"
                          : index === 1
                          ? "bg-gradient-to-r from-[#4A7C59] to-[#2D5016]"
                          : "bg-gradient-to-r from-[#FF8C42] to-[#F97316]"
                      }`}
                    >
                      <IconComponent />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2D5016]">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#2D5016] max-w-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A7C59] mb-4 sm:mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#4A7C59] mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of farmers who are already using Papaia to increase
              their productivity and sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto transition-all duration-200 active:scale-95 bg-[#FF8C42] hover:bg-[#e6782e] text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold"
              >
                Start Free Trial
              </button>
              <button
                onClick={handleWatchDemo}
                className="w-full sm:w-auto transition-all duration-200 active:scale-95 border-2 border-[#4A7C59] text-[#4A7C59] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-[#4A7C59] hover:text-white"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <FooterStart />
    </div>
  );
}
