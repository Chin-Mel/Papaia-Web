// DemoPage.jsx - Optimized Version
import { PlayCircle, Monitor, Smartphone } from "lucide-react";
import HeaderStart from "../components/Header/HeaderStart";
import FooterStart from "../components/Footer/FooterStart";
import HeroBackground from "../assets/MainBackground.png";

export default function DemoPage() {
  const tutorials = [
    {
      id: 1,
      platform: "Web",
      icon: Monitor,
      title: "Web Dashboard Tutorial",
      description:
        "Learn how to use Papaia's web dashboard to manage your farms, analyze disease patterns, and track crop health from your desktop.",
      embedUrl: "https://www.youtube.com/embed/i59JKkt8x6A?si=DsGwMZYvlTNdX4dZ",
      watchUrl: "https://youtu.be/i59JKkt8x6A",
      duration: "8:45",
      features: [
        "Add and manage farms",
        "Add and remove farmers",
        "View analytics and recent scans",
        "Access scan history and details",
        "Edit farm information and deactivate farms",
        "Navigate the dashboard and farm dashboard interface",
      ],
    },
    {
      id: 2,
      platform: "Mobile",
      icon: Smartphone,
      title: "Mobile App Tutorial",
      description:
        "Discover how to use the Papaia mobile app in the field to scan plants, get instant disease detection, and receive treatment recommendations.",
      embedUrl: "https://www.youtube.com/embed/7mlhoZLg_Hs?si=oLii3-wTu7GHZguX",
      watchUrl: "https://youtu.be/7mlhoZLg_Hs",
      duration: "6:30",
      features: [
        "Take photos of affected plants",
        "Use real-time disease detection",
        "Access treatment suggestions",
        "Set up reminders and alerts",
        "Sync with web dashboard",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderStart />

      <main>
        <section className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HeroBackground}
              alt="Agricultural background"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 h-full flex items-center justify-center">
            <div className="text-center w-full max-w-[842px] backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 md:p-12 mt-20 sm:mt-24 md:mt-28 lg:mt-32">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Tutorials & User Guides
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-[719px] mx-auto">
                Learn how to get the most out of Papaia with our comprehensive
                video tutorials
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Get Started with Papaia
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Whether you're using our web dashboard or mobile app, these
                step-by-step tutorials will help you master Papaia's features
                and make the most of AI-powered disease detection for your
                papaya farm.
              </p>
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="space-y-16">
              {tutorials.map((tutorial, index) => {
                const Icon = tutorial.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={tutorial.id}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                  >
                    <div className={isEven ? "lg:order-1" : "lg:order-2"}>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                        <div className="aspect-video">
                          <iframe
                            className="w-full h-full"
                            src={tutorial.embedUrl}
                            title={tutorial.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                          {tutorial.duration}
                        </div>
                      </div>
                    </div>

                    <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            tutorial.platform === "Web"
                              ? "bg-gradient-to-br from-green-500 to-green-600"
                              : "bg-gradient-to-br from-orange-500 to-orange-600"
                          }`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-full ${
                            tutorial.platform === "Web"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {tutorial.platform}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                        {tutorial.title}
                      </h3>

                      <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                        {tutorial.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-lg font-bold text-gray-800">
                          What You'll Learn:
                        </h4>
                        <ul className="space-y-2">
                          {tutorial.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <PlayCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm sm:text-base text-gray-700">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={tutorial.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-block mt-6 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                          tutorial.platform === "Web"
                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        }`}
                      >
                        Watch Full Tutorial on YouTube
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <FooterStart />
    </div>
  );
}
