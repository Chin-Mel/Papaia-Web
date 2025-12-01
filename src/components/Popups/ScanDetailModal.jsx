// import { X } from "lucide-react";

// export default function ScanDetailModal({ isOpen, onClose, scan, farmerName }) {
//   if (!isOpen || !scan) return null;

//   const getCardStyle = (prediction) => {
//     const styles = {
//       Healthy: {
//         bg: "bg-emerald-50",
//         border: "border-emerald-700",
//         textColor: "text-emerald-700",
//         badgeBg: "bg-emerald-100",
//       },
//       "Ring Spot Virus": {
//         bg: "bg-orange-50",
//         border: "border-orange-600",
//         textColor: "text-orange-600",
//         badgeBg: "bg-orange-100",
//       },
//       Anthracnose: {
//         bg: "bg-rose-50",
//         border: "border-rose-600",
//         textColor: "text-rose-600",
//         badgeBg: "bg-rose-100",
//       },
//       "Powdery Mildew": {
//         bg: "bg-blue-50",
//         border: "border-blue-600",
//         textColor: "text-blue-600",
//         badgeBg: "bg-blue-100",
//       },
//     };

//     return (
//       styles[prediction] || {
//         bg: "bg-slate-50",
//         border: "border-slate-600",
//         textColor: "text-slate-600",
//         badgeBg: "bg-slate-100",
//       }
//     );
//   };

//   const formatDateTime = (timestamp) => {
//     try {
//       if (!timestamp) return { date: "", time: "" };

//       const parts = timestamp.trim().split(/\s+/);
//       if (parts.length !== 3) return { date: timestamp, time: "" };

//       const datePart = parts[0];
//       const timePart = parts[1];
//       const period = parts[2];

//       const [month, day, year] = datePart.split("/");
//       if (!month || !day || !year) return { date: timestamp, time: "" };

//       const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ];

//       const monthName = monthNames[parseInt(month) - 1];
//       const fullYear = year.length === 2 ? `20${year}` : year;

//       return {
//         date: `${monthName} ${parseInt(day)}, ${fullYear}`,
//         time: `${timePart} ${period}`,
//       };
//     } catch (error) {
//       return { date: timestamp, time: "" };
//     }
//   };

//   const getTreatmentSuggestions = (prediction) => {
//     if (!prediction) return [];

//     const predLower = prediction.toLowerCase();

//     if (predLower === "healthy") {
//       return [
//         "Continue regular monitoring of plant health",
//         "Maintain proper watering schedule",
//         "Ensure adequate sunlight and air circulation",
//         "Apply balanced fertilizer as needed",
//       ];
//     }

//     if (predLower.includes("ring spot") || predLower.includes("virus")) {
//       return [
//         "Apply copper-based fungicide (Copper sulfate) immediately",
//         "Remove and destroy all infected plant parts",
//         "Improve air circulation between plants",
//         "Reduce overhead watering to minimize moisture",
//       ];
//     }

//     if (predLower.includes("anthracnose")) {
//       return [
//         "Apply copper-based fungicide immediately",
//         "Remove and destroy all infected plant parts",
//         "Improve air circulation between plants",
//         "Reduce overhead watering to minimize moisture",
//         "Apply preventive fungicide sprays during wet seasons",
//       ];
//     }

//     if (predLower.includes("powdery mildew")) {
//       return [
//         "Apply sulfur-based or potassium bicarbonate fungicide",
//         "Improve air circulation around plants",
//         "Avoid overhead watering",
//         "Remove infected leaves and dispose properly",
//         "Apply preventive treatments during favorable conditions",
//       ];
//     }

//     return [
//       "Consult with agricultural extension officer for specific treatment",
//       "Remove and destroy infected plant parts",
//       "Apply appropriate fungicide or treatment",
//       "Monitor plant health closely",
//     ];
//   };

//   const parseSuggestions = (suggestions) => {
//     if (!suggestions) return [];
//     return suggestions
//       .split("\n")
//       .map((line) => line.replace(/^\*\s*/, "").trim())
//       .filter((line) => line.length > 0);
//   };

