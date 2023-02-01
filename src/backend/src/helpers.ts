import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

/**
 * Initialize the app with admin permissions to be used in other functions
 */

// Admin SDK is required to access Firestore.
// It also allows enhanced security since it's only available on the server-side and ignores
// firestore security rules, so all other requests not defined in the API will be blocked
admin.initializeApp();

// Batch jobs require a db reference
const db = admin.firestore();

// Auth-based functions may need admin permissions for authentication
const auth = admin.auth();

/**
 * Helper functions for commonly used functionality
 */

// Shorthand for the very common requirement of getting a document or collection
const getDoc = (doc: string) => {
    return admin.firestore().doc(doc);
};
const getCollection = (collection: string) => {
    return admin.firestore().collection(collection);
};

// Confirm a function call comes from a logged-in user
const verifyIsAuthenticated = (context: functions.https.CallableContext) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You must be logged in to call the API'
        );
    }
};

// Verify the user who called the function has access to the specified job
const verifyDocPermission = async (context: functions.https.CallableContext, path: string) => {
    verifyIsAuthenticated(context);

    await getDoc(path)
        .get()
        .then((doc) => {
            if (doc.data()?.metaData.userId !== context.auth?.uid) {
                throw new functions.https.HttpsError(
                    'permission-denied',
                    `You cannot view the document '${path}' as it doesn't belong to you`
                );
            }
            return null;
        });
};

// Gets a firebase timestamp for x days ago (0 for current date)
const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const getRelativeTimestamp = (days: number) => {
    return admin.firestore.Timestamp.fromMillis(Date.now() - (days || 0) * oneDay);
};

// Gets a firestore timestamp based on unix millis
const getFirestoreTimestamp = (unixMillis: number) => {
    return admin.firestore.Timestamp.fromMillis(unixMillis);
};

// For doing misc. tasks like deleting or editing document keys
const firestoreHelper = admin.firestore;

export {
    getDoc,
    getCollection,
    verifyIsAuthenticated,
    verifyDocPermission,
    getRelativeTimestamp,
    getFirestoreTimestamp,
    firestoreHelper,
    db,
    auth,
};
