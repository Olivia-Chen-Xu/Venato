import * as functions from 'firebase-functions';
import {
    getDoc,
    getCollection,
    verifyIsAuthenticated,
    verifyJobPermission,
    db,
    getRelativeTimestamp,
} from './helpers';

/**
 * Callable functions for mutating data in firestore (creating, updating or deleting)
 */

// Adds a list of jobs to firestore
// This is only used for generating jobs in development
const addJobs = functions.https.onCall(
    async (data: { jobs: object[]; users: string[] }, context: any) => {
        verifyIsAuthenticated(context);

        // Add all the jobs to the db
        const batch = db.batch();
        data.jobs.forEach((job: any) => {
            batch.set(db.collection('jobs').doc(), job);
        });
        await batch
            .commit()
            .then(() => 'Jobs added successfully')
            .catch((err) => `Error adding jobs: ${err}`);

        // Generate job boards
        const promises = [];
        promises.push(
            getCollection('jobs')
                .get()
                .then((jobs) => {
                    if (jobs.empty) {
                        throw new functions.https.HttpsError(
                            'not-found',
                            'Error: no jobs in the db (not added correctly?)'
                        );
                    }

                    for (let i = 0; i < data.users.length; ++i) {
                        const userJobs = jobs.docs
                            .filter((job) => job.data().userId === data.users[i])
                            .map((job) => ({ id: job.id, board: Math.floor(Math.random() * 3) }));
                        const boards: { [name: string]: { id: string; board: number }[] } = {
                            'Summer 2021 internships': userJobs.filter((job) => job.board === 0),
                            'Summer 2022 internships': userJobs.filter((job) => job.board === 1),
                            'Summer 2023 internships': userJobs.filter((job) => job.board === 2),
                        };

                        for (const name of Object.keys(boards)) {
                            promises.push(
                                getCollection('boards').add({
                                    name,
                                    jobs: boards[name].map((job) => job.id),
                                    userId: data.users[i],
                                })
                            );
                        }
                    }
                })
                .catch((err) => functions.logger.log(`Error adding jobs: ${err}`))
        );
        return Promise.all(promises);
    }
);

// Adds a job to firestore (structuring and back-end stuff is done with a trigger)
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
