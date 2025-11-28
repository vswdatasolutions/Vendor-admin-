import React from 'react';
import { constants } from '../../constants.ts';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${constants.colors.PRIMARY}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;