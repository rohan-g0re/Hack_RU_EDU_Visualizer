import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export type CenteredModalType = 'success' | 'error' | 'info';

interface CenteredModalProps {
  message: string;
  type: CenteredModalType;
  onClose: () => void;
  duration?: number;
}

const CenteredModal: React.FC<CenteredModalProps> = ({ message, type, onClose, duration = 1000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-400" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-400" />;
      case 'info':
        return <AlertCircle className="h-12 w-12 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/30';
      case 'error':
        return 'bg-red-900/20 border-red-500/30';
      case 'info':
        return 'bg-blue-900/20 border-blue-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className={`${getStyles()} border rounded-2xl p-8 shadow-2xl backdrop-blur-sm flex flex-col items-center gap-4 max-w-md w-full animate-fadeIn`}>
        <div className="flex justify-center">
          {getIcon()}
        </div>
        <p className="text-white text-lg font-medium text-center">{message}</p>
      </div>
    </div>
  );
};

export default CenteredModal;
