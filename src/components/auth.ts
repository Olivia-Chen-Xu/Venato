import {
    createUserWithEmailAndPassword,
    deleteUser,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const signup = (email: string, password: string) => {
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

    return createUserWithEmailAndPassword(auth, email, password);
};

export const signin = (email: string, password: string) => {
    // Make sure there isn't someone signed in already
    const user = auth.currentUser;
    if (user?.email === email) {
        return `User ${user.email} is already signed in`;
    }
    if (user) {
        return `Another user is already signed in: ${user.email}`;
    }

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
    if (password.length < 8 || password.length > 40) {
        return 'Password is invalid (must be 8-40 characters long); check that you entered it correctly';
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

export const passwordResetEmail = (email: string) => {
    // Pre-verify the data entered
    if (!email) {
        return 'Email is empty';
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return `Email '${email}' is invalid; check that you entered it correctly`;
    }

    return sendPasswordResetEmail(auth, email);
};
