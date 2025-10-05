import { Router, Request, Response } from 'express';
import { stripeService } from '../services/stripe.service';
import { config } from '../config/env.config';
import Stripe from 'stripe';

const router = Router();

/**
 * Stripe webhook endpoint
 * POST /api/stripe/webhook
 * 
 * IMPORTANT: This route must use raw body parser (express.raw)
 */
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('❌ No stripe-signature header found');
    return res.status(400).send('No stripe-signature header');
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripeService.constructWebhookEvent(
      req.body,
      sig,
      config.stripe.webhookSecret
    );
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔔 Webhook received:', event.type);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ ONE-TIME PAYMENT SUCCEEDED!');
        console.log('   Payment ID:', paymentIntent.id);
        console.log('   Amount:', paymentIntent.amount / 100, 'USD');
        console.log('   Customer Email:', paymentIntent.receipt_email);
        console.log('   Metadata:', paymentIntent.metadata);
        console.log('   Status:', paymentIntent.status);
        console.log('');
        console.log('📝 TODO Phase 2: Add', paymentIntent.metadata.credits, 'credits to user account');
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ PAYMENT FAILED');
        console.log('   Payment ID:', failedIntent.id);
        console.log('   Amount:', failedIntent.amount / 100, 'USD');
        console.log('   Customer Email:', failedIntent.receipt_email);
        console.log('   Last Error:', failedIntent.last_payment_error?.message);
        break;

      case 'invoice.paid':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('✅ SUBSCRIPTION INVOICE PAID!');
        console.log('   Invoice ID:', invoice.id);
        console.log('   Amount:', invoice.amount_paid / 100, 'USD');
        console.log('   Customer Email:', invoice.customer_email);
        console.log('   Subscription ID:', invoice.subscription);
        console.log('   Billing Reason:', invoice.billing_reason);
        console.log('');
        console.log('📝 TODO Phase 2: Add 100 credits to user account');
        console.log('📝 TODO Phase 2: Update subscription status to "active"');
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('❌ SUBSCRIPTION PAYMENT FAILED');
        console.log('   Invoice ID:', failedInvoice.id);
        console.log('   Customer Email:', failedInvoice.customer_email);
        console.log('   Subscription ID:', failedInvoice.subscription);
        console.log('   Attempt Count:', failedInvoice.attempt_count);
        break;

      case 'customer.subscription.created':
        const createdSub = event.data.object as Stripe.Subscription;
        console.log('🎉 SUBSCRIPTION CREATED!');
        console.log('   Subscription ID:', createdSub.id);
        console.log('   Status:', createdSub.status);
        console.log('   Customer ID:', createdSub.customer);
        console.log('   Current Period End:', new Date(createdSub.current_period_end * 1000));
        console.log('');
        console.log('📝 TODO Phase 2: Store subscription ID in user account');
        break;

      case 'customer.subscription.updated':
        const updatedSub = event.data.object as Stripe.Subscription;
        console.log('📝 SUBSCRIPTION UPDATED');
        console.log('   Subscription ID:', updatedSub.id);
        console.log('   Status:', updatedSub.status);
        console.log('   Cancel at period end:', updatedSub.cancel_at_period_end);
        console.log('   Current Period End:', new Date(updatedSub.current_period_end * 1000));
        console.log('');
        console.log('📝 TODO Phase 2: Update subscription status in database');
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as Stripe.Subscription;
        console.log('❌ SUBSCRIPTION CANCELLED/DELETED');
        console.log('   Subscription ID:', deletedSub.id);
        console.log('   Status:', deletedSub.status);
        console.log('   Ended At:', deletedSub.ended_at ? new Date(deletedSub.ended_at * 1000) : 'N/A');
        console.log('');
        console.log('📝 TODO Phase 2: Update subscription status to "cancelled"');
        break;

      default:
        console.log('ℹ️  Unhandled event type:', event.type);
    }
  } catch (error: any) {
    console.error('❌ Error processing webhook:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router;

