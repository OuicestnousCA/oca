import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderConfirmationRequest {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, orderNumber, items, total, shippingAddress }: OrderConfirmationRequest = await req.json();

    console.log(`Sending order confirmation to ${customerEmail} for order ${orderNumber}`);

    const itemsHtml = items.map((item: OrderItem) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.name}${item.size ? ` (${item.size})` : ''}${item.color ? ` - ${item.color}` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #111827; margin: 0 0 8px 0; font-size: 24px;">Order Confirmed! 🎉</h1>
                <p style="color: #6b7280; margin: 0;">Thank you for your purchase</p>
              </div>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${customerName},
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                We've received your order and it's being processed. Here are your order details:
              </p>
              
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #374151;"><strong>Order Number:</strong> ${orderNumber}</p>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #374151;">Item</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #374151;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #374151;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 16px 12px; text-align: right; font-weight: bold; color: #111827;">Total:</td>
                    <td style="padding: 16px 12px; text-align: right; font-weight: bold; color: #111827; font-size: 18px;">₦${total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
              
              ${shippingAddress ? `
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold;">Shipping Address:</p>
                  <p style="margin: 0; color: #6b7280;">${shippingAddress}</p>
                </div>
              ` : ''}
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                We'll send you another email when your order ships. If you have any questions, feel free to reply to this email.
              </p>
              
              <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                  Thank you for shopping with us!
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Orders <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Order Confirmed - ${orderNumber}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending order confirmation:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
