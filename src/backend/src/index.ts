import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

/**
 * Configure firebase functions
 * Firebase admin is required for functions to access firestore (for security)
 */
admin.initializeApp();
const adminAuth = admin.auth();
// const db = admin.firestore();

/**
 * Helper functions & interfaces
 */

interface LoginReq {
    email: string;
    password: string;
}

interface CreateUserReq extends LoginReq {
    displayName: string;
}

/**
 * Firebase functions to be deployed
 */

export const signup = functions.https.onCall((data: CreateUserReq, context) => {
    const req = {
        email: data.email,
        emailVerified: false,
        password: data.password,
        displayName: data.displayName,
        disabled: false,
    };
    return adminAuth.createUser(req);
});

export const signin = functions.https.onCall((data: LoginReq, context) => {
    return signInWithEmailAndPassword(auth, data.email, data.password);
});

export const signout = functions.https.onCall((data, context) => {
    return signOut(auth);
});
