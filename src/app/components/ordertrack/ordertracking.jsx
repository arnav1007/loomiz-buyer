"use client";
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Search, Check } from "lucide-react";

export default function OrderTracking({ acceptedQuotes = [] }) {
  const [activeTab, setActiveTab] = useState("CURRENT");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Logic to determine order status based on quote data and productionSteps if available
  const getOrderStatus = (quote) => {
    // If productionSteps doesn't exist yet, default to ORDER
    if (!quote.productionSteps) {
      return "ORDER";
    }
    
    const productionSteps = quote.productionSteps;
    
    if (productionSteps?.outForDelivery === "Completed") {
      return "SHIPMENT";
    } else if (
      productionSteps?.confirmPaymentTerms === "Completed" ||
      productionSteps?.confirmPaymentTerms === "In Progress"
    ) {
      return "PAYMENT";
    } else if (
      productionSteps?.production === "In Progress" ||
      productionSteps?.production === "Completed" ||
      productionSteps?.packaging === "In Progress" ||
      productionSteps?.packaging === "Completed" ||
      productionSteps?.qualityCheck === "In Progress" ||
      productionSteps?.qualityCheck === "Completed" ||
      productionSteps?.sampleConfirmation === "In Progress" ||
      productionSteps?.sampleConfirmation === "Completed" ||
      productionSteps?.fabricInhoused === "In Progress" ||
      productionSteps?.fabricInhoused === "Completed" ||
      productionSteps?.fabricQualityCheck === "In Progress" ||
      productionSteps?.fabricQualityCheck === "Completed" 
    ) {
      return "PRODUCTION";
    } else {
      return "ORDER";
    }
  };

  // Transform acceptedQuotes into the orders format
  const orders = acceptedQuotes.map(quote => ({
    id: quote._id.slice(-5), // Use last 5 chars of _id as a shorter ID
    code: quote.code,
    fullId: quote._id, // Store the full ID for navigation
    description: quote.desc || "No description provided",
    status: getOrderStatus(quote),
    timestamp: quote.createdAt ? formatTimestamp(quote.createdAt) : "Date unknown",
    productionSteps: quote.productionSteps || {},
    productImage: quote.prod_image || null,
    quantity: quote.quantity,
    leadTime: quote.leadTime,
    fabricComposition: quote.fabricComposition
  }));

  // Format timestamp to show relative time
  function formatTimestamp(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Today • ${diffInHours} hr${diffInHours !== 1 ? 's' : ''}`;
    } else if (diffInHours < 48) {
      return `Yesterday • ${Math.floor(diffInHours - 24)} hr${Math.floor(diffInHours - 24) !== 1 ? 's' : ''}`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  }

  const getStatusIndex = (status) => {
    const statuses = ["QUOTE", "ORDER", "PRODUCTION", "SHIPMENT", "PAYMENT"];
    return statuses.indexOf(status);
  };

  const handleGoBack = () => {
    // Use next/navigation in a client component
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // Handle clicking on an order to navigate to the details page
  const handleOrderClick = (fullId) => {
    router.push(`/ordertracking/${fullId}`);
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter orders based on active tab
  const displayedOrders = filteredOrders.filter(order => {
    if (activeTab === "CURRENT") {
      // Orders that haven't reached PAYMENT status
      return order.status !== "PAYMENT";
    } else {
      // Completed orders have reached PAYMENT status
      return order.status === "PAYMENT";
    }
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex mb-4">
          <button
            className={`px-6 py-2 text-[#1D1B20] font-medium rounded-l-[20px] ${
              activeTab === "CURRENT"
                ? "bg-[#233B6E] text-white"
                : "bg-white text-gray-700 border border-[#1D1B20] "
            }`}
            onClick={() => setActiveTab("CURRENT")}
          >
            CURRENT
          </button>
          <button
            className={`px-6 py-2 text-[#1D1B20] font-medium rounded-r-[20px] ${
              activeTab === "COMPLETED"
                ? "bg-[#233B6E] text-white"
                : "bg-white text-gray-700 border border-[#1D1B20]"
            }`}
            onClick={() => setActiveTab("COMPLETED")}
          >
            COMPLETED
          </button>
        </div>

        <div className="text-[#ACACAC] text-gray-500 mb-4">
          View at what stage your orders have reached
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="font-medium text-[28px] text-[#1D1B20]">
                Order Details
              </span>
            </button>
            <img src="/Arrow.svg" className="ml-4" alt="" />
          </div>

          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              placeholder="Search by code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedOrders.map((order, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-6 flex cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOrderClick(order.fullId)}
              >
                <div className="w-24 h-24 bg-gray-200 rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {order.productImage ? (
                    <img 
                      src={order.productImage} 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#1D1B20] font-[NSregular] text-[17px]">
                        Style:  {order.code}
                      </h3>
                      <p className="text-sm text-[#49454F] mt-1 text-[14px]">
                        {order.description}
                      </p>
                      {order.quantity && (
                        <p className="text-sm text-[#49454F] mt-1 text-[14px]">
                          Quantity: {order.quantity} • Lead Time: {order.leadTime || 'N/A'}
                        </p>
                      )}
                      {order.fabricComposition && (
                        <p className="text-sm text-[#49454F] mt-1 text-[14px]">
                          Fabric: {order.fabricComposition}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pl-10 pr-10 md:pr-80">
                    <div className="relative flex items-center justify-between">
                      {[
                        "QUOTE",
                        "ORDER",
                        "PRODUCTION",
                        "SHIPMENT",
                        "PAYMENT",
                      ].map((status, idx) => {
                        const currentIndex = getStatusIndex(order.status);
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = status === order.status;
                        const isPending = idx > currentIndex;

                        return (
                          <div
                            key={status}
                            className="flex flex-col items-center relative z-10"
                          >
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center
                                ${
                                  isCompleted && !isCurrent
                                    ? "bg-black ring-2"
                                    : isCurrent
                                    ? "bg-[#9197A3] ring-2 ring-[#9197A3]"
                                    : "bg-white ring-2 ring-gray-300"
                                }`}
                            >
                              {isCompleted && !isCurrent && <Check size={14} color="white" />}
                            </div>
                            <span
                              className={`text-xs mt-1 ${
                                isCurrent
                                  ? "font-semibold text-[#171721]"
                                  : "text-gray-600"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      })}

                      {/* Background line */}
                      <div className="absolute top-1.5 left-5 right-10 z-0 flex">
                        {["QUOTE", "ORDER", "PRODUCTION", "SHIPMENT"].map((_, idx) => {
                          const currentIndex = getStatusIndex(order.status);
                          const isBeforeCurrent = idx < currentIndex;

                          return (
                            <div key={idx} className="flex-1 flex items-center">
                              <div
                                className={`h-0.5 w-full ${
                                  idx < currentIndex
                                    ? "bg-black"
                                    : "border-t border-dashed border-gray-400"
                                }`}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 text-gray-500 text-sm">
                    <Clock size={14} />
                    <span className="ml-1">{order.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}