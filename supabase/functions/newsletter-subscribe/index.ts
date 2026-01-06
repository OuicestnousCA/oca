import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

const sendWelcomeEmail = async (email: string): Promise<void> => {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured, skipping welcome email");
    return;
  }

  const resend = new Resend(resendApiKey);

  try {
    const { error } = await resend.emails.send({
      from: "Oui C'est Nous <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Oui C'est Nous! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px;">
                      <h1 style="margin: 0 0 20px; font-size: 28px; font-weight: bold; color: #111827; text-align: center;">
                        Welcome to the Family! 🎉
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 20px;">
                      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #374151;">
                        Thank you for subscribing to our newsletter! You're now part of the Oui C'est Nous community.
                      </p>
                      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #374151;">
                        As a subscriber, you'll be the first to know about:
                      </p>
                      <ul style="margin: 0 0 16px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #374151;">
                        <li>New collection drops</li>
                        <li>Exclusive discounts</li>
                        <li>Behind-the-scenes content</li>
                        <li>Special promotions</li>
                      </ul>
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
                        Stay tuned for exciting updates!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px 40px;">
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td align="center">
                            <a href="https://ouicestnous.ca" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                              Shop Now
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f3f4f6; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280; text-align: center;">
                        Follow us on <a href="https://www.instagram.com/ouicestnousca/" style="color: #111827; text-decoration: underline;">Instagram</a> for daily inspiration.
                      </p>
                      <p style="margin: 12px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
                        © ${new Date().getFullYear()} Oui C'est Nous. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
    } else {
      console.log("Welcome email sent successfully to:", email);
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterRequest = await req.json();

    // Validate email
    if (!email || typeof email !== "string") {
      console.error("Invalid email provided");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Attempting to subscribe email:", email);

    // Insert subscriber
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.toLowerCase().trim() })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === "23505") {
        console.log("Email already subscribed:", email);
        return new Response(
          JSON.stringify({ message: "You're already subscribed!", alreadySubscribed: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Successfully subscribed:", email);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email.toLowerCase().trim());

    return new Response(
      JSON.stringify({ message: "Successfully subscribed!", data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
