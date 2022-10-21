import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import { auth } from "firebase-admin";

admin.initializeApp();

// On account creation create a db collection for them with default data
export const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    const doc = admin.firestore().doc(`users/${user.uid}`);
    const defaultDocData = {
        email: user.email,
        name: user.displayName,
        test: typeof user,
    };
    return doc.set(defaultDocData);
});

// On account deletion, delete user data in db
export const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    return admin.firestore().collection('users').doc(user.uid).delete();
});

// On user input, add event data in db
export const onUserInput = functions.https.onCall((data: any, context: any) => {
    return admin.firestore().collection('events').add(data);
});

// Examples:
// Functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/functions/index.js
// Calling functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/public/js/app.js

// Docs:
// Calling functions docs: https://firebase.google.com/docs/functions/callable
// Auth triggers docs: https://firebase.google.com/docs/functions/auth-events
// Firestore triggers docs: https://firebase.google.com/docs/functions/firestore-events
