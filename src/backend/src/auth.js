const functions = require('firebase-functions');
const helpers = require('./helpers.js');

/**
 * Creates a new user (client-side registration is blocked)
 */
exports.createAccount = functions.https.onCall(async (credentials, context) => {
        // Verify input data
        if (!helpers.isValidObjectStructure(credentials, { email: '', password: '' })) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Signup data must be provided: { email: string, password: string }'
            );
        }

        // Create user (will throw an error if the email is already in use)
        return helpers.auth
            .createUser({
                email: credentials.email,
                emailVerified: false,
                password: credentials.password,
                disabled: false,
            })
            .then((userRecord) => {
                functions.logger.log(`Successfully created new user: ${userRecord.uid}`);
                return `Successfully created new user: ${userRecord.uid}`;
            })
            .catch((error) => {
                functions.logger.log(`Error creating new user: ${JSON.stringify(error)}`);

                if (error.code === 'auth/email-already-exists') {
                    throw new functions.https.HttpsError('already-exists', 'Email in use');
                }
                throw new functions.https.HttpsError('internal', 'Error creating account');
            });
    }
);

/**
 * When a user signs up, create a default document for them in firestore
 * and sends them a verification email
 */
exports.onUserSignup = functions.auth.user().onCreate(async (user) => {
    const promises = [];

    // Create a default db document for the user
    const defaultDoc = {};
    promises.push(
        helpers.getDoc(`users/${user.uid}`)
            .set(defaultDoc)
            .then(() => console.log(`Default db data successfully created for user: ${user.uid}`))
            .catch((err) => console.log(`Error creating default db data for ${user.uid}: ${err}`))
    );

    // Adds a verification email to the db (will be sent by the 'Trigger Email' extension)
    if (user.email == null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `User email is null: ${JSON.stringify(user, null, 4)}`
        );
    }
    const verifyLink = await helpers.auth
        .generateEmailVerificationLink(user.email)
        .then((link) => link);
    promises.push(
        helpers.getCollection('emails')
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
            .then(() => functions.logger.log(`Email successfully sent to: ${user.email}`))
            .catch((err) => functions.logger.log(`Error sending email: ${err}`))
    );

    return Promise.all(promises);
});

/**
 * When a user tries to sign in, verify that their email is verified
 */
exports.beforeSignIn = functions.auth.user().beforeSignIn((user) => {
    if (!user.emailVerified) {
        throw new functions.auth.HttpsError(
            'permission-denied',
            `The email "${user.email}" has not been verified. Please check your email`
        );
    }
});

/**
 * On account deletion, delete user data in db
 * (Note: don't delete multiple users at the same time with the admin SDK, this won't trigger)
 */
exports.onUserDeleted = functions.auth.user().onDelete((user) => {
    const promises = [];

    // Delete user's jobs
    helpers.getCollection('jobs')
        .where('userId', '==', user.uid)
        .get()
        .then((jobs) => {
            jobs.forEach((job) => promises.push(job.ref.delete()));
            return null;
        })
        .catch((err) => functions.logger.log(`Error deleting user's jobs: ${err}`));

    // Delete user's document
    promises.push(helpers.getDoc(`users/${user.uid}`).delete());

    return Promise.all(promises);
});
