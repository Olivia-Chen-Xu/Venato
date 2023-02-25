import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
const getDoc = (doc: string) => admin.firestore().doc(doc);
const getCollection = (collection: string) => admin.firestore().collection(collection);

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
            if (!doc.exists) {
                throw new functions.https.HttpsError(
                    'not-found',
                    `The document '${path}' does not exist`
                );
            }

            if (doc.data()?.userId !== context.auth?.uid) {
                throw new functions.https.HttpsError(
                    'permission-denied',
                    `You cannot view the document '${path}' as it doesn't belong to you`
                );
            }
            return null;
        });
};

// Returns true if the object has the same structure as the structure object
// Conditions:
//  - Both the original object and structure are of type object
//  - Both objects have the same number of keys
//  - Each key in the structure object exists in the original object and has the same type
//    (if the value is an object, recursively check the structure of that object too)
const isValidObjectStructure = (obj: any, structure: any) => {
    if (typeof obj !== 'object' || typeof structure !== 'object') {
        return false;
    }

    if (Object.keys(obj).length !== Object.keys(structure).length) {
        return false;
    }

    for (const key in structure) {
        if (typeof obj[key] !== typeof structure[key]) {
            return false;
        }
        if (typeof obj[key] === 'object') {
            if (!isValidObjectStructure(obj[key], structure[key])) {
                return false;
            }
        }
    }

    return true;
}

// Gets a firebase timestamp for x days ago (0 for current date)
const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const getRelativeTimestamp = (days: number) => admin.firestore.Timestamp.fromMillis(Date.now() - (days || 0) * oneDay);

// Gets a firestore timestamp based on unix millis
const getFirestoreTimestamp = (unixMillis: number) => admin.firestore.Timestamp.fromMillis(unixMillis);

// For doing misc. tasks like deleting or editing document keys
const firestoreHelper = admin.firestore;

export {
    getDoc,
    getCollection,
    verifyIsAuthenticated,
    verifyDocPermission,
    isValidObjectStructure,
    getRelativeTimestamp,
    getFirestoreTimestamp,
    firestoreHelper,
    db,
    auth,
};
