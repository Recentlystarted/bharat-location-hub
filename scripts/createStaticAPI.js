import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🔄 Creating Static JSON API structure...');

// Create directories
const apiDir = './public/api';
const statesDir = './public/api/states';
const searchDir = './public/api/search';

[apiDir, statesDir, searchDir].forEach(dir => {
  mkdirSync(dir, { recursive: true });
});

// Read the main data file
const jsonData = JSON.parse(readFileSync('./public/india_locations.json', 'utf8'));

console.log('📊 Processing data...');

// 1. Create states.json
const states = jsonData.states.map(state => ({
  name: state.name,
  code: state.code,
  districts: state.districts.length,
  talukas: state.districts.reduce((sum, district) => sum + district.talukas.length, 0),
  villages: state.districts.reduce((sum, district) => 
    sum + district.talukas.reduce((talukaSum, taluka) => talukaSum + taluka.villages.length, 0), 0)
}));

writeFileSync('./public/api/states.json', JSON.stringify({ states }, null, 2));
console.log('✅ Created states.json');

// 2. Create individual state files
let totalLocations = 0;
const searchIndex = {};

jsonData.states.forEach(state => {
  const stateData = {
    state: state.name,
    code: state.code,
    districts: state.districts.map(district => ({
      name: district.name,
      code: district.code,
      talukas: district.talukas.map(taluka => ({
        name: taluka.name,
        code: taluka.code,
        villages: taluka.villages.map(village => {
          totalLocations++;
          
          // Create unique code
          const uniqueCode = `${state.code}-${district.code}-${taluka.code}-${village.code}`;
          
          // Add to search index
          const searchKey = village.name.charAt(0).toLowerCase();
          if (searchKey.match(/[a-z]/)) {  // Only valid letters
            if (!searchIndex[searchKey]) {
              searchIndex[searchKey] = [];
            }
            
            const locationData = {
              stateName: state.name,
              stateCode: state.code,
              districtName: district.name,
              districtCode: district.code,
              talukaName: taluka.name,
              talukaCode: taluka.code,
              villageName: village.name,
              villageCode: village.code,
              uniqueCode,
              fullPath: `${state.name} > ${district.name} > ${taluka.name} > ${village.name}`,
              searchText: `${state.name} ${district.name} ${taluka.name} ${village.name}`.toLowerCase()
            };
            
            searchIndex[searchKey].push(locationData);
          }
          
          return {
            name: village.name,
            code: village.code,
            uniqueCode
          };
        })
      }))
    }))
  };
  
  const filename = state.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  writeFileSync(`./public/api/states/${filename}.json`, JSON.stringify(stateData, null, 2));
  console.log(`✅ Created ${filename}.json`);
});

// 3. Create search files (A-Z)
Object.keys(searchIndex).forEach(letter => {
  writeFileSync(`./public/api/search/${letter}.json`, JSON.stringify({
    letter: letter.toUpperCase(),
    locations: searchIndex[letter]
  }, null, 2));
});
console.log('✅ Created search index files (a-z)');

// 4. Create stats.json
const stats = {
  totalStates: jsonData.states.length,
  totalDistricts: jsonData.states.reduce((sum, state) => sum + state.districts.length, 0),
  totalTalukas: jsonData.states.reduce((sum, state) => 
    sum + state.districts.reduce((distSum, district) => distSum + district.talukas.length, 0), 0),
  totalVillages: totalLocations,
  lastUpdated: new Date().toISOString(),
  apiEndpoints: [
    'GET /api/states.json',
    'GET /api/states/{state-name}.json',
    'GET /api/search/{letter}.json',
    'GET /api/stats.json'
  ]
};

writeFileSync('./public/api/stats.json', JSON.stringify(stats, null, 2));
console.log('✅ Created stats.json');

// 5. Create API index
const apiIndex = {
  name: "Bharat Location Hub API",
  version: "1.0.0",
  description: "Complete Indian location database with 500K+ villages",
  endpoints: {
    states: "/api/states.json",
    search: "/api/search/{letter}.json",
    stats: "/api/stats.json",
    stateDetails: "/api/states/{state-name}.json"
  },
  examples: {
    getAllStates: "fetch('/api/states.json')",
    searchByLetter: "fetch('/api/search/m.json')",
    getStats: "fetch('/api/stats.json')",
    getMaharashtra: "fetch('/api/states/maharashtra.json')"
  },
  stats
};

writeFileSync('./public/api/index.json', JSON.stringify(apiIndex, null, 2));

console.log('🎉 Static JSON API created successfully!');
console.log(`📊 Total files created: ${Object.keys(searchIndex).length + jsonData.states.length + 3}`);
console.log(`📍 Total locations: ${totalLocations}`);
console.log('🌐 API available at: /api/');
