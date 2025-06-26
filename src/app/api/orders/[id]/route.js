// File: app/api/orders/[id]/route.js

import dbConnect from '@/lib/mongodb'; // Adjust path as needed
import Order from '@/models/Order'; // Adjust path as needed

export async function GET(request, { params }) {
  const { id } = params; // This is the quote ID

  try {
    await dbConnect();
    
    // Find order by quote ID and populate the quote data
    const order = await Order.findOne({ quote: id }).populate('quote');

    if (!order) {
      return Response.json(
        { error: 'Order not found for this quote' },
        { status: 404 }
      );
    }

    return Response.json(order);
  } catch (error) {
    console.error('Error fetching order by quote:', error);
    return Response.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}