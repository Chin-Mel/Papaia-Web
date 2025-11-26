import React, { useState } from "react";
import {
  CreditCard,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  CheckCircle,
  FileText,
} from "lucide-react";
import HeaderMain from "../components/Header/HeaderMain";
import FooterMain from "../components/Footer/Footer";

export default function ManageBillingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I upgrade my plan?",
      answer:
        "You can upgrade your plan by clicking the 'Upgrade Plan' button on any plan card. This will allow you to select a higher tier plan with more features and benefits.",
    },
    {
      question: "How does farmer access inherit from owner's subscription?",
      answer:
        "When you have an active subscription, all farmers you add to your farms automatically inherit access to the platform features based on your subscription tier. No separate subscription is needed for farmers.",
    },
    {
      question: "Will I be charged automatically?",
      answer:
        "Yes, your subscription will automatically renew at the end of each billing cycle using your saved payment method. You'll receive an email reminder before each renewal.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - would normally import HeaderMain */}
      <HeaderMain />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Current Plan Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-800">
                    Basic Plan
                  </h2>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                    ACTIVE
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  ₱800/monthly • Billed/month
                </p>
                <p className="text-sm text-gray-600">
                  Next billing date: December 11, 2024
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button className="px-4 py-2 bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white rounded-lg text-sm font-medium transition shadow hover:shadow-md">
                  Upgrade Plan
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section - Payment Method & Billing History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Payment Method
                </h3>
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Visa ending in 4242
                      </p>
                      <p className="text-sm text-gray-600">Expires 11/25</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">
                    Update
                  </button>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Billing History
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  View receipts, past charges, and subscription activity.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Receipt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-800">
                          Nov 11, 2024
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          Basic Plan - Monthly
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                          ₱800
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-800">
                          Oct 11, 2024
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          Basic Plan - Monthly
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                          ₱800
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-800">
                          Sep 11, 2024
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          Basic Plan - Monthly
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                          ₱800
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Section - Available Plans */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Available Plans
                </h3>

                {/* Plan 1 - Basic */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">Basic Plan</h4>
                      <p className="text-sm text-gray-600">₱800/month</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                      Current
                    </span>
                  </div>
                  <ul className="space-y-1 mb-4">
                    <li className="text-sm text-gray-700">• 1 farm</li>
                    <li className="text-sm text-gray-700">
                      • Basic monitoring
                    </li>
                    <li className="text-sm text-gray-700">
                      • Limited features
                    </li>
                  </ul>
                </div>

                {/* Plan 2 - Farmer */}
                <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">Farmer Plan</h4>
                      <p className="text-sm text-gray-600">₱299/month</p>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-4">
                    <li className="text-sm text-gray-700">• 3 farms</li>
                    <li className="text-sm text-gray-700">
                      • Advanced analytics
                    </li>
                    <li className="text-sm text-gray-700">• Weather alerts</li>
                  </ul>
                  <button className="w-full py-2 bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white rounded-lg text-sm font-medium hover:shadow-md transition">
                    Select Plan
                  </button>
                </div>

                {/* Plan 3 - Standard */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">Standard Plan</h4>
                      <p className="text-sm text-gray-600">₱599/month</p>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-4">
                    <li className="text-sm text-gray-700">• 5 farms</li>
                    <li className="text-sm text-gray-700">
                      • Enhanced analytics
                    </li>
                    <li className="text-sm text-gray-700">
                      • Priority support
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white rounded-lg text-sm font-medium hover:shadow-md transition">
                    Select Plan
                  </button>
                </div>

                {/* Plan 4 - Enterprise */}
                <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">Enterprise</h4>
                      <p className="text-sm text-gray-600">₱1,999/month</p>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-4">
                    <li className="text-sm text-gray-700">• Unlimited forms</li>
                    <li className="text-sm text-gray-700">• Custom features</li>
                    <li className="text-sm text-gray-700">
                      • Dedicated support
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">
                    Select Plan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing FAQs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Billing FAQs
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition rounded-lg"
                  >
                    <span className="font-medium text-gray-800 text-sm">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <FooterMain />
    </div>
  );
}
