'use client';

import { Upload } from 'lucide-react';

const RegistrationFormPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      ></div>
      
      {/* Popup content */}
      <div className="relative bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* Notice Banner */}
          <div className="border border-purple-300 border-dashed p-3 mb-6 bg-purple-50 rounded">
            <p className="text-sm text-purple-800 flex items-center">
              <span className="mr-2">ℹ️</span>
              Kindly ensure the following details are completed, as the RFQ will not be processed without them.
            </p>
          </div>

          {/* Form Sections */}
          <form>
            {/* PERSON OF CONTACT */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold uppercase">PERSON OF CONTACT</h2>
                <button type="button" className="text-blue-600 text-sm">Edit</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Contact Person Name*</label>
                  <input 
                    type="text" 
                    placeholder="Name of Contact Person" 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone No. *</label>
                  <input 
                    type="text" 
                    placeholder="Phone No." 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email*</label>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* COMPANY PROFILE */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold uppercase">COMPANY PROFILE</h2>
                <button type="button" className="text-blue-600 text-sm">Edit</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Registered company name*</label>
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">GST/Tax Id</label>
                  <input 
                    type="text" 
                    placeholder="GST/Tax Id" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Tax registration certificate *</label>
                  <button type="button" className="bg-gray-200 text-gray-700 p-2 rounded w-full flex justify-center items-center">
                    UPLOAD
                  </button>
                </div>
                <div>
                  <label className="block text-sm mb-1">Business No.*</label>
                  <input 
                    type="text" 
                    placeholder="Business No." 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Country of Incorporation *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your COI" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS DETAIL */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold uppercase">ADDRESS DETAIL</h2>
                <button type="button" className="text-blue-600 text-sm">Edit</button>
              </div>
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Registered Company Address</h3>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Apartment No/Street Address *</label>
                  <input 
                    type="text" 
                    placeholder="Apartment No/Street Address" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">State *</label>
                  <input 
                    type="text" 
                    placeholder="State" 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Country *</label>
                  <input 
                    type="text" 
                    placeholder="Country" 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Postcode/Zip *</label>
                  <input 
                    type="text" 
                    placeholder="Postcode/Zip" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* FINANCIAL DETAIL */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold uppercase">FINANCIAL DETAIL</h2>
                <button type="button" className="text-blue-600 text-sm">Edit</button>
              </div>
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Bank Details</h3>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Branch Name*</label>
                  <input 
                    type="text" 
                    placeholder="Branch Name" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">State *</label>
                  <input 
                    type="text" 
                    placeholder="State" 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Country *</label>
                  <input 
                    type="text" 
                    placeholder="Country" 
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Postcode/Zip *</label>
                  <input 
                    type="text" 
                    placeholder="Postcode/Zip" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Bank Certificate</label>
                  <div className="border rounded p-2">
                    <div className="flex items-center justify-center bg-gray-50 py-2 cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">upload from browser/drive</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">You can upload files in pdf format only upto 100 kb</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Import/Export License</label>
                  <div className="border rounded p-2">
                    <div className="flex items-center justify-center bg-gray-50 py-2 cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm">upload from browser/drive</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">You can upload files in pdf format only upto 100 kb</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                SAVE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormPopup;