import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import { signup, signin, signout, deleteAccount, passwordResetEmail } from '../components/auth';
import { sendEmailVerification } from 'firebase/auth';

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
    const [errMsg, setErrMsg] = useState('');

    // For user inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const clearData = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrMsg('');
    };

    // Handlers for auth functions
    const handleSignup = async () => {
        if (currState === AuthState.Home) {
            setCurrState(AuthState.SignUp);
        } else {
            if (password !== confirmPassword) {
                setErrMsg('Passwords do not match');
                return;
            }

            const signupResult = signup(email, password);
            if (typeof signupResult === 'string') {
                setErrMsg(signupResult);
            } else {
                signupResult
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
                        clearData();
                        setCurrState(AuthState.Profile);
                    })
                    .catch((err) => {
                        console.log(`Error creating user: ${err}`);
                        if (err.code === 'auth/email-already-in-use') {
                            setErrMsg(
                                'The email you entered is already in use; please enter another one'
                            );
                        } else {
                            setErrMsg('Failed to create user');
                        }
                    });
            }
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
            <div>
                {buttons.signup}
                {buttons.signin}
                {buttons.passwordResetEmail}
            </div>
        ),
        [AuthState.SignUp]: (
            <div>
                <input
                    type="email"
                    value={email}
                    required
                    placeholder="Email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <br />
                <input
                    type="password"
                    value={password}
                    required
                    placeholder="Password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <br />
                <input
                    type="password"
                    value={confirmPassword}
                    required
                    placeholder="Confirm password"
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                />
                <br />
                {buttons.signup}
                <br />
                {errMsg}
            </div>
        ),
        [AuthState.SignIn]: (
            <div>
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
                <br />
                {errMsg}
            </div>
        ),
        [AuthState.PasswordReset]: (
            <div>
                {buttons.passwordResetEmail}
                <br />
                {errMsg}
            </div>
        ),
        [AuthState.Profile]: (
            <div>
                {buttons.signout}
                {buttons.deleteAccount}
                <br />
                {errMsg}
            </div>
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
