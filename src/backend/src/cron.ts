import * as functions from 'firebase-functions';
import { getCollection, auth, getRelativeTimestamp } from './helpers';

/**
 * CRON jobs - automatically triggered on a set schedule
 */

/**
 * Removes users that have been unverified for at least a day.
 * If there's bugs, try:
 * https://github.com/firebase/functions-samples/blob/main/delete-unused-accounts-cron/functions/index.js
 */
const purgeUnverifiedUsers = functions.pubsub.schedule('every day 00:00').onRun(async () => {
    const unVerifiedUsers: string[] = [];

    // Go through users in batches of 1000
    const listAllUsers = (nextPageToken: string | undefined) => {
        return auth
            .listUsers(1000, nextPageToken)
            .then((listUsersResult) => {
                // Get unverified users
                listUsersResult.users.forEach((userRecord) => {
                    if (
                        !userRecord.emailVerified &&
                        new Date(userRecord.metadata.creationTime).getTime() <
                            Date.now() - 24 * 60 * 60 * 1000
                    ) {
                        unVerifiedUsers.push(userRecord.uid);
                    }
                });

                // List next page if it exists
                if (listUsersResult.pageToken) {
                    listAllUsers(listUsersResult.pageToken);
                }
                return null;
            })
            .catch((error) => {
                functions.logger.log('Error listing users:', error);
            });
    };
    await listAllUsers(undefined);

    return Promise.all(unVerifiedUsers.map((user) => auth.deleteUser(user)))
        .then(() =>
            functions.logger.log(`Successfully deleted ${unVerifiedUsers.length} unverified users`)
        )
        .catch((err) => functions.logger.log(`Failed to delete unverified users: ${err}`));
});

/**
 * Remove any old data in the db that's not needed anymore
 */
const purgeExpiredData = functions.pubsub.schedule('every day 00:00').onRun(async () => {
    // Remove jobs that have been deleted for 30 days
    const jobsToDelete: Promise<FirebaseFirestore.WriteResult>[] = [];
    getCollection('jobs')
        .where('deletedTime', '<', getRelativeTimestamp(30))
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                jobsToDelete.push(doc.ref.delete());
            });
            return null;
        })
        .catch((err) => functions.logger.log(`Error getting expired jobs from firestore: ${err}`));

    // Remove emails have been sent at least a day ago
    const emailsToDelete: Promise<FirebaseFirestore.WriteResult>[] = [];
    getCollection('emails')
        .where('delivery.state', '==', 'SUCCESS')
        .where('delivery.endTime', '<', getRelativeTimestamp(1))
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                emailsToDelete.push(doc.ref.delete());
            });
            return null;
        })
        .catch((err) => functions.logger.log(`Error getting sent emails from firestore: ${err}`));

    // Purge companies and locations that don't have a job associated with them
    const companiesToDelete: Promise<FirebaseFirestore.WriteResult>[] = [];
    getCollection('companies')
        .where('numJobs', '==', 0)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                companiesToDelete.push(doc.ref.delete());
            });
            return null;
        })
        .catch((err) => `Error getting company document: ${err}`);

    const locationsToDelete: Promise<FirebaseFirestore.WriteResult>[] = [];
    getCollection('locations')
        .where('numJobs', '==', 0)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                locationsToDelete.push(doc.ref.delete());
            });
            return null;
        })
        .catch((err) => `Error getting company document: ${err}`);

    // Make a response message and return all the promises
    let returnMessage = '';
    const getDelim = () => (returnMessage.length > 0 ? '. ' : '');

    if (jobsToDelete.length > 0) {
        returnMessage += `Successfully purged ${jobsToDelete.length} jobs (30+ days deleted)`;
    }
    if (emailsToDelete.length > 0) {
        returnMessage += `${getDelim()}Successfully purged ${
            emailsToDelete.length
        } emails (sent at least a day ago)`;
    }
    if (companiesToDelete.length > 0) {
        returnMessage += `${getDelim()}Successfully purged ${
            companiesToDelete.length
        } companies (no jobs associated)`;
    }
    if (locationsToDelete.length > 0) {
        returnMessage += `${getDelim()}Successfully purged ${
            locationsToDelete.length
        } locations (no jobs associated)`;
    }

    return Promise.all([jobsToDelete.flat(), emailsToDelete.flat()])
        .then(() =>
            functions.logger.log(returnMessage || 'No jobs or emails to purge from firestore')
        )
        .catch((err) => functions.logger.log(`Error purging deleted jobs: ${err}`));
});

const dataIntegrityCheck = functions.pubsub.schedule('every day 00:00').onRun(() => {
    functions.logger.log('Running data integrity check');

    // TODO (make sure that all db data makes sense (e.g. no users with more than the limit of jobs, no invalid ids, etc))
});

export { purgeUnverifiedUsers, purgeExpiredData, dataIntegrityCheck };
