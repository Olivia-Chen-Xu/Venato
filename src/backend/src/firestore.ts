import * as functions from 'firebase-functions';
import {
    db,
    firestoreHelper,
    getDoc,
    getFirestoreTimestamp,
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
    promises.push(getDoc(`companies/${data.info.company}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                promises.push(doc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(1) }));
            } else {
                promises.push(getDoc(`companies/${data.info.company}`).set({ numJobs: 1 }));
            }
        })
        .catch((err) => `Error setting company doc: ${err}`)
    );
    promises.push(getDoc(`locations/${data.info.location}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                promises.push(doc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(1) }));
            } else {
                promises.push(getDoc(`locations/${data.info.location}`).set({ numJobs: 1 }));
            }
        })
        .catch((err) => `Error setting location doc: ${err}`)
    );

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
const onJobPurge = functions.firestore.document('jobs/{jobId}').onDelete((snap, context) => {
    const promises: Promise<FirebaseFirestore.WriteResult>[] = [];
    const [id, userId, company, location] = [
        snap.id, snap.data().userId, snap.data().company, snap.data().location
    ];

    // Remove the job id from the user's job board
    getDoc(`users/${userId}`)
        .get()
        .then((userDoc) => {
            interface Boards {
                [name: string]: string[];
            }
            const newBoards: Boards = userDoc.data()?.boards;

            Object.entries(newBoards).forEach((entry: [string, string[]]) => {
                const [key, values] = entry;
                if (values.includes(id)) {
                    newBoards[key as keyof Boards] = values.filter((jobId: string) => jobId !== id);
                }
            });
            promises.push(getDoc(`users/${userId}`).update({ boards: newBoards }));
        })
        .catch((err) => `Error getting user document: ${err}`);

    // Decrement the company and location counters
    getDoc(`companies/${company}`)
        .get()
        .then((companyDoc) => {
            promises.push(companyDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(-1) }));
        })
        .catch((err) => `Error getting company document: ${err}`);

    getDoc(`locations/${location}`)
        .get()
        .then((locationDoc) => {
            promises.push(locationDoc.ref.update({ numJobs: firestoreHelper.FieldValue.increment(-1) }));
        })
        .catch((err) => `Error getting location document: ${err}`);

    return Promise.all(promises);
});

export { onJobCreate, onJobPurge };
