import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import { constants } from '../constants.ts';
import { Branch } from '../types.ts';

export const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 'branch1',
      name: 'Main campus Cafes',
      address: 'Amazon Building A, Tech Park',
      status: 'Active',
      manager: 'Vinod More',
      contact: '+91 96985965',
      latitude: '12.9716',
      longitude: '77.5946',
    },
    {
      id: 'branch2',
      name: 'East Wing Coffee Shop',
      address: 'Amazon Building A, Tech Park',
      status: 'Active',
      manager: 'Jan Smith',
      contact: '+91 96985965',
      latitude: '12.9345',
      longitude: '77.6291',
    },
  ]);

  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');
  const [newBranchContact, setNewBranchContact] = useState('');
  const [newBranchLatitude, setNewBranchLatitude] = useState('');
  const [newBranchLongitude, setNewBranchLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const handleSelectMyLocation = () => {
    setIsFetchingLocation(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewBranchLatitude(position.coords.latitude.toFixed(6));
          setNewBranchLongitude(position.coords.longitude.toFixed(6));
          setIsFetchingLocation(false);
        },
        (geoError) => {
          setError(`Geolocation error: ${geoError.message}. Please enter manually.`);
          setIsFetchingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter manually.');
      setIsFetchingLocation(false);
    }
  };


  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newBranchName || !newBranchAddress || !newBranchManager || !newBranchContact || !newBranchLatitude || !newBranchLongitude) {
      setError('All fields including location are required.');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newBranch: Branch = {
      id: `branch${branches.length + 1}`,
      name: newBranchName,
      address: newBranchAddress,
      status: 'Active',
      manager: newBranchManager,
      contact: newBranchContact,
      latitude: newBranchLatitude,
      longitude: newBranchLongitude,
    };

    setBranches((prev) => [...prev, newBranch]);
    setIsAddBranchModalOpen(false);
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchManager('');
    setNewBranchContact('');
    setNewBranchLatitude('');
    setNewBranchLongitude('');
    setLoading(false);
  };

  const openDeleteModal = (branch: Branch) => {
    setBranchToDelete(branch);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBranch = async () => {
    if (branchToDelete) {
      setLoading(true);
      // Simulate API call for deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBranches(branches.filter(b => b.id !== branchToDelete.id));
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
      setLoading(false);
    }
  };


  const getStatusBadgeClasses = (status: 'Active' | 'Disabled') => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    return status === 'Active' ? `${base} bg-green-500 text-white` : `${base} bg-gray-500 text-white`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK}`}>Branch Management</h1>
          <p className={`text-${constants.colors.ACCENT_GRAY} text-lg`}>Manage Your Cafe Location and details.</p>
          <p className={`text-${constants.colors.ACCENT_GRAY} text-sm mt-1`}>Manage Cafes/Branches</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsAddBranchModalOpen(true)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          }
        >
          Add Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className="p-6 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={getStatusBadgeClasses(branch.status)}>{branch.status}</span>
              <button
                onClick={() => openDeleteModal(branch)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label={`Delete ${branch.name}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            <div className="flex items-center mb-4">
              {/* Placeholder icon */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1"></path></svg>
              </div>
              <div>
                <h3 className={`text-xl font-semibold text-${constants.colors.TEXT_DARK}`}>{branch.name}</h3>
                <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>{branch.address}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className={`flex justify-between text-sm text-${constants.colors.ACCENT_GRAY}`}>
                <span className={`font-semibold text-${constants.colors.TEXT_DARK}`}>Manager:</span>
                <span>{branch.manager}</span>
              </div>
              <div className={`flex justify-between text-sm text-${constants.colors.ACCENT_GRAY} mt-2`}>
                <span className={`font-semibold text-${constants.colors.TEXT_DARK}`}>Contact:</span>
                <span>{branch.contact}</span>
              </div>
              <div className={`flex justify-between text-sm text-${constants.colors.ACCENT_GRAY} mt-2`}>
                <span className={`font-semibold text-${constants.colors.TEXT_DARK}`}>Location:</span>
                <span>{branch.latitude}, {branch.longitude}</span>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              {/* Fix: Added empty string children for the icon-only button to satisfy ButtonProps */}
              <Button variant="ghost" size="sm" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}>''</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Branch Modal */}
      <Modal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
        title="Add New Branch"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddBranchModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddBranch} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Add Branch'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddBranch} className="space-y-4">
          <div>
            <label htmlFor="branchName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Branch Name</label>
            <input
              type="text"
              id="branchName"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="branchAddress" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Address</label>
            <input
              type="text"
              id="branchAddress"
              value={newBranchAddress}
              onChange={(e) => setNewBranchAddress(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="branchManager" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Manager Name</label>
            <input
              type="text"
              id="branchManager"
              value={newBranchManager}
              onChange={(e) => setNewBranchManager(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          <div>
            <label htmlFor="branchContact" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Contact Number</label>
            <input
              type="tel"
              id="branchContact"
              value={newBranchContact}
              onChange={(e) => setNewBranchContact(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Location Details</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleSelectMyLocation}
              disabled={isFetchingLocation || loading}
              className="w-full mb-3"
              icon={isFetchingLocation ? <LoadingSpinner /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
            >
              {isFetchingLocation ? 'Fetching Location...' : 'Select My Current Location'}
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="newBranchLatitude" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Latitude</label>
                <input
                  type="text"
                  id="newBranchLatitude"
                  value={newBranchLatitude}
                  onChange={(e) => setNewBranchLatitude(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                  placeholder="e.g., 12.3456"
                  required
                />
              </div>
              <div>
                <label htmlFor="newBranchLongitude" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Longitude</label>
                <input
                  type="text"
                  id="newBranchLongitude"
                  value={newBranchLongitude}
                  onChange={(e) => setNewBranchLongitude(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                  placeholder="e.g., 78.9012"
                  required
                />
              </div>
            </div>
            <div className={`mt-3 h-32 bg-gray-100 rounded-md flex items-center justify-center text-${constants.colors.ACCENT_GRAY}`}>
              Map Placeholder
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </Modal>

      {/* Delete Branch Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteBranch} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Delete'}
            </Button>
          </>
        }
      >
        <p className={`text-${constants.colors.TEXT_DARK}`}>
          Are you sure you want to delete branch "{branchToDelete?.name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};