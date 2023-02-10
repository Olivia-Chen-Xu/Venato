import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { deleteAccount, signout } from './auth-functions';
import { auth } from '../../config/firebase';
import { InputLabel, TextField, Button } from '@mui/material';
import { btnStyle, inputStyle } from './authStyles';
import './auth.css';
import generateJobs from "../search/GenerateJobs";

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
                navigate('/');
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
                navigate('/');
            })
            .catch((error) => console.log(`Error deleting current user: ${JSON.stringify(error)}`));
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 400,
                padding: 20,
            }}
        >
            <text style={{ fontSize: 32, fontWeight: 'regular' }}>Venato profile</text>
            <br />
            <Button
                color="neutral"
                variant="contained"
                style={{ width: 200 }}
                onClick={handleSignOut}
            >
                Sign out
            </Button>

            {/* <button type="submit" className="auth-button" onClick={handleDeleteAccount}>
                    Delete account
                </button> */}

            {/* TEMPORARY */}
            <br />
            <Button
                color="neutral"
                variant="contained"
                style={{ width: 200 }}
                onClick={handleSignOut}
            >
                Delete account
            </Button>
            <Button variant="contained" color="neutral" style={btnStyle} onClick={() => {generateJobs(40)}}>
                Generate jobs
            </Button>
            <text style={{ color: 'red' }}>{errMsg}</text>
        </div>
    );
};

export default Profile;
