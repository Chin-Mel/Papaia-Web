import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";
import "./ScanHistoryDetailsPage.css";

export default function ScanHistory() {
  return (
    <div className="scan-history-page">
      <HeaderDashboard />

      <div className="scan-history-content">
        <div className="scan-container">
          <div className="scan-header">
            <h1>Scan History</h1>
            <a href="/dashboard" className="back-link">
              ← Back
            </a>
          </div>

          <div className="scan-card">
            <div className="scan-card-content">
              {/* Item 1: The Image */}
              <div className="scan-image">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6e47036d9364fab8c96d897444da3e6902d812d4?width=466"
                  alt="Healthy plant leaf"
                />
              </div>

              {/* Item 2: The Info block (without description) */}
              <div className="scan-info">
                <h2>Healthy</h2>

                <div className="no-disease-badge">
                  <img src="/src/assets/circle.png" alt="Badge" className="badge-icon" />
                  <span>No Disease</span>
                </div>
              </div>

              {/* Item 3: The Description, now a direct child */}
              <div className="scan-description">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nisi dolor, porta at ullamcorper at, pretium id turpis. Fusce feugiat fringilla est non aliquam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce porta vel ex eu vehicula. Maecenas cursus erat ac aliquam aliquet. Maecenas dapibus lorem nec ullamcorper laoreet. Donec euismod feugiat nulla, a fringilla massa bibendum a. Duis lacus orci, lobortis at ex nec, fringilla convallis diam. Suspendisse condimentum ullamcorper aliquam. Etiam feugiat nisi a nunc mollis, et feugiat sem cursus. Donec pellentesque odio ex. Donec sagittis venenatis iaculis. Nunc pretium euismod sapien. Donec maximus ligula purus, gravida accumsan enim elementum id. Etiam diam nunc, sagittis et urna nec, consequat interdum nulla. Etiam varius aliquet fringilla. Sed et dictum nisl. Donec pulvinar ullamcorper ultricies. Maecenas at augue viverra, rhoncus arcu quis, bibendum massa. Ut id porttitor eros. Curabitur eget mollis sapien. Duis at bibendum nibh. Vivamus tempus condimentum odio. Cras hendrerit, metus nec sollicitudin viverra, metus velit accumsan magna, malesuada consectetur leo tellus vitae risus. Duis purus nibh, dictum ac nibh nec, maximus sodales magna. Suspendisse ultrices ante eget tortor porttitor consequat. Suspendisse porta accumsan ligula, aliquam congue neque pharetra quis. Aenean et lectus in augue hendrerit dictum eget a lacus. Phasellus fermentum porta dui vel tempus. Curabitur eget mollis sapien. Duis at bibendum nibh. Vivamus tempus condimentum odio. Cras hendrerit, metus nec sollicitudin viverra, metus velit accumsan magna, malesuada consectetur leo tellus vitae risus. Duis purus nibh, dictum ac nibh nec, maximus sodales magna. Suspendisse ultrices ante eget tortor porttitor consequat. Suspendisse porta accumsan ligula, aliquam congue neque pharetra quis. Aenean et lectus in augue hendrerit dictum eget a lacus. Phasellus fermentum porta dui vel tempus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterMain />
    </div>
  );
}