import * as functions from 'firebase-functions';
import { getDoc } from './helpers';

/**
 * Firestore triggers - automatically triggered when a firestore document is changed
 *
 * e.g. When a document in /jobs/* is created, make a searchable field for the position and add the
 * company and location to a list of companies and locations respectively in firestore
 */

// Makes searchable fields for the jobs on create and add company/location to db
const onJobCreate = functions.firestore.document('jobs/{jobId}').onCreate((snap, context) => {
    const data = snap.data();
    data.userID = context.auth?.uid;
    const promises = [];

    // Add searchable job position field and the company + location to db
    promises.push(
        snap.ref.update({
            positionSearchable: data.info.position
                .replace('/[!@#$%^&*()_-+=,:.]/g', '')
                .toLowerCase()
                .split(' '),
        })
    );
    promises.push(getDoc(`companies/${data.info.company}`).set({}));
    promises.push(getDoc(`locations/${data.info.location}`).set({}));

    return Promise.all(promises);
});

// On job purge (CRON job removed it after 30 days deleted):
// - Remove the company and location from the db if no other jobs have that company/location
// - Remove the job from the user's job board
const onJobPurge = functions.firestore.document('jobs/{jobId}').onDelete((snap, context) => {
    // TODO
});

export { onJobCreate, onJobPurge };
