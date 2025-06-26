// app/api/submit-quote/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/mongoose';
import Quote from '@/models/Quote';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

    // Create temp directory for file processing if it doesn't exist
    const tempDir = join(process.cwd(), 'tmp');
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

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
      
      // Process the file
      const bytes = await value.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename
      const tempFilePath = join(tempDir, `${uuidv4()}-${value.name}`);
      await writeFile(tempFilePath, buffer);
      
      // Upload to Cloudinary
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            tempFilePath,
            { folder: category },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });

        // Delete the temp file after successful upload
        await unlink(tempFilePath);

        // Add the Cloudinary URL to the appropriate array in quoteData
        if (category === 'techpack') {
          quoteData.techpackFile = result.secure_url;
        } else {
          quoteData[`${category}Files`].push(result.secure_url);
        }
      } catch (uploadError) {
        console.error(`Error uploading file to Cloudinary: ${uploadError}`);
        // Optionally delete temp file if upload failed
        try {
          await unlink(tempFilePath);
        } catch (deleteError) {
          console.error('Error deleting temp file after failed upload:', deleteError);
        }
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