import React, { useState } from "react";
import { Check, X, ArrowLeft } from "lucide-react";
import Header from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free Plan",
      price: 0,
      period: "month",
      description: "Perfect for getting started",
      tagline: "Limited daily use(10) plant scanning",
      features: [
        "Limited daily use(10) plant scanning",
        "Disease identification",
        "Basic recommendations",
      ],
      limitations: [
        "No real-time monitoring",
        "No expert reports",
        "No treatment reminders",
        "No advanced analytics",
        "No priority support",
      ],
      buttonText: "Current Plan",
      buttonStyle: "bg-gray-400 text-white cursor-not-allowed",
      popular: false,
      isCurrent: true,
    },
    {
      name: "Pro Plan",
      price: isAnnual ? 119.88 : 9.99,
      originalPrice: isAnnual ? 239.76 : 19.99,
      period: isAnnual ? "year" : "month",
      description: "For dedicated farm owners",
      tagline: "Unlimited plant scans",
      features: [
        "Unlimited plant scans",
        "PDF expert reports",
        "Treatment reminders",
        "Advanced analytics",
        "Priority support",
      ],
      limitations: [
        "No shared access with farm workers",
        "No team management tools",
        "No centralized reporting",
      ],
      buttonText: "Subscribe Now",
      buttonStyle: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg",
      popular: true,
    },
    {
      name: "Farm Manager Plan",
      price: isAnnual ? 239.88 : 19.99,
      originalPrice: isAnnual ? 479.76 : 39.99,
      period: isAnnual ? "year" : "month",
      description: "For serious farm management",
      tagline: "Everything in Pro Plan plus team features",
      features: [
        "Everything in Pro Plan",
        "Shared web UI with farm workers",
        "Team management tools",
        "Centralized reporting",
        "Bulk data management",
        "Multi-farm dashboard",
        "Advanced team permissions",
      ],
      limitations: [],
      buttonText: "Subscribe Now",
      buttonStyle: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="py-8 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title - Centered */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 text-base lg:text-lg">
              Unlock powerful tools to manage your crops efficiently
            </p>
          </div>

          {/* Billing Toggle - Centered */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1 shadow-md">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 lg:px-8 py-2.5 rounded-full font-medium transition-all text-sm lg:text-base ${
                  !isAnnual
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 lg:px-8 py-2.5 rounded-full font-medium transition-all text-sm lg:text-base ${
                  isAnnual
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {isAnnual && (
            <p className="text-green-600 font-semibold text-center mb-8 text-sm lg:text-base">
              🎉 Save 50% with annual billing!
            </p>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
                  plan.popular
                    ? "ring-2 lg:ring-4 ring-orange-500 ring-opacity-50 lg:scale-105"
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm font-bold rounded-bl-2xl shadow-lg z-10">
                    MOST POPULAR
                  </div>
                )}

                {/* Current Plan Badge */}
                {plan.isCurrent && (
                  <div className="absolute top-0 right-0 bg-gray-500 text-white px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm font-bold rounded-bl-2xl">
                    CURRENT
                  </div>
                )}

                <div className="p-5 lg:p-8">
                  {/* Plan Name */}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base mb-4 lg:mb-6 min-h-[40px]">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mb-4 lg:mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl lg:text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 text-sm lg:text-base">
                        / {plan.period}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="mt-1">
                        <span className="text-gray-400 line-through text-sm lg:text-base">
                          ${plan.originalPrice}
                        </span>
                        <span className="text-green-600 font-semibold ml-2 text-sm lg:text-base">
                          Save {isAnnual ? "50%" : "50%"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled={plan.isCurrent}
                    className={`w-full py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg transition-all mb-6 lg:mb-8 ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Features */}
                  <div className="space-y-3 lg:space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 lg:gap-3">
                        <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm lg:text-base leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-3 lg:my-4"></div>
                        {plan.limitations.map((limitation, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 lg:gap-3 opacity-40"
                          >
                            <X className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 text-sm lg:text-base leading-snug">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Note */}
          <div className="mt-8 lg:mt-12 max-w-3xl mx-auto">
            <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4 lg:p-6 shadow-md">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">i</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">
                    Special Note
                  </h4>
                  <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                    If your Farm Manager is subscribed you don't need to pay for
                    the subscription and get access to all premium features
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 lg:mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6 lg:mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-base lg:text-lg text-gray-900 mb-2">
                  Can I switch plans anytime?
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes take effect immediately.
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-base lg:text-lg text-gray-900 mb-2">
                  Is there a free trial for Premium plans?
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Yes, we offer a 14-day free trial for both Pro and Farm
                  Manager plans. No credit card required.
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-base lg:text-lg text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  We accept credit cards, debit cards, GCash, and PayMaya.
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-base lg:text-lg text-gray-900 mb-2">
                  What happens if my Farm Manager subscribes?
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  If your Farm Manager has an active subscription, you
                  automatically get access to all premium features at no extra
                  cost!
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 lg:mt-16 text-center">
            <p className="text-gray-600 text-sm lg:text-base mb-4">
              Need help choosing?{" "}
              <a
                href="#"
                className="text-green-600 font-semibold hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
