// app/api/submit-quote/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Quote from '@/models/Quote';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    // Extract text fields from form data
    const quoteData = {
      shippingAddress: formData.get('shippingAddress'),
      quantity: parseInt(formData.get('quantity'), 10),
      leadTime: formData.get('leadTime'),
      targetPrice: parseFloat(formData.get('targetPrice')),
      fabricComposition: formData.get('fabricComposition'),
      gsm: formData.get('gsm'),
      orderNotes: formData.get('orderNotes'),
      orderSample: formData.get('requestSample') === 'true',
      sampleCount: parseInt(formData.get('sampleCount') || '0', 10),
      // ADD THIS LINE: Explicitly include comments with default value
      comments: "Sorry, We can not process your order.",
      // File URLs will be populated later
      techpackFile: null,
      productImagesFiles: [],
      colorSwatchFiles: [],
      fabricFiles: [],
      miscellaneousFiles: []
    };

    console.log(quoteData);

    // Process all files from formData
    for (const [key, value] of formData.entries()) {
      // Skip if not a file or already processed as text field
      if (
        !(value instanceof File) ||
        [
          'shippingAddress',
          'quantity',
          'leadTime',
          'targetPrice',
          'fabricComposition',
          'gsm',
          'orderNotes',
          'orderSample'
        ].includes(key)
      ) {
        continue;
      }
      
      // Determine file category from field name
      let category;
      if (key.startsWith('techpack')) {
        category = 'techpack';
      } else if (key.startsWith('productImages')) {
        category = 'productImages';
      } else if (key.startsWith('colorSwatch')) {
        category = 'colorSwatch';
      } else if (key.startsWith('fabric')) {
        category = 'fabric';
      } else if (key.startsWith('miscellaneous')) {
        category = 'miscellaneous';
      } else {
        continue;
      }
      
      // Size validation
      if (value.size > 10 * 1024 * 1024) { // 10MB limit
        continue;
      }
      
      // Process the file - convert to buffer and upload directly
      const bytes = await value.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload directly to Cloudinary using the utility function
      try {
        const result = await uploadToCloudinary(buffer, category);

        // Add the Cloudinary URL to the appropriate array in quoteData
        if (category === 'techpack') {
          quoteData.techpackFile = result.secure_url;
        } else {
          quoteData[`${category}Files`].push(result.secure_url);
        }
      } catch (uploadError) {
        console.error(`Error uploading file to Cloudinary: ${uploadError}`);
        // Continue processing other files even if one fails
      }
    }

    // Save quote data to MongoDB
    const quote = await Quote.create(quoteData);

    return NextResponse.json({ 
      success: true, 
      message: "Quote submitted successfully",
      data: quote 
    }, { status: 201 });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Quote submission failed', error: error.message },
      { status: 500 }
    );
  }
}