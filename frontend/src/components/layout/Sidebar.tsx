import React from 'react';
import { FileText, Globe, Book, Brain } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

interface SidebarProps {
  items?: SidebarItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

const defaultItems: SidebarItem[] = [
  {
    id: 'file',
    label: 'File Upload',
    icon: <FileText className="h-5 w-5" />,
    onClick: () => {},
    isActive: true
  },
  {
    id: 'web',
    label: 'Web URL',
    icon: <Globe className="h-5 w-5" />,
    onClick: () => {}
  },
  {
    id: 'concepts',
    label: 'Concepts',
    icon: <Brain className="h-5 w-5" />,
    onClick: () => {}
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: <Book className="h-5 w-5" />,
    onClick: () => {}
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  items = defaultItems,
  isOpen = true,
  onClose
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="bg-gray-50 border-r border-gray-200 w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0">
      <div className="h-full flex flex-col">
        {/* Mobile close button */}
        {onClose && (
          <div className="px-4 py-3 flex items-center justify-between md:hidden">
            <h2 className="text-lg font-medium text-gray-900">Menu</h2>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close panel</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Logo */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">VizKidd</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              className={`
                ${item.isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                group w-full flex items-center px-4 py-2 text-sm font-medium rounded-md
              `}
              onClick={item.onClick}
            >
              <span className={`${item.isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'} mr-3`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <span className="mr-2">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </span>
            Settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 