import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import { sendEmailVerification, User } from 'firebase/auth';

admin.initializeApp();

// On account creation create a db collection for them with default data
export const onUserSignup = functions.auth.user().onCreate((user: User) => {
    const defaultDocData = {
        email: user.email,
        name: user.displayName,
    };
    const doc = admin.firestore().collection('users').doc(user.uid);
    return doc.set(defaultDocData).then(() => sendEmailVerification(user));
});

// On account deletion, delete user data in db
export const onUserDeleted = functions.auth.user().onDelete((user: User) => {
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
