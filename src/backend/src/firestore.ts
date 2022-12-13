import * as functions from 'firebase-functions';
import { firestoreHelper, getCollection, getDoc } from './helpers';

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
 * -Move interview question to it own collection and add the doc id to this job
 */
const onJobCreate = functions.firestore.document('jobs/{jobId}').onCreate((snap, context) => {
    const data = snap.data();
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
    promises.push(getDoc(`companies/${data.info.company}`).set({}));
    promises.push(getDoc(`locations/${data.info.location}`).set({}));

    // Move the interview question to its own collection (with the user and job id)
    const { deadlines } = data;
    promises.push(snap.ref.update({ deadlines: [] }));

    deadlines.forEach((deadline: { description: string; name: string }) => {
        promises.push(
            getCollection('deadlines')
                .add({ ...deadline, userId: data.userId, jobId: context.params.jobId })
                .then((docRef: { id: string }) => {
                    promises.push(
                        snap.ref.update({
                            deadlines: firestoreHelper.FieldValue.arrayUnion(docRef.id),
                        })
                    );
                    return null;
                })
        );
    });

    return Promise.all(promises);
});

// On job purge (removed by a CRON after being deleted for 30 days):
// - Remove the company and location from the db if no other jobs have that company/location
// - Remove the job from the user's job board
const onJobPurge = functions.firestore.document('jobs/{jobId}').onDelete((snap, context) => {
    const promises: Promise<FirebaseFirestore.WriteResult>[] = [];

    const [id, userId, company, location] = [
        snap.id,
        snap.data().userId,
        snap.data().info.company,
        snap.data().info.location,
    ];

    // Remove the company and location from the db if no other jobs have that company/location
    getCollection('companies')
        .where('__name__', '==', company)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                promises.push(getDoc(`companies/${company}`).delete());
            }
        })
        .catch((err) => `Error getting company document: ${err}`);

    getCollection('locations')
        .where('__name__', '==', location)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                promises.push(getDoc(`location/${location}`).delete());
            }
        })
        .catch((err) => `Error getting company document: ${err}`);

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

    return Promise.all(promises);
});

export { onJobCreate, onJobPurge };