//   // Use result or prediction field (API uses 'result' in scan history)
//   const prediction = scan.result || scan.prediction;
//   const cardStyle = getCardStyle(prediction);
//   const dateTime = formatDateTime(scan.timestamp);
//   const confidencePercentage = Math.min(
//     100,
//     Math.max(0, Math.round((scan.confidence || 0) * 100))
//   );

//   const apiSuggestions = parseSuggestions(scan.suggestions);
//   const treatmentSuggestions = getTreatmentSuggestions(prediction);
//   const displaySuggestions =
//     apiSuggestions.length > 0 ? apiSuggestions : treatmentSuggestions;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
//           <h2 className="text-xl font-bold text-gray-800">Scan Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Image */}
//           <div className="flex justify-center">
//             <img
//               src={scan.imageUrl}
//               alt="Scan"
//               className="max-w-full max-h-96 rounded-lg border-2 border-gray-200 object-contain"
//               onError={(e) => {
//                 e.target.style.display = "none";
//                 e.target.nextSibling.style.display = "flex";
//               }}
//             />
//             <div
//               className="w-full h-64 rounded-lg border-2 border-gray-200 bg-gray-100 items-center justify-center text-gray-400 hidden"
//               style={{ display: "none" }}
//             >
//               <div className="text-center">
//                 <p className="text-lg font-medium">Image Not Available</p>
//                 <p className="text-sm">The scan image could not be loaded</p>
//               </div>
//             </div>
//           </div>

//           {/* Prediction Result */}
//           <div
//             className={`${cardStyle.bg} border-l-4 ${cardStyle.border} rounded-lg p-4`}
//           >
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-600">
//                 Disease Identified
//               </span>
//               <span
//                 className={`${cardStyle.badgeBg} ${cardStyle.textColor} px-3 py-1 rounded-full text-sm font-bold`}
//               >
//                 {prediction}
//               </span>
//             </div>

//             {/* Confidence Level */}
//             <div className="mt-4">
//               <div className="flex justify-between items-center text-sm mb-2">
//                 <span className="text-gray-600">Confidence Level</span>
//                 <span className="font-semibold text-gray-900">
//                   {confidencePercentage}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                 <div
//                   className={`h-2 rounded-full transition-all duration-500`}
//                   style={{
//                     width: `${confidencePercentage}%`,
//                     backgroundColor: cardStyle.border.includes("emerald")
//                       ? "#22c55e"
//                       : cardStyle.border.includes("orange")
//                       ? "#ea580c"
//                       : cardStyle.border.includes("rose")
//                       ? "#dc2626"
//                       : cardStyle.border.includes("blue")
//                       ? "#2563eb"
//                       : "#64748b",
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           {/* Details Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Date */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-xs text-gray-500 mb-1">Date</p>
//               <p className="text-sm font-semibold text-gray-800">
//                 {dateTime.date}
//               </p>
//             </div>

//             {/* Time */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-xs text-gray-500 mb-1">Time</p>
//               <p className="text-sm font-semibold text-gray-800">
//                 {dateTime.time}
//               </p>
//             </div>

//             {/* Farmer */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-xs text-gray-500 mb-1">Scanned By</p>
//               <p className="text-sm font-semibold text-gray-800">
//                 {farmerName}
//               </p>
//             </div>

//             {/* Farmer ID */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-xs text-gray-500 mb-1">Farmer ID</p>
//               <p className="text-sm font-semibold text-gray-800">
//                 {scan.idNumber}
//               </p>
//             </div>
//           </div>

//           {/* Suggested Treatment */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//               <div className="flex items-center gap-2">
//                 <div className="w-1 h-4 bg-green-500 rounded-sm"></div>
//                 <h3 className="text-sm font-semibold text-gray-900">
//                   Suggested Treatment
//                 </h3>
//               </div>
//             </div>
//             <div className="p-4">
//               <div className="bg-green-50 rounded-lg p-4">
//                 <h4 className="font-semibold text-gray-900 mb-3 text-sm">
//                   Immediate Action Required
//                 </h4>
//                 <ul className="space-y-2">
//                   {displaySuggestions.map((suggestion, idx) => (
//                     <li key={idx} className="flex items-start gap-2 text-sm">
//                       <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                         <svg
//                           className="w-2.5 h-2.5 text-white"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={3}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                       <span className="text-gray-700 leading-relaxed flex-1">
//                         {suggestion}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="w-full px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
