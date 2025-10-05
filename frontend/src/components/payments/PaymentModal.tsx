import React, { useState } from 'react';
import { X, Check, Loader, Coins, Zap, Crown, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PAYMENT_PLANS } from '../../constants/payments';
import { paymentsApi } from '../../services/api/payments';
import { useToast } from '../../contexts/ToastContext';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: 'subscription' | 'onetime') => void;
}

// Checkout Form Component
const CheckoutForm: React.FC<{
  planName: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
  onBack: () => void;
}> = ({ planName, onSuccess, onError, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.origin,
        },
      });

      setIsProcessing(false);

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setIsProcessing(false);
      onError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#112240] border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{planName}</h3>
        <p className="text-gray-400 text-sm mb-6">Enter your payment details below</p>
        
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-3 bg-[#1E3A5F] text-white rounded-lg font-semibold hover:bg-[#2A4A6F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Plans
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 py-3 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#38BDF8]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
      </div>

      <p className="text-center text-gray-500 text-xs">
        🔒 Payments are securely processed by Stripe
      </p>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<'subscription' | 'onetime' | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: 'subscription' | 'onetime') => {
    setSelectedPlan(planId);
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (planId === 'onetime') {
        response = await paymentsApi.createPaymentIntent();
      } else {
        const priceId = PAYMENT_PLANS.SUBSCRIPTION.stripePriceId;
        response = await paymentsApi.createSubscription(priceId);
      }

      setClientSecret(response.clientSecret);
      setShowPaymentForm(true);
    } catch (err: any) {
      console.error('Error creating payment:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to initialize payment';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    showToast('Payment successful! Your credits will be added shortly.', 'success');
    setShowPaymentForm(false);
    setClientSecret(null);
    setSelectedPlan(null);
    onClose();
    
    // Call the original onSelectPlan callback
    if (selectedPlan) {
      onSelectPlan(selectedPlan);
    }
  };

  const handlePaymentError = (msg: string) => {
    setError(msg);
    showToast(msg, 'error');
  };

  const handleBackToPlans = () => {
    setShowPaymentForm(false);
    setClientSecret(null);
    setSelectedPlan(null);
    setError(null);
  };

  const plans = [
    {
      ...PAYMENT_PLANS.SUBSCRIPTION,
      icon: Crown,
      features: [
        '100 credits per month',
        'Best value - $0.20 per credit',
        'Auto-renewal',
        'Cancel anytime',
      ],
    },
    {
      ...PAYMENT_PLANS.ONETIME,
      icon: Zap,
      features: [
        '5 credits one-time',
        'No commitment',
        'Never expires',
        'Add more anytime',
      ],
    },
  ];

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#38BDF8',
      colorBackground: '#112240',
      colorText: '#FFFFFF',
      colorDanger: '#EF4444',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '8px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(56, 189, 248, 0.3)',
        backgroundColor: '#0A192F',
        color: '#FFFFFF',
      },
      '.Input:focus': {
        borderColor: '#38BDF8',
        boxShadow: '0 0 0 2px rgba(56, 189, 248, 0.2)',
      },
      '.Label': {
        color: '#CBD5E1',
        fontWeight: '500',
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A192F] rounded-2xl shadow-2xl border border-blue-800/30 max-w-4xl w-full p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] via-[#64B5F6] to-[#8DEBFF]">
              {showPaymentForm ? 'Complete Payment' : 'Choose Your Plan'}
            </h2>
            <p className="text-gray-400 mt-2">
              {showPaymentForm 
                ? 'Enter your payment details securely' 
                : 'Select the best option for your needs'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && !showPaymentForm && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
            <p className="font-semibold">Payment Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Payment Form or Plan Selection */}
        {showPaymentForm && clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance,
            }}
          >
            <CheckoutForm
              planName={
                selectedPlan === 'onetime'
                  ? PAYMENT_PLANS.ONETIME.name
                  : PAYMENT_PLANS.SUBSCRIPTION.name
              }
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onBack={handleBackToPlans}
            />
          </Elements>
        ) : (
          <>
            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                const isPopular = plan.popular;

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-[#112240] border rounded-2xl p-6 transition-all duration-300 ${
                      isPopular
                        ? 'border-[#38BDF8] shadow-lg shadow-[#38BDF8]/20'
                        : 'border-blue-800/30 hover:border-blue-700/50'
                    }`}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white text-xs font-bold rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isPopular
                            ? 'bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF]'
                            : 'bg-[#1E3A5F]'
                        }`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Plan Details */}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">{plan.priceDisplay}</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Coins className="h-4 w-4 text-[#38BDF8]" />
                        <span className="text-gray-300">{plan.credits} credits</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Select Button */}
                    <button
                      onClick={() => handleSelectPlan(plan.id as 'subscription' | 'onetime')}
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white hover:shadow-lg hover:shadow-[#38BDF8]/30'
                          : 'bg-[#1E3A5F] text-white hover:bg-[#2A4A6F] border border-blue-700/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSelected && isLoading ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Select Plan'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="text-center text-gray-500 text-sm">
              <p>Secure payment powered by Stripe</p>
              <p className="mt-1">1 credit = 1 visualization • 0.5 credits = 1 regeneration</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
