import { Router, Request, Response } from 'express';
import { stripeService } from '../services/stripe.service';

const router = Router();

/**
 * Create payment intent for one-time $5 payment
 * POST /api/payments/create-payment-intent
 */
router.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    // Get authenticated user email from middleware
    const userEmail = (req as any).user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found' });
    }

    console.log('Creating payment intent for:', userEmail);

    // Create payment intent for $5 (500 cents)
    const paymentIntent = await stripeService.createPaymentIntent(
      500, // $5 in cents
      userEmail,
      {
        userEmail,
        planType: 'onetime',
        credits: '5',
      }
    );

    console.log('✅ Payment intent created:', paymentIntent.id);

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('❌ Error creating payment intent:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Create subscription for monthly $20 payment
 * POST /api/payments/create-subscription
 */
router.post('/create-subscription', async (req: Request, res: Response) => {
  try {
    // Get authenticated user email from middleware
    const userEmail = (req as any).user?.email;
    const { priceId } = req.body;

    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found' });
    }

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    console.log('Creating subscription for:', userEmail, 'with price:', priceId);

    // Create subscription
    const subscription = await stripeService.createSubscription(
      userEmail,
      priceId,
      {
        userEmail,
        planType: 'subscription',
        credits: '100',
      }
    );

    // Extract client secret from latest invoice payment intent
    const invoice = subscription.latest_invoice as any;
    const clientSecret = invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
      throw new Error('Failed to get client secret from subscription');
    }

    console.log('✅ Subscription created:', subscription.id);

    return res.json({
      clientSecret,
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error('❌ Error creating subscription:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;

