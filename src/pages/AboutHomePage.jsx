import HeaderStart from "../components/Header/HeaderStart";
import Footer from "../components/Footer/FooterMain";

import EyeIcon from "../assets/eye-icon-about.png";
import TargetIcon from "../assets/target-icon.png";
import CameraIcon from "../assets/camera-icon.png";
import TrendingUpIcon from "../assets/trending-up-icon.png";
import ClipboardListIcon from "../assets/clipboard-list-icon.png";
import MailIcon from "../assets/mail-icon.png";
import PhoneIcon from "../assets/phone-icon.png";
import MapPinIcon from "../assets/map-pin-icon.png";

// Developer Images
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
      {/* Header */}

      <HeaderStart />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] bg-gradient-to-r from-papaia-green to-papaia-green-dark overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/bb0d2bc59ee3d72d5d9039aa22f5c9ddde787bea?width=2932"
              alt="Background plants"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-papaia-green to-papaia-green-dark opacity-80"></div>
          </div>
          <div className="relative max-w-[1440px] mx-auto px-20 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-full max-w-[842px] mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-12 mb-8">
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  About Papaia
                </h1>
                <p className="text-2xl text-white/90 leading-relaxed max-w-[719px] mx-auto">
                  Revolutionizing agriculture through intelligent crop disease
                  detection and smart farming solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-20">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-papaia-text-primary mb-4">
                App Overview
              </h2>
              <p className="text-lg text-papaia-text-secondary leading-relaxed">
                Papaia is an innovative mobile application that empowers farmers
                with AI-driven crop disease detection, real-time analytics, and
                personalized treatment recommendations. Our cutting-edge
                technology helps farmers identify plant diseases early, optimize
                crop yields, and make data-driven decisions for sustainable
                agriculture.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-20">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Our Vision */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#94C522]/10      flex items-center justify-center">
                    <img src={EyeIcon} alt="Vision" className="w-7 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-papaia-text-primary">
                    Our Vision
                  </h3>
                </div>
                <div className="text-papaia-text-secondary leading-relaxed space-y-2">
                  <p>
                    To create a world where every farmer has access to
                    intelligent
                  </p>
                  <p>
                    agricultural tools that ensure food security, promote
                    sustainable
                  </p>
                  <p>
                    farming practices, and maximize crop productivity through
                  </p>
                  <p>advanced technology and data-driven insights.</p>
                </div>
              </div>

              {/* Our Mission */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
                    <img src={TargetIcon} alt="Mission" className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-papaia-text-primary">
                    Our Mission
                  </h3>
                </div>
                <div className="text-papaia-text-secondary leading-relaxed space-y-2">
                  <p>
                    We develop innovative AI-powered solutions that help farmers
                  </p>
                  <p>detect crop diseases early, receive expert treatment</p>
                  <p>recommendations, and access comprehensive analytics to</p>
                  <p>optimize their farming operations and increase yields.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-papaia-text-primary mb-4">
                Key Features
              </h2>
              <p className="text-lg text-papaia-text-secondary">
                Discover the powerful tools that make Papaia the perfect farming
                companion
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Disease Identification */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
                  <img
                    src={CameraIcon}
                    alt="Disease Identification"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-bold text-papaia-text-primary mb-4">
                  Disease Identification
                </h3>
                <p className="text-papaia-text-secondary leading-relaxed">
                  Simply scan your crops with your camera and get instant
                  AI-powered disease identification with 95% accuracy
                </p>
              </div>

              {/* Smart Analytics */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
                  <img
                    src={TrendingUpIcon}
                    alt="Smart Analytics"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-bold text-papaia-text-primary mb-4">
                  Smart Analytics
                </h3>
                <p className="text-papaia-text-secondary leading-relaxed">
                  Track crop health, monitor disease patterns, and access
                  detailed analytics to optimize your farming strategy
                </p>
              </div>

              {/* Treatment Suggestions */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
                  <img
                    src={ClipboardListIcon}
                    alt="Treatment Suggestions"
                    className="w-5 h-8"
                  />
                </div>
                <h3 className="text-xl font-bold text-papaia-text-primary mb-4">
                  Treatment Suggestions
                </h3>
                <p className="text-papaia-text-secondary leading-relaxed">
                  Receive personalized treatment recommendations from
                  agricultural experts based on detected diseases
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use the App */}
        <section className="py-16 bg-[#E5E7EB]/10">
          <div className="max-w-[1440px] mx-auto px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-papaia-text-primary mb-4">
                How to Use the App
              </h2>
              <p className="text-lg text-papaia-text-secondary">
                Get started in just three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#FF8C42] flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-papaia-text-primary mb-4">
                  Capture
                </h3>
                <p className="text-papaia-text-secondary leading-relaxed">
                  Take a clear photo of the affected plant or leaf using your
                  smartphone camera
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#F97316] flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-papaia-text-primary mb-4">
                  Analyze
                </h3>
                <p className="text-papaia-text-secondary leading-relaxed">
                  Our AI instantly analyzes the image and identifies potential
                  diseases or issues
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#DE5B00] flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-papaia-text-primary mb-4">
                  Treat
                </h3>
                <p className="text-papaia-text-secondary leading-relaxed">
                  Receive detailed treatment recommendations and track your
                  crop's recovery progress
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Developers */}
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

        {/* Contact Information */}
        <section className="py-16 bg-[#E5E7EB]/10">
          <div className="max-w-[1440px] mx-auto px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-papaia-text-tertiary mb-4">
                Contact Information
              </h2>
              <p className="text-lg text-[#909090]">
                Get in touch with our team
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Email */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
                  <img src={MailIcon} alt="Email" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-papaia-text-tertiary mb-4">
                  Email
                </h3>
                <p className="text-[#909090]">support@papaia.com</p>
              </div>

              {/* Phone */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
                  <img src={PhoneIcon} alt="Phone" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-papaia-text-tertiary mb-4">
                  Phone
                </h3>
                <p className="text-[#909090]">+1 (555) 123-4567</p>
              </div>

              {/* Address */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
                  <img src={MapPinIcon} alt="Address" className="w-5 h-6" />
                </div>
                <h3 className="text-xl font-bold text-papaia-text-tertiary mb-4">
                  Address
                </h3>
                <p className="text-[#909090]">
                  123 Agriculture St, Farm City, FC 12345
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/*Footer*/}
      <Footer />
    </div>
  );
}
