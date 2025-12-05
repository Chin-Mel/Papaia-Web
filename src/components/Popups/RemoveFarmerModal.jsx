import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  UserMinus,
  AlertTriangle,
  Loader2,
  XCircle,
  Database,
} from "lucide-react";
import defaultUserPic from "../../assets/default-user.png";
import Alert from "../../components/Alert";

// Remove Farmer Modal
function RemoveFarmerModal({ isOpen, onClose, onConfirmRemove, farmer }) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
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

  const handleConfirmRemove = async () => {
    if (confirmationText !== "REMOVE") {
      setHasError(true);
      setAlert({
        type: "error",
        message: 'Please type "REMOVE" in capital letters to confirm',
      });
      return;
    }

    setIsLoading(true);
    setHasError(false);
    try {
      await onConfirmRemove();
      setAlert({
        type: "success",
        message: "Farmer removed successfully!",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to remove farmer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
      setIsLoading(false);
      setHasError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getFullName = (farmer) => {
    if (!farmer) return "Unknown Farmer";
    return (
      [
        farmer.firstname || farmer.firstName || "",
        farmer.middlename || farmer.middleName || "",
        farmer.lastname || farmer.lastName || "",
        farmer.suffix || "",
      ]
        .filter(Boolean)
        .join(" ") || "Unknown Farmer"
    );
  };

  return (
    <>
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-6 relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-md border-2 border-white">
                <UserMinus className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-white flex-1">
                <h2 className="text-xl font-bold leading-tight">
                  Remove Farmer
                </h2>
                <p className="text-sm text-white/90 mt-0.5">
                  Remove Farmer from a farm
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

          <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-5">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {getFullName(farmer)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID:{" "}
                      <span className="font-semibold">
                        {farmer?.idNumber || "N/A"}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full mt-1">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-amber-900 mb-1">
                    Are you sure you want to remove this farmer?
                  </p>
                  <p className="text-sm text-amber-800">
                    This action cannot be undone and will have the following
                    consequences:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-red-900 text-sm mb-1">
                        Access Revoked
                      </p>
                      <p className="text-xs text-red-800">
                        Farmer will lose access to the farm.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-sm mb-1">
                        Data Retained
                      </p>
                      <p className="text-xs text-blue-800">
                        All their existing reports and analytics will remain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-800 font-semibold mb-2">
                  Type <span className="font-bold text-red-600">"REMOVE"</span>{" "}
                  to confirm this action:
                </p>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => {
                    setConfirmationText(e.target.value);
                    setHasError(false);
                  }}
                  placeholder="Type REMOVE here"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                    hasError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="p-6 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Remove Farmer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RemoveFarmerModal;

// import { useState, useEffect, useRef } from "react";
// import {
//   X,
//   UserMinus,
//   AlertTriangle,
//   EyeOff,
//   Loader2,
//   Info,
// } from "lucide-react";

// function RemoveFarmerModal({ isOpen, onClose, onConfirmRemove, farmer }) {
//   const [confirmationText, setConfirmationText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
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

//   const handleConfirmRemove = async () => {
//     if (confirmationText.toUpperCase() === "DEACTIVATE") {
//       setIsLoading(true);
//       try {
//         await onConfirmRemove();
//       } catch (error) {
//         console.error("Error deactivating farmer:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!isOpen) {
//       setConfirmationText("");
//       setIsLoading(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const getFullName = (farmer) => {
//     if (!farmer) return "Unknown Farmer";
//     return (
//       [
//         farmer.firstname || farmer.firstName || "",
//         farmer.middlename || farmer.middleName || "",
//         farmer.lastname || farmer.lastName || "",
//         farmer.suffix || "",
//       ]
//         .filter(Boolean)
//         .join(" ") || "Unknown Farmer"
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 relative">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center">
//               {farmer?.profilePicture ? (
//                 <img
//                   src={farmer.profilePicture}
//                   alt="Farmer"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <UserMinus className="w-6 h-6 text-gray-400" />
//               )}
//             </div>
//             <div className="text-white flex-1">
//               <h2 className="text-lg font-bold leading-tight">
//                 {getFullName(farmer)}
//               </h2>
//               <p className="text-sm text-white/90 mt-0.5">
//                 ID: {farmer?.idNumber || "N/A"}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-5">
//           <div className="flex items-start gap-3">
//             <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
//             <div>
//               <p className="font-semibold text-gray-800 mb-1">
//                 Deactivate this farmer?
//               </p>
//               <p className="text-sm text-gray-600">
//                 The farmer will be temporarily removed from this farm but their
//                 data will be preserved.
//               </p>
//             </div>
//           </div>

//           {/* Info Box */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//             <div className="flex items-start gap-2 mb-2">
//               <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//               <p className="font-semibold text-blue-900 text-sm">
//                 What happens:
//               </p>
//             </div>
//             <ul className="text-xs text-blue-800 space-y-1.5 ml-6">
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500">•</span>
//                 <span>Farmer marked as "Inactive" in team list</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500">•</span>
//                 <span>Future scans won't appear in farm analytics</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500">•</span>
//                 <span>All previous data and scans are preserved</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-blue-500">•</span>
//                 <span>Can be reactivated anytime</span>
//               </li>
//             </ul>
//           </div>

//           {/* Consequence Cards */}
//           <div className="space-y-3">
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
//               <EyeOff className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-semibold text-amber-800 text-sm mb-1">
//                   Temporary Access Loss
//                 </p>
//                 <p className="text-xs text-amber-700">
//                   Farmer will not be able to add new scans to this farm until
//                   reactivated
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Confirmation Input */}
//           <div>
//             <p className="text-sm text-gray-800 font-medium mb-2">
//               Type{" "}
//               <span className="font-bold text-amber-600">"DEACTIVATE"</span> to
//               confirm:
//             </p>
//             <input
//               type="text"
//               value={confirmationText}
//               onChange={(e) => setConfirmationText(e.target.value)}
//               placeholder="Type DEACTIVATE here"
//               className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-sm"
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         {/* Footer Buttons */}
//         <div className="p-4 border-t border-gray-200 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
//             disabled={isLoading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirmRemove}
//             disabled={
//               confirmationText.toUpperCase() !== "DEACTIVATE" || isLoading
//             }
//             className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Deactivating...
//               </>
//             ) : (
//               <>
//                 <UserMinus className="w-4 h-4" />
//                 Deactivate
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RemoveFarmerModal;
