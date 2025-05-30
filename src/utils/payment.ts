
import { supabase } from "@/integrations/supabase/client";

export const createStripeCheckoutSession = async (userId: string) => {
  try {
    // For now, we'll use the direct payment link but with user metadata
    // In a full implementation, we'd create a checkout session with user_id in metadata
    const paymentUrl = new URL('https://buy.stripe.com/test_3cI5kF6Ns9rM0fY8fAbQY00');
    paymentUrl.searchParams.set('client_reference_id', userId);
    
    return { url: paymentUrl.toString() };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const handleInsufficientCredits = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }
  
  return createStripeCheckoutSession(user.id);
};
