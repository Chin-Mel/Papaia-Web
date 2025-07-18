import React from 'react';
import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-global-7">
      {/* Header */}
      <HeaderDashboard />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row justify-start items-start gap-8 lg:gap-12 py-8 lg:py-12">
            {/* Left Content */}
            <div className="flex flex-col gap-8 lg:gap-14 w-full lg:flex-1">
              {/* Title and Description */}
              <div className="flex flex-col gap-4 lg:gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-inter font-semibold leading-tight lg:leading-[59px] text-global-1">
                  About Papaia
                </h1>
                <p className="text-base sm:text-lg lg:text-[20px] font-inter font-normal leading-relaxed lg:leading-[25px] text-global-1 text-justify">
                  Papaia is a mobile and web application that helps papaya farmers detect diseases on leaves and fruits through AI-powered image scanning. By simply using a smartphone camera, farmers can scan affected areas, and the app will identify the disease and provide suggested treatments. Papaia aims to support early detection, reduce crop loss, and improve papaya production through accessible and easy-to-use technology.
                </p>
              </div>

              {/* Vision and Mission Cards */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8 w-full">
                {/* Vision Card */}
                <div className="bg-global-6 rounded-[10px] p-5 lg:p-11 w-full lg:w-[46%] flex flex-col gap-4 lg:gap-6">
                  <h2 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[39px] text-global-1 text-justify mt-4 lg:mt-5">
                    Vission
                  </h2>
                  <p className="text-base lg:text-[20px] font-inter font-normal leading-relaxed lg:leading-[25px] text-global-1 text-justify">
                    To empower papaya farmers through accessible, AI-driven technology that enables early disease detection, informed decision-making, and improved crop productivity—supporting sustainable farming and agricultural innovation.
                  </p>
                </div>

                {/* Mission Card */}
                <div className="bg-global-6 rounded-[10px] p-5 lg:p-11 w-full lg:w-[46%] flex flex-col gap-2 lg:gap-2">
                  <h2 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[39px] text-global-1 text-justify">
                    Mission
                  </h2>
                  <p className="text-base lg:text-[20px] font-inter font-normal leading-relaxed lg:leading-[25px] text-global-1 text-justify mb-2">
                    To become a leading digital tool in precision agriculture, revolutionizing how farmers protect and care for their papaya crops—one scan at a time.
                  </p>
                </div>
              </div>

              {/* How to Use Section */}
              <div className="flex flex-col gap-4 lg:gap-4 w-full">
                <h2 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[39px] text-global-1">
                  How to Use the Papaia App
                </h2>
                <div className="text-base lg:text-[20px] font-inter font-normal leading-relaxed lg:leading-[35px] text-global-1 whitespace-pre-line">
                  {`Step 1: Open the App
Launch the Papaia app on your smartphone or tablet.
Step 2: Log In or Register
New user? Tap Register to create an account.
Returning user? Enter your username and password to log in.
Step 3: Access the Scanner Feature
On the home screen, tap the scan icon
Step 4: Choose How to Scan
You can either:
Tap "Take a Photo" to capture a new image of a papaya leaf or fruit. Or tap"Upload from Gallery" to select an existing photo from your device.
Step 5: Submit for Analysis
After choosing or capturing an image, the app will process the image using AI to detect any signs of disease.
Step 6: View the Result
The app will show the detected disease, a short explanation, and a suggested treatment.
Step 7: Save or Log the Result
After, the scan result will be automatically saved to the scan history log
Step 8: Scan Again Anytime
Return to the home screen to scan another leaf or fruit when needed.`}
                </div>
              </div>

              {/* The Developers Section */}
              <div className="flex flex-col gap-4 lg:gap-4 w-full">
                <h2 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[38px] text-global-1">
                  The Developers
                </h2>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:flex flex-col justify-start items-center w-[2%] mt-12">
              <div className="w-[24px] h-[114px] bg-global-8 rounded-[12px]"></div>
              <div className="w-[18px] h-[894px] bg-global-9 rounded-[8px] -mt-[114px] ml-[3px]"></div>
            </div>
          </div>

          {/* Developer Profile Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8 py-8 lg:py-12 px-4 lg:px-8">
            {/* Developer Image */}
            <div className="flex justify-center items-center w-full lg:w-auto">
              <div className="w-[266px] h-[262px] bg-global-3">
                <img 
                  src="/images/img_rectangle_101.png" 
                  alt="John Michael Eborda"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Developer Info */}
            <div className="flex flex-col gap-4 lg:gap-5 w-full lg:flex-1 lg:self-end">
              <h3 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[38px] text-global-1">
                John Michael Eborda
              </h3>
              <p className="text-xs lg:text-[13px] font-inter font-normal leading-relaxed lg:leading-[20px] text-global-1 text-justify">
                John Michael Eborda is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, currently serving as the Project Manager for the Papaia App development team. As a driven and organized individual, John Michael takes charge of overseeing the entire project lifecycle—from planning and scheduling to coordination and execution. He ensures that milestones are met on time, team collaboration remains smooth, and deliverables adhere to the scope and quality standards of the capstone project.
                {'\n\n'}
                Beyond his managerial responsibilities, John Michael also plays a hands-on role in the technical development of the Papaia App. He contributes to coding key features, troubleshooting issues, and integrating functional components of the system. His dual role as both manager and developer allows him to bridge the gap between planning and execution, ensuring that the vision of the Papaia App is realized both strategically and technically.
                {'\n\n'}
                His leadership, dedication, and technical insight are instrumental in driving the project forward, making him a vital asset to the team.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:gap-5 w-full lg:flex-1 lg:self-end">
              <h3 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[38px] text-global-1">
                Erika Estomo
              </h3>
              <p className="text-xs lg:text-[13px] font-inter font-normal leading-relaxed lg:leading-[20px] text-global-1 text-justify">
                Erika Estomo is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, serving as the Technical Writer of the Papaia App development team. She is responsible for creating and maintaining clear, accurate, and well-structured documentation, including user manuals, system specifications, and project reports. Erika ensures that all written materials effectively convey the app’s features, purpose, and technical workflows to both users and stakeholders.{'\n\n'}
                {'\n\n'}
                Aside from her documentation duties, Erika also contributes to the web development of the Papaia App. She assists in building and refining the web-based interface, testing features, and supporting front-end improvements. Her dual strength in communication and technical implementation makes her a key bridge between design, development, and end-user clarity—making her an essential asset in both the writing and web development aspects of the project.</p>
            </div>

            <div className="flex flex-col gap-4 lg:gap-5 w-full lg:flex-1 lg:self-end">
              <h3 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[38px] text-global-1">
                Francine Mecolle Duarte
              </h3>
              <p className="text-xs lg:text-[13px] font-inter font-normal leading-relaxed lg:leading-[20px] text-global-1 text-justify">
                Francine Mecolla Duarte is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, serving as the Front-End Developer of the Papaia App development team. She is in charge of building the user interface of the application, ensuring that the design is responsive, intuitive, and accessible across devices. Her work focuses on translating design concepts into interactive, functional components that provide a seamless user experience for both farmers and administrators.{'\n\n'}
                In addition to front-end development, Francine also contributes ideas to the app’s user flow, design consistency, and usability improvements. Her attention to detail and understanding of user needs play a key role in making the Papaia App not only visually appealing but also easy to use in real-world agricultural settings.</p>
            </div>
            
            <div className="flex flex-col gap-4 lg:gap-5 w-full lg:flex-1 lg:self-end">
              <h3 className="text-2xl lg:text-[32px] font-inter font-semibold leading-tight lg:leading-[38px] text-global-1">
                Went Ruzel Igot
              </h3>
              <p className="text-xs lg:text-[13px] font-inter font-normal leading-relaxed lg:leading-[20px] text-global-1 text-justify">
                Went is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, and the Programmer and Back-End Developer of the Papaia App development team. He is primarily responsible for developing and maintaining the server-side logic, database structures, and core functionalities that power both the mobile and web versions of the app.{'\n\n'}
                Went ensures that user actions—such as scanning images, retrieving results, saving logs, and managing user accounts—are handled efficiently and securely behind the scenes. He also works closely with the front-end developers to integrate the user interface with the system’s logic, enabling real-time communication between the app and its backend services. His strong technical skills and attention to system performance make him the backbone of the Papaia App’s functionality, ensuring that it runs reliably and responds accurately to user needs.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterMain />
    </div>
  );
};

export default AboutPage;