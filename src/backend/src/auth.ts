import * as functions from 'firebase-functions';
import { getDoc, auth } from './helpers';

/**
 * Auth triggers - automatically triggered based on auth events
 */

// Send a verification email to the user when they create an account
// This makes it automatic and server-side, preventing any client-side exploits
const beforeCreate = functions.auth.user().beforeCreate((user, context) => {
    const locale = context.locale;
    if (user.email && !user.emailVerified) {
        // Send custom email verification on sign-up.
        return auth.generateEmailVerificationLink(user.email).then((link) => {
            return sendCustomVerificationEmail(user.email, link, locale);
        });
    }
});

// When a user signs up, create a default document for them in firestore
const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    const defaultDoc = {
        boards: {},
    };
    return getDoc(`users/${user.uid}`).set(defaultDoc);
});

// When a user tries to sign in, verify that their email is verified
const beforeSignIn = functions.auth.user().beforeSignIn((user) => {
    if (!user.emailVerified) {
        throw new functions.auth.HttpsError(
            'permission-denied',
            `The email "${user.email}" has not been verified. Please check your email`
        );
    }
});

// On account deletion, delete user data in db
// (Note: don't delete multiple users at the same time with the admin SDK, this won't trigger)
const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    const promises = [];

    // Delete user's jobs
    getDoc(`users/${user.uid}`)
        .get()
        .then((doc) => {
            const jobIds = Object.values(doc.data()?.boards).flat();
            jobIds.forEach((jobId) => {
                promises.push(getDoc(`jobs/${jobId}`).delete());
            });
        })
        .catch((err) => `Error getting user document: ${err}`);

    // Delete user's document
    promises.push(getDoc(`users/${user.uid}`).delete());

    return Promise.all(promises);
});

export { beforeCreate, onUserSignup, beforeSignIn, onUserDeleted };
