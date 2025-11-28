import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { constants } from '../constants.ts';

export const BrandingPage: React.FC = () => {
  const [branding, setBranding] = useState({
    cafeName: 'Healthy Bites Catering',
    description: 'Fresh, healthy, and delicious meals delivered to you.',
    primaryColor: '#FF7A00',
    headerImage: '', // Would be a file URL in real app
    logo: ''
  });

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranding({...branding, primaryColor: e.target.value});
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Store Branding</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Editor Side */}
        <div className="flex-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cafe Name</label>
                <input 
                  type="text" 
                  value={branding.cafeName} 
                  onChange={(e) => setBranding({...branding, cafeName: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-offoOrange focus:ring-offoOrange border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">About / Description</label>
                <textarea 
                  value={branding.description} 
                  onChange={(e) => setBranding({...branding, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-offoOrange focus:ring-offoOrange border p-2"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Theme & Assets</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Brand Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={branding.primaryColor} 
                    onChange={handleColorChange}
                    className="h-10 w-20 p-1 border rounded cursor-pointer"
                  />
                  <span className="text-gray-500 uppercase">{branding.primaryColor}</span>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                 <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> logo</p>
                        </div>
                        <input type="file" className="hidden" />
                    </label>
                </div> 
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button size="lg">Save Branding</Button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="w-full lg:w-96 flex-shrink-0 flex justify-center">
           <div className="w-[320px] h-[650px] border-8 border-gray-800 rounded-[3rem] overflow-hidden bg-gray-50 relative shadow-2xl">
             {/* Notch */}
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
             
             {/* Simulated App Header */}
             <div className="h-40 relative flex flex-col justify-end p-4 text-white z-10" style={{ backgroundColor: branding.primaryColor }}>
               <h3 className="font-bold text-xl">{branding.cafeName}</h3>
               <p className="text-xs opacity-90 truncate">{branding.description}</p>
             </div>
             
             {/* Simulated App Content */}
             <div className="p-4 space-y-4 overflow-hidden">
                <div className="flex gap-2 overflow-x-hidden">
                   <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                   <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                   <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                </div>
                
                <div className="space-y-3">
                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                   <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2">
                      <div className="w-20 h-full bg-gray-100 rounded-lg"></div>
                      <div className="flex-1 py-2">
                         <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                         <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                   </div>
                   <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2">
                      <div className="w-20 h-full bg-gray-100 rounded-lg"></div>
                      <div className="flex-1 py-2">
                         <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                         <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Simulated App Tab Bar */}
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center px-4">
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{backgroundColor: branding.primaryColor}}>+</div>
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};