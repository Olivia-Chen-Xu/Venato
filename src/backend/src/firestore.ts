import * as functions from 'firebase-functions';
import { firestoreHelper, getCollection, getDoc, getFirestoreTimestamp } from './helpers';

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
    const data = snap.data();
    const docId = context.params.jobId;
    const promises = [];

    // Add searchable job position field
    const positionSearchable = data.details.position
        .replace('/[!@#$%^&*()_-+=,:.]/g', '')
        .toLowerCase()
        .split(' ');
    promises.push(
        snap.ref.update({
            metaData: {
                userId: data.metaData.userId,
                positionSearchable,
                boardId: data.metaData.boardId
            }
        })
    );

    // Add company and location to db
    if (data.details.company !== '') {
        const companyDoc = await getDoc(`companies/${data.details.company}`)
            .get()
            .then((doc: any) => doc)
            .catch((err: any) => functions.logger.log(`Error getting company doc: ${err}`));
        if (companyDoc && companyDoc.exists) {
            promises.push(companyDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(1) }));
        } else {
            promises.push(getDoc(`companies/${data.details.company}`).set({ numJobs: 1 }));
        }
    }

    if (data.details.location !== '') {
        const locationDoc = await getDoc(`locations/${data.details.location}`)
            .get()
            .then((doc) => doc)
            .catch((err) => functions.logger.log(`Error getting location doc: ${err}`));
        if (locationDoc && locationDoc.exists) {
            promises.push(locationDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(1) }));
        } else {
            promises.push(getDoc(`locations/${data.details.location}`).set({ numJobs: 1 }));
        }
    }

    // Move the deadlines to its own collection
    const { deadlines } = data;
    promises.push(snap.ref.update({ deadlines: firestoreHelper.FieldValue.delete() }));

    deadlines.forEach(
        (deadline: { title: string; date: number; location: string; link: string }) => {
            const newDoc = {
                ...deadline,
                date: getFirestoreTimestamp(deadline.date),
                company: data.details.company,
                metaData: {
                    userId: data.metaData.userId,
                    jobId: docId
                }
            };
            promises.push(getCollection(`deadlines`).add(newDoc));
        }
    );

    // Move the interview questions to their own collection (with search params for easy querying)
    const { interviewQuestions } = data;
    promises.push(snap.ref.update({ interviewQuestions: firestoreHelper.FieldValue.delete() }));

    interviewQuestions.forEach((question: { name: string; description: string }) => {
        const newQuestion = {
            ...question,
            metaData: {
                userId: data.metaData.userId,
                jobId: docId,
                positionSearchable,
                company: data.details.company
            }
        };
        promises.push(getCollection(`interviewQuestions`).add(newQuestion));
    });

    // Move the contacts to their own collection
    const { contacts } = data;
    promises.push(snap.ref.update({ contacts: firestoreHelper.FieldValue.delete() }));

    contacts.forEach(
        (contact: {
            name: string;
            email: string;
            phone: string;
            company: string;
            linkedin: string;
            notes: string;
            title: string;
        }) => {
            const newContact = {
                ...contact,
                metaData: {
                    userId: data.metaData.userId,
                    jobId: docId
                }
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
    const promises: Promise<FirebaseFirestore.WriteResult>[] = [];
    const [id, userId, company, location, boardName] = [
        snap.id,
        snap.data().userId,
        snap.data().info.company,
        snap.data().info.location,
        snap.data().boardName
    ];

    // Remove the job id from the user's job board
    // TODO: this will fail since jobs don't have a board name. Maybe make a sub-collection or
    // another top-level collection for the job-board relationship?
    getCollection('boards')
        .where('userId', '==', userId)
        .where('name', '==', boardName)
        .get()
        .then((board) => {
            if (board.empty) {
                throw new functions.https.HttpsError(
                    'not-found',
                    `Error: job board ${boardName} not found for user ${userId}`
                );
            }

            if (board.docs.length > 1) {
                throw new functions.https.HttpsError(
                    'internal',
                    `Error: more than one job board named ${boardName} for user ${userId}`
                );
            }

            const doc = board.docs[0];
            if (doc.data().jobIds.length === 1 && doc.data().jobIds[0] === id) {
                promises.push(doc.ref.delete());
            } else {
                promises.push(doc.ref.update({ jobs: firestoreHelper.FieldValue.arrayRemove(id) }));
            }
            return null;
        })
        .catch((err) => functions.logger.log(`Error getting user boards to delete: ${err}`));

    // Decrement the company and location counters
    const companyDoc = await getDoc(`companies/${company}`)
        .get()
        .then((doc) => doc)
        .catch((err) => console.log(`Error getting company document: ${err}`));
    if (companyDoc && companyDoc.data()?.numJobs === 1) {
        promises.push(companyDoc.ref.delete());
    } else if (companyDoc && companyDoc.data()?.numJobs > 1) {
        promises.push(companyDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(-1) }));
    }

    const locationDoc = await getDoc(`locations/${location}`)
        .get()
        .then((doc) => doc)
        .catch((err) => console.log(`Error getting company document: ${err}`));
    if (locationDoc && locationDoc.data()?.numJobs === 1) {
        promises.push(locationDoc.ref.delete());
    } else if (locationDoc && locationDoc.data()?.numJobs > 1) {
        promises.push(
            locationDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(-1) })
        );
    }

    // Remove deadlines and interview questions for this job
    getCollection('deadlines')
        .where('jobId', '==', id)
        .get()
        .then((deadlines) => deadlines.forEach((deadline) => promises.push(deadline.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting deadlines: ${err}`));

    getCollection('interviewQuestions')
        .where('jobId', '==', id)
        .get()
        .then((questions) => questions.forEach((question) => promises.push(question.ref.delete())))
        .catch((err) => functions.logger.log(`Error getting interview questions: ${err}`));

    return Promise.all(promises);
});

export { onJobCreate, onJobPurge };
