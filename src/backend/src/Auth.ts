import * as functions from 'firebase-functions';
import { getCollection, getDoc, auth, isValidObjectStructure } from './Helpers';

/**
 * Creates a new user (client-side registration is blocked)
 */
const createAccount = functions.https.onCall(async (credentials: { email: string; password: string }, context) => {
        // Verify input data
        if (!isValidObjectStructure(credentials, { email: '', password: '' })) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Signup data must be provided: { email: string, password: string }'
            );
        }

        // Create user (will throw an error if the email is already in use)
        return auth
            .createUser({
                email: credentials.email,
                emailVerified: false,
                password: credentials.password,
                disabled: false,
            })
            .then(() => {
                return `Successfully created new user`;
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-exists') {
                    throw new functions.https.HttpsError('already-exists', `Email ${credentials.email} in use`);
                }

                functions.logger.log(`Error creating new user (not including email in use): ${JSON.stringify(error)}`);
                throw new functions.https.HttpsError('internal', `Error creating account - please try again later`);
            });
    }
);

/**
 * When a user signs up, create a default document for them in firestore
 * and sends them a verification email
 */
const onUserSignup = functions.auth.user().onCreate(async (user) => {
    if (user.email == null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `User email is null: ${JSON.stringify(user, null, 4)}`
        );
    }

    const promises = [];

    // Create a default db document for the user
    const defaultDoc = {};
    promises.push(
        getDoc(`users/${user.uid}`)
            .set(defaultDoc)
            .then(() => functions.logger.log(`Default db data successfully created for user: ${user.uid}`))
            .catch((err) => functions.logger.log(`Error creating default db data for ${user.uid}: ${err}`))
    );

    // Adds a verification email to the db (will be sent by the 'Trigger Email' extension)
    const verifyLink = await auth
        .generateEmailVerificationLink(user.email)
        .then((link) => link)
        .catch((err) => `Error generating verification link: ${err}`);
    promises.push(
        getCollection('emails')
            .add({
                to: user.email,
                message: {
                    subject: 'Verify your email for Venato',
                    html: `<p style="font-size: 16px;">Thanks for signing up!</p>
                           <p style="font-size: 16px;">Verify your account here: ${verifyLink}</p>
                           <p style="font-size: 12px;">If you didn't sign up, please disregard this email</p>
                           <p style="font-size: 12px;">Best Regards,</p>
                           <p style="font-size: 12px;">-The Venato Team</p>`,
                },
            })
            .then(() => functions.logger.log(`Verification email successfully sent to: ${user.email}`))
            .catch((err: string) => functions.logger.log(`Error sending verification email to ${user.email}: ${err}`))
    );

    return Promise.all(promises)
        .catch((err) => functions.logger.log(`Error creating user: ${JSON.stringify(err, null, 4)}`));
});

/**
 * When a user tries to sign in, verify that their email is verified
 */
const beforeSignIn = functions.auth.user().beforeSignIn((user) => {
    if (!user.emailVerified) {
        throw new functions.auth.HttpsError(
            'permission-denied',
            `The email "${user.email}" has not been verified. Please check your email`
        );
    }
});

/**
 * Sends a password reset email
 */
const passwordReset = functions.https.onCall(async (email: string, context) => {
    const link = await auth
        .generatePasswordResetLink(email)
        .then((link) => link)
        .catch((err) => `Error generating password reset link: ${err}`);

    return getCollection('emails')
        .add({
            to: email,
            message: {
                subject: 'Reset your Venato password',
                html: `<p style="font-size: 16px;">Reset your password with this link: ${link}</p>
                       <p style="font-size: 12px;">If you didn't request this, please disregard this email</p>
                       <p style="font-size: 12px;">Best Regards,</p>
                       <p style="font-size: 12px;">-The Venato Team</p>`,
            }
        })
        .then(() => `Password reset email successfully sent to ${email}`)
        .catch((err) => {
            functions.logger.log(`Error generating password reset email for ${email}: ${err}`);
            return `Error sending password reset email - please try again later`;
        });
});

/**
 * On account deletion, delete user data in db
 * (Note: don't delete multiple users at the same time with the admin SDK, this won't trigger)
 */
const onUserDeleted = functions.auth.user().onDelete((user) => {
    const promises = [];

    // Delete user's jobs
    getCollection('jobs')
        .where('userId', '==', user.uid)
        .get()
        .then((jobs) => {
            jobs.forEach((job) => promises.push(job.ref.delete()));
            return null;
        })
        .catch((err) => functions.logger.log(`Error deleting user's jobs: ${err}`));

    // Delete user's document
    promises.push(getDoc(`users/${user.uid}`).delete());

    return Promise.all(promises);
});

export { createAccount, onUserSignup, beforeSignIn, passwordReset, onUserDeleted };
