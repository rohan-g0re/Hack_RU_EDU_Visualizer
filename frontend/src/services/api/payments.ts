import { apiClient } from './apiClient';

export interface PaymentIntentResponse {
  clientSecret: string;
}

export interface SubscriptionResponse {
  clientSecret: string;
  subscriptionId: string;
}

export const paymentsApi = {
  /**
   * Create a payment intent for one-time $5 payment
   */
  createPaymentIntent: async (): Promise<PaymentIntentResponse> => {
    const response = await apiClient.post('/api/payments/create-payment-intent', {
      planType: 'onetime',
    });
    return response.data;
  },

  /**
   * Create a subscription for monthly $20 payment
   * @param priceId - Stripe Price ID for the subscription
   */
  createSubscription: async (priceId: string): Promise<SubscriptionResponse> => {
    const response = await apiClient.post('/api/payments/create-subscription', {
      planType: 'subscription',
      priceId,
    });
    return response.data;
  },
};

