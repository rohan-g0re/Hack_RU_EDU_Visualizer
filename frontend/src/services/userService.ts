import { supabase } from '../lib/supabase';
import { User, CreditHistory, UseCreditResult } from '../types/payment.types';

export class UserService {
  /**
   * Get user profile with credits
   */
  static async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Get current user's credits
   */
  static async getCurrentUserCredits(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 0;
    }

    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching credits:', error);
      return 0;
    }

    return data?.credits || 0;
  }

  /**
   * Use credits (visualize or regenerate)
   */
  static async useCredits(
    amount: number,
    type: 'visualize' | 'regenerate',
    description?: string,
    metadata?: Record<string, any>
  ): Promise<UseCreditResult> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase.rpc('use_credits', {
      p_user_id: user.id,
      p_amount: -Math.abs(amount), // Always negative for usage
      p_type: type,
      p_description: description || `Used ${amount} credit(s) for ${type}`,
      p_metadata: metadata || {},
    });

    if (error) {
      console.error('Error using credits:', error);
      return { success: false, error: error.message };
    }

    return data as UseCreditResult;
  }

  /**
   * Get credit history for current user
   */
  static async getCreditHistory(limit: number = 50): Promise<CreditHistory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('credit_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching credit history:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Check if user has sufficient credits
   */
  static async hasSufficientCredits(requiredAmount: number): Promise<boolean> {
    const credits = await this.getCurrentUserCredits();
    return credits >= requiredAmount;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<Pick<User, 'full_name' | 'avatar_url'>>): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  }
}
