"use client";
import React, { useState } from "react";

function InputDesign() {
  // State for tracking submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Main form state - field names updated to match backend requirements
  const [formData, setFormData] = useState({
    // Contact Person
    contactPersonName: "",
    contactPhoneNo: "",
    contactEmail: "",
    
    // Company Profile
    registeredCompanyName: "",
    gstTaxId: "",
    taxRegistrationCert: null,
    businessNo: "",
    countryOfIncorporation: "",
    
    // Address Details
    address: "",
    addressState: "",
    addressCountry: "",
    addressPostcode: "",
    
    // Financial Details
    bankBranchName: "",
    bankState: "",
    bankCountry: "",
    bankPostcode: "",
    bankCertificate: null,
    importExportLicense: null
  });
  
  // Track file names for display purposes
  const [fileNames, setFileNames] = useState({
    taxRegistrationCert: "",
    bankCertificate: "",
    importExportLicense: ""
  });
  
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add the removeFile function if it's missing
const removeFile = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: null
    }));
    
    setFileNames(prev => ({
      ...prev,
      [name]: ""
    }));
    
    // Reset the file input
    const fileInput = document.getElementById(name);
    if (fileInput) {
      fileInput.value = "";
    }
  };
  
  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Update the file in the form data
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      // Update the file name for display
      setFileNames(prev => ({
        ...prev,
        [name]: files[0].name
      }));
    }
  };
  
  // Handle form submission - updated to send data to API
  
// Update the timeout in handleSubmit to 5 seconds
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Create FormData object to send files
      const submitFormData = new FormData();
      
      // Add all text fields and files to FormData
      Object.keys(formData).forEach(key => {
        // Only add files for file fields if they exist
        if (key === 'taxRegistrationCert' || key === 'bankCertificate' || key === 'importExportLicense') {
          if (formData[key]) {
            submitFormData.append(key, formData[key]);
          }
        } else {
          submitFormData.append(key, formData[key]);
        }
      });
      
      // Send the data to the API
      const response = await fetch('/api/company', {
        method: 'POST',
        body: submitFormData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success popup instead of success message
        setShowSuccessPopup(true);
        
        // Redirect after 5 seconds instead of 3
        setTimeout(() => {
          window.location.href = '/'; // Replace with your dashboard URL
        }, 5000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to submit form',
          details: result.missingFields ? `Missing fields: ${result.missingFields.join(', ')}` : null
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while submitting the form'
      });
    } finally {
      setIsSubmitting(false);
    }
};

  

  // Style classes based on Figma specs
  // Style classes using defined fonts from global CSS
