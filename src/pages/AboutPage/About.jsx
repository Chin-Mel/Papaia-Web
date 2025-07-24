import React from 'react';
import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";
import './About.css';

const developers = [
  {
    name: "John Michael Eborda",
    image: "/src/assets/eborda.png",
    description: "John Michael Eborda is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, currently serving as the Project Manager for the Papaia App development team. As a driven and organized individual, John Michael takes charge of overseeing the entire project lifecycle—from planning and scheduling to coordination and execution. He ensures that milestones are met on time, team collaboration remains smooth, and deliverables adhere to the scope and quality standards of the capstone project.\nBeyond his managerial responsibilities, John Michael also plays a hands-on role in the technical development of the Papaia App. He contributes to coding key features, troubleshooting issues, and integrating functional components of the system. His dual role as both manager and developer allows him to bridge the gap between planning and execution, ensuring that the vision of the Papaia App is realized both strategically and technically.\nHis leadership, dedication, and technical insight are instrumental in driving the project forward, making him a vital asset to the team."
  },
  {
    name: "Erika Estomo",
    image: "/src/assets/estomo.jpg",
    description: "Erika Estomo is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, serving as the Technical Writer of the Papaia App development team. She is responsible for creating and maintaining clear, accurate, and well-structured documentation, including user manuals, system specifications, and project reports. Erika ensures that all written materials effectively convey the app's features, purpose, and technical workflows to both users and stakeholders.\nAside from her documentation duties, Erika also contributes to the web development of the Papaia App. She assists in building and refining the web-based interface, testing features, and supporting front-end improvements. Her dual strength in communication and technical implementation makes her a key bridge between design, development, and end-user clarity—making her an essential asset in both the writing and web development aspects of the project."
  },
  {
    name: "Francine Mecolle Duarte",
    image: "/src/assets/duarte.png",
    description: "Francine Mecolla Duarte is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, serving as the Front-End Developer of the Papaia App development team. She is in charge of building the user interface of the application, ensuring that the design is responsive, intuitive, and accessible across devices. Her work focuses on translating design concepts into interactive, functional components that provide a seamless user experience for both farmers and administrators.\nIn addition to front-end development, Francine also contributes ideas to the app's user flow, design consistency, and usability improvements. Her attention to detail and understanding of user needs play a key role in making the Papaia App not only visually appealing but also easy to use in real-world agricultural settings."
  },
  {
    name: "Went Ruzel Igot",
    image: "/src/assets/igot.png",
    description: "Went is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, and the Programmer and Back-End Developer of the Papaia App development team. He is primarily responsible for developing and maintaining the server-side logic, database structures, and core functionalities that power both the mobile and web versions of the app.\nWent ensures that user actions—such as scanning images, retrieving results, saving logs, and managing user accounts—are handled efficiently and securely behind the scenes. He also works closely with the front-end developers to integrate the user interface with the system's logic, enabling real-time communication between the app and its backend services. His strong technical skills and attention to system performance make him the backbone of the Papaia App's functionality, ensuring that it runs reliably and responds accurately to user needs."
  }
];

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <HeaderDashboard />

      {/* Main Content */}
      <main className="about-main">
        <div className="about-container">
          {/* Hero Section */}
          <div className="hero-section">
            {/* Left Content */}
            <div className="hero-content">
              {/* Title and Description */}
              <div className="title-section">
                <h1 className="main-title">
                  About Papaia
                </h1>
                <p className="main-description">
                  Papaia is a mobile and web application that helps papaya farmers detect diseases on leaves and fruits through AI-powered image scanning. By simply using a smartphone camera, farmers can scan affected areas, and the app will identify the disease and provide suggested treatments. Papaia aims to support early detection, reduce crop loss, and improve papaya production through accessible and easy-to-use technology.
                </p>
              </div>

              {/* Vision and Mission Cards */}
              <div className="vision-mission-container">
                {/* Vision Card */}
                <div className="vision-card">
                  <h2 className="card-title">
                    Vision
                  </h2>
                  <p className="card-description">
                    To empower papaya farmers through accessible, AI-driven technology that enables early disease detection, informed decision-making, and improved crop productivity—supporting sustainable farming and agricultural innovation.
                  </p>
                </div>

                {/* Mission Card */}
                <div className="mission-card">
                  <h2 className="card-title">
                    Mission
                  </h2>
                  <p className="card-description">
                    To become a leading digital tool in precision agriculture, revolutionizing how farmers protect and care for their papaya crops—one scan at a time.
                  </p>
                </div>
              </div>

              {/* How to Use Section */}
              <div className="how-to-use-section">
                <h2 className="section-title">
                  How to Use the Papaia App
                </h2>
                <div className="steps-container">
                  <p className="step"><strong>Step 1: Open the App</strong><br />Launch the Papaia app on your smartphone or tablet.</p>
                  <p className="step"><strong>Step 2: Log In or Register</strong><br />New user? Tap Register to create an account.<br />Returning user? Enter your username and password to log in.</p>
                  <p className="step"><strong>Step 3: Access the Scanner Feature</strong><br />On the home screen, tap the scan icon</p>
                  <p className="step"><strong>Step 4: Choose How to Scan</strong><br />You can either:<br />Tap "Take a Photo" to capture a new image of a papaya leaf or fruit.<br />Or tap "Upload from Gallery" to select an existing photo from your device.</p>
                  <p className="step"><strong>Step 5: Submit for Analysis</strong><br />After choosing or capturing an image, the app will process the image using AI to detect any signs of disease.</p>
                  <p className="step"><strong>Step 6: View the Result</strong><br />The app will show the detected disease, a short explanation, and a suggested treatment.</p>
                  <p className="step"><strong>Step 7: Save or Log the Result</strong><br />After, the scan result will be automatically saved to the scan history log</p>
                  <p className="step"><strong>Step 8: Scan Again Anytime</strong><br />Return to the home screen to scan another leaf or fruit when needed.</p>
                </div>
              </div>

              {/* The Developers Section */}
              <div className="developers-header">
                <h2 className="section-title">
                  The Developers
                </h2>
              </div>
            </div>
          </div>

          {/* Developer Profile Section */}
          <div className="developers-section">
            {developers.map((developer, index) => (
              <div key={index} className="developer-profile">
                {/* Developer Image */}
                <div className="developer-image-container">
                  <div className="developer-image-wrapper">
                    <img 
                      src={developer.image}
                      alt={developer.name}
                      className="developer-image"
                    />
                  </div>
                </div>

                {/* Developer Info */}
                <div className="developer-info">
                  <h3 className="developer-name">
                    {developer.name}
                  </h3>
                  <p className="developer-description">
                    {developer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterMain />
    </div>
  );
};

export default AboutPage;