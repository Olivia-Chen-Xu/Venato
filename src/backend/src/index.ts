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

const addJobs = functions.https.onCall((data: [], context: any) => {
    const db = admin.firestore();
    const batch = db.batch();
    data.forEach((job: any) => {
        batch.set(db.collection('jobs').doc(), job);
    });
    return batch.commit();
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

// Returns all the jobs in the database
const getJobs = functions.https.onCall((data: object, context: any) => {
    return admin
        .firestore()
        .collection('jobs')
        .get()
        .then((events) => {
            const jobList: any = [];
            events.forEach((event) => {
                const job = event.data();
                delete job.companySearchable;
                delete job.locationSearchable;
                delete job.titleSearchable;
                jobList.push(job);
            });
            return jobList;
        })
        .catch((err) => err);
});

// Updates an event in the database with a new object
const updateEvents = functions.https.onCall(
    (data: { id: string; newObject: object }, context: any) => {
        return admin.firestore().doc(`events/${data.id}`).set(data.newObject);
    }
);

const updateEventField = functions.https.onCall(
    (data: { id: string; newFields: object }, context: any) => {
        return admin.firestore().doc(`events/${data.id}`).update(data.newFields);
    }
);

// Deactivates an event in the database (a trigger will delete it after)
const deleteEvent = functions.https.onCall((data: { id: string }, context: any) => {
    return admin.firestore().doc(`events/${data.id}`).update({ toDelete: true });
});

const jobSearch = functions.https.onCall(
    (data: { company: string; position: string; location: string }, context: any) => {}
);

const interviewQuestionSearch = functions.https.onCall(
    (data: { company: string; position: string }, context: any) => {
        const companyQuery = data.company.toLowerCase().split(' ');
        // const positionQuery = data.position.toLowerCase().split(' ');
        // .where('titleSearchable', 'array-contains-any', positionQuery)

        return admin
            .firestore()
            .collection('jobs')
            .where('companySearchable', 'array-contains-any', companyQuery)
            .where('location', '==', 'San Jose, California')
            .where('title', '==', 'Software Engineer Intern')
            .get()
            .then((jobs) => {
                const jobList: any = [];
                jobs.forEach((doc) => {
                    const job = doc.data();
                    delete job.companySearchable;
                    delete job.locationSearchable;
                    delete job.titleSearchable;
                    jobList.push(job);
                });
                return jobList;
            })
            .catch((err) => `Error querying interview questions: ${err}`);
    }
);

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

// Makes searchable fields for the jobs on create and add company/location to db
const onJobCreate = functions.firestore.document('jobs/{jobId}').onCreate((snap, context) => {
    const data = snap.data();
    const makeSearchable = (str: string) => {
        return str.replace('/[!@#$%^&*()_-+=,:.]/g', '').toLowerCase().split(' ');
    };

    return snap.ref.update({
        companySearchable: makeSearchable(data.company),
        titleSearchable: makeSearchable(data.title),
        locationSearchable: makeSearchable(data.location),
    });
});

export {
    onUserSignup,
    onUserDeleted,
    addEvent,
    addJobs,
    getEvents,
    getJobs,
    updateEvents,
    updateEventField,
    deleteEvent,
    jobSearch,
    interviewQuestionSearch,
    purgeDeletedEvent,
    onJobCreate,
};

// Examples:
// Functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/functions/index.js
// Calling functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/public/js/app.js

// Docs:
// Calling functions docs: https://firebase.google.com/docs/functions/callable
// Auth triggers docs: https://firebase.google.com/docs/functions/auth-events
// Firestore triggers docs: https://firebase.google.com/docs/functions/firestore-events
