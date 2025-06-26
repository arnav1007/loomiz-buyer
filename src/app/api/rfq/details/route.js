// src/app/api/rfq/details/route.js
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const dbName = 'test'; // Your database name

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  console.log(`Fetching RFQ details for ID: ${id}`);
  
  if (!id) {
    return NextResponse.json(
      { message: 'RFQ ID is required' },
      { status: 400 }
    );
  }
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    
    console.log("Connected to MongoDB");
    
    // Try to convert the id to ObjectId for MongoDB query
    let rfqObjectId;
    try {
      rfqObjectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json(
        { message: 'Invalid RFQ ID format' },
        { status: 400 }
      );
    }
    
    // Fetch the specific RFQ from quotes collection
    const quote = await db.collection('quotes').findOne({ _id: rfqObjectId });
    
    if (!quote) {
      return NextResponse.json(
        { message: 'RFQ not found' },
        { status: 404 }
      );
    }
    
    console.log(`Found RFQ with ID: ${id}`);
    
    // NEW: Improved file formatting function that handles both object and string formats
    const formatFileDetails = (files) => {
      if (!files) return [];
      
      // If not an array, handle single file case
      if (!Array.isArray(files)) {
        // If it's a string, assume it's a URL
        if (typeof files === 'string') {
          return [{
            name: getFileNameFromUrl(files),
            url: files,
            type: guessFileType(files),
            size: 0 // We don't know the size from just a URL
          }];
        }
        
        // If it's an object, format it properly
        if (typeof files === 'object') {
          return [{
            name: files.originalname || files.name || getFileNameFromUrl(files.location || files.path || ''),
            url: files.location || files.path || '',
            type: files.mimetype || files.type || guessFileType(files.location || files.path || ''),
            size: files.size || 0
          }];
        }
        
        return [];
      }
      
      // Handle array of files
      return files.map(file => {
        // If it's a string, assume it's a URL
        if (typeof file === 'string') {
          return {
            name: getFileNameFromUrl(file),
            url: file,
            type: guessFileType(file),
            size: 0 // We don't know the size from just a URL
          };
        }
        
        // If it's an object, format it properly
        return {
          name: file.originalname || file.name || getFileNameFromUrl(file.location || file.path || ''),
          url: file.location || file.path || '',
          type: file.mimetype || file.type || guessFileType(file.location || file.path || ''),
          size: file.size || 0
        };
      });
    };
    
    // Helper function to extract filename from URL
    const getFileNameFromUrl = (url) => {
      try {
        const urlParts = new URL(url).pathname.split('/');
        return urlParts[urlParts.length - 1] || 'Unnamed file';
      } catch (e) {
        // If URL parsing fails, try to get the last part of the path
        const parts = url.split('/');
        return parts[parts.length - 1] || 'Unnamed file';
      }
    };
    
    // Helper function to guess file type from URL or extension
    const guessFileType = (url) => {
      try {
        if (url.match(/\.(jpeg|jpg)$/i)) return 'image/jpeg';
        if (url.match(/\.(png)$/i)) return 'image/png';
        if (url.match(/\.(gif)$/i)) return 'image/gif';
        if (url.match(/\.(svg)$/i)) return 'image/svg+xml';
        if (url.match(/\.(pdf)$/i)) return 'application/pdf';
        // Add more file types as needed
        return 'application/octet-stream'; // Default
      } catch (e) {
        return 'application/octet-stream';
      }
    };
    
    // Process the techpack file (special case for single file)
    const techpackFile = quote.techpackFile ? 
      (typeof quote.techpackFile === 'string' ?
        {
          name: getFileNameFromUrl(quote.techpackFile),
          url: quote.techpackFile,
          type: guessFileType(quote.techpackFile),
          size: 0
        } :
        {
          name: quote.techpackFile.originalname || 'Techpack file',
          url: quote.techpackFile.location || quote.techpackFile.path || '',
          type: quote.techpackFile.mimetype || guessFileType(quote.techpackFile.location || ''),
          size: quote.techpackFile.size || 0
        }
      ) : null;
    
    // Format the response data
    const formattedRfq = {
      id: quote._id.toString(),
      shippingAddress: quote.shippingAddress || '',
      quantity: quote.quantity || '',
      leadTime: quote.leadTime || '',
      targetPrice: quote.targetPrice || '',
      fabricComposition: quote.fabricComposition || '',
      gsm: quote.gsm || '',
      orderNotes: quote.orderNotes || '',
      requestSample: quote.requestSample || quote.orderSample || false, // Note: handling both field names
      sampleCount: quote.sampleCount || 0,
      status: quote.status || 'Pending',
      createdAt: quote.createdAt || new Date(),
      files: {
        techpack: techpackFile,
        productImages: formatFileDetails(quote.productImagesFiles),
        colourSwatch: formatFileDetails(quote.colourSwatchFiles || quote.colorSwatchFiles), // Note: handling both spellings
        fabric: formatFileDetails(quote.fabricFiles),
        miscellaneous: formatFileDetails(quote.miscellaneousFiles)
      }
    };
    
    // Debug output
    console.log("Formatted RFQ data sample:", {
      id: formattedRfq.id,
      hasProductImages: formattedRfq.files.productImages.length > 0,
      hasColourSwatch: formattedRfq.files.colourSwatch.length > 0,
      hasFabric: formattedRfq.files.fabric.length > 0,
      hasMisc: formattedRfq.files.miscellaneous.length > 0,
      techpack: formattedRfq.files.techpack ? "Present" : "None"
    });
    
    return NextResponse.json(formattedRfq);
  } catch (error) {
    console.error('Error fetching RFQ details:', error);
    return NextResponse.json(
      { message: 'Failed to fetch RFQ details', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}