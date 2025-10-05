import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastType } from '../components/common/Toast';
import CenteredModal, { CenteredModalType } from '../components/common/CenteredModal';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  showCenteredModal: (message: string, type: CenteredModalType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

interface CenteredModalState {
  message: string;
  type: CenteredModalType;
  id: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [centeredModals, setCenteredModals] = useState<CenteredModalState[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  };

  const showCenteredModal = (message: string, type: CenteredModalType) => {
    const id = Date.now();
    setCenteredModals(prev => [...prev, { message, type, id }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeCenteredModal = (id: number) => {
    setCenteredModals(prev => prev.filter(modal => modal.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showCenteredModal }}>
      {children}
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ top: `${1 + index * 5}rem` }}
          className="fixed right-4 z-[100]"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
      {centeredModals.map((modal) => (
        <CenteredModal
          key={modal.id}
          message={modal.message}
          type={modal.type}
          onClose={() => removeCenteredModal(modal.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};
