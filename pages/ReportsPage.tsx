
import React, { useState, useMemo } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { constants } from '../constants.ts';
import { useBranch } from '../context/BranchContext.tsx';

export const ReportsPage: React.FC = () => {
  const { currentBranch, currentBranchId } = useBranch();
  const [dateRange, setDateRange] = useState('This Month');

  // Simulate different data based on branch ID to show interactivity
  const reportData = useMemo(() => {
    const seed = currentBranchId.charCodeAt(0) || 0;
    
    // Generate deterministic random-ish numbers based on branch ID
    const revenue = 400000 + (seed * 1000);
    const orders = 1000 + (seed * 5);
    const avgOrder = Math.floor(revenue / orders);
    
    // Unique top items per branch simulation
    const items = [
        { name: 'Chicken Burger', qty: 145 + seed, rev: (145 + seed) * 150 },
        { name: 'Veg Pizza', qty: 120 + seed, rev: (120 + seed) * 250 },
        { name: 'Iced Coffee', qty: 300 - seed, rev: (300 - seed) * 120 },
        { name: 'Cheese Fries', qty: 210, rev: 210 * 100 },
    ];

    // Sort by revenue for "Top Selling"
    items.sort((a,b) => b.rev - a.rev);

    return { revenue, orders, avgOrder, items };
  }, [currentBranchId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Business Reports</h1>
            <p className="text-gray-500 mt-1">Showing data for: <span className="font-semibold text-offoOrange">{currentBranch?.name}</span></p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" size="sm" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>}>CSV</Button>
             <Button variant="outline" size="sm" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>}>PDF</Button>
        </div>
      </div>

      <div className="flex bg-white rounded-lg shadow-sm border p-1 w-max">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">₹{reportData.revenue.toLocaleString()}</h2>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↑</span> 12.5% vs last period
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm font-medium">Total Orders</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{reportData.orders.toLocaleString()}</h2>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↑</span> 8.2% vs last period
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">₹{reportData.avgOrder}</h2>
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↓</span> 2.1% vs last period
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend ({currentBranch?.name})</h3>
            <div className="h-64 flex items-end justify-between gap-2">
                 {[45, 60, 50, 80, 75, 95, 85].map((val, idx) => (
                    <div key={idx} className="w-full bg-blue-50 rounded-t-lg relative group">
                        <div 
                            className="bg-blue-500 rounded-t-lg absolute bottom-0 w-full transition-all duration-500 group-hover:bg-blue-600"
                            style={{height: `${val + (currentBranchId === '1' ? 0 : -10)}%`}}
                        ></div>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                             {['M','T','W','T','F','S','S'][idx]}
                        </span>
                    </div>
                 ))}
            </div>
        </Card>

        {/* Orders Count Chart */}
         <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Orders Volume</h3>
            <div className="h-64 flex items-end justify-between gap-2">
                 {[30, 45, 35, 60, 50, 70, 65].map((val, idx) => (
                    <div key={idx} className="w-full bg-orange-50 rounded-t-lg relative group">
                        <div 
                            className="bg-offoOrange rounded-t-lg absolute bottom-0 w-full transition-all duration-500 group-hover:bg-offoOrange-dark"
                            style={{height: `${val}%`}}
                        ></div>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                             {['M','T','W','T','F','S','S'][idx]}
                        </span>
                    </div>
                 ))}
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {reportData.items.map((item, idx) => (
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
