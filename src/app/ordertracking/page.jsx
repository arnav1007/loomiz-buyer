// app/order-details/page.js

import dbConnect from '@/lib/mongodb';
import Quote from '@/models/Quote';
import Order from '@/models/Order';
import OrderTracking from "@/app/components/ordertrack/ordertracking";

export default async function OrderDetailsPage() {
  // Connect to MongoDB
  await dbConnect();
  
  // Fetch quotes with status='Accepted'
  const acceptedQuotes = await Quote.find({ status: 'Accepted' }).sort({ createdAt: -1 }).lean();
  
  // Get order data for each accepted quote if it exists
  const quotesWithProductionData = await Promise.all(
    acceptedQuotes.map(async (quote) => {
      // Try to find an associated order
      const order = await Order.findOne({ quote: quote._id }).lean();
      
      return {
        ...quote,
        _id: quote._id.toString(),
        createdAt: quote.createdAt?.toISOString() ?? null,
        prod_image: quote.productImagesFiles && quote.productImagesFiles.length > 0 
          ? quote.productImagesFiles[0] 
          : null,
        desc: quote.orderNotes || '',
        // Use production steps from order if available
        productionSteps: order?.productionSteps || {}
      };
    })
  );

  // Pass the sanitized data to the client component
  return (
    <div>
      <OrderTracking acceptedQuotes={quotesWithProductionData} />
    </div>
  );
}