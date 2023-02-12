const functions = require('firebase-functions');
// import {
//     firestoreHelper,
//     getCollection, getDoc,
//     getFirestoreTimestamp
// } from './helpers.js';
const helpers = require('./helpers.js');

/**
 * Firestore triggers - automatically triggered when a firestore document is changed
 *
 * e.g. When a document in /jobs/* is created, make a searchable field for the position and add the
 * company and location to a list of companies and locations respectively in firestore
 */

/**
 * On job create:
 * -Makes searchable fields for the job position
 * -Add company/location to db (if it doesn't already exist)
 * -Move deadlines, interview questions and contacts to sub-collections
 */
exports.onJobCreate = functions.firestore.document('jobs/{jobId}').onCreate(async (snap, context) => {
    const job = snap.data();
    const jobId = snap.id;
    const promises = [];

    // Move the deadlines to its own collection
    const deadlines = job.deadlines;
    promises.push(snap.ref.update({ deadlines: helpers.firestoreHelper.FieldValue.delete() }));

    deadlines.forEach(
        (deadline) => {
            const newDoc = {
                ...deadline,
                date: helpers.getFirestoreTimestamp(deadline.date),
                company: job.company,
                userId: job.priority,
                priority: job.priority,
                jobId: jobId,
            };
            promises.push(helpers.getCollection(`deadlines`).add(newDoc));
            throw new functions.https.HttpsError('invalid-argument', `does this throw? ${JSON.stringify(job)}\n${JSON.stringify(deadline)}`);
        }
    );

    // Move the interview questions to their own collection (with search params for easy querying)
    const interviewQuestions = job.interviewQuestions;
    promises.push(snap.ref.update({ interviewQuestions: helpers.firestoreHelper.FieldValue.delete() }));

    interviewQuestions.forEach((question) => {
        const newQuestion = {
            ...question,
            userId: job.userId,
            company: job.company,
            jobId: jobId,
        };
        promises.push(helpers.getCollection(`interviewQuestions`).add(newQuestion));
    });

    // Move the contacts to their own collection
    const contacts = job.contacts;
    promises.push(snap.ref.update({ contacts: helpers.firestoreHelper.FieldValue.delete() }));

    contacts.forEach(
        (contact) => {
            const newContact = {
                ...contact,
                userId: job.userId,
                jobId: jobId,
            };
            promises.push(helpers.getCollection(`contacts`).add(newContact));
        }
    );

    return Promise.all(promises);
});

/**
 * On job purge (removed by a CRON after being deleted for 30 days):
 * - Remove the company and location from the db if no other jobs have that company/location
 * - Remove the job from the user's job board
 * - Remove the deadlines and interview questions (in their own collection)
 */
exports.onJobPurge = functions.firestore.document('jobs/{jobId}').onDelete(async (snap, context) => {
    const jobId = snap.id;
    const promises = [];

    // Remove deadlines, interview questions and contacts for this job
    await helpers.getCollection('deadlines')
        .where('jobId', '==', jobId)
        .get()
        .then((deadlines) => deadlines.forEach((deadline) => promises.push(deadline.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting deadlines: ${err}`));

    await helpers.getCollection('interviewQuestions')
        .where('jobId', '==', jobId)
        .get()
        .then((questions) => questions.forEach((question) => promises.push(question.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting interview questions: ${err}`));

    await helpers.getCollection('contacts')
        .where('jobId', '==', jobId)
        .get()
        .then((contacts) => contacts.forEach((contact) => promises.push(contact.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting contacts: ${err}`));

    return Promise.all(promises);
});

exports.onBoardPurge = functions.firestore.document('boards/{boardId}').onDelete(async (snap, context) => {
    const boardId = snap.id;

    const promises = [];

    await helpers.getDoc(`users/${snap.data().userId}`)
        .get()
        .then((userDoc) => {
            if (!userDoc.exists) {
                return Promise.reject(`User ${snap.data().userId} does not exist`);
            }

            if (userDoc.data()?.kanbanBoard === boardId) {
                promises.push(userDoc.ref.update({ kanbanBoard: helpers.firestoreHelper.FieldValue.delete() }));
            }
            return null;
        })
        .catch((err) => functions.logger.log(`Error getting user: ${err}`));

    await helpers.getCollection('jobs')
        .where('boardId', '==', boardId)
        .get()
        .then((jobs) => jobs.forEach((job) => promises.push(job.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting jobs: ${err}`));

    return Promise.all(promises);
});
