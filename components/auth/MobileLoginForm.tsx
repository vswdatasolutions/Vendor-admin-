
import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button.tsx';
import LoadingSpinner from '../common/LoadingSpinner.tsx';
import { constants } from '../../constants.ts';

interface MobileLoginFormProps {
  onLogin: (success: boolean) => void;
}

const MobileLoginForm: React.FC<MobileLoginFormProps> = ({ onLogin }) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Mobile, 2: OTP, 3: Branch Select
  const [otpCooldown, setOtpCooldown] = useState<number>(0);
  const otpCooldownRef = useRef<number | null>(null);
  
  // Mock User Branches
  const [userBranches] = useState([
    { id: '1', name: 'Main Campus Cafe' },
    { id: '2', name: 'East Wing Coffee Shop' },
    { id: '3', name: 'Downtown Hub' }
  ]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('1');

  useEffect(() => {
    if (otpCooldown > 0) {
      otpCooldownRef.current = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
    } else if (otpCooldownRef.current) {
      clearTimeout(otpCooldownRef.current);
    }
    return () => { if (otpCooldownRef.current) clearTimeout(otpCooldownRef.current); };
  }, [otpCooldown]);

  const mobileRegex = /^\+?\d{10,14}$/;
  const otpRegex = /^\d{6}$/;
  const isMobileNumberValid = mobileRegex.test(mobileNumber);
  const isOtpValid = otpRegex.test(otp);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!isMobileNumberValid) {
      setError('Please enter a valid mobile number.');
      setLoading(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
      setOtpCooldown(60);
      setError(null);
    } catch (apiError) {
      setError('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!isOtpValid) {
      setError('Please enter a valid 6-digit OTP.');
      setLoading(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In a real app, response would contain available branches
      if (userBranches.length > 1) {
          setStep(3); // Go to branch selection
      } else {
          onLogin(true); // Direct login if only 1 branch
      }
    } catch (apiError) {
      setError('Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSelect = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, you would set the global context here or store token
      // For this demo, we assume App.tsx sets up default or we pass it up
      onLogin(true);
  }

  return (
    <div className="bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {step === 1 ? 'Welcome Back' : step === 2 ? 'Verify OTP' : 'Select Branch'}
        </h2>
        <p className="text-gray-500">
          {step === 1 ? 'Enter your mobile number to access your dashboard.' : 
           step === 2 ? `Enter the code sent to ${mobileNumber}` : 
           'Choose the branch you want to manage.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 animate-modal-in">
           <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </span>
                <input 
                    type="tel" 
                    id="mobileNumber" 
                    value={mobileNumber} 
                    onChange={(e) => setMobileNumber(e.target.value)} 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offoOrange focus:border-offoOrange transition-colors text-gray-900 placeholder-gray-400 text-lg" 
                    placeholder="+91 9876543210" 
                    required 
                />
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full py-3.5 text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40" disabled={loading || !isMobileNumberValid}>
            {loading ? <LoadingSpinner /> : 'Get OTP'}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">One-Time Password</label>
                <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="text-sm text-offoOrange hover:text-offoOrange-dark font-medium transition-colors">Change Number?</button>
            </div>
            <input 
                type="text" 
                id="otp" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-offoOrange focus:border-offoOrange text-center text-3xl tracking-[0.5em] font-bold text-gray-800 transition-colors placeholder-gray-200" 
                maxLength={6} 
                placeholder="000000" 
                required 
                autoFocus
            />
          </div>
          
          <Button type="submit" variant="primary" className="w-full py-3.5 text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40" disabled={loading || !isOtpValid}>
            {loading ? <LoadingSpinner /> : 'Verify & Login'}
          </Button>
          
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 mb-3">Didn't receive the code?</p>
            <Button 
                type="button" 
                variant="ghost" 
                onClick={handleSendOTP} 
                disabled={loading || otpCooldown > 0} 
                className={`text-sm font-medium ${otpCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-offoOrange hover:bg-orange-50'}`}
            >
              {otpCooldown > 0 ? `Resend available in ${otpCooldown}s` : 'Resend OTP'}
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleBranchSelect} className="space-y-6 animate-modal-in">
           <div>
               <label className="block text-sm font-semibold text-gray-700 mb-4">Available Branches</label>
               <div className="space-y-3">
                   {userBranches.map(branch => (
                       <label key={branch.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedBranchId === branch.id ? 'border-offoOrange bg-orange-50 ring-1 ring-offoOrange' : 'border-gray-200 hover:border-gray-300'}`}>
                           <input 
                                type="radio" 
                                name="branch" 
                                value={branch.id} 
                                checked={selectedBranchId === branch.id}
                                onChange={() => setSelectedBranchId(branch.id)}
                                className="h-5 w-5 text-offoOrange focus:ring-offoOrange border-gray-300"
                           />
                           <span className={`ml-3 font-medium ${selectedBranchId === branch.id ? 'text-gray-900' : 'text-gray-600'}`}>
                               {branch.name}
                           </span>
                       </label>
                   ))}
               </div>
           </div>
           <Button type="submit" variant="primary" className="w-full py-3.5 text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
             Continue to Dashboard
           </Button>
        </form>
      )}
    </div>
  );
};

export default MobileLoginForm;
