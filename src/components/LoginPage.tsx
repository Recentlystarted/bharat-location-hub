import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Mail, 
  Shield, 
  Eye, 
  EyeOff,
  User,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { AuthService } from '../services/staticLocationService';
import logoImage from '/logo.png';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setLoginData(prev => ({ ...prev, email }));
    setError(''); // Clear error on input change
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setLoginData(prev => ({ ...prev, password }));
    setError(''); // Clear error on input change
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = AuthService.login(loginData.email, loginData.password);
      if (result.success) {
        const user = AuthService.getCurrentUser();
        onLoginSuccess(user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error: any) {
      setError('Login failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-xs text-muted-foreground text-center">
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
