-- Fix security issues found in scan

-- 1. Prevent anonymous users from reading newsletter subscribers (protect email harvesting)
CREATE POLICY "Only admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Explicitly deny anonymous users from reading orders
CREATE POLICY "Deny anonymous order viewing"
ON public.orders
FOR SELECT
TO anon
USING (false);

-- 3. Allow public to view inventory (for product availability display)
CREATE POLICY "Public can view inventory"
ON public.inventory
FOR SELECT
TO anon, authenticated
USING (true);

-- 4. Allow newsletter subscribers to unsubscribe themselves (by setting is_active = false)
-- This requires authenticated users with matching email
CREATE POLICY "Users can manage their subscription"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (email = (auth.jwt() ->> 'email'))
WITH CHECK (email = (auth.jwt() ->> 'email'));