"use client";
import React, { useState, useRef,useEffect } from "react";


const RFQForm = () => {
  // Form state management
  const [formData, setFormData] = useState({
    shippingAddress: "",
    quantity: "",
    leadTime: "",
    targetPrice: "",
    fabricComposition: "",
    gsm: "",
    orderNotes: "",
    requestSample: true,
    sampleCount: 1
  });

  // Modified Files state to handle multiple files
  const [files, setFiles] = useState({
    techpack: null,
    productImages: [],
    colorSwatch: [],
    fabric: [],
    miscellaneous: []
  });

  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  // Refs for file inputs
  const swatchRef = useRef();
  const fabricRef = useRef();
  const miscRef = useRef();
  const techpackRef = useRef();
  const productImagesRef = useRef();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add these at the top of your component
const [isMobile, setIsMobile] = useState(false);
  
useEffect(() => {
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  
  // Initial check
  checkIsMobile();
  
  // Add resize listener
  window.addEventListener('resize', checkIsMobile);
  
  // Clean up
  return () => window.removeEventListener('resize', checkIsMobile);
}, []);

  // Handle radio button changes
  const handleSampleRequestChange = (e) => {
    setFormData({
      ...formData,
      requestSample: e.target.value === "yes",
      // Reset sampleCount to 0 if 'No' is selected
      sampleCount: e.target.value === "no" ? 0 : formData.sampleCount
    });
  };

  // Sample count handlers
  const increment = () => {
    if (!formData.requestSample) return;
    setFormData({
      ...formData,
      sampleCount: formData.sampleCount + 1
    });
  };
  
  const decrement = () => {
    if (!formData.requestSample || formData.sampleCount <= 0) return;
    setFormData({
      ...formData,
      sampleCount: formData.sampleCount - 1
    });
  };

  // Generate a unique ID for each file
  const generateUniqueId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // Handle file drop for multi-file sections
  const handleMultiFileDrop = (e, fileType) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length > 0) {
      handleMultiFileUpdate(fileType, droppedFiles);
    }
  };

  // Handle file drop for single file sections
  const handleSingleFileDrop = (e, fileType) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleSingleFileUpdate(fileType, file);
    }
  };

  // Handle file change for multi-file sections
  const handleMultiFileChange = (e, fileType) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      handleMultiFileUpdate(fileType, selectedFiles);
    }
  };

  // Handle file change for single file sections
  const handleSingleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      handleSingleFileUpdate(fileType, file);
    }
  };

  // Common function to update single file state
  const handleSingleFileUpdate = (fileType, file) => {
    // Create a file object with preview URL
    const fileWithPreview = {
      id: generateUniqueId(),
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name
    };

    setFiles({
      ...files,
      [fileType]: fileWithPreview
    });
    console.log(`${fileType} selected:`, file.name);
  };

  // Common function to update multi-file state
  const handleMultiFileUpdate = (fileType, newFiles) => {
    // Create file objects with preview URLs
    const filesWithPreviews = newFiles.map(file => ({
      id: generateUniqueId(),
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setFiles({
      ...files,
      [fileType]: [...files[fileType], ...filesWithPreviews]
    });
    console.log(`${fileType} selected:`, newFiles.map(f => f.name).join(', '));
  };

  // Delete a file from multi-file sections
  const handleDeleteFile = (fileType, id) => {
    const updatedFiles = files[fileType].filter(file => file.id !== id);
    
    setFiles({
      ...files,
      [fileType]: updatedFiles
    });
  };

  // Delete a file from single-file sections
  const handleDeleteSingleFile = (fileType) => {
    setFiles({
      ...files,
      [fileType]: null
    });
  };

  // Form validation
  const validateForm = () => {
    // Required fields
    const requiredFields = [
      "shippingAddress", 
      "quantity", 
      "leadTime", 
      "targetPrice", 
      "fabricComposition", 
      "gsm"
    ];
    
    // Check required form fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitStatus({
          type: "error",
          message: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`
        });
        return false;
      }
    }
    
    // Check required files
    if (!files.techpack) {
      setSubmitStatus({
        type: "error",
        message: "Please upload techpack file"
      });
      return false;
    }
    
    // Check required multi-files
    const requiredMultiFiles = ["productImages", "colorSwatch", "fabric"];
    for (const fileType of requiredMultiFiles) {
      if (files[fileType].length === 0) {
        setSubmitStatus({
          type: "error",
          message: `Please upload ${fileType.replace(/([A-Z])/g, ' $1').toLowerCase()} files`
        });
        return false;
      }
    }
    
    // Check sample count if requesting sample
    if (formData.requestSample && formData.sampleCount === 0) {
      setSubmitStatus({
        type: "error",
        message: "Please select at least 1 sample"
      });
      return false;
    }
    
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: "", message: "" });
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    
    try {
      // Create FormData object for multipart/form-data submission
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append single files
      if (files.techpack) {
        formDataToSend.append("techpack", files.techpack.file);
      }
      
      // Append multiple files
      ["productImages", "colorSwatch", "fabric", "miscellaneous"].forEach(fileType => {
        if (files[fileType] && files[fileType].length > 0) {
          files[fileType].forEach((fileObj, index) => {
            formDataToSend.append(`${fileType}[${index}]`, fileObj.file);
          });
        }
      });
      
      // Send data to backend
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        body: formDataToSend,
        // No need to set Content-Type header as FormData sets it automatically
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit RFQ');
      }
      
      // Success message
      setSubmitStatus({
        type: "success",
        message: "RFQ submitted successfully!"
      });
      
      // Reset form after successful submission
      resetForm();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: "error",
        message: error.message || "An error occurred while submitting the form. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form data and files
  const resetForm = () => {
    setFormData({
      shippingAddress: "",
      quantity: "",
      leadTime: "",
      targetPrice: "",
      fabricComposition: "",
      gsm: "",
      orderNotes: "",
      requestSample: false,
      sampleCount: 0
    });
    
    setFiles({
      techpack: null,
      productImages: [],
      colorSwatch: [],
      fabric: [],
      miscellaneous: []
    });
  };

  // Render file preview component for multiple files with scrollbar
  const renderFilePreview = (fileType, label, isRequired = false) => {
    return (
      <div className="flex flex-col space-y-2 h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-[#000] opacity-[0.67] text-sm font-[NSmedium]">
            {label}{isRequired ? '*' : ''}
          </p>
          
          {/* Add more button at right end of heading */}
          <button
            type="button"
            onClick={() => document.getElementById(`${fileType}Input`).click()}
            className="bg-white w-6 h-6 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "200px" }}>
          <div className="flex flex-col gap-2">
            {/* Render existing files as rectangular cards */}
            {files[fileType].map((fileObj) => (
              <div 
                key={fileObj.id} 
                className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden group mb-2 bg-white shadow-sm hover:shadow transition-all"
              >
                {/* File preview (left side) */}
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                  {fileObj.file.type.startsWith('image/') ? (
                    <img 
                      src={fileObj.preview} 
                      alt={fileObj.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/PDFLogo.svg" alt="File" className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                {/* File info (middle) */}
                <div className="flex-1 px-3 py-2">
                  <p className="text-sm text-gray-700 truncate font-[NSmedium]">
                    {fileObj.name}
                  </p>
                  <p className="text-xs text-gray-500 font-[NSregular]">
                    {Math.round(fileObj.file.size / 1024)} KB
                  </p>
                </div>
                
                {/* Delete button (right side) */}
                <button
                  type="button"
                  onClick={() => handleDeleteFile(fileType, fileObj.id)}
                  className="mr-2 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            <input
              id={`${fileType}Input`}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleMultiFileChange(e, fileType)}
            />
          </div>
        </div>
        
        <p className="text-xs text-[#000] opacity-[0.67] font-[NSregular] mt-auto">
          Drop files here or Browse
        </p>
      </div>
    );
  };

  // Render file preview for single file (techpack)
  const renderSingleFilePreview = () => {
    if (!files.techpack) {
      return (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-md p-6 text-center w-full h-full bg-white border-[rgba(151,151,151,0.5)]">
          <img src="/uploadLogo.svg" alt="Upload" className="mb-2 w-8 h-8" />
          <p className="font-semibold text-gray-800 mb-1 font-[NSmedium]">UPLOAD TECHPACK*</p>
          <p className="text-[14px] text-[#000] opacity-[0.67] font-[NSregular]">
            Upload png, jpeg, svg, pdf and docs <br />
            Files must be less than 10 MB
          </p>
          <label className="cursor-pointer mt-5 px-8 py-2 py-1 text-sm text-white font-NSregular rounded-[20px] bg-[#3F72AF]">
            UPLOAD
            <input
              type="file"
              ref={techpackRef}
              className="hidden"
              onChange={(e) => handleSingleFileChange(e, "techpack")}
            />
          </label>
        </div>
      );
    }
    
    return (
      <div className="border border-gray-400 rounded-md p-6 w-full h-full bg-white border-[rgba(151,151,151,0.5)]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-gray-800 font-[NSmedium]">TECHPACK*</p>
            
            {/* Add button at the right end of heading */}
            <button
              type="button"
              onClick={() => document.getElementById("techpackInput").click()}
              className="bg-white w-6 h-6 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 flex flex-col">
            {/* File preview taking up entire section */}
            <div className="relative flex-1 mb-4 border border-gray-200 rounded-md overflow-hidden bg-white">
              {files.techpack.file.type.startsWith('image/') ? (
                <img 
                  src={files.techpack.preview} 
                  alt={files.techpack.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                  <img src="/PDFLogo.svg" alt="File" className="w-16 h-16 mb-2" />
                  <p className="text-sm text-gray-600 text-center px-4">{files.techpack.name}</p>
                </div>
              )}
              
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDeleteSingleFile("techpack")}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <input
            id="techpackInput"
            type="file"
            className="hidden"
            onChange={(e) => handleSingleFileChange(e, "techpack")}
          />
          
          <p className="text-xs text-[#000] opacity-[0.67] font-[NSregular] mt-3">
            Upload png, jpeg, svg, pdf and docs. Files must be less than 10 MB
          </p>
        </div>
      </div>
    );
  };

  // Render product images section with scrollbar
  const renderProductImagesSection = () => {
    if (files.productImages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img src="/uploadLogo.svg" alt="Upload" className="mb-2 w-8 h-8" />
          <p className="font-semibold text-gray-800 mb-1 font-[NSmedium]">UPLOAD PRODUCT IMAGES*</p>
          <p className="text-[14px] text-[#000] opacity-[0.67] font-[NSregular]">
            Upload png, jpeg, svg, pdf and docs <br />
            Files must be less than 10 MB
          </p>
          <label className="cursor-pointer mt-5 px-8 py-2 py-1 text-sm text-white font-NSregular rounded-[20px] bg-[#3F72AF] ">
            UPLOAD
            <input
              type="file"
              ref={productImagesRef}
              multiple
              className="hidden"
              onChange={(e) => handleMultiFileChange(e, "productImages")}
            />
          </label>
        </div>
      );
    }
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-gray-800 font-[NSmedium]">PRODUCT IMAGES*</p>
          
          {/* Add more button at right end of heading */}
          <button
            type="button"
            onClick={() => productImagesRef.current.click()}
            className="bg-white w-6 h-6 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 80px)" }}>
          <div className="flex flex-col gap-2">
            {files.productImages.map((fileObj) => (
              <div 
                key={fileObj.id} 
                className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden group mb-2 bg-white shadow-sm hover:shadow transition-all"
              >
                {/* File preview (left side) */}
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                  {fileObj.file.type.startsWith('image/') ? (
                    <img 
                      src={fileObj.preview} 
                      alt={fileObj.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/PDFLogo.svg" alt="File" className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                {/* File info (middle) */}
                <div className="flex-1 px-3 py-2">
                  <p className="text-sm text-gray-700 truncate font-[NSmedium]">
                    {fileObj.name}
                  </p>
                  <p className="text-xs text-gray-500 font-[NSregular]">
                    {Math.round(fileObj.file.size / 1024)} KB
                  </p>
                </div>
                
                {/* Delete button (right side) */}
                <button
                  type="button"
                  onClick={() => handleDeleteFile("productImages", fileObj.id)}
                  className="mr-2 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <input
          type="file"
          ref={productImagesRef}
          multiple
          className="hidden"
          onChange={(e) => handleMultiFileChange(e, "productImages")}
        />
        
        <p className="text-xs text-[#000] opacity-[0.67] font-[NSregular] mt-2">
          Upload png, jpeg, svg, pdf and docs. Files must be less than 10 MB
        </p>
      </div>
    );
  };

  return (
    <div className="mt-[30px] mb-[30px] bg-white min-h-screen rounded-[20px] px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 w-full max-w-full overflow-hidden">
      {/* Status message */}
      {submitStatus.message && (
        <div className={`mb-4 p-3 rounded-md ${
          submitStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {submitStatus.message}
        </div>
      )}
    
      {/* Top Button Group */}
<p className="pb-5 text-[#ACACAC] font-[NSregular]">
  Request for a quote or a sample here
</p>

<div className="flex mb-6">
  {/* NEW RFQ Button */}
  <button 
    className="text-sm cursor-pointer font-[500] font-[NSmedium] px-4 py-2 rounded-tl-[20px] rounded-bl-[20px] border border-[#79747E] bg-[#233B6E] text-white"
    onClick={() => window.location.href = "/rfq"}
  >
    NEW RFQ
  </button>

  {/* RFQ HISTORY Button */}
  <button 
    className="text-sm cursor-pointer font-[500] font-[NSmedium] px-4 py-2 rounded-tr-[20px] rounded-br-[20px] border border-[#79747E] bg-white text-[#1D1B20]"
    onClick={() => window.location.href = "/rfq-history"}
  >
    RFQ HISTORY
  </button>
</div>  

      <form onSubmit={handleSubmit}>
        {/* Row 1 Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 w-full">
  <div className="col-span-1 md:col-span-4">
            <label className="block text-sm font-medium mb-1 font-[NSmedium] text-[#000] opacity-[0.67]">
              Shipping Address*
            </label>
            <input
              type="text"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Shipping Address"
              className="w-full border border-gray-300 font-[NSregular] rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-[NSmedium] mb-1 text-[#000] opacity-[0.67]">
              Quantity*
            </label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="w-full border border-gray-300 font-[NSregular] rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Row 2 Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-[NSregular] text-[#000] opacity-[0.67]">
          {[
            { label: "Lead Time*", name: "leadTime" },
            { label: "Target Price (in $)*", name: "targetPrice" },
            { label: "Fabric Composition*", name: "fabricComposition" },
            { label: "GSM*", name: "gsm" },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-[NSmedium] mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                placeholder={field.label.replace("*", "")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          ))}
        </div>

        {/* Upload Sections - UPDATED LAYOUT to match first design */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left Section: Techpack & Product Images (side by side on large screens) */}
          <div className="flex flex-col lg:flex-row gap-10 w-full lg:w-3/4">
            {/* Techpack */}
            <div className="w-full h-85">
              {renderSingleFilePreview()}
            </div>

            {/* Product Images */}
            <div className="w-full h-85 border border-dashed border-gray-400 rounded-md p-6 bg-white border-[rgba(151,151,151,0.5)]">
              {renderProductImagesSection()}
            </div>
          </div>

      {/* Right Section: Swatch, Fabric, Miscellaneous */}
      <div className="flex flex-col gap-4 w-full lg:w-1/4">
            {/* Colour Swatch */}
            <div className="flex flex-col border border-gray-400 rounded-[10px] p-4 bg-white h-28">
              {files.colorSwatch.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleMultiFileDrop(e, "colorSwatch")}
                  onClick={() => swatchRef.current.click()}
                >
                  <img src="/SwatchLogo.svg" alt="Swatch" className="mb-1 w-6 h-6" />
                  <p className="font-semibold text-[#000] opacity-[0.67] text-sm mb-1 font-[NSmedium]">COLOR SWATCH*</p>
                  <p className="text-xs text-[#000] opacity-[0.67] font-[NSregular]">Drop files here or Browse</p>
                  <input
                    type="file"
                    ref={swatchRef}
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultiFileChange(e, "colorSwatch")}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-[#000] opacity-[0.67] text-sm font-[NSmedium]">COLOR SWATCH*</p>
                    
                    {/* Add more button */}
                    <button
                      type="button"
                      onClick={() => swatchRef.current.click()}
                      className="bg-white w-5 h-5 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin" style={{ maxHeight: "calc(100% - 25px)" }}>
                    <div className="flex flex-col gap-1">
                      {files.colorSwatch.map((fileObj) => (
                        <div 
                          key={fileObj.id} 
                          className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden group mb-1 bg-white shadow-sm hover:shadow transition-all"
                        >
                          {/* Mini preview */}
                          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                            {fileObj.file.type.startsWith('image/') ? (
                              <img 
                                src={fileObj.preview} 
                                alt={fileObj.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <img src="/PDFLogo.svg" alt="File" className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          
                          {/* Filename */}
                          <div className="flex-1 px-2 py-1">
                            <p className="text-xs text-gray-700 truncate font-[NSregular]">
                              {fileObj.name}
                            </p>
                          </div>
                          
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteFile("colorSwatch", fileObj.id)}
                            className="mr-1 p-1 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    ref={swatchRef}
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultiFileChange(e, "colorSwatch")}
                  />
                </div>
              )}
            </div>

            {/* Fabric */}
            <div className="flex flex-col border border-gray-400 rounded-[10px] p-4 bg-white h-28">
              {files.fabric.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleMultiFileDrop(e, "fabric")}
                  onClick={() => fabricRef.current.click()}
                >
                  <img src="/PDFLogo.svg" alt="PDF" className="mb-1 w-6 h-6" />
                  <p className="font-semibold text-[#000] opacity-[0.67] text-sm mb-1 font-[NSmedium]">FABRIC*</p>
                  <p className="text-xs text-[#000] opacity-[0.67] font-[NSregular]">Drop files here or Browse</p>
                  <input
                    type="file"
                    ref={fabricRef}
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultiFileChange(e, "fabric")}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-[#000] opacity-[0.67] text-sm font-[NSmedium]">FABRIC*</p>
                    
                    {/* Add more button */}
                    <button
                      type="button"
                      onClick={() => fabricRef.current.click()}
                      className="bg-white w-5 h-5 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin" style={{ maxHeight: "calc(100% - 25px)" }}>
                    <div className="flex flex-col gap-1">
                      {files.fabric.map((fileObj) => (
                        <div 
                          key={fileObj.id} 
                          className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden group mb-1 bg-white shadow-sm hover:shadow transition-all"
                        >
                          {/* Mini preview */}
                          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                            {fileObj.file.type.startsWith('image/') ? (
                              <img 
                                src={fileObj.preview} 
                                alt={fileObj.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <img src="/PDFLogo.svg" alt="File" className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          
                          {/* Filename */}
                          <div className="flex-1 px-2 py-1">
                            <p className="text-xs text-gray-700 truncate font-[NSregular]">
                              {fileObj.name}
                            </p>
                          </div>
                          
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteFile("fabric", fileObj.id)}
                            className="mr-1 p-1 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    ref={fabricRef}
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultiFileChange(e, "fabric")}
                  />
                </div>
              )}
            </div>

            {/* Miscellaneous */}
            <div className="flex flex-col border border-gray-400 rounded-[10px] p-4 bg-white h-28">
              {files.miscellaneous.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleMultiFileDrop(e, "miscellaneous")}
                  onClick={() => miscRef.current.click()}
                >
                  <p className="font-semibold text-[#000] opacity-[0.67] text-sm mb-1 font-[NSmedium]">MISCELLANEOUS</p>
                  <p className="text-xs text-[#000] opacity-[0.67] font-[NSregular]">Drop files here or Browse</p>
                  <input
                    type="file"
                    ref={miscRef}
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultiFileChange(e, "miscellaneous")}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-[#000] opacity-[0.67] text-sm font-[NSmedium]">MISCELLANEOUS</p>
                    
                    {/* Add more button */}
                    <button
                      type="button"
                      onClick={() => miscRef.current.click()}
                      className="bg-white w-5 h-5 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin" style={{ maxHeight: "calc(100% - 25px)" }}>
                    <div className="flex flex-col gap-1">
                      {files.miscellaneous.map((fileObj) => (
                        <div 
                          key={fileObj.id} 
                          className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden group mb-1 bg-white shadow-sm hover:shadow transition-all"
                        >
                          {/* Mini preview */}
                          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                            {fileObj.file.type.startsWith('image/') ? (
                              <img 
                                src={fileObj.preview} 
                                alt={fileObj.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <img src="/PDFLogo.svg" alt="File" className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          
                          {/* Filename */}
                          <div className="flex-1 px-2 py-1">
                            <p className="text-xs text-gray-700 truncate font-[NSregular]">
                              {fileObj.name}
                            </p>
                          </div>
                          
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteFile("miscellaneous", fileObj.id)}
                            className="mr-1 p-1 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    ref={miscRef}
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultiFileChange(e, "miscellaneous")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div className="mb-6">
          <label className="block text-sm font-[NSmedium] mb-1">Order Notes</label>
          <textarea
            name="orderNotes"
            value={formData.orderNotes}
            onChange={handleInputChange}
            placeholder="Order Notes"
            className="w-full border border-gray-300 rounded-md font-[NSregular] px-3 py-2"
            rows={3}
          ></textarea>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center">
  {/* Left Side: Sample Option + Selector */}
  <div className="flex flex-col gap-3 p-4 rounded-md border border-gray-200 pl-4 sm:pl-10 w-full lg:w-auto">
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[#000] opacity-[0.67]">
      <span className="font-medium font-[NSregular] mr-2 sm:mr-4">
        Would you like to order a sample?
      </span>
      <div className="flex gap-2 sm:gap-4 flex-wrap">
        <label className="flex items-center gap-2 font-[NSregular]">
          <input 
            type="radio" 
            name="sample" 
            value="yes"
            checked={formData.requestSample === true} 
            onChange={handleSampleRequestChange}
            className="w-4 h-4" 
          /> Yes
        </label>
        <label className="flex items-center gap-2 font-[NSregular]">
          <input 
            type="radio" 
            name="sample" 
            value="no"
            checked={formData.requestSample === false} 
            onChange={handleSampleRequestChange}
            className="w-4 h-4" 
          /> No
        </label>
      </div>
    </div>

          {/* Sample count selector - only show if requestSample is true */}
    {formData.requestSample && (
      <div className="flex flex-wrap items-center gap-2 text-[#000] opacity-[0.67]">
        <span className="font-medium font-[NSregular] mr-2 sm:mr-5">
          Select number of samples
        </span>
        <div className="flex items-center">
          <button 
            type="button"
            onClick={decrement} 
            className="cursor-pointer"
          >
            <img src="/MinusIcon.svg" alt="Minus" className="w-5 h-5" />
          </button>
          <span className="w-6 text-center font-[NSregular]">
            {formData.sampleCount}
          </span>
          <button 
            type="button"
            onClick={increment} 
            className="cursor-pointer"
          >
            <img src="/PlusIcon.svg" alt="Plus" className="w-5 h-5" />
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Right Side: Submit Button */}
  <button 
    type="submit" 
    disabled={isSubmitting}
    className={`bg-[#194185] text-white px-6 py-2 mt-4 lg:mt-0 rounded-[20px] font-[NSregular] ${
      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
    }`}
  >
    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
  </button>
</div>
      </form>
    </div>
  );
};

export default RFQForm;