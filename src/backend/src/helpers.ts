import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

/**
 * Helper functions for Firebase Functions, plus admin app initialization
 */

// Admin SDK is required to access Firestore.
// It also allows enhanced security since it's only available on the server-side and ignores
// firestore security rules, so all other requests not defined in the API will be blocked
admin.initializeApp();

// Batch jobs require a db reference
const db = admin.firestore();

// Shorthand for the very common requirement of getting a document or collection
const getDoc = (doc: string) => {
    return admin.firestore().doc(doc);
};
const getCollection = (collection: string) => {
    return admin.firestore().collection(collection);
};

// Verify user is logged in and has access to the job
const verifyAuthentication = async (context: functions.https.CallableContext, jobId: string) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }

    await getDoc(`jobs/${jobId}`)
        .get()
        .then((doc) => {
            if (doc.data()?.userId !== context.auth?.uid) {
                throw new functions.https.HttpsError(
                    'permission-denied',
                    "You cannot edit this job as it doesn't belong to you"
                );
            }
        });
};

export { getDoc, getCollection, verifyAuthentication, db };
