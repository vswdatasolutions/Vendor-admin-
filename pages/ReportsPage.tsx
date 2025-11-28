import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { constants } from '../constants.ts';

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('This Month');

  const topItems = [
    { name: 'Chicken Burger', qty: 145, rev: 28000 },
    { name: 'Veg Pizza', qty: 120, rev: 36000 },
    { name: 'Iced Coffee', qty: 300, rev: 15000 },
    { name: 'Cheese Fries', qty: 210, rev: 18900 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Business Reports</h1>
        <div className="flex bg-white rounded-lg shadow-sm border p-1">
          {['Today', 'This Week', 'This Month'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 text-sm rounded-md transition-all ${dateRange === range ? 'bg-offoOrange text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">₹4,25,000</h2>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↑</span> 12.5% vs last period
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm font-medium">Total Orders</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">1,240</h2>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↑</span> 8.2% vs last period
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">₹342</h2>
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↓</span> 2.1% vs last period
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {topItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-offoOrange/10 text-offoOrange flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">₹{item.rev.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{item.qty} units</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Sales by Payment Method</h3>
          <div className="flex flex-col h-64 justify-center space-y-4">
             {/* Mock horizontal bar chart */}
             {[
               { label: 'UPI', val: 75, color: 'bg-green-500' },
               { label: 'Credit/Debit Card', val: 15, color: 'bg-blue-500' },
               { label: 'Cash', val: 10, color: 'bg-yellow-500' }
             ].map(method => (
               <div key={method.label} className="w-full">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-600">{method.label}</span>
                   <span className="font-bold">{method.val}%</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                   <div className={`${method.color} h-2.5 rounded-full`} style={{ width: `${method.val}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </Card>
      </div>
    </div>
  );
};