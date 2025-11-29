
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Branch } from '../types.ts';

interface BranchContextType {
  branches: Branch[];
  currentBranchId: string;
  currentBranch: Branch | undefined;
  setCurrentBranchId: (id: string) => void;
  setBranches: (branches: Branch[]) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

// Mock Initial Branches
const INITIAL_BRANCHES: Branch[] = [
  { id: '1', name: 'Main Campus Cafe', address: 'Amazon Building A, Tech Park', status: 'Active', manager: 'Vinod More', contact: '+91 96985965', latitude: '12.9716', longitude: '77.5946' },
  { id: '2', name: 'East Wing Coffee Shop', address: 'Amazon Building B, Tech Park', status: 'Active', manager: 'Jan Smith', contact: '+91 96985965', latitude: '12.9345', longitude: '77.6291' },
  { id: '3', name: 'Downtown Hub', address: 'City Center, MG Road', status: 'Active', manager: 'Sarah Lee', contact: '+91 98765432', latitude: '12.9719', longitude: '77.5937' }
];

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [currentBranchId, setCurrentBranchId] = useState<string>(INITIAL_BRANCHES[0].id);

  const currentBranch = branches.find(b => b.id === currentBranchId);

  return (
    <BranchContext.Provider value={{ branches, currentBranchId, currentBranch, setCurrentBranchId, setBranches }}>
      {children}
    </BranchContext.Provider>
  );
};
