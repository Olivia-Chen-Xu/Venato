import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { deleteAccount, signout } from './auth-functions';
import { auth } from '../../config/firebase';
import './auth.css';

// Not in use yet
const Profile = () => {
    const navigate = useNavigate();
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
                navigate('/sign-in');
            })
            .catch((err) => console.log(`Failed to sign out: ${JSON.stringify(err)}`));
    };

    const handleDeleteAccount = () => {
        if (auth.currentUser.email === '18rem8@queensu.ca') {
            handleSignOut(); // Don't delete the admin account
            return;
        }
        const deleteAccountResult = deleteAccount();
        if (typeof deleteAccountResult === 'string') {
            setErrMsg(deleteAccountResult);
            return;
        }

        deleteAccountResult
            // eslint-disable-next-line promise/always-return
            .then(() => {
                console.log(`Current user successfully deleted`);
                navigate('/sign-up');
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
        </>
    );
};

export default Profile;
