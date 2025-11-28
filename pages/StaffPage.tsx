import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import { constants } from '../constants.ts';
import { StaffMember, StaffRole, Branch, AllPermissions, Permission } from '../types.ts';

export const StaffPage: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 'staff1',
      name: 'Sunny Thakur',
      email: 'sunny@example.com',
      phone: '+91 9876543210',
      role: StaffRole.MANAGER,
      branchId: 'branch1',
      branchName: 'Main campus Cafes',
      isActive: true,
      lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: 'staff2',
      name: 'Ganesh M',
      email: 'ganesh@example.com',
      phone: '+91 9988776655',
      role: StaffRole.KITCHEN,
      branchId: 'branch1',
      branchName: 'Main campus Cafes',
      isActive: true,
      lastActivity: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: 'staff3',
      name: 'Venkateshwara',
      email: 'venkat@example.com',
      phone: '+91 9000000000',
      role: StaffRole.STAFF,
      branchId: 'branch2',
      branchName: 'East Wing Coffee Shop',
      isActive: false,
      lastActivity: new Date(Date.now() - 10800000), // 3 hours ago
    },
    {
      id: 'staff4',
      name: 'Ramesh B',
      email: 'ramesh@example.com',
      phone: '+91 9123456789',
      role: StaffRole.BILLING,
      branchId: 'branch1',
      branchName: 'Main campus Cafes',
      isActive: true,
      lastActivity: new Date(Date.now() - 1800000), // 30 mins ago
    },
  ]);

  // Dummy branches for dropdowns
  const availableBranches: Branch[] = [
    { id: 'branch1', name: 'Main campus Cafes', address: '123 Main St', status: 'Active', manager: 'John Doe', contact: '123-456-7890', latitude: '', longitude: '' },
    { id: 'branch2', name: 'East Wing Coffee Shop', address: '456 Side Ave', status: 'Active', manager: 'Jane Doe', contact: '098-765-4321', latitude: '', longitude: '' },
  ];

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole | ''>(StaffRole.STAFF);
  const [newStaffBranchId, setNewStaffBranchId] = useState('');
  const [newStaffPermissions, setNewStaffPermissions] = useState<Permission[]>([]);

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [editStaffName, setEditStaffName] = useState('');
  const [editStaffPhone, setEditStaffPhone] = useState('');
  const [editStaffRole, setEditStaffRole] = useState<StaffRole | ''>('');
  const [editStaffBranchId, setEditStaffBranchId] = useState('');
  const [editStaffIsActive, setEditStaffIsActive] = useState(false);
  const [editStaffPermissions, setEditStaffPermissions] = useState<Permission[]>([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetAddForm = () => {
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffPassword('');
    setNewStaffRole(StaffRole.STAFF);
    setNewStaffBranchId('');
    setNewStaffPermissions([]);
    setError(null);
  };

  const handleOpenAddStaffModal = () => {
    resetAddForm();
    setIsAddStaffModalOpen(true);
  };

  const handleOpenEditStaffModal = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setEditStaffName(staff.name);
    setEditStaffPhone(staff.phone);
    setEditStaffRole(staff.role);
    setEditStaffBranchId(staff.branchId);
    setEditStaffIsActive(staff.isActive);
    // Dummy permissions for editing. In a real app, permissions would be tied to roles.
    setEditStaffPermissions(staff.role === StaffRole.ADMIN ? AllPermissions : ['view dashboard']);
    setIsEditStaffModalOpen(true);
  };

  const handlePermissionChange = (permission: Permission, isEditForm: boolean = false) => {
    if (isEditForm) {
      setEditStaffPermissions((prev) =>
        prev.includes(permission)
          ? prev.filter((p) => p !== permission)
          : [...prev, permission]
      );
    } else {
      setNewStaffPermissions((prev) =>
        prev.includes(permission)
          ? prev.filter((p) => p !== permission)
          : [...prev, permission]
      );
    }
  };


  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newStaffName || !newStaffEmail || !newStaffPhone || !newStaffPassword || !newStaffRole || !newStaffBranchId || newStaffPermissions.length === 0) {
      setError('All fields are required and at least one permission must be selected.');
      setLoading(false);
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(newStaffEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newStaff: StaffMember = {
      id: `staff${staffMembers.length + 1}`,
      name: newStaffName,
      email: newStaffEmail,
      phone: newStaffPhone,
      role: newStaffRole as StaffRole,
      branchId: newStaffBranchId,
      branchName: availableBranches.find(b => b.id === newStaffBranchId)?.name || 'N/A',
      isActive: true,
      lastActivity: new Date(),
      password: newStaffPassword, // In a real app, this would be hashed and not returned
    };

    setStaffMembers((prev) => [...prev, newStaff]);
    setIsAddStaffModalOpen(false);
    resetAddForm();
    setLoading(false);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedStaff || !editStaffName || !editStaffPhone || !editStaffRole || !editStaffBranchId || editStaffPermissions.length === 0) {
      setError('All fields are required and at least one permission must be selected.');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === selectedStaff.id
          ? {
              ...staff,
              name: editStaffName,
              phone: editStaffPhone,
              role: editStaffRole as StaffRole,
              branchId: editStaffBranchId,
              branchName: availableBranches.find(b => b.id === editStaffBranchId)?.name || 'N/A',
              isActive: editStaffIsActive,
            }
          : staff
      )
    );
    setIsEditStaffModalOpen(false);
    setSelectedStaff(null);
    setLoading(false);
  };

  const openDeleteModal = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsDeleteStaffModalOpen(true);
  };

  const confirmDeleteStaff = async () => {
    if (selectedStaff) {
      setLoading(true);
      // Simulate API call for deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStaffMembers(staffMembers.filter(s => s.id !== selectedStaff.id));
      setIsDeleteStaffModalOpen(false);
      setSelectedStaff(null);
      setLoading(false);
    }
  };

  const getStatusBadgeClasses = (isActive: boolean) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    return isActive ? `${base} bg-green-500 text-white` : `${base} bg-gray-500 text-white`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Staff Management</h1>
          <p className={`text-${constants.colors.ACCENT_GRAY} text-lg`}>Manage employee accounts and assignments.</p>
          <p className={`text-${constants.colors.ACCENT_GRAY} text-sm mt-1`}>Staff Cafes/Branches</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleOpenAddStaffModal}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          }
        >
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((staff) => (
          <Card key={staff.id} className="p-6 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={getStatusBadgeClasses(staff.isActive)}>{staff.isActive ? 'Active' : 'Inactive'}</span>
              <button
                onClick={() => openDeleteModal(staff)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label={`Delete ${staff.name}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div>
                <h3 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK}`}>{staff.name}</h3>
                <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>{staff.phone}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className={`flex justify-between text-sm text-${constants.colors.ACCENT_GRAY}`}>
                <span className={`font-semibold text-${constants.colors.TEXT_DARK}`}>Role:</span>
                <span>{staff.role}</span>
              </div>
              <div className={`flex justify-between text-sm text-${constants.colors.ACCENT_GRAY} mt-2`}>
                <span className={`font-semibold text-${constants.colors.TEXT_DARK}`}>Branch:</span>
                <span>{staff.branchName}</span>
              </div>
              <div className={`flex justify-between text-sm text-${constants.colors.ACCENT_GRAY} mt-2`}>
                <span className={`font-semibold text-${constants.colors.TEXT_DARK}`}>Last Activity:</span>
                <span>{staff.lastActivity?.toLocaleDateString() || 'N/A'}</span>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => handleOpenEditStaffModal(staff)}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        title="Add New Staff Member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddStaffModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddStaff} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Add Staff'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label htmlFor="staffName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Full Name</label>
            <input
              type="text"
              id="staffName"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="staffEmail" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Email</label>
            <input
              type="email"
              id="staffEmail"
              value={newStaffEmail}
              onChange={(e) => setNewStaffEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="staffPhone" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Phone Number</label>
            <input
              type="tel"
              id="staffPhone"
              value={newStaffPhone}
              onChange={(e) => setNewStaffPhone(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="staffPassword" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Password</label>
            <input
              type="password"
              id="staffPassword"
              value={newStaffPassword}
              onChange={(e) => setNewStaffPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="staffRole" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Role</label>
            <select
              id="staffRole"
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            >
              <option value="">Select Role</option>
              {Object.values(StaffRole).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="staffBranch" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Branch</label>
            <select
              id="staffBranch"
              value={newStaffBranchId}
              onChange={(e) => setNewStaffBranchId(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            >
              <option value="">Select Branch</option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <p className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Assign Permissions</p>
            <div className="grid grid-cols-2 gap-2">
              {AllPermissions.map((permission) => (
                <div key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`add-perm-${permission}`}
                    checked={newStaffPermissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                  />
                  <label htmlFor={`add-perm-${permission}`} className={`ml-2 text-sm text-${constants.colors.TEXT_DARK}`}>
                    {permission.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </Modal>

      {/* Edit Staff Modal */}
      {selectedStaff && (
        <Modal
          isOpen={isEditStaffModalOpen}
          onClose={() => setIsEditStaffModalOpen(false)}
          title={`Edit Staff: ${selectedStaff.name}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsEditStaffModalOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateStaff} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Update Staff'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleUpdateStaff} className="space-y-4">
            <div>
              <label htmlFor="editStaffName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Full Name</label>
              <input
                type="text"
                id="editStaffName"
                value={editStaffName}
                onChange={(e) => setEditStaffName(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              />
            </div>
            <div>
              <label htmlFor="editStaffPhone" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Phone Number</label>
              <input
                type="tel"
                id="editStaffPhone"
                value={editStaffPhone}
                onChange={(e) => setEditStaffPhone(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              />
            </div>
            <div>
              <label htmlFor="editStaffRole" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Role</label>
              <select
                id="editStaffRole"
                value={editStaffRole}
                onChange={(e) => setEditStaffRole(e.target.value as StaffRole)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              >
                <option value="">Select Role</option>
                {Object.values(StaffRole).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="editStaffBranch" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Branch</label>
              <select
                id="editStaffBranch"
                value={editStaffBranchId}
                onChange={(e) => setEditStaffBranchId(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              >
                <option value="">Select Branch</option>
                {availableBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editStaffIsActive"
                checked={editStaffIsActive}
                onChange={(e) => setEditStaffIsActive(e.target.checked)}
                className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
              />
              <label htmlFor="editStaffIsActive" className={`ml-2 text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Is Active</label>
            </div>
            <div>
              <p className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Assign Permissions</p>
              <div className="grid grid-cols-2 gap-2">
                {AllPermissions.map((permission) => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`edit-perm-${permission}`}
                      checked={editStaffPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission, true)}
                      className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                    />
                    <label htmlFor={`edit-perm-${permission}`} className={`ml-2 text-sm text-${constants.colors.TEXT_DARK}`}>
                      {permission.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </Modal>
      )}

      {/* Delete Staff Confirmation Modal */}
      <Modal
        isOpen={isDeleteStaffModalOpen}
        onClose={() => setIsDeleteStaffModalOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteStaffModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteStaff} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Delete'}
            </Button>
          </>
        }
      >
        <p className={`text-${constants.colors.TEXT_DARK}`}>
          Are you sure you want to delete staff member "{selectedStaff?.name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};