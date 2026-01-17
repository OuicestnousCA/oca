-- Add database constraints to orders table for defense in depth
-- These constraints validate data even if direct database access bypasses the edge function

-- Ensure order_number follows expected pattern
ALTER TABLE public.orders 
ADD CONSTRAINT order_number_format 
CHECK (order_number ~ '^ORD-[A-Z0-9]+-[A-Z0-9]{4}$');

-- Ensure reasonable total amounts (max 10 million in base currency)
ALTER TABLE public.orders 
ADD CONSTRAINT total_amount_reasonable 
CHECK (total >= 0 AND total <= 10000000);

-- Ensure subtotal is non-negative
ALTER TABLE public.orders 
ADD CONSTRAINT subtotal_non_negative 
CHECK (subtotal >= 0);

-- Ensure shipping cost is non-negative
ALTER TABLE public.orders 
ADD CONSTRAINT shipping_cost_non_negative 
CHECK (shipping_cost >= 0);

-- Ensure tax is non-negative
ALTER TABLE public.orders 
ADD CONSTRAINT tax_non_negative 
CHECK (tax >= 0);

-- Ensure items array is not empty for valid orders
ALTER TABLE public.orders 
ADD CONSTRAINT items_not_empty 
CHECK (jsonb_array_length(items) > 0);

-- Ensure customer_email is a valid format
ALTER TABLE public.orders 
ADD CONSTRAINT customer_email_format 
CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Ensure customer_name is not empty and reasonable length
ALTER TABLE public.orders 
ADD CONSTRAINT customer_name_valid 
CHECK (char_length(customer_name) >= 1 AND char_length(customer_name) <= 200);

-- Update has_role function with explicit NULL checks for paranoid validation
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Explicit NULL checks for security
  IF _user_id IS NULL OR _role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Main role check logic
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;