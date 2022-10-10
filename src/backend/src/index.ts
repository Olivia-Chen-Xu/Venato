import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

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

interface CreateUserReq {
    email: string;
    password: string;
    displayName: string;
}

/**
 * Firebase functions to be deployed
 */

// eslint-disable-next-line import/prefer-default-export
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
