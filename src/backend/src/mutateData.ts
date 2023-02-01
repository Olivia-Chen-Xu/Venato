import * as functions from 'firebase-functions';
import {
    getDoc,
    getCollection,
    verifyIsAuthenticated,
    verifyDocPermission,
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
        const jobs = await getCollection('jobs').get();

        if (jobs.empty) {
            throw new functions.https.HttpsError(
                'not-found',
                'Error: no jobs in the db (not added correctly?)'
            );
        }

        const batch2 = db.batch();
        for (let i = 0; i < data.users.length; ++i) {
            const userJobs = jobs.docs
                .filter((job) => job.data().metaData.userId === data.users[i])
                .map((job) => ({
                    id: job.id,
                    board: Math.floor(Math.random() * 3),
                    company: job.data().details.company,
                    position: job.data().details.position,
                    stage: job.data().status.stage,
                }));
            const boards: {
                [name: string]: {
                    id: string;
                    board: number;
                    company: string;
                    position: string;
                    stage: number;
                }[];
            } = {
                'Summer 2021 internships': userJobs.filter((job) => job.board === 0),
                'Summer 2022 internships': userJobs.filter((job) => job.board === 1),
                'Summer 2023 internships': userJobs.filter((job) => job.board === 2),
            };

            for (const name of Object.keys(boards)) {
                const boardId = await getCollection('boards')
                    .add({
                        name,
                        userId: data.users[i],
                    })
                    .then((doc) => doc.id);

                boards[name].forEach((job) => {
                    batch2.update(getDoc(`jobs/${job.id}`), { [`metaData.boardId`]: boardId });
                });
            }
        }

        return batch2
            .commit()
            .then(() => `Successfully added jobs`)
            .catch((err) => `Error adding job boards: ${err}`);
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
        await verifyDocPermission(context, `jobs/${data.id}`);
        return getDoc(`jobs/${data.id}`).update(data.newFields);
    }
);

const dragKanbanJob = functions.https.onCall(
    async (data: { id: string; newStage: number }, context: any) => {
        if (!data || !data.hasOwnProperty('id') || !data.hasOwnProperty('newStage')) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'A job id and new stage is required'
            );
        }
        if (data.newStage < 0 || data.newStage > 3) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Invalid job stage (must be between 0 and 3 inclusive)'
            );
        }

        await verifyDocPermission(context, `jobs/${data.id}`);

        return getDoc(`jobs/${data.id}`)
            .update({ [`status.stage`]: data.newStage })
            .then(() => `Successfully updated job stage`)
            .catch((err) => `Error updating job stage: ${err}`);
    }
);

// Deactivates a job in firestore (it's NOT removed, it can still be restored since just a flag is set)
// In 30 days, a CRON job will permanently remove it from firestore
const deleteJob = functions.https.onCall(async (data: { id: string }, context: any) => {
    await verifyDocPermission(context, `jobs/${data.id}`);
    return getDoc(`jobs/${data.id}`).update({ deletedTime: getRelativeTimestamp(0) });
});

// Adds an empty job board to firestore
const addJobBoard = functions.https.onCall((data: { name: string }, context: any) => {
    verifyIsAuthenticated(context);
    return getCollection('boards').add({ jobs: [], name: data.name, userID: context.auth.uid });
});

export { addJobs, addJob, updateJob, dragKanbanJob, deleteJob, addJobBoard };
