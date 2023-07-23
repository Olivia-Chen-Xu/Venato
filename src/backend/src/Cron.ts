import * as functions from 'firebase-functions';
import {auth, getCollection, getRelativeTimestamp} from './Helpers';

/**
 * CRON jobs - automatically triggered on a set schedule
 */

const DayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const IsDaysOld = (date: string | number | Date, numDays: number) => new Date(date).getTime() < Date.now() - numDays * DayInMillis;


/**
 * Removes users that have been unverified for at least a day.
 * If there's bugs, try:
 * https://github.com/firebase/functions-samples/blob/main/delete-unused-accounts-cron/functions/index.js
 */
const purgeUnverifiedUsers = functions.pubsub.schedule('every day 00:00').onRun(async () => {
    const unverifiedUsers: string[] = [];

    // Go through users in batches of 1000
    const listAllUsers = (nextPageToken: string | undefined) => {
        return auth
            .listUsers(1000, nextPageToken)
            .then((listUsersResult) => {
                // Get unverified users
                listUsersResult.users.forEach((user) => {
                    if (!user.emailVerified && IsDaysOld(user.metadata.creationTime, 30)) {
                        unverifiedUsers.push(user.uid);
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

    return Promise.all(unverifiedUsers.map((user) => auth.deleteUser(user)))
        .then(() =>
            functions.logger.log(`Successfully deleted ${unverifiedUsers.length} unverified users`)
        )
        .catch((err) => functions.logger.log(`Failed to delete unverified users: ${err}`));
});

/**
 * Remove any old data in the db that's not needed anymore
 */
const purgeExpiredData = functions.pubsub.schedule('every day 00:00').onRun(async () => {
    // Remove emails have been sent at least a month ago
    const emailsToDelete: Promise<FirebaseFirestore.WriteResult>[] = [];
    getCollection('emails')
        .where('delivery.state', '==', 'SUCCESS')
        .where('delivery.endTime', '<', getRelativeTimestamp(30))
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                emailsToDelete.push(doc.ref.delete());
            });
            return null;
        })
        .catch((err) => functions.logger.log(`Error getting sent emails from firestore: ${err}`));

    let returnMessage = 'No emails to purge from firestore';
    if (emailsToDelete.length > 0) {
        returnMessage = `Successfully purged ${emailsToDelete.length} emails (sent at least 30 days ago)`;
    }

    return Promise.all(emailsToDelete)
        .then(() => functions.logger.log(returnMessage))
        .catch((err) => functions.logger.log(`Error purging deleted jobs: ${err}`));
});

export {purgeUnverifiedUsers, purgeExpiredData};
