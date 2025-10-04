export const PAYMENT_PLANS = {
  SUBSCRIPTION: {
    id: 'subscription',
    name: 'Monthly Subscription',
    description: 'Best value - 100 credits per month',
    price: 20.00,
    priceDisplay: '$20/month',
    credits: 100,
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_SUBSCRIPTION || 'price_subscription',
    popular: true,
  },
  ONETIME: {
    id: 'onetime',
    name: 'Credit Pack',
    description: 'Pay as you go',
    price: 5.00,
    priceDisplay: '$5',
    credits: 5,
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_ONETIME || 'price_onetime',
    popular: false,
  },
} as const;

export const CREDIT_COSTS = {
  VISUALIZE: 1,
  REGENERATE: 0.5,
} as const;

export const CREDIT_WARNINGS = {
  LOW_CREDIT_THRESHOLD: 5, // Show warning when credits below this
  NO_CREDIT_THRESHOLD: 0,
} as const;
