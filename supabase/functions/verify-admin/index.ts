import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

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
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[AUDIT] Admin verification attempted without auth token');
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'No authorization token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Validate the token and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);

    if (claimsError || !claimsData?.user) {
      console.log('[AUDIT] Admin verification failed - invalid token');
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.user.id;
    const userEmail = claimsData.user.email;

    // Check if user has admin role using the user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError) {
      console.error('[ERROR] Failed to check admin role:', roleError);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Failed to verify admin status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isAdmin = !!roleData;

    // Audit logging for security monitoring
    console.log('[AUDIT] Admin verification:', {
      userId,
      email: userEmail,
      isAdmin,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return new Response(
      JSON.stringify({ 
        isAdmin,
        userId,
        verifiedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ERROR] Error in verify-admin function:', error);
    return new Response(
      JSON.stringify({ isAdmin: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
