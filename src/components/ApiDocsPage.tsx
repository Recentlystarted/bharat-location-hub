
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApiDocsPageProps {
  onNavigate: (page: string) => void;
}

export default function ApiDocsPage({ onNavigate }: ApiDocsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Bharat Location Hub API</h1>
            <Button onClick={() => onNavigate('admin')} variant="default">
              Admin Login
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Bharat Location Hub API</CardTitle>
              <CardDescription>
                A comprehensive REST API for Indian geographical data including states, districts, and pincodes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p>
                  This API provides access to detailed geographical information about India, including
                  all states, districts, and postal codes (pincodes) with their respective details.
                </p>
                <h3>Features</h3>
                <ul>
                  <li>Complete list of Indian states with codes</li>
                  <li>District information for all states</li>
                  <li>Pincode database with location mapping</li>
                  <li>RESTful API endpoints</li>
                  <li>JSON formatted responses</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Available endpoints and their usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">GET /states.json</h4>
                  <p className="text-sm text-muted-foreground">
                    Returns a list of all Indian states with their codes and names.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">GET /districts.json</h4>
                  <p className="text-sm text-muted-foreground">
                    Returns all districts organized by state codes.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">GET /pincodes.json</h4>
                  <p className="text-sm text-muted-foreground">
                    Returns comprehensive pincode data with location details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
              <CardDescription>Standard JSON response structure</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "status": "success",
  "data": {
    // Response data here
  },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 50
  }
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
              <CardDescription>How to integrate with your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">JavaScript/Fetch</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`fetch('/api/states.json')
  .then(response => response.json())
  .then(data => console.log(data));`}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">cURL</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X GET "https://your-domain.com/api/states.json" \\
     -H "Accept: application/json"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limits & Guidelines</CardTitle>
              <CardDescription>API usage policies and best practices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ul>
                  <li>No authentication required for read operations</li>
                  <li>Rate limit: 1000 requests per hour per IP</li>
                  <li>Use appropriate caching headers</li>
                  <li>Respect the API and avoid unnecessary requests</li>
                  <li>For bulk operations, consider downloading the entire dataset</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 Bharat Location Hub. Open source geographical data for India.</p>
        </div>
      </footer>
    </div>
  );
}
