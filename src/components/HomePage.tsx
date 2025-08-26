import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Database, 
  Shield, 
  Code, 
  Users, 
  Globe
} from 'lucide-react';
import { LocationService } from '../services/staticLocationService';
import logoNameImage from '/logo-name.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await LocationService.getStats();
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
      const result = await LocationService.searchLocations(searchQuery, 10);
      
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
            Complete database of 500,000+ Indian locations with powerful API access
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
            <Button size="lg" onClick={() => onNavigate('docs')} className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Explore API</span>
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('login')} className="flex items-center space-x-2">
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
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Easy integration with any web or mobile application using our API
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
}
