export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'active' | 'cancelled' | 'past_due' | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditHistory {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  type: CreditTransactionType;
  stripe_payment_id: string | null;
  amount_paid_cents: number | null;
  description: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export type CreditTransactionType =
  | 'subscription_payment'
  | 'onetime_payment'
  | 'visualize'
  | 'regenerate'
  | 'refund';

export interface UseCreditResult {
  success: boolean;
  error?: string;
  transaction_id?: string;
  old_balance?: number;
  new_balance?: number;
  current_balance?: number;
  required?: number;
}
