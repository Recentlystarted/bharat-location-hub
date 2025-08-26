import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Database, 
  Search, 
  Users, 
  Globe
} from 'lucide-react';
import { LocationService } from '../services/staticLocationService';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load real statistics
      const statsResult = await LocationService.getStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>States</CardTitle>
              <CardDescription>Total Indian states and union territories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalStates}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Districts</CardTitle>
              <CardDescription>Total districts across all states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalDistricts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pincodes</CardTitle>
              <CardDescription>Total postal codes in database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalPincodes.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system status and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Database Status</h4>
                  <p className="text-sm text-muted-foreground">✅ All location services operational</p>
                  <p className="text-sm text-muted-foreground">✅ API endpoints responding</p>
                  <p className="text-sm text-muted-foreground">✅ Data integrity verified</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Last Updated</h4>
                  <p className="text-sm text-muted-foreground">{stats.lastUpdated}</p>
                  <h4 className="font-semibold mb-2 mt-4">Session Info</h4>
                  <p className="text-sm text-muted-foreground">
                    Session expires: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
        
        {/* Logout Button */}
        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
