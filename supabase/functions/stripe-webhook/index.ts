
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    console.log('Received webhook from Stripe');

    let event;
    try {
      // For now, we'll parse the event directly since we don't have webhook signing set up yet
      event = JSON.parse(body);
      console.log('Webhook event type:', event.type);
    } catch (err) {
      console.error('Error parsing webhook body:', err);
      return new Response('Invalid payload', { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      
      console.log('Processing completed checkout for:', customerEmail);

      if (!customerEmail) {
        console.error('No customer email found in session');
        return new Response('No customer email', { status: 400 });
      }

      // Find the user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', customerEmail)
        .single();

      if (userError || !user) {
        console.error('User not found for email:', customerEmail);
        return new Response('User not found', { status: 404 });
      }

      console.log('Found user:', user.id);

      // Add 100 credits to the user's account
      const newCredits = user.credits + 100;
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          credits: newCredits,
          stripe_customer_id: session.customer 
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating user credits:', updateError);
        return new Response('Error updating credits', { status: 500 });
      }

      console.log('Successfully added 100 credits to user. New balance:', newCredits);

      // Create or update subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_subscription_id: session.subscription || session.id,
          plan_name: '$20/month Plan',
          credits_per_month: 100,
          status: 'active'
        }, { onConflict: 'user_id' });

      if (subscriptionError) {
        console.error('Error updating subscription:', subscriptionError);
      } else {
        console.log('Successfully updated subscription record');
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
});
