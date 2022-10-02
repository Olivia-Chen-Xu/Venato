import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Venato Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBouNrZMqdS_WX9Hyi-e7X69bxbvxEZZsY',
    authDomain: 'venato-ae74d.firebaseapp.com',
    projectId: 'venato-ae74d',
    storageBucket: 'venato-ae74d.appspot.com',
    messagingSenderId: '1065915891459',
    appId: '1:1065915891459:web:eac53d65d3155eed597336',
    measurementId: 'G-RGF0GESP9P',
};

export const app = initializeApp(firebaseConfig);

// Export firebase SDKs
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
