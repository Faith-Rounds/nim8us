import React from 'react';

interface TabNavigationProps {
  activeTab: 'verify' | 'certify';
  onTabChange: (tab: 'verify' | 'certify') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 flex shadow-sm border border-nim-silver-100 mb-6 animate-fade-in">
      <button
        onClick={() => onTabChange('verify')}
        className={`flex-1 py-3 px-6 rounded-full font-medium text-sm transition-all duration-300 ${
          activeTab === 'verify'
            ? 'bg-nim-green-500 text-white shadow-md'
            : 'bg-transparent text-nim-silver-600 hover:bg-nim-green-50'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Verify Image</span>
        </div>
      </button>
      <button
        onClick={() => onTabChange('certify')}
        className={`flex-1 py-3 px-6 rounded-full font-medium text-sm transition-all duration-300 ${
          activeTab === 'certify'
            ? 'bg-nim-orange-500 text-white shadow-md'
            : 'bg-transparent text-nim-silver-600 hover:bg-nim-orange-50'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Certify New Image</span>
        </div>
      </button>
    </div>
  );
};
