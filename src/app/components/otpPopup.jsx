import { useState, useRef, useEffect } from 'react';

export default function OTPPopup({ isOpen, onClose, onVerify, phoneNumber }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [timer, setTimer] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);

  useEffect(() => {
    if (isOpen && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendActive(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    setTimer(30);
    setIsResendActive(false);
    // Focus on first input
    inputRefs[0].current.focus();
    // Here you would trigger the OTP resend API
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      onVerify(otpValue);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Popup */}
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative z-10 shadow-xl">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-medium text-[#233B6E] mb-4">OTP Verification</h2>
          
          <p className="text-black/70 text-center mb-6">
            Enter the 4-digit code sent to your phone number
            <span className="block font-medium mt-1">{phoneNumber || '+91 ●●●● ●●●●99'}</span>
          </p>
          
          {/* OTP Input Fields */}
          <div className="flex gap-3 mb-8 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl border border-[#979797] rounded-lg focus:border-[#3F72AF] focus:outline-none"
              />
            ))}
          </div>
          
          {/* Verify Button */}
          <button 
            onClick={handleVerify}
            className="bg-[#3F72AF] text-white px-8 py-2 rounded-[20px] text-[16px] font-normal w-40 mb-4 hover:bg-[#2a5992] transition-colors"
          >
            VERIFY
          </button>
          
          {/* Timer and Resend */}
          <div className="flex items-center gap-2 text-[#979797]">
            <span>Didn't receive code?</span>
            {timer > 0 ? (
              <span>Resend in {timer}s</span>
            ) : (
              <button 
                onClick={handleResend} 
                className="text-[#3F72AF] font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}