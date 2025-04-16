
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';

const Login = () => {
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both email and password",
      });
      return;
    }

    if (isSignUp && !name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your name",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
        setEmail('');
        setPassword('');
        setName('');
      } else {
        await signIn('email', email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Authentication failed. Please try again.",
      });
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
          <CardTitle>{isSignUp ? 'Create Account' : 'Login'}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Sign up to take the assessment'
              : 'Login to continue to the assessment'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              {isSignUp && (
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  disabled={isLoading}
                  autoComplete="name"
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder="Password"
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
                  {isSignUp ? 'Creating Account...' : 'Logging In...'}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {isSignUp ? 'Create Account' : 'Login'}
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
              {isSignUp 
                ? 'Already have an account? Login' 
                : "Don't have an account? Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
