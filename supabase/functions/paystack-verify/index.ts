import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function formatPrice(amount: number): string {
  return `R${amount.toFixed(2).replace(".", ",")}`;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postal_code: string;
}

async function sendOrderConfirmationEmail(
  email: string,
  customerName: string,
  orderNumber: string,
  items: OrderItem[],
  total: number,
  shippingAddress: ShippingAddress | null
): Promise<void> {
  if (!resendApiKey) {
    console.log('Resend API key not configured, skipping email');
    return;
  }

  const resend = new Resend(resendApiKey);

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
        <strong>${item.name}</strong><br/>
        <span style="color: #666;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  const shippingHtml = shippingAddress ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #f9f9f9; border-radius: 8px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #333;">Shipping Address</h3>
      <p style="margin: 0; color: #666; font-size: 14px;">
        ${shippingAddress.address}<br/>
        ${shippingAddress.city}, ${shippingAddress.postal_code}
      </p>
    </div>
  ` : '';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px;">OUICESTNOUS</h1>
      </div>
      
      <div style="padding: 32px 0;">
        <h2 style="margin: 0 0 8px 0; font-size: 20px;">Order Confirmed!</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Thank you for your order, ${customerName}. We've received your payment and your order is being processed.
        </p>
        
        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Order Number:</strong> ${orderNumber}
          </p>
        </div>

        <h3 style="margin: 0 0 16px 0; font-size: 16px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 16px 12px; font-weight: 600;">Total</td>
            <td style="padding: 16px 12px; text-align: right; font-weight: 600; font-size: 18px;">${formatPrice(total)}</td>
          </tr>
        </table>

        ${shippingHtml}
      </div>

      <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; text-align: center; color: #666; font-size: 12px;">
        <p style="margin: 0 0 8px 0;">Thank you for shopping with us!</p>
        <p style="margin: 0;">© ${new Date().getFullYear()} OUICESTNOUS. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: 'OUICESTNOUS <onboarding@resend.dev>',
      to: [email],
      subject: `Order Confirmed - ${orderNumber}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Order confirmation email sent to:', email);
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
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
      const items: OrderItem[] = metadata.items || [];
      const shippingAddress: ShippingAddress | null = metadata.shipping_address || null;
      
      // Amount from Paystack is in kobo (cents), convert to base currency
      const totalAmount = data.data.amount / 100;
      const orderNumber = generateOrderNumber();
      
      const orderData = {
        order_number: orderNumber,
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
      } else {
        console.log('Order saved successfully:', orderResult.id);
        data.order = orderResult;

        // Send order confirmation email
        await sendOrderConfirmationEmail(
          customerEmail,
          customerName,
          orderNumber,
          items,
          totalAmount,
          shippingAddress
        );
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
