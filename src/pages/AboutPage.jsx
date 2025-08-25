import {
  Target,
  Camera,
  TrendingUp,
  Leaf,
  Mail,
  Phone,
  MapPin,
  Sun,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-orange-500 py-20">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About Papaia</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Revolutionizing crop health with AI-powered insights for sustainable
            farming and food security.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {/* App Overview Section */}
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              App Overview
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Papaia is an innovative mobile application that empowers farmers
              with AI-powered crop disease detection, real-time analytics, and
              personalized treatment recommendations. Our cutting-edge
              technology helps farmers identify plant disease paths, optimize
              crop yields, and make data-driven decisions for sustainable
              agriculture.
            </p>
          </section>

          {/* Vision & Mission Section */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Our Vision */}
              <div className="bg-gray-100 rounded-lg p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center">
                    <Sun className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To create a world where every farmer has access to intelligent
                  agriculture tools that ensure food security, promote
                  sustainable farming practices, and maximize crop productivity
                  through advanced technology accessible to everyone.
                </p>
              </div>

              {/* Our Mission */}
              <div className="bg-gray-100 rounded-lg p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We develop innovative AI-powered tools that help farmers
                  detect crop diseases early, receive expert-hand
                  recommendations, and access comprehensive analytics to
                  optimize their farming operations and maximize yields.
                </p>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-700 mb-12">
              Discover the powerful tools that make Papaia the perfect farming
              companion
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Disease Identification */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Disease Identification
                </h3>
                <p className="text-gray-700">
                  Advanced AI technology that instantly identifies plant
                  diseases from photos, providing accurate diagnoses and early
                  detection capabilities.
                </p>
              </div>

              {/* Smart Analytics */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Smart Analytics
                </h3>
                <p className="text-gray-700">
                  Comprehensive data analysis and insights that help farmers
                  track crop health trends, optimize yields, and make informed
                  decisions.
                </p>
              </div>

              {/* Treatment Suggestions */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Treatment Suggestions
                </h3>
                <p className="text-gray-700">
                  Personalized treatment recommendations based on disease
                  identification, helping farmers implement effective solutions
                  quickly.
                </p>
              </div>
            </div>
          </section>

          {/* How to Use the App Section */}
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How to Use the App
            </h2>
            <p className="text-lg text-gray-700 mb-12">
              Get started in just three simple steps
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Capture
                </h3>
                <p className="text-gray-700">
                  Take a clear photo of the affected plant or leaf using your
                  smartphone camera for accurate analysis.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Analyze
                </h3>
                <p className="text-gray-700">
                  Our AI system processes the image and provides instant disease
                  identification with confidence levels.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Treat</h3>
                <p className="text-gray-700">
                  Receive personalized treatment recommendations and track the
                  progress of your crop recovery.
                </p>
              </div>
            </div>
          </section>

          {/* Meet the Developers Section */}
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet the Developers
            </h2>
            <p className="text-lg text-gray-700 mb-12">
              The passionate team behind Papaia
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Developer 1 */}
              <div className="text-center">
                <img
                  src="https://source.unsplash.com/120x120/?man,portrait,1"
                  alt="Alex Johnson"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Alex Johnson
                </h3>
                <p className="text-gray-600 mb-3">Project Manager</p>
                <p className="text-gray-700 text-sm">
                  Leads the development team and ensures project milestones are
                  met with precision and efficiency.
                </p>
              </div>

              {/* Developer 2 */}
              <div className="text-center">
                <img
                  src="https://source.unsplash.com/120x120/?woman,portrait,1"
                  alt="Sarah Chen"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Sarah Chen
                </h3>
                <p className="text-gray-600 mb-3">Lead Programmer</p>
                <p className="text-gray-700 text-sm">
                  Expert in AI and machine learning, responsible for the core
                  disease detection algorithms.
                </p>
              </div>

              {/* Developer 3 */}
              <div className="text-center">
                <img
                  src="https://source.unsplash.com/120x120/?man,portrait,2"
                  alt="Mike Rodriguez"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Mike Rodriguez
                </h3>
                <p className="text-gray-600 mb-3">UI/UX Designer</p>
                <p className="text-gray-700 text-sm">
                  Creates intuitive and beautiful user interfaces that make the
                  app accessible to farmers of all ages.
                </p>
              </div>

              {/* Developer 4 */}
              <div className="text-center">
                <img
                  src="https://source.unsplash.com/120x120/?woman,portrait,2"
                  alt="Sophia Kim"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Sophia Kim
                </h3>
                <p className="text-gray-600 mb-3">Content Writer</p>
                <p className="text-gray-700 text-sm">
                  Develops educational content and treatment guides to help
                  farmers understand crop diseases better.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Contact Information
            </h2>
            <p className="text-lg text-gray-700 mb-12">
              Get in touch with our team
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Email */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Email</h3>
                <p className="text-gray-700">info@papaia.com</p>
              </div>

              {/* Phone */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Phone</h3>
                <p className="text-gray-700">+1 (555) 123-4567</p>
              </div>

              {/* Address */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Address
                </h3>
                <p className="text-gray-700">
                  123 Innovation Drive, Tech City, TC 12345
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
