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



    // Handlers for auth functions








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
        [AuthState.SignIn]: <SignIn />,
        [AuthState.PasswordReset]: <PasswordReset />,
        [AuthState.Profile]: <Profile />,
    };

    return <div className="AuthMainDiv">{states[currState]}</div>;
};

export default AuthScreens;
