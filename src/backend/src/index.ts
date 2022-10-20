import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

admin.initializeApp();

// On account creation create a db collection for them with default data
export const onUserSignup = functions.auth.user().onCreate((user) => {
    const defaultDoc = {
        email: user.email,
        name: user.displayName,
    };
    return admin.firestore().collection('users').doc(user.uid).set(defaultDoc);
});

// On account deletion, delete user data in db
export const onUserDeleted = functions.auth.user().onDelete((user) => {
    return admin.firestore().collection('users').doc(user.uid).delete();
});

// On user input, add event data in db
export const onUserInput = functions.https.onCall((data, context) => {
    return admin.firestore().collection('events').add(data);
});

// Examples:
// Functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/functions/index.js
// Calling functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/public/js/app.js

// Docs:
// Calling functions docs: https://firebase.google.com/docs/functions/callable
// Auth triggers docs: https://firebase.google.com/docs/functions/auth-events
// Firestore triggers docs: https://firebase.google.com/docs/functions/firestore-events
