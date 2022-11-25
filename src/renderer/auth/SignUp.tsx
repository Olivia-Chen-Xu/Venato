import { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { signup } from './auth-functions';
import { InputLabel, TextField, Button } from '@mui/material';
import { btnStyle, inputStyle } from './authStyles';
import './auth.css';

const SignUp = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');

    const handleSignup = () => {
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
                setErrMsg(
                    `Sign up success (check your email):` +
                        `\nEmail: ${JSON.stringify(r.user.email)}`
                );
                console.log(JSON.stringify(r));
                // eslint-disable-next-line promise/no-nesting
                sendEmailVerification(r.user)
                    // eslint-disable-next-line promise/always-return
                    .then(() => {
                        console.log(`Verification email sent successfully to ${r.user.email}`);
                        // This isn't an error, but I need to show the message
                        setErrMsg(
                            `Sign up success (check your email):` +
                                `\nEmail: ${JSON.stringify(r.user.email)}`
                        );
                        // navigate('/sign-in');
                    })
                    .catch((e) =>
                        console.error(`Error sending verification email to ${r.user.email}: ${e}`)
                    );
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

    return (
        <div className="AuthMainDiv" style={{ alignItems: 'flex-start ' }}>
            <text className="TopText">Sign up</text>
            <br />
            <text className="WelcomeText">Welcome!</text>
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
            <div style={{ height: 20 }}></div>
            <InputLabel>Confirm password</InputLabel>
            <TextField
                variant="outlined"
                type="password"
                placeholder="••••••••••"
                style={inputStyle}
                required
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                }}
            ></TextField>
            <Button color="neutral" variant="contained" style={btnStyle} onClick={handleSignup}>
                Sign up
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
                <p className="SwapAuthText">Already have an account?</p>
                <text className="SwapAuthTextLink" onClick={() => navigate('/sign-in')}>
                    Log in
                </text>
            </div>

            <br />
            <text style={{ color: 'red' }}>{errMsg}</text>
        </div>
    );
};

export default SignUp;
