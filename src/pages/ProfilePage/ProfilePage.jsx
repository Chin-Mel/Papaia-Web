import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";

export default function ScanHistory() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/86f81d7c358b64369d114f5c71d4207222c59848?width=2880')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Scan History</h1>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>

        {/* Scan Result Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.3)] max-w-5xl mx-auto overflow-hidden">
          <div className="p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Plant Image */}
              <div className="flex-shrink-0">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6e47036d9364fab8c96d897444da3e6902d812d4?width=466"
                  alt="Healthy plant leaf with water droplets"
                  className="w-[233px] h-[187px] rounded-lg object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Status */}
                <h2 className="text-[41px] font-normal text-black mb-6 font-[Poppins]">Healthy</h2>

                {/* No Disease Badge */}
                <div className="inline-flex items-center bg-[#D5ED9F] rounded-full px-4 py-2 mb-8">
                  <div className="w-3.5 h-3.5 bg-[#00712D] rounded-full flex items-center justify-center mr-2">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </div>
                  <span className="text-black text-[15px] font-light font-[Poppins]">No Disease</span>
                </div>

                {/* Description */}
                <div className="text-black text-[15px] leading-normal space-y-4 font-[Poppins]">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nisi dolor, porta at ullamcorper at, pretium id turpis. Fusce feugiat fringilla est non aliquam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce porta vel ex eu vehicula. Maecenas cursus erat ac aliquam aliquet. Maecenas dapibus lorem nec ullamcorper laoreet. Donec euismod feugiat nulla, a fringilla massa bibendum a. Duis lacus orci, lobortis at ex nec, fringilla convallis diam. Suspendisse condimentum ullamcorper aliquam. Etiam feugiat nisi a nunc mollis, et feugiat sem cursus. Donec pellentesque odio ex.
                  </p>
                  <p>
                    Donec sagittis venenatis iaculis. Nunc pretium euismod sapien. Donec maximus ligula purus, gravida accumsan enim elementum id. Etiam diam nunc, sagittis et urna nec, consequat interdum nulla. Etiam varius aliquet fringilla. Sed et dictum nisl. Donec pulvinar ullamcorper ultricies. Maecenas at augue viverra, rhoncus arcu quis, bibendum massa. Ut id porttitor eros. Curabitur eget mollis sapien.
                  </p>
                  <p>
                    Duis at bibendum nibh. Vivamus tempus condimentum odio. Cras hendrerit, metus nec sollicitudin viverra, metus velit accumsan magna, malesuada consectetur leo tellus vitae risus. Duis purus nibh, dictum ac nibh nec, maximus sodales magna. Suspendisse ultrices ante eget tortor porttitor consequat. Suspendisse porta accumsan ligula, aliquam congue neque pharetra quis. Aenean et lectus in augue hendrerit dictum eget a lacus. Phasellus fermentum porta dui vel tempus.
                  </p>
                  <p>
                    Curabitur eget mollis sapien.
                  </p>
                  <p>
                    Duis at bibendum nibh. Vivamus tempus condimentum odio. Cras hendrerit, metus nec sollicitudin viverra, metus velit accumsan magna, malesuada consectetur leo tellus vitae risus. Duis purus nibh, dictum ac nibh nec, maximus sodales magna. Suspendisse ultrices ante eget tortor porttitor consequat. Suspendisse porta accumsan ligula, aliquam congue neque pharetra quis. Aenean et lectus in augue hendrerit dictum eget a lacus. Phasellus fermentum porta dui vel tempus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}