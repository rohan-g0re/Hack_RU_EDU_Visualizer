import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-400 flex-shrink-0" />;
      case 'info':
        return <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/40 border-green-500/50 shadow-green-500/20';
      case 'error':
        return 'bg-red-900/40 border-red-500/50 shadow-red-500/20';
      case 'info':
        return 'bg-blue-900/40 border-blue-500/50 shadow-blue-500/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-50';
      case 'error':
        return 'text-red-50';
      case 'info':
        return 'text-blue-50';
    }
  };

  return (
    <div 
      className={`${getStyles()} ${getTextColor()} border-2 rounded-xl p-5 shadow-2xl backdrop-blur-md flex items-center gap-4 min-w-[400px] max-w-[600px] animate-slideDown`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {getIcon()}
      <p className="text-base font-medium flex-1 leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-white transition-colors flex-shrink-0 p-1 hover:bg-white/10 rounded-lg"
        aria-label="Close notification"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
