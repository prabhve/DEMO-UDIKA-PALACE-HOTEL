import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use the designated Firestore Database ID from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export default app;
