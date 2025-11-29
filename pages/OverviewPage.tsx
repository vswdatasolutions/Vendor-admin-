
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card.tsx';
import { constants } from '../constants.ts';
import { Order, OrderStatus } from '../types.ts';
import { useBranch } from '../context/BranchContext.tsx';

export const OverviewPage: React.FC = () => {
  const { currentBranchId, currentBranch } = useBranch();
  const navigate = useNavigate();
  
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Mock data with branchId
  const allRecentOrders: Order[] = [
    { 
      id: 'ORD-001', branchId: '1', customerName: 'Rahul Kumar', totalAmount: 450, status: OrderStatus.PREPARING, items: [], orderTime: '10:30 AM', paymentMethod: 'UPI', date: getTodayDate() 
    },
    { 
      id: 'ORD-002', branchId: '2', customerName: 'Priya Sharma', totalAmount: 120, status: OrderStatus.READY_FOR_PICKUP, items: [], orderTime: '10:15 AM', paymentMethod: 'Cash', date: getTodayDate() 
    },
    { 
      id: 'ORD-003', branchId: '1', customerName: 'Amit Singh', totalAmount: 850, status: OrderStatus.COMPLETED, items: [], orderTime: '09:45 AM', paymentMethod: 'Card', date: getTodayDate() 
    },
    { 
      id: 'ORD-004', branchId: '3', customerName: 'Sneha Gupta', totalAmount: 200, status: OrderStatus.PENDING, items: [], orderTime: '10:35 AM', paymentMethod: 'UPI', date: getTodayDate() 
    },
    { 
      id: 'ORD-005', branchId: '1', customerName: 'John Doe', totalAmount: 1200, status: OrderStatus.INCOMING, items: [], orderTime: '11:00 AM', paymentMethod: 'Card', date: getTodayDate() 
    },
  ];

  // Filter orders by branch
  const recentOrders = useMemo(() => 
    allRecentOrders.filter(o => o.branchId === currentBranchId), 
  [currentBranchId]);

  // Calculate dynamic stats based on filtered orders
  const stats = useMemo(() => {
     // Mock stats logic
     const count = recentOrders.length;
     const revenue = recentOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
     const active = recentOrders.filter(o => o.status === OrderStatus.INCOMING || o.status === OrderStatus.PREPARING || o.status === OrderStatus.PENDING).length;
     const preparing = recentOrders.filter(o => o.status === OrderStatus.PREPARING).length;

     // Base values + dynamic modification to look like a real dashboard
     const baseToday = currentBranchId === '1' ? 24 : currentBranchId === '2' ? 18 : 12;
     
     return [
        { title: 'Today Orders', value: baseToday + count, icon: '📦' },
        { title: 'Active Orders', value: active + (currentBranchId === '1' ? 5 : 2), icon: '🔥' },
        { title: 'Preparing', value: preparing + (currentBranchId === '1' ? 3 : 1), icon: '🍳' },
        { title: 'Revenue', value: `₹${(revenue + (currentBranchId === '1' ? 12000 : 5000)).toLocaleString()}`, icon: '💰' },
     ];
  }, [recentOrders, currentBranchId]);

  const getStatusBadgeClasses = (status: OrderStatus) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case OrderStatus.INCOMING: return `${base} bg-purple-100 text-purple-800`;
      case OrderStatus.PENDING: return `${base} bg-yellow-100 text-yellow-800`;
      case OrderStatus.PREPARING: return `${base} bg-blue-100 text-blue-800`;
      case OrderStatus.READY_FOR_PICKUP: return `${base} bg-green-100 text-green-800`;
      case OrderStatus.COMPLETED: return `${base} bg-gray-100 text-gray-800`;
      default: return `${base} bg-gray-100 text-gray-800`;
    }
  };

  // Simulated chart data depending on branch
  const weeklyData = currentBranchId === '1' 
    ? [40, 65, 45, 80, 55, 90, 70] 
    : currentBranchId === '2' 
        ? [30, 40, 35, 50, 45, 60, 50] 
        : [15, 20, 25, 18, 30, 35, 28];
  
  const maxVal = Math.max(...weeklyData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
         <div>
             <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Dashboard</h1>
             <p className="text-gray-500 mt-1">Overview for <span className="font-semibold text-offoOrange">{currentBranch?.name}</span></p>
         </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`flex items-center p-6 bg-white border-l-4 border-${constants.colors.PRIMARY}`}>
            <div className={`p-3 rounded-full bg-orange-100 text-${constants.colors.PRIMARY} mr-4 text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Simulation */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Weekly Sales Trend</h3>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-offoOrange focus:border-offoOrange block p-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {weeklyData.map((val, idx) => (
              <div key={idx} className="w-full flex flex-col items-center group">
                <div 
                  className={`w-full bg-${constants.colors.PRIMARY} rounded-t-sm transition-all duration-300 hover:opacity-80 relative`}
                  style={{ height: `${(val / maxVal) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val} orders
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Center */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
                onClick={() => navigate(constants.routes.MENU)}
                className={`w-full text-left px-4 py-3 rounded-lg bg-orange-50 text-${constants.colors.PRIMARY} font-medium hover:bg-orange-100 transition-colors flex items-center gap-3`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add New Menu Item
            </button>
            <button 
                onClick={() => navigate(constants.routes.STAFF)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2h2m0 0l4-4m-4 4l-4-4m4 4v-4m-6 4h16"></path></svg>
              Manage Staff Shifts
            </button>
            <button 
                onClick={() => navigate(constants.routes.SETTINGS)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Update Store Timings
            </button>
            <button 
                onClick={() => navigate(constants.routes.REPORTS)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Download Reports
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders ({currentBranch?.name})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderTime}</td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No recent orders found for this branch.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
