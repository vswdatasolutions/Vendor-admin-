import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { constants } from '../constants.ts';
import { Order, OrderStatus, SalesDataPoint } from '../types.ts';

export const OverviewPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('day');

  // Dummy data for statistics
  const stats = [
    { title: 'Today Orders', value: 12, icon: '📦' },
    { title: 'Pending Orders', value: 3, icon: '⏳' },
    { title: 'Preparing Orders', value: 5, icon: '🍳' },
    { title: 'Pickup Ready', value: 4, icon: '✅' },
    { title: 'Scheduled Orders', value: 7, icon: '📅' },
    { title: 'Category Count', value: 10, icon: '🏷️' },
    { title: 'Item Count', value: 85, icon: '🍔' },
  ];

  const liveOrders: Order[] = [
    { id: 'UR3347', customerName: 'Priya Sharma', totalAmount: 199.00, status: OrderStatus.INCOMING, items: [{id:'chickentikka', name: 'Chicken Tikka Fry', quantity: 1, price: 199.00}], orderTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), paymentMethod: 'Card' }, // 5 mins ago
    { id: 'UR3348', customerName: 'Rajesh M', totalAmount: 20.00, status: OrderStatus.INCOMING, items: [{id:'coffee', name: 'Coffee', quantity: 1, price: 20.00}], orderTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), paymentMethod: 'Cash' }, // 10 mins ago
    { id: 'UR3349', customerName: 'Primya Sharma', totalAmount: 199.00, status: OrderStatus.PREPARING, items: [{id:'chickentikka2', name: 'Chicken Tikka Fry', quantity: 1, price: 199.00}], orderTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), paymentMethod: 'UPI' }, // 15 mins ago
  ];

  // Dummy data for sales summary
  const dailySales: SalesDataPoint[] = [
    { date: '2024-07-26', sales: 300 },
    { date: '2024-07-27', sales: 450 },
    { date: '2024-07-28', sales: 600 },
    { date: '2024-07-29', sales: 520 },
    { date: '2024-07-30', sales: 710 },
    { date: '2024-07-31', sales: 680 },
    { date: '2024-08-01', sales: 800 },
  ];

  const weeklySales: SalesDataPoint[] = [
    { date: 'Week 1', sales: 2500 },
    { date: 'Week 2', sales: 3200 },
    { date: 'Week 3', sales: 2800 },
    { date: 'Week 4', sales: 3500 },
  ];

  const monthlySales: SalesDataPoint[] = [
    { date: 'Jan', sales: 10000 },
    { date: 'Feb', sales: 12000 },
    { date: 'Mar', sales: 11500 },
    { date: 'Apr', sales: 13000 },
    { date: 'May', sales: 14500 },
    { date: 'Jun', sales: 13800 },
    { date: 'Jul', sales: 15200 },
    { date: 'Aug', sales: 16000 },
  ];

  const getCurrentChartData = () => {
    switch (selectedTimeRange) {
      case 'day':
        return dailySales;
      case 'week':
        return weeklySales;
      case 'month':
        return monthlySales;
      default:
        return [];
    }
  };

  const chartData = getCurrentChartData();

  const getTimeDifference = (orderTime: string) => {
    const now = new Date();
    const orderDate = new Date(orderTime);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes === 0) return 'Just now';
    if (diffMinutes === 1) return '1 min ago';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  }

  const getStatusBadgeClasses = (status: OrderStatus) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case OrderStatus.INCOMING:
        return `${base} bg-offoOrange text-white`; // Solid orange for incoming
      case OrderStatus.PENDING:
        return `${base} bg-red-500 text-white`; // Red as per image
      case OrderStatus.PREPARING:
        return `${base} bg-blue-500 text-white`;
      case OrderStatus.READY_FOR_PICKUP:
        return `${base} bg-green-500 text-white`;
      case OrderStatus.SCHEDULED:
        return `${base} bg-purple-500 text-white`;
      case OrderStatus.COMPLETED:
        return `${base} bg-green-700 text-white`;
      case OrderStatus.CANCELLED:
        return `${base} bg-red-700 text-white`;
      default:
        return `${base} bg-gray-500 text-white`;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK} mb-6`}>Overview</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`flex flex-col items-center justify-center p-6 text-center bg-${constants.colors.BG_STAT_DARK}`}>
            <div className="text-4xl mb-2" role="img" aria-label={stat.title}>
              {stat.icon}
            </div>
            <h3 className={`text-lg font-semibold text-${constants.colors.TEXT_LIGHT}`}>{stat.title}</h3>
            <p className={`text-4xl font-bold text-${constants.colors.TEXT_LIGHT} mt-2`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Summary Chart Placeholder */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK}`}>Sales Summary</h2>
            <div className="flex space-x-2">
              <Button
                variant={selectedTimeRange === 'day' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('day')}
              >
                Day
              </Button>
              <Button
                variant={selectedTimeRange === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('week')}
              >
                Week
              </Button>
              <Button
                variant={selectedTimeRange === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('month')}
              >
                Month
              </Button>
            </div>
          </div>
          <div className={`bg-gray-100 border border-gray-200 rounded-lg h-64 flex flex-col justify-center items-center text-${constants.colors.TEXT_DARK} p-4 relative`}>
            <p className="mb-2 text-lg font-medium">Sales Trend ({selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)})</p>
            {chartData.length > 0 ? (
              <div className="w-full h-full flex items-end justify-around space-x-2 px-2 pb-2">
                {chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center group relative h-full justify-end">
                    <div
                      style={{ height: `${(data.sales / Math.max(...chartData.map(d => d.sales))) * 80 + 10}%` }} // Scale bars relative to max sales, min 10% for visibility
                      className={`w-6 sm:w-8 md:w-10 bg-offoOrange rounded-t-md transition-all duration-300 hover:bg-offoOrange-dark relative cursor-pointer`}
                    >
                      <span className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-${constants.colors.ACCENT_GRAY} font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-gray-700 py-1 px-2 rounded shadow-sm z-10`}>
                        ₹{data.sales.toLocaleString()}
                      </span>
                    </div>
                    <span className={`mt-1 text-xs text-${constants.colors.ACCENT_GRAY} font-medium`}>{data.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No sales data available for this period.</p>
            )}
            <p className={`mt-4 text-sm text-${constants.colors.ACCENT_GRAY}`}>This is an interactive chart placeholder. Total Sales: <span className={`font-semibold text-${constants.colors.TEXT_DARK}`}>₹{chartData.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}</span></p>
          </div>
        </Card>

        {/* Live Order Notifications */}
        <Card className="p-6">
          <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-4`}>Live Order Notifications</h2>
          <div className="space-y-4">
            {liveOrders.length > 0 ? (
              liveOrders.filter(order => order.status === OrderStatus.INCOMING || order.status === OrderStatus.PREPARING).map((order) => (
                <div key={order.id} className="flex justify-between items-center bg-offoOrange bg-opacity-10 text-offoOrange p-3 rounded-lg border-l-4 border-offoOrange animate-pulse-once">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-semibold text-base text-${constants.colors.TEXT_DARK}`}>Order #{order.id}</p>
                      <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                    </div>
                    <p className="text-sm text-offoSlate">{order.customerName} - <span className="font-semibold text-offoOrange">₹{order.totalAmount.toFixed(2)}</span></p>
                  </div>
                  <span className={`text-xs text-${constants.colors.ACCENT_GRAY}`}>{getTimeDifference(order.orderTime)}</span>
                </div>
              ))
            ) : (
              <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No live orders at the moment.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};