'use client';

import { useState } from 'react';
import OTPPopup from '../components/otpPopup'; // Import the OTP popup component

export default function AuthSwitcher() {
  const [activeForm, setActiveForm] = useState('signin');
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    email: '',
    phoneNumber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'phoneNumber') {
      setPhoneNumber(value);
    }
  };

  const handleSendOtp = () => {
    // In a real app, you would validate the phone number here
    setIsOtpPopupOpen(true);
    // Here you would call your API to send OTP
  };

  const handleVerifyOtp = (otpValue) => {
    console.log('OTP Verified:', otpValue);
    // Here you would validate the OTP with your backend
    setIsOtpPopupOpen(false);
    // On successful verification, redirect to dashboard or home page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full h-[65px] flex items-center px-6 shadow-lg bg-white">
        <img src="/LoomizLogoDarkBlue.svg" alt="Logo" className="h-[40px] w-auto ml-15" />
      </div>
      <div className="flex h-[calc(100vh-65px)] font-[NSregular]">
        {/* Left Panel */}
        <div className={`flex flex-col justify-center items-center flex-1 p-10 transition-colors ${activeForm === 'signup' ? 'bg-white' : 'bg-[#F6F3EC]'}`}>
          {activeForm === 'signup' ? (
            <div className="w-full max-w-[480px] flex flex-col gap-6">
              <h2 className="text-[64px] font-[Smedium] text-[#233B6E] text-center">Create Account</h2>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Name', name: 'name' },
                  { label: 'Brand Name', name: 'brandName' },
                  { label: 'Email', name: 'email' },
                  { label: 'Phone Number', name: 'phoneNumber' }
                ].map((field, i) => (
                  <label key={i} className="flex flex-col w-full font-[NSmedium] text-black/70">
                    {field.label}*
                    <input
                      type={field.label === 'Email' ? 'email' : 'text'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={`Enter your ${field.label}`}
                      className="p-3 border border-[#979797] rounded-[10px] w-full h-[50px] text-[18px] placeholder-[#B4B4B4] font-[NSregular] bg-transparent"
                    />
                  </label>
                ))}
              </div>
              <button 
                onClick={handleSendOtp}
                className="bg-[#3F72AF] text-white px-12 py-2 rounded-[20px] text-[16px] font-[NSregular] mx-auto"
              >
                SEND OTP
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-[44px] font-[Smedium] text-[#233B6E]">Hello!</h2>
              <p className="text-[18px] text-black/70 font-[NSregular] mx-[220px] my-4">Enter your details and start journey with us</p>
              <button
                onClick={() => setActiveForm('signup')}
                className="px-[34px] py-2 bg-[#EDF5FF] text-[#3f71b8] rounded-[20px] text-[14px]"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className={`flex flex-col justify-center items-center flex-1 p-10 transition-colors ${activeForm === 'signin' ? 'bg-white' : 'bg-[#F6F3EC]'}`}>
          {activeForm === 'signin' ? (
            <div className="w-full max-w-[480px] flex flex-col gap-6">
              <h2 className="text-[44px] font-[Smedium] text-[#233B6E] text-center">Sign In</h2>
              <label className="flex flex-col w-full font-[NSmedium] text-black/70">
                Phone Number*
                <input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="p-3 border border-[#979797] rounded-[10px] w-full h-[50px] text-[18px] placeholder-[#B4B4B4] font-[NSregular] bg-transparent"
                />
              </label>

              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-[28px] h-[24px] accent-[#3f71b8]" />
                <label className="text-[#979797] text-[16px] font-[NSregular]">
                  Remember me
                </label>
              </div>

              <button 
                onClick={handleSendOtp}
                className="bg-[#3f71b8] text-white px-6 py-2 rounded-[20px] text-[16px] w-[146px] font-[NSregular] mx-auto"
              >
                SEND OTP
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-[44px] font-[Smedium] text-[#233B6E]">Welcome Back</h2>
              <p className="text-[18px] text-black/70 font-[NSregular] mx-[170px] my-4">To be connected with us please login with your personal info</p>
              <button
                onClick={() => setActiveForm('signin')}
                className="px-[38px] py-2 bg-[#EDF5FF] text-[#3f71b8] rounded-[20px] text-[14px]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OTP Popup */}
      <OTPPopup 
        isOpen={isOtpPopupOpen}
        onClose={() => setIsOtpPopupOpen(false)}
        onVerify={handleVerifyOtp}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}