import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

/**
 * Configure firebase functions
 * Firebase admin is required for functions to access firestore (for security)
 */

admin.initializeApp();
// const adminAuth = admin.auth();
// const db = admin.firestore();

/**
 * Helper functions & interfaces
 */

/**
 * Firebase functions to be deployed
 */

// On account creation create a db collection for them with default data
export const newUserSignUp = functions.auth.user().onCreate((user) => {
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
    });
});

// On account deletion, delete user data in db
export const userDeleted = functions.auth.user().onDelete((user) => {
    return admin.firestore().collection('users').doc(user.uid).delete();
});
