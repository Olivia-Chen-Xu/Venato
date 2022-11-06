import AppRoutes from '../routes';
import { deleteAccount, signout } from './auth-functions';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const nav = useNavigate();
    const [errMsg, setErrMsg] = useState('');

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
                nav('/signin');
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

    return (
        <>
            <div>
                <text className="TopText">Venato profile</text>
                <button type="submit" className="auth-button" onClick={handleSignOut}>
                    Sign out
                </button>
                <button type="submit" className="auth-button" onClick={handleDeleteAccount}>
                    Delete account
                </button>
                {errMsg}
            </div>
            <AppRoutes />
        </>
    );
};

export default Profile;
