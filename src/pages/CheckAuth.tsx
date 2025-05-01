
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
          // If authenticated, send success message to parent
          window.parent.postMessage({ type: 'AUTH_STATUS', isAuthenticated: true }, '*');
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
