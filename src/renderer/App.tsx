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

const Hello = () => {
    const email = '18rem8@queensu.ca';
    const password = 'username12345';

    const signup = () => {
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
        signOut(auth)
            .then((r) => console.log(`Sign out success: ${JSON.stringify(r)}`))
            .catch((err) => console.log(`Failure: ${JSON.stringify(err)}`));
    };

    const deleteAccount = () => {
        const user = auth.currentUser;

        if (user) {
            deleteUser(user)
                .then(() =>
                    console.log(`Successfully deleted user ${user.email}`)
                )
                .catch((error) =>
                    console.log(
                        `Error deleting user ${user.email}: ${JSON.stringify(
                            error
                        )}`
                    )
                );
        } else {
            console.log(`Error: no user logged in`);
        }
    };

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
