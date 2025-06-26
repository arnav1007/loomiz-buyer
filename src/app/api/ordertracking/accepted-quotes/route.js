import dbConnect from '@/lib/mongoose';
import Quote from '@/models/Quote';
import Order from '@/models/Order';

export async function GET() {
  try {
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

    return Response.json({ quotes: quotesWithProductionData });
  } catch (error) {
    console.error('Error fetching accepted quotes for order tracking:', error);
    return Response.json(
      { error: 'Failed to fetch accepted quotes' },
      { status: 500 }
    );
  }
} 