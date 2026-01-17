import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.22.4";

const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas for order data
const itemSchema = z.object({
  id: z.union([z.number(), z.string()]).transform(val => Number(val)),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive().max(1000),
  price: z.number().positive().max(10000000),
  size: z.string().max(50).optional(),
  image: z.string().max(500).optional(),
});

const addressSchema = z.object({
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postal_code: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
}).nullable().optional();

const orderDataSchema = z.object({
  customer_email: z.string().email().max(255),
  customer_name: z.string().min(1).max(200).default('Guest'),
  customer_phone: z.string().max(20).nullable().optional(),
  items: z.array(itemSchema).min(1).max(100),
  shipping_address: addressSchema,
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Sanitize string to prevent XSS (remove script tags and event handlers)
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
    const { reference } = await req.json();

    if (!reference || typeof reference !== 'string' || reference.length > 100) {
      console.error('Invalid transaction reference');
      return new Response(
        JSON.stringify({ error: 'Valid transaction reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize the reference to prevent injection
    const sanitizedReference = reference.replace(/[^a-zA-Z0-9_-]/g, '');
    
    console.log(`Verifying Paystack transaction: ${sanitizedReference}`);

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(sanitizedReference)}`, {
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
      const rawCustomerEmail = data.data.customer?.email || metadata.customer_email;
      const rawCustomerName = metadata.customer_name || 'Guest';
      const rawCustomerPhone = metadata.phone || null;
      const rawItems = metadata.items || [];
      const rawShippingAddress = metadata.shipping_address || null;
      
      // Validate and sanitize the order data
      const validationResult = orderDataSchema.safeParse({
        customer_email: rawCustomerEmail,
        customer_name: rawCustomerName,
        customer_phone: rawCustomerPhone,
        items: rawItems,
        shipping_address: rawShippingAddress,
      });

      if (!validationResult.success) {
        console.error('Order data validation failed:', validationResult.error.errors);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid order data received',
            details: validationResult.error.errors.map(e => e.message).join(', ')
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Sanitize validated data to prevent XSS
      const validatedData = sanitizeObject(validationResult.data);
      
      // Amount from Paystack is in kobo (cents), convert to base currency
      const totalAmount = data.data.amount / 100;
      
      const orderData = {
        order_number: generateOrderNumber(),
        customer_email: validatedData.customer_email,
        customer_name: validatedData.customer_name,
        customer_phone: validatedData.customer_phone || null,
        items: validatedData.items,
        subtotal: totalAmount,
        shipping_cost: 0,
        tax: 0,
        total: totalAmount,
        status: 'confirmed',
        payment_status: 'completed',
        payment_reference: sanitizedReference,
        payment_provider: 'paystack',
        shipping_address: validatedData.shipping_address || null,
      };

      console.log('Saving validated order to database');

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
        
        // Send order confirmation email
        try {
          const emailPayload = {
            customerEmail: validatedData.customer_email,
            customerName: validatedData.customer_name,
            orderNumber: orderData.order_number,
            items: validatedData.items,
            total: totalAmount,
            shippingAddress: validatedData.shipping_address,
          };
          
          const emailResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-order-confirmation`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify(emailPayload),
            }
          );
          
          if (emailResponse.ok) {
            console.log('Order confirmation email sent successfully');
          } else {
            const emailError = await emailResponse.text();
            console.error('Failed to send order confirmation email:', emailError);
          }
        } catch (emailError) {
          console.error('Error sending order confirmation email:', emailError);
          // Don't fail the payment verification if email fails
        }
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
