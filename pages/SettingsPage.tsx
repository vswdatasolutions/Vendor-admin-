import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import { constants } from '../constants.ts';
import { PayoutMethod, BankAccount, UPIAccount } from '../types.ts';

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vendor Profile State
  const [vendorProfile, setVendorProfile] = useState({
    name: 'Healthy Bites Catering',
    email: 'contact@healthybites.com',
    phone: '+91 9876543210',
    description: 'Fresh & Healthy Food Provider',
  });
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVendorProfile(prev => ({ ...prev, [name]: value }));
  };
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Vendor profile updated!');
    setLoading(false);
  };

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setLoading(false);
  };

  // Payout Details State
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>(PayoutMethod.BANK);
  const [bankAccount, setBankAccount] = useState<BankAccount>({
    bankName: 'State Bank of India',
    accountNumber: 'XXXXX12345',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Healthy Bites Pvt Ltd',
  });
  const [upiAccount, setUpiAccount] = useState<UPIAccount>({
    upiId: 'healthybites@upi',
    accountHolderName: 'Healthy Bites Pvt Ltd',
  });
  const handlePayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (payoutMethod === PayoutMethod.BANK) {
      setBankAccount(prev => ({ ...prev, [name]: value }));
    } else {
      setUpiAccount(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleUpdatePayout = async () => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Payout details updated!');
    setLoading(false);
  };

  // Toggles
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [isTaxEnabled, setIsTaxEnabled] = useState(true);
  const handleToggleKitchen = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsKitchenOpen(prev => !prev);
    alert(`Kitchen is now ${isKitchenOpen ? 'Closed' : 'Open'}.`);
    setLoading(false);
  };
  const handleToggleTax = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsTaxEnabled(prev => !prev);
    alert(`Tax/GST is now ${isTaxEnabled ? 'Disabled' : 'Enabled'}.`);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK} mb-6`}>Settings</h1>

      {/* Vendor Profile Update */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Vendor Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="profileName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Cafe Name</label>
            <input type="text" id="profileName" name="name" value={vendorProfile.name} onChange={handleProfileChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="profileEmail" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Email</label>
            <input type="email" id="profileEmail" name="email" value={vendorProfile.email} onChange={handleProfileChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="profilePhone" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Phone</label>
            <input type="tel" id="profilePhone" name="phone" value={vendorProfile.phone} onChange={handleProfileChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="profileDescription" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Description</label>
            <textarea id="profileDescription" name="description" value={vendorProfile.description} onChange={handleProfileChange} rows={3} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`}></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleUpdateProfile} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Update Profile'}
          </Button>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Change Password</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Current Password</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="newPassword" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Confirm New Password</label>
            <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleChangePassword} disabled={loading || !currentPassword || !newPassword || !confirmNewPassword}>
            {loading ? <LoadingSpinner /> : 'Change Password'}
          </Button>
        </div>
      </Card>

      {/* Payout Details */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Payout Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="payoutMethod" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Payout Method</label>
            <select id="payoutMethod" value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`}>
              <option value={PayoutMethod.BANK}>Bank Transfer</option>
              <option value={PayoutMethod.UPI}>UPI</option>
            </select>
          </div>

          {payoutMethod === PayoutMethod.BANK ? (
            <div className="space-y-3">
              <div>
                <label htmlFor="bankName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Bank Name</label>
                <input type="text" id="bankName" name="bankName" value={bankAccount.bankName} onChange={handlePayoutChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
              </div>
              <div>
                <label htmlFor="accountNumber" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Account Number</label>
                <input type="text" id="accountNumber" name="accountNumber" value={bankAccount.accountNumber} onChange={handlePayoutChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
              </div>
              <div>
                <label htmlFor="ifscCode" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>IFSC Code</label>
                <input type="text" id="ifscCode" name="ifscCode" value={bankAccount.ifscCode} onChange={handlePayoutChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
              </div>
              <div>
                <label htmlFor="bankAccountHolderName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Account Holder Name</label>
                <input type="text" id="bankAccountHolderName" name="accountHolderName" value={bankAccount.accountHolderName} onChange={handlePayoutChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="upiId" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>UPI ID</label>
                <input type="text" id="upiId" name="upiId" value={upiAccount.upiId} onChange={handlePayoutChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
              </div>
              <div>
                <label htmlFor="upiAccountHolderName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Account Holder Name</label>
                <input type="text" id="upiAccountHolderName" name="accountHolderName" value={upiAccount.accountHolderName} onChange={handlePayoutChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleUpdatePayout} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Update Payout Details'}
          </Button>
        </div>
      </Card>

      {/* Toggles */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Quick Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="kitchenToggle" className={`text-base font-medium text-${constants.colors.TEXT_DARK}`}>Kitchen Open/Close</label>
            <input
              type="checkbox"
              id="kitchenToggle"
              checked={isKitchenOpen}
              onChange={handleToggleKitchen}
              className="h-6 w-11 rounded-full bg-gray-300 checked:bg-offoOrange appearance-none cursor-pointer transition-colors relative after:absolute after:inset-y-0 after:left-0 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform after:checked:translate-x-full"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="taxToggle" className={`text-base font-medium text-${constants.colors.TEXT_DARK}`}>Tax (GST) Enabled</label>
            <input
              type="checkbox"
              id="taxToggle"
              checked={isTaxEnabled}
              onChange={handleToggleTax}
              className="h-6 w-11 rounded-full bg-gray-300 checked:bg-offoOrange appearance-none cursor-pointer transition-colors relative after:absolute after:inset-y-0 after:left-0 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform after:checked:translate-x-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};