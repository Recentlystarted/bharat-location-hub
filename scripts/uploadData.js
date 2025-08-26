import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateUniqueCode(state, district, village) {
  const stateAbbr = state.substring(0, 2).toUpperCase();
  const districtAbbr = district.substring(0, 3).toUpperCase();
  const villageAbbr = village ? village.substring(0, 3).toUpperCase() : 'GEN';
  const uniqueId = generateUUID().substring(0, 4).toUpperCase();
  return `${stateAbbr}-${districtAbbr}-${villageAbbr}-${uniqueId}`;
}

async function uploadToFirestore() {
  try {
    // Check if credentials are provided
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminEmail && adminPassword) {
      console.log('🔐 Authenticating with Firebase...');
      try {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log('✅ Authentication successful!');
      } catch (authError) {
        console.error('❌ Authentication failed:', authError.message);
        console.log('Note: Make sure the admin account is registered in Firebase Auth');
        return;
      }
    } else {
      console.log('⚠️  No admin credentials found, proceeding without authentication');
      console.log('Make sure Firestore rules allow writes or provide ADMIN_EMAIL and ADMIN_PASSWORD');
    }

    console.log('📖 Reading JSON file...');
    const jsonData = JSON.parse(readFileSync('./public/india_locations.json', 'utf8'));
    
    console.log('🔄 Processing data...');
    const locations = [];
    let totalCount = 0;

    // Process the data
    for (const state of jsonData.states) {
      for (const district of state.districts) {
        for (const taluka of district.talukas) {
          for (const village of taluka.villages) {
            const locationDoc = {
              stateName: state.name,
              stateCode: state.code,
              districtName: district.name,
              districtCode: district.code,
              talukaName: taluka.name,
              talukaCode: taluka.code,
              villageName: village.name,
              villageCode: village.code,
              uniqueCode: generateUniqueCode(state.name, district.name, village.name),
              fullPath: `${state.name} > ${district.name} > ${taluka.name} > ${village.name}`,
              searchText: `${state.name} ${district.name} ${taluka.name} ${village.name} ${village.code}`.toLowerCase(),
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            locations.push(locationDoc);
            totalCount++;
            
            // Log progress
            if (totalCount % 10000 === 0) {
              console.log(`📊 Processed ${totalCount} locations...`);
            }
          }
        }
      }
    }

    console.log(`📦 Total locations to upload: ${totalCount}`);

    // Upload in batches of 500 (Firestore limit)
    const batchSize = 500;
    let uploadedCount = 0;

    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchData = locations.slice(i, i + batchSize);

      for (const location of batchData) {
        const docRef = doc(collection(db, 'locations'));
        batch.set(docRef, location);
      }

      await batch.commit();
      uploadedCount += batchData.length;
      
      console.log(`⬆️  Uploaded ${uploadedCount}/${totalCount} locations (${Math.round((uploadedCount/totalCount)*100)}%)`);
    }

    // Create stats document
    const stats = {
      totalStates: jsonData.states.length,
      totalDistricts: jsonData.states.reduce((sum, state) => sum + state.districts.length, 0),
      totalTalukas: jsonData.states.reduce((sum, state) => 
        sum + state.districts.reduce((distSum, district) => distSum + district.talukas.length, 0), 0),
      totalVillages: totalCount,
      lastUpdated: new Date()
    };

    const statsBatch = writeBatch(db);
    statsBatch.set(doc(db, 'stats', 'location_stats'), stats);
    await statsBatch.commit();

    console.log('✅ Upload completed successfully!');
    console.log(`📈 Stats: ${stats.totalStates} states, ${stats.totalDistricts} districts, ${stats.totalTalukas} talukas, ${stats.totalVillages} villages`);

  } catch (error) {
    console.error('❌ Error uploading to Firestore:', error);
  }
}

// Run the upload
console.log('🚀 Starting Bharat Location Hub data migration...');
uploadToFirestore().then(() => {
  console.log('🎉 Data migration completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});
