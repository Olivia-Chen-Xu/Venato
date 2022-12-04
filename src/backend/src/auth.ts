import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';
import { getDoc } from './helpers';

/**
 * Auth triggers - automatically triggered when a user is created or deleted
 */

// When a user signs up, create a default document for them in firestore
const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    const defaultDoc = {
        boards: {}
    };
    return getDoc(`users/${user.uid}`).set(defaultDoc);
});

// On account deletion, delete user data in db (note: don't delete multiple users at the same time with the admin SDK)
const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    // TODO: Delete all jobs this user has created
    return getDoc(`users/${user.uid}`).delete();
});

export { onUserSignup, onUserDeleted };
