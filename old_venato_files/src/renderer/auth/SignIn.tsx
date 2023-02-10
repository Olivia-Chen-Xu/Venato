import { useNavigate } from 'react-router-dom';
import './auth.css';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { signin } from './auth-functions';
import { auth } from '../../config/firebase';
import { InputLabel, TextField, Button } from '@mui/material';
import { btnStyle, inputStyle } from './authStyles';

const SignIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPW, setShowPW] = useState(false);
    const [errMsg, setErrMsg] = useState('');

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
                    // clearData();
                    navigate('/home');
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

    return (
        <div className="AuthMainDiv" style={{ alignItems: 'flex-start ' }}>
            <text className="TopText">Log in</text>
            <br />
            <text className="WelcomeText">Welcome back.</text>
            <br />
            <InputLabel>Email</InputLabel>
            <TextField
                variant="outlined"
                placeholder="john.smith@gmail.com"
                style={inputStyle}
                required
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            ></TextField>
            <div style={{ height: 20 }}></div>
            <InputLabel>Password</InputLabel>
            <TextField
                variant="outlined"
                type="password"
                placeholder="••••••••••"
                style={inputStyle}
                required
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            ></TextField>

            <p
                style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    float: 'right',
                    textDecorationLine: 'underline',
                    fontStyle: 'italic',
                    color: '#676767',
                    alignSelf: 'flex-end',
                }}
            >
                <text style={{ cursor: 'pointer' }} onClick={() => navigate('/password-reset')}>
                    Forgot your password?
                </text>
            </p>

            <br />
            <Button color="neutral" variant="contained" style={btnStyle} onClick={handleSignIn}>
                Log in
            </Button>
            <br />
            <div
                style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    display: 'flex',
                    width: '100%',
                }}
            >
                <p className="SwapAuthText">Don't have an account?</p>
                <text className="SwapAuthTextLink" onClick={() => navigate('/sign-up')}>
                    Sign up
                </text>
            </div>
            <br />
            <text style={{ color: 'red' }}>{errMsg}</text>
        </div>
    );
};

export default SignIn;
