import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { signup, signin, signout, deleteAccount } from '../components/auth';

const Hello = () => {
    const nameStyle = { textAlign: 'center' as const };
    return (
        <div>
            <div className="Hello">
                <img width="200" alt="icon" src={icon} />
            </div>
            <h1 style={nameStyle}>electron-react-boilerplate</h1>
            <div className="Hello">
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
