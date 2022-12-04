import * as functions from 'firebase-functions';
import { getCollection, auth } from './helpers';

/**
 * CRON jobs - automatically triggered on a set schedule
 */

// For comparing times (date times are in milliseconds since the unix epoc)
const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

// Removes jobs that have been deleted for 30 days
const purgeExpiredData = functions.pubsub.schedule('every 24 hours').onRun((context) => {
    const toDelete: any[] = [];

    getCollection('jobs')
        .where('deletedTime', '<', Date.now() - 30 * oneDayInMilliseconds)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                toDelete.push(doc.ref.delete());
            });
        })
        .catch((err) => `Error getting expired jobs from firestore: ${err}`);

    return Promise.all(toDelete)
        .then(() => console.log(`Successfully purged ${toDelete.length} deleted jobs`))
        .catch((err) => console.log(`Error purging deleted jobs: ${err}`));
});

// Removes users that have been unverified for at least a day
const purgeUnverifiedUsers = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
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
                            Date.now() - oneDayInMilliseconds
                    ) {
                        unVerifiedUsers.push(userRecord.uid);
                    }
                });

                // List next page if it exists
                if (listUsersResult.pageToken) {
                    listAllUsers(listUsersResult.pageToken);
                }
            })
            .catch((error) => {
                console.log('Error listing users:', error);
            });
    };
    await listAllUsers(undefined);

    return Promise.all(unVerifiedUsers.map((user) => auth.deleteUser(user)))
        .then(() => console.log(`Successfully deleted ${unVerifiedUsers.length} users`))
        .catch((err) => console.log(`Failed to delete unverified users: ${err}`));
});

export { purgeExpiredData, purgeUnverifiedUsers };
