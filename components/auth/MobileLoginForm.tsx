import React, { useState } from 'react';
import Button from '../common/Button.tsx';
import Card from '../common/Card.tsx';
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
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCooldown, setOtpCooldown] = useState<number>(0);
  const otpCooldownRef = React.useRef<number | null>(null);

  React.useEffect(() => {
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
      setOtpSent(true);
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
      onLogin(true);
    } catch (apiError) {
      setError('Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className={`text-3xl font-bold text-center mb-6 text-${constants.colors.TEXT_LIGHT}`}>Login with Mobile</h2>
      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label htmlFor="mobileNumber" className={`block text-sm font-medium text-${constants.colors.TEXT_LIGHT} mb-1`}>Mobile Number</label>
            <input type="tel" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className={`mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-offoOrange focus:border-offoOrange sm:text-sm transition-all duration-200 bg-gray-700 text-${constants.colors.TEXT_LIGHT} placeholder-gray-400`} placeholder="+1234567890" required />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={loading || !isMobileNumberValid}>{loading ? <LoadingSpinner /> : 'Send OTP'}</Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <p className={`text-sm text-${constants.colors.ACCENT_GRAY} text-center`}>OTP sent to <span className="font-semibold text-offoOrange">{mobileNumber}</span>.</p>
          <div>
            <label htmlFor="otp" className={`block text-sm font-medium text-${constants.colors.TEXT_LIGHT} mb-1`}>OTP</label>
            <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className={`mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-offoOrange focus:border-offoOrange sm:text-sm text-center tracking-widest transition-all duration-200 bg-gray-700 text-${constants.colors.TEXT_LIGHT} placeholder-gray-400`} maxLength={6} placeholder="______" required />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={loading || !isOtpValid}>{loading ? <LoadingSpinner /> : 'Verify OTP'}</Button>
          <div className="text-center mt-3">
            <Button type="button" variant="ghost" onClick={handleSendOTP} disabled={loading || otpCooldown > 0 || !isMobileNumberValid} className="text-sm">
              {loading ? <LoadingSpinner /> : (otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : 'Resend OTP')}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

export default MobileLoginForm;