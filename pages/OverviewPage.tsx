import React from 'react';
import Card from '../components/common/Card.tsx';
import { constants } from '../constants.ts';
import { Order, OrderStatus } from '../types.ts';

export const OverviewPage: React.FC = () => {
  const stats = [
    { title: 'Today Orders', value: 24, icon: '📦' },
    { title: 'Pending', value: 3, icon: '⏳' },
    { title: 'Preparing', value: 5, icon: '🍳' },
    { title: 'Revenue', value: '₹12,450', icon: '💰' },
  ];

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const recentOrders: Order[] = [
    { 
      id: 'ORD-001', 
      customerName: 'Rahul Kumar', 
      totalAmount: 450, 
      status: OrderStatus.PREPARING, 
      items: [], 
      orderTime: '10:30 AM', 
      paymentMethod: 'UPI',
      date: getTodayDate() 
    },
    { 
      id: 'ORD-002', 
      customerName: 'Priya Sharma', 
      totalAmount: 120, 
      status: OrderStatus.READY_FOR_PICKUP, 
      items: [], 
      orderTime: '10:15 AM', 
      paymentMethod: 'Cash',
      date: getTodayDate() 
    },
    { 
      id: 'ORD-003', 
      customerName: 'Amit Singh', 
      totalAmount: 850, 
      status: OrderStatus.COMPLETED, 
      items: [], 
      orderTime: '09:45 AM', 
      paymentMethod: 'Card',
      date: getTodayDate() 
    },
    { 
      id: 'ORD-004', 
      customerName: 'Sneha Gupta', 
      totalAmount: 200, 
      status: OrderStatus.PENDING, 
      items: [], 
      orderTime: '10:35 AM', 
      paymentMethod: 'UPI',
      date: getTodayDate() 
    },
  ];

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

  // Simulated chart data
  const weeklyData = [40, 65, 45, 80, 55, 90, 70];
  const maxVal = Math.max(...weeklyData);

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK} mb-6`}>Dashboard Overview</h1>
      
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
            <button className={`w-full text-left px-4 py-3 rounded-lg bg-orange-50 text-${constants.colors.PRIMARY} font-medium hover:bg-orange-100 transition-colors`}>
              + Add New Menu Item
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
              Manage Staff Shifts
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
              Update Store Timings
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
              Download Reports
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
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
              {recentOrders.map((order) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};