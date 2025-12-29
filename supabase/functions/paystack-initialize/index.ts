import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, amount, metadata, callback_url } = await req.json();

    if (!email || !amount) {
      console.error('Missing required fields: email or amount');
      return new Response(
        JSON.stringify({ error: 'Email and amount are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Amount should be in kobo (smallest currency unit)
    const amountInKobo = Math.round(amount * 100);

    console.log(`Initializing Paystack transaction for ${email}, amount: ${amountInKobo} kobo`);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        metadata,
        callback_url,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Paystack API error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to initialize transaction' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transaction initialized successfully:', data.data.reference);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in paystack-initialize function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
