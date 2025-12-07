import { memo as memoAbout, useEffect as useEffectAbout } from "react";
import HeaderMain from "../components/Header/HeaderMain";
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

// Memoized Feature Card
const FeatureCard = memoAbout(({ icon, title, description }) => (
  <div className="text-center p-4 sm:p-6">
    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
      <img
        src={icon}
        alt=""
        className="w-5 sm:w-8 h-5 sm:h-8"
        loading="lazy"
        width="32"
        height="32"
      />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-[#2D5016] mb-2 sm:mb-4">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-[#4A7C59] leading-relaxed">
      {description}
    </p>
  </div>
));

// Memoized Step Card
const StepCard = memoAbout(({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF8C42] flex items-center justify-center mx-auto mb-4 sm:mb-6">
      <span className="text-2xl sm:text-3xl font-bold text-white">
        {number}
      </span>
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-[#2D5016] mb-3 sm:mb-4">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-[#4A7C59] leading-relaxed">
      {description}
    </p>
  </div>
));

// Memoized Developer Card
const DeveloperCard = memoAbout(({ name, role, image, description }) => (
  <div className="text-center">
    <img
      src={image}
      alt={name}
      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mx-auto mb-4 sm:mb-6"
      loading="lazy"
      width="128"
      height="128"
    />
    <h3 className="text-lg sm:text-xl font-bold text-[#2D5016] mb-2">{name}</h3>
    <p className="text-[#FF8C42] font-medium mb-3 sm:mb-4">{role}</p>
    <p className="text-sm text-[#4A7C59] leading-relaxed max-w-xs mx-auto">
      {description}
    </p>
  </div>
));

// Memoized Vision/Mission Card
const VisionMissionCard = memoAbout(({ icon, title, description, bgColor }) => (
  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}
      >
        <img
          src={icon}
          alt=""
          className="w-5 sm:w-7 h-5 sm:h-6"
          loading="lazy"
          width="28"
          height="24"
        />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-[#2D5016]">{title}</h3>
    </div>
    <p className="text-[#4A7C59] leading-relaxed text-sm sm:text-base">
      {description}
    </p>
  </div>
));

export default function AboutPage() {
  // Preload critical images
  useEffectAbout(() => {
    const images = [
      HeroBackground,
      EyeIcon,
      TargetIcon,
      CameraIcon,
      TrendingUpIcon,
      ClipboardListIcon,
      EbordaImage,
      EstomoImage,
      DuarteImage,
      IgotImage,
    ];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderMain />

      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HeroBackground}
              alt="Agricultural background"
              className="w-full h-full object-cover"
              width="1920"
              height="1080"
            />
          </div>

          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 h-full flex items-center justify-center mt-5">
            <div className="text-center w-full max-w-[842px] backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 md:p-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                About Papaia
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-[719px] mx-auto">
                Revolutionizing agriculture through intelligent crop disease
                detection and smart farming solutions
              </p>
            </div>
          </div>
        </section>

        {/* System Overview */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D5016] mb-4">
                System Overview
              </h2>
              <p className="text-base sm:text-lg text-[#4A7C59] leading-relaxed">
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
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <VisionMissionCard
                icon={EyeIcon}
                title="Our Vision"
                description="To revolutionize agriculture through accessible AI technology, empowering every farmer with the tools to achieve sustainable and productive farming practices."
                bgColor="bg-[#94C522]/10"
              />

              <VisionMissionCard
                icon={TargetIcon}
                title="Our Mission"
                description="To provide intelligent plant disease detection and agricultural guidance, helping farmers increase yields while promoting environmentally conscious farming methods."
                bgColor="bg-[#16A34A]/10"
              />
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D5016] mb-4">
                Key Features
              </h2>
              <p className="text-base sm:text-lg text-[#4A7C59]">
                Discover the powerful tools that make Papaia the perfect farming
                companion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D5016] mb-4">
                How to Use the App
              </h2>
              <p className="text-base sm:text-lg text-[#4A7C59]">
                Get started in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {steps.map((step) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D5016] mb-4">
                Meet the Developers
              </h2>
              <p className="text-base sm:text-lg text-[#4A7C59]">
                The passionate team behind Papaia
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
              {developers.map((dev, index) => (
                <DeveloperCard
                  key={dev.name}
                  name={dev.name}
                  role={dev.role}
                  image={dev.image}
                  description={dev.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
