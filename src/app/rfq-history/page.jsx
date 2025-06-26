"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RFQHistory = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("history");
  const [rfqItems, setRfqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRFQHistory();
  }, []);

  const fetchRFQHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await axios.get("/api/rfq/history", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (Array.isArray(response.data)) {
        setRfqItems(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching RFQ history:", err);
      setError("Failed to load RFQ history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "new") router.push("/rfq");
  };

  const handleRfqClick = (id) => {
    router.push(`/rfq-history/details/${id}`);
  };

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#233B6E] border-r-transparent" />
          <p className="mt-2 text-[#233B6E] text-sm">Loading RFQ history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white min-h-screen p-6">
        <div className="bg-red-100 text-red-600 border border-red-300 p-4 rounded-md max-w-md mx-auto text-center">
          <p>{error}</p>
          <button
            onClick={fetchRFQHistory}
            className="mt-3 px-4 py-2 bg-[#233B6E] text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen rounded-md mt-6 p-6">
      {/* Page description */}
      <p className="pb-5 text-[#ACACAC] text-sm font-[NSregular]">
        Request for a quote or a sample here
      </p>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          className={`text-sm font-[NSmedium] px-4 py-2 rounded-tl-[20px] rounded-bl-[20px] border border-[#79747E] ${
            activeTab === "new" ? "bg-[#233B6E] text-white" : "bg-white text-[#1D1B20]"
          }`}
          onClick={() => handleTabChange("new")}
        >
          NEW RFQ
        </button>
        <button
          className={`text-sm font-[NSmedium] px-4 py-2 rounded-tr-[20px] rounded-br-[20px] border border-[#79747E] ${
            activeTab === "history" ? "bg-[#233B6E] text-white" : "bg-white text-[#1D1B20]"
          }`}
          onClick={() => handleTabChange("history")}
        >
          RFQ HISTORY
        </button>
      </div>

      {/* Header with arrow */}
      <div className="flex items-center mb-6">
        <h2 className="text-[#233B6E] font-[NSmedium] text-lg">RFQ DETAILS</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2 text-[#233B6E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* RFQ Cards */}
      {rfqItems.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No RFQ history found.</div>
      ) : (
        <div className="space-y-4">
          {rfqItems.map((item) => (
            <div
              key={item._id}
              onClick={() => handleRfqClick(item._id)}
              className="flex gap-4 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4 shadow-sm cursor-pointer"
            >
              {/* Image */}
              <div className="w-24 h-24 rounded-md overflow-hidden border bg-white flex-shrink-0">
                <img
                  src={item.productImagesFiles?.[0] || "/RfqImage.svg"}
                  alt="RFQ"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/RfqImage.svg";
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-[NSmedium] text-[#000] mb-1">
                      CODE {item._id.substring(0, 6)}
                    </h3>
                    <p className="text-sm text-[#000] opacity-70">
                      {item.orderNotes || "No description available"}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium mt-1 ${
                      item.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : item.status === "Accepted" || item.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status || "Pending"}
                  </span>
                </div>

                {/* Rejection Reason */}
                {item.status === "Rejected" && item.comments && (
                  <p className="text-sm text-red-500 italic">
                    <span className="font-semibold">Rejection Reason:</span> {item.comments}
                  </p>
                )}

                {/* Time + Duration */}
                <div className="text-xs text-[#000] opacity-50">
                  {item.time || "Unknown"} • {item.duration || "Unknown"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RFQHistory;
