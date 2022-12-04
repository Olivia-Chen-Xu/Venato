import * as functions from 'firebase-functions';
import { getDoc, getCollection, verifyIsAuthenticated, verifyJobPermission, db } from './helpers';

/**
 * Callable functions for mutating data in firestore (creating, updating or deleting)
 */

// Adds a list of jobs to firestore
// This is only used for generating jobs in development
const addJobs = functions.https.onCall((data: [], context: any) => {
    verifyIsAuthenticated(context);

    const batch = db.batch();
    data.forEach((job: any) => {
        batch.set(db.collection('jobs').doc(), job);
    });
    return batch.commit();
});

// Adds a job to firestore
const addJob = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    return getCollection('jobs')
        .add(data)
        .then((docRef) => docRef.id)
        .catch((e) => `Failed to add job: ${JSON.stringify(e)}`);
});

// Updates a job in firestore with the given data (fields not present in the header aren't overwritten)
const updateJob = functions.https.onCall(
    async (data: { id: string; newFields: object }, context: any) => {
        await verifyJobPermission(context, data.id);
        return getDoc(`jobs/${data.id}`).update(data.newFields);
    }
);

// Deactivates a job in firestore (it's NOT removed, it can still be restored since just a flag is set)
// In 30 days, a CRON job will permanently remove it from firestore
const deleteJob = functions.https.onCall(async (data: { id: string }, context: any) => {
    await verifyJobPermission(context, data.id);
    return getDoc(`jobs/${data.id}`).update({ deleted: true });
});

export { addJobs, addJob, updateJob, deleteJob };
