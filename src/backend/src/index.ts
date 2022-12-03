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

// Verify user is logged in and has access to the job
const verifyAuthentication = async (context: functions.https.CallableContext, jobId: string) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }
    await getDoc(`jobs/${jobId}`)
        .get()
        .then((doc) => {
            if (doc.data()?.userId !== context.auth?.uid) {
                throw new functions.https.HttpsError(
                    'permission-denied',
                    "You cannot edit this job as it doesn't belong to you"
                );
            }
        });
};

/**
 * Auth triggers - automatically triggered when a user is created/deleted
 */

// On account creation create a db collection for them with default data
const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    const defaultDocData = {
        boards: {},
    };
    return getDoc(`users/${user.uid}`).set(defaultDocData);
});

// On account deletion, delete user data in db (note: doesn't work if you delete multiple users at once with the admin SDK)
const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    return getDoc(`users/${user.uid}`).delete();
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
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }
    return getCollection('jobs')
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
    return getCollection('jobs')
        .where('userId', '==', context.auth.uid)
        .get()
        .then((jobs) => {
            const jobList: any = [];
            jobs.forEach((job) => {
                // Remove the query helper fields (positionSearchable, userId) and add the job id
                const jobData = job.data(); // TODO : inline this (can be cleaned up)
                delete jobData.positionSearchable;
                delete jobData.userId;
                jobData.id = job.id;

                jobList.push(jobData);
            });
            return jobList;
        })
        .catch((err) => `Error fetching user jobs: ${err}`);
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

const updateJob = functions.https.onCall(
    async (data: { id: string; newFields: object }, context: any) => {
        await verifyAuthentication(context, data.id);

        return getDoc(`jobs/${data.id}`).update(data.newFields);
    }
);

// Deactivates an event in the database (a trigger will delete it after)
const deleteEvent = functions.https.onCall((data: { id: string }, context: any) => {
    return getDoc(`events/${data.id}`).update({ toDelete: true });
});

const getCalendarEvents = functions.https.onCall((data: object, context: any) => {
    return getCollection('jobs')
        .get()
        .then((jobs) => {
            const events: { id: string; title: string; date: string }[] = [];
            jobs.docs.forEach((job) => {
                job.data().deadlines.forEach((event: { date: any }) => {
                    events.push({
                        id: job.id,
                        title: job.data().position,
                        date: event.date,
                    });
                });
            });
            return events;
        })
        .catch((err) => `Error getting events: ${err}`);
});

// For search
const getAllCompanies = functions.https.onCall((data: object, context: any) => {
    return getCollection('companies')
        .get()
        .then((companies) => companies.docs.map((company) => company.id))
        .catch((err) => err);
});

const getAllLocations = functions.https.onCall((data: object, context: any) => {
    return getCollection('locations')
        .get()
        .then((locations) => locations.docs.map((location) => location.id))
        .catch((err) => err);
});

const jobSearch = functions.https.onCall(
    (data: { company: string; position: string; location: string }, context: any) => {
        // Check which of the three inputs are given
        const queries: { position: boolean; company: boolean; location: boolean } = {
            position: (data.position?.trim()?.length || 0) !== 0,
            company: (data.company?.trim()?.length || 0) !== 0,
            location: (data.location?.trim()?.length || 0) !== 0,
        };
        if (!queries.position && !queries.company && !queries.location) {
            return 'No query specified';
        }

        // Build the query
        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = getCollection('jobs');
        if (queries.position) {
            query = query.where(
                'positionSearchable',
                'array-contains-any',
                data.position.toLowerCase().split(' ')
            );
        }
        if (queries.company) {
            query = query.where('info.company', '==', data.company);
        }
        if (queries.location) {
            query = query.where('info.location', '==', data.location);
        }

        // Execute and return the query
        return query
            .get()
            .then((jobs) => {
                const jobList: object[] = [];
                jobs.forEach((doc) => {
                    const job = doc.data();
                    delete job.positionSearchable;
                    delete job.userId;

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
    data.userID = context.auth?.uid;
    const promises = [];

    // Add searchable job position field and the company + location to db
    promises.push(
        snap.ref.update({
            positionSearchable: data.info.position
                .replace('/[!@#$%^&*()_-+=,:.]/g', '')
                .toLowerCase()
                .split(' '),
        })
    );
    promises.push(getDoc(`companies/${data.info.company}`).set({}));
    promises.push(getDoc(`locations/${data.info.location}`).set({}));

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
    updateJob,
    deleteEvent,
    getCalendarEvents,
    jobSearch,
    getAllCompanies,
    getAllLocations,
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
