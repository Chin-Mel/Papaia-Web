import { X, CheckCircle, Leaf, MapPin, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import React from "react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function FarmAddedSuccessModal({
  onClose,
  onViewDashboard,
  onAddAnother,
  farmData,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-orange-500 p-8 relative flex-shrink-0">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img
                  src={PapayaLogo}
                  alt="Papaia Logo"
                  className="w-7 h-9"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Farm Successfully Added!
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            <p className="text-center text-gray-600 mb-6">
              Your new farm has been registered and is now ready for management.
              You can start adding farmers and tracking your farm.
            </p>

            {/* Farm Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-slate-900 truncate">
                      {farmData?.name || "Green Valley Farm"}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full flex-shrink-0">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-600 truncate">
                      {farmData?.location || "Liloan, Cebu"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-slate-800 mb-3">
                What's Next?
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-slate-700 font-medium">
                    Invite team members
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAddAnother}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Add Another
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-orange-500 text-orange-600 font-bold py-3 px-4 rounded-xl hover:bg-orange-50 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { X, CheckCircle, Leaf, MapPin, Users } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import React from "react";
// import PapayaLogo from "../assets/ic_papaia_logo_no_word.png";

// export default function FarmAddedSuccessModal({
//   onClose,
//   onViewDashboard,
//   onAddAnother,
//   farmData,
// }) {
//   const modalRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//       >
//         {/* Header Section with Gradient */}
//         <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 sm:p-8 relative">
//           {/* Success Icon */}
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
//               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
//                 <img
//                   src={PapayaLogo}
//                   alt="Papaia Logo"
//                   className="w-5 h-7"
//                   loading="eager"
//                   decoding="async"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Title */}
//           <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
//             Farm Successfully Added!
//           </h2>

//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Main Content Area */}
//         <div className="p-6 sm:p-8">
//           {/* Confirmation Message */}
//           <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
//             Your new farm has been registered and is now ready for management.
//             You can start adding farmers and tracking your farm.
//           </p>

//           {/* Farm Details Card */}
//           <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 mb-6 border border-green-200/50">
//             <div className="flex items-center gap-3 sm:gap-4">
//               {/* Farm Icon */}
//               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
//                 <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//               </div>

//               {/* Farm Details */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">
//                     {farmData?.name || "Green Valley Farm"}
//                   </h3>
//                   <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full flex-shrink-0">
//                     Active
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
//                   <span className="text-xs sm:text-sm text-slate-600 truncate">
//                     {farmData?.location || "California, USA"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* What's Next Section */}
//           <div className="mb-6">
//             <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-3">
//               What's Next?
//             </h3>
//             <div className="space-y-2.5">
//               <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Users className="w-4 h-4 text-green-600" />
//                 </div>
//                 <span className="text-sm sm:text-base text-slate-700">
//                   Invite team members
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={onAddAnother}
//               className="w-full sm:flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
//             >
//               Add Another
//             </button>
//             <button
//               onClick={onClose}
//               className="w-full sm:flex-1 border-2 border-orange-500 text-orange-600 font-bold py-3 px-4 rounded-xl hover:bg-orange-50 transition-all active:scale-95"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
