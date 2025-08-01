import React from "react";
import "./About.css";
import HeaderMain from "../../components/Header/HeaderMain";
import aboutUserImg from "../../assets/aboutuser.png";

function AboutPage() {
  return (
    <>
      <HeaderMain />
      <div className="about-container">
        <h1>About Papaia</h1>
        <p>
          Papaia is a mobile web application that helps prevent disease on
          leaves and fruits through AI-powered image scanning. It simplifies
          farm monitoring and disease detection, offering farmers and farm
          owners an accessible way to assess plant health. With features like
          scan history logging, farmer management, and user-friendly navigation,
          Papaia empowers farmers with accurate, fast, and affordable crop
          diagnostics powered by AI and accessible from any mobile device.
        </p>

        <div className="vision-mission">
          <div className="vision">
            <h2>Vision</h2>
            <p>
              To empower people through accessible, AI-driven precision
              agriculture tools. We aim to increase productivity and
              sustainability in farming communities by promoting smarter,
              faster, and more accurate plant health management.
            </p>
          </div>
          <div className="mission">
            <h2>Mission</h2>
            <p>
              Our mission is making digital tools in precision agriculture more
              accessible. Papaia is designed to provide fast, affordable, and
              accurate plant disease diagnosis with just a snap of a leaf or
              fruit.
            </p>
          </div>
        </div>

        <div className="usage">
          <h2>How to Use the Papaia App</h2>
          <ol>
            <li>Open the Papaia app on your smartphone or tablet.</li>
            <li>Log in or Sign up.</li>
            <li>Farm Owners can register their account and create farms.</li>
            <li>Assign Farmers to a farm via their User ID.</li>
            <li>
              Click the “Camera” icon to scan the image of diseased leaf or
              fruit.
            </li>
            <li>Submit the image and let AI diagnose the crop.</li>
            <li>
              Results will show detected disease, risk level, and
              recommendations.
            </li>
            <li>
              All scans are logged and can be reviewed anytime from the scan
              history.
            </li>
          </ol>
        </div>

        <div className="developers">
          <h2>The Developers</h2>
          <div className="dev-card">
            <img src={aboutUserImg} alt="Developer" />

            <div>
              <h3>John Michael Eborda</h3>
              <p>
                A BSCS student at USTP, passionate about UI/UX and full-stack
                development. He focuses on clean, functional design and seamless
                user interaction. As lead front-end dev, John crafted Papaia’s
                user interface and experience. He also handled API integration
                and bug fixes.
              </p>
            </div>
          </div>

          <div className="dev-card">
            <img src={aboutUserImg} alt="Developer" />

            <div>
              <h3>Erika Estomo</h3>
              <p>
                A BSCS student at USTP. Erika specializes in UI prototyping and
                front-end development. Her work ensures a cohesive user journey,
                and she contributed heavily to the design consistency and layout
                structuring across Papaia’s pages.
              </p>
            </div>
          </div>

          <div className="dev-card">
            <img src={aboutUserImg} alt="Developer" />

            <div>
              <h3>Francine Mecolle Duarte</h3>
              <p>
                A BSCS student at USTP with a strong interest in human-centered
                design and usability. Francine focused on design documentation,
                user testing, and QA validation of the Papaia platform.
              </p>
            </div>
          </div>

          <div className="dev-card">
            <img src={aboutUserImg} alt="Developer" />

            <div>
              <h3>Went Ruzel Igot</h3>
              <p>
                A BSCS student at USTP and Papaia’s lead back-end developer.
                Went developed and deployed the RESTful API that powers farm,
                farmer, and scan data. He focused on secure data handling,
                authentication, and AI result delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
