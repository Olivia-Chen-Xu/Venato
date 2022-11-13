import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import { auth } from 'firebase-admin';

admin.initializeApp();

/**
 * Helper functions
 */

const getDoc = (doc: string) => {
    return admin.firestore().doc(doc);
};

const getCollection = (collection: string) => {
    return admin.firestore().collection(collection);
};

/**
 * Auth triggers - automatically triggered when a user is created/deleted
 */

// On account creation create a db collection for them with default data
const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    const defaultDocData = {
        email: user.email,
        name: user.displayName,
    };
    return getDoc(`users/${user.uid}`).set(defaultDocData);
});

// On account deletion, delete user data in db
const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    return getDoc(`users${user.uid}`).delete();
});

/**
 * Callable functions - must be invoked from within the app
 */

// Adds an event to the database
const addEvent = functions.https.onCall((data: object, context: any) => {
    return getCollection('events').add(data);
});

const addJobs = functions.https.onCall((data: [], context: any) => {
    const db = admin.firestore();
    const batch = db.batch();
    data.forEach((job: any) => {
        batch.set(db.collection('jobs').doc(), job);
    });
    return batch.commit();
});

const addJob = functions.https.onCall((data: object, context: any) => {
    return admin
        .firestore()
        .collection('jobs')
        .add(data)
        .then((docRef) => docRef.id)
        .catch((e) => `Failed to add job: ${JSON.stringify(e)}`);
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
        return getDoc(`events/${data.id}`).set(data.newObject);
    }
);

const updateEventField = functions.https.onCall(
    (data: { id: string; newFields: object }, context: any) => {
        return getDoc(`events/${data.id}`).update(data.newFields);
    }
);

const updateJobs = functions.https.onCall(
    (data: { id: string; newFields: object }, context: any) => {
        return getDoc(`jobs/${data.id}`).update(data.newFields);
    }
);

// Deactivates an event in the database (a trigger will delete it after)
const deleteEvent = functions.https.onCall((data: { id: string }, context: any) => {
    return getDoc(`events/${data.id}`).update({ toDelete: true });
});

const jobSearch = functions.https.onCall(
    (data: { company: string; position: string; location: string }, context: any) => {}
);

const getAllCompanies = functions.https.onCall((data: object, context: any) => {
    return admin
        .firestore()
        .collection('companies')
        .get()
        .then((companies) => companies.docs.map((company) => company.id))
        .catch((err) => err);
});

const getAllLocations = functions.https.onCall((data: object, context: any) => {
    return admin
        .firestore()
        .collection('locations')
        .get()
        .then((locations) => locations.docs.map((location) => location.id))
        .catch((err) => err);
});

const interviewQuestionSearch = functions.https.onCall(
    (data: { company: string; position: string; location: string }, context: any) => {
        return getCollection('jobs')
            .where('title', 'array-contains-any', data.company.toLowerCase().split(' '))
            .where('company', '==', data.company)
            .where('location', '==', data.location)
            .get()
            .then((jobs) => {
                const jobList: object[] = [];
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
    promises.push(getDoc(`companies/${data.company}`).set({}));

    // Add location to db if it doesn't exist
    promises.push(getDoc(`locations/${data.location}`).set({}));

    return Promise.all(promises);
});

export {
    onUserSignup,
    onUserDeleted,
    addEvent,
    addJobs,
    addJob,
    getEvents,
    getJobs,
    updateEvents,
    updateEventField,
    updateJobs,
    deleteEvent,
    jobSearch,
    getAllCompanies,
    getAllLocations,
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
