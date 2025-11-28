import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import { constants } from '../constants.ts';
import { VendorInfo } from '../types.ts';

export const BrandingPage: React.FC = () => {
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    logoPreviewUrl: 'https://via.placeholder.com/150/FF7A00/FFFFFF?text=Logo',
    bannerPreviewUrl: 'https://via.placeholder.com/800x200/FF7A00/FFFFFF?text=Banner',
    themeColorPrimary: '#FF7A00',
    themeColorSecondary: '#0D1B2A',
    cafeName: 'Healthy Bites Catering',
    address: '123 Food Street, Tech Park, City',
    phone: '+91 98765 43210',
    about: 'Serving fresh and healthy meals with a smile!',
    timings: [
      { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
      { day: 'Saturday', isOpen: false, openTime: '00:00', closeTime: '00:00' },
      { day: 'Sunday', isOpen: false, openTime: '00:00', closeTime: '00:00' },
    ],
    socialLinks: {
      facebook: 'https://facebook.com/healthybites',
      instagram: 'https://instagram.com/healthybites',
      twitter: '',
      website: 'https://healthybites.com',
    },
  });

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setVendorInfo(prev => ({ ...prev, [`${type}PreviewUrl`]: reader.result as string }));
        if (type === 'logo') setLogoFile(file);
        if (type === 'banner') setBannerFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVendorInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleTimingChange = (index: number, field: string, value: string | boolean) => {
    const newTimings = [...vendorInfo.timings];
    if (field === 'isOpen' && typeof value === 'boolean') {
      newTimings[index].isOpen = value;
      // If closed, reset times to default or empty
      if (!value) {
        newTimings[index].openTime = '00:00';
        newTimings[index].closeTime = '00:00';
      }
    } else if (typeof value === 'string') {
      if (field === 'openTime') newTimings[index].openTime = value;
      if (field === 'closeTime') newTimings[index].closeTime = value;
    }
    setVendorInfo(prev => ({ ...prev, timings: newTimings }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>, platform: string) => {
    const { value } = e.target;
    setVendorInfo(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (section: string) => {
    setLoading(true);
    // Simulate API call to update specific section
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`${section} information updated! (Simulated)`);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK} mb-6`}>Vendor Branding</h1>

      {/* Cafe Logo & Banner */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Cafe Logo & Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="logo-upload" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Upload Logo</label>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'logo')}
              className={`block w-full text-sm text-${constants.colors.TEXT_DARK} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-offoOrange file:text-white hover:file:bg-offoOrange-dark`}
            />
            {vendorInfo.logoPreviewUrl && (
              <div className="mt-4 text-center">
                <img src={vendorInfo.logoPreviewUrl} alt="Logo Preview" className="mx-auto h-32 w-32 object-contain rounded-full border border-gray-200 p-1" />
                <p className={`text-sm text-${constants.colors.ACCENT_GRAY} mt-2`}>Logo Preview</p>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="banner-upload" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Upload Banner</label>
            <input
              type="file"
              id="banner-upload"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'banner')}
              className={`block w-full text-sm text-${constants.colors.TEXT_DARK} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-offoOrange file:text-white hover:file:bg-offoOrange-dark`}
            />
            {vendorInfo.bannerPreviewUrl && (
              <div className="mt-4 text-center">
                <img src={vendorInfo.bannerPreviewUrl} alt="Banner Preview" className="mx-auto w-full max-h-40 object-cover rounded-lg border border-gray-200 p-1" />
                <p className={`text-sm text-${constants.colors.ACCENT_GRAY} mt-2`}>Banner Preview</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={() => handleSubmit('Logo & Banner')} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Update Images'}
          </Button>
        </div>
      </Card>

      {/* Theme Colors */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Theme Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primary-color" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Primary Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="primary-color"
                name="themeColorPrimary"
                value={vendorInfo.themeColorPrimary}
                onChange={handleThemeColorChange}
                className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={vendorInfo.themeColorPrimary}
                onChange={handleThemeColorChange}
                name="themeColorPrimary"
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="secondary-color" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Secondary Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="secondary-color"
                name="themeColorSecondary"
                value={vendorInfo.themeColorSecondary}
                onChange={handleThemeColorChange}
                className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={vendorInfo.themeColorSecondary}
                onChange={handleThemeColorChange}
                name="themeColorSecondary"
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={() => handleSubmit('Theme Colors')} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Update Colors'}
          </Button>
        </div>
      </Card>

      {/* Cafe Information */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Cafe Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="cafe-name" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Cafe Name</label>
            <input type="text" id="cafe-name" name="cafeName" value={vendorInfo.cafeName} onChange={handleInfoChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="address" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Address</label>
            <input type="text" id="address" name="address" value={vendorInfo.address} onChange={handleInfoChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="phone" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Phone</label>
            <input type="tel" id="phone" name="phone" value={vendorInfo.phone} onChange={handleInfoChange} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} />
          </div>
          <div>
            <label htmlFor="about" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>About Cafe</label>
            <textarea id="about" name="about" value={vendorInfo.about} onChange={handleInfoChange} rows={3} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`}></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={() => handleSubmit('Cafe Info')} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Update Info'}
          </Button>
        </div>
      </Card>

      {/* Operating Timings */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Operating Timings</h2>
        <div className="space-y-4">
          {vendorInfo.timings.map((dayTiming, index) => (
            <div key={dayTiming.day} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center mb-2 sm:mb-0">
                <input
                  type="checkbox"
                  id={`day-toggle-${dayTiming.day}`}
                  checked={dayTiming.isOpen}
                  onChange={(e) => handleTimingChange(index, 'isOpen', e.target.checked)}
                  className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                />
                <label htmlFor={`day-toggle-${dayTiming.day}`} className={`ml-2 text-sm font-medium text-${constants.colors.TEXT_DARK}`}>{dayTiming.day}</label>
              </div>
              {dayTiming.isOpen ? (
                <div className="flex items-center space-x-3 mt-1 sm:mt-0">
                  <input
                    type="time"
                    value={dayTiming.openTime}
                    onChange={(e) => handleTimingChange(index, 'openTime', e.target.value)}
                    className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK} sm:w-auto w-full`}
                  />
                  <span className={`text-${constants.colors.TEXT_DARK}`}>-</span>
                  <input
                    type="time"
                    value={dayTiming.closeTime}
                    onChange={(e) => handleTimingChange(index, 'closeTime', e.target.value)}
                    className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK} sm:w-auto w-full`}
                  />
                </div>
              ) : (
                <span className={`text-sm text-${constants.colors.ACCENT_GRAY} italic mt-1 sm:mt-0`}>Closed</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={() => handleSubmit('Operating Timings')} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Update Timings'}
          </Button>
        </div>
      </Card>

      {/* Social Media Links */}
      <Card className="p-6">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Social Media Links</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="social-facebook" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Facebook URL</label>
            <input type="url" id="social-facebook" value={vendorInfo.socialLinks.facebook || ''} onChange={(e) => handleSocialLinkChange(e, 'facebook')} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} placeholder="https://facebook.com/yourpage" />
          </div>
          <div>
            <label htmlFor="social-instagram" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Instagram URL</label>
            <input type="url" id="social-instagram" value={vendorInfo.socialLinks.instagram || ''} onChange={(e) => handleSocialLinkChange(e, 'instagram')} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} placeholder="https://instagram.com/yourpage" />
          </div>
          <div>
            <label htmlFor="social-twitter" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Twitter URL</label>
            <input type="url" id="social-twitter" value={vendorInfo.socialLinks.twitter || ''} onChange={(e) => handleSocialLinkChange(e, 'twitter')} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} placeholder="https://twitter.com/yourpage" />
          </div>
          <div>
            <label htmlFor="social-website" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Website URL</label>
            <input type="url" id="social-website" value={vendorInfo.socialLinks.website || ''} onChange={(e) => handleSocialLinkChange(e, 'website')} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`} placeholder="https://yourwebsite.com" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={() => handleSubmit('Social Links')} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Update Social Links'}
          </Button>
        </div>
      </Card>
    </div>
  );
};