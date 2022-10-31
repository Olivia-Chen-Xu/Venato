import { initializeApp } from 'firebase/app';
import 'firebase/firestore';

import { getAuth } from 'firebase/auth';



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
export const db = firebase.firestore();

export const auth = getAuth(app);
