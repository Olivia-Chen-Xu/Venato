import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/*
 * IMPORTANT: ANY CHANGES TO THIS FILE MUST BE REFLECTED IN src\config\firebase.ts
 * This file must be the same as src\config\firebase.ts except the firebaseConfig
 * is for the production environment ('Venato-production' on firebase)
 */

// Venato Firebase configuration (production)
// Note: exposing the API isn't a security risk since the users need to interact with firebase;
// all sensitive information is done server-side within functions
const firebaseConfig = {
    apiKey: "AIzaSyBVZp21HmO6Q5ULdsg4Ki8fDuy_NqwxIbA",
    authDomain: "venato-production-e2ae0.firebaseapp.com",
    projectId: "venato-production-e2ae0",
    storageBucket: "venato-production-e2ae0.appspot.com",
    messagingSenderId: "9231796483",
    appId: "1:9231796483:web:7478a32897925cd68f4136",
    measurementId: "G-79DX6QRJ6J"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Some non-sensitive auth operations are done client-side (like signing out)

export { app, auth };
