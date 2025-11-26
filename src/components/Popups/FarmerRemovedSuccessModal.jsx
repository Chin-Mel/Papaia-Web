import { CheckCircle, X, UserRoundMinus, ArrowLeft } from "lucide-react";
import { useRef, useEffect } from "react";
import defaultUserPic from "../../assets/default-user.png";

export default function FarmerRemovedSuccessModal({ isOpen, onClose, farmer }) {
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

  if (!isOpen) return null;

  const formatName = () => {
    if (!farmer) return "Unknown Farmer";
    const firstName = farmer.firstname || farmer.firstName || "";
    const middleName = farmer.middlename || farmer.middleName || "";
    const lastName = farmer.lastname || farmer.lastName || "";
    const suffix = farmer.suffix || "";
    const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(" ") : "Unknown Farmer";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-8 relative">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Farmer Removed Successfully
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-center text-gray-600 mb-6">
            The farmer has been removed from the farm management system.
            However, relevant data still remained.
          </p>

          {/* Farmer Card */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 mb-6 border-2 border-red-200">
            <div className="flex items-center gap-4">
              <img
                src={farmer?.profilePicture || defaultUserPic}
                alt="Farmer"
                className="w-14 h-14 rounded-full object-cover border-2 border-red-300 shadow-sm"
                onError={(e) => (e.target.src = defaultUserPic)}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 truncate">
                  {formatName()}
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  Farmer ID:{" "}
                  <span className="font-semibold">
                    #{farmer?.idNumber || "N/A"}
                  </span>
                </p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  Removed
                </span>
                {farmer?.farmName && (
                  <p className="text-xs text-slate-500 mt-1">
                    Farm: {farmer.farmName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

// import { CheckCircle, X, UserRoundMinus } from "lucide-react";
// import { useRef, useEffect } from "react";

// export default function FarmerRemovedSuccessModal({ isOpen, onClose, farmer }) {
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

//   if (!isOpen) return null;

//   const formatName = () => {
//     if (!farmer) return "Unknown Farmer";
//     const firstName = farmer.firstname || farmer.firstName || "";
//     const middleName = farmer.middlename || farmer.middleName || "";
//     const lastName = farmer.lastname || farmer.lastName || "";
//     const suffix = farmer.suffix || "";
//     const nameParts = [firstName, middleName, lastName, suffix].filter(Boolean);
//     return nameParts.length > 0 ? nameParts.join(" ") : "Unknown Farmer";
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 sm:p-8 relative">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
//               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//               </div>
//             </div>
//           </div>
//           <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
//             Farmer Deactivated!
//           </h2>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 sm:p-8">
//           <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
//             The farmer has been temporarily deactivated. Their data and scan
//             history are preserved. You can reactivate them anytime from the team
//             list.
//           </p>

//           {/* Farmer Info */}
//           <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 mb-6 border border-amber-200/50">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
//                 <UserRoundMinus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">
//                     {formatName()}
//                   </h3>
//                   <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full flex-shrink-0">
//                     Deactivated
//                   </span>
//                 </div>
//                 <p className="text-xs sm:text-sm text-slate-600 font-mono">
//                   ID: {farmer?.idNumber || "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Info Box */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
//             <p className="text-sm text-blue-900 font-medium mb-2">
//               What happens next?
//             </p>
//             <ul className="text-xs text-blue-800 space-y-1.5">
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500 mt-0.5">•</span>
//                 <span>Farmer appears as "Inactive" in the team list</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500 mt-0.5">•</span>
//                 <span>Future scans won't be added to this farm</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500 mt-0.5">•</span>
//                 <span>All previous data and scans are preserved</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500 mt-0.5">•</span>
//                 <span>Can be reactivated anytime</span>
//               </li>
//             </ul>
//           </div>

//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
