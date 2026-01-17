import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.22.4";

const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas for payment initialization
const itemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive().max(1000),
  price: z.number().positive().max(10000000),
  size: z.string().max(50).optional(),
  image: z.string().max(500).optional(),
});

const shippingAddressSchema = z.object({
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  postal_code: z.string().max(20).optional(),
});

const metadataSchema = z.object({
  customer_name: z.string().min(1).max(200),
  customer_email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  shipping_address: shippingAddressSchema,
  items: z.array(itemSchema).min(1).max(100),
  // Honeypot field for bot detection - should always be empty
  honeypot: z.string().max(0).optional(),
});

const paymentInitSchema = z.object({
  email: z.string().email().max(255),
  amount: z.number().positive().max(10000000), // Max 100,000 in base currency
  callback_url: z.string().url().max(500),
  metadata: metadataSchema,
});

// Sanitize string to prevent XSS
function sanitizeString(str: string): string {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

// Sanitize object recursively
function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj) as T;
  if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item)) as T;
  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeString(key)] = sanitizeObject(value);
    }
    return sanitized as T;
  }
  return obj;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input using zod schema
    const validationResult = paymentInitSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          details: validationResult.error.errors.map(e => e.message).join(', ')
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validated = validationResult.data;
    
    // Honeypot check - if this field has any value, it's likely a bot
    if (validated.metadata.honeypot) {
      console.log('[SECURITY] Bot detected via honeypot field');
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize all string data
    const sanitizedData = sanitizeObject(validated);

    // Amount should be in kobo (smallest currency unit)
    const amountInKobo = Math.round(sanitizedData.amount * 100);

    // Audit logging for security monitoring
    console.log('[AUDIT] Payment initialization:', {
      email: sanitizedData.email,
      amount: amountInKobo,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || 'unknown',
      itemCount: sanitizedData.metadata.items.length,
    });

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: sanitizedData.email,
        amount: amountInKobo,
        metadata: sanitizedData.metadata,
        callback_url: sanitizedData.callback_url,
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
