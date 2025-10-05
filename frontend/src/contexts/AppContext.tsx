import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppContextType {
  // Tab state
  activeTab: 'input' | 'visualization';
  setActiveTab: (tab: 'input' | 'visualization') => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error state
  error: string;
  setError: (error: string) => void;
  
  // Status message
  statusMessage: string;
  setStatusMessage: (message: string) => void;
  
  // Modal state
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  confirmCallback: () => void;
  setConfirmCallback: (callback: () => void) => void;
  
  // Mobile menu state
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Text formatting
  isFormatting: boolean;
  setIsFormatting: (formatting: boolean) => void;
  formattedText: string;
  setFormattedText: (text: string) => void;
  
  // Input text
  inputText: string;
  setInputText: (text: string) => void;
  
  // Expanded view state
  isExpandedView: boolean;
  setIsExpandedView: (expanded: boolean) => void;
  
  // Landing page state
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
  
  // About page state
  showAboutPage: boolean;
  setShowAboutPage: (show: boolean) => void;
  
  // Reset application state
  resetAppState: () => void;
}

interface AppProviderProps {
  children: ReactNode;
  initialShowLandingPage?: boolean;
  onVisitedMain?: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ 
  children, 
  initialShowLandingPage = true,
  onVisitedMain
}: AppProviderProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<'input' | 'visualization'>('input');
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Error state
  const [error, setError] = useState<string>('');
  
  // Status message
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Text formatting
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [formattedText, setFormattedText] = useState<string>('');
  
  // Input text
  const [inputText, setInputText] = useState<string>('');
  
  // Expanded view state
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false);
  
  // Landing page state
  const [showLandingPage, setShowLandingPage] = useState<boolean>(initialShowLandingPage);
  
  // About page state
  const [showAboutPage, setShowAboutPage] = useState<boolean>(false);
  
  // Call onVisitedMain when landing page is hidden
  useEffect(() => {
    if (!showLandingPage && onVisitedMain) {
      onVisitedMain();
    }
  }, [showLandingPage, onVisitedMain]);
  
  // Reset application state
  const resetAppState = () => {
    setInputText('');
    setFormattedText('');
    setError('');
    setStatusMessage('');
    setActiveTab('input');
    setIsExpandedView(false);
  };
  
  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isLoading,
        setIsLoading,
        error,
        setError,
        statusMessage,
        setStatusMessage,
        showConfirmModal,
        setShowConfirmModal,
        confirmCallback,
        setConfirmCallback,
        mobileMenuOpen,
        setMobileMenuOpen,
        isFormatting,
        setIsFormatting,
        formattedText,
        setFormattedText,
        inputText,
        setInputText,
        isExpandedView,
        setIsExpandedView,
        showLandingPage,
        setShowLandingPage,
        showAboutPage,
        setShowAboutPage,
        resetAppState
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 