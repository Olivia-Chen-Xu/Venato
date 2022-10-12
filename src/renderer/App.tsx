import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import icon from '../../assets/icon.svg';
import './App.css';
import { auth } from '../config/firebase';

const email = '18rem8@queensu.ca';
const password = 'Username12345';

const signup = () => {
    // Validate email is entered and valid
    if (!email) {
        console.log('Error: email is empty');
        return;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        console.log(`Error: email '${email}' is invalid`);
        return;
    }

    // Validate password is entered and strong enough
    if (!password) {
        console.log('Error: password in empty');
        return;
    }
    if (password.length < 8 || password.length > 40) {
        console.log('Error: password must be 8-40 characters long');
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
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((r) =>
            console.log(
                `Sign up success:\nEmail: ${JSON.stringify(r.user.email)}` +
                    `\nID: ${JSON.stringify(r.user.uid)}`
            )
        )
        .catch((err) => console.log(`Failure: ${err}`));
};

const signin = () => {
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
        .catch((err) => console.log(`Failure: ${err}`));
};

const signout = () => {
    const user = auth.currentUser;

    if (user) {
        signOut(auth)
            .then(() => console.log(`Successfully signed out ${user.email}`))
            .catch((err) =>
                console.log(
                    `Failed to sign out ${user.email}: ${JSON.stringify(err)}`
                )
            );
    } else {
        console.log(`No user logged in, can't log out`);
    }
};

const deleteAccount = () => {
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
    } else {
        console.log(`Error: no user logged in, cannot delete account`);
    }
};

const Hello = () => {
    return (
        <div>
            <div className="Hello">
                <img width="200" alt="icon" src={icon} />
            </div>
            <h1>electron-react-boilerplate</h1>
            <div className="Hello">
                <a
                    href="https://electron-react-boilerplate.js.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <button type="button">
                        <span role="img" aria-label="books">
                            📚
                        </span>
                        Read our docs
                    </button>
                </a>
                <button type="submit" onClick={signup}>
                    Sign up
                </button>
                <button type="submit" onClick={signin}>
                    Sign in
                </button>
                <button type="submit" onClick={signout}>
                    Sign out
                </button>
                <button type="submit" onClick={deleteAccount}>
                    Delete account (must be signed in)
                </button>
                <a
                    href="https://github.com/sponsors/electron-react-boilerplate"
                    target="_blank"
                    rel="noreferrer"
                >
                    <button type="button">
                        <span role="img" aria-label="folded hands">
                            🙏
                        </span>
                        Donate
                    </button>
                </a>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hello />} />
            </Routes>
        </Router>
    );
}
