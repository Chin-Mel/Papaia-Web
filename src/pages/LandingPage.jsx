// ✅ Use relative paths instead of alias (@)
import heroImage from "../assets/papaia1.png";

// ✅ Adjust this path based on actual location
import { Button } from "../components/ui/button";

// ✅ lucide-react works fine in Vite
import { Leaf, Stethoscope, Smartphone } from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Papaia</span>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6">
          Sign Up
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-orange-400">Papaia</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing agriculture through smart technology solutions for
            better crop management, disease prevention, and sustainable farming
            practices.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-full">
            Get Started →
          </Button>
        </div>
      </section>

      {/* Smart Farming Solutions */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Smart Farming Solutions
          </h2>
          <p className="text-gray-600 mb-16 text-lg">
            Empowering farmers with cutting-edge technology
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Crop Analytics */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Crop Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced data analysis and insights to optimize crop yield,
                monitor growth patterns, and make informed farming decisions.
              </p>
            </div>

            {/* Disease Identification */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Disease Identification
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Early detection and identification of plant diseases using
                AI-powered image recognition and expert recommendations.
              </p>
            </div>

            {/* Mobile Control */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Mobile Control
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Control and monitor your farm remotely through our intuitive
                mobile app with real-time notifications and updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
            Join thousands of farmers who have already embraced smart farming to
            increase their productivity and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-full">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg rounded-full"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Papaia</span>
              </div>
              <p className="text-green-200 text-sm">
                Smart farming solutions with cutting-edge technology
              </p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <h4 className="font-semibold mb-1">Product</h4>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Support</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-green-700 mt-6 pt-4 text-center">
            <p className="text-green-200 text-sm">
              © 2024 Papaia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
