
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // If authenticated, send success message to parent
          window.parent.postMessage({ type: 'AUTH_STATUS', isAuthenticated: true }, '*');
        } else {
          // If not authenticated, redirect to login
          window.parent.postMessage({ type: 'AUTH_STATUS', isAuthenticated: false }, '*');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.parent.postMessage({ type: 'AUTH_STATUS', isAuthenticated: false, error: 'Auth check failed' }, '*');
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Return null as this is just a check component
  return null;
};
