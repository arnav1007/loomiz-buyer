 "use client";
 import React from "react";
 
 const FabricInhoused = ({ status = "Not Started", orderData }) => {
   const steps = ["Pending", "In Progress", "Completed"];

 
   // Logic: Packing Started is always completed visually
   const getCurrentStep = () => {
     if (status === "Not Started") return 1;       // Only step 1 marked done
     if (status === "In Progress") return 2;       // Step 1 & 2 done
     if (status === "Completed") return 3;         // All steps done
     return 1; // default fallback
   };
 
   const currentStep = getCurrentStep();
 
   const getBadge = () => {
     if (status === "Not Started") {
       return (
         <span className="text-xs font-medium bg-[#F5F5F5] text-[#757575] font-[NSregular] px-3 py-1 rounded-full">
           NOT STARTED
         </span>
       );
     } else if (status === "Completed") {
       return (
         <span className="text-xs font-medium bg-[#508E4E] text-white font-[NSregular] px-3 py-1 rounded-full">
           COMPLETED
         </span>
       );
     } else {
       return (
         <span className="text-xs font-medium bg-[#EDF5FF] text-[#233B6E] font-[NSregular] px-3 py-1 rounded-full">
           IN PROGRESS
         </span>
       );
     }
   };
 
   return (
     <div className="mx-10 my-10 shadow-md border border-[#E0E0E0] bg-white rounded-[10px]">
       <div className="flex justify-between items-center px-6 py-4">
         {/* Title */}
         <h2 className="w-80 font-[NSmedium] text-[#3F72AF] text-[24px] font-medium">
           FABRIC INHOUSED
         </h2>
 
         {/* Step Tracker */}
         <div className="flex flex-1 justify-center items-center relative ml-20 mr-20">
           {steps.map((label, index) => {
             const isCompleted = index < currentStep;
             const isCurrent = index === currentStep;
 
             return (
               <div className="flex flex-col items-center w-full relative" key={index}>
                 {/* Connector Line */}
                 {index > 0 && (
                   <div
                     className={`absolute top-2.5 left-[-50%] w-full h-0.5 z-0 ${
                       index < currentStep
                         ? "bg-[#4CAF50]"
                         : "border-t-2 border-dashed border-black"
                     }`}
                     style={{ width: "100%" }}
                   />
                 )}
 
                 {/* Step Circle */}
                 <div className="z-10">
                   {isCompleted ? (
                     <div className="w-5 h-5 bg-[#4CAF50] text-white text-[10px] flex items-center justify-center rounded-full">
                       ✓
                     </div>
                   ) : isCurrent ? (
                     <div className="w-5 h-5 border-2 border-black rounded-full bg-gray-400" />
                   ) : (
                     <div className="w-5 h-5 border-2 border-black rounded-full bg-white" />
                   )}
                 </div>
 
                 {/* Step Label */}
                 <div
                   className={`text-xs mt-1 font-[NSregular] text-center ${
                     isCompleted
                       ? "text-black"
                       : isCurrent
                       ? "text-gray-500"
                       : "text-black"
                   }`}
                 >
                   {label}
                 </div>
               </div>
             );
           })}
         </div>
 
         {/* Status Badge */}
         {getBadge()}
       </div>
     </div>
   );
 };
 
 


export default FabricInhoused;