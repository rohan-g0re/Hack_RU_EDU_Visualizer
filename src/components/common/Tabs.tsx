import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
}) => {
  // Base styles for all tabs
  const baseTabStyles = 'flex items-center py-2 px-4 font-medium text-sm focus:outline-none transition';
  
  // Variant specific styles
  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 -mb-px',
      active: 'text-blue-600 border-blue-600',
      inactive: 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300',
      disabled: 'text-gray-300 border-transparent cursor-not-allowed'
    },
    pills: {
      container: 'flex space-x-1',
      tab: 'rounded-md',
      active: 'bg-blue-100 text-blue-700',
      inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
      disabled: 'text-gray-300 cursor-not-allowed'
    },
    underline: {
      container: '',
      tab: 'border-b-2',
      active: 'text-blue-600 border-blue-600',
      inactive: 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300',
      disabled: 'text-gray-300 border-transparent cursor-not-allowed'
    }
  };
  
  // Width styles
  const widthStyle = fullWidth ? 'flex-1 justify-center' : '';
  
  return (
    <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyles[variant].container} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            ${baseTabStyles}
            ${variantStyles[variant].tab}
            ${tab.disabled 
              ? variantStyles[variant].disabled 
              : tab.id === activeTab 
                ? variantStyles[variant].active 
                : variantStyles[variant].inactive
            }
            ${widthStyle}
          `}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          role="tab"
          aria-selected={tab.id === activeTab}
          tabIndex={tab.id === activeTab ? 0 : -1}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs; 