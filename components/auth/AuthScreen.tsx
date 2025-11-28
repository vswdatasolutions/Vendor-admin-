import React from 'react';
import MobileLoginForm from './MobileLoginForm.tsx';
import { constants } from '../../constants.ts';

interface AuthScreenProps {
  onLogin: (success: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-${constants.colors.BG_DARK} p-4`}>
      <div className="flex flex-col items-center">
        <h1 className={`text-6xl font-bold text-offoOrange mb-4`}>OFFO</h1>
        <p className={`text-xl font-medium text-${constants.colors.TEXT_LIGHT} mb-8`}>Vendor Admin Panel</p>
        <MobileLoginForm onLogin={onLogin} />
      </div>
    </div>
  );
};