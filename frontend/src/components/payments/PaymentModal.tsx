import React, { useState } from 'react';
import { X, Check, Loader, Coins, Zap, Crown } from 'lucide-react';
import { PAYMENT_PLANS } from '../../constants/payments';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: 'subscription' | 'onetime') => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<'subscription' | 'onetime' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: 'subscription' | 'onetime') => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    try {
      await onSelectPlan(planId);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A192F] rounded-2xl shadow-2xl border border-blue-800/30 max-w-4xl w-full p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] via-[#64B5F6] to-[#8DEBFF]">
              Choose Your Plan
            </h2>
            <p className="text-gray-400 mt-2">Select the best option for your needs</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            disabled={isProcessing}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isPopular 
                      ? 'bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF]' 
                      : 'bg-[#1E3A5F]'
                  }`}>
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
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white hover:shadow-lg hover:shadow-[#38BDF8]/30'
                      : 'bg-[#1E3A5F] text-white hover:bg-[#2A4A6F] border border-blue-700/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSelected && isProcessing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Processing...
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
      </div>
    </div>
  );
};

export default PaymentModal;


