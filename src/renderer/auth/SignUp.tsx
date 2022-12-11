import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputLabel, TextField, Button } from '@mui/material';
import { signup } from './auth-functions';
import { btnStyle, inputStyle } from './authStyles';
import './auth.css';
import { getFunctions, httpsCallable } from 'firebase/functions';

const SignUp = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match');
            return;
        }

        const signupResult = await signup(email, password);
        if (typeof signupResult === 'string') {
            setErrMsg(signupResult);
        }

        // signupResult
        //     .then((r) => {
        //         console.log(
        //             `Sign up success (check your email):` +
        //                 `\nEmail: ${JSON.stringify(r.user.email)}` +
        //                 `\nID: ${JSON.stringify(r.user.uid)}`
        //         );
        //         setErrMsg(
        //             `Sign up success (check your email):` +
        //                 `\nEmail: ${JSON.stringify(r.user.email)}`
        //         );
        //         console.log(JSON.stringify(r));
        //
        //         sendEmailVerification(r.user)
        //             .then(() => {
        //                 console.log(`Verification email sent successfully to ${r.user.email}`);
        //                 // This isn't an error, but I need to show the message
        //                 setErrMsg(
        //                     `Sign up success (check your email):` +
        //                         `\nEmail: ${JSON.stringify(r.user.email)}`
        //                 );
        //                 navigate('/sign-in');
        //             })
        //             .catch((e) =>
        //                 console.error(`Error sending verification email to ${r.user.email}: ${e}`)
        //             );
        //     })
        //     .catch((err) => {
        //         console.log(`Error creating user: ${err}`);
        //         if (err.code === 'auth/email-already-in-use') {
        //             setErrMsg('The email you entered is already in use; please enter another one');
        //         } else {
        //             setErrMsg('Failed to create user');
        //         }
        //     });
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
            />
            <div style={{ height: 20 }} />
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
            />
            <div style={{ height: 20 }} />
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
            />
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

            <button
                onClick={async () => console.log(await httpsCallable(getFunctions(), 'getJobBoards')())}
            >
                Check if authenticated
            </button>

            <br />
            <text style={{ color: 'red' }}>{errMsg}</text>
        </div>
    );
};

export default SignUp;
