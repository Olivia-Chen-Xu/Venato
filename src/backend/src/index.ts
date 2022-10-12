import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// On account creation create a db collection for them with default data
export const newUserSignUp = functions.auth.user().onCreate((user) => {
    const defaultDoc = {
        email: user.email,
        name: user.displayName,
    };
    return db.collection('users').doc(user.uid).set(defaultDoc);
});

// On account deletion, delete user data in db
export const userDeleted = functions.auth.user().onDelete((user) => {
    return db.collection('users').doc(user.uid).delete();
});
