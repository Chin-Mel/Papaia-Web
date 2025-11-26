import { X, User, Phone, CheckCircle, Trash2, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";
import defaultUserPic from "../../assets/default-user.png";

function FarmerDetailModal({ isOpen, onClose, onRemoveFarmer, farmer }) {
  if (!isOpen || !farmer) return null;

  const fullName = [
    farmer.firstname || farmer.firstName || "",
    farmer.middlename || farmer.middleName || "",
    farmer.lastname || farmer.lastName || "",
    farmer.suffix || "",
  ]
    .filter(Boolean)
    .join(" ");

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-2xl p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Farmer Details</h2>
              <p className="text-white/90 text-sm">
                Complete farmer profile information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img
                src={farmer.profilePicture || defaultUserPic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-green-100 shadow-lg"
                onError={(e) => (e.target.src = defaultUserPic)}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-md">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {fullName || "N/A"}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Farmer ID:{" "}
                <span className="font-semibold text-gray-700">
                  {farmer.idNumber || "N/A"}
                </span>
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {farmer.status
                  ? farmer.status.charAt(0).toUpperCase() +
                    farmer.status.slice(1)
                  : "Active"}
              </span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <User className="w-5 h-5 text-orange-500" />
              <h4 className="font-bold text-gray-900">Personal Information</h4>
            </div>

            {/* First Name and Middle Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-xs font-medium mb-1">
                  First Name
                </p>
                <p className="text-gray-900 font-semibold">
                  {farmer.firstname || farmer.firstName || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-xs font-medium mb-1">
                  Middle Name
                </p>
                <p className="text-gray-900 font-semibold">
                  {farmer.middlename || farmer.middleName || "N/A"}
                </p>
              </div>
            </div>

            {/* Last Name and Suffix */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-xs font-medium mb-1">
                  Last Name
                </p>
                <p className="text-gray-900 font-semibold">
                  {farmer.lastname || farmer.lastName || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-xs font-medium mb-1">Suffix</p>
                <p className="text-gray-900 font-semibold">
                  {farmer.suffix || "N/A"}
                </p>
              </div>
            </div>

            {/* Contact Number and Birth Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-xs font-medium mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Contact Number
                </p>
                <p className="text-gray-900 font-semibold">
                  {farmer.contactNumber || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-xs font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Birth Date
                </p>
                <p className="text-gray-900 font-semibold">
                  {farmer.birthDate || "N/A"}
                </p>
              </div>
            </div>

            {/* Address - Full width */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <p className="text-gray-500 text-xs font-medium mb-1">Address</p>
              <p className="text-gray-900 font-semibold">
                {(() => {
                  const addressParts = [
                    farmer.street,
                    farmer.barangay,
                    farmer.municipality,
                    farmer.province,
                    farmer.zipcode || farmer.zipCode,
                  ].filter(Boolean);

                  return addressParts.length > 0
                    ? addressParts.join(", ")
                    : "N/A";
                })()}
              </p>
            </div>
          </div>

          {/* Remove Button */}
          <div className="mt-6">
            <button
              onClick={onRemoveFarmer}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Farmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDetailModal;

// //new
// import { X, User, Phone, CheckCircle, Trash2, Calendar } from "lucide-react";
// import { useEffect, useRef } from "react";
// import defaultUserPic from "../../assets/default-user.png";

// function FarmerDetailModal({ isOpen, onClose, onRemoveFarmer, farmer }) {
//   if (!isOpen || !farmer) return null;

//   // Fixed field name handling - API returns lowercase field names
//   const fullName = [
//     farmer.firstname || farmer.firstName || "",
//     farmer.middlename || farmer.middleName || "",
//     farmer.lastname || farmer.lastName || "",
//     farmer.suffix || "",
//   ]
//     .filter(Boolean)
//     .join(" ");

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
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//               <User className="w-5 h-5 text-green-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">Farmer Details</h2>
//               <p className="text-white/80 text-sm">
//                 Complete farmer profile information
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Profile Section */}
//         <div className="p-6">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="relative">
//               <img
//                 src={farmer.profilePicture || defaultUserPic}
//                 alt="Profile"
//                 className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
//                 onError={(e) => (e.target.src = defaultUserPic)}
//               />
//               <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
//                 <CheckCircle className="w-3 h-3 text-white" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-bold text-gray-800 mb-1">
//                 {fullName || "N/A"}
//               </h3>
//               <p className="text-gray-500 text-sm mb-2">
//                 Farmer ID: {farmer.idNumber || "N/A"}
//               </p>
//               <span className="inline-flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 {farmer.status
//                   ? farmer.status.charAt(0).toUpperCase() +
//                     farmer.status.slice(1)
//                   : "Active"}
//               </span>
//             </div>
//           </div>

//           {/* Personal Info */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-2 mb-2">
//               <User className="w-4 h-4 text-orange-500" />
//               <h4 className="font-semibold text-gray-800 text-sm">
//                 Personal Information
//               </h4>
//             </div>
//             <div className="space-y-4">
//               {/* First Name and Middle Name - Side by side */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gray-200 p-2 rounded text-sm">
//                   <p className="text-gray-600 text-xs">First Name</p>
//                   <p className="text-gray-800 font-medium">
//                     {farmer.firstname || farmer.firstName || "N/A"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-200 p-2 rounded text-sm">
//                   <p className="text-gray-600 text-xs">Middle Name</p>
//                   <p className="text-gray-800 font-medium">
//                     {farmer.middlename || farmer.middleName || "N/A"}
//                   </p>
//                 </div>
//               </div>

//               {/* Last Name and Suffix - Side by side */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gray-200 p-2 rounded text-sm">
//                   <p className="text-gray-600 text-xs">Last Name</p>
//                   <p className="text-gray-800 font-medium">
//                     {farmer.lastname || farmer.lastName || "N/A"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-200 p-2 rounded text-sm">
//                   <p className="text-gray-600 text-xs">Suffix</p>
//                   <p className="text-gray-800 font-medium">
//                     {farmer.suffix || "N/A"}
//                   </p>
//                 </div>
//               </div>

//               {/* Contact Number and Birth Date - Side by side */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gray-200 p-2 rounded text-sm">
//                   <p className="text-gray-600 text-xs flex items-center gap-1">
//                     <Phone className="w-3 h-3" />
//                     Contact Number
//                   </p>
//                   <p className="text-gray-800 font-medium">
//                     {farmer.contactNumber || "N/A"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-200 p-2 rounded text-sm">
//                   <p className="text-gray-600 text-xs flex items-center gap-1">
//                     <Calendar className="w-3 h-3" />
//                     Birth Date
//                   </p>
//                   <p className="text-gray-800 font-medium">
//                     {farmer.birthDate || "N/A"}
//                   </p>
//                 </div>
//               </div>

//               {/* Address - Full width at bottom */}
//               <div className="bg-gray-200 p-2 rounded text-sm">
//                 <p className="text-gray-600 text-xs">Address</p>
//                 <p className="text-gray-800 font-medium">
//                   {(() => {
//                     const addressParts = [
//                       farmer.street,
//                       farmer.barangay,
//                       farmer.municipality,
//                       farmer.province,
//                       farmer.zipcode || farmer.zipCode,
//                     ].filter(Boolean);

//                     return addressParts.length > 0
//                       ? addressParts.join(", ")
//                       : "N/A";
//                   })()}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Remove Button */}
//           <div className="flex justify-center pt-4 px-6">
//             <button
//               onClick={onRemoveFarmer}
//               className="w-full px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
//             >
//               <Trash2 className="w-4 h-4" />
//               Remove Farmer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FarmerDetailModal;
