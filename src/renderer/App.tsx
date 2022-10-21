import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import { signup, signin, signout, deleteAccount, passwordResetEmail } from '../components/auth';

const HomeScreen = () => {
    const nameStyle = { textAlign: 'center' as const }; // For the boilerplate text

    // Authentication state (used to flip between what's shown on the screen)
    enum AuthState {
        Home,
        SignUp,
        SignIn,
        PasswordReset,
        Profile,
    }
    const [currState, setCurrState] = useState(AuthState.Home);

    // For user inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handlers (and some helpers) for auth functions
    const clearData = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSignup = () => {
        if (currState === AuthState.Home) {
            setCurrState(AuthState.SignUp);
        } else if (signup(email, password)) {
            clearData();
            setCurrState(AuthState.Profile);
        }
    };

    const handleSignIn = () => {
        if (currState === AuthState.Home) {
            setCurrState(2);
        } else if (signin(email, password) === 1) {
            clearData();
            setCurrState(AuthState.Profile);
        }
    };

    const handlePassReset = () => {
        if (currState === AuthState.Home) {
            setCurrState(AuthState.PasswordReset);
        } else {
            passwordResetEmail();
            setCurrState(AuthState.Home);
        }
    };

    const handleSignOut = () => {
        if (signout() === 1) {
            setCurrState(AuthState.Home);
        }
    };

    const handleDeleteAccount = () => {
        if (deleteAccount() === 1) {
            setCurrState(AuthState.Home);
        }
    };

    // Buttons to be used with auth
    const buttons = {
        signup: (
            <button type="submit" onClick={handleSignup}>
                Sign up
            </button>
        ),
        signin: (
            <button type="submit" onClick={handleSignIn}>
                Sign in
            </button>
        ),
        signout: (
            <button type="submit" onClick={handleSignOut}>
                Sign out
            </button>
        ),
        deleteAccount: (
            <button type="submit" onClick={handleDeleteAccount}>
                Delete account
            </button>
        ),
        passwordResetEmail: (
            <button type="submit" onClick={handlePassReset}>
                Reset password
            </button>
        ),
    };

    // JSX states
    const states = {
        [AuthState.Home]: (
            <>
                {buttons.signup}
                {buttons.signin}
                {buttons.passwordResetEmail}
            </>
        ),
        [AuthState.SignUp]: (
            <>
                <input
                    type="email"
                    value={email}
                    required
                    placeholder="Email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    type="password"
                    value={password}
                    required
                    placeholder="Password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                {buttons.signup}
            </>
        ),
        [AuthState.SignIn]: (
            <>
                <input
                    type="email"
                    value={email}
                    required
                    placeholder="Email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    type="password"
                    value={password}
                    required
                    placeholder="Password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                {buttons.signin}
            </>
        ),
        [AuthState.PasswordReset]: <>{buttons.passwordResetEmail}</>,
        [AuthState.Profile]: (
            <>
                {buttons.signout}
                {buttons.deleteAccount}
            </>
        ),
    };

    return (
        <div>
            <div className="Hello">
                <img width="200" alt="icon" src={icon} />
            </div>
            <h1 style={nameStyle}>electron-react-boilerplate</h1>
            <div className="Hello">{states[currState]}</div>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
            </Routes>
        </Router>
    );
}
