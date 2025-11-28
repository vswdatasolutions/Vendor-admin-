import React, { useState } from 'react';
import { Sidebar } from './Sidebar.tsx'; // Corrected: Named import with .tsx extension
import { constants } from '../../constants.ts';
import LogoutModal from '../auth/LogoutModal.tsx';

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    onLogout();
  };

  return (
    <div className={`flex min-h-screen bg-${constants.colors.BG_LIGHT}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={() => setIsLogoutModalOpen(true)} />

      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header for mobile view */}
        <header className={`bg-offoHeaderBg shadow-lg h-16 flex items-center justify-between px-4 sticky top-0 z-20 md:hidden`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`text-${constants.colors.TEXT_LIGHT} focus:outline-none focus:ring-2 focus:ring-offoOrange rounded-md p-1`}
            aria-label="Toggle sidebar"
            aria-controls="sidebar"
            aria-expanded={isSidebarOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-5xl font-bold text-offoDark">OFFO</h1>
          <div className="w-6 h-6 flex-shrink-0"></div> {/* Placeholder for alignment */}
        </header>

        {/* Dashboard Header for desktop view */}
        <div className="hidden md:flex bg-offoHeaderBg h-24 p-4 text-white items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm">Welcome, Healthy Bites Catering Admin</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <span>Vendor</span>
                <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offoOrange rounded-full p-1 transition-colors"
                    aria-label="Logout"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
        </div>

        {/* Main Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto text-${constants.colors.TEXT_DARK}`}>
          {children}
        </main>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};