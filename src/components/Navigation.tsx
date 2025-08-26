import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen,
  LogIn,
  Settings,
  Home
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import logoImage from '/logo.png';

interface NavigationProps {
  currentPage: string;
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Navigation({ currentPage, user, onNavigate, onLogout }: NavigationProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              <img 
                src={logoImage} 
                alt="Bharat Location Hub" 
                className="h-8 w-8"
              />
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant={currentPage === 'home' ? 'default' : 'ghost'} 
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
              <Button 
                variant={currentPage === 'docs' ? 'default' : 'ghost'} 
                onClick={() => onNavigate('docs')}
                className="flex items-center space-x-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>API Docs</span>
              </Button>
              {user ? (
                <Button 
                  variant={currentPage === 'admin' ? 'default' : 'ghost'} 
                  onClick={() => onNavigate('admin')}
                  className="flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              ) : (
                <Button 
                  variant={currentPage === 'login' ? 'default' : 'ghost'} 
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <Badge variant="secondary">{user.email}</Badge>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
