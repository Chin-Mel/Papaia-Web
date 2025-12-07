import Header from "../components/Header/HeaderMain";
import Footer from "../components/Footer/Footer";

import EyeIcon from "../assets/eye-icon-about.png";
import TargetIcon from "../assets/target-icon.png";
import CameraIcon from "../assets/camera-icon.png";
import TrendingUpIcon from "../assets/trending-up-icon.png";
import ClipboardListIcon from "../assets/clipboard-list-icon.png";
import HeroBackground from "../assets/MainBackground.png";

import EbordaImage from "../assets/eborda.png";
import EstomoImage from "../assets/estomo.jpg";
import DuarteImage from "../assets/duarte.png";
import IgotImage from "../assets/igot.png";

const developers = [
  {
    name: "John Michael Eborda",
    role: "Project Manager",
    image: EbordaImage,
    description:
      "John Michael serves as Project Manager, overseeing planning, coordination, and execution phases.",
  },
  {
    name: "Erika Estomo",
    role: "Technical Writer",
    image: EstomoImage,
    description:
      "Erika assists in building web interface, testing features, and supporting front-end improvements.",
  },
  {
    name: "Francine Mecolle Duarte",
    role: "UI/UX Designer",
    image: DuarteImage,
    description:
      "Francine contributes ideas for user flow, design consistency, and usability improvements.",
  },
  {
    name: "Went Ruzel Igot",
    role: "Lead Programmer",
    image: IgotImage,
    description:
      "Went develops server-side logic, database structures, and core functionalities for the application.",
  },
];

const features = [
  {
    icon: CameraIcon,
    title: "Disease Identification",
    description:
      "Simply scan your crops with your camera and get instant AI-powered disease identification with 95% accuracy",
  },
  {
    icon: TrendingUpIcon,
    title: "Smart Analytics",
    description:
      "Track crop health, monitor disease patterns, and access detailed analytics to optimize your farming strategy",
  },
  {
    icon: ClipboardListIcon,
    title: "Treatment Suggestions",
    description:
      "Receive personalized treatment recommendations from agricultural experts based on detected diseases",
  },
];

const steps = [
  {
    number: 1,
    title: "Capture",
    description:
      "Take a clear photo of the affected plant or leaf using your smartphone camera",
  },
  {
    number: 2,
    title: "Analyze",
    description:
      "Our AI instantly analyzes the image and identifies potential diseases or issues",
  },
  {
    number: 3,
    title: "Treat",
    description:
      "Receive detailed treatment recommendations and track your crop's recovery progress",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] bg-gradient-to-r from-[#00712D] to-[#004d1f] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HeroBackground}
              alt="Background plants"
              className="w-full h-full object-cover opacity-40"
              loading="eager"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  About Papaia
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                  Revolutionizing agriculture through intelligent crop disease
                  detection and smart farming solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Overview */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                System Overview
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Papaia is your intelligent agricultural companion, designed to
                help farmers and gardeners identify plant diseases, optimize
                crop health, and make informed farming decisions using advanced
                AI technology.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <img
                      src={EyeIcon}
                      alt="Vision"
                      className="w-6 sm:w-7 h-6 sm:h-7"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  To revolutionize agriculture through accessible AI technology,
                  empowering every farmer with the tools to achieve sustainable
                  and productive farming practices.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <img
                      src={TargetIcon}
                      alt="Mission"
                      className="w-6 sm:w-7 h-6 sm:h-7"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  To provide intelligent plant disease detection and
                  agricultural guidance, helping farmers increase yields while
                  promoting environmentally conscious farming methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Discover the powerful tools that make Papaia the perfect farming
                companion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-4 sm:p-6 hover:transform hover:scale-105 transition-transform"
                >
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-8 sm:w-10 h-8 sm:h-10"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How to Use the App
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Get started in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Developers */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet the Developers
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                The passionate team behind Papaia
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {developers.map((developer, index) => (
                <div
                  key={index}
                  className="text-center hover:transform hover:scale-105 transition-transform"
                >
                  <img
                    src={developer.image}
                    alt={developer.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-gray-200 shadow-lg"
                    loading="lazy"
                  />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {developer.name}
                  </h3>
                  <p className="text-orange-500 font-medium mb-4">
                    {developer.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed px-2">
                    {developer.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
