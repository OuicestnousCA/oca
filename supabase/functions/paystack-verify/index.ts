import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();

    if (!reference) {
      console.error('Missing transaction reference');
      return new Response(
        JSON.stringify({ error: 'Transaction reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying Paystack transaction: ${reference}`);

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Paystack verification error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to verify transaction' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transaction verification result:', data.data.status);

    // If payment was successful, save the order to the database
    if (data.data?.status === 'success') {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const metadata = data.data.metadata || {};
      const customerEmail = data.data.customer?.email || metadata.customer_email;
      const customerName = metadata.customer_name || 'Guest';
      const customerPhone = metadata.phone || null;
      const items = metadata.items || [];
      const shippingAddress = metadata.shipping_address || null;
      
      // Amount from Paystack is in kobo (cents), convert to base currency
      const totalAmount = data.data.amount / 100;
      
      const orderData = {
        order_number: generateOrderNumber(),
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items,
        subtotal: totalAmount,
        shipping_cost: 0,
        tax: 0,
        total: totalAmount,
        status: 'confirmed',
        payment_status: 'completed',
        payment_reference: reference,
        payment_provider: 'paystack',
        shipping_address: shippingAddress,
      };

      console.log('Saving order to database:', orderData);

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Error saving order:', orderError);
        // Still return success for payment, but log the order save error
      } else {
        console.log('Order saved successfully:', orderResult.id);
        // Add order info to the response
        data.order = orderResult;
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in paystack-verify function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
