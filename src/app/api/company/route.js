// src/app/api/company/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the multipart form data
    const formData = await request.formData();
    
    // Extract file fields
    const taxRegistrationCertFile = formData.get('taxRegistrationCert');
    const bankCertificateFile = formData.get('bankCertificate');
    const importExportLicenseFile = formData.get('importExportLicense');
    
    // Extract form data
    const companyData = {
      contactPersonName: formData.get('contactPersonName'),
      contactPhoneNo: formData.get('contactPhoneNo'),
      contactEmail: formData.get('contactEmail'),
      
      registeredCompanyName: formData.get('registeredCompanyName'),
      gstTaxId: formData.get('gstTaxId'),
      businessNo: formData.get('businessNo'),
      countryOfIncorporation: formData.get('countryOfIncorporation'),
      
      address: formData.get('address'),
      addressState: formData.get('addressState'),
      addressCountry: formData.get('addressCountry'),
      addressPostcode: formData.get('addressPostcode'),
      
      bankBranchName: formData.get('bankBranchName'),
      bankState: formData.get('bankState'),
      bankCountry: formData.get('bankCountry'),
      bankPostcode: formData.get('bankPostcode'),
    };

    // Upload files to Cloudinary
    if (taxRegistrationCertFile && taxRegistrationCertFile instanceof File) {
      const fileBuffer = await taxRegistrationCertFile.arrayBuffer();
      const result = await uploadToCloudinary(Buffer.from(fileBuffer), 'buyers-form-docs');
      companyData.taxRegistrationCert = result.secure_url;
    }
    
    if (bankCertificateFile && bankCertificateFile instanceof File) {
      const fileBuffer = await bankCertificateFile.arrayBuffer();
      const result = await uploadToCloudinary(Buffer.from(fileBuffer), 'buyers-form-docs');
      companyData.bankCertificate = result.secure_url;
    }
    
    if (importExportLicenseFile && importExportLicenseFile instanceof File) {
      const fileBuffer = await importExportLicenseFile.arrayBuffer();
      const result = await uploadToCloudinary(Buffer.from(fileBuffer), 'buyers-form-docs');
      companyData.importExportLicense = result.secure_url;
    }

    // Validate required fields
    const requiredFields = [
      'contactPersonName', 'contactPhoneNo', 'contactEmail',
      'registeredCompanyName', 'gstTaxId', 'businessNo', 'countryOfIncorporation',
      'address', 'addressState', 'addressCountry', 'addressPostcode',
      'bankBranchName', 'bankState', 'bankCountry', 'bankPostcode',
      'taxRegistrationCert' // This requires the file to be uploaded
    ];

    const missingFields = requiredFields.filter(field => !companyData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        missingFields
      }, { status: 400 });
    }

    // Save company data to MongoDB
    const company = await Company.create(companyData);

    return NextResponse.json({
      success: true,
      message: 'Company data saved successfully',
      data: company
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving company data:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to save company data',
      error: error.message
    }, { status: 500 });
  }
}