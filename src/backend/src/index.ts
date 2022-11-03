import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import { auth } from 'firebase-admin';

admin.initializeApp();

/**
 * Auth triggers - automatically triggered when a user is created/deleted
 */

// On account creation create a db collection for them with default data
const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    const defaultDocData = {
        email: user.email,
        name: user.displayName,
    };
    return admin.firestore().doc(`users/${user.uid}`).set(defaultDocData);
});

// On account deletion, delete user data in db
const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    return admin.firestore().collection('users').doc(user.uid).delete();
});

/**
 * Callable functions - must be invoked from within the app
 */

// Adds an event to the database
const addEvent = functions.https.onCall((data: object, context: any) => {
    if (!context.auth) {
        // TODO @krishaan: Once you integrate authentication, uncomment the following code
        /*
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You must be logged in to add events'
        );
        */
    }
    return admin.firestore().collection('events').add(data);
});

// Gets events from the database
const getEvents = functions.https.onCall((data: object, context: any) => {
    return admin
        .firestore()
        .collection('events')
        .get()
        .then((events) => {
            const eventList: any = [];
            events.forEach((event) => {
                eventList.push(event.data());
            });
            return eventList;
        })
        .catch((err) => err);
});

// Updates an event in the database with a new object
const updateEvents = functions.https.onCall(
    (data: { id: string; newObject: object }, context: any) => {
        return admin.firestore().doc(`events/${data.id}`).set(data.newObject);
    }
);

// Deactivates an event in the database (a trigger will delete it after)
const deleteEvent = functions.https.onCall((data: { id: string }, context: any) => {
    return admin.firestore().doc(`events/${data.id}`).update({ toDelete: true });
});

/**
 * Firestore triggers - do sensitive operations automatically when the database changes
 */

// Removes any event from the db when toDelete is set to true
const purgeDeletedEvent = functions.firestore
    .document('events/{eventId}')
    .onUpdate((change, context) => {
        if (change.after.data().toDelete) {
            return change.after.ref.delete();
        }
        return null;
    });

export {
    onUserSignup,
    onUserDeleted,
    addEvent,
    getEvents,
    updateEvents,
    deleteEvent,
    purgeDeletedEvent,
};

// Examples:
// Functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/functions/index.js
// Calling functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/public/js/app.js

// Docs:
// Calling functions docs: https://firebase.google.com/docs/functions/callable
// Auth triggers docs: https://firebase.google.com/docs/functions/auth-events
// Firestore triggers docs: https://firebase.google.com/docs/functions/firestore-events
