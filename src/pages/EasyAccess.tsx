
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EasyAccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const lang = searchParams.get('lang') || 'en';
        const view = searchParams.get('view');

        if (!token || !email) {
          toast.error('Invalid access link');
          navigate('/login');
          return;
        }

        const response = await fetch('https://thvtgvvwksbxywhdnwcv.functions.supabase.co/verify-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token })
        });

        if (!response.ok) {
          throw new Error('Access validation failed');
        }

        const { session } = await response.json();

        // Set the session in Supabase
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });

        // Navigate to the appropriate view based on the view parameter
        if (view === 'history') {
          navigate(`/history-chart?lang=${lang}`);
        } else {
          navigate(`/${lang}`);
        }
      } catch (error) {
        console.error('Access validation error:', error);
        toast.error('Failed to validate access');
        navigate('/login');
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [searchParams, navigate]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default EasyAccess;
