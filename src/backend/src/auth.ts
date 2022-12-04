import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';
import { getDoc } from './helpers';

/**
 * Auth triggers - automatically triggered when a user is created or deleted
 */

// When a user signs up, create a default document for them in firestore
const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    return getDoc(`users/${user.uid}`).set({ boards: {} });
});

// On account deletion, delete user data in db (note: don't delete multiple users at teh same time with the admin SDK)
const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    return getDoc(`users/${user.uid}`).delete();
});

export { onUserSignup, onUserDeleted };
