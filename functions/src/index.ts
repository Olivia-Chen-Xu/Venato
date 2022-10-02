import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

/**
 * Configure firebase functions
 * Firebase admin is required for functions to access firestore
 */
admin.initializeApp();
// const db = admin.firestore();

/**
 * Helper functions (not called directly)
 */

/**
 * Firebase functions to be deployed
 */

export const helloWorld = functions.https.onCall(
    (data, context) => 'Hello from Firebase!'
);

export const testFunc = functions.https.onCall(
    (data, context) => 'test function'
);
