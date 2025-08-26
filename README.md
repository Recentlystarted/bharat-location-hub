# 🇮🇳 Bharat Location Hub

A comprehensive location database and API for India, containing detailed information about all states, districts, talukas (sub-districts), and villages. Built with React, TypeScript, and Firebase for reliable, scalable access to Indian geographical data.

## 🚀 Features

- **Complete Database**: All 36 states, 766+ districts, 6900+ talukas, and 650,000+ villages
- **Smart Search**: Fast search across all location levels
- **REST API**: Easy integration with web and mobile applications
- **Real-time Data**: Firebase-powered backend for instant updates
- **Admin Panel**: Secure admin access for data management
- **GitHub Pages Ready**: Static deployment compatible
- **Mobile Responsive**: Works perfectly on all devices

## 🌐 Live Demo

Visit: [https://recentlystarted.github.io/bharat-location-hub/](https://recentlystarted.github.io/bharat-location-hub/)

## 📖 API Documentation

### Base URL
```
https://recentlystarted.github.io/bharat-location-hub/api
```

### Endpoints

#### Get All States
```http
GET /api/states
```

#### Get Districts by State
```http
GET /api/states/{stateName}/districts
```

#### Get Talukas by District
```http
GET /api/districts/{stateName}/{districtName}/talukas
```

#### Get Villages by Taluka
```http
GET /api/talukas/{stateName}/{districtName}/{talukaName}/villages
```

#### Search Locations
```http
GET /api/search?q={searchQuery}&limit={limit}
```

#### Get Location by Code
```http
GET /api/locations/by-code/{villageCode}
```

#### Get Statistics
```http
GET /api/stats
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "totalPages": 20
  }
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Firebase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Recentlystarted/bharat-location-hub.git
   cd bharat-location-hub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up Firebase** (See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
   - Create Firebase project
   - Set up Firestore database
   - Update `src/config/firebase.ts` with your config

4. **Upload location data to Firebase**
   ```bash
   node scripts/uploadToFirebase.js
   ```

5. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

### Deployment to GitHub Pages

1. **Build the project**
   ```bash
   pnpm build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   pnpm deploy
   ```

## 📁 Project Structure

```
bharat-location-hub/
├── public/
│   └── india_locations.json     # Raw location data (98MB)
├── src/
│   ├── components/              # React components
│   ├── config/
│   │   └── firebase.ts          # Firebase configuration
│   ├── services/
│   │   ├── locationService.ts   # Location data operations
│   │   ├── apiService.ts        # API service layer
│   │   └── authService.ts       # Authentication service
│   ├── types/
│   │   └── location.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── codeGenerator.ts     # Utility functions
│   └── App.tsx                  # Main React component
├── scripts/
│   └── uploadToFirebase.js      # Data migration script
└── FIREBASE_SETUP.md            # Firebase setup guide
```

## 🔧 Configuration

### Firebase Config
Update `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Environment Variables
Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## 📊 Data Structure

The location data follows this hierarchy:

```
State
└── District
    └── Taluka (Sub-district)
        └── Village
```

### Location Document Schema
```typescript
interface LocationDocument {
  id: string;
  stateName: string;
  stateCode: string;
  districtName: string;
  districtCode: string;
  talukaName: string;
  talukaCode: string;
  villageName: string;
  villageCode: string;
  uniqueCode: string;        // Auto-generated: ST-DIS-VIL-XXXX
  fullPath: string;          // Full hierarchy path
  searchText: string;        // Optimized for search
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 Admin Features

- **Secure Authentication**: Firebase Auth with role-based access
- **Data Management**: Add, edit, delete locations
- **Unique Code Generation**: Automatic unique identifiers
- **Batch Operations**: Bulk data management
- **Statistics Dashboard**: Real-time database stats

## 🌍 Use Cases

### Web Applications
```javascript
import { ApiService } from './src/services/apiService';

// Get all states
const states = await ApiService.getStates();

// Search locations
const results = await ApiService.searchLocations('Mumbai');

// Get districts by state
const districts = await ApiService.getDistrictsByState('MAHARASHTRA');
```

### Mobile Applications
```javascript
// React Native example
const API_BASE = 'https://recentlystarted.github.io/bharat-location-hub/api';

const response = await fetch(`${API_BASE}/states`);
const { data: states } = await response.json();
```

### External APIs
```bash
# cURL example
curl "https://recentlystarted.github.io/bharat-location-hub/api/search?q=Delhi"
```

## 📈 Performance

- **Fast Search**: Optimized search across 650K+ locations
- **Efficient Pagination**: Chunked data loading
- **CDN Delivery**: GitHub Pages global distribution
- **Caching**: Firebase caching for better performance
- **Mobile Optimized**: Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Data sourced from official Indian government sources
- Built with React, TypeScript, and Firebase
- Icons by Lucide React
- Deployed on GitHub Pages

## 📞 Support

For support, email your-email@domain.com or create an issue on GitHub.

## 🔗 Links

- [Live Demo](https://recentlystarted.github.io/bharat-location-hub/)
- [API Documentation](https://recentlystarted.github.io/bharat-location-hub/api)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [GitHub Repository](https://github.com/Recentlystarted/bharat-location-hub)

---

Made with ❤️ for developers building location-aware applications in India.
