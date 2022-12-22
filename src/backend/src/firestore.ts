import * as functions from 'firebase-functions';
import { db, firestoreHelper, getCollection, getDoc, getFirestoreTimestamp } from './helpers';

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
 * -Move deadlines to sub-collection
 */
const onJobCreate = functions.firestore.document('jobs/{jobId}').onCreate(async (snap, context) => {
    const data = snap.data();
    const docId = context.params.jobId;
    const promises = [];

    // Add searchable job position field
    promises.push(
        snap.ref.update({
            positionSearchable: data.info.position
                .replace('/[!@#$%^&*()_-+=,:.]/g', '')
                .toLowerCase()
                .split(' '),
        })
    );

    // Add company and location to db
    const companyDoc = await getDoc(`companies/${data.info.company}`)
        .get()
        .then((doc) => doc)
        .catch((err) => console.log(`Error getting company doc: ${err}`));
    if (companyDoc && companyDoc.exists) {
        promises.push(companyDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(1) }));
    } else {
        promises.push(getDoc(`companies/${data.info.company}`).set({ numJobs: 1 }));
    }

    const locationDoc = await getDoc(`locations/${data.info.location}`)
        .get()
        .then((doc) => doc)
        .catch((err) => console.log(`Error getting location doc: ${err}`));
    if (locationDoc && locationDoc.exists) {
        promises.push(locationDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(1) }));
    } else {
        promises.push(getDoc(`locations/${data.info.location}`).set({ numJobs: 1 }));
    }

    // Move the deadlines to sub-collection
    const { deadlines } = data;
    promises.push(snap.ref.update({ deadlines: firestoreHelper.FieldValue.delete() }));

    const batch = db.batch();
    deadlines.forEach((deadline: { title: string; date: number; location: string }) => {
        const newDoc = {
            ...deadline,
            userId: data.userId,
            date: getFirestoreTimestamp(deadline.date),
        }; // userId added for easier querying
        batch.set(db.collection(`jobs/${docId}/deadlines`).doc(), newDoc);
    });
    promises.push(batch.commit());

    return Promise.all(promises);
});

/**
 * On job purge (removed by a CRON after being deleted for 30 days):
 * - Remove the company and location from the db if no other jobs have that company/location
 * - Remove the job from the user's job board
 */
const onJobPurge = functions.firestore.document('jobs/{jobId}').onDelete(async (snap, context) => {
    const promises: Promise<FirebaseFirestore.WriteResult>[] = [];
    const [id, userId, company, location, boardName] = [
        snap.id,
        snap.data().userId,
        snap.data().info.company,
        snap.data().info.location,
        snap.data().boardName,
    ];

    // Remove the job id from the user's job board
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
                    `Error: more than one job board ${boardName} for user ${userId}`
                );
            }

            board.docs[0].ref.update({ jobs: firestoreHelper.FieldValue.arrayRemove(id) });
        })
        .catch((err) => console.log(`Error getting user boards to delete: ${err}`));

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
        promises.push(locationDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(-1) }));
    }

    return Promise.all(promises);
});

export { onJobCreate, onJobPurge };
