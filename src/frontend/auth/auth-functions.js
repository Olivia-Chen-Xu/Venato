import {
    deleteUser,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../../config/firebase';

export const signup = (email, password) => {
    // Validate email is entered and valid
    if (!email) {
        return 'Email is empty';
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return `Email '${email}' is invalid`;
    }

    // Validate password is entered and strong enough
    if (!password) {
        return 'Password in empty';
    }
    if (password.length < 8 || password.length > 40) {
        return 'Password must be 8-40 (inclusive) characters long';
    }

    let strength = 0;
    strength += password.match(/[A-Z]/) ? 1 : 0;
    strength += password.match(/[a-z]/) ? 1 : 0;
    strength += password.match(/\d/) ? 1 : 0;
    strength += password.match(/[~`!@#$%^&*()_\-+={}[\]|\\:;"'<,>.?/]/) ? 1 : 0;
    if (strength < 3) {
        return (
            'Password is not strong enough. Passwords must contain at least 3 of the following: ' +
            'a) uppercase letter b) lowercase letter c) number ' +
            'd) special character (non-alphanumeric character on a regular keyboard)'
        );
    }

    return httpsCallable(getFunctions(), 'createAccount')({ email, password });
};

export const signin = (email, password) => {
    // Pre-verify the data entered
    if (!email) {
        return 'Email is empty';
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return `Email '${email}' is invalid; check that you entered it correctly`;
    }
    if (!password) {
        return 'Password is empty';
    }

    return signInWithEmailAndPassword(auth, email, password);
};

export const signout = () => {
    const user = auth.currentUser;
    if (!user) {
        return `No user logged in, can't log out`;
    }

    return signOut(auth);
};

export const deleteAccount = () => {
    const user = auth.currentUser;
    if (!user) {
        return `Error: no user logged in, cannot delete account`;
    }

    return deleteUser(user);
};

export const passwordResetEmail = (email) => {
    // Pre-verify the data entered
    if (!email) {
        return 'Email is empty';
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return `Email '${email}' is invalid; check that you entered it correctly`;
    }

    return sendPasswordResetEmail(auth, email);
};
