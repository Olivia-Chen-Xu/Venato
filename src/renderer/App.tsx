import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import { signup, signin, signout, deleteAccount, passwordResetEmail } from '../components/auth';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';

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
        // If you're already signed in, go straight to profile
        if (auth.currentUser) {
            setCurrState(AuthState.Profile);
        }

        if (currState === AuthState.Home || currState === AuthState.PasswordReset) {
            setCurrState(AuthState.SignIn);
        } else {
            const signInResult = signin(email, password);
            if (typeof signInResult === 'string') {
                setErrMsg(signInResult);
                return;
            }

            signInResult
                .then((r) => {
                    console.log(`Successfully signed in user: ${email}, ${password}`);
                    clearData();
                    setCurrState(AuthState.Profile);
                })
                .catch((err) => {
                    console.log(`Error creating user: ${JSON.stringify(err)}`);
                    if (
                        err.code === 'auth/user-not-found' ||
                        err.code === 'auth/invalid-password' ||
                        err.code === 'auth/wrong-password'
                    ) {
                        setErrMsg(
                            `Error: account ${email} does not exist or password is incorrect`
                        );
                    } else {
                        setErrMsg(`Failed to sign in, error: ${JSON.stringify(err)}`);
                    }
                });
        }
    };

    const handlePassReset = () => {
        if (currState === AuthState.Home) {
            setCurrState(AuthState.PasswordReset);
        } else {
            const passResetResult = passwordResetEmail(email);
            if (typeof passResetResult === 'string') {
                setErrMsg(passResetResult);
                return;
            }

            passResetResult
                .then(() => {
                    console.log(`Password reset email sent to ${email}`);
                    setErrMsg(`Password reset email sent!`); // This isn't an error, but I need to show the message
                })
                .catch((e) => {
                    console.log(`Error sending password reset email to ${email}: ${e}`);
                    setErrMsg(`Error sending password reset email to ${email}`);
                });
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

    const handleGoBack = () => {
        setCurrState(AuthState.Home);
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
        back: (
            <button type="submit" onClick={handleGoBack}>
                Go back
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
                {buttons.back}
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
                {buttons.signin}
                {buttons.back}
                <br />
                {errMsg}
            </div>
        ),
        [AuthState.PasswordReset]: (
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
                {buttons.passwordResetEmail}
                <br />
                {buttons.signin}
                {buttons.back}
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
