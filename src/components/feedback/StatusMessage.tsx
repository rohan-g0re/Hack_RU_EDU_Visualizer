import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type StatusType = 'info' | 'success' | 'warning' | 'error';

interface StatusMessageProps {
  message: string;
  type?: StatusType;
  onClose?: () => void;
  className?: string;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  type = 'info',
  onClose,
  className = '',
  autoDismiss = false,
  autoDismissTimeout = 5000,
}) => {
  // If there's no message, don't render anything
  if (!message) return null;
  
  // Handle auto-dismiss
  React.useEffect(() => {
    if (autoDismiss && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismissTimeout);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDismissTimeout, onClose, message]);
  
  // Color and icon mappings
  const styles = {
    info: {
      icon: <Info className="h-5 w-5 text-blue-400" />,
      container: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      closeButton: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50'
    },
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      container: 'bg-green-50 border-green-200',
      text: 'text-green-700',
      closeButton: 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
    },
    warning: {
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
      container: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-700',
      closeButton: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50'
    },
    error: {
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
      container: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      closeButton: 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
    }
  };
  
  return (
    <div className={`border rounded-md p-4 ${styles[type].container} ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {styles[type].icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${styles[type].text}`}>{message}</p>
        </div>
        {onClose && (
          <div className="pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${styles[type].closeButton} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={onClose}
                aria-label="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusMessage; 