import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  onLogout: () => void;
  onProfileClick?: () => void;
  onSavedVisualizationsClick?: () => void;
  onCreditHistoryClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, onProfileClick }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Get user initials for avatar
  const getInitials = () => {
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#112240] border border-blue-800/30 rounded-full hover:bg-[#1E3A5F] transition-all duration-200 group"
      >
        {/* Avatar Circle */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] flex items-center justify-center text-white font-semibold text-sm">
          {getInitials()}
        </div>
        
        {/* User Email (hidden on mobile) */}
        <span className="hidden md:inline text-white/90 text-sm max-w-[150px] truncate">
          {user.email}
        </span>
        
        {/* Chevron Icon */}
        <ChevronDown 
          className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#112240] border border-blue-800/30 rounded-xl shadow-2xl overflow-hidden animate-slideDown z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-blue-800/30 bg-gradient-to-br from-[#112240] to-[#0A192F]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] flex items-center justify-center text-white font-bold text-lg">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                {user.user_metadata?.full_name && (
                  <p className="text-white font-semibold truncate">
                    {user.user_metadata.full_name}
                  </p>
                )}
                <p className="text-gray-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-2">
            {onProfileClick && (
              <button
                onClick={() => {
                  onProfileClick();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:bg-[#1E3A5F] hover:text-white transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile Settings</span>
              </button>
            )}
            
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#0A192F] border-t border-blue-800/30">
            <p className="text-gray-500 text-xs text-center">
              Nous.AI © 2025
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
