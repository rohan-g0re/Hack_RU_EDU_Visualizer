import React, { useState } from 'react';
import { Brain, Mail, Lock, User, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin, onClose }) => {
  const { signUp, loading, error, clearError } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email, password, fullName);
      
      // Show success message
      setShowSuccess(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Signup error:', err);
      showToast('Failed to create account. Please try again.', 'error');
      // Error is handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  // Success state
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="relative bg-[#112240] rounded-2xl shadow-2xl border border-green-500/30 max-w-md w-full p-8 animate-fadeIn">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Account Created!</h3>
            <p className="text-gray-300 mb-4">
              Welcome to VizKidd! Please check your email to verify your account.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative bg-[#112240] rounded-2xl shadow-2xl border border-blue-800/30 max-w-md w-full p-8 my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Brain className="h-10 w-10 text-[#38BDF8] mr-3" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] via-[#64B5F6] to-[#8DEBFF]">
            Join VizKidd
          </h2>
        </div>

        {/* Error Message */}
        {displayError && !displayError.includes('check your email') && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3 animate-slideDown">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{displayError}</p>
          </div>
        )}

        {/* Info Message (email confirmation) */}
        {displayError && displayError.includes('check your email') && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-start gap-3 animate-slideDown">
            <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-400 text-sm">{displayError}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0A192F] border border-blue-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                placeholder="John Doe"
                disabled={isSubmitting}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0A192F] border border-blue-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0A192F] border border-blue-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={isSubmitting}
                autoComplete="new-password"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0A192F] border border-blue-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={isSubmitting}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#38BDF8]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-blue-800/30"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-blue-800/30"></div>
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#38BDF8] hover:text-[#64B5F6] font-semibold transition-colors"
              disabled={isSubmitting}
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
