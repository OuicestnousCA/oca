-- Fix insecure RLS policy on orders table
-- Remove the email-based access which allows impersonation attacks

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Create a secure policy that only uses user_id authentication
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);