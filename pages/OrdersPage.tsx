
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Drawer from '../components/common/Drawer.tsx';
import Modal from '../components/common/Modal.tsx';
import { constants } from '../constants.ts';
import { Order, OrderStatus, OrderItem } from '../types.ts';
import { useBranch } from '../context/BranchContext.tsx';

// Helper to get today's date in YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Helper to format current time as HH:MM AM/PM
const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const MOCK_ORDERS_DATA: Order[] = [
  { 
    id: '404627', branchId: '1', customerName: 'New Customer', address: 'Some Office, 4th Floor', totalAmount: 450, status: OrderStatus.INCOMING, date: getTodayDate(), orderTime: getCurrentTime(), paymentMethod: 'UPI', 
    items: [{id:'1', name:'Veg Burger', quantity:2, price:150}, {id:'2', name:'Coke', quantity:2, price:75}],
    itemImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '403966', branchId: '1', customerName: 'New Customer', address: 'Some Office, 4th Floor', totalAmount: 20, status: OrderStatus.INCOMING, date: getTodayDate(), orderTime: '10:48 AM', paymentMethod: 'Card', 
    items: [{id:'3', name:'Coffee', quantity:1, price:20}],
    itemImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '594966', branchId: '1', customerName: 'New Customer', address: 'Some Office, 4th Floor', totalAmount: 20, status: OrderStatus.INCOMING, date: getTodayDate(), orderTime: '10:50 AM', paymentMethod: 'UPI', 
    items: [{id:'3', name:'Coffee', quantity:1, price:20}],
    itemImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '102345', branchId: '2', customerName: 'Karan Mehra', address: 'Reception Area', totalAmount: 240, status: OrderStatus.READY_FOR_PICKUP, date: getTodayDate(), orderTime: '10:30 AM', paymentMethod: 'Cash', 
    items: [{id:'4', name:'Iced Coffee', quantity:2, price:120}],
    itemImage: 'https://images.unsplash.com/photo-1517701604599-bb29b5c5090c?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '105678', branchId: '2', customerName: 'Jenny Doe', address: 'Cabin 3', totalAmount: 150, status: OrderStatus.COMPLETED, date: getTodayDate(), orderTime: '09:30 AM', paymentMethod: 'UPI', 
    items: [{id:'6', name:'Tea', quantity:2, price:25}, {id:'7', name:'Bun Maska', quantity:2, price:50}],
    itemImage: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '201999', branchId: '3', customerName: 'Charlie Brown', address: 'Meeting Room 1', totalAmount: 1200, status: OrderStatus.SCHEDULED, date: '2023-11-30', orderTime: '10:00 AM', scheduledTime: '02:00 PM', paymentMethod: 'UPI', 
    items: [{id:'4', name:'Family Meal Pack', quantity:1, price:1200}],
    itemImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'
  }
];

type Tab = 'incoming' | 'preparing' | 'ready' | 'picked_up' | 'scheduled';

