import * as functions from 'firebase-functions';
import {
    firestoreHelper,
    getCollection, getDoc,
    getFirestoreTimestamp
} from './helpers';

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
const onJobCreate = functions.firestore.document('jobs/{jobId}').onCreate(async (snap, context) => {
    // @ts-ignore
    const job: IJob = snap.data();
    const jobId = snap.id;
    const promises: Promise<any>[] = [];

    // Move the deadlines to its own collection
    const deadlines = job.deadlines;
    promises.push(snap.ref.update({ deadlines: firestoreHelper.FieldValue.delete() }));

    deadlines.forEach(
        (deadline: IDeadline) => {
            const newDoc = {
                ...deadline,
                date: getFirestoreTimestamp(deadline.date),
                company: job.company,
                userId: job.userId,
                jobId: jobId,
            };
            promises.push(getCollection(`deadlines`).add(newDoc));
        }
    );

    // Move the interview questions to their own collection (with search params for easy querying)
    const interviewQuestions = job.interviewQuestions;
    promises.push(snap.ref.update({ interviewQuestions: firestoreHelper.FieldValue.delete() }));

    interviewQuestions.forEach((question: IInterviewQuestion) => {
        const newQuestion = {
            ...question,
            userId: job.userId,
            company: job.company,
            jobId: jobId,
        };
        promises.push(getCollection(`interviewQuestions`).add(newQuestion));
    });

    // Move the contacts to their own collection
    const contacts = job.contacts;
    promises.push(snap.ref.update({ contacts: firestoreHelper.FieldValue.delete() }));

    contacts.forEach(
        (contact: IContact) => {
            const newContact = {
                ...contact,
                userId: job.userId,
                jobId: jobId,
            };
            promises.push(getCollection(`contacts`).add(newContact));
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
const onJobPurge = functions.firestore.document('jobs/{jobId}').onDelete(async (snap, context) => {
    const jobId = snap.id;
    const promises: Promise<FirebaseFirestore.WriteResult>[] = [];

    // Remove deadlines, interview questions and contacts for this job
    await getCollection('deadlines')
        .where('jobId', '==', jobId)
        .get()
        .then((deadlines) => deadlines.forEach((deadline) => promises.push(deadline.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting deadlines: ${err}`));

    await getCollection('interviewQuestions')
        .where('jobId', '==', jobId)
        .get()
        .then((questions) => questions.forEach((question) => promises.push(question.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting interview questions: ${err}`));

    await getCollection('contacts')
        .where('jobId', '==', jobId)
        .get()
        .then((contacts) => contacts.forEach((contact) => promises.push(contact.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting contacts: ${err}`));

    return Promise.all(promises);
});

const onBoardPurge = functions.firestore.document('boards/{boardId}').onDelete(async (snap, context) => {
    const boardId = snap.id;

    const promises: Promise<FirebaseFirestore.WriteResult>[] = [];

    await getDoc(`users/${snap.data().userId}`)
        .get()
        .then((userDoc) => {
            if (!userDoc.exists) {
                return Promise.reject(`User ${snap.data().userId} does not exist`);
            }

            if (userDoc.data()?.kanbanBoard === boardId) {
                promises.push(userDoc.ref.update({ kanbanBoard: firestoreHelper.FieldValue.delete() }));
            }
            return null;
        })
        .catch((err) => functions.logger.log(`Error getting user: ${err}`));

    await getCollection('jobs')
        .where('boardId', '==', boardId)
        .get()
        .then((jobs) => jobs.forEach((job) => promises.push(job.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting jobs: ${err}`));

    return Promise.all(promises);
});

export { onJobCreate, onJobPurge, onBoardPurge };
