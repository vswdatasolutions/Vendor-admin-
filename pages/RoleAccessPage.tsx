import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import { constants } from '../constants.ts';
import { Role, AllPermissions, Permission } from '../types.ts';

export const RoleAccessPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'role1',
      name: 'Super Admin',
      description: 'Full access to all system features.',
      permissions: ['view dashboard', 'manage orders', 'manage menu', 'manage staff', 'manage branches', 'view reports', 'manage branding', 'manage settings'],
    },
    {
      id: 'role2',
      name: 'Branch Manager',
      description: 'Can manage branches and staff.',
      permissions: ['view dashboard', 'manage staff', 'manage branches'],
    },
    {
      id: 'role3',
      name: 'Kitchen Staff',
      description: 'Can only view orders and dashboard.',
      permissions: ['view dashboard', 'manage orders'],
    },
    {
      id: 'role4',
      name: 'Billing Staff',
      description: 'Manages payment and reports.',
      permissions: ['view dashboard', 'view reports', 'manage orders'],
    },
  ]);

  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newRoleName || !newRoleDescription || newRolePermissions.length === 0) {
      setError('All fields are required and at least one permission must be selected.');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRole: Role = {
      id: `role${roles.length + 1}`,
      name: newRoleName,
      description: newRoleDescription,
      permissions: newRolePermissions,
    };

    setRoles((prev) => [...prev, newRole]);
    setIsCreateRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRolePermissions([]);
    setLoading(false);
  };

  const handlePermissionChange = (permission: Permission) => {
    setNewRolePermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Roles & Permissions</h1>
        <Button
          variant="secondary"
          onClick={() => setIsCreateRoleModalOpen(true)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          }
        >
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="p-6 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200" aria-label={`Delete ${role.name}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V9a2 2 0 012-2h2zM7 15a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4zM12 9v6m-4-6V9m8 0V9m-4 4h.01M17 19h.01M13 13h.01"></path>
                </svg>
              </div>
              <div>
                <h3 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK}`}>{role.name}</h3>
                <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>{role.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-xs uppercase text-${constants.colors.ACCENT_GRAY} font-medium mb-2`}>Permissions</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, pIndex) => (
                  <span key={pIndex} className="inline-flex items-center bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-md">
                    {permission.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">Edit Permissions</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        title="Create New Role"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateRoleModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateRole} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Create Role'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div>
            <label htmlFor="roleName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Role Name</label>
            <input
              type="text"
              id="roleName"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="roleDescription" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Description</label>
            <textarea
              id="roleDescription"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            ></textarea>
          </div>
          <div>
            <p className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Assign Permissions</p>
            <div className="grid grid-cols-2 gap-2">
              {AllPermissions.map((permission) => (
                <div key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`perm-${permission}`}
                    checked={newRolePermissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                  />
                  <label htmlFor={`perm-${permission}`} className={`ml-2 text-sm text-${constants.colors.TEXT_DARK}`}>
                    {permission.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </Modal>
    </div>
  );
};