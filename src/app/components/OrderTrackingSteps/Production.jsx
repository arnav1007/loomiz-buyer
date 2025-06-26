"use client";
import React, { useState } from "react";

const Production = ({ orderData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const showComments = true;

  const steps = [
    { name: "Cutting", completed: true },
    { name: "Stitching", completed: false },
    { name: "Washing", completed: false },
    { name: "Finishing", completed: false },
  ];

  const progressSteps = ["Pending", "In Progress", "Completed"];

  // ✅ Auto-derive status based on step completion
  const getDerivedStatus = () => {
    const completedCount = steps.filter(step => step.completed).length;
    if (completedCount === 0) return "Not Started";
    if (completedCount === steps.length) return "Completed";
    return "In Progress";
  };

  const derivedStatus = getDerivedStatus();

  const getCurrentStep = () => {
    if (derivedStatus === "Not Started") return 1;
    if (derivedStatus === "In Progress") return 2;
    if (derivedStatus === "Completed") return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const getBadge = () => {
    if (derivedStatus === "Not Started") {
      return (
        <span className="text-xs font-medium bg-[#F5F5F5] text-[#757575] font-[NSregular] px-3 py-1 rounded-full">
          NOT STARTED
        </span>
      );
    } else if (derivedStatus === "Completed") {
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
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 cursor-pointer" onClick={toggleDropdown}>
        <h2 className="font-[NSmedium] text-[#3F72AF] text-[24px] w-80">PRODUCTION</h2>

        {/* Top Tracker */}
        <div className="flex flex-1 justify-center items-center relative ml-20 mr-20">
          {progressSteps.map((stepLabel, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep - 1;

            return (
              <div className="flex flex-col items-center w-full relative" key={index}>
                {/* Connector */}
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

                {/* Dot */}
                <div className="z-10">
                  {isCompleted ? (
                    <div className="w-5 h-5 bg-[#4CAF50] text-white text-[10px] flex items-center justify-center rounded-full">✓</div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 border-2 border-black rounded-full bg-gray-400" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-black rounded-full bg-white" />
                  )}
                </div>

                {/* Label */}
                <div className="text-xs mt-1 font-[NSregular] text-center">
                  {stepLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge + Arrow */}
        <div className="flex items-center gap-4">
          {getBadge()}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown Section */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-6 mx-10 my-10">
          {steps.map((step, index) => {
            const startedOn = orderData?.[step.name]?.startedOn || "N/A";
            return (
              <div key={index} className="flex flex-col space-y-2 space-x-4">
                {/* Step */}
                <div className="flex items-center gap-3">
                  {step.completed ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                  )}
                  <div className="font-[NSmedium]   mx-2">{step.name}</div>
                  <span className="text-xs ont-[NSmedium] text-black ml-2">Started on {startedOn}</span>
                </div>

                {/* Comment section */}
                {showComments && (
                  <div>
                    <label className="text-sm font-[NSregular] block mb-1 mx-10">Comment :</label>
                    <input
                      type="text"
                      placeholder="Enter your comment"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md  text-sm mx-10 "
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Production;
