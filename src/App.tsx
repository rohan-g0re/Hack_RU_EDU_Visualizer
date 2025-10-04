// src/App.tsx
import React, { useState, useEffect } from 'react';
import { X, Menu, X as Close, Brain } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ConceptProvider, useConceptContext } from './contexts/ConceptContext';
import { VoiceProvider, useVoiceContext } from './contexts/VoiceContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ExpandedVisualization from './components/common/ExpandedVisualization';
import LandingPage from './components/LandingPage';
import InputTab from './components/InputTab';
import VisualizationTab from './components/VisualizationTab';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import backgroundImage from './assets/landing_page_background.jpg';
import { ToastProvider, useToast } from './contexts/ToastContext';
import UserMenu from './components/auth/UserMenu';
import CreditDisplay from './components/payments/CreditDisplay';
import PaymentModal from './components/payments/PaymentModal';
import { PAYMENT_PLANS } from './constants/payments';

function AppContent() {
  // Get state and handlers from contexts
  const {
    error,
    activeTab,
    statusMessage,
    mobileMenuOpen,
    setMobileMenuOpen,
    showConfirmModal,
    confirmCallback,
    setShowConfirmModal,
    isExpandedView,
    setIsExpandedView,
    showLandingPage,
    setShowLandingPage
  } = useAppContext();
  
  const {
    handleNewVisualization
  } = useConceptContext();

  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Auth modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // State for landing page section scrolling
  const [scrollToSection, setScrollToSection] = useState<string | undefined>(undefined);

  // Use keyboard shortcuts
  useKeyboardShortcuts();

  // Function to handle redirect from landing page to main app
  const handleVisualizeNowClick = () => {
    setShowLandingPage(false);
  };

  // Functions to handle navigation links
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!showLandingPage) {
      setShowLandingPage(true);
      setScrollToSection('hero');
    } else {
      setScrollToSection('hero');
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!showLandingPage) {
      setShowLandingPage(true);
      setScrollToSection('services');
    } else {
      setScrollToSection('services');
    }
  };

  const handleResultsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!showLandingPage) {
      setShowLandingPage(true);
      setScrollToSection('results');
    } else {
      setScrollToSection('results');
    }
  };

  // Auth handlers
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignupModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to landing page after logout
      setShowLandingPage(true);
      showToast('Successfully logged out', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Failed to log out', 'error');
    }
  };

  // Handle visualize click - only proceed if authenticated
  const handleVisualizeFromLanding = () => {
    if (user) {
      setShowLandingPage(false);
    } else {
      // This shouldn't happen now, but just in case
      setShowLoginModal(true);
    }
  };

  // Handle payment selection
  const handleSelectPlan = async (planId: 'subscription' | 'onetime') => {
    showToast('Payment integration coming soon!', 'info');
    // TODO: Integrate Stripe Checkout
    setShowPaymentModal(false);
  };

  // If landing page is active, show it instead of the main app
  if (showLandingPage) {
    return (
      <>
        <LandingPage 
          onVisualizeClick={handleVisualizeFromLanding}
          scrollToRef={scrollToSection}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
        />
        {showLoginModal && (
          <LoginPage
            onSwitchToSignup={() => {
              setShowLoginModal(false);
              setShowSignupModal(true);
            }}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        {showSignupModal && (
          <SignupPage
            onSwitchToLogin={() => {
              setShowSignupModal(false);
              setShowLoginModal(true);
            }}
            onClose={() => setShowSignupModal(false)}
          />
        )}
      </>
    );
  }

  // Main app - only accessible when authenticated
  // Redirect to landing if not authenticated
  if (!user && !showLandingPage) {
    setShowLandingPage(true);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-['Manrope'] relative">
      {/* Header to match landing page exactly */}
      {activeTab === 'input' && (
        <header className="py-4 px-6 md:px-12 sticky top-0 z-50 bg-[#0A192F]/80 backdrop-blur-md border-b border-blue-800/20">
          <div className="w-full mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Nous.AI</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" onClick={handleHomeClick} className="text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#" onClick={handleServicesClick} className="text-white/80 hover:text-white transition-colors">Services</a>
              <a href="#" onClick={handleResultsClick} className="text-white/80 hover:text-white transition-colors">Results</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">About Us</a>
            </nav>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <CreditDisplay 
                    onAddCreditsClick={() => setShowPaymentModal(true)}
                    showAddButton={true}
                  />
                  <UserMenu 
                    onLogout={handleLogout}
                    onProfileClick={() => {
                      // TODO: Navigate to profile
                      showToast('Profile coming soon!', 'info');
                    }}
                    onSavedVisualizationsClick={() => {
                      // TODO: Navigate to saved visualizations
                      showToast('Saved visualizations coming soon!', 'info');
                    }}
                    onCreditHistoryClick={() => {
                      // TODO: Navigate to credit history
                      showToast('Credit history coming soon!', 'info');
                    }}
                  />
                </>
              ) : (
                <>
                  <a href="#" onClick={handleLoginClick} className="text-white/90 hover:text-white font-medium transition-colors">Log In</a>
                  <a href="#" onClick={handleSignupClick} className="px-4 py-2 bg-white text-[#0A0E17] font-semibold rounded-full hover:bg-white/90 transition-colors">Sign Up</a>
                </>
              )}
            </div>
            
            <button className="md:hidden text-white/90" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>
      )}
      
      {/* Mobile menu - enhanced with aesthetic styling */}
      {mobileMenuOpen && activeTab === 'input' && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute top-16 right-0 p-4 w-64 bg-[#112240] border border-blue-800/30 shadow-xl rounded-bl-xl animate-slideIn">
            <nav className="flex flex-col space-y-2 mb-4">
              <a href="#" onClick={(e) => { handleHomeClick(e); setMobileMenuOpen(false); }} className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">Home</a>
              <a href="#" onClick={(e) => { handleServicesClick(e); setMobileMenuOpen(false); }} className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">Services</a>
              <a href="#" onClick={(e) => { handleResultsClick(e); setMobileMenuOpen(false); }} className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">Results</a>
              <a href="#" className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">About Us</a>
            </nav>
          </div>
        </div>
      )}

      {/* Custom confirm modal with enhanced 3D aesthetics */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#112240] rounded-xl shadow-2xl border border-blue-800/30 max-w-md w-full p-6 animate-fade-in transform transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(56,189,248,0.15)]">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm New Visualization</h3>
            <p className="text-gray-300 mb-6">
              This visualization will be lost. Do you want to proceed?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-[#0A192F] hover:bg-[#1E3A5F] rounded-lg transition-colors text-gray-300 border border-blue-800/30"
              >
                Cancel
              </button>
              <button
                onClick={confirmCallback}
                className="px-4 py-2 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white rounded-lg hover:shadow-lg hover:shadow-[#38BDF8]/20 transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      {showLoginModal && (
        <LoginPage
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      {showSignupModal && (
        <SignupPage
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          onClose={() => setShowSignupModal(false)}
        />
      )}

      <main className="flex-1 relative bg-[#0A192F] min-h-screen">
        {/* Background patterns and effects - enhanced with more blur - matching landing page */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Background image with blur - centered */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[15px] transform translate-y-[-5%]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          
          {/* Background darkening layer */}
          <div className="absolute inset-0 bg-[#0A0E17] opacity-80"></div>
          
          {/* Vignette effect from landing page */}
          <div className="absolute inset-0 bg-vignette"></div>
          
          {/* Background subtle gradient with more blur */}
          <div className="absolute top-[10%] left-[10%] w-[50%] h-[60%] bg-blue-700 rounded-full mix-blend-multiply filter blur-[200px] opacity-15"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-purple-700 rounded-full mix-blend-multiply filter blur-[200px] opacity-15"></div>
          
          {/* Background pattern with more opacity for subtle effect */}
          <div className="absolute h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgzMnYzMkgweicvPjxwYXRoIGQ9J00yNCA1LjE1OWEuNDk1LjQ5NSAwIDAgMC0uNDc5LS4xMjdsLTE2Ljg5IDMuOTg2YS41NS41NSAwIDAgMC0uMjg2LjE5LjUzNC41MzQgMCAwIDAtLjExLjMwMmwtLjA2MyA1LjUyYS41MjcuNTI3IDAgMCAwIC4yMjIuNDUuNjIuNjIgMCAwIDAgLjI4Ni4wOTUuNzEuNzEgMCAwIDAgLjIwNi0uMDMybDUuNTU2LTEuOTM3djMuNzczbC0xLjI3LjcxNWEuNTQ3LjU0NyAwIDAgMC0uMjU0LjMyNy41MjcuNTI3IDAgMCAwIC4wMzIuNDA2Yy4xMjcuMjIyLjQxMy4yODYuNjM1LjE1OGwxLjY1LS45MTcgMS42NTEuOTE3YS42My42MyAwIDAgMCAuMjg2LjA2NC41Mi41MiAwIDAgMCAuMzQ5LS4xOWMuMDYzLS4wNjMuMTI3LS4xNTkuMTI3LS4yNTRhLjU3OS41NzkgMCAwIDAtLjAzMi0uMjIyLjU0Mi41NDIgMCAwIDAtLjI1My0uMzI3bC0xLjI3LS43MTV2LTIuOTIzbDcuMTQzLTIuNDkxLjAxOSA0LjM1YS41NDMuNTQzIDAgMCAwIC4yMjIuNDVjLjA5NS42My4xODkuMDk1LjI4Ni4wOTVhLjcxLjcxIDAgMCAwIC4yMDYtLjAzMmw1LjU1Ni0xLjkzN2EuNTQ3LjU0NyAwIDAgMCAuMjg2LS4xOS41MTQuNTE0IDAgMCAwIC4xMS0uMzAybC0uMDMyLTUuNjEzYS40OTUuNDk1IDAgMCAwLS4xOS0uMzQ5ek03Ljc0NiAxMS4xMzVsNi4wNjctMS40MjlWMTQuNTlsLTYuMDY3IDIuMTI3di01LjU4MnptMTYuNDEgMy4wNDlsLTQuNTQuMDk1LjA2My0zLjk1NSA0LjU0MS0xLjY1MXY1LjUxMXonIGZpbGw9J2N1cnJlbnRDb2xvcicgb3BhY2l0eT0nMC4xJy8+PC9zdmc+')] opacity-20"></div>
          
          {/* Additional subtle dot pattern for texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMTIyNDQwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNDRCN0YiIG9wYWNpdHk9IjAuMyI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-20 pointer-events-none"></div>
        </div>
        
        <div className="w-full p-0 pb-16 relative z-10">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl m-4 shadow-md backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {statusMessage && (
            <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] p-4 rounded-xl m-4 shadow-md animate-pulse">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#38BDF8] animate-spin flex-shrink-0">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                <p>{statusMessage}</p>
              </div>
            </div>
          )}

          {activeTab === 'input' ? (
            <InputTab />
          ) : (
            <VisualizationTab onNewVisualization={handleNewVisualization} />
          )}
        </div>
      </main>

      {/* Expanded Visualization Modal */}
      <ExpandedVisualization
        isOpen={isExpandedView}
        onClose={() => setIsExpandedView(false)}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}

function App() {
  // Check for landing page view in localStorage to persist across refreshes
  const [initialLandingPageState, setInitialLandingPageState] = useState(true);
  
  useEffect(() => {
    const hasVisitedMain = localStorage.getItem('hasVisitedMain');
    if (hasVisitedMain === 'true') {
      setInitialLandingPageState(false);
    }
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <AppProvider initialShowLandingPage={initialLandingPageState} onVisitedMain={() => localStorage.setItem('hasVisitedMain', 'true')}>
          <ConceptProvider>
            <VoiceProvider>
              <AppContent />
            </VoiceProvider>
          </ConceptProvider>
        </AppProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;