export const OrdersPage: React.FC = () => {
  const { currentBranchId, currentBranch, branches } = useBranch();
  const [allOrders, setAllOrders] = useState<Order[]>(MOCK_ORDERS_DATA);
  
  // Filter orders by current branch
  const orders = useMemo(() => allOrders.filter(o => o.branchId === currentBranchId), [allOrders, currentBranchId]);

  const [activeTab, setActiveTab] = useState<Tab>('incoming');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'accept-all' | 'reject-all' | 'reject-selected' | 'accept-selected' | null;
    count: number;
  }>({ isOpen: false, action: null, count: 0 });

  const [notification, setNotification] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Filter Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Helper to get branch name by id
  const getBranchName = (id: string) => branches.find(b => b.id === id)?.name || 'Unknown Branch';

  useEffect(() => {
      // Reset pagination when tab or filters change
      setCurrentPage(1);
  }, [activeTab, searchQuery, filterDate, minAmount, maxAmount]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate Real-time incoming orders for current branch
  useEffect(() => {
    const interval = setInterval(() => {
        if (orders.length < 50) {
            const newOrder = generateRandomOrder(currentBranchId);
            setAllOrders(prev => [newOrder, ...prev]);
            showNotification(`New Order #${newOrder.id} received!`);
        }
    }, 15000); 

    return () => clearInterval(interval);
  }, [orders.length, currentBranchId]);

  const generateRandomOrder = (branchId: string): Order => {
      const id = Math.floor(Math.random() * 900000) + 100000;
      const names = ['New Customer', 'Mike Ross', 'Rachel Green', 'Joey T', 'Monica G'];
      const itemsList = [
          {id:'1', name:'Coffee', quantity:1, price:20}, 
          {id:'2', name:'Veg Burger', quantity:1, price:150},
          {id:'3', name:'Fries', quantity:1, price:100},
          {id:'4', name:'Pasta', quantity:1, price:250}
      ];
      const images = [
          'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=100&q=80',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80',
          'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=100&q=80',
          'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=100&q=80'
      ];
      const randomItemIdx = Math.floor(Math.random() * itemsList.length);
      const orderItems = [itemsList[randomItemIdx]];
      const total = orderItems.reduce((sum, item) => sum + item.price, 0);

      return {
          id: `${id}`,
          branchId: branchId,
          customerName: names[Math.floor(Math.random() * names.length)],
          address: 'Some Office, 4th Floor',
          totalAmount: total,
          status: OrderStatus.INCOMING,
          date: getTodayDate(),
          orderTime: getCurrentTime(),
          paymentMethod: Math.random() > 0.5 ? 'UPI' : 'Card',
          items: orderItems,
          itemImage: images[randomItemIdx]
      };
  };

  const showNotification = (message: string) => {
      setNotification(message);
      setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    setSelectedOrderIds(new Set());
  }, [activeTab]);

  const getTimeAgo = (orderDate: string, orderTime: string) => {
      const today = getTodayDate();
      if (orderDate !== today) return 'Previous Day';

      const [time, modifier] = orderTime.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
      
      const orderDateObj = new Date();
      orderDateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
      
      const diffMs = currentTime.getTime() - orderDateObj.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHrs = Math.floor(diffMins / 60);
      return `${diffHrs} hr ago`;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    const newSelected = new Set(selectedOrderIds);
    newSelected.delete(orderId);
    setSelectedOrderIds(newSelected);
  };

  // 1. Filter by Status (Tab)
  const getTabOrders = () => {
    switch(activeTab) {
        case 'incoming': return orders.filter(o => o.status === OrderStatus.INCOMING || o.status === OrderStatus.PENDING);
        case 'preparing': return orders.filter(o => o.status === OrderStatus.PREPARING);
        case 'ready': return orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP);
        case 'picked_up': return orders.filter(o => o.status === OrderStatus.COMPLETED);
        case 'scheduled': return orders.filter(o => o.status === OrderStatus.SCHEDULED);
        default: return [];
    }
  };

  // 2. Filter by Search criteria
  const filterList = (list: Order[]) => {
      return list.filter(o => {
          const matchesName = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesDate = filterDate ? o.date === filterDate : true;
          const matchesMin = minAmount ? o.totalAmount >= Number(minAmount) : true;
          const matchesMax = maxAmount ? o.totalAmount <= Number(maxAmount) : true;
          return matchesName && matchesDate && matchesMin && matchesMax;
      });
  };

  const filteredOrders = filterList(getTabOrders());

  // 3. Paginate
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Sorting: Incoming is newest first
  if (activeTab === 'incoming') {
      currentOrders.sort((a, b) => b.id.localeCompare(a.id));
  }

  const toggleSelection = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    const newSet = new Set(selectedOrderIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedOrderIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === currentOrders.length && currentOrders.length > 0) {
        setSelectedOrderIds(new Set());
    } else {
        setSelectedOrderIds(new Set(currentOrders.map(o => o.id)));
    }
  };

  const handleBulkAction = (action: 'accept' | 'reject') => {
      const count = selectedOrderIds.size;
      if (count === 0) return;

      if (action === 'reject') {
        setConfirmModal({ isOpen: true, action: 'reject-selected', count });
      } else if (action === 'accept') {
        setConfirmModal({ isOpen: true, action: 'accept-selected', count });
      }
  };

  const handleAcceptAllIncoming = () => {
    const count = orders.filter(o => o.status === OrderStatus.INCOMING || o.status === OrderStatus.PENDING).length;
    if (count === 0) return;
    setConfirmModal({ isOpen: true, action: 'accept-all', count });
  };

  const handleRejectAllIncoming = () => {
    const count = orders.filter(o => o.status === OrderStatus.INCOMING || o.status === OrderStatus.PENDING).length;
    if (count === 0) return;
    setConfirmModal({ isOpen: true, action: 'reject-all', count });
  };

  const handleConfirmAction = () => {
    const action = confirmModal.action;
    if (action === 'reject-selected') {
        setAllOrders(prev => prev.map(o => selectedOrderIds.has(o.id) ? {...o, status: OrderStatus.CANCELLED} : o));
        setSelectedOrderIds(new Set());
        showNotification(`Rejected ${confirmModal.count} orders`);
    } else if (action === 'accept-selected') {
        setAllOrders(prev => prev.map(o => selectedOrderIds.has(o.id) ? {...o, status: OrderStatus.PREPARING} : o));
        setSelectedOrderIds(new Set());
        showNotification(`Accepted ${confirmModal.count} orders`);
    } else if (action === 'accept-all') {
        setAllOrders(prev => prev.map(o => 
           (o.branchId === currentBranchId && (o.status === OrderStatus.INCOMING || o.status === OrderStatus.PENDING))
           ? { ...o, status: OrderStatus.PREPARING } 
           : o
        ));
        setSelectedOrderIds(new Set());
        showNotification(`Accepted all ${confirmModal.count} incoming orders`);
    } else if (action === 'reject-all') {
        setAllOrders(prev => prev.map(o => 
           (o.branchId === currentBranchId && (o.status === OrderStatus.INCOMING || o.status === OrderStatus.PENDING)) 
           ? { ...o, status: OrderStatus.CANCELLED } 
           : o
        ));
        setSelectedOrderIds(new Set());
        showNotification(`Rejected all ${confirmModal.count} incoming orders`);
    }
    setConfirmModal({ isOpen: false, action: null, count: 0 });
  };

  const getTabCount = (tab: Tab) => {
      switch(tab) {
          case 'incoming': return orders.filter(o => o.status === OrderStatus.INCOMING || o.status === OrderStatus.PENDING).length;
          case 'preparing': return orders.filter(o => o.status === OrderStatus.PREPARING).length;
          case 'ready': return orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP).length;
          case 'picked_up': return orders.filter(o => o.status === OrderStatus.COMPLETED).length;
          case 'scheduled': return orders.filter(o => o.status === OrderStatus.SCHEDULED).length;
      }
  };

  const getTotalOrders = () => orders.length;
  const getPreparingCount = () => orders.filter(o => o.status === OrderStatus.PREPARING).length;
  const getPickedUpCount = () => orders.filter(o => o.status === OrderStatus.COMPLETED).length;
  const getIncomingCount = () => orders.filter(o => o.status === OrderStatus.INCOMING || o.status === OrderStatus.PENDING).length;

  const renderOrderList = () => {
      if (filteredOrders.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-b-lg border border-t-0 border-gray-200">
                  <p className="text-gray-500 font-medium">No orders found.</p>
              </div>
          )
      }

      return (
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-4 text-left">
                            <input 
                                type="checkbox" 
                                checked={selectedOrderIds.size === currentOrders.length && currentOrders.length > 0}
                                onChange={toggleSelectAll}
                                className="h-5 w-5 text-offoOrange border-gray-300 rounded focus:ring-offoOrange cursor-pointer"
                            />
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ORDER ID / Customer Name</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ITEM</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">PAYMENT</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">STATUS</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">UPDATE STATUS</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrders.map(order => (
                        <tr key={order.id} className={`${selectedOrderIds.has(order.id) ? 'bg-orange-50' : 'hover:bg-gray-50'} transition-colors`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input 
                                    type="checkbox" 
                                    checked={selectedOrderIds.has(order.id)}
                                    onChange={(e) => toggleSelection(e, order.id)}
                                    className="h-5 w-5 text-offoOrange border-gray-300 rounded focus:ring-offoOrange cursor-pointer"
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                                    <span className="text-sm font-bold text-gray-800">{order.customerName}</span>
                                    <span className="text-xs text-gray-500">{order.address || 'Unknown Address'}</span>
                                    <span className="text-xs text-red-500 mt-1">{getTimeAgo(order.date, order.orderTime)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                                        <img className="h-full w-full object-cover" src={order.itemImage || "https://placehold.co/100x100?text=Food"} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-bold text-gray-900">{order.items[0].name}</div>
                                        <div className="text-sm text-gray-500">₹{order.items[0].price.toFixed(2)}</div>
                                        {order.items.length > 1 && (
                                            <div className="text-xs text-gray-400">+{order.items.length - 1} more</div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                                <div className="flex items-center text-xs text-green-600 font-medium">
                                    Paid
                                    <svg className="w-3 h-3 ml-1 bg-green-500 text-white rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-500">
                                    {order.status === OrderStatus.INCOMING ? 'Pending' : order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex gap-2">
                                    {order.status === OrderStatus.INCOMING && (
                                        <>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {order.status === OrderStatus.PREPARING && (
                                        <button onClick={() => updateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP)} className="text-blue-600 hover:text-blue-900">Mark Ready</button>
                                    )}
                                    {order.status === OrderStatus.READY_FOR_PICKUP && (
                                        <button onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)} className="text-green-600 hover:text-green-900">Complete</button>
                                    )}
                                     <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>Details</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-sm hover:bg-gray-50"
                        >
                            Prev
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-sm hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
          </div>
      )
  }

  return (
    <div className="space-y-0 relative bg-gray-50 min-h-screen -m-4 sm:-m-6 lg:-m-8"> 
      {/* Toast */}
      <div 
        className={`fixed top-4 right-4 z-50 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 transform transition-all duration-300 ${
            notification ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-offoOrange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-offoOrange"></span>
        </span>
        <p className="font-medium">{notification}</p>
      </div>

      {/* Dark Stats Bar */}
      <div className="bg-slate-900 text-white p-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-700">
        <div className="text-center px-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">TOTAL ORDERS</p>
            <p className="text-3xl font-bold">{getTotalOrders()}</p>
        </div>
        <div className="text-center px-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">INCOMING ORDERS</p>
            <p className="text-3xl font-bold">{getIncomingCount()}</p>
        </div>
        <div className="text-center px-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">PREPARING</p>
            <p className="text-3xl font-bold">{getPreparingCount()}</p>
        </div>
        <div className="text-center px-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">PICKED-UP</p>
            <p className="text-3xl font-bold">{getPickedUpCount()}</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Tabs */}
        <div className="bg-white rounded-t-lg border border-gray-200 border-b-0 px-6 py-4 flex flex-wrap gap-8 items-center">
             <button 
                onClick={() => setActiveTab('incoming')}
                className={`text-sm font-bold flex items-center gap-2 pb-1 border-b-2 transition-colors ${activeTab === 'incoming' ? 'text-offoOrange border-offoOrange' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
             >
                 Incoming Orders
                 <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{getTabCount('incoming')}</span>
             </button>
             <button 
                onClick={() => setActiveTab('preparing')}
                className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'preparing' ? 'text-offoOrange border-offoOrange' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
             >
                 Preparing
             </button>
             <button 
                onClick={() => setActiveTab('ready')}
                className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'ready' ? 'text-offoOrange border-offoOrange' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
             >
                 Ready To Take
             </button>
             <button 
                onClick={() => setActiveTab('picked_up')}
                className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'picked_up' ? 'text-offoOrange border-offoOrange' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
             >
                 Picked Up
             </button>
        </div>

        {/* Filter Bar */}
        {selectedOrderIds.size > 0 && (
             <div className="bg-orange-50 border-x border-gray-200 p-3 flex justify-between items-center px-6">
                 <span className="text-sm font-medium text-orange-800">{selectedOrderIds.size} Orders Selected</span>
                 <div className="flex gap-2">
                    {activeTab === 'incoming' && (
                        <>
                            <Button size="sm" onClick={() => handleBulkAction('accept')}>Accept Selected</Button>
                            <Button variant="danger" size="sm" onClick={() => handleBulkAction('reject')}>Reject Selected</Button>
                        </>
                    )}
                 </div>
             </div>
        )}
        
        {/* Order List */}
        {renderOrderList()}
      </div>


      {/* Order Details Drawer */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder.id}` : ''}
        footer={
            selectedOrder && (
                <div className="flex gap-2 w-full">
                    {selectedOrder.status === OrderStatus.INCOMING && (
                        <>
                            <Button variant="danger" className="flex-1" onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.CANCELLED)}>Reject</Button>
                            <Button className="flex-1" onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.PREPARING)}>Accept & Cook</Button>
                        </>
                    )}
                    {selectedOrder.status === OrderStatus.PREPARING && (
                        <Button className="flex-1" onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.READY_FOR_PICKUP)}>Mark Ready</Button>
                    )}
                    {selectedOrder.status === OrderStatus.READY_FOR_PICKUP && (
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.COMPLETED)}>Complete Order</Button>
                    )}
                </div>
            )
        }
      >
        {selectedOrder && (
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Info</h4>
                    <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.address}</p>
                    <p className="text-sm text-gray-500 mt-2">Payment: {selectedOrder.paymentMethod}</p>
                    <p className="text-sm text-gray-500">Placed at: {selectedOrder.orderTime}</p>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                    <ul className="space-y-4">
                        {selectedOrder.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 font-bold rounded text-xs">
                                        {item.quantity}
                                    </span>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                    </div>
                                </div>
                                <span className="font-medium text-gray-900 text-sm">₹{item.price * item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">₹{selectedOrder.totalAmount}</span>
                </div>
            </div>
        )}
      </Drawer>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={
            confirmModal.action === 'accept-all' ? 'Accept All Orders?' :
            confirmModal.action === 'reject-all' ? 'Reject All Orders?' :
            confirmModal.action === 'reject-selected' ? 'Reject Selected Orders?' :
            'Accept Selected Orders?'
        }
        footer={
            <>
                <Button variant="ghost" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>Cancel</Button>
                <Button 
                    variant={confirmModal.action === 'accept-all' || confirmModal.action === 'accept-selected' ? 'primary' : 'danger'} 
                    onClick={handleConfirmAction}
                >
                    Confirm
                </Button>
            </>
        }
      >
        <p className="text-gray-600">
            {confirmModal.action === 'accept-all' && `Are you sure you want to accept all ${confirmModal.count} incoming orders?`}
            {confirmModal.action === 'reject-all' && `Are you sure you want to REJECT all ${confirmModal.count} incoming orders?`}
            {confirmModal.action === 'reject-selected' && `Are you sure you want to reject the selected ${confirmModal.count} orders?`}
            {confirmModal.action === 'accept-selected' && `Are you sure you want to accept the selected ${confirmModal.count} orders?`}
        </p>
      </Modal>
    </div>
  );
};
