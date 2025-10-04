import React, { useEffect, useState } from 'react';
import { Coins, Loader, Plus } from 'lucide-react';
import { UserService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

interface CreditDisplayProps {
  onAddCreditsClick?: () => void;
  showAddButton?: boolean;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ 
  onAddCreditsClick,
  showAddButton = true 
}) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredits();
    
    // Refresh credits every 30 seconds
    const interval = setInterval(loadCredits, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const loadCredits = async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      const userCredits = await UserService.getCurrentUserCredits();
      setCredits(userCredits);
    } catch (error) {
      console.error('Error loading credits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const isLowCredits = credits !== null && credits < 5;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
        isLowCredits 
          ? 'bg-yellow-900/20 border-yellow-500/30' 
          : 'bg-[#112240] border-blue-800/30'
      }`}>
        <Coins className={`h-4 w-4 ${isLowCredits ? 'text-yellow-400' : 'text-[#38BDF8]'}`} />
        {loading ? (
          <Loader className="h-4 w-4 animate-spin text-gray-400" />
        ) : (
          <span className={`font-semibold text-sm ${
            isLowCredits ? 'text-yellow-300' : 'text-white'
          }`}>
            {credits?.toFixed(1) || '0'} credits
          </span>
        )}
      </div>

      {showAddButton && onAddCreditsClick && (
        <button
          onClick={onAddCreditsClick}
          className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white rounded-lg hover:shadow-lg hover:shadow-[#38BDF8]/30 transition-all text-sm font-medium"
          title="Add credits"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      )}
    </div>
  );
};

export default CreditDisplay;
