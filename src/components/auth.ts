import {
    createUserWithEmailAndPassword,
    deleteUser,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const signup = (email: string, password: string) => {
    // Validate email is entered and valid
    if (!email) {
        console.log('Error: email is empty');
        return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        console.log(`Error: email '${email}' is invalid`);
        return false;
    }

    // Validate password is entered and strong enough
    if (!password) {
        console.log('Error: password in empty');
        return false;
    }
    if (password.length < 8 || password.length > 40) {
        console.log('Error: password must be 8-40 characters long');
        return false;
    }

    let strength = 0;
    strength += password.match(/[A-Z]/) ? 1 : 0;
    strength += password.match(/[a-z]/) ? 1 : 0;
    strength += password.match(/\d/) ? 1 : 0;
    strength += password.match(/[~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>.?/]/) ? 1 : 0;
    if (strength < 3) {
        console.log(
            'Error: password is not strong enough. Passwords must contain at least 3 of the following: ' +
                'a) uppercase letter b) lowercase letter c) number ' +
                'd) special character (non-alphanumeric character on a regular keyboard)'
        );
        return false;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((r) => {
            console.log(
                `Sign up success (check your email):` +
                    `\nEmail: ${JSON.stringify(r.user.email)}` +
                    `\nID: ${JSON.stringify(r.user.uid)}`
            );
            sendEmailVerification(r.user)
                .then(() =>
                    console.log(
                        `Verification email sent successfully to ${r.user.email}`
                    )
                )
                .catch((e) =>
                    console.error(
                        `Error sending verification email to ${r.user.email}: ${e}`
                    )
                );
        })
        .catch((err) => console.log(`Failure: ${err}`));
    return true;
};

export const signin = (email: string, password: string) => {
    const user = auth.currentUser;
    if (user?.email === email) {
        console.log(`User ${user.email} is already signed in`);
        return;
    }
    if (user) {
        console.log(`Another user is already signed in: ${user.email}`);
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((r) =>
            console.log(
                `Sign in success:\nEmail: ${JSON.stringify(r.user.email)}` +
                    `\nID: ${JSON.stringify(r.user.uid)}`
            )
        )
        .catch((err) => {
            if (
                err.code === 'auth/user-not-found' ||
                err.code === 'auth/invalid-password'
            ) {
                console.log(
                    `Error: account ${email} does not exist or password is incorrect`
                );
            } else {
                console.log(`Failed to sign in, error: ${JSON.stringify(err)}`);
            }
        });
    return 1;
};

export const signout = () => {
    const user = auth.currentUser;

    if (user) {
        signOut(auth)
            .then(() => console.log(`Successfully signed out ${user.email}`))
            .catch((err) =>
                console.log(
                    `Failed to sign out ${user.email}: ${JSON.stringify(err)}`
                )
            );
        return 1;
    }
    console.log(`No user logged in, can't log out`);
};

export const deleteAccount = () => {
    const user = auth.currentUser;

    if (user) {
        deleteUser(user)
            .then(() => console.log(`Successfully deleted user ${user.email}`))
            .catch((error) =>
                console.log(
                    `Error deleting user ${user.email}: ${JSON.stringify(
                        error
                    )}`
                )
            );
        return 1;
    }
    console.log(`Error: no user logged in, cannot delete account`);
};

export const passwordResetEmail = () => {
    const user = auth.currentUser;
    if (!user) {
        console.log(`Error: no user signed in`);
        return;
    }
    if (!user.email) {
        console.log(`Error: email does not exist for user`);
        return;
    }

    sendPasswordResetEmail(auth, user.email)
        .then(() => console.log(`Password reset email sent to ${user.email}`))
        .catch((e) =>
            console.log(
                `Error sending password reset email to ${user.email}: ${e}`
            )
        );
    return 1;
};
