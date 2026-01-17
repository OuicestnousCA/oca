import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AdminCheckResult {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  verifyServerSide: () => Promise<boolean>;
}

export const useAdminCheck = (): AdminCheckResult => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side verification function that can be called on demand
  const verifyServerSide = useCallback(async (): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('verify-admin', {
        body: {},
      });

      if (invokeError) {
        console.error('[Security] Server-side admin verification failed:', invokeError);
        setError(invokeError.message);
        return false;
      }

      const serverIsAdmin = data?.isAdmin === true;
      setIsAdmin(serverIsAdmin);
      
      if (!serverIsAdmin) {
        console.log('[Security] User is not admin according to server verification');
      }
      
      return serverIsAdmin;
    } catch (err) {
      console.error('[Security] Error during server-side admin verification:', err);
      setError(err instanceof Error ? err.message : 'Verification failed');
      return false;
    }
  }, [user]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setError(null);
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // First do a quick client-side check for UI responsiveness
        const { data: clientData, error: clientError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (clientError) {
          console.error("[Security] Client-side admin check error:", clientError);
          setError(clientError.message);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const clientIsAdmin = !!clientData;
        
        // If client-side check says admin, verify with server
        if (clientIsAdmin) {
          // Set optimistically for UI, then verify
          setIsAdmin(true);
          
          // Perform server-side verification in background
          const serverVerified = await verifyServerSide();
          
          if (!serverVerified) {
            // Server disagrees - update state
            console.warn('[Security] Server verification failed - revoking admin access');
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("[Security] Error checking admin status:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkAdminStatus();
  }, [user, verifyServerSide]);

  return { isAdmin, loading, error, verifyServerSide };
};
