import HeaderStart from "../components/Header/HeaderStart";
import Footer from "../components/Footer/FooterMain";

const developers = [
  {
    name: "John Michael Eborda",
    image: "/src/assets/eborda.png",
    description:
      "John Michael Eborda is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, currently serving as the Project Manager for the Papaia App development team. As a driven and organized individual, John Michael takes charge of overseeing the entire project lifecycle—from planning and scheduling to coordination and execution. He ensures that milestones are met on time, team collaboration remains smooth, and deliverables adhere to the scope and quality standards of the capstone project.\nBeyond his managerial responsibilities, John Michael also plays a hands-on role in the technical development of the Papaia App. He contributes to coding key features, troubleshooting issues, and integrating functional components of the system. His dual role as both manager and developer allows him to bridge the gap between planning and execution, ensuring that the vision of the Papaia App is realized both strategically and technically.\nHis leadership, dedication, and technical insight are instrumental in driving the project forward, making him a vital asset to the team.",
  },
  {
    name: "Erika Estomo",
    image: "/src/assets/estomo.jpg",
    description:
      "Erika Estomo is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, serving as the Technical Writer of the Papaia App development team. She is responsible for creating and maintaining clear, accurate, and well-structured documentation, including user manuals, system specifications, and project reports. Erika ensures that all written materials effectively convey the app's features, purpose, and technical workflows to both users and stakeholders.\nAside from her documentation duties, Erika also contributes to the web development of the Papaia App. She assists in building and refining the web-based interface, testing features, and supporting front-end improvements. Her dual strength in communication and technical implementation makes her a key bridge between design, development, and end-user clarity—making her an essential asset in both the writing and web development aspects of the project.",
  },
  {
    name: "Francine Mecolle Duarte",
    image: "/src/assets/duarte.png",
    description:
      "Francine Mecolla Duarte is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, serving as the Front-End Developer of the Papaia App development team. She is in charge of building the user interface of the application, ensuring that the design is responsive, intuitive, and accessible across devices. Her work focuses on translating design concepts into interactive, functional components that provide a seamless user experience for both farmers and administrators.\nIn addition to front-end development, Francine also contributes ideas to the app's user flow, design consistency, and usability improvements. Her attention to detail and understanding of user needs play a key role in making the Papaia App not only visually appealing but also easy to use in real-world agricultural settings.",
  },
  {
    name: "Went Ruzel Igot",
    image: "/src/assets/igot.png",
    description:
      "Went is a third-year Bachelor of Science in Information Technology (BSIT) student at the University of Cebu – Banilad Campus, and the Programmer and Back-End Developer of the Papaia App development team. He is primarily responsible for developing and maintaining the server-side logic, database structures, and core functionalities that power both the mobile and web versions of the app.\nWent ensures that user actions—such as scanning images, retrieving results, saving logs, and managing user accounts—are handled efficiently and securely behind the scenes. He also works closely with the front-end developers to integrate the user interface with the system's logic, enabling real-time communication between the app and its backend services. His strong technical skills and attention to system performance make him the backbone of the Papaia App's functionality, ensuring that it runs reliably and responds accurately to user needs.",
  },
];

const AboutHomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HeaderStart />

      <main className="flex-1 w-full pt-5">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-start items-start gap-8 py-8 lg:py-12">
            <div className="flex flex-col gap-8 w-full lg:flex-1">
              <div className="flex flex-col">
                <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-semibold text-black lg:leading-[59px]">
                  About Papaia
                </h1>
                <p className="text-base sm:text-lg lg:text-[20px] font-normal text-black text-justify lg:leading-[25px]">
                  Papaia is a mobile and web application that helps papaya
                  farmers detect diseases on leaves and fruits through
                  AI-powered image scanning. By simply using a smartphone
                  camera, farmers can scan affected areas, and the app will
                  identify the disease and provide suggested treatments. Papaia
                  aims to support early detection, reduce crop loss, and improve
                  papaya production through accessible and easy-to-use
                  technology.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 lg:gap-8 w-full">
                <div className="bg-[#fffbe6] rounded-[10px] p-5 lg:p-11 w-full lg:w-[46%] flex flex-col gap-4 min-h-[200px] lg:min-h-[250px] mt-4">
                  <h2 className="text-2xl lg:text-[32px] font-semibold text-black text-justify lg:leading-[39px]">
                    Vision
                  </h2>
                  <p className="text-base lg:text-[20px] font-normal text-black text-justify lg:leading-[25px]">
                    To empower papaya farmers through accessible, AI-driven
                    technology that enables early disease detection, informed
                    decision-making, and improved crop productivity—supporting
                    sustainable farming and agricultural innovation.
                  </p>
                </div>

                <div className="bg-[#fffbe6] rounded-[10px] p-5 lg:p-11 w-full lg:w-[46%] flex flex-col gap-4 min-h-[200px] lg:min-h-[250px] mt-4">
                  <h2 className="text-2xl lg:text-[32px] font-semibold text-black text-justify lg:leading-[39px]">
                    Mission
                  </h2>
                  <p className="text-base lg:text-[20px] font-normal text-black text-justify lg:leading-[25px]">
                    To become a leading digital tool in precision agriculture,
                    revolutionizing how farmers protect and care for their
                    papaya crops—one scan at a time.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <h2 className="text-2xl lg:text-[32px] font-semibold text-black lg:leading-[39px]">
                  How to Use the Papaia App
                </h2>
                <div className="text-base lg:text-[20px] font-normal text-black lg:leading-[35px]">
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 1: Open the App</strong>
                    <br />
                    Launch the Papaia app on your smartphone or tablet.
                  </p>
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 2: Log In or Register</strong>
                    <br />
                    New user? Tap Register to create an account.
                    <br />
                    Returning user? Enter your username and password to log in.
                  </p>
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 3: Access the Scanner Feature</strong>
                    <br />
                    On the home screen, tap the scan icon
                  </p>
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 4: Choose How to Scan</strong>
                    <br />
                    You can either:
                    <br />
                    Tap "Take a Photo" to capture a new image of a papaya leaf
                    or fruit.
                    <br />
                    Or tap "Upload from Gallery" to select an existing photo
                    from your device.
                  </p>
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 5: Submit for Analysis</strong>
                    <br />
                    After choosing or capturing an image, the app will process
                    the image using AI to detect any signs of disease.
                  </p>
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 6: View the Result</strong>
                    <br />
                    The app will show the detected disease, a short explanation,
                    and a suggested treatment.
                  </p>
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 7: Save or Log the Result</strong>
                    <br />
                    After, the scan result will be automatically saved to the
                    scan history log
                  </p>
                  <p className="mb-3 sm:mb-4">
                    <strong>Step 8: Scan Again Anytime</strong>
                    <br />
                    Return to the home screen to scan another leaf or fruit when
                    needed.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <h2 className="text-2xl lg:text-[32px] font-semibold text-black lg:leading-[39px]">
                  The Developers
                </h2>
              </div>
            </div>
          </div>

          <div className="py-8 lg:py-12">
            {developers.map((developer, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-8 px-4 lg:px-8 mb-12 sm:mb-16"
              >
                <div className="flex justify-center items-center w-full lg:w-auto">
                  <div className="w-[266px] h-[262px] bg-[#f0f0f0] shrink-0">
                    <img
                      src={developer.image}
                      alt={developer.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:gap-5 w-full lg:flex-1">
                  <h3 className="text-2xl lg:text-[32px] font-semibold text-black lg:leading-[38px]">
                    {developer.name}
                  </h3>
                  <p className="text-xs lg:text-[13px] font-normal text-black text-justify whitespace-pre-line lg:leading-[20px]">
                    {developer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
