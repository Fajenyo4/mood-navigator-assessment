
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, LogIn, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { loginTranslations } from '@/translations/loginTranslations';
import { AVAILABLE_LANGUAGES } from '@/constants/languages';

interface LoginProps {
  language?: string;
}

const Login = ({ language = 'en' }: LoginProps) => {
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use the language prop to determine translations
  const selectedLanguage = language || 'en';
  const t = loginTranslations[selectedLanguage as keyof typeof loginTranslations] || loginTranslations.en;

  // Store the selected language in localStorage
  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    if (user && !authLoading) {
      window.parent.postMessage({ type: 'AUTH_SUCCESS', user: user.email }, '*');
      navigate(`/${selectedLanguage.toLowerCase()}`);
    }
  }, [user, authLoading, navigate, selectedLanguage]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (isSignUp && !name) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        toast.success("Account created! Please check your email to verify your account.");
        setEmail('');
        setPassword('');
        setName('');
      } else {
        await signIn('email', email, password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = "Authentication failed. Please try again.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email before logging in.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Try logging in instead.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{isSignUp ? t.createAccount : t.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <select 
                className="text-sm bg-transparent border-none cursor-pointer focus:ring-0 p-0"
                value={selectedLanguage}
                onChange={(e) => {
                  const newLang = e.target.value;
                  navigate(`/login/${newLang.toLowerCase()}`);
                }}
              >
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <CardDescription>
            {isSignUp ? t.signUpToTake : t.loginToContinue}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              {isSignUp && (
                <Input
                  type="text"
                  placeholder={t.fullName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  disabled={isLoading}
                  autoComplete="name"
                />
              )}
              <Input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email || !password || (isSignUp && !name)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? t.createAccountButton : t.loginButton}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {isSignUp ? t.createAccountButton : t.loginButton}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}
            </Button>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>{t.troubleLogging}</p>
              <Button
                type="button"
                variant="ghost"
                className="text-sm p-0 h-auto"
                onClick={() => {
                  toast.info(t.contactSupport);
                }}
              >
                {t.forgotPassword}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
