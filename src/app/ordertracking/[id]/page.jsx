"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SampleConfirmation from "../../components/OrderTrackingSteps/SampleConfirmation";
import FabricInhoused from "../../components/OrderTrackingSteps/FabricInhoused";
import FabricQualityCheck from "../../components/OrderTrackingSteps/FabricQualityCheck";
import Production from "../../components/OrderTrackingSteps/Production";
import Packaging from "../../components/OrderTrackingSteps/Packaging";
import QualityCheck from "../../components/OrderTrackingSteps/QualityCheck";
import OutForDelivery from "../../components/OrderTrackingSteps/OutForDelivery";
import ConfirmPaymentTerms from "../../components/OrderTrackingSteps/ConfirmPaymentTerms";

const OrderTrackingStepsHome = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const quoteId = params.id; // This is the quote ID from the URL

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        // Fetch order by quote ID
        const response = await fetch(`/api/orders/${quoteId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }
        
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (quoteId) {
      fetchOrderData();
    }
  }, [quoteId]);

  if (loading) {
    return (
      <div className="space-y-4 bg-white rounded-[50px] p-2 mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E4E79] mx-auto"></div>
            <p className="mt-4 text-[#1E4E79]">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 bg-white rounded-[50px] p-2 mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#1E4E79] text-white rounded-lg hover:bg-[#233B6E]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="space-y-4 bg-white rounded-[50px] p-2 mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-600">No order found for this quote.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-[#EDF5FF] border-[#233B6E] text-[#233B6E]";
      case "In Production":
        return "bg-[#FFF3E0] border-[#FF8C00] text-[#FF8C00]";
      case "Completed":
        return "bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]";
      case "Delivered":
        return "bg-[#F3E5F5] border-[#9C27B0] text-[#9C27B0]";
      default:
        return "bg-[#EDF5FF] border-[#233B6E] text-[#233B6E]";
    }
  };

  return (
    <div className="space-y-4 bg-white rounded-[50px] p-2 mt-10">
      <div className="items-center mb-6 ml-10 mt-10">
        <h2 className="text-[46px] font-semibold text-[#1E4E79]">
          ORDER NO. {orderData.orderNumber}
        </h2>
        <span className={`text-[14px] px-4 rounded-full border ${getStatusColor(orderData.status)}`}>
          {orderData.status.toUpperCase()}
        </span>
        
        {/* Additional Order Info */}
       
      </div>

      <div>
        <SampleConfirmation  status={orderData.productionSteps.sampleConfirmation}
          orderData={orderData} />
        <FabricInhoused 
          status={orderData.productionSteps.fabricInhoused}
          orderData={orderData}
        />
        <FabricQualityCheck 
          status={orderData.productionSteps.fabricQualityCheck}
          orderData={orderData}
        />
        <Production 
          status={orderData.productionSteps.production}
          orderData={orderData}
        />
        <Packaging 
          status={orderData.productionSteps.packaging}
          orderData={orderData}
        />
       {/* <Packaging status="Completed" /> */}
        <QualityCheck 
          status={orderData.productionSteps.qualityCheck}
          orderData={orderData}
        />
        <OutForDelivery 
          status={orderData.productionSteps.outForDelivery}
          orderData={orderData}
        />
        <ConfirmPaymentTerms 
          status={orderData.productionSteps.confirmPaymentTerms}
          orderData={orderData}
        />
      </div>
    </div>
  );
};

export default OrderTrackingStepsHome;