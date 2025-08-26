import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocsPage() {
  return (
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
}
