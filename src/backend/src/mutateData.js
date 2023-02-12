//import * as functions from 'firebase-functions';
const functions = require('firebase-functions');
// import {
//     db,
//     getCollection,
//     getDoc, getFirestoreTimestamp,
//     isValidObjectStructure,
//     verifyDocPermission,
//     verifyIsAuthenticated
// } from './helpers.js';
const helpers = require('./helpers.js');

/**
 * Callable functions for mutating data in firestore (creating, updating or deleting)
 */

// Adds a list of jobs to firestore
// This is only used for generating jobs in development
exports.addJobs = functions.https.onCall(async (data, context) => {
    helpers.verifyIsAuthenticated(context);

        for (const board of data.boards) {
            await helpers.getCollection('boards').add({ userId: board.userId, name: board.name }).then((doc) => {
                data.jobs.filter((job) => job.boardId === board.id).forEach((job) => {
                    job.boardId = doc.id;
                });
            });
        }

        // @ts-ignore
        data.jobs.forEach((job) => job.userId = context.auth.uid);

        // Add all the jobs to the db
        const jobsBatch = helpers.db.batch();
        data.jobs.forEach((job) => {
            jobsBatch.set(helpers.db.collection('jobs').doc(), job);
        });
        return jobsBatch
            .commit()
            .then(() => 'Jobs added successfully')
            .catch((err) => `Error adding jobs: ${err}`);
    }
);

// Adds a job to firestore (structuring and back-end stuff is done with a trigger)
exports.addJob = functions.https.onCall(async (jobData, context) => {
    const structure = {
        boardId: '',
        stage: 0
    };
    if (!helpers.isValidObjectStructure(jobData, structure)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a board id (string) and stage (number) as arguments'
        );
    }

    if (![0, 1, 2, 3].includes(jobData.stage)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide a valid stage (0, 1, 2 or 3)'
        );
    }

    await helpers.verifyDocPermission(context, `boards/${jobData.boardId}`);

    const defaultJob = {
        position: '',
        company: '',
        description: '',
        salary: '',
        location: '',
        link: '',
        notes: '',
        stage: jobData.stage,
        awaitingResponse: false,
        priority: '',

        deadlines: [],
        interviewQuestions: [],
        contacts: [],

        userId: context.auth.uid,
        boardId: jobData.boardId
    };

    return helpers.getCollection('jobs')
        .add(defaultJob)
        .then((docRef) => ({ ...defaultJob, id: docRef.id }))
        .catch((e) => `Failed to add job: ${JSON.stringify(e)}`);
});

exports.addDeadline = functions.https.onCall(async (deadline, context) => {
    await helpers.verifyDocPermission(context, `jobs/${deadline.jobId}`);

    return helpers.getCollection(`deadlines`)
        .add({ ...deadline, userId: context.auth.uid, date: helpers.getFirestoreTimestamp(deadline.date * 1000) })
        .then((result) => result.id)
        .catch((err) => `Failed to add deadline: ${err}`);
});

exports.addInterviewQuestion = functions.https.onCall(async (interviewQuestion, context) => {
    await helpers.verifyDocPermission(context, `jobs/${interviewQuestion.jobId}`);

    return helpers.getCollection(`interviewQuestions`)
        .add({ ...interviewQuestion, userId: context.auth.uid })
        .then((result) => result.id)
        .catch((err) => `Failed to add interview question: ${err}`);
});

exports.addContact = functions.https.onCall(async (contact, context) => {
    await helpers.verifyDocPermission(context, `jobs/${contact.jobId}`);

    return helpers.getCollection(`contacts`)
        .add({ ...contact, userId: context.auth.uid })
        .then((result) => result.id)
        .catch((err) => `Failed to add contact: ${err}`);
});

// Updates a job in firestore with the given data (fields not present in the header aren't overwritten)
exports.updateJob = functions.https.onCall(
    async (data, context) => {
        // Verify params
        let errMSg = '';
        if (!data) {
            errMSg = 'No data provided';
        } else if (!data.id) {
            errMSg = 'No job id provided';
        } else if (!data.tab) {
            errMSg = 'No tab number provided';
        } else if (!data.newFields) {
            errMSg = 'No new field(s) provided';
        }
        if (errMSg !== '') {
            throw new functions.https.HttpsError('invalid-argument', errMSg);
        }
        await helpers.verifyDocPermission(context, `jobs/${data.id}`);

        const updatePromises = [];
        switch (data.tab) {
            case 1:
                updatePromises.push(helpers.getDoc(`jobs/${data.id}`).update(data.newFields));
                break;
            case 2:
                updatePromises.push(helpers.getDoc(`jobs/${data.id}`).update({ notes: data.newFields }));
                break;
            case 3:
                // @ts-ignore
                data.newFields.forEach((deadline) => {
                    if (deadline.edited) {
                        updatePromises.push(helpers.getDoc(`deadlines/${deadline.id}`).update(deadline));
                    }
                });
                break;
            case 4:
                // @ts-ignore
                data.newFields.forEach((question) => {
                    if (question.edited) {
                        updatePromises.push(
                            helpers.getDoc(`interviewQuestions/${question.id}`).update(question)
                        );
                    }
                });
                break;
            case 5:
                // @ts-ignore
                data.newFields.forEach((contact) => {
                    if (contact.edited) {
                        updatePromises.push(helpers.getDoc(`contacts/${contact.id}`).update(contact));
                    }
                });
                break;
            default:
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    'Tab number must an integer between 1 and 5 inclusive'
                );
        }

        return Promise.all(updatePromises)
            .then(() => `Successfully updated job '${data.id}`)
            .catch((e) => `Failed to update job '${data.id}': ${JSON.stringify(e)}`);
    }
);

exports.dragKanbanJob = functions.https.onCall(
    async (data, context) => {
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

        await helpers.verifyDocPermission(context, `jobs/${data.id}`);

        return helpers.getDoc(`jobs/${data.id}`)
            .update({ stage: data.newStage })
            .then(() => `Successfully updated job stage`)
            .catch((err) => `Error updating job stage: ${err}`);
    }
);

// Deletes a job in firestore
exports.deleteJob = functions.https.onCall(async (data, context) => {
    await helpers.verifyDocPermission(context, `jobs/${data.id}`);

    return helpers.getDoc(`jobs/${data.id}`)
        .delete()
        .then(() => `Successfully deleted job '${data.id}'`)
        .catch((err) => `Error deleting job '${data.id}': ${err}`);
});

exports.addBoard = functions.https.onCall(async (data, context) => {
    if (!data) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'No board name provided'
        );
    }

    const newBoard = { name: data, userId: context.auth.uid };
    return helpers.getCollection('boards')
        .add({ name: data, userId: context.auth.uid })
        .then((result) => ({ id: result.id, name: newBoard.name }))
        .catch((e) => `Failed to create a board for user '${context.auth.uid}': ${JSON.stringify(e)}`);
});
