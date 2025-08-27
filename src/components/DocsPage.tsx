import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Database, 
  Search, 
  Globe,
  CheckCircle,
  Copy,
  ArrowRight,
  Smartphone,
  Monitor,
  Zap,
  Server,
  BookOpen,
  Download
} from 'lucide-react';
import { useState } from 'react';

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ children, id, copyText, title }: { 
    children: React.ReactNode; 
    id: string; 
    copyText: string; 
    title?: string;
  }) => (
    <div className="relative mb-4">
      {title && (
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border border-b-0 rounded-t-lg">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(copyText, id)}
          >
            {copiedCode === id ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}
      <pre className={`bg-muted text-foreground p-4 text-sm overflow-x-auto border ${title ? 'rounded-t-none' : 'rounded-lg'}`}>
        <code>{children}</code>
      </pre>
      {!title && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={() => copyToClipboard(copyText, id)}
        >
          {copiedCode === id ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl font-bold text-foreground">
                API Documentation
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              Complete REST API documentation for Bharat Location Hub. Access 500,000+ Indian locations 
              with intelligent search, hierarchical navigation, and developer-friendly endpoints.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2">
                <Database className="h-4 w-4" />
                <span>500K+ Records</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2">
                <Globe className="h-4 w-4" />
                <span>All India Coverage</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2">
                <Server className="h-4 w-4" />
                <span>RESTful API</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2">
                <Zap className="h-4 w-4" />
                <span>Real-time Search</span>
              </Badge>
            </div>
          </div>

          {/* Quick Start */}
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Quick Start Guide</span>
              </CardTitle>
              <CardDescription>Get up and running with the API in under 2 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Base URL</span>
                  </h4>
                  <div className="bg-secondary p-4 rounded-lg border">
                    <code className="text-primary font-mono text-sm">
                      https://india-location-hub.in/api
                    </code>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Try It Now</span>
                  </h4>
                  <CodeBlock 
                    id="quick-test" 
                    copyText="curl https://india-location-hub.in/api/stats"
                  >
                    curl https://india-location-hub.in/api/stats
                  </CodeBlock>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Hierarchy */}
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                <span>Data Hierarchy - Perfect for Apps</span>
              </CardTitle>
              <CardDescription>Navigate through India's administrative structure seamlessly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-center mb-6">
                <Card className="bg-secondary/50">
                  <CardHeader className="pb-3">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">States</CardTitle>
                    <CardDescription className="text-xs">34 States & UTs</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-secondary/50">
                  <CardHeader className="pb-3">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">Districts</CardTitle>
                    <CardDescription className="text-xs">569 Districts</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-secondary/50">
                  <CardHeader className="pb-3">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">Talukas</CardTitle>
                    <CardDescription className="text-xs">5,679 Sub-districts</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-secondary/50">
                  <CardHeader className="pb-3">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">Villages</CardTitle>
                    <CardDescription className="text-xs">527K+ Villages</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-foreground">API Flow for Location Dropdowns:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <code className="text-primary">/api/states</code> → Get all states
                    <br />
                    <code className="text-primary">/api/states/[state]/districts</code> → Get districts
                  </div>
                  <div className="space-y-1">
                    <code className="text-primary">/api/districts/[district]/talukas</code> → Get talukas
                    <br />
                    <code className="text-primary">/api/talukas/[taluka]/villages</code> → Get villages
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <div className="space-y-6 mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              API Endpoints
            </h2>
            
            {/* States Endpoint */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <Badge variant="default" className="font-mono font-bold">GET</Badge>
                    <span className="font-mono text-lg">/api/states</span>
                  </CardTitle>
                  <Badge variant="outline">No Auth Required</Badge>
                </div>
                <CardDescription>Retrieve all Indian states and union territories with statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock 
                  id="states-response" 
                  title="Response Format"
                  copyText={`{
  "success": true,
  "data": {
    "states": [
      {
        "name": "Maharashtra",
        "code": "MH", 
        "districts": 36,
        "talukas": 358,
        "villages": 43722,
        "capital": "Mumbai"
      }
    ],
    "total": 34
  }
}`}
                >
{`{
  "success": true,
  "data": {
    "states": [
      {
        "name": "Maharashtra",
        "code": "MH", 
        "districts": 36,
        "talukas": 358,
        "villages": 43722,
        "capital": "Mumbai"
      }
    ],
    "total": 34
  }
}`}
                </CodeBlock>
              </CardContent>
            </Card>

            {/* Search Endpoint */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <Badge variant="default" className="font-mono font-bold">GET</Badge>
                    <span className="font-mono text-lg">/api/search</span>
                  </CardTitle>
                  <Badge variant="secondary">Smart Search</Badge>
                </div>
                <CardDescription>Intelligent fuzzy search across all locations with typo tolerance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Parameters</h4>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <code className="text-primary">q</code> <span className="text-muted-foreground">(required)</span> - Search query
                        </div>
                        <div>
                          <code className="text-primary">limit</code> <span className="text-muted-foreground">(optional)</span> - Max results (default: 50)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Example Requests</h4>
                    <div className="space-y-2">
                      <CodeBlock 
                        id="search-mumbai" 
                        copyText="GET https://india-location-hub.in/api/search?q=mumbai&limit=5"
                      >
                        GET https://india-location-hub.in/api/search?q=mumbai&limit=5
                      </CodeBlock>
                      <CodeBlock 
                        id="search-village" 
                        copyText="GET https://india-location-hub.in/api/search?q=Village%20Tunda"
                      >
                        GET https://india-location-hub.in/api/search?q=Village%20Tunda
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Endpoint */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <Badge variant="default" className="font-mono font-bold">GET</Badge>
                    <span className="font-mono text-lg">/api/stats</span>
                  </CardTitle>
                  <Badge variant="outline">Public</Badge>
                </div>
                <CardDescription>Get comprehensive statistics about the location database</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock 
                  id="stats-response" 
                  title="Response Format"
                  copyText={`{
  "success": true,
  "data": {
    "states": 34,
    "districts": 569,
    "talukas": 5679,
    "villages": 527912,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}`}
                >
{`{
  "success": true,
  "data": {
    "states": 34,
    "districts": 569,
    "talukas": 5679,
    "villages": 527912,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}`}
                </CodeBlock>
              </CardContent>
            </Card>
          </div>

          {/* Integration Examples */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-primary" />
                <span>Integration Examples</span>
              </CardTitle>
              <CardDescription>Ready-to-use code for popular frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-primary" />
                    <span>React/Next.js Location Dropdown</span>
                  </h4>
                  <CodeBlock 
                    id="react-dropdown" 
                    title="LocationDropdown.jsx"
                    copyText={'import { useState, useEffect } from \'react\';\n\nconst LocationDropdown = () => {\n  const [states, setStates] = useState([]);\n  const [districts, setDistricts] = useState([]);\n  const [selectedState, setSelectedState] = useState(\'\');\n\n  useEffect(() => {\n    // Fetch states on component mount\n    fetch(\'https://india-location-hub.in/api/states\')\n      .then(res => res.json())\n      .then(data => setStates(data.data.states));\n  }, []);\n\n  const handleStateChange = async (stateName) => {\n    setSelectedState(stateName);\n    const response = await fetch(`https://india-location-hub.in/api/states/${stateName}/districts`);\n    const data = await response.json();\n    setDistricts(data.data.districts);\n  };\n\n  return (\n    <div className="space-y-4">\n      <select onChange={(e) => handleStateChange(e.target.value)}>\n        <option value="">Select State</option>\n        {states.map(state => (\n          <option key={state.name} value={state.name}>\n            {state.name}\n          </option>\n        ))}\n      </select>\n      \n      <select disabled={!selectedState}>\n        <option value="">Select District</option>\n        {districts.map(district => (\n          <option key={district} value={district}>\n            {district}\n          </option>\n        ))}\n      </select>\n    </div>\n  );\n};'}
                  >
{`import { useState, useEffect } from 'react';

const LocationDropdown = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    // Fetch states on component mount
    fetch('https://india-location-hub.in/api/states')
      .then(res => res.json())
      .then(data => setStates(data.data.states));
  }, []);

  const handleStateChange = async (stateName) => {
    setSelectedState(stateName);
    const response = await fetch(\`https://india-location-hub.in/api/states/\${stateName}/districts\`);
    const data = await response.json();
    setDistricts(data.data.districts);
  };

  return (
    <div className="space-y-4">
      <select onChange={(e) => handleStateChange(e.target.value)}>
        <option value="">Select State</option>
        {states.map(state => (
          <option key={state.name} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>
      
      <select disabled={!selectedState}>
        <option value="">Select District</option>
        {districts.map(district => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>
  );
};`}
                  </CodeBlock>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span>Android (Kotlin) with Retrofit</span>
                  </h4>
                  <CodeBlock 
                    id="android-retrofit" 
                    title="LocationApiService.kt"
                    copyText={'// API Interface\ninterface LocationApiService {\n    @GET("api/states")\n    suspend fun getStates(): Response<ApiResponse<StatesList>>\n    \n    @GET("api/search")\n    suspend fun searchLocations(\n        @Query("q") query: String,\n        @Query("limit") limit: Int = 50\n    ): Response<ApiResponse<LocationsList>>\n}\n\n// Data Classes\ndata class ApiResponse<T>(\n    val success: Boolean,\n    val data: T?\n)\n\ndata class StatesList(\n    val states: List<State>,\n    val total: Int\n)\n\ndata class State(\n    val name: String,\n    val code: String,\n    val districts: Int,\n    val villages: Int\n)'}
                  >
{`// API Interface
interface LocationApiService {
    @GET("api/states")
    suspend fun getStates(): Response<ApiResponse<StatesList>>
    
    @GET("api/search")
    suspend fun searchLocations(
        @Query("q") query: String,
        @Query("limit") limit: Int = 50
    ): Response<ApiResponse<LocationsList>>
}

// Data Classes
data class ApiResponse<T>(
    val success: Boolean,
    val data: T?
)

data class StatesList(
    val states: List<State>,
    val total: Int
)

data class State(
    val name: String,
    val code: String,
    val districts: Int,
    val villages: Int
)`}
                  </CodeBlock>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Choose Bharat Location Hub API?</CardTitle>
              <CardDescription>Professional features designed for production applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Intelligent Search</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced fuzzy matching with typo tolerance and relevance scoring. 
                    Find locations even with misspellings.
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Hierarchical Structure</h4>
                  <p className="text-sm text-muted-foreground">
                    Perfect for building cascading dropdowns: State → District → Taluka → Village 
                    with consistent JSON responses.
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Developer Friendly</h4>
                  <p className="text-sm text-muted-foreground">
                    RESTful design, comprehensive documentation, no authentication required, 
                    CORS enabled, and rate limit friendly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start building amazing location-aware applications with India's most comprehensive geographic API.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Zap className="mr-2 h-5 w-5" />
                  Try Live API
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Download className="mr-2 h-5 w-5" />
                  Download Examples
                </Button>
              </div>
              <div className="mt-8 p-4 bg-background rounded-lg border max-w-2xl mx-auto">
                <div className="text-sm text-muted-foreground mb-2">Quick Test Command:</div>
                <code className="text-primary font-mono text-sm break-all">
                  curl "https://india-location-hub.in/api/search?q=mumbai&limit=5"
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
