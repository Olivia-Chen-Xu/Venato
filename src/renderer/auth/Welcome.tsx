import { useNavigate } from 'react-router-dom';
import './auth.css';
import { useState } from 'react';
import { signin } from './auth-functions';

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
            <br />

            <button type="submit" className="auth-button" onClick={() => navigate('/sign-in')}>
                Sign In
            </button>
            <br />

            <button type="submit" className="auth-button" onClick={() => navigate('/sign-up')}>
                Sign Up
            </button>

            <button type="submit" className="auth-button" onClick={bypassSignIn}>
                Bypass sign-in
            </button>
            <br />
            {errMsg}
        </div>
    );
};

export default Welcome;
