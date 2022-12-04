import * as functions from 'firebase-functions';
import { getDoc, getCollection, verifyAuthentication, db } from './helpers';

/**
 * Callable functions for mutating data in firestore (creating, updating or deleting)
 */

const addEvent = functions.https.onCall((data: object, context: any) => {
    return getCollection('events').add(data);
});

const addJobs = functions.https.onCall((data: [], context: any) => {
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

// Deactivates a job in firestore (it's NOT removed, it can still be restored since just a flag is set)
// In 30 days, a CRON job will permanently remove it from firestore
const deleteJob = functions.https.onCall((data: { id: string }, context: any) => {
    return getDoc(`jobs/${data.id}`).update({ deleted: true });
});

export { addEvent, addJobs, addJob, updateEvents, updateEventField, updateJob, deleteJob };
