import React from "react";
import { FaLeaf, FaStethoscope, FaMobileAlt } from "react-icons/fa";

function LandingPage() {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/papaia1.png')` }} // ✅ CORRECT path
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">
          {/* Navbar */}
          <div className="flex justify-between items-center px-8 py-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <h1 className="text-white text-xl font-bold">Papaia</h1>
            </div>
            <nav className="space-x-6 text-white">
              <a href="#" className="hover:text-orange-300">
                Home
              </a>
              <a href="#" className="hover:text-orange-300">
                About
              </a>
              <a href="#" className="hover:text-orange-300">
                Sign In
              </a>
              <button className="ml-4 bg-white text-green-900 px-4 py-2 rounded hover:bg-gray-100">
                Sign Up
              </button>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="text-center my-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Welcome to <span className="text-orange-400">Papaia</span>
            </h2>
            <p className="text-lg text-white mt-4 max-w-xl mx-auto">
              Revolutionizing agriculture through smart technology. Grow better,
              harvest smarter, and cultivate the future of sustainable farming.
            </p>
            <button className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600">
              Get Started →
            </button>
          </div>
        </div>
      </div>

      {/* Smart Solutions Section */}
      <section className="bg-[#f0f8f0] py-16 px-8 text-center">
        <h3 className="text-3xl font-bold text-green-900">
          Smart Farming Solutions
        </h3>
        <p className="text-gray-600 mt-2 mb-12">
          Empowering farmers with cutting-edge technology
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <FaLeaf className="text-green-500 text-4xl mb-4" />
            <h4 className="text-lg font-semibold">Crop Analytics</h4>
            <p className="text-sm text-gray-600 mt-2">
              Real-time monitoring and data-driven insights for optimal crop
              management
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaStethoscope className="text-green-500 text-4xl mb-4" />
            <h4 className="text-lg font-semibold">Disease Identification</h4>
            <p className="text-sm text-gray-600 mt-2">
              Real-time disease identification with suggested treatments to
              control disease and maximize yield
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaMobileAlt className="text-orange-500 text-4xl mb-4" />
            <h4 className="text-lg font-semibold">Mobile Control</h4>
            <p className="text-sm text-gray-600 mt-2">
              Manage your entire farm from anywhere with our intuitive web app
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 px-8 bg-white">
        <h3 className="text-2xl md:text-3xl font-bold text-green-900">
          Ready to Transform Your Farm?
        </h3>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Join thousands of farmers who are already using Papaia to increase
          their productivity and sustainability.
        </p>
        <div className="mt-6 space-x-4">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600">
            Start Free Trial
          </button>
          <button className="border border-green-800 text-green-800 px-6 py-3 rounded-full hover:bg-green-100">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="font-bold">Papaia</span>
            </div>
            <p className="text-sm">
              Cultivating the future of agriculture with smart technology
              solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="text-sm space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Demo
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-center mt-6">
          © 2025 Papaia. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
