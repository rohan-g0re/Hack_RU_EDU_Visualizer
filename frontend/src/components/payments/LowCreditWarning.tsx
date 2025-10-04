import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface LowCreditWarningProps {
  credits: number;
  onAddCredits: () => void;
  onDismiss: () => void;
}

const LowCreditWarning: React.FC<LowCreditWarningProps> = ({ 
  credits, 
  onAddCredits,
  onDismiss 
}) => {
  if (credits >= 5) return null;

  return (
    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4 animate-slideDown">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-yellow-300 font-semibold mb-1">Low Credit Balance</h3>
          <p className="text-yellow-200/80 text-sm mb-3">
            You have {credits.toFixed(1)} credits remaining. Add more credits to continue creating visualizations.
          </p>
          <button
            onClick={onAddCredits}
            className="px-4 py-2 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white rounded-lg hover:shadow-lg hover:shadow-[#38BDF8]/30 transition-all text-sm font-medium"
          >
            Add Credits
          </button>
        </div>
        <button
          onClick={onDismiss}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default LowCreditWarning;
