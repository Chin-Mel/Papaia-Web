import { Check, X } from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/Footer";
import MainBackground from "../assets/MainBackground.png";

// Mock images - replace with actual imports
const HeroBackground =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80";

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
      popular: false,
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
      popular: false,
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
      popular: true,
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
        "PDF expert reports & bulk data exports",
        "Priority support & system integration",
        "Centralized management",
      ],
      limitations: [],
      color: "from-blue-600 to-blue-700",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderMain />

      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={MainBackground || HeroBackground}
              alt="Background plants"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-full max-w-[842px] mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 md:p-12 mt-20 sm:mt-24 md:mt-28 lg:mt-25 mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Simple, Transparent Pricing
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-[719px] mx-auto">
                  Choose the perfect plan for your farming needs. From backyard
                  growers to large agribusinesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Explanation */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Affordable & Sustainable
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                Papaia's subscription model ensures accessibility for Filipino
                farmers while maintaining system quality and continuous
                improvements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-green-800 mb-2">
                    Affordable for Filipino Farmers
                  </h3>
                  <p className="text-sm text-gray-700">
                    The ₱199 Farmer Plan aligns with local income capacity.
                    Small-scale papaya farmers typically earn around ₱20,000+
                    per month, making this investment sustainable and valuable.
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-orange-800 mb-2">
                    Inclusive Features
                  </h3>
                  <p className="text-sm text-gray-700">
                    Paid farm owners automatically grant their team members
                    access to premium scanning tools, ensuring everyone benefits
                    from advanced disease detection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
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
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                    plan.popular ? "ring-2 ring-orange-500" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}

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

                  <div className="p-6">
                    <div className="space-y-3 mb-6">
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

        {/* Cost Breakdown */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Operational Transparency
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Understanding how subscription fees support Papaia's
                infrastructure
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Monthly OPEX */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-6">
                  Monthly Operating Costs
                </h3>
                <div className="space-y-4">
                  {[
                    { item: "Firebase (Database & Storage)", cost: "₱500" },
                    { item: "Google Gemini API", cost: "₱300" },
                    { item: "Render Hosting (Backend)", cost: "₱400" },
                    { item: "Vercel Hosting (Frontend)", cost: "₱150" },
                    { item: "System Maintenance & Support", cost: "₱650" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center pb-3 border-b border-green-200 last:border-0"
                    >
                      <span className="text-sm text-gray-700">{item.item}</span>
                      <span className="font-semibold text-green-700">
                        {item.cost}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-green-300">
                    <span className="font-bold text-gray-800">
                      Total Monthly OPEX
                    </span>
                    <span className="font-bold text-xl text-green-700">
                      ₱2,000
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue Projection */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-6">
                  Sample Revenue Projection
                </h3>
                <div className="space-y-4">
                  {[
                    { plan: "Free (100 users)", revenue: "₱0" },
                    { plan: "Farmer (30 users)", revenue: "₱5,970" },
                    { plan: "Basic (15 users)", revenue: "₱10,485" },
                    { plan: "Enterprise (5 users)", revenue: "₱6,495" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center pb-3 border-b border-orange-200 last:border-0"
                    >
                      <span className="text-sm text-gray-700">{item.plan}</span>
                      <span className="font-semibold text-orange-700">
                        {item.revenue}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-orange-300">
                    <span className="font-bold text-gray-800">
                      Total Monthly Revenue
                    </span>
                    <span className="font-bold text-xl text-orange-700">
                      ₱22,950
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                Subscription revenue ensures continuous system improvements, API
                usage coverage, and model updates without relying on external
                funding. This sustainable model keeps Papaia accessible and
                reliable for all farmers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-green-600 to-orange-500">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of Filipino farmers using Papaia to protect their
              crops and increase yields.
            </p>
            <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
              Start Your Free Trial
            </button>
          </div>
        </section>
      </main>

      <FooterMain />
    </div>
  );
}
