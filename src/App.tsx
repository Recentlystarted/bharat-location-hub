import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Database, 
  Shield, 
  Code, 
  Users, 
  Globe, 
  BookOpen,
  LogIn,
  Settings,
  Home
} from 'lucide-react';
import { StaticLocationService, SimpleAuthService } from './services/staticLocationService';
import logoImage from '/logo.png';
import logoNameImage from '/logo-name.png';

type Page = 'home' | 'login' | 'admin' | 'docs';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<any>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize from URL hash for SPA routing
    const hash = window.location.hash.slice(1) as Page;
    if (['home', 'login', 'admin', 'docs'].includes(hash)) {
      setCurrentPage(hash);
    }

    // Check authentication on page load
    if (SimpleAuthService.isAuthenticated()) {
      setUser(SimpleAuthService.getCurrentUser());
    }

    // Handle browser back/forward
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Page;
      if (['home', 'login', 'admin', 'docs'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Update URL when page changes
    if (window.location.hash.slice(1) !== currentPage) {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const result = SimpleAuthService.login(loginData.email, loginData.password);
      if (result.success) {
        setUser(SimpleAuthService.getCurrentUser());
        setCurrentPage('admin');
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error: any) {
      setLoginError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, email: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, password: e.target.value }));
  };

  const handleLogout = () => {
    SimpleAuthService.logout();
    setUser(null);
    setCurrentPage('home');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const Navigation = () => (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigateTo('home')}
            >
              <img 
                src={logoImage} 
                alt="Bharat Location Hub" 
                className="h-8 w-8"
              />
              {/* <img 
                src={logoNameImage} 
                alt="Bharat Location Hub" 
                className="h-8"
              /> */}
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant={currentPage === 'home' ? 'default' : 'ghost'} 
                onClick={() => navigateTo('home')}
                className="flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
              <Button 
                variant={currentPage === 'docs' ? 'default' : 'ghost'} 
                onClick={() => navigateTo('docs')}
                className="flex items-center space-x-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>API Docs</span>
              </Button>
              {user ? (
                <Button 
                  variant={currentPage === 'admin' ? 'default' : 'ghost'} 
                  onClick={() => navigateTo('admin')}
                  className="flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              ) : (
                <Button 
                  variant={currentPage === 'login' ? 'default' : 'ghost'} 
                  onClick={() => navigateTo('login')}
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
                <Button variant="outline" size="sm" onClick={handleLogout}>
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

  const HomePage = () => {
    const [stats, setStats] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
      // Load stats on component mount
      loadStats();
    }, []);

    const loadStats = async () => {
      try {
        const result = await StaticLocationService.getStats();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    const handleSearch = async () => {
      if (!searchQuery.trim()) return;
      
      setIsSearching(true);
      try {
        const result = await StaticLocationService.searchLocations(searchQuery, 10);
        
        if (result.success) {
          setSearchResults(result.data || []);
        }
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsSearching(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <div className="flex justify-center items-center mb-6">
              <img 
                src={logoNameImage} 
                alt="Bharat Location Hub" 
                className="h-16 md:h-20"
              />
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Complete database of 500,000+ Indian locations with powerful REST API access
            </p>
            
            {/* Search Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Search for any location in India..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 h-12 text-lg"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="h-12 px-8 text-lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-w-4xl mx-auto mb-12">
                <h3 className="text-2xl font-semibold mb-6">Search Results</h3>
                <div className="grid gap-4">
                  {searchResults.map((location, index) => (
                    <Card key={index} className="text-left hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold">{location.villageName}</h4>
                          <Badge variant="secondary">{location.uniqueCode}</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {location.stateName} → {location.districtName} → {location.talukaName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigateTo('docs')} className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Explore API</span>
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigateTo('login')} className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Admin Access</span>
              </Button>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="h-12 w-12 text-primary mb-4" />
                <CardTitle>500K+ Locations</CardTitle>
                <CardDescription>
                  Complete database covering every state, district, taluka, and village in India
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>REST API Access</CardTitle>
                <CardDescription>
                  Easy integration with any web or mobile application using our REST API
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Search</CardTitle>
                <CardDescription>
                  Fast and intelligent search across all locations with real-time results
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with 99.9% uptime guarantee
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Complete management system for adding, editing, and organizing locations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Code className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Developer Friendly</CardTitle>
                <CardDescription>
                  Comprehensive documentation and easy-to-use API endpoints
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

        {/* Statistics Section */}
        {stats && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/10">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-12">Platform Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">{stats.totalStates}</div>
                  <div className="text-muted-foreground">States</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">{stats.totalDistricts}</div>
                  <div className="text-muted-foreground">Districts</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">{stats.totalTalukas}</div>
                  <div className="text-muted-foreground">Talukas</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">{stats.totalVillages?.toLocaleString()}</div>
                  <div className="text-muted-foreground">Villages</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  };  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            {loginError && (
              <div className="text-sm text-destructive">{loginError}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const AdminPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="secondary" className="text-sm">
            Welcome, {user?.email}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Manage States</span>
              </CardTitle>
              <CardDescription>Add, edit, or remove states</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage States</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Manage Districts</span>
              </CardTitle>
              <CardDescription>Add, edit, or remove districts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Districts</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Manage Villages</span>
              </CardTitle>
              <CardDescription>Add, edit, or remove villages</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Villages</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Locations</span>
              </CardTitle>
              <CardDescription>Find and edit any location</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Search & Edit</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>Manage admin users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Users</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Database Stats</span>
              </CardTitle>
              <CardDescription>View database statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Stats</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const DocsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">API Documentation</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Base URL</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="bg-secondary px-4 py-2 rounded text-sm">
                https://recentlystarted.github.io/bharat-location-hub/api
              </code>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">GET /api/states</CardTitle>
                <CardDescription>Get all states in India</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`{
  "states": [
    {
      "name": "Maharashtra",
      "code": "MH",
      "districts": 36
    }
  ]
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">GET /api/states/{'{state}'}/districts</CardTitle>
                <CardDescription>Get all districts in a specific state</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`{
  "state": "Maharashtra",
  "districts": [
    {
      "name": "Mumbai",
      "code": "MUM",
      "talukas": 15
    }
  ]
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">GET /api/search?q={'{query}'}</CardTitle>
                <CardDescription>Search locations by name</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`{
  "query": "mumbai",
  "results": [
    {
      "state": "Maharashtra",
      "district": "Mumbai",
      "taluka": "Mumbai City",
      "village": "Bandra",
      "uniqueCode": "MH-MUM-BAN-A1B2"
    }
  ]
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">GET /api/stats</CardTitle>
                <CardDescription>Get database statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
{`{
  "totalStates": 28,
  "totalDistricts": 640,
  "totalTalukas": 6000,
  "totalVillages": 500000,
  "lastUpdated": "2025-08-27T10:30:00Z"
}`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                All API endpoints are publicly accessible for reading data. 
                Write operations require authentication through the admin panel.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                <strong>Rate Limits:</strong> 1000 requests per hour per IP address
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'admin':
        return user ? <AdminPage /> : <LoginPage />;
      case 'docs':
        return <DocsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="bharat-location-hub-theme">
      <div className="min-h-screen">
        <Navigation />
        {renderCurrentPage()}
      </div>
    </ThemeProvider>
  );
}

export default App;
