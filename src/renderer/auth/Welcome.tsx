import { useNavigate } from 'react-router-dom';
import './auth.css';
import { useState } from 'react';
import { signin } from './auth-functions';
import { Button } from '@mui/material';
import { btnStyle } from './authStyles';

const Welcome = () => {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');

    const bypassSignIn = () => {
        const signInResult = signin('18rem8@queensu.ca', 'Username12345');
        if (typeof signInResult === 'string') {
            setErrMsg(`Error signing in to admin account: ${signInResult}`);
            return;
        }

        signInResult
            .then(() => {
                navigate('/home');
            })
            .catch((err) => {
                setErrMsg(`Error signing in to admin account: ${err}`);
            });
    };

    return (
        <div className="AuthMainDiv">
            <text className="TopText">Venato</text>
            <Button
                variant="contained"
                color="neutral"
                style={btnStyle}
                onClick={() => navigate('/sign-in')}
            >
                Log In
            </Button>

            <Button
                variant="contained"
                style={btnStyle}
                color="neutral"
                onClick={() => navigate('/sign-up')}
            >
                Sign Up
            </Button>

            <Button variant="contained" color="neutral" style={btnStyle} onClick={bypassSignIn}>
                Bypass sign-in
            </Button>
            <br />
            <text style={{ color: 'red' }}>{errMsg}</text>
        </div>
    );
};

export default Welcome;
