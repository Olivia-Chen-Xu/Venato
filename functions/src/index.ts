import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

/**
 * Configure firebase functions
 * Firebase admin is required for functions to access firestore
 */
admin.initializeApp();
// const db = admin.firestore();
const auth = admin.auth();

/**
 * Helper functions (not called directly)
 */

/**
 * Firebase functions to be deployed
 */

interface CreateUserReq {
    email: string;
    password: string;
    displayName: string;
}

export const createUser = functions.https.onCall(
    (data: CreateUserReq, context) => {
        return auth.createUser({
            email: data.email,
            emailVerified: false,
            password: data.password,
            displayName: data.displayName,
            disabled: false,
        });
    }
);

export const testFunc = functions.https.onCall(
    (data, context) => 'test function'
);
