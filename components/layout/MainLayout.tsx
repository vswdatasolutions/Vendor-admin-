
import React, { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { BottomNav } from './BottomNav.tsx';
import { constants } from '../../constants.ts';
import LogoutModal from '../auth/LogoutModal.tsx';
import { useBranch } from '../../context/BranchContext.tsx';

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { branches, currentBranchId, setCurrentBranchId } = useBranch();

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    onLogout();
  };

  return (
    <div className={`flex min-h-screen bg-${constants.colors.BG_LIGHT}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={() => setIsLogoutModalOpen(true)} />

      <div className="flex-1 flex flex-col md:ml-0 pb-16 md:pb-0">
        {/* Mobile Header */}
        <header className={`bg-offoHeaderBg shadow-lg h-16 flex items-center justify-between px-4 sticky top-0 z-20 md:hidden`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`text-${constants.colors.TEXT_LIGHT} focus:outline-none focus:ring-2 focus:ring-offoOrange rounded-md p-1`}
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold text-white leading-none">OFFO</h1>
             {/* Mobile Branch Selector (Tiny) */}
             <select 
                value={currentBranchId}
                onChange={(e) => setCurrentBranchId(e.target.value)}
                className="bg-transparent text-white/90 text-xs border-none p-0 focus:ring-0 cursor-pointer text-center font-medium mt-1"
             >
                {branches.map(b => (
                    <option key={b.id} value={b.id} className="text-gray-900">{b.name}</option>
                ))}
             </select>
          </div>
          <button 
             onClick={() => setIsLogoutModalOpen(true)}
             className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </header>

        {/* Desktop Header */}
        <div className="hidden md:flex bg-offoHeaderBg h-24 p-4 text-white items-center justify-between shadow-md relative z-10">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-white/80">Welcome, Healthy Bites Catering Admin</p>
            </div>
            <div className="flex items-center gap-4">
                {/* Global Branch Selector */}
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1"></path></svg>
                    </span>
                    <select 
                        value={currentBranchId}
                        onChange={(e) => setCurrentBranchId(e.target.value)}
                        className="pl-9 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all cursor-pointer appearance-none min-w-[200px]"
                    >
                        {branches.map(b => (
                            <option key={b.id} value={b.id} className="text-gray-900 bg-white">
                                {b.name}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                </div>

                <div className="h-8 w-px bg-white/20 mx-2"></div>

                <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                    <span className="font-medium">Logout</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
        </div>

        {/* Content Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto text-${constants.colors.TEXT_DARK}`}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};
