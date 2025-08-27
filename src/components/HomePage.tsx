import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Database, 
  Code, 
  Globe, 
  TrendingUp,
  Zap,
  ArrowRight,
  Star
} from 'lucide-react';
import { LocationService, type Location } from '../services/staticLocationService';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({ states: 0, districts: 0, talukas: 0, villages: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await LocationService.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    loadStats();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await LocationService.searchLocations(searchQuery, 8);
      if (response.success && response.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const popularSearches = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 text-foreground">
              Bharat Location Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Complete REST API for Indian geographical data. Access 500,000+ locations 
              from villages to states with intelligent search and hierarchical navigation.
            </p>
            
            {/* Interactive Search */}
            <div className="bg-background p-6 rounded-lg border shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search any location in India..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="text-lg py-3"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  size="lg"
                  className="px-8"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {/* Popular Searches */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(search);
                      // Auto-search popular items
                      LocationService.searchLocations(search, 8).then(response => {
                        if (response.success && response.data) {
                          setSearchResults(response.data);
                        }
                      });
                    }}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-6 p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-3 text-foreground">Search Results</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {searchResults.slice(0, 6).map((result, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded border">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground truncate">{result.villageName}</div>
                          <div className="text-sm text-muted-foreground">{result.talukaName}, {result.districtName}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {result.stateName}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {searchResults.length > 6 && (
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      +{searchResults.length - 6} more results...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Comprehensive Geographic Coverage
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">{stats.states}</CardTitle>
                  <CardDescription>States & UTs</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">{stats.districts}</CardTitle>
                  <CardDescription>Districts</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">{stats.talukas}</CardTitle>
                  <CardDescription>Talukas</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">{(stats.villages || 0).toLocaleString()}</CardTitle>
                  <CardDescription>Villages</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Perfect for Your Next Project
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Intelligent Search</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardTitle>
                  <CardDescription>
                    Fuzzy matching algorithm finds locations even with typos. 
                    Relevance-based sorting ensures best results first.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Handles misspellings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Smart relevance scoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Lightning fast results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mb-4 flex items-center justify-center">
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Hierarchical Data</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardTitle>
                  <CardDescription>
                    Navigate through India's administrative structure seamlessly. 
                    Perfect for building location dropdowns and forms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">State → District → Taluka → Village</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Consistent JSON structure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Optimized for dropdowns</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mb-4 flex items-center justify-center">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Developer Friendly</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardTitle>
                  <CardDescription>
                    RESTful API design with comprehensive documentation. 
                    Works with any programming language or framework.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">No authentication required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">CORS enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Rate limit friendly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start integrating India's most comprehensive location API into your project today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                <Code className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Zap className="mr-2 h-5 w-5" />
                Try API Now
              </Button>
            </div>
            <div className="mt-8 p-4 bg-background rounded-lg border">
              <code className="text-primary font-mono text-sm">
                curl https://india-location-hub.in/api/search?q=mumbai
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
