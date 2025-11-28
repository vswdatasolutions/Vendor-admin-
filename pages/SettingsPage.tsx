import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { constants } from '../constants.ts';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [storeOpen, setStoreOpen] = useState(true);

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'payouts', label: 'Payouts & Banking' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-offoOrange text-offoOrange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <Card className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Store Status</h3>
                <p className="text-sm text-gray-500">Temporarily close your store from receiving orders.</p>
              </div>
              <button 
                onClick={() => setStoreOpen(!storeOpen)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offoOrange ${storeOpen ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${storeOpen ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Printing Preferences</h3>
              <div className="flex items-center">
                 <input type="checkbox" id="autoPrint" className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded" />
                 <label htmlFor="autoPrint" className="ml-2 block text-sm text-gray-900">Automatically print KOT on new order</label>
              </div>
              <div className="flex items-center">
                 <input type="checkbox" id="printBill" className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded" />
                 <label htmlFor="printBill" className="ml-2 block text-sm text-gray-900">Print 2 copies of bill</label>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'payouts' && (
           <Card className="p-6 max-w-2xl">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Account Details</h3>
             <form className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                  <input type="text" className="mt-1 block w-full rounded-md border border-gray-300 p-2" defaultValue="Healthy Bites Pvt Ltd" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input type="text" className="mt-1 block w-full rounded-md border border-gray-300 p-2" defaultValue="HDFC Bank" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <input type="password" value="XXXXXXXXXX1234" className="mt-1 block w-full rounded-md border border-gray-300 p-2" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                    <input type="text" className="mt-1 block w-full rounded-md border border-gray-300 p-2" defaultValue="HDFC0001234" />
                  </div>
               </div>
               <div className="pt-4">
                 <Button>Update Bank Details</Button>
               </div>
             </form>
           </Card>
        )}

        {activeTab === 'notifications' && (
           <Card className="p-6 max-w-2xl">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
             <div className="space-y-4">
               {['New Order Alert', 'Order Cancelled', 'Daily Report Email', 'Staff Login Alert'].map((setting, i) => (
                 <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{setting}</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id={`toggle-${i}`} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-offoOrange"/>
                        <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer checked:bg-offoOrange"></label>
                    </div>
                 </div>
               ))}
             </div>
           </Card>
        )}
      </div>
    </div>
  );
};