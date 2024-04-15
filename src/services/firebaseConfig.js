import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const getStoredFirebaseConfig = () => {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  if (envConfig.apiKey && envConfig.apiKey !== 'your_api_key_here' && envConfig.projectId) {
    return envConfig;
  }

  const custom = localStorage.getItem('printf_firebase_config');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch (e) {
      console.error("Invalid custom firebase config stored", e);
    }
  }

  return null;
};

export const saveCustomFirebaseConfig = (config) => {
  localStorage.setItem('printf_firebase_config', JSON.stringify(config));
  window.location.reload();
};

export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem('printf_firebase_config');
  window.location.reload();
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;
let analytics = null;
let isFirebaseActive = false;

const config = getStoredFirebaseConfig();

if (config && config.apiKey && config.projectId) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    isFirebaseActive = true;
    console.log("🔥 Connected live to Firebase project:", config.projectId);

    // Initialize Analytics if supported in environment
    isSupported().then(supported => {
      if (supported && config.measurementId) {
        analytics = getAnalytics(app);
      }
    }).catch(e => {});

  } catch (error) {
    console.warn("⚠️ Failed to initialize Firebase SDK:", error.message);
    isFirebaseActive = false;
  }
} else {
  console.log("ℹ️ Running in Printf Demo/Mock Mode.");
}

export { app, auth, db, storage, googleProvider, analytics, isFirebaseActive };
