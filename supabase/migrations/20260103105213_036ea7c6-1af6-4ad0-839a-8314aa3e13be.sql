-- Add DELETE policy for user_roles table so admins can remove roles
CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));