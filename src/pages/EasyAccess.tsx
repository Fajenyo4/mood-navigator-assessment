
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
        const lang = searchParams.get('lang') || 'en';
        const view = searchParams.get('view');

        console.log("EasyAccess: Validating access with params:", { 
          token: token ? (token.substring(0, 10) + "...") : "missing",
          lang, 
          view 
        });

        if (!token) {
          console.error("No token provided in URL");
          toast.error('Invalid access link');
          navigate('/login');
          return;
        }

        // Create a unique anonymous email for this session
        const anonymousEmail = `anonymous-${Date.now()}@temp.com`;
        const randomPassword = crypto.randomUUID();

        console.log("EasyAccess: Creating anonymous session with", anonymousEmail);

        // For public access, we create an anonymous session
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: anonymousEmail,
          password: randomPassword,
        });

        if (signUpError || !signUpData.session) {
          console.error('Failed to create anonymous session:', signUpError);
          
          // Try sign in as fallback - the user might exist already
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: anonymousEmail,
            password: randomPassword,
          });
          
          if (signInError || !signInData.session) {
            console.error('Failed to sign in as anonymous user:', signInError);
            throw new Error('Failed to create anonymous session');
          }
          
          // Use the session from sign in
          await supabase.auth.setSession({
            access_token: signInData.session.access_token,
            refresh_token: signInData.session.refresh_token
          });
        } else {
          // Set the session in Supabase
          await supabase.auth.setSession({
            access_token: signUpData.session.access_token,
            refresh_token: signUpData.session.refresh_token
          });
        }

        console.log('EasyAccess: Anonymous session created successfully');

        // Navigate to the appropriate view based on the view parameter
        if (view === 'history') {
          console.log(`EasyAccess: Navigating to history chart with language: ${lang}`);
          navigate(`/history-chart?lang=${lang}`);
        } else {
          console.log(`EasyAccess: Navigating to assessment with language: ${lang}`);
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
          <p className="text-gray-600">Loading history chart...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default EasyAccess;
