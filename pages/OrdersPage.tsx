import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import { constants } from '../constants.ts';
import { Order, OrderStatus, OrderItem } from '../types.ts';

export const OrdersPage: React.FC = () => {
  const [incomingOrders, setIncomingOrders] = useState<Order[]>([
    { id: 'ORD001', customerName: 'Alice Smith', totalAmount: 250, status: OrderStatus.INCOMING, items: [{id:'item1', name:'Burger', quantity:1, price:150}, {id:'item2', name:'Fries', quantity:1, price:100}], orderTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), paymentMethod: 'Card' },
    { id: 'ORD002', customerName: 'Bob Johnson', totalAmount: 120, status: OrderStatus.INCOMING, items: [{id:'item3', name:'Coffee', quantity:2, price:60}], orderTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), paymentMethod: 'Cash' },
  ]);
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([
    { id: 'ORD003', customerName: 'Charlie Brown', totalAmount: 300, status: OrderStatus.PREPARING, items: [{id:'item4', name:'Pizza', quantity:1, price:300}], orderTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(), paymentMethod: 'UPI' },
  ]);
  const [readyForPickupOrders, setReadyForPickupOrders] = useState<Order[]>([]);
  const [scheduledOrders, setScheduledOrders] = useState<Order[]>([
    { id: 'ORD004', customerName: 'Diana Prince', totalAmount: 180, status: OrderStatus.SCHEDULED, items: [{id:'item5', name:'Sandwich', quantity:1, price:180}], orderTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), paymentMethod: 'Card' }, // Scheduled for 1 hour from now
  ]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([
    { id: 'ORD005', customerName: 'Eve Adams', totalAmount: 500, status: OrderStatus.COMPLETED, items: [{id:'item6', name:'Pasta', quantity:1, price:500}], orderTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'Cash' },
    { id: 'ORD006', customerName: 'Frank White', totalAmount: 75, status: OrderStatus.CANCELLED, items: [{id:'item7', name:'Soup', quantity:1, price:75}], orderTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), cancellationReason: 'Customer changed mind', paymentMethod: 'UPI' },
  ]);

  const [activeTab, setActiveTab] = useState<'incoming' | 'preparing' | 'ready' | 'scheduled' | 'history'>('incoming');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isMarkReadyModalOpen, setIsMarkReadyModalOpen] = useState(false);
  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [isViewOrderDetailsModalOpen, setIsViewOrderDetailsModalOpen] = useState(false);
  const [isViewCustomerDetailsModalOpen, setIsViewCustomerDetailsModalOpen] = useState(false);


  const [cancellationReason, setCancellationReason] = useState('');
  const [loading, setLoading] = useState(false);

  // For multi-select actions in Preparing Orders
  const [selectedPreparingOrders, setSelectedPreparingOrders] = useState<string[]>([]);

  const handleSelectAllPreparing = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPreparingOrders(preparingOrders.map(order => order.id));
    } else {
      setSelectedPreparingOrders([]);
    }
  };

  const handleTogglePreparingOrder = (orderId: string) => {
    setSelectedPreparingOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const openAcceptModal = (order: Order) => {
    setSelectedOrder(order);
    setIsAcceptModalOpen(true);
  };

  const handleAcceptOrder = async () => {
    if (selectedOrder) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setIncomingOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setPreparingOrders((prev) => [...prev, { ...selectedOrder, status: OrderStatus.PREPARING }]);
      setIsAcceptModalOpen(false);
      setSelectedOrder(null);
      setLoading(false);
    }
  };

  const openCancelModal = (order: Order) => {
    setSelectedOrder(order);
    setCancellationReason('');
    setIsCancelModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setIncomingOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setOrderHistory((prev) => [...prev, { ...selectedOrder, status: OrderStatus.CANCELLED, cancellationReason }]);
      setIsCancelModalOpen(false);
      setSelectedOrder(null);
      setCancellationReason('');
      setLoading(false);
    }
  };

  const openMarkReadyModal = () => {
    if (selectedPreparingOrders.length === 0) return; // Should not happen with disabled button
    setIsMarkReadyModalOpen(true);
  };

  const handleMarkReady = async () => {
    if (selectedPreparingOrders.length > 0) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const newReadyOrders = preparingOrders.filter(order => selectedPreparingOrders.includes(order.id)).map(order => ({ ...order, status: OrderStatus.READY_FOR_PICKUP }));
      const remainingPreparingOrders = preparingOrders.filter(order => !selectedPreparingOrders.includes(order.id));

      setPreparingOrders(remainingPreparingOrders);
      setReadyForPickupOrders((prev) => [...prev, ...newReadyOrders]);
      setSelectedPreparingOrders([]);
      setIsMarkReadyModalOpen(false);
      setLoading(false);
    }
  };

  const openMarkDeliveredModal = (order: Order) => {
    setSelectedOrder(order);
    setIsMarkDeliveredModalOpen(true);
  };

  const handleMarkDelivered = async () => {
    if (selectedOrder) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setReadyForPickupOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setOrderHistory((prev) => [...prev, { ...selectedOrder, status: OrderStatus.COMPLETED, pickupTime: new Date().toISOString() }]);
      setIsMarkDeliveredModalOpen(false);
      setSelectedOrder(null);
      setLoading(false);
    }
  };

  const openViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderDetailsModalOpen(true);
  };

  const openViewCustomerDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewCustomerDetailsModalOpen(true);
  };

  const getStatusBadgeClasses = (status: OrderStatus) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case OrderStatus.INCOMING:
        return `${base} bg-offoOrange text-white`;
      case OrderStatus.PENDING:
        return `${base} bg-red-500 text-white`;
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

  // Filter & Sort for Order History (simplified for now)
  const [historyFilter, setHistoryFilter] = useState({ customer: '', status: '', date: '', payment: '' });
  const filteredHistory = orderHistory.filter(order => {
    const customerMatch = historyFilter.customer ? order.customerName.toLowerCase().includes(historyFilter.customer.toLowerCase()) : true;
    const statusMatch = historyFilter.status ? order.status === historyFilter.status : true;
    const paymentMatch = historyFilter.payment ? order.paymentMethod === historyFilter.payment : true;
    // Date filter logic can be more complex (e.g., date range)
    return customerMatch && statusMatch && paymentMatch;
  });

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK} mb-6`}>Orders Management</h1>

      {/* Order Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'incoming' ? 'border-b-2 border-offoOrange text-offoOrange' : `text-${constants.colors.TEXT_DARK} hover:text-offoOrange`}`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Orders ({incomingOrders.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'preparing' ? 'border-b-2 border-offoOrange text-offoOrange' : `text-${constants.colors.TEXT_DARK} hover:text-offoOrange`}`}
          onClick={() => setActiveTab('preparing')}
        >
          Preparing Orders ({preparingOrders.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'ready' ? 'border-b-2 border-offoOrange text-offoOrange' : `text-${constants.colors.TEXT_DARK} hover:text-offoOrange`}`}
          onClick={() => setActiveTab('ready')}
        >
          Ready for Pickup ({readyForPickupOrders.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'scheduled' ? 'border-b-2 border-offoOrange text-offoOrange' : `text-${constants.colors.TEXT_DARK} hover:text-offoOrange`}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled Orders ({scheduledOrders.length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-offoOrange text-offoOrange' : `text-${constants.colors.TEXT_DARK} hover:text-offoOrange`}`}
          onClick={() => setActiveTab('history')}
        >
          Order History ({orderHistory.length})
        </button>
      </div>

      {/* Incoming Orders Tab */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingOrders.length === 0 ? (
            <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No incoming orders at the moment.</p>
          ) : (
            incomingOrders.map((order) => (
              <Card key={order.id} className="p-4 flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 mb-2 md:mb-0">
                  <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>Order #{order.id} - {order.customerName}</h3>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>Total: <span className="font-semibold text-offoOrange">₹{order.totalAmount.toFixed(2)}</span> | {getTimeDifference(order.orderTime)}</p>
                  <Button variant="ghost" size="sm" onClick={() => openViewOrderDetails(order)} className="mt-2 mr-2">View Details</Button>
                  <Button variant="ghost" size="sm" onClick={() => openViewCustomerDetails(order)}>Customer Info</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                  <Button variant="primary" size="sm" onClick={() => openAcceptModal(order)}>Accept</Button>
                  <Button variant="danger" size="sm" onClick={() => openCancelModal(order)}>Cancel</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Preparing Orders Tab */}
      {activeTab === 'preparing' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button
              variant="primary"
              onClick={openMarkReadyModal}
              disabled={selectedPreparingOrders.length === 0 || loading}
            >
              {loading ? <LoadingSpinner /> : `Mark ${selectedPreparingOrders.length} as Ready`}
            </Button>
          </div>
          {preparingOrders.length === 0 ? (
            <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No orders currently being prepared.</p>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedPreparingOrders.length === preparingOrders.length && preparingOrders.length > 0}
                  onChange={handleSelectAllPreparing}
                  className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                />
                <label className={`text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Select All</label>
              </div>
              {preparingOrders.map((order) => (
                <Card key={order.id} className="p-4 flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center flex-1 mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      checked={selectedPreparingOrders.includes(order.id)}
                      onChange={() => handleTogglePreparingOrder(order.id)}
                      className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded mr-3"
                    />
                    <div>
                      <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>Order #{order.id} - {order.customerName}</h3>
                      <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>Total: <span className="font-semibold text-offoOrange">₹{order.totalAmount.toFixed(2)}</span> | {getTimeDifference(order.orderTime)}</p>
                      <Button variant="ghost" size="sm" onClick={() => openViewOrderDetails(order)} className="mt-2 mr-2">View Details</Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* Ready for Pickup Orders Tab */}
      {activeTab === 'ready' && (
        <div className="space-y-4">
          {readyForPickupOrders.length === 0 ? (
            <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No orders ready for pickup.</p>
          ) : (
            readyForPickupOrders.map((order) => (
              <Card key={order.id} className="p-4 flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 mb-2 md:mb-0">
                  <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>Order #{order.id} - {order.customerName}</h3>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>Total: <span className="font-semibold text-offoOrange">₹{order.totalAmount.toFixed(2)}</span> | Ready {getTimeDifference(order.pickupTime || order.orderTime)}</p>
                  <Button variant="ghost" size="sm" onClick={() => openViewOrderDetails(order)} className="mt-2 mr-2">View Details</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                  <Button variant="primary" size="sm" onClick={() => openMarkDeliveredModal(order)}>Mark as Delivered</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Scheduled Orders Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          {scheduledOrders.length === 0 ? (
            <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No scheduled orders.</p>
          ) : (
            scheduledOrders.map((order) => (
              <Card key={order.id} className="p-4 flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 mb-2 md:mb-0">
                  <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>Order #{order.id} - {order.customerName}</h3>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>Total: <span className="font-semibold text-offoOrange">₹{order.totalAmount.toFixed(2)}</span> | Scheduled for {new Date(order.scheduledTime!).toLocaleString()}</p>
                  <Button variant="ghost" size="sm" onClick={() => openViewOrderDetails(order)} className="mt-2 mr-2">View Details</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="mb-4 p-4 border border-gray-200 rounded-lg">
            <h3 className={`text-lg font-semibold text-${constants.colors.TEXT_DARK} mb-3`}>Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-${constants.colors.TEXT_DARK}`}
                value={historyFilter.customer}
                onChange={(e) => setHistoryFilter({ ...historyFilter, customer: e.target.value })}
              />
              <select
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-${constants.colors.TEXT_DARK}`}
                value={historyFilter.status}
                onChange={(e) => setHistoryFilter({ ...historyFilter, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                {Object.values(OrderStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <input
                type="date"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-${constants.colors.TEXT_DARK}`}
                value={historyFilter.date}
                onChange={(e) => setHistoryFilter({ ...historyFilter, date: e.target.value })}
              />
              <select
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-${constants.colors.TEXT_DARK}`}
                value={historyFilter.payment}
                onChange={(e) => setHistoryFilter({ ...historyFilter, payment: e.target.value })}
              >
                <option value="">All Payment Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No order history matching filters.</p>
          ) : (
            filteredHistory.map((order) => (
              <Card key={order.id} className="p-4 flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 mb-2 md:mb-0">
                  <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>Order #{order.id} - {order.customerName}</h3>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>Total: <span className="font-semibold text-offoOrange">₹{order.totalAmount.toFixed(2)}</span> | Placed {new Date(order.orderTime).toLocaleString()}</p>
                  {order.cancellationReason && <p className="text-red-500 text-sm italic">Reason: {order.cancellationReason}</p>}
                  <Button variant="ghost" size="sm" onClick={() => openViewOrderDetails(order)} className="mt-2 mr-2">View Details</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={getStatusBadgeClasses(order.status)}>{order.status}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}


      {/* Modals */}
      {selectedOrder && (
        <>
          {/* Accept Order Confirmation Modal */}
          <Modal
            isOpen={isAcceptModalOpen}
            onClose={() => setIsAcceptModalOpen(false)}
            title="Confirm Accept Order"
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsAcceptModalOpen(false)} disabled={loading}>Cancel</Button>
                <Button variant="primary" onClick={handleAcceptOrder} disabled={loading}>
                  {loading ? <LoadingSpinner /> : 'Accept Order'}
                </Button>
              </>
            }
          >
            <p className={`text-${constants.colors.TEXT_DARK}`}>Are you sure you want to accept order "{selectedOrder.id}"?</p>
          </Modal>

          {/* Cancel Order Confirmation Modal */}
          <Modal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            title="Confirm Cancel Order"
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)} disabled={loading}>Close</Button>
                <Button variant="danger" onClick={handleCancelOrder} disabled={loading || !cancellationReason}>
                  {loading ? <LoadingSpinner /> : 'Cancel Order'}
                </Button>
              </>
            }
          >
            <p className={`text-${constants.colors.TEXT_DARK} mb-4`}>Are you sure you want to cancel order "{selectedOrder.id}"?</p>
            <div>
              <label htmlFor="cancellationReason" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Reason for Cancellation</label>
              <textarea
                id="cancellationReason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                placeholder="e.g., Customer changed mind, Item out of stock"
                required
              ></textarea>
            </div>
          </Modal>

          {/* View Order Details Modal */}
          <Modal
            isOpen={isViewOrderDetailsModalOpen}
            onClose={() => setIsViewOrderDetailsModalOpen(false)}
            title={`Order Details: #${selectedOrder.id}`}
            footer={<Button variant="ghost" onClick={() => setIsViewOrderDetailsModalOpen(false)}>Close</Button>}
          >
            <div className="space-y-3">
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Customer: <span className="font-semibold">{selectedOrder.customerName}</span>
              </p>
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Total Amount: <span className="font-semibold text-offoOrange">₹{selectedOrder.totalAmount.toFixed(2)}</span>
              </p>
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Status: <span className={getStatusBadgeClasses(selectedOrder.status)}>{selectedOrder.status}</span>
              </p>
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Order Time: <span className="font-semibold">{new Date(selectedOrder.orderTime).toLocaleString()}</span>
              </p>
              {selectedOrder.pickupTime && <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Pickup Time: <span className="font-semibold">{new Date(selectedOrder.pickupTime).toLocaleString()}</span>
              </p>}
              {selectedOrder.scheduledTime && <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Scheduled For: <span className="font-semibold">{new Date(selectedOrder.scheduledTime).toLocaleString()}</span>
              </p>}
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Payment Method: <span className="font-semibold">{selectedOrder.paymentMethod}</span>
              </p>
              {selectedOrder.cancellationReason && <p className={`text-base text-red-500 italic`}>
                Cancellation Reason: <span className="font-normal">{selectedOrder.cancellationReason}</span>
              </p>}
              <h4 className={`font-semibold text-${constants.colors.TEXT_DARK} mt-4`}>Items:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {selectedOrder.items.map(item => (
                  <li key={item.id} className={`text-sm text-${constants.colors.TEXT_DARK}`}>
                    {item.name} (x{item.quantity}) - ₹{item.price.toFixed(2)} each
                  </li>
                ))}
              </ul>
            </div>
          </Modal>

          {/* View Customer Details Modal */}
          <Modal
            isOpen={isViewCustomerDetailsModalOpen}
            onClose={() => setIsViewCustomerDetailsModalOpen(false)}
            title={`Customer Details: ${selectedOrder.customerName}`}
            footer={<Button variant="ghost" onClick={() => setIsViewCustomerDetailsModalOpen(false)}>Close</Button>}
          >
            <div className="space-y-3">
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Name: <span className="font-semibold">{selectedOrder.customerName}</span>
              </p>
              {/* Dummy customer info - extend with more fields if needed */}
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Phone: <span className="font-semibold">+1-XXX-XXX-XXXX</span>
              </p>
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Email: <span className="font-semibold">customer@example.com</span>
              </p>
              <p className={`text-base text-${constants.colors.TEXT_DARK}`}>
                Address: <span className="font-semibold">123 Main St, Anytown</span>
              </p>
            </div>
          </Modal>
        </>
      )}

      {/* Mark Ready Confirmation Modal */}
      <Modal
        isOpen={isMarkReadyModalOpen}
        onClose={() => setIsMarkReadyModalOpen(false)}
        title="Confirm Mark as Ready"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsMarkReadyModalOpen(false)} disabled={loading}>Cancel</Button>
            <Button variant="primary" onClick={handleMarkReady} disabled={loading}>
              {loading ? <LoadingSpinner /> : `Mark ${selectedPreparingOrders.length} as Ready`}
            </Button>
          </>
        }
      >
        <p className={`text-${constants.colors.TEXT_DARK}`}>Are you sure you want to mark the selected {selectedPreparingOrders.length} order(s) as "Ready for Pickup"?</p>
      </Modal>

      {/* Mark Delivered Confirmation Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isMarkDeliveredModalOpen}
          onClose={() => setIsMarkDeliveredModalOpen(false)}
          title="Confirm Mark as Delivered"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsMarkDeliveredModalOpen(false)} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleMarkDelivered} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Mark as Delivered'}
              </Button>
            </>
          }
        >
          <p className={`text-${constants.colors.TEXT_DARK}`}>Are you sure you want to mark order "{selectedOrder.id}" as "Delivered"?</p>
        </Modal>
      )}
    </div>
  );
};