// File: src/app/api/rfq/history/route.js
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

console.log("Inside RFQ History API Route");

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const dbName = 'test'; // Your database name

// In the App Router, you need to export named functions for HTTP methods instead of a default handler
export async function GET() {
  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    
    console.log("Connected to MongoDB");
    
    // Fetch RFQ history from quotes collection
    const quotes = await db.collection('quotes')
      .find({})
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .toArray();

    console.log(`Found ${quotes.length} quotes`);

    // Format the response data
    const formattedRfqHistory = quotes.map(quote => {
      // Format time (Today, Yesterday, or date)
      const today = new Date();
      const quoteDate = quote.createdAt ? new Date(quote.createdAt) : new Date();
      
      let time;
      const todayString = today.toDateString();
      if (quoteDate.toDateString() === todayString) {
        time = 'Today';
      } else {
        // Create a new Date object for yesterday to avoid modifying the original
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (quoteDate.toDateString() === yesterday.toDateString()) {
          time = 'Yesterday';
        } else {
          time = quoteDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        }
      }

      // Calculate duration since creation
      const duration = calculateDuration(quoteDate);

      return {
        _id: quote._id.toString(), // Convert ObjectId to string
        orderNotes: quote.orderNotes || "No description available",
        time,
        duration,
        quantity: quote.quantity,
        leadTime: quote.leadTime,
        targetPrice: quote.targetPrice,
        status:quote.status,
        comments:quote.comments,
        fabricComposition: quote.fabricComposition,
        productImagesFiles: quote.productImagesFiles || []
      };
    });

    // In App Router, we use NextResponse instead of res.status().json()
    return NextResponse.json(formattedRfqHistory);
  } catch (error) {
    console.error('Error fetching RFQ history:', error);
    return NextResponse.json(
      { message: 'Failed to fetch RFQ history', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Helper function to calculate duration since creation
function calculateDuration(date) {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  } else {
    return `${diffInMins} min${diffInMins !== 1 ? 's' : ''}`;
  }
}