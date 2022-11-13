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
        .then((jobs) => {
            const jobList: any = [];
            jobs.forEach((job) => {
                // Remove the searchable fields (not required) and add the id
                const jobData = job.data();
                delete jobData.companySearchable;
                delete jobData.locationSearchable;
                delete jobData.titleSearchable;
                jobData.id = job.id;

                jobList.push(jobData);
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

const updateJobs = functions.https.onCall(
    (data: { id: string; newFields: object }, context: any) => {
        return admin.firestore().doc(`jobs/${data.id}`).update(data.newFields);
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
    const promises = [];

    // Add searchable fields
    const makeSearchable = (str: string) => {
        return str.replace('/[!@#$%^&*()_-+=,:.]/g', '').toLowerCase().split(' ');
    };
    promises.push(
        snap.ref.update({
            titleSearchable: makeSearchable(data.title),
        })
    );

    // Add company to db if it doesn't exist
    promises.push(admin.firestore().doc(`companies/${data.company}`).set({}));
    // const companyExists = admin
    //     .firestore()
    //     .collection('companies')
    //     .where('name', '==', data.company)
    //     .get()
    //     .then((snapshot) => !snapshot.empty)
    //     .catch((err) => `Error checking if company exists: ${err}`);
    // if (!companyExists) {
    //     promises.push(admin.firestore().collection('companies').add({ name: data.company }));
    // }

    // Add location to db if it doesn't exist
    promises.push(admin.firestore().doc(`locations/${data.location}`).set({}));
    // const locationExists = admin
    //     .firestore()
    //     .collection('locations')
    //     .where('name', '==', data.location)
    //     .get()
    //     .then((snapshot) => !snapshot.empty)
    //     .catch((err) => `Error checking if location exists: ${err}`);
    // if (!locationExists) {
    //     promises.push(admin.firestore().collection('locations').add({ name: data.location }));
    // }

    return Promise.all(promises);
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
    updateJobs,
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
