import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import { constants } from '../constants.ts';
import { Order, OrderStatus, OrderItem } from '../types.ts';

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
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'accept-all' | 'reject-all' | null;
    title: string;
    message: string;
  }>({ isOpen: false, action: null, title: '', message: '' });

  // Simulate Real-time Updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simulate receiving a new order every 12 seconds
      const randomNum = Math.floor(Math.random() * 10000);
      const customerNames = ['Vikram Singh', 'Anjali Rao', 'Rohan Das', 'Sara Ali', 'Arjun Kapoor', 'Meera Reddy'];
      const menuItems = [
        { name: 'Masala Dosa', price: 120 },
        { name: 'Paneer Wrap', price: 180 },
        { name: 'Cold Coffee', price: 140 },
        { name: 'Veg Sandwich', price: 90 },
        { name: 'Chicken Biryani', price: 250 }
      ];
      const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      
      const newOrder: Order = {
        id: `ORD-${randomNum}`,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        totalAmount: randomItem.price,
        status: OrderStatus.INCOMING,
        orderTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        paymentMethod: Math.random() > 0.5 ? 'UPI' : 'Card',
        items: [
          {
            id: `ITEM-${randomNum}`,
            name: randomItem.name,
            quantity: 1,
            price: randomItem.price
          }
        ]
      };

      setOrders(currentOrders => {
        // Prevent list from growing indefinitely in demo
        if (currentOrders.length > 50) return currentOrders;
        // Add new order to the top
        return [newOrder, ...currentOrders];
      });

    }, 12000); // 12 seconds interval

    return () => clearInterval(intervalId);
  }, []);

  // Filter Logic
  const liveOrders = orders.filter(o => 
    [OrderStatus.INCOMING, OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP].includes(o.status)
  );
  
  const scheduledOrders = orders.filter(o => o.status === OrderStatus.SCHEDULED);
  const rejectedOrders = orders.filter(o => o.status === OrderStatus.CANCELLED);

  const incomingOrders = liveOrders.filter(o => o.status === OrderStatus.INCOMING);

  // Actions
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent card toggle
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
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

  const getItemSummary = (items: OrderItem[]) => {
    if (items.length === 0) return 'No items';
    const firstItem = `${items[0].quantity}x ${items[0].name}`;
    if (items.length === 1) return firstItem;
    return `${firstItem} + ${items.length - 1} more`;
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse-once">
        {list.map(order => {
          const isExpanded = expandedOrders.has(order.id);
          
          return (
            <div 
              key={order.id} 
              onClick={() => toggleOrder(order.id)}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md cursor-pointer ${isExpanded ? 'ring-2 ring-offoOrange ring-opacity-50' : ''}`}
            >
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
                <div className="text-right flex items-start gap-2">
                   <div>
                       <div className="text-xs text-gray-400 font-medium">Placed At</div>
                       <div className="text-sm font-medium text-gray-700">{order.orderTime}</div>
                   </div>
                   <button className="text-gray-400 hover:text-gray-600 transition-colors pt-1">
                      <svg className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                   </button>
                </div>
              </div>

              {/* Collapsed Summary */}
              {!isExpanded && (
                 <div className="p-4 flex justify-between items-center bg-white">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                           {order.items.length}
                        </span>
                        <span className="font-medium truncate max-w-[150px]">{getItemSummary(order.items)}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                 </div>
              )}

              {/* Expanded Details */}
              {isExpanded && (
                <>
                  {/* Order Items */}
                  <div className="p-4 flex-1 overflow-y-auto max-h-96 border-t border-gray-100 bg-white">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Details</h4>
                    <ul className="space-y-3">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 text-xs font-bold flex items-center justify-center border border-orange-100">
                              {item.quantity}
                            </span>
                            <span className="text-gray-800 font-medium">{item.name}</span>
                          </div>
                          <span className="text-gray-600 font-medium">₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Payment: <span className="font-medium text-gray-800">{order.paymentMethod}</span></span>
                        <span className="text-lg font-bold text-gray-900">Total: ₹{order.totalAmount}</span>
                    </div>

                    {order.scheduledTime && (
                       <div className="mt-3 p-2 bg-orange-50 border border-orange-100 rounded-lg text-center">
                         <span className="text-xs text-orange-600 uppercase font-bold tracking-wide">Scheduled For</span>
                         <div className="text-lg font-bold text-orange-700">{order.scheduledTime}</div>
                       </div>
                    )}
                  </div>

                  {/* Rejection Reason if cancelled */}
                  {order.status === OrderStatus.CANCELLED && order.cancellationReason && (
                    <div className="px-4 py-3 bg-red-50 border-t border-red-100">
                      <p className="text-sm text-red-600"><strong>Reason:</strong> {order.cancellationReason}</p>
                    </div>
                  )}

                  {/* Footer Actions */}
                  {showActions && order.status !== OrderStatus.CANCELLED && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="grid grid-cols-2 gap-3">
                        {order.status === OrderStatus.INCOMING ? (
                          <>
                            <button 
                              onClick={(e) => updateOrderStatus(order.id, OrderStatus.CANCELLED, e)}
                              className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium focus:ring-2 focus:ring-red-200"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={(e) => updateOrderStatus(order.id, OrderStatus.PREPARING, e)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-sm focus:ring-2 focus:ring-green-300"
                            >
                              Accept Order
                            </button>
                          </>
                        ) : order.status === OrderStatus.PREPARING ? (
                          <button 
                              onClick={(e) => updateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP, e)}
                              className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                            >
                              Mark Ready for Pickup
                            </button>
                        ) : order.status === OrderStatus.READY_FOR_PICKUP ? (
                          <button 
                              onClick={(e) => updateOrderStatus(order.id, OrderStatus.COMPLETED, e)}
                              className="col-span-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium shadow-sm"
                            >
                              Complete Order
                            </button>
                        ) : order.status === OrderStatus.SCHEDULED ? (
                          <button 
                              onClick={(e) => updateOrderStatus(order.id, OrderStatus.PREPARING, e)}
                              className="col-span-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
                            >
                              Start Preparing Now
                            </button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
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