
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const CheckAuth = () => {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const authCheckCompletedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple auth checks from running simultaneously
    if (authCheckCompletedRef.current) {
      return;
    }

    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          console.log('User is authenticated:', session.user.email);
          // Set ref to prevent duplicate auth checks
          authCheckCompletedRef.current = true;
          
          // If authenticated, send success message to parent (for embedded contexts)
          window.parent.postMessage({ type: 'AUTH_STATUS', isAuthenticated: true }, '*');
          
          // Force a full page reload to ensure proper state initialization
          if (window !== window.parent) {
            // In embedded context, force reload
            console.log('In embedded context, forcing page reload');
            window.location.reload();
          } else {
            // In direct access context, force reload with a special param to prevent navigation loops
            console.log('In direct context, forcing page reload with refresh param');
            const url = new URL(window.location.href);
            
            // Check if this is already a refresh attempt
            const isRefresh = url.searchParams.get('_auth_refresh');
            
            if (!isRefresh) {
              // Add a refresh parameter and reload
              url.searchParams.set('_auth_refresh', 'true');
              window.location.href = url.toString();
            } else {
              // If already refreshed, just navigate normally
              console.log('Already refreshed, navigating to /en');
              // Remove the refresh param to avoid it showing in the URL unnecessarily
              url.searchParams.delete('_auth_refresh');
              window.history.replaceState({}, '', url.toString());
              navigate('/en');
            }
          }
        } else {
          console.log('No active session found');
          // Set ref to prevent duplicate auth checks
          authCheckCompletedRef.current = true;
          // If not authenticated, redirect to login
          window.parent.postMessage({ type: 'AUTH_STATUS', isAuthenticated: false }, '*');
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Auth check failed:', error);
        
        // Implement retry mechanism
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying auth check (${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prevCount => prevCount + 1);
          return; // Will trigger useEffect again due to state change
        }
        
        // After max retries, show error and redirect
        toast.error('Authentication check failed. Please try again.');
        window.parent.postMessage({ 
          type: 'AUTH_STATUS', 
          isAuthenticated: false, 
          error: error.message || 'Auth check failed' 
        }, '*');
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate, retryCount]);

  return null;
};
