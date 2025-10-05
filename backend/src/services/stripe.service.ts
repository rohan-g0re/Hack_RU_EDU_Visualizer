import Stripe from 'stripe';
import { config } from '../config/env.config';

// Initialize Stripe with secret key
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2024-11-20.acacia',
});

export const stripeService = {
  /**
   * Create a Stripe customer with email
   */
  createCustomer: async (email: string, metadata?: Record<string, string>) => {
    return await stripe.customers.create({
      email,
      metadata,
    });
  },

  /**
   * Create a PaymentIntent for one-time payment
   * @param amount - Amount in cents (e.g., 500 for $5)
   * @param email - Customer email
   * @param metadata - Additional metadata for tracking
   */
  createPaymentIntent: async (
    amount: number,
    email: string,
    metadata: Record<string, string>
  ) => {
    // Create customer first
    const customer = await stripe.customers.create({ email });

    // Create payment intent
    return await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customer.id,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email,
    });
  },

  /**
   * Create a subscription for recurring payments
   * @param email - Customer email
   * @param priceId - Stripe Price ID for the subscription
   * @param metadata - Additional metadata for tracking
   */
  createSubscription: async (
    email: string,
    priceId: string,
    metadata: Record<string, string>
  ) => {
    // Create customer first
    const customer = await stripe.customers.create({ email });

    // Create subscription
    return await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata,
    });
  },

  /**
   * Verify webhook signature and construct event
   * @param body - Raw request body
   * @param signature - Stripe signature header
   * @param secret - Webhook signing secret
   */
  constructWebhookEvent: (
    body: Buffer,
    signature: string,
    secret: string
  ): Stripe.Event => {
    return stripe.webhooks.constructEvent(body, signature, secret);
  },

  /**
   * Get Stripe SDK instance for advanced operations
   */
  getStripe: () => stripe,
};

