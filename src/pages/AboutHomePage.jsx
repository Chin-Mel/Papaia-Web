import HeaderStart from "../components/Header/HeaderStart";
import FooterStart from "../components/Footer/FooterStart";

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

export default function AboutHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderStart />

      <main>
        <section className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] bg-gradient-to-r from-papaia-green to-papaia-green-dark overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HeroBackground}
              alt="Background plants"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 h-full flex items-center justify-center">
            <div className="text-center">
              <div
                className="w-full max-w-[842px] mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg 
                  p-6 sm:p-8 md:p-12 
                  mt-20 sm:mt-24 md:mt-28 lg:mt-25 mb-8"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  About Papaia
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-[719px] mx-auto">
                  Revolutionizing agriculture through intelligent crop disease
                  detection and smart farming solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-papaia-text-primary mb-4">
                System Overview
              </h2>
              <p className="text-base sm:text-lg md:text-lg text-papaia-text-secondary leading-relaxed">
                Papaia is your intelligent agricultural companion, designed to
                help farmers and gardeners identify plant diseases, optimize
                crop health, and make informed farming decisions using advanced
                AI technology.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#94C522]/10 flex items-center justify-center">
                    <img
                      src={EyeIcon}
                      alt="Vision"
                      className="w-5 sm:w-7 h-5 sm:h-6"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-papaia-text-primary">
                    Our Vision
                  </h3>
                </div>
                <p className="text-papaia-text-secondary leading-relaxed text-sm sm:text-base">
                  To revolutionize agriculture through accessible AI technology,
                  empowering every farmer with the tools to achieve sustainable
                  and productive farming practices.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
                    <img
                      src={TargetIcon}
                      alt="Mission"
                      className="w-5 sm:w-6 h-5 sm:h-6"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-papaia-text-primary">
                    Our Mission
                  </h3>
                </div>
                <p className="text-papaia-text-secondary leading-relaxed text-sm sm:text-base">
                  To provide intelligent plant disease detection and
                  agricultural guidance, helping farmers increase yields while
                  promoting environmentally conscious farming methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-papaia-text-primary mb-4">
                Key Features
              </h2>
              <p className="text-base sm:text-lg text-papaia-text-secondary">
                Discover the powerful tools that make Papaia the perfect farming
                companion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: CameraIcon,
                  title: "Disease Identification",
                  text: "Simply scan your crops with your camera and get instant AI-powered disease identification with 95% accuracy",
                },
                {
                  icon: TrendingUpIcon,
                  title: "Smart Analytics",
                  text: "Track crop health, monitor disease patterns, and access detailed analytics to optimize your farming strategy",
                },
                {
                  icon: ClipboardListIcon,
                  title: "Treatment Suggestions",
                  text: "Receive personalized treatment recommendations from agricultural experts based on detected diseases",
                },
              ].map((feat, i) => (
                <div key={i} className="text-center p-4 sm:p-6">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <img
                      src={feat.icon}
                      alt={feat.title}
                      className="w-5 sm:w-8 h-5 sm:h-8"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-papaia-text-primary mb-2 sm:mb-4">
                    {feat.title}
                  </h3>
                  <p className="text-sm sm:text-base text-papaia-text-secondary leading-relaxed">
                    {feat.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-papaia-text-primary mb-4">
                How to Use the App
              </h2>
              <p className="text-base sm:text-lg text-papaia-text-secondary">
                Get started in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {["Capture", "Analyze", "Treat"].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF8C42] flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-papaia-text-primary mb-4">
                    {step}
                  </h3>
                  <p className="text-sm sm:text-base text-papaia-text-secondary leading-relaxed">
                    {
                      {
                        Capture:
                          "Take a clear photo of the affected plant or leaf using your smartphone camera",
                        Analyze:
                          "Our AI instantly analyzes the image and identifies potential diseases or issues",
                        Treat:
                          "Receive detailed treatment recommendations and track your crop's recovery progress",
                      }[step]
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-papaia-text-primary mb-4">
                Meet the Developers
              </h2>
              <p className="text-lg text-papaia-text-secondary">
                The passionate team behind Papaia
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {developers.map((dev, index) => (
                <div key={index} className="text-center">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                  />
                  <h3 className="text-xl font-bold text-papaia-text-primary mb-2">
                    {dev.name}
                  </h3>
                  <p className="text-[#FF8C42] font-medium mb-4">{dev.role}</p>
                  <p className="text-sm text-papaia-text-secondary leading-relaxed">
                    {dev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FooterStart />
    </div>
  );
}
