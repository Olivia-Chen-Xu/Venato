import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Venato Firebase configuration
// Note: exposing the API isn't a security risk since the users need to interact with firebase;
// all sensitive information is done server-side within functions
const firebaseConfig = {
    apiKey: 'AIzaSyBouNrZMqdS_WX9Hyi-e7X69bxbvxEZZsY',
    authDomain: 'venato-ae74d.firebaseapp.com',
    projectId: 'venato-ae74d',
    storageBucket: 'venato-ae74d.appspot.com',
    messagingSenderId: '1065915891459',
    appId: '1:1065915891459:web:eac53d65d3155eed597336',
    measurementId: 'G-RGF0GESP9P',
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Some non-sensitive auth operations are done client-side (like signing out)

export { app, auth };
