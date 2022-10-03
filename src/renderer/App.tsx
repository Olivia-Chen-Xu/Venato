import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import icon from '../../assets/icon.svg';
import './App.css';
import '../config/firebase';

const Hello = () => {
    const signUp = () => {
        const func = httpsCallable(getFunctions(), 'createUser');
        func({
            email: '18rem8@queensu.ca',
            password: 'username12345',
            displayName: 'Reid Moffat',
        })
            .then((r) => console.log(`Success: ${JSON.stringify(r)}`))
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
                <button type="submit" onClick={signUp}>
                    Sign up
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
