import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import icon from '../../assets/icon.svg';
import './App.css';
import { auth } from '../config/firebase';

const Hello = () => {
    const signup = () => {
        const func = httpsCallable(getFunctions(), 'signup');
        func({
            email: '18rem8@queensu.ca',
            password: 'username12345',
            displayName: 'Reid Moffat',
        })
            .then((r) => console.log(`Sign up success: ${JSON.stringify(r)}`))
            .catch((err) => console.log(`Failure: ${err}`));
    };

    const signin = () => {
        signInWithEmailAndPassword(auth, '18rem8@queensu.ca', 'username12345')
            .then((r) => console.log(`Sign in success: ${JSON.stringify(r)}`))
            .catch((err) => console.log(`Failure: ${err}`));
    };

    const signout = () => {
        signOut(auth)
            .then((r) => console.log(`Sign out success: ${JSON.stringify(r)}`))
            .catch((err) => console.log(`Failure: ${err}`));
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
