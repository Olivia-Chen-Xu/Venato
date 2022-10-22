import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// On account creation create a db collection for them with default data
export const onUserSignup = functions.auth.user().onCreate((user: any) => {
    const defaultDoc = {
        email: user.email,
        name: user.displayName,
    };
    return db.collection('users').doc(user.uid).set(defaultDoc);
});

// On account deletion, delete user data in db
export const onUserDeleted = functions.auth.user().onDelete((user: any) => {
    return db.collection('users').doc(user.uid).delete();
});

// On user input, save data in db
export const onUserInput = functions.https.onCall((data: any, context: any) => {
    return db.collection('events').add(data)
})

// On user edit, update field in db
export const onFieldUpdate = functions.https.onCall((data: any, context: any) => {
    return db.collection('events').doc().update(data)
});

// On user delete, delete field in db
export const onFieldDelete = functions.https.onCall((data: any, context: any) => {
    return db.collection('events').doc().delete(data);
});


// Examples:
// Functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/functions/index.js
// Calling functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/public/js/app.js

// Docs:
// Calling functions docs: https://firebase.google.com/docs/functions/callable
// Auth triggers docs: https://firebase.google.com/docs/functions/auth-events
// Firestore triggers docs: https://firebase.google.com/docs/functions/firestore-events
