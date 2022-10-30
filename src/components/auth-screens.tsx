import { useState } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { deleteAccount, passwordResetEmail, signin, signout, signup } from './auth-functions';
import { auth } from '../config/firebase';
import './auth.css';

const AuthScreens = () => {
    // Authentication state (used to flip between what's shown on the screen)
    enum AuthState {
        Home,
        SignUp,
        SignIn,
        PasswordReset,
        Profile,
    }

    const [currState, setCurrState] = useState(AuthState.SignUp);
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
        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match');
            return;
        }

        const signupResult = signup(email, password);
        if (typeof signupResult === 'string') {
            setErrMsg(signupResult);
            return;
        }

        signupResult
            // eslint-disable-next-line promise/always-return
            .then((r) => {
                console.log(
                    `Sign up success (check your email):` +
                        `\nEmail: ${JSON.stringify(r.user.email)}` +
                        `\nID: ${JSON.stringify(r.user.uid)}`
                );
                console.log(JSON.stringify(r));
                // eslint-disable-next-line promise/no-nesting
                sendEmailVerification(r.user)
                    // eslint-disable-next-line promise/always-return
                    .then(() => {
                        console.log(`Verification email sent successfully to ${r.user.email}`);
                        // This isn't an error, but I need to show the message
                        setErrMsg(`Please check your email`);
                        setCurrState(AuthState.SignIn);
                    })
                    .catch((e) =>
                        console.error(`Error sending verification email to ${r.user.email}: ${e}`)
                    );
                clearData();
            })
            .catch((err) => {
                console.log(`Error creating user: ${err}`);
                if (err.code === 'auth/email-already-in-use') {
                    setErrMsg('The email you entered is already in use; please enter another one');
                } else {
                    setErrMsg('Failed to create user');
                }
            });
    };

    const handleSignIn = () => {
        const signInResult = signin(email, password);
        if (typeof signInResult === 'string') {
            setErrMsg(signInResult);
            return;
        }

        signInResult
            .then((r) => {
                console.log(JSON.stringify(r));
                // eslint-disable-next-line promise/always-return
                if (!r.user.emailVerified) {
                    setErrMsg('You need to verify your email first');
                    signOut(auth);
                } else {
                    console.log(`Successfully signed in user: ${email}, ${password}`);
                    clearData();
                    setCurrState(AuthState.Profile);
                }
            })
            .catch((err) => {
                console.log(`Error signing in: ${JSON.stringify(err)}`);
                if (
                    err.code === 'auth/user-not-found' ||
                    err.code === 'auth/invalid-password' ||
                    err.code === 'auth/wrong-password'
                ) {
                    setErrMsg(`Error: account ${email} does not exist or password is incorrect`);
                } else {
                    setErrMsg(`Failed to sign in, error: ${JSON.stringify(err)}`);
                }
            });
    };

    const handlePassReset = () => {
        const passResetResult = passwordResetEmail(email);
        if (typeof passResetResult === 'string') {
            setErrMsg(passResetResult);
            return;
        }

        passResetResult
            // eslint-disable-next-line promise/always-return
            .then(() => {
                console.log(`Password reset email sent to ${email}`);

                // This isn't an error, but I need to show the message
                setErrMsg(`Password reset email sent!`);
            })
            .catch((e) => {
                if (e.code === 'auth/user-not-found') {
                    // When signing up, we have to tell the user if the email is in use
                    // so there is no point in hiding it here (also makes it harder)
                    setErrMsg(`No email found, make sure you typed it in correctly`);
                } else {
                    console.log(`Error sending password reset email to ${email}: ${e}`);
                    setErrMsg(`Error sending password reset email to ${email}`);
                }
            });
    };

    const handleSignOut = () => {
        const signoutResult = signout();
        if (typeof signoutResult === 'string') {
            setErrMsg(signoutResult);
            return;
        }
        signoutResult
            // eslint-disable-next-line promise/always-return
            .then(() => {
                console.log(`Successfully signed out`);
                setCurrState(AuthState.SignIn);
            })
            .catch((err) => console.log(`Failed to sign out: ${JSON.stringify(err)}`));
    };

    const handleDeleteAccount = () => {
        const deleteAccountResult = deleteAccount();
        if (typeof deleteAccountResult === 'string') {
            setErrMsg(deleteAccountResult);
            return;
        }
        deleteAccountResult
            // eslint-disable-next-line promise/always-return
            .then(() => {
                console.log(`Current user successfully deleted`);
                setCurrState(AuthState.SignUp);
            })
            .catch((error) => console.log(`Error deleting current user: ${JSON.stringify(error)}`));
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
                Sign; out
            </button>
        ),
        deleteAccount: (
            <button type="submit" onClick={handleDeleteAccount}>
                Delete; account
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
                <h1>Homepage (not implemented yet)</h1>
            </div>
        ),
        [AuthState.SignUp]: (
            <div className="AuthMainDiv">
                <text className="TopText">
                    <strong>Sign up</strong>
                </text>
                <br />
                <text className="WelcomeText">Welcome!</text>
                <br />

                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        className="InputForms"
                        type="email"
                        name="email"
                        value={email}
                        placeholder="test@test.com"
                        required
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        className="InputForms"
                        type="password"
                        name="password"
                        value={password}
                        placeholder="••••••••••"
                        required
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="passwordconfirm">Confirm password</label>
                    <input
                        className="InputForms"
                        type="password"
                        name="passwordconfirm"
                        value={confirmPassword}
                        placeholder="••••••••••"
                        required
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                    />
                </div>

                <br />
                {buttons.signup}
                <br />
                <p className="SwapAuthTextLeft">
                    Already have an account?
                    <span className="SwapAuthTextLink">Sign in</span>
                </p>
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

    return <div>{states[currState]}</div>;
};

export default AuthScreens;
