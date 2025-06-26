"use client";
import { useState, useEffect } from 'react';
import OrderTracking from "@/app/components/ordertrack/ordertracking";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function OrderDetailsPage() {
  const [acceptedQuotes, setAcceptedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcceptedQuotes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ordertracking/accepted-quotes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch accepted quotes');
        }
        
        const data = await response.json();
        setAcceptedQuotes(data.quotes);
      } catch (err) {
        console.error('Error fetching accepted quotes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedQuotes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E4E79] mx-auto"></div>
          <p className="mt-4 text-[#1E4E79]">Loading order tracking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div>
      <OrderTracking acceptedQuotes={acceptedQuotes} />
    </div>
  );
}