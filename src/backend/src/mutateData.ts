import * as functions from 'firebase-functions';
import {
    getDoc,
    getCollection,
    verifyIsAuthenticated,
    verifyJobPermission,
    db,
    getRelativeTimestamp
} from './helpers';

/**
 * Callable functions for mutating data in firestore (creating, updating or deleting)
 */

// Adds a list of jobs to firestore
// This is only used for generating jobs in development
const addJobs = functions.https.onCall(async (data: { jobs: {}[], users: string[] }, context: any) => {
    verifyIsAuthenticated(context);

    const batch = db.batch();
    data.jobs.forEach((job: any) => {
        batch.set(db.collection('jobs').doc(), job);
    });
    await batch
        .commit()
        .then(() => 'Jobs added successfully')
        .catch((err) => `Error adding jobs: ${err}`);

    const promises = [];
    promises.push(getCollection('jobs')
        .get()
        .then((jobs) => {
            if (jobs.empty) {
                throw new functions.https.HttpsError(
                    'not-found',
                    'Error: no jobs in the db (not added correctly?)'
                );
            }

            const boards = ['Summer 2021 internships', 'Summer 2022 internships', 'Summer 2023 internships'];
            const jobIds = jobs.docs.map((job) => job.id);
            jobIds.forEach((job) => {
                const userId = data.users[~~(Math.random() * data.users.length)];
                const board = boards[~~(Math.random() * boards.length)];

                promises.push(getDoc(`users/${userId}`)
                    .get()
                    .then((doc) => {
                        doc.ref.update({ boards: board });
                    })
                    .catch()
                );
            });
        })
        .catch()
    );
    return Promise.all(promises);
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
    return getDoc(`jobs/${data.id}`).update({ deletedTime: getRelativeTimestamp(0) });
});

export { addJobs, addJob, updateJob, deleteJob };
