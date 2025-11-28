import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import { constants } from '../constants.ts';
import { Order, OrderStatus } from '../types.ts';

// Mock Data
const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-101', 
    customerName: 'Alice Johnson', 
    totalAmount: 450, 
    status: OrderStatus.INCOMING, 
    orderTime: '10:45 AM', 
    paymentMethod: 'UPI', 
    items: [
        {id:'1', name:'Veg Burger', quantity:2, price:150}, 
        {id:'2', name:'Coke', quantity:2, price:75}
    ] 
  },
  { 
    id: 'ORD-102', 
    customerName: 'Bob Smith', 
    totalAmount: 850, 
    status: OrderStatus.INCOMING, 
    orderTime: '10:48 AM', 
    paymentMethod: 'Card', 
    items: [
        {id:'3', name:'Chicken Pizza', quantity:1, price:850}
    ] 
  },
  { 
    id: 'ORD-103', 
    customerName: 'Karan Mehra', 
    totalAmount: 240, 
    status: OrderStatus.PREPARING, 
    orderTime: '10:30 AM', 
    paymentMethod: 'Cash', 
    items: [
        {id:'4', name:'Iced Coffee', quantity:2, price:120}
    ] 
  },
  { 
    id: 'ORD-201', 
    customerName: 'Charlie Brown', 
    totalAmount: 1200, 
    status: OrderStatus.SCHEDULED, 
    orderTime: '10:00 AM', 
    scheduledTime: '02:00 PM', 
    paymentMethod: 'UPI', 
    items: [
        {id:'4', name:'Family Meal Pack', quantity:1, price:1200}
    ] 
  },
  { 
    id: 'ORD-202', 
    customerName: 'Sarah Connor', 
    totalAmount: 500, 
    status: OrderStatus.SCHEDULED, 
    orderTime: '09:30 AM', 
    scheduledTime: '04:30 PM', 
    paymentMethod: 'Card', 
    items: [
        {id:'5', name:'Birthday Cake', quantity:1, price:500}
    ] 
  },
  { 
    id: 'ORD-301', 
    customerName: 'David Lee', 
    totalAmount: 200, 
    status: OrderStatus.CANCELLED, 
    orderTime: '09:00 AM', 
    cancellationReason: 'Item Out of Stock', 
    paymentMethod: 'Cash', 
    items: [
        {id:'5', name:'Fries', quantity:2, price:100}
    ] 
  },
  { 
    id: 'ORD-302', 
    customerName: 'Sita Ram', 
    totalAmount: 150, 
    status: OrderStatus.CANCELLED, 
    orderTime: '09:15 AM', 
    cancellationReason: 'Customer Request', 
    paymentMethod: 'UPI', 
    items: [
        {id:'6', name:'Sandwich', quantity:1, price:150}
    ] 
  },
];

