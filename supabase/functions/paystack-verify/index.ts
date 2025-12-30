import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
  name: string;
  quantity: number;
  price: number;
}

async function sendOrderConfirmationEmail(
  email: string,
  customerName: string,
  orderNumber: string,
  items: OrderItem[],
  total: number
): Promise<void> {
  if (!resendApiKey) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const resend = new Resend(resendApiKey);

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 4px; margin: 0;">OUICESTNOUS</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 10px; font-size: 24px; font-weight: 400;">Thank you for your order!</h2>
        <p style="margin: 0; color: #666;">Hi ${customerName}, your order has been confirmed.</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p style="margin: 0 0 5px;"><strong>Order Number:</strong> ${orderNumber}</p>
        <p style="margin: 0; color: #666;">Keep this number for your records.</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 12px; text-align: left; font-weight: 500;">Item</th>
            <th style="padding: 12px; text-align: center; font-weight: 500;">Qty</th>
            <th style="padding: 12px; text-align: right; font-weight: 500;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; font-weight: 600;">Total</td>
            <td style="padding: 12px; text-align: right; font-weight: 600;">${formatPrice(total)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="background: #f9f9f9; padding: 20px; text-align: center;">
        <p style="margin: 0 0 10px; color: #666;">You will receive another email when your order ships.</p>
        <p style="margin: 0; color: #999; font-size: 14px;">If you have any questions, please contact our support team.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="margin: 0; color: #999; font-size: 12px;">© ${new Date().getFullYear()} OUICESTNOUS. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  try {
    const emailResponse = await resend.emails.send({
      from: 'OUICESTNOUS <onboarding@resend.dev>',
      to: [email],
      subject: `Order Confirmation - ${orderNumber}`,
      html,
    });
    console.log('Order confirmation email sent:', emailResponse);
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError);
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
      const items = metadata.items || [];
      const shippingAddress = metadata.shipping_address || null;
      
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
          totalAmount
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