const headingStyle = "font-['NSmedium'] text-[28px] leading-[64px] tracking-normal align-middle font-variant-small-caps text-gray-800";
const subheadingStyle = "font-['NSmedium'] text-[20px] leading-[64px] tracking-normal align-middle text-gray-700";
const labelStyle = "block font-['NSmedium'] text-[14px] leading-[100%] tracking-normal align-middle text-gray-700 mb-3";
const inputStyle = "border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-['NSmedium'] text-[16px]";

  return (
    <div className="min-h-screen w-full bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 before:content-[''] before:absolute before:inset-0 before:backdrop-blur-sm before:bg-white/20 before:z-0 relative overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl z-10 overflow-hidden">
        <div className="p-8">
          {/* Info Banner - Modified to only have blue behind the icon and text */}
          <div className="mb-6 flex justify-center" >
            <div className="bg-blue-50 rounded-xl p-2 flex items-center border border-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-black">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm">Kindly ensure the following details are completed, as the RFQ will not be processed without them.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Person of Contact Section */}
            <div className="mb-8">
              <h2 className={headingStyle}>PERSON OF CONTACT</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className={labelStyle}>
                    Contact Person Name*
                  </label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    placeholder="Name of Contact Person"
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    Phone No. *
                  </label>
                  <input
                    type="tel"
                    name="contactPhoneNo"
                    value={formData.contactPhoneNo}
                    onChange={handleChange}
                    placeholder="Phone No."
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    Email*
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Email"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Company Profile Section */}
            <div className="mb-8">
              <h2 className={headingStyle}>COMPANY PROFILE</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-2">
                  <label className={labelStyle}>
                    Registered company name*
                  </label>
                  <input
                    type="text"
                    name="registeredCompanyName"
                    value={formData.registeredCompanyName}
                    onChange={handleChange}
                    placeholder="Company Name"
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    GST/Tax Id
                  </label>
                  <input
                    type="text"
                    name="gstTaxId"
                    value={formData.gstTaxId}
                    onChange={handleChange}
                    placeholder="GST/Tax Id"
                    className={inputStyle}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
               {/* Tax registration certificate */}
               {/* // Updated Tax Registration Certificate component with centered upload button */}
<div>
  <label className={labelStyle}>
    Tax registration certificate *
  </label>
  <div className="border border-gray-300 rounded-lg h-[42px] relative">
    {!fileNames.taxRegistrationCert ? (
      // Show centered upload button when no file is selected
      <div className="flex w-full h-full items-center justify-center">
        <input
          type="file"
          name="taxRegistrationCert"
          id="taxRegistrationCert"
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
          required
        />
        <label 
          htmlFor="taxRegistrationCert"
          className="px-15 py-1 mx-auto bg-gray-300 hover:bg-gray-400 rounded-md text-sm uppercase font-medium cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
        >
          UPLOAD
        </label>
      </div>
    ) : (
      // Show file info and actions when file is selected
      <div className="flex w-full h-full items-center justify-between px-3">
        <div className="flex items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 flex-shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span className="text-sm truncate max-w-[200px]">{fileNames.taxRegistrationCert}</span>
        </div>
        <div className="flex items-center gap-2">
          <label 
            htmlFor="taxRegistrationCert"
            className="p-1 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 rounded"
            title="Replace file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </label>
          <button
            type="button"
            onClick={() => removeFile('taxRegistrationCert')}
            className="p-1 bg-red-500 text-white hover:bg-red-600 rounded"
            title="Remove file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    )}
  </div>
</div>
                
                <div>
                  <label className={labelStyle}>
                    Business No.*
                  </label>
                  <input
                    type="text"
                    name="businessNo"
                    value={formData.businessNo}
                    onChange={handleChange}
                    placeholder="Business No."
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    Country of Incorporation *
                  </label>
                  <input
                    type="text"
                    name="countryOfIncorporation"
                    value={formData.countryOfIncorporation}
                    onChange={handleChange}
                    placeholder="Enter your COI"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Address Detail Section */}
            <div className="mb-8">
              <h2 className={headingStyle}>ADDRESS DETAIL</h2>
              <div className="mb-4">
                <div className={subheadingStyle}>Registered Company Address</div>
              </div>
              
              <div className="mb-4">
                <label className={labelStyle}>
                  Apartment No/Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Apartment No/Street Address"
                  className={inputStyle}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelStyle}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="addressState"
                    value={formData.addressState}
                    onChange={handleChange}
                    placeholder="State"
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    Country *
                  </label>
                  <input
                    type="text"
                    name="addressCountry"
                    value={formData.addressCountry}
                    onChange={handleChange}
                    placeholder="Country"
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    Postcode/Zip *
                  </label>
                  <input
                    type="text"
                    name="addressPostcode"
                    value={formData.addressPostcode}
                    onChange={handleChange}
                    placeholder="Postcode/Zip"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Financial Detail Section */}
            <div className="mb-8">
              <h2 className={headingStyle}>FINANCIAL DETAIL</h2>
              <div className="mb-4">
                <div className={subheadingStyle}>Bank Details</div>
              </div>
              
              <div className="mb-4">
                <label className={labelStyle}>
                  Branch Name*
                </label>
                <input
                  type="text"
                  name="bankBranchName"
                  value={formData.bankBranchName}
                  onChange={handleChange}
                  placeholder="Branch Name"
                  className={inputStyle}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={labelStyle}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="bankState"
                    value={formData.bankState}
                    onChange={handleChange}
                    placeholder="State"
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    Country *
                  </label>
                  <input
                    type="text"
                    name="bankCountry"
                    value={formData.bankCountry}
                    onChange={handleChange}
                    placeholder="Country"
                    className={inputStyle}
                    required
                  />
                </div>
                
                <div>
                  <label className={labelStyle}>
                    Postcode/Zip *
                  </label>
                  <input
                    type="text"
                    name="bankPostcode"
                    value={formData.bankPostcode}
                    onChange={handleChange}
                    placeholder="Postcode/Zip"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Updated to match Image 2 for Bank Certificate */}
                {/* Updated Bank Certificate section with new styling */}
                <div>
  <label className={labelStyle}>
    Bank Certificate
  </label>
  <div className="border border-gray-300 rounded-lg p-8">
    <input
      type="file"
      name="bankCertificate"
      id="bankCertificate"
      onChange={handleFileChange}
      accept=".pdf"
      className="hidden"
    />
    
    {!fileNames.bankCertificate ? (
      // Show upload button when no file is selected
      <div className="text-center">
        <label 
          htmlFor="bankCertificate"
          className="inline-flex items-center gap-1 cursor-pointer bg-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300 font-['NSmedium'] text-[16px] font-medium leading-[100%] tracking-normal text-center align-middle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          upload from browser/drive
        </label>
        <p className="text-[14px] leading-[100%] tracking-[0%] text-center align-middle font-['Noto Sans'] font-normal text-[#979797] mt-3">
          You can upload files in pdf format only upto 100 kb
        </p>
      </div>
    ) : (
      // Show file info and actions when file is selected
      <div>
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200 mb-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span className="text-sm font-medium truncate max-w-xs">{fileNames.bankCertificate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label 
              htmlFor="bankCertificate"
              className="text-xs bg-blue-500 text-white p-1 rounded cursor-pointer hover:bg-blue-600"
              title="Replace file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </label>
            <button
              type="button"
              onClick={() => removeFile('bankCertificate')}
              className="text-xs bg-red-500 text-white p-1 rounded hover:bg-red-600"
              title="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[14px] leading-[100%] tracking-[0%] text-center align-middle font-['Noto Sans'] font-normal text-[#979797]">
          You can upload files in pdf format only upto 100 kb
        </p>
      </div>
    )}
  </div>
</div>

{/* Updated Import/Export License section with new styling */}
<div>
  <label className={labelStyle}>
    Import/Export License
  </label>
  <div className="border border-gray-300 rounded-lg p-8">
    <input
      type="file"
      name="importExportLicense"
      id="importExportLicense"
      onChange={handleFileChange}
      accept=".pdf"
      className="hidden"
    />
    
    {!fileNames.importExportLicense ? (
      // Show upload button when no file is selected
      <div className="text-center">
        <label 
          htmlFor="importExportLicense"
          className="inline-flex items-center gap-1 cursor-pointer bg-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300 font-['NSmedium'] text-[16px] font-medium leading-[100%] tracking-normal text-center align-middle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          upload from browser/drive
        </label>
        <p className="text-[14px] leading-[100%] tracking-[0%] text-center align-middle font-['Noto Sans'] font-normal text-[#979797] mt-3">
          You can upload files in pdf format only upto 100 kb
        </p>
      </div>
    ) : (
      // Show file info and actions when file is selected
      <div>
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200 mb-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span className="text-sm font-medium truncate max-w-xs">{fileNames.importExportLicense}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label 
              htmlFor="importExportLicense"
              className="text-xs bg-blue-500 text-white p-1 rounded cursor-pointer hover:bg-blue-600"
              title="Replace file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </label>
            <button
              type="button"
              onClick={() => removeFile('importExportLicense')}
              className="text-xs bg-red-500 text-white p-1 rounded hover:bg-red-600"
              title="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[14px] leading-[100%] tracking-[0%] text-center align-middle font-['Noto Sans'] font-normal text-[#979797]">
          You can upload files in pdf format only upto 100 kb
        </p>
      </div>
    )}
  </div>
</div>
              </div>
            </div>
            
            {/* Submission Status Message */}
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-300 text-green-700' 
                  : 'bg-red-50 border border-red-300 text-red-700'
              }`}>
                <div className="flex items-center">
                  {submitStatus.type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-green-500">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-red-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  )}
                  <p className="font-medium">{submitStatus.message}</p>
                </div>
                {submitStatus.details && <p className="mt-2 text-sm ml-8">{submitStatus.details}</p>}
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-center">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                } text-white font-medium px-10 py-3 rounded-full uppercase shadow-md transition-all duration-300`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SUBMITTING...
                  </span>
                ) : (
                  'SUBMIT'
                )}
              </button>
            </div>
          </form>
          {showSuccessPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-green-200 rounded-2xl p-10 max-w-lg w-full shadow-2xl border-2 border-green-300 transform animate-fadeIn">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-green-800 font-['NSmedium']">THANK YOU FOR COMPLETING THE FORM!</h2>
        <p className="text-gray-800 text-lg">
          We are currently verifying your submission and will get back to you at the earliest opportunity.
        </p>
        <div className="mt-6 w-full bg-green-300 h-1 rounded-full overflow-hidden">
          <div className="bg-green-600 h-full animate-progress"></div>
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default InputDesign;