type Tab = 'live' | 'scheduled' | 'rejects';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<Tab>('live');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'accept-all' | 'reject-all' | null;
    title: string;
    message: string;
  }>({ isOpen: false, action: null, title: '', message: '' });

  // Filter Logic
  const liveOrders = orders.filter(o => 
    [OrderStatus.INCOMING, OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP].includes(o.status)
  );
  
  const scheduledOrders = orders.filter(o => o.status === OrderStatus.SCHEDULED);
  const rejectedOrders = orders.filter(o => o.status === OrderStatus.CANCELLED);

  const incomingOrders = liveOrders.filter(o => o.status === OrderStatus.INCOMING);

  // Actions
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const requestAcceptAll = () => {
    setConfirmModal({
      isOpen: true,
      action: 'accept-all',
      title: 'Accept All Orders',
      message: `Are you sure you want to accept all ${incomingOrders.length} incoming orders? They will be moved to preparation.`
    });
  };

  const requestRejectAll = () => {
    setConfirmModal({
      isOpen: true,
      action: 'reject-all',
      title: 'Reject All Orders',
      message: `Are you sure you want to reject all ${incomingOrders.length} incoming orders? This action cannot be undone.`
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.action === 'accept-all') {
      setOrders(prev => prev.map(o => 
        o.status === OrderStatus.INCOMING ? { ...o, status: OrderStatus.PREPARING } : o
      ));
    } else if (confirmModal.action === 'reject-all') {
      setOrders(prev => prev.map(o => 
        o.status === OrderStatus.INCOMING ? { ...o, status: OrderStatus.CANCELLED, cancellationReason: 'Bulk Rejection by Admin' } : o
      ));
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.INCOMING: return 'bg-purple-100 text-purple-800 border-purple-200';
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case OrderStatus.PREPARING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.READY_FOR_PICKUP: return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case OrderStatus.SCHEDULED: return 'bg-orange-100 text-orange-800 border-orange-200';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOrderList = (list: Order[], emptyMessage: string, showActions: boolean = true) => {
    if (list.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* Order Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{order.customerName}</div>
              </div>
              <div className="text-right">
                 <div className="text-xs text-gray-400 font-medium">Placed At</div>
                 <div className="text-sm font-medium text-gray-700">{order.orderTime}</div>
                 {order.scheduledTime && (
                   <div className="mt-1">
                     <div className="text-xs text-orange-500 font-medium">Scheduled For</div>
                     <div className="text-sm font-bold text-orange-600">{order.scheduledTime}</div>
                   </div>
                 )}
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 flex-1 overflow-y-auto max-h-60">
              <ul className="space-y-2">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-600">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-800">{item.name}</span>
                    </div>
                    <span className="text-gray-600">₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rejection Reason if cancelled */}
            {order.status === OrderStatus.CANCELLED && order.cancellationReason && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100">
                <p className="text-xs text-red-600"><strong>Reason:</strong> {order.cancellationReason}</p>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Payment: {order.paymentMethod}</span>
                <span className="text-lg font-bold text-gray-900">Total: ₹{order.totalAmount}</span>
              </div>
              
              {showActions && order.status !== OrderStatus.CANCELLED && (
                <div className="grid grid-cols-2 gap-3">
                  {order.status === OrderStatus.INCOMING ? (
                    <>
                      <button 
                        onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                        className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Reject
                      </button>
                      <button 
                         onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        Accept
                      </button>
                    </>
                  ) : order.status === OrderStatus.PREPARING ? (
                    <button 
                         onClick={() => updateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP)}
                         className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Mark Ready for Pickup
                      </button>
                  ) : order.status === OrderStatus.READY_FOR_PICKUP ? (
                    <button 
                         onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                         className="col-span-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                      >
                        Complete Order
                      </button>
                  ) : order.status === OrderStatus.SCHEDULED ? (
                    <button 
                         onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                         className="col-span-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        Start Preparing Now
                      </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Global Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
           <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Order Management</h1>
           <p className="text-gray-500 mt-1">Track and manage live, scheduled and rejected orders.</p>
        </div>
        
        {/* Bulk Actions for Live Incoming Orders */}
        {activeTab === 'live' && incomingOrders.length > 0 && (
           <div className="flex gap-3">
             <Button variant="danger" onClick={requestRejectAll}>
                Reject All ({incomingOrders.length})
             </Button>
             <Button variant="primary" onClick={requestAcceptAll} className="bg-green-600 hover:bg-green-700">
                Accept All ({incomingOrders.length})
             </Button>
           </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('live')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'live'
                ? 'border-offoOrange text-offoOrange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Live Orders
            {liveOrders.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'live' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                    {liveOrders.length}
                </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'scheduled'
                ? 'border-offoOrange text-offoOrange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Scheduled Orders
            {scheduledOrders.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'scheduled' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                    {scheduledOrders.length}
                </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rejects')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'rejects'
                ? 'border-offoOrange text-offoOrange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Order Rejects
            {rejectedOrders.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'rejects' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                    {rejectedOrders.length}
                </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'live' && renderOrderList(liveOrders, 'No active orders at the moment.')}
        {activeTab === 'scheduled' && renderOrderList(scheduledOrders, 'No scheduled orders.')}
        {activeTab === 'rejects' && renderOrderList(rejectedOrders, 'No rejected orders found.', false)}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>Cancel</Button>
            <Button 
              variant={confirmModal.action === 'reject-all' ? 'danger' : 'primary'} 
              onClick={handleConfirmAction}
            >
              Confirm {confirmModal.action === 'reject-all' ? 'Rejection' : 'Acceptance'}
            </Button>
          </>
        }
      >
        <p className="text-gray-600">{confirmModal.message}</p>
      </Modal>
    </div>
  );
};
