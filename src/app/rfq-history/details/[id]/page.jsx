"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const RFQDetailsPage = () => {
  // State for storing RFQ details
  const [rfqDetails, setRfqDetails] = useState({
    id: "",
    shippingAddress: "",
    quantity: "",
    leadTime: "",
    targetPrice: "",
    fabricComposition: "",
    gsm: "",
    orderNotes: "",
    requestSample: false,
    sampleCount: 0,
    files: {
      techpack: null,
      productImages: [],
      colorSwatch: [],
      fabric: [],
      miscellaneous: []
    }
  });

  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for current preview file (used for modal)
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Get the pathname to extract the ID
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchRFQDetails = async () => {
      try {
        // Extract the ID from the pathname
        const id = pathname.split('/').pop();
        
        if (!id) {
          throw new Error("RFQ ID not found in the URL");
        }

        // Make API call to get RFQ details
        const response = await fetch(`/api/rfq/details?id=${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch RFQ details");
        }
        
        const data = await response.json();
        
        // Update state with fetched data
        setRfqDetails(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching RFQ details:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchRFQDetails();
  }, [pathname]);

  // Handle back button
  const handleBackClick = () => {
    // Try to use browser history first
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to direct navigation
      router.push('/rfq-history');
    }
  };

  // Handle file preview
  const handleFilePreview = (file) => {
    // Only set preview for image files
    if (file.type?.startsWith('image/')) {
      setPreviewFile(file);
      setShowPreview(true);
    } else if (file.type === 'application/pdf') {
      // For PDF files, open in a new tab instead of preview
      window.open(file.url, '_blank');
    } else {
      // For other files, try to download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    }
  };

  // Handle direct download without preview
  const handleFileDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  // Close preview modal
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewFile(null);
  };

  // Use this for mobile state detection
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#233B6E]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
        <button 
          onClick={() => router.push('/rfq-history')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded flex items-center gap-2 border border-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to RFQ History
        </button>
      </div>
    );
  }

  // Render file preview component for multi-file sections
  const renderFileList = (files, label) => {
    if (!files || files.length === 0) {
      return (
        <div className="text-center text-gray-500 italic">
          No {label.toLowerCase()} files
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-2">
        <p className="font-semibold text-[#000] opacity-[0.67] text-sm font-[NSmedium]">
          {label}
        </p>
        <div className="overflow-y-auto pr-2" style={{ maxHeight: "200px" }}>
          <div className="flex flex-col gap-2">
            {files.map((file, index) => (
              <div 
                key={index}
                onClick={() => handleFilePreview(file)}
                className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* File preview (left side) */}
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                  {file.type?.startsWith('image/') ? (
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.svg";
                      }}
                    />
                  ) : file.type === 'application/pdf' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/PDFLogo.svg" alt="PDF" className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/file-icon.svg" alt="File" className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                {/* File info (middle) */}
                <div className="flex-1 px-3 py-2">
                  <p className="text-sm text-gray-700 truncate font-[NSmedium]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 font-[NSregular]">
                    {Math.round(file.size / 1024)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render techpack preview
  const renderTechpackPreview = () => {
    const techpack = rfqDetails.files.techpack;
    
    if (!techpack) {
      return (
        <div className="text-center text-gray-500 italic p-6">
          No techpack file
        </div>
      );
    }
    
    return (
      <div className="border border-gray-400 rounded-md p-6 w-full h-full bg-white relative">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <p className="font-semibold text-gray-800 uppercase font-[NSmedium]">TECHPACK</p>
            
            {/* Download icon in top right */}
            <button 
              onClick={() => handleFileDownload(techpack)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Download Techpack"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-1">
            {/* File preview taking up entire section */}
            <div className="w-full flex flex-col items-center justify-center">
              {techpack.type?.startsWith('image/') ? (
                <div className="w-full flex justify-center mb-2">
                  <img 
                    src={techpack.url} 
                    alt="Techpack Document" 
                    className="max-h-60 object-contain border border-gray-200 rounded-md p-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.svg";
                    }}
                  />
                </div>
              ) : techpack.type === 'application/pdf' ? (
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="w-32 h-40 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src="/PDFLogo.svg" alt="PDF" className="w-24 h-24 object-contain" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="w-32 h-40 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src="/file-icon.svg" alt="File" className="w-24 h-24 object-contain" onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/PDFLogo.svg";
                    }} />
                  </div>
                </div>
              )}
              
              <p className="text-base text-gray-800 mt-4 font-[NSmedium]">Techpack Document</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Render product images section
const renderProductImagesSection = () => {
  const productImages = rfqDetails.files.productImages;
  
  if (!productImages || productImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-gray-500 italic">No product images</p>
      </div>
    );
  }
  
  // Function to generate a standard name based on index
  const getStandardName = (index) => {
    return `Product Image ${index + 1}`;
  };
  
  return (
    <div className="h-full flex flex-col">
      <p className="font-semibold text-gray-800 font-[NSmedium] mb-4">PRODUCT IMAGES</p>
      
      <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 80px)" }}>
        <div className="flex flex-col gap-2">
          {productImages.map((file, index) => (
            <div 
              key={index}
              onClick={() => handleFilePreview(file)}
              className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* File preview (left side) */}
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                {file.type?.startsWith('image/') ? (
                  <img 
                    src={file.url} 
                    alt={getStandardName(index)} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.svg";
                    }}
                  />
                ) : file.type === 'application/pdf' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img src="/PDFLogo.svg" alt="PDF" className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img src="/file-icon.svg" alt="File" className="w-8 h-8" onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/PDFLogo.svg";
                    }} />
                  </div>
                )}
              </div>
              
              {/* File info (middle) */}
              <div className="flex-1 px-3 py-2">
                <p className="text-sm text-gray-700 font-[NSmedium]">
                  {getStandardName(index)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-[#000] opacity-[0.67] font-[NSregular] mt-2">
        Total files: {productImages.length}
      </p>
    </div>
  );
};
// Render small file section (swatch, fabric, miscellaneous)
const renderSmallFileSection = (files, title) => {
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col border border-gray-400 rounded-[10px] p-4 bg-white h-28">
        <p className="font-semibold text-[#000] opacity-[0.67] text-sm font-[NSmedium]">{title}</p>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 italic text-xs">No files uploaded</p>
        </div>
      </div>
    );
  }
  
  // Function to generate standard file names based on section and index
  const getSectionDisplayName = (sectionTitle, index) => {
    if (sectionTitle === "COLOR SWATCH") {
      return `Color ${index + 1}`;
    } else if (sectionTitle === "FABRIC") {
      return `Fabric Sample ${index + 1}`;
    } else {
      return `File ${index + 1}`;
    }
  };
  
  return (
    <div className="flex flex-col border border-gray-400 rounded-[10px] p-4 bg-white h-28">
      <p className="font-semibold text-[#000] opacity-[0.67] text-sm font-[NSmedium] mb-1">{title}</p>
      
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin" style={{ maxHeight: "calc(100% - 25px)" }}>
        <div className="flex flex-col gap-1">
          {files.map((file, index) => (
            <div 
              key={index}
              onClick={() => handleFilePreview(file)}
              className="flex items-center w-full border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm mb-1 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Mini preview */}
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                {file.type?.startsWith('image/') ? (
                  <img 
                    src={file.url} 
                    alt={getSectionDisplayName(title, index)} 
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
                  {getSectionDisplayName(title, index)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// File Preview Modal - Simplified version
const renderFilePreviewModal = () => {
  if (!showPreview || !previewFile) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Close button */}
        <button 
          onClick={handleClosePreview}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Close preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Image content */}
        {previewFile.type?.startsWith('image/') && (
          <img 
            src={previewFile.url} 
            alt="Image Preview" 
            className="max-w-full max-h-[95vh] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.svg";
            }}
          />
        )}
      </div>
    </div>
  );
};

// Formatted date (if available)
const formattedDate = rfqDetails.createdAt 
  ? new Date(rfqDetails.createdAt).toLocaleDateString() 
  : 'N/A';

return (
  <div className="mt-[30px] mb-[30px] bg-white min-h-screen rounded-[20px] px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 w-full max-w-full overflow-hidden">
    {/* Top section with status */}
    <div className="mb-6">
      <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
        <button 
          onClick={handleBackClick}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-medium text-gray-800">
          RFQ Details
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="bg-[#E8F1FF] text-[#233B6E] px-3 py-1 rounded-full text-sm font-[NSmedium]">
          RFQ #{rfqDetails.id}
        </div>
        <div className="text-gray-500 text-sm">
          Submitted on: {formattedDate}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-[NSmedium] ${
          rfqDetails.status === 'Approved' ? 'bg-green-100 text-green-800' :
          rfqDetails.status === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {rfqDetails.status || 'Pending'}
        </div>
      </div>
    </div>

    <div className="mb-8">
      {/* Row 1 Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 w-full">
        <div className="col-span-1 md:col-span-4">
          <label className="block text-sm font-medium mb-1 font-[NSmedium] text-[#000] opacity-[0.67]">
            Shipping Address
          </label>
          <div className="w-full border border-gray-300 font-[NSregular] rounded-md px-3 py-2 bg-gray-50">
            {rfqDetails.shippingAddress || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-[NSmedium] mb-1 text-[#000] opacity-[0.67]">
            Quantity
          </label>
          <div className="w-full border border-gray-300 font-[NSregular] rounded-md px-3 py-2 bg-gray-50">
            {rfqDetails.quantity || 'N/A'}
          </div>
        </div>
      </div>

      {/* Row 2 Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-[NSregular] text-[#000] opacity-[0.67]">
        {[
          { label: "Lead Time", key: "leadTime" },
          { label: "Target Price (in $)", key: "targetPrice" },
          { label: "Fabric Composition", key: "fabricComposition" },
          { label: "GSM", key: "gsm" },
        ].map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-[NSmedium] mb-1">{field.label}</label>
            <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              {rfqDetails[field.key] || 'N/A'}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Sections - View Only */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left Section: Techpack & Product Images */}
        <div className="flex flex-col lg:flex-row gap-10 w-full lg:w-3/4">
          {/* Techpack */}
          <div className="w-full h-85">
            {renderTechpackPreview()}
          </div>

          {/* Product Images */}
          <div className="w-full h-85 border border-dashed border-gray-400 rounded-md p-6 bg-white border-[rgba(151,151,151,0.5)]">
            {renderProductImagesSection()}
          </div>
        </div>

        {/* Right Section: Swatch, Fabric, Miscellaneous */}
        <div className="flex flex-col gap-4 w-full lg:w-1/4">
          {/* Colour Swatch */}
          {renderSmallFileSection(rfqDetails.files.colorSwatch, "COLOR SWATCH")}

          {/* Fabric */}
          {renderSmallFileSection(rfqDetails.files.fabric, "FABRIC")}

          {/* Miscellaneous */}
          {renderSmallFileSection(rfqDetails.files.miscellaneous, "MISCELLANEOUS")}
        </div>
      </div>

      {/* Order Notes */}
      <div className="mb-6">
        <label className="block text-sm font-[NSmedium] mb-1">Order Notes</label>
        <div className="w-full border border-gray-300 rounded-md font-[NSregular] px-3 py-2 bg-gray-50 min-h-[80px]">
          {rfqDetails.orderNotes || 'No notes provided'}
        </div>
      </div>

      {/* Sample Request Info */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div className="flex flex-col gap-3 p-4 rounded-md border border-gray-200 pl-4 sm:pl-10 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[#000] opacity-[0.67]">
            <span className="font-medium font-[NSregular] mr-2 sm:mr-4">
              Sample requested:
            </span>
            <span className="font-[NSregular]">
              {rfqDetails.requestSample ? 'Yes' : 'No'}
            </span>
          </div>

          {/* Sample count info - only show if requestSample is true */}
          {rfqDetails.requestSample && (
            <div className="flex flex-wrap items-center gap-2 text-[#000] opacity-[0.67]">
              <span className="font-medium font-[NSregular] mr-2 sm:mr-5">
                Number of samples:
              </span>
              <span className="font-[NSregular]">
                {rfqDetails.sampleCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* File Preview Modal */}
    {renderFilePreviewModal()}
  </div>
);
};

export default RFQDetailsPage;