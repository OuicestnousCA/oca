-- Add database constraints to newsletter_subscribers table for defense in depth
-- These constraints validate data even if direct database access occurs

-- Ensure email follows valid format
ALTER TABLE public.newsletter_subscribers 
ADD CONSTRAINT newsletter_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Ensure email has reasonable length
ALTER TABLE public.newsletter_subscribers 
ADD CONSTRAINT newsletter_email_length 
CHECK (char_length(email) >= 5 AND char_length(email) <= 255);

-- Add unique constraint if not already present (prevents duplicate subscriptions)
ALTER TABLE public.newsletter_subscribers 
ADD CONSTRAINT newsletter_email_unique UNIQUE (email);