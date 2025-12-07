import { Check, X } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/Footer";
import HeroBackground from "../assets/MainBackground.png";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "₱0",
      period: "/month",
      description: "Perfect for backyard growers testing Papaia",
      features: [
        "Up to 10 plant scans per month",
        "AI-based disease detection",
        "Basic treatment recommendations",
        "Mobile app access only",
      ],
      limitations: [
        "No real-time monitoring",
        "No analytics or reports",
        "No reminders",
        "No team access",
      ],
      color: "from-gray-500 to-gray-600",
    },
    {
      name: "Farmer",
      price: "₱199",
      period: "/month",
      description: "Ideal for individual farmers managing 1-2 farms",
      features: [
        "Up to 100 scans per month",
        "Disease detection & treatment suggestions",
        "Treatment reminders & progress tracking",
        "Farm health summary (basic analytics)",
        "Mobile app access",
      ],
      limitations: ["No web dashboard", "No multi-farm tools"],
      color: "from-green-500 to-green-600",
    },
    {
      name: "Basic",
      price: "₱699",
      period: "/month",
      description: "For small farm owners or cooperatives (up to 5 farmers)",
      features: [
        "Everything in Farmer Plan",
        "Farm management dashboard (web)",
        "Shared access with up to 5 field farmers",
        "Analytics and reports for multiple farms",
        "Real-time monitoring",
        "Treatment daily reminders for all members",
      ],
      limitations: [],
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Enterprise",
      price: "₱1,299",
      period: "/month",
      description: "For large-scale farms and agribusinesses",
      features: [
        "Everything in Basic Plan",
        "Unlimited farmer accounts",
        "Multi-farm & multi-location dashboard",
        "Advanced analytics & AI-driven insights",
        "Priority support & system integration",
        "Centralized management",
      ],
      limitations: [],
      color: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderMain />

      <main>
        <section className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HeroBackground}
              alt="Background plants"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 md:p-12 mt-20 sm:mt-24 md:mt-28 lg:mt-25 mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Simple, Transparent Pricing
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                  Choose the perfect plan for your farming needs. From backyard
                  growers to large agribusinesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Select the subscription that fits your farm size and needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 flex flex-col"
                >
                  <div
                    className={`bg-gradient-to-r ${plan.color} p-6 text-white`}
                  >
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm ml-1">{plan.period}</span>
                    </div>
                    <p className="text-sm text-white/90">{plan.description}</p>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-500">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        plan.name === "Free"
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg`
                      }`}
                    >
                      {plan.name === "Free"
                        ? "Get Started Free"
                        : "Choose Plan"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FooterMain />
    </div>
  );
}
