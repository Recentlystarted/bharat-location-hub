import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('❌ Admin credentials not found in .env file');
      console.log('Please make sure ADMIN_EMAIL and ADMIN_PASSWORD are set');
      return;
    }

    console.log('👤 Creating admin user account...');
    console.log(`📧 Email: ${adminEmail}`);
    
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('✅ Admin user created successfully!');
    console.log(`🆔 User ID: ${user.uid}`);
    console.log('🎯 You can now use this account to:');
    console.log('   - Upload data using the upload script');
    console.log('   - Login to the admin panel');
    console.log('   - Manage location data');
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Admin user already exists!');
      console.log('🎯 You can proceed with data upload');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
}

console.log('🔐 Setting up admin authentication...');
createAdminUser().then(() => {
  console.log('🎉 Admin setup completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
});
