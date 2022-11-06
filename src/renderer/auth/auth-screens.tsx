import { useState } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import AppRoutes from 'renderer/routes';
import { deleteAccount, passwordResetEmail, signin, signout, signup } from './auth-functions';
import { auth } from '../../config/firebase';
import './auth.css';
import checkMark from '../../../assets/checkMark.png';
import warning from '../../../assets/warning.png';
import SignUp from './SignUp';
import SignIn from './SignIn';
import PasswordReset from './PasswordReset';
import Profile from './Profile';

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
    const [isSubmitted, setIsSubmitted] = useState(false);

    const clearData = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrMsg('');
    };

    const renderEmailSent = () => {
        if (!isSubmitted) {
            return <></>;
        }

        return (
            <div
                style={{
                    borderRadius: '5%',
                    outline: '2px solid lime',
                    padding: '5px',
                    verticalAlign: 'middle',
                }}
            >
                {/* The LRM is an invisible character to get the spacing right */}
                <img width="20" src={checkMark} alt="Green check mark" />‎ Email verification sent!
            </div>
        );
    };

    // Handlers for auth functions
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
                setIsSubmitted(true);
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
        signin: (
            <button type="submit" className="auth-button" onClick={handleSignIn}>
                Sign in
            </button>
        ),
        signout: (
            <button type="submit" className="auth-button" onClick={handleSignOut}>
                Sign out
            </button>
        ),
        deleteAccount: (
            <button type="submit" className="auth-button" onClick={handleDeleteAccount}>
                Delete account
            </button>
        ),
        passwordResetEmail: (
            <button type="submit" className="auth-button" onClick={handlePassReset}>
                Reset password
            </button>
        ),
    };

    // Auth pages
    const states = {
        [AuthState.Home]: (
            <div>
                <h1>Homepage (not implemented yet)</h1>
            </div>
        ),
        [AuthState.SignUp]: <SignUp />,
        [AuthState.SignIn]: (
            <SignIn />
        ),
        [AuthState.PasswordReset]: (
            <PasswordReset />
        ),
        [AuthState.Profile]: (
            <Profile />
        ),
    };

    return <div className="AuthMainDiv">{states[currState]}</div>;
};

export default AuthScreens;
