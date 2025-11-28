import React, { useState } from 'react';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import { constants } from '../constants.ts';
import { StaffMember, StaffRole } from '../types.ts';

export const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    { 
      id: '1', 
      name: 'Sunny Thakur', 
      email: 'sunny@example.com', 
      phone: '+91 9876543210', 
      role: StaffRole.MANAGER, 
      branchId: '1', 
      branchName: 'Main campus Cafes', 
      isActive: true,
      lastActivity: new Date('2025-11-28') 
    },
    { 
      id: '2', 
      name: 'Ganesh M', 
      email: 'ganesh@example.com', 
      phone: '+91 9988776655', 
      role: StaffRole.KITCHEN, 
      branchId: '1', 
      branchName: 'Main campus Cafes', 
      isActive: true,
      lastActivity: new Date('2025-11-28')
    },
    { 
      id: '3', 
      name: 'Venkateshwara', 
      email: 'venkat@example.com', 
      phone: '+91 9000000000', 
      role: StaffRole.STAFF, 
      branchId: '2', 
      branchName: 'East Wing Coffee Shop', 
      isActive: false,
      lastActivity: new Date('2025-11-28')
    },
    { 
      id: '4', 
      name: 'Ramesh B', 
      email: 'ramesh@example.com', 
      phone: '+91 9123456789', 
      role: StaffRole.BILLING, 
      branchId: '1', 
      branchName: 'Main campus Cafes', 
      isActive: true,
      lastActivity: new Date('2025-11-28')
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<Partial<StaffMember>>({});

  const roles = Object.values(StaffRole);

  const openModal = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member);
      setFormData(member);
    } else {
      setEditingStaff(null);
      setFormData({ role: StaffRole.STAFF, branchName: 'Main Campus', isActive: true });
    }
    setIsModalOpen(true);
  };

  const deleteStaff = (id: string) => {
    if(window.confirm('Are you sure you want to remove this staff member?')) {
        setStaff(staff.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...formData } as StaffMember : s));
    } else {
      const newStaff = { 
          ...formData, 
          id: Math.random().toString(36).substr(2, 9),
          lastActivity: new Date()
      } as StaffMember;
      setStaff([...staff, newStaff]);
    }
    setIsModalOpen(false);
  };

  const formatDate = (date?: Date) => {
      if (!date) return 'Never';
      // Simulating the date format in the screenshot "11/28/2025"
      return new Date(date).toLocaleDateString('en-US'); 
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
           <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Staff Management</h1>
           <p className="text-gray-500 mt-1">Manage employee accounts and assignments.</p>
           <p className="text-gray-400 text-xs mt-1">Staff Cafes/Branches</p>
        </div>
        <button 
            onClick={() => openModal()} 
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
            <span className="mr-2 text-lg">+</span> Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {staff.map((member) => (
            <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col relative group">
                {/* Delete Icon */}
                <button 
                    onClick={() => deleteStaff(member.id)}
                    className="absolute top-6 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                {/* Header */}
                <div className="flex justify-between items-start mb-6 mr-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-medium text-lg border border-blue-100">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{member.name}</h3>
                            <p className="text-gray-500 text-sm">{member.phone}</p>
                        </div>
                    </div>
                     <span className={`absolute top-6 right-12 px-2 py-0.5 rounded text-xs font-medium text-white ${member.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mb-4"></div>

                {/* Details */}
                <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-900">Role:</span>
                        <span className="text-gray-500">{member.role}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-900">Branch:</span>
                        <span className="text-gray-500 truncate max-w-[150px]" title={member.branchName}>{member.branchName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-900">Last Activity:</span>
                        <span className="text-gray-500">{formatDate(member.lastActivity)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end">
                     <button 
                        onClick={() => openModal(member)}
                        className="px-6 py-1.5 border border-orange-500 text-orange-500 rounded text-sm font-medium hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500"
                    >
                        Edit
                    </button>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? "Edit Staff Member" : "Add Staff Member"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-offoOrange focus:border-offoOrange" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-offoOrange focus:border-offoOrange" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-offoOrange focus:border-offoOrange" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as StaffRole})} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-offoOrange focus:border-offoOrange">
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <select value={formData.branchName} onChange={e => setFormData({...formData, branchName: e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-offoOrange focus:border-offoOrange">
              <option value="Main Campus">Main Campus</option>
              <option value="Downtown Hub">Downtown Hub</option>
              <option value="East Wing Coffee Shop">East Wing Coffee Shop</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active Account</label>
          </div>
          <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Details</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};