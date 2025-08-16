import HeaderStart from "../components/Header/HeaderStart";
import Footer from "../components/Footer/FooterMain";

// 1. Import all necessary PNG assets from your local folder
import AnalyticsIconPNG from "../assets/analytics-icon.png";
import DiseaseIconPNG from "../assets/disease-icon.png";
import MobileIconPNG from "../assets/mobile-icon.png";
import ArrowIconPNG from "../assets/arrow-icon.png";
import HeroBackgroundPNG from "../assets/hero-background.png";

// 2. Redefine icon components to use simple <img> tags with the imported PNGs
const AnalyticsIcon = () => (
  <img src={AnalyticsIconPNG} alt="Crop analytics icon" className="w-6 h-6" />
);

const DiseaseIcon = () => (
  <img
    src={DiseaseIconPNG}
    alt="Disease identification icon"
    className="w-6 h-6"
  />
);

const MobileIcon = () => (
  // Adjusted size to better match the original SVG's proportions
  <img src={MobileIconPNG} alt="Mobile control icon" className="w-5 h-8" />
);

const ArrowIcon = () => (
  <img src={ArrowIconPNG} alt="Arrow icon" className="w-5 h-5" />
);

export default function Index() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] overflow-x-hidden">
      <HeaderStart />

      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            // 3. Use the imported local image for the background
            backgroundImage: `url(${HeroBackgroundPNG})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(12,32,29,0.3)] to-transparent" />

        <div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.21)",
            backdropFilter: "blur(5.4px)",
            border: "1px solid rgba(255, 255, 255, 0.01)",
            borderRadius: "40px",
            padding: "60px 40px",
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-[#2D5016]">Welcome to </span>
            <span className="text-[#FF8C42]">Papaia</span>
          </h1>

          <p className="text-xl text-white mb-7 max-w-3xl mx-auto leading-relaxed font-light">
            Revolutionizing agriculture through smart technology. Grow better,
            harvest smarter, and cultivate the future of sustainable farming.
          </p>

          <Link to="/sign-up">
            <button className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-shadow inline-flex items-center gap-3">
              Get Started
              <ArrowIcon />
            </button>
          </Link>
        </div>
      </section>

      {/* Smart Farming Solutions Section */}
      <section className="bg-[#F0FDF4] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2D5016] mb-4">
              Smart Farming Solutions
            </h2>
            <p className="text-xl text-[#2D5016] max-w-md mx-auto">
              Empowering farmers with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* --- Card 1: Crop Analytics (MODIFIED) --- */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#A7D399] to-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-6">
                <AnalyticsIcon />
              </div>
              <h3 className="text-xl font-bold text-[#2D5016] mb-4">
                Crop Analytics
              </h3>
              <p className="text-[#2D5016]">
                Real-time monitoring and data-driven insights for optimal crop
                management
              </p>
            </div>

            {/* --- Card 2: Disease Identification (MODIFIED) --- */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4A7C59] to-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-6">
                <DiseaseIcon />
              </div>
              <h3 className="text-xl font-bold text-[#2D5016] mb-4">
                Disease Identification
              </h3>
              <p className="text-[#2D5016]">
                Real-time disease identification with suggested treatments for
                disease control and maximize yield
              </p>
            </div>

            {/* --- Card 3: Mobile Control (MODIFIED) --- */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-full flex items-center justify-center mx-auto mb-6">
                <MobileIcon />
              </div>
              <h3 className="text-xl font-bold text-[#2D5016] mb-4">
                Mobile Control
              </h3>
              <p className="text-[#2D5016]">
                Manage your entire farm from anywhere with our intuitive web app
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-12 lg:p-16 text-center rounded-3xl bg-white shadow-lg">
            {/* --- MODIFIED Headline and Paragraph Text Color --- */}
            <h2 className="text-4xl lg:text-5xl font-bold text-[#4A7C59] mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-[#4A7C59] mb-12 max-w-2xl mx-auto">
              Join thousands of farmers who are already using Papaia to increase
              their productivity and sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* --- This button remains unchanged --- */}
              <button className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-shadow">
                Start Free Trial
              </button>
              {/* --- MODIFIED "Watch Demo" Button --- */}
              <button className="border-2 border-[#4A7C59] text-[#4A7C59] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#4A7C59] hover:text-white transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
