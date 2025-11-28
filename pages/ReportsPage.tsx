import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { constants } from '../constants.ts';
import { SalesDataPoint, CategorySalesData, MostSellingItem } from '../types.ts';

export const ReportsPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedGraphType, setSelectedGraphType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // Today's date for daily filter

  // Dummy Data for Reports
  const dummySalesData: SalesDataPoint[] = [
    { date: '2024-07-28', sales: 1200 },
    { date: '2024-07-27', sales: 950 },
    { date: '2024-07-26', sales: 1500 },
    { date: '2024-07-25', sales: 1100 },
  ];

  const dummyCategorySales: CategorySalesData[] = [
    { category: 'Appetizers', sales: 3000 },
    { category: 'Main Courses', sales: 8000 },
    { category: 'Desserts', sales: 2500 },
    { category: 'Beverages', sales: 1500 },
  ];

  const dummyMostSellingItems: MostSellingItem[] = [
    { id: 'item1', name: 'Chicken Tikka Masala', salesCount: 50, revenue: 12500 },
    { id: 'item2', name: 'Veggie Burger', salesCount: 45, revenue: 6750 },
    { id: 'item3', name: 'Cold Coffee', salesCount: 70, revenue: 6300 },
    { id: 'item4', name: 'Paneer Butter Masala', salesCount: 30, revenue: 7500 },
  ];

  const getSalesData = () => {
    switch (selectedReportType) {
      case 'daily': return dummySalesData;
      case 'weekly': return dummySalesData.map((d, i) => ({ ...d, date: `Week ${i + 1}` }));
      case 'monthly': return dummySalesData.map((d, i) => ({ ...d, date: `Month ${i + 1}` }));
      default: return [];
    }
  };

  const currentSalesData = getSalesData();

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Exporting ${selectedReportType} sales report as ${format.toUpperCase()}... (Placeholder)`);
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK} mb-6`}>Reports</h1>

      {/* Report Type Selection */}
      <Card className="p-4">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-3`}>Select Report Type</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant={selectedReportType === 'daily' ? 'primary' : 'outline'}
            onClick={() => setSelectedReportType('daily')}
            size="sm"
          >
            Daily Sales
          </Button>
          <Button
            variant={selectedReportType === 'weekly' ? 'primary' : 'outline'}
            onClick={() => setSelectedReportType('weekly')}
            size="sm"
          >
            Weekly Sales
          </Button>
          <Button
            variant={selectedReportType === 'monthly' ? 'primary' : 'outline'}
            onClick={() => setSelectedReportType('monthly')}
            size="sm"
          >
            Monthly Sales
          </Button>
        </div>
        {selectedReportType === 'daily' && (
          <div>
            <label htmlFor="reportDate" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-1`}>Select Date</label>
            <input
              type="date"
              id="reportDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-${constants.colors.TEXT_DARK}`}
            />
          </div>
        )}
      </Card>

      {/* Sales Data and Graph */}
      <Card className="p-4">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-3`}>Sales Trend</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant={selectedGraphType === 'bar' ? 'primary' : 'outline'}
            onClick={() => setSelectedGraphType('bar')}
            size="sm"
          >
            Bar Chart
          </Button>
          <Button
            variant={selectedGraphType === 'line' ? 'primary' : 'outline'}
            onClick={() => setSelectedGraphType('line')}
            size="sm"
          >
            Line Chart
          </Button>
          <Button
            variant={selectedGraphType === 'pie' ? 'primary' : 'outline'}
            onClick={() => setSelectedGraphType('pie')}
            size="sm"
          >
            Doughnut Chart
          </Button>
        </div>
        <div className={`bg-gray-100 border border-gray-200 rounded-lg h-64 flex items-center justify-center text-${constants.colors.ACCENT_GRAY}`}>
          {/* Placeholder for actual chart library (e.g., Chart.js, Recharts) */}
          <p className="text-center">
            {selectedGraphType.charAt(0).toUpperCase() + selectedGraphType.slice(1)} Chart Placeholder for {selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Sales
          </p>
        </div>
      </Card>

      {/* Category-wise Sales */}
      <Card className="p-4">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-3`}>Category-wise Sales</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-${constants.colors.ACCENT_GRAY} uppercase tracking-wider`}>Category</th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-${constants.colors.ACCENT_GRAY} uppercase tracking-wider`}>Sales</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dummyCategorySales.map((data, index) => (
                <tr key={index}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-${constants.colors.TEXT_DARK}`}>{data.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${constants.colors.ACCENT_GRAY}`}>₹{data.sales.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Most Selling Items */}
      <Card className="p-4">
        <h2 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK} mb-3`}>Most Selling Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-${constants.colors.ACCENT_GRAY} uppercase tracking-wider`}>Item</th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-${constants.colors.ACCENT_GRAY} uppercase tracking-wider`}>Sales Count</th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-${constants.colors.ACCENT_GRAY} uppercase tracking-wider`}>Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dummyMostSellingItems.map((item) => (
                <tr key={item.id}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-${constants.colors.TEXT_DARK}`}>{item.name}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${constants.colors.ACCENT_GRAY}`}>{item.salesCount}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${constants.colors.ACCENT_GRAY}`}>₹{item.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-4 flex justify-end gap-3">
        <Button variant="outline" onClick={() => handleExport('pdf')}>
          Export to PDF
        </Button>
        <Button variant="outline" onClick={() => handleExport('excel')}>
          Export to Excel
        </Button>
      </Card>
    </div>
  );
};