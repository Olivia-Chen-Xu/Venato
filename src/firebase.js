import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/*
 * IMPORTANT: ANY CHANGES TO THIS FILE MUST BE REFLECTED IN tools\prodConfig.ts
 * This file must be the same as tools\prodConfig.ts except the firebaseConfig
 * is for the development environment ('Venato' on firebase)
 */

// Venato Firebase configuration (development environment)
// Note: exposing the API isn't a security risk since the users need to interact with firebase;
// all sensitive information is done server-side within functions
const firebaseConfig = {
    apiKey: "AIzaSyBouNrZMqdS_WX9Hyi-e7X69bxbvxEZZsY",
    authDomain: "venato-ae74d.firebaseapp.com",
    databaseURL: "https://venato-ae74d-default-rtdb.firebaseio.com",
    projectId: "venato-ae74d",
    storageBucket: "venato-ae74d.appspot.com",
    messagingSenderId: "1065915891459",
    appId: "1:1065915891459:web:eac53d65d3155eed597336",
    measurementId: "G-RGF0GESP9P",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Some non-sensitive auth operations are done client-side (like signing out)

export {app, auth};
