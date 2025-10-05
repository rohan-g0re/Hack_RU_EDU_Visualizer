import React from 'react';
import { Menu, X, Brain } from 'lucide-react';
import IconButton from '../common/IconButton';

interface HeaderProps {
  title?: string;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = 'VizKidd',
  isMobileMenuOpen,
  toggleMobileMenu,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">{title}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <IconButton
                icon={isMobileMenuOpen ? <X /> : <Menu />}
                onClick={toggleMobileMenu}
                variant="tertiary"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                className="ml-2"
              />
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <a
                href="#"
                className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Services
              </a>
              <a
                href="#"
                className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Results
              </a>
              <a
                href="#"
                className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                About Us
              </a>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Services
            </a>
            <a
              href="#"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Results
            </a>
            <a
              href="#"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              About Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 