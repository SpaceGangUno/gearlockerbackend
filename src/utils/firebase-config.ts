import { FirebaseOptions } from 'firebase/app';
import { enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

export const getFirebaseConfig = (): FirebaseOptions => ({
  apiKey: "AIzaSyBqX6DDqBMYFMnQOphE-7K7Aa3NtqPrZsE",
  authDomain: "gearlocker-app.firebaseapp.com",
  projectId: "gearlocker-app",
  storageBucket: "gearlocker-app.appspot.com",
  messagingSenderId: "339587712858",
  appId: "1:339587712858:web:a4b9b9f9b0b0b0b0b0b0b0"
});

export const FIRESTORE_CACHE_SIZE = CACHE_SIZE_UNLIMITED;
export const FIRESTORE_SETTINGS = {
  cacheSizeBytes: FIRESTORE_CACHE_SIZE,
  experimentalForceLongPolling: true,
  merge: true
};

export const initializeFirestoreCache = async (db: any) => {
  try {
    await enableMultiTabIndexedDbPersistence(db);
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence enabled in first tab');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    }
  }
};