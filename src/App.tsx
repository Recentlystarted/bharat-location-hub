import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import './App.css';

// Import all page components
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import DocsPage from './components/DocsPage';
import AdminPanel from './components/AdminPanel';
import Navigation from './components/Navigation';

// Import services
import { LocationService, AuthService } from './services/staticLocationService';

type Page = 'home' | 'login' | 'admin' | 'docs';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initialize location service
    LocationService.initialize();

    // Check authentication status
    const isLoggedIn = AuthService.isAuthenticated();
    const currentUser = AuthService.getCurrentUser();
    
    if (isLoggedIn && currentUser) {
      setUser(currentUser);
    }

    // Handle URL hash routing only on initial load
    const handleInitialRoute = () => {
      const hashPage = window.location.hash.slice(1) as Page;
      let targetPage: Page = 'home';

      if (['home', 'login', 'admin', 'docs'].includes(hashPage)) {
        if (isLoggedIn) {
          targetPage = hashPage === 'login' ? 'admin' : hashPage;
        } else {
          targetPage = hashPage === 'admin' ? 'login' : hashPage;
        }
      } else {
        // If no valid hash, use default based on authentication
        targetPage = 'home';
      }

      setCurrentPage(targetPage);
      // Only update hash if it's different from the target
      if (window.location.hash.slice(1) !== targetPage) {
        window.location.hash = targetPage;
      }
    };

    handleInitialRoute();

    // Listen for hash changes (browser navigation)
    const handleHashChange = () => {
      const newHashPage = window.location.hash.slice(1) as Page;
      const userIsLoggedIn = AuthService.isAuthenticated();
      
      // Only handle valid page hashes
      if (['home', 'login', 'admin', 'docs'].includes(newHashPage)) {
        if (userIsLoggedIn) {
          if (newHashPage === 'login') {
            // Redirect authenticated users from login to admin
            setCurrentPage('admin');
            window.location.hash = 'admin';
          } else {
            setCurrentPage(newHashPage);
          }
        } else {
          if (newHashPage === 'admin') {
            // Redirect unauthenticated users from admin to login
            setCurrentPage('login');
            window.location.hash = 'login';
          } else {
            setCurrentPage(newHashPage);
          }
        }
      }
      // Ignore invalid hashes - don't redirect to home
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    const targetPage = page as Page;
    const isLoggedIn = AuthService.isAuthenticated();
    
    // Validate navigation based on authentication
    if (targetPage === 'admin' && !isLoggedIn) {
      setCurrentPage('login');
      window.location.hash = 'login';
      return;
    }
    
    if (targetPage === 'login' && isLoggedIn) {
      setCurrentPage('admin');
      window.location.hash = 'admin';
      return;
    }
    
    setCurrentPage(targetPage);
    window.location.hash = targetPage;
  };

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    setCurrentPage('admin');
    window.location.hash = 'admin';
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setCurrentPage('home');
    window.location.hash = 'home';
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'admin':
        return user ? <AdminPanel onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'docs':
        return <DocsPage />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="bharat-location-hub-theme">
      <div className="min-h-screen">
        <Navigation 
          currentPage={currentPage}
          user={user}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
        {renderCurrentPage()}
      </div>
    </ThemeProvider>
  );
}

export default